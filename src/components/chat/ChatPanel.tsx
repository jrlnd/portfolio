import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AssistantMessage from "./AssistantMessage";
import ContactButton from "./ContactButton";
import JasperButton from "./JasperButton";
import ResumeButton from "./ResumeButton";
import type {
  ContactCardData,
  ExperienceCardData,
  Message,
  ProjectCardData,
} from "./sessions";

const STARTERS = [
  "What does JR do?",
  "What's JR's tech stack?",
  "Tell me about a recent project.",
  "How do I get in touch?",
];

interface Props {
  name: string;
  sessionId: string | null;
  messages: Message[];
  isStreaming: boolean;
  isRateLimited: boolean;
  rateLimitSecondsLeft: number;
  onSend: (text: string) => void;
  onRetry: () => void;
}

export default function ChatPanel({
  name,
  sessionId,
  messages,
  isStreaming,
  isRateLimited,
  rateLimitSecondsLeft,
  onSend,
  onRetry,
}: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevMessageCountRef = useRef(messages.length);
  const lastSessionIdRef = useRef<string | null>(null);
  const visitedSessionsRef = useRef<Set<string>>(new Set());
  const scrollPositionsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !sessionId) return;

    // Session switched: first visit → scroll to top, revisit → restore the
    // position the user was last at in that session.
    if (lastSessionIdRef.current !== sessionId) {
      lastSessionIdRef.current = sessionId;
      prevMessageCountRef.current = messages.length;
      const firstVisit = !visitedSessionsRef.current.has(sessionId);
      visitedSessionsRef.current.add(sessionId);
      el.scrollTo({
        top: firstVisit ? 0 : (scrollPositionsRef.current.get(sessionId) ?? 0),
        behavior: "instant",
      });
      return;
    }

    // Same session, message list changed. Smooth-scroll only when a new
    // message lands; instant-snap during streaming updates so back-to-back
    // chunks don't trigger overlapping smooth-scrolls.
    const isNewMessage = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: isNewMessage ? "smooth" : "instant",
    });
  }, [sessionId, messages]);

  // Track the user's scroll position per session so it can be restored on
  // revisit. The listener is keyed to `sessionId` so each session gets a
  // fresh closure with the right id.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !sessionId) return;
    const handler = () => {
      scrollPositionsRef.current.set(sessionId, el.scrollTop);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [sessionId]);

  useEffect(() => {
    if (isStreaming) return;
    // Skip on mobile — auto-focusing the textarea pops the soft keyboard,
    // which is intrusive when the user just tapped a chat tab to read it.
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    inputRef.current?.focus();
  }, [isStreaming, messages.length]);

  // Auto-resize the textarea so it grows with content between min and max
  // heights (set via CSS). Reset to 'auto' first to allow shrinking, then
  // size to scrollHeight; min-h / max-h utilities bound the final value.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || isRateLimited) return;
    onSend(trimmed);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }

  const empty = messages.length === 0;
  const lastIndex = messages.length - 1;

  return (
    <div className="relative flex h-full flex-col">
      <div ref={scrollRef} className="scrollbar-retro flex-1 overflow-y-auto scroll-smooth">
        <div className="mx-auto max-w-3xl px-3 pb-44 pt-16 sm:px-4">
          {empty ? (
            <div className="flex min-h-[60dvh] animate-fade-in flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-black uppercase tracking-wide text-white sm:text-5xl [-webkit-text-stroke:3px_var(--color-retro-ink)] [paint-order:stroke_fill] [text-shadow:4px_4px_0_var(--color-retro-ink)]">
                Ask me about <span className="text-[#e63946] dark:text-[#ff5959]">{name}</span>
              </h1>
              <p className="mt-3 max-w-md text-muted">
                I'm an AI assistant briefed on {name}'s work, skills, and
                experience. Try one of these, or ask your own question.
              </p>
              <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                {STARTERS.map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    style={{ animationDelay: `${80 + idx * 60}ms` }}
                    className="squircle animate-message-in rounded-md border-2 border-retro-ink bg-subtle px-4 py-3 text-left text-sm text-fg shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-100 hover:bg-bg active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul key={sessionId ?? "empty"} className="flex flex-col gap-6">
              {messages.map((m, i) => (
                <li
                  key={i}
                  className={`flex animate-message-in ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "user" ? (
                    <div className="squircle max-w-[85%] rounded-2xl border-2 border-retro-ink bg-accent/15 px-4 py-2.5 text-fg shadow-[3px_3px_0_var(--color-retro-ink)] dark:bg-accent/45">
                      {m.content}
                    </div>
                  ) : m.isError ? (
                    <div
                      role="alert"
                      className="squircle max-w-[85%] rounded-2xl border-2 border-retro-ink bg-accent/5 px-4 py-3 text-sm shadow-[3px_3px_0_var(--color-retro-ink)] dark:bg-accent/25"
                    >
                      <div className="flex items-start gap-2">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        >
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        </svg>
                        <div className="flex-1 space-y-2">
                          <p className="text-fg">{m.content}</p>
                          <button
                            type="button"
                            onClick={onRetry}
                            disabled={isStreaming || isRateLimited}
                            className="text-xs font-medium text-accent underline-offset-2 transition-colors hover:underline disabled:opacity-50"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : m.contacts ? (
                    <ContactCards cards={m.contacts} />
                  ) : m.project ? (
                    <ProjectCard project={m.project} />
                  ) : m.experience ? (
                    <ExperienceCard exp={m.experience} />
                  ) : m.bubbled ? (
                    <div className="squircle max-w-[85%] rounded-2xl border-2 border-retro-ink bg-sidebar px-4 py-3 text-fg shadow-[3px_3px_0_var(--color-retro-ink)]">
                      <AssistantMessage
                        content={m.content}
                        isStreaming={false}
                        animate={false}
                        inBubble
                      />
                    </div>
                  ) : (
                    <AssistantMessage
                      content={m.content}
                      isStreaming={isStreaming && i === lastIndex}
                      animate={i === lastIndex}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Soft top fade so scrolled messages don't abruptly meet the panel's
          top edge. Only when there are messages — empty state doesn't need it. */}
      {!empty && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-[12px] top-0 h-12 bg-gradient-to-b from-bg to-transparent md:rounded-tl-2xl"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-[12px] h-3 bg-bg md:rounded-bl-2xl sm:h-4"
      />

      <form
        onSubmit={handleSubmit}
        className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          {isRateLimited && (
            <div
              role="status"
              aria-live="polite"
              className="mb-2 flex items-center justify-between gap-3 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-fg animate-fade-in backdrop-blur-xl dark:border-accent/75 dark:bg-accent/30"
            >
              <span>
                Rate limit reached. The chat is paused while we wait for the API
                to reset.
              </span>
              <span
                aria-label={`${rateLimitSecondsLeft} seconds remaining`}
                className="shrink-0 rounded-full bg-bg/70 px-2 py-0.5 font-mono text-xs tabular-nums text-muted backdrop-blur-sm"
              >
                {rateLimitSecondsLeft}s
              </span>
            </div>
          )}
          <div className="squircle flex flex-col gap-2 rounded-2xl border-2 border-retro-ink bg-white/25 pb-2 pl-3 pr-4 pt-2 dark:bg-sidebar/45 shadow-[3px_3px_0_var(--color-retro-ink)] backdrop-blur-[10px] sm:px-4">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                isRateLimited
                  ? `Paused — try again in ${rateLimitSecondsLeft}s`
                  : `Ask about ${name}...`
              }
              disabled={isStreaming || isRateLimited}
              className="scrollbar-retro max-h-48 w-full resize-none bg-transparent text-base text-fg placeholder:text-muted focus:outline-none disabled:opacity-50"
            />
            <div className="flex items-end justify-between gap-3">
              <div className="-ml-2.5 flex translate-y-0.5 items-center gap-1">
                <JasperButton />
                <ResumeButton />
                <ContactButton />
              </div>
              <button
                type="submit"
                disabled={isStreaming || isRateLimited || !input.trim()}
                aria-label="Send message"
                className="squircle -mr-1.5 shrink-0 rounded-full border-2 border-retro-ink bg-accent p-1.5 text-on-accent shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-100 hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-30 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[2px_2px_0_var(--color-retro-ink)]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function ExperienceCard({ exp }: { exp: ExperienceCardData }) {
  const baseClass =
    "squircle block max-w-[85%] overflow-hidden rounded-2xl border-2 border-retro-ink bg-[#f5f1e8] text-fg shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-200 dark:bg-[#43444b]";
  const linkClass =
    "group/card no-underline hover:border-accent hover:bg-bg hover:shadow-[3px_3px_0_var(--color-accent)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

  const content = (
    <>
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3 text-xs uppercase tracking-wide text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon />
          {exp.dates}
        </span>
        {exp.location && (
          <span className="inline-flex items-center gap-1.5">
            <PinIcon />
            {exp.location}
          </span>
        )}
      </div>
      <div
        aria-hidden="true"
        className={
          exp.companyUrl
            ? "h-px bg-retro-ink transition-colors duration-200 group-hover/card:bg-accent"
            : "h-px bg-retro-ink"
        }
      />
      <div className="px-4 pb-3 pt-2">
        <div className="leading-tight">
          <div className="text-xl font-black tracking-wide text-white [-webkit-text-stroke:2px_var(--color-retro-ink)] [paint-order:stroke_fill] [text-shadow:2px_2px_0_var(--color-retro-ink)]">
            {exp.role}
          </div>
          <div className="text-sm">
            {exp.companyUrl ? (
              <span className="inline-flex items-center gap-1 text-muted transition-colors duration-200 group-hover/card:text-accent">
                {exp.company}
                <ExternalLinkIcon className="transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
              </span>
            ) : (
              <span className="text-muted">{exp.company}</span>
            )}
          </div>
        </div>
        <div className="pt-2">
          <AssistantMessage
            content={exp.narrative}
            isStreaming={false}
            animate={false}
            inBubble
          />
        </div>
        {exp.skills && exp.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {exp.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-md border border-retro-ink bg-bg px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fg"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (exp.companyUrl) {
    return (
      <a
        href={exp.companyUrl}
        target="_blank"
        rel="noreferrer"
        className={`${baseClass} ${linkClass}`}
      >
        {content}
      </a>
    );
  }
  return <div className={baseClass}>{content}</div>;
}

function ContactCards({ cards }: { cards: ContactCardData[] }) {
  const cardClass =
    "squircle flex aspect-square w-[128px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-retro-ink bg-[#f5f1e8] px-3 py-3 text-fg no-underline shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-200 hover:border-accent hover:bg-bg hover:shadow-[3px_3px_0_var(--color-accent)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none dark:bg-[#43444b]";

  return (
    <div className="flex w-full max-w-[85%] flex-wrap gap-2">
      {cards.map((c) => {
        const inner = (
          <>
            <ContactIcon kind={c.kind} />
            <div className="w-full text-center leading-tight">
              <div className="text-sm font-semibold text-fg">{c.label}</div>
              {c.handle && (
                <div className="mt-0.5 truncate text-[10px] text-muted">
                  {c.handle}
                </div>
              )}
            </div>
          </>
        );

        if (c.kind === "email") {
          return (
            <ContactButton
              key={c.kind + c.url}
              triggerClassName={cardClass}
              triggerContent={inner}
              triggerAriaLabel={`${c.label} options`}
            />
          );
        }
        if (c.kind === "resume") {
          return (
            <ResumeButton
              key={c.kind + c.url}
              triggerClassName={cardClass}
              triggerContent={inner}
              triggerAriaLabel={`${c.label} options`}
            />
          );
        }
        return (
          <a
            key={c.kind + c.url}
            href={c.url}
            target={c.url.startsWith("http") ? "_blank" : undefined}
            rel={c.url.startsWith("http") ? "noreferrer" : undefined}
            className={cardClass}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}

function ContactIcon({ kind }: { kind: ContactCardData["kind"] }) {
  const common = "h-7 w-7 shrink-0";
  switch (kind) {
    case "email":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={common}
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={common}
        >
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "github":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={common}
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.05c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.05.77 2.12v3.14c0 .31.2.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
      );
    case "resume":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={common}
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
          <line x1="8" y1="9" x2="10" y2="9" />
        </svg>
      );
  }
}

function ProjectCard({ project }: { project: ProjectCardData }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const sourceImgRef = useRef<HTMLImageElement>(null);
  const baseClass =
    "squircle block max-w-[85%] overflow-hidden rounded-2xl border-2 border-retro-ink bg-[#f5f1e8] text-fg shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-200 dark:bg-[#43444b]";
  const linkClass =
    "group/card no-underline hover:border-accent hover:bg-bg hover:shadow-[3px_3px_0_var(--color-accent)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

  function openLightbox() {
    if (sourceImgRef.current) {
      setSourceRect(sourceImgRef.current.getBoundingClientRect());
      sourceImgRef.current.style.visibility = "hidden";
    }
    setLightboxOpen(true);
  }

  function closeLightbox() {
    // The lightbox's own animation has already completed by the time it
    // calls back. Unmount and restore the source img in the same paint cycle
    // so there's no gap where neither is visible.
    if (sourceImgRef.current) {
      sourceImgRef.current.style.visibility = "";
    }
    setSourceRect(null);
    setLightboxOpen(false);
  }

  function handleCardClick(e: React.MouseEvent) {
    if (!project.image) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-zoom-trigger]")) {
      e.preventDefault();
      openLightbox();
    }
  }

  const imageEl = project.image && (
    <>
      <img
        ref={sourceImgRef}
        data-zoom-trigger
        src={project.image}
        alt={project.imageAlt ?? project.title}
        loading="lazy"
        className="block aspect-[16/9] w-full cursor-zoom-in object-cover"
      />
      <div
        aria-hidden="true"
        className={
          project.titleUrl
            ? "h-px bg-retro-ink transition-colors duration-200 group-hover/card:bg-accent"
            : "h-px bg-retro-ink"
        }
      />
    </>
  );

  const body = (
    <div className="px-4 pb-3 pt-3">
      {project.status && (
        <div className="pb-1 text-xs uppercase tracking-wide text-muted">
          {project.status}
        </div>
      )}
      <div className="leading-tight">
        <span className="inline-flex items-center gap-2 text-xl font-black tracking-wide text-white [-webkit-text-stroke:2px_var(--color-retro-ink)] [paint-order:stroke_fill] [text-shadow:2px_2px_0_var(--color-retro-ink)]">
          {project.title}
          {project.titleUrl && (
            <ExternalLinkIcon className="text-fg transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
          )}
        </span>
      </div>
      <div className="pt-2 text-sm text-fg">{project.summary}</div>
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3">
          {project.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md border border-retro-ink bg-bg px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fg shadow-[1px_1px_0_var(--color-retro-ink)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const images = project.image
    ? [project.image, ...(project.gallery ?? [])]
    : [];
  const lightbox = lightboxOpen && images.length > 0 && (
    <Lightbox
      images={images}
      alt={project.imageAlt ?? project.title}
      sourceRect={sourceRect}
      onClose={closeLightbox}
    />
  );

  if (project.titleUrl) {
    return (
      <>
        <a
          href={project.titleUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleCardClick}
          className={`${baseClass} ${linkClass}`}
        >
          {imageEl}
          {body}
        </a>
        {lightbox}
      </>
    );
  }
  return (
    <>
      {project.image ? (
        <div className={baseClass}>
          <button
            type="button"
            onClick={openLightbox}
            aria-label={`Expand ${project.title} image`}
            className="block w-full focus:outline-none"
          >
            <img
              ref={sourceImgRef}
              src={project.image}
              alt={project.imageAlt ?? project.title}
              loading="lazy"
              className="block aspect-[16/9] w-full cursor-zoom-in object-cover"
            />
          </button>
          <div className="h-px bg-retro-ink" aria-hidden="true" />
          {body}
        </div>
      ) : (
        <div className={baseClass}>{body}</div>
      )}
      {lightbox}
    </>
  );
}

function Lightbox({
  images,
  alt,
  sourceRect,
  onClose,
}: {
  images: string[];
  alt: string;
  sourceRect: DOMRect | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const [chromeReady, setChromeReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const hasMany = images.length > 1;
  const ANIM_MS = 350;
  const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";
  const chromeHidden = !chromeReady || closing;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);

  function handleClose() {
    if (closing) return;
    setClosing(true);
    const img = imgRef.current;
    if (img && sourceRect) {
      const lastRect = img.getBoundingClientRect();
      const dx = sourceRect.left - lastRect.left;
      const dy = sourceRect.top - lastRect.top;
      const sx = sourceRect.width / lastRect.width;
      const sy = sourceRect.height / lastRect.height;
      img.style.transformOrigin = "top left";
      img.style.transition = `transform ${ANIM_MS}ms ${EASE}`;
      img.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    }
    if (backdropRef.current) {
      backdropRef.current.style.transition = `opacity ${ANIM_MS}ms ease-out`;
      backdropRef.current.style.opacity = "0";
    }
    window.setTimeout(onClose, ANIM_MS);
  }

  // FLIP open: paint the image at the source rect, then animate to natural.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!img || !sourceRect) return;
    const lastRect = img.getBoundingClientRect();
    const dx = sourceRect.left - lastRect.left;
    const dy = sourceRect.top - lastRect.top;
    const sx = sourceRect.width / lastRect.width;
    const sy = sourceRect.height / lastRect.height;
    img.style.transformOrigin = "top left";
    img.style.transition = "none";
    img.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    // Force reflow so the browser registers the starting state.
    img.getBoundingClientRect();
    img.style.transition = `transform ${ANIM_MS}ms ${EASE}`;
    img.style.transform = "";
  }, [sourceRect]);

  // Reveal chrome (close button, arrows, thumbnails) once the image is
  // mostly settled — overlap the chrome's 150ms fade-in with the tail of
  // the open FLIP so they finish roughly together.
  useEffect(() => {
    const t = window.setTimeout(() => setChromeReady(true), ANIM_MS - 150);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
      if (!closing && hasMany && e.key === "ArrowRight") next();
      if (!closing && hasMany && e.key === "ArrowLeft") prev();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [hasMany, closing]);

  // Keep the active thumbnail visible in the strip as the index changes.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.children[index] as HTMLElement | undefined;
    active?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [index]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        ref={backdropRef}
        type="button"
        onClick={handleClose}
        aria-label="Close"
        className="absolute inset-0 cursor-default animate-fade-in bg-black/80 backdrop-blur-sm"
      />
      <div className="relative flex max-h-full max-w-[min(95vw,1400px)] flex-col items-center gap-4">
        <div className="relative">
          <img
            ref={imgRef}
            src={images[index]}
            alt={`${alt} (${index + 1} of ${images.length})`}
            className="squircle block max-h-[72vh] max-w-full rounded-2xl border-2 border-retro-ink shadow-[4px_4px_0_var(--color-retro-ink)]"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className={`squircle absolute -right-3 -top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-retro-ink bg-bg text-fg shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-150 hover:bg-subtle active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${chromeHidden ? "opacity-0" : ""}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          {hasMany && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className={`squircle absolute inset-y-0 left-2 my-auto inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-bg text-fg shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-150 hover:bg-subtle active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:left-4 ${chromeHidden ? "opacity-0" : ""}`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className={`squircle absolute inset-y-0 right-2 my-auto inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-bg text-fg shadow-[2px_2px_0_var(--color-retro-ink)] transition-all duration-150 hover:bg-subtle active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:right-4 ${chromeHidden ? "opacity-0" : ""}`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>
        {hasMany && (
          <div
            ref={stripRef}
            className={`scrollbar-retro flex max-w-full gap-2 overflow-x-auto px-2 pb-1 transition-opacity duration-150 ${chromeHidden ? "opacity-0" : ""}`}
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === index ? "true" : "false"}
                className={`squircle relative shrink-0 overflow-hidden rounded-md border-2 transition-all duration-150 ${
                  i === index
                    ? "border-accent shadow-[2px_2px_0_var(--color-accent)] opacity-100"
                    : "border-retro-ink opacity-60 shadow-[2px_2px_0_var(--color-retro-ink)] hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="block h-14 w-20 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3 w-3 shrink-0 ${className}`}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

