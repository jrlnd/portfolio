import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ThemeToggle from "../ThemeToggle";
import type { Session } from "./sessions";

interface Props {
  sessions: Session[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onReorder: (srcId: string, dstId: string) => void;
  isOpen: boolean;
  hydrated: boolean;
  onClose: () => void;
}

function isEmptyNewChat(s: Session): boolean {
  return s.messages.length === 0 && s.title === "New chat";
}

export default function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  onClearAll,
  onReorder,
  isOpen,
  hydrated,
  onClose,
}: Props) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  const sensors = useSensors(
    // Require a small drag distance before drag activates, so clicks on the
    // row (to select) and on the ⋯ button still work.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(String(active.id), String(over.id));
  }

  useEffect(() => {
    if (!confirmingClear) return;
    const id = window.setTimeout(() => setConfirmingClear(false), 3000);
    return () => window.clearTimeout(id);
  }, [confirmingClear]);

  function handleClearClick() {
    if (confirmingClear) {
      setConfirmingClear(false);
      onClearAll();
    } else {
      setConfirmingClear(true);
    }
  }

  return (
    <>
      {hydrated && isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 animate-fade-in bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-fg",
          hydrated
            ? `transition-transform duration-300 ease-[var(--ease-out-expo)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : "max-md:-translate-x-full md:translate-x-0",
        ].join(" ")}
        aria-label="Chat sessions"
      >
        <div className="grid grid-cols-3 items-center px-4 py-4 md:pt-[calc(0.625rem+0.25rem+1px)]">
          <div aria-hidden="true" />
          <button
            type="button"
            onClick={onNew}
            aria-label="Start a new chat"
            className="cursor-pointer justify-self-center bg-transparent text-2xl font-black uppercase text-white [-webkit-text-stroke:4px_#000] [paint-order:stroke_fill] [text-shadow:3px_3px_0_#000]"
          >
            jrlnd.dev
          </button>
          <div className="justify-self-end">
            <ThemeToggle />
          </div>
        </div>

        <div className="px-4 py-3">
          <button
            type="button"
            onClick={onNew}
            className="squircle flex w-full items-center justify-center gap-2 rounded-md border-2 border-retro-ink bg-accent px-3 py-2 text-sm font-medium text-on-accent shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-100 hover:opacity-90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <span aria-hidden="true">＋</span> New chat
          </button>
        </div>

        <nav className="scrollbar-retro mt-4 flex-1 overflow-y-auto px-4 pb-4">
          {sessions.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted">
              No chats yet.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sessions.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="flex flex-col gap-1.5">
                  {sessions.map((s) => (
                    <SessionRow
                      key={s.id}
                      session={s}
                      active={s.id === activeId}
                      pinned={isEmptyNewChat(s)}
                      onSelect={() => onSelect(s.id)}
                      onRename={(title) => onRename(s.id, title)}
                      onDelete={() => onDelete(s.id)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </nav>

        <div className="px-4 py-3">
          <button
            type="button"
            onClick={handleClearClick}
            disabled={sessions.length === 0}
            className={[
              "squircle flex w-full items-center justify-center gap-2 rounded-md border-2 border-retro-ink px-3 py-2 text-sm font-medium shadow-[3px_3px_0_var(--color-retro-ink)] transition-all duration-100",
              confirmingClear
                ? "bg-accent text-on-accent"
                : "bg-chat text-fg hover:bg-subtle",
              "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-chat",
            ].join(" ")}
          >
            {confirmingClear ? "Click again to confirm" : "Clear all chats"}
          </button>
        </div>
      </aside>
    </>
  );
}

interface RowProps {
  session: Session;
  active: boolean;
  pinned: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

function SessionRow({
  session,
  active,
  pinned,
  onSelect,
  onRename,
  onDelete,
}: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.id, disabled: pinned });

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(session.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  useEffect(() => {
    if (!menuOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    window.addEventListener("mousedown", handler);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setMenuPos(null);
  }

  function openContextMenu(e: React.MouseEvent) {
    if (editing) return;
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  }

  function startRename() {
    closeMenu();
    setDraft(session.title);
    setEditing(true);
  }

  function deleteSession() {
    closeMenu();
    onDelete();
  }

  function commit() {
    const next = draft.trim();
    if (next && next !== session.title) onRename(next);
    else setDraft(session.title);
    setEditing(false);
  }

  return (
    <li ref={setNodeRef} style={sortableStyle} className="relative">
      <div
        {...attributes}
        {...(editing || pinned ? {} : listeners)}
        onContextMenu={openContextMenu}
        className={[
          "squircle group relative flex items-center rounded-md border-2 text-sm",
          "transition-colors duration-150",
          active
            ? "border-retro-ink bg-bg text-fg shadow-[2px_2px_0_var(--color-retro-ink)]"
            : "border-transparent text-muted hover:bg-subtle hover:text-fg",
          isDragging ? "z-10 opacity-60 shadow-[3px_3px_0_var(--color-retro-ink)]" : "",
          editing
            ? "cursor-text"
            : pinned
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing",
        ].join(" ")}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(session.title);
                setEditing(false);
              }
            }}
            className="w-full bg-transparent px-3 py-2 text-fg focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="flex-1 truncate px-3 py-2 text-left"
            title={session.title}
          >
            {session.title}
          </button>
        )}

        {!editing && (
          <div ref={menuRef} className="relative pr-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuPos(null);
                setMenuOpen((v) => !v);
              }}
              aria-label="Session options"
              className="rounded p-1 text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-fg focus:opacity-100"
            >
              ⋯
            </button>
            {menuOpen && (
              <div
                role="menu"
                style={
                  menuPos
                    ? { top: menuPos.y, left: menuPos.x }
                    : undefined
                }
                className={[
                  "z-50 w-32 animate-pop-in overflow-hidden rounded-md border-2 border-retro-ink bg-bg shadow-[3px_3px_0_var(--color-retro-ink)]",
                  menuPos
                    ? "fixed origin-top-left"
                    : "absolute right-0 top-full mt-1 origin-top-right",
                ].join(" ")}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={startRename}
                  className="block w-full px-3 py-1.5 text-left text-sm text-fg transition-colors duration-150 hover:bg-subtle"
                >
                  Rename
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={deleteSession}
                  className="block w-full px-3 py-1.5 text-left text-sm text-fg transition-colors duration-150 hover:bg-subtle"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
