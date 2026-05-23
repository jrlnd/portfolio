export type Role = "user" | "assistant";

export interface ExperienceCardData {
  role: string;
  company: string;
  companyUrl?: string;
  dates: string;
  location?: string;
  narrative: string;
  skills?: string[];
}

export type ContactKind = "email" | "linkedin" | "github" | "resume";

export interface ContactCardData {
  kind: ContactKind;
  label: string;
  handle?: string;
  url: string;
}

export interface ProjectCardData {
  title: string;
  titleUrl?: string;
  status?: string;
  summary: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  // Additional images shown in the lightbox gallery alongside the main image.
  gallery?: string[];
}

export interface Message {
  role: Role;
  content: string;
  // Marks an assistant message that's actually an error report (so the UI can
  // render it as an error card with a retry button rather than as normal
  // streamed text). Not persisted to history sent back to the model.
  isError?: boolean;
  // Marks a pre-rendered assistant message that should be wrapped in a retro
  // reply bubble (used for preset content like the experience tab).
  bubbled?: boolean;
  // Optional structured payload for custom rendering (e.g. experience cards).
  experience?: ExperienceCardData;
  // Optional structured payload for custom rendering (e.g. project cards).
  project?: ProjectCardData;
  // Optional list of social/contact cards to render side-by-side.
  contacts?: ContactCardData[];
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  // Preset sessions (About / Experience / Projects / Contact) are locked so
  // visitors can't rename or delete them. Unset/false on user-created chats.
  locked?: boolean;
}

const SESSIONS_KEY = "jr-chat-sessions-v1";
const ACTIVE_KEY = "jr-chat-active-v1";
const TITLE_MAX = 48;

// Used to retroactively lock preset sessions in localStorage saved before the
// `locked` flag existed. Kept in sync with the titles in `presets.ts`.
const PRESET_TITLES = new Set(["About", "Experience", "Projects", "Contact"]);

export function newSession(): Session {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function titleFromMessage(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New chat";
  return cleaned.length > TITLE_MAX
    ? `${cleaned.slice(0, TITLE_MAX).trimEnd()}…`
    : cleaned;
}

export function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (s): s is Session =>
          s &&
          typeof s.id === "string" &&
          typeof s.title === "string" &&
          typeof s.createdAt === "number" &&
          typeof s.updatedAt === "number" &&
          Array.isArray(s.messages),
      )
      .map((s) =>
        s.locked || !PRESET_TITLES.has(s.title) ? s : { ...s, locked: true },
      );
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Quota or disabled — silently ignore. Session memory remains in React state.
  }
}

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function sortByRecent(sessions: Session[]): Session[] {
  return sessions.slice().sort((a, b) => b.updatedAt - a.updatedAt);
}
