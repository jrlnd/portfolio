import { useCallback, useEffect, useRef, useState } from "react";
import ChatPanel from "./ChatPanel";
import Sidebar from "./Sidebar";
import { buildPresets } from "./presets";
import {
  loadActiveId,
  loadSessions,
  newSession,
  saveActiveId,
  saveSessions,
  titleFromMessage,
  type Message,
  type Session,
} from "./sessions";

interface Props {
  name: string;
}

const RATE_LIMIT_SENTINEL_RE = /\[\[__RATE_LIMITED__:(\d+)\]\]/;
const ERROR_SENTINEL_RE = /\[\[__JR_ERROR__:([^\]]+)\]\]/;

export default function ChatApp({ name }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const abortRef = useRef<AbortController | null>(null);
  // Track the user's desktop preference separately so mobile breakpoints
  // don't overwrite it — switching down to mobile force-closes, switching
  // back up restores whatever they last had on desktop.
  const isDesktopRef = useRef(true);
  const lastDesktopOpenRef = useRef(true);

  const updateSidebar = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setSidebarOpen((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        if (isDesktopRef.current) lastDesktopOpenRef.current = value;
        return value;
      });
    },
    [],
  );

  useEffect(() => {
    const loaded = loadSessions();
    const storedActive = loadActiveId();
    if (loaded.length === 0) {
      const presets = buildPresets();
      setSessions(presets);
      setActiveId(presets[0].id);
    } else {
      // Pin any empty "New chat" to the top.
      const emptyIdx = loaded.findIndex(
        (s) => s.messages.length === 0 && s.title === "New chat",
      );
      const normalized =
        emptyIdx > 0
          ? [loaded[emptyIdx], ...loaded.filter((_, i) => i !== emptyIdx)]
          : loaded;
      setSessions(normalized);
      setActiveId(
        normalized.find((s) => s.id === storedActive)?.id ?? normalized[0].id,
      );
    }
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    isDesktopRef.current = isDesktop;
    lastDesktopOpenRef.current = isDesktop;
    setSidebarOpen(isDesktop);
    setHydrated(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    function handleChange(e: MediaQueryListEvent) {
      if (e.matches) {
        // Now desktop: restore last desktop state.
        isDesktopRef.current = true;
        setSidebarOpen(lastDesktopOpenRef.current);
      } else {
        // Now mobile: force-close. Desktop preference is preserved in
        // lastDesktopOpenRef from the last desktop interaction.
        isDesktopRef.current = false;
        setSidebarOpen(false);
      }
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (hydrated) saveSessions(sessions);
  }, [sessions, hydrated]);

  useEffect(() => {
    if (hydrated && activeId) saveActiveId(activeId);
  }, [activeId, hydrated]);

  // Tick the clock while rate-limited so the countdown re-renders.
  useEffect(() => {
    if (!rateLimitedUntil || rateLimitedUntil <= Date.now()) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [rateLimitedUntil]);

  const isRateLimited = rateLimitedUntil != null && now < rateLimitedUntil;
  const rateLimitSecondsLeft = isRateLimited
    ? Math.max(0, Math.ceil((rateLimitedUntil! - now) / 1000))
    : 0;

  const active = sessions.find((s) => s.id === activeId) ?? null;

  const handleNew = useCallback(() => {
    if (!isDesktopRef.current) updateSidebar(false);
    setSessions((prev) => {
      const existing = prev.find(
        (s) => s.messages.length === 0 && s.title === "New chat",
      );
      if (existing) {
        if (activeId !== existing.id) {
          abortRef.current?.abort();
          setActiveId(existing.id);
          setIsStreaming(false);
        }
        return prev;
      }
      abortRef.current?.abort();
      const fresh = newSession();
      setActiveId(fresh.id);
      setIsStreaming(false);
      return [fresh, ...prev];
    });
  }, [activeId, updateSidebar]);

  const handleSelect = useCallback(
    (id: string) => {
      if (!isDesktopRef.current) updateSidebar(false);
      if (id === activeId) return;
      abortRef.current?.abort();
      setActiveId(id);
      setIsStreaming(false);
    },
    [activeId, updateSidebar],
  );

  const handleRename = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s)),
    );
  }, []);

  const handleClearAll = useCallback(() => {
    abortRef.current?.abort();
    const presets = buildPresets();
    setSessions(presets);
    setActiveId(presets[0].id);
    setIsStreaming(false);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      abortRef.current?.abort();
      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== id);
        if (remaining.length === 0) {
          const fresh = newSession();
          setActiveId(fresh.id);
          return [fresh];
        }
        if (id === activeId) {
          setActiveId(remaining[0].id);
        }
        return remaining;
      });
    },
    [activeId],
  );

  const popLastTwo = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, messages: s.messages.slice(0, -2), updatedAt: Date.now() }
          : s,
      ),
    );
  }, []);

  const handleSend = useCallback(
    async (text: string, isRetry = false) => {
      if (!active || isStreaming || isRateLimited) return;

      const userMsg: Message = { role: "user", content: text };
      const placeholder: Message = { role: "assistant", content: "" };
      const updatedAt = Date.now();
      const nextTitle =
        active.title === "New chat" && active.messages.length === 0
          ? titleFromMessage(text)
          : active.title;

      // On retry: replace the last (errored) assistant message with a fresh
      // placeholder. Don't add a duplicate user message.
      const baseMessages = isRetry
        ? active.messages.slice(0, -1)
        : [...active.messages, userMsg];

      setSessions((prev) =>
        prev.map((s) =>
          s.id === active.id
            ? {
                ...s,
                title: nextTitle,
                messages: [...baseMessages, placeholder],
                updatedAt,
              }
            : s,
        ),
      );
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const sessionId = active.id;

      // Filter out empty content + error markers (e.g. stale placeholders from
      // aborted streams, prior error reports) and trim to what the server accepts.
      const MAX_HISTORY = 40;
      const MAX_CHARS = 8000;
      const history = baseMessages
        .filter((m) => m.content.length > 0 && !m.isError)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, MAX_CHARS),
        }))
        .slice(-MAX_HISTORY);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get("Retry-After") ?? "60", 10);
          setRateLimitedUntil(Date.now() + retryAfter * 1000);
          popLastTwo(sessionId);
          return;
        }

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          throw new Error(errText || `Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        let rateLimitHit = false;
        let errorHit = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });

          const rateMatch = acc.match(RATE_LIMIT_SENTINEL_RE);
          if (rateMatch) {
            const retryAfter = parseInt(rateMatch[1], 10);
            setRateLimitedUntil(Date.now() + retryAfter * 1000);
            rateLimitHit = true;
            reader.cancel().catch(() => undefined);
            break;
          }

          const errMatch = acc.match(ERROR_SENTINEL_RE);
          if (errMatch) {
            const friendly = errMatch[1];
            errorHit = true;
            reader.cancel().catch(() => undefined);
            setSessions((prev) =>
              prev.map((s) => {
                if (s.id !== sessionId) return s;
                const msgs = s.messages.slice();
                msgs[msgs.length - 1] = {
                  role: "assistant",
                  content: friendly,
                  isError: true,
                };
                return { ...s, messages: msgs, updatedAt: Date.now() };
              }),
            );
            break;
          }

          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== sessionId) return s;
              const msgs = s.messages.slice();
              msgs[msgs.length - 1] = { role: "assistant", content: acc };
              return { ...s, messages: msgs, updatedAt: Date.now() };
            }),
          );
        }

        if (rateLimitHit) {
          popLastTwo(sessionId);
        }
        // For errorHit, we deliberately keep the error message visible so the
        // user can see what happened and retry — handled by isError + UI.
        void errorHit;
      } catch (e) {
        if (controller.signal.aborted) {
          // User navigated away mid-stream. Convert the empty placeholder to
          // a cancellation error (so the existing retry UI is available); if
          // any content streamed before the abort, leave it as a completed
          // message instead of overwriting partial output.
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id !== sessionId) return s;
              const msgs = s.messages.slice();
              const last = msgs[msgs.length - 1];
              if (last && last.role === "assistant" && !last.content) {
                msgs[msgs.length - 1] = {
                  role: "assistant",
                  content: "Response cancelled.",
                  isError: true,
                };
              }
              return { ...s, messages: msgs, updatedAt: Date.now() };
            }),
          );
          return;
        }
        const msg =
          e instanceof Error && e.message
            ? "Couldn't reach the server. Please check your connection and try again."
            : "Something went wrong. Try again in a moment.";
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sessionId) return s;
            const msgs = s.messages.slice();
            msgs[msgs.length - 1] = {
              role: "assistant",
              content: msg,
              isError: true,
            };
            return { ...s, messages: msgs, updatedAt: Date.now() };
          }),
        );
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [active, isStreaming, isRateLimited, popLastTwo],
  );

  const handleRetry = useCallback(() => {
    if (!active || isStreaming || isRateLimited) return;
    const last = active.messages[active.messages.length - 1];
    const prev = active.messages[active.messages.length - 2];
    if (!last?.isError || !prev || prev.role !== "user") return;
    handleSend(prev.content, true);
  }, [active, isStreaming, isRateLimited, handleSend]);

  const handleReorder = useCallback((srcId: string, dstId: string) => {
    setSessions((prev) => {
      const srcIdx = prev.findIndex((s) => s.id === srcId);
      const dstIdx = prev.findIndex((s) => s.id === dstId);
      if (srcIdx === -1 || dstIdx === -1 || srcIdx === dstIdx) return prev;
      const isEmpty = (s: Session) =>
        s.messages.length === 0 && s.title === "New chat";
      // The empty "New chat" is pinned to the top — block dragging it,
      // and block dropping above it when it's the first row.
      if (isEmpty(prev[srcIdx])) return prev;
      const next = prev.slice();
      const [item] = next.splice(srcIdx, 1);
      let insertAt = srcIdx < dstIdx ? dstIdx - 1 : dstIdx;
      if (insertAt === 0 && next.length > 0 && isEmpty(next[0])) {
        insertAt = 1;
      }
      next.splice(insertAt, 0, item);
      return next;
    });
  }, []);

  return (
    <div className="relative flex h-[100dvh] overflow-hidden bg-sidebar text-fg">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onRename={handleRename}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
        onReorder={handleReorder}
        isOpen={sidebarOpen}
        hydrated={hydrated}
        onClose={() => updateSidebar(false)}
      />

      <button
        type="button"
        onClick={() => updateSidebar((o) => !o)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        className="squircle absolute left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-retro-ink bg-sidebar text-fg shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-100 hover:bg-chat active:translate-x-[2px] active:translate-y-[2px] active:shadow-none md:left-3.5 md:top-3.5"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </button>

      <main
        className={[
          "squircle chat-card relative flex min-w-0 flex-1 flex-col overflow-hidden bg-bg",
          hydrated
            ? `transition-all duration-300 ease-[var(--ease-out-expo)] ${
                sidebarOpen
                  ? "md:my-2.5 md:ml-72 md:mr-2.5 md:rounded-2xl md:border-2 md:border-sidebar-dark md:shadow-[4px_4px_0_var(--color-sidebar-dark)]"
                  : "ml-0"
              }`
            : "ml-0 md:my-2.5 md:ml-72 md:mr-2.5 md:rounded-2xl md:border-2 md:border-sidebar-dark md:shadow-[4px_4px_0_var(--color-sidebar-dark)]",
        ].join(" ")}
      >
        <ChatPanel
          name={name}
          sessionId={active?.id ?? null}
          messages={active?.messages ?? []}
          isStreaming={isStreaming}
          isRateLimited={isRateLimited}
          rateLimitSecondsLeft={rateLimitSecondsLeft}
          onSend={handleSend}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
}
