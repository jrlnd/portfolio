import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { GoogleGenAI } from "@google/genai";
import { profile } from "../../content/profile";
import { isAllowedOrigin, rateLimit } from "../../lib/api-guards";

export const prerender = false;

const MODEL = "gemini-2.5-flash";
const MAX_MESSAGE_CHARS = 8000;
const MAX_HISTORY = 40;

const RATE_LIMIT = { windowMs: 60_000, max: 20 };

// In-band sentinels emitted into the stream when the upstream LLM errors. The
// client detects these and surfaces dedicated UI (rate-limit banner / error
// card with retry) instead of rendering raw error text as assistant content.
const RATE_LIMIT_SENTINEL = "[[__RATE_LIMITED__:";
const RATE_LIMIT_SENTINEL_END = "]]";
const ERROR_SENTINEL = "[[__JR_ERROR__:";
const ERROR_SENTINEL_END = "]]";

function isUpstreamRateLimit(err: unknown): boolean {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "";
  return /quota|RESOURCE_EXHAUSTED|rate.?limit|\b429\b/i.test(msg);
}

/**
 * Convert an arbitrary upstream error (often nested JSON-stringified JSON from
 * the @google/genai SDK) into a single short, user-facing sentence.
 */
function friendlyErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  let code: number | undefined;
  let upstreamStatus: string | undefined;
  let upstreamMessage: string | undefined;

  try {
    const jsonStart = raw.indexOf("{");
    if (jsonStart >= 0) {
      let obj: unknown = JSON.parse(raw.slice(jsonStart));
      while (
        obj &&
        typeof obj === "object" &&
        "error" in obj &&
        typeof (obj as { error: unknown }).error === "object"
      ) {
        obj = (obj as { error: unknown }).error;
      }
      const o = obj as {
        code?: unknown;
        status?: unknown;
        message?: unknown;
      };
      if (typeof o.message === "string" && o.message.includes("{")) {
        try {
          const deeper = JSON.parse(o.message) as { error?: unknown };
          obj = (deeper && deeper.error) || deeper;
        } catch {
          // Ignore — message wasn't valid JSON after all.
        }
      }
      const final = obj as {
        code?: unknown;
        status?: unknown;
        message?: unknown;
      };
      if (typeof final.code === "number") code = final.code;
      if (typeof final.status === "string") upstreamStatus = final.status;
      if (typeof final.message === "string") upstreamMessage = final.message;
    }
  } catch {
    // Raw wasn't a JSON-bearing string; fall through to generic mapping.
  }

  if (code === 503 || upstreamStatus === "UNAVAILABLE") {
    return "Gemini is experiencing high demand right now. Please try again in a moment.";
  }
  if (code === 504 || /timeout/i.test(upstreamMessage ?? raw)) {
    return "The request timed out. Please try again.";
  }
  if (code === 500) {
    return "Gemini hit an internal error on its end. Please try again.";
  }
  if (code === 401 || code === 403) {
    return "Authentication issue with the AI service. The site admin may need to refresh the API key.";
  }
  if (code === 400 || code === 404) {
    return `The request to Gemini was invalid (${code}). Please try again.`;
  }
  return "Something went wrong while generating a response. Please try again.";
}

function stripTodos(value: unknown): unknown {
  if (typeof value === "string") {
    return value.startsWith("TODO:") ? null : value;
  }
  if (Array.isArray(value)) {
    return value.map(stripTodos).filter((v) => v !== null && v !== undefined);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const cleaned = stripTodos(v);
      if (
        cleaned !== null &&
        cleaned !== undefined &&
        !(Array.isArray(cleaned) && cleaned.length === 0)
      ) {
        out[k] = cleaned;
      }
    }
    return out;
  }
  return value;
}

async function buildSystemPrompt(): Promise<string> {
  const cleaned = stripTodos(profile) as typeof profile;
  const mdxProjects = (
    await getCollection("projects", ({ data }) => !data.draft)
  ).map((p) => ({
    title: p.data.title,
    summary: p.data.summary,
    tags: p.data.tags,
    year: p.data.year,
    role: p.data.role ?? null,
    liveUrl: p.data.liveUrl ?? null,
    repoUrl: p.data.repoUrl ?? null,
  }));
  const projects = [...(cleaned.projects ?? []), ...mdxProjects];

  return [
    cleaned.voice.persona,
    "",
    "## Style",
    ...cleaned.voice.style.map((s) => `- ${s}`),
    "",
    "## Guardrails",
    ...cleaned.voice.guardrails.map((s) => `- ${s}`),
    "",
    "## What you know about JR",
    "```json",
    JSON.stringify(
      {
        name: cleaned.name,
        title: cleaned.title,
        location: cleaned.location,
        pronouns: cleaned.pronouns,
        tagline: cleaned.tagline,
        bio: cleaned.bio,
        skills: cleaned.skills,
        strengths: cleaned.strengths,
        topics: cleaned.topics,
        availability: cleaned.availability,
        experience: cleaned.experience,
        education: cleaned.education,
        links: cleaned.links,
        personality: cleaned.personality,
        projects,
      },
      null,
      2,
    ),
    "```",
  ].join("\n");
}

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function isValidMessages(value: unknown): value is IncomingMessage[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (value.length > MAX_HISTORY) return false;
  return value.every(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_CHARS,
  );
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!isAllowedOrigin(request)) {
    return new Response("Forbidden.", { status: 403 });
  }

  const apiKey = import.meta.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      "Server is missing GEMINI_API_KEY. Set it in your environment.",
      { status: 500 },
    );
  }

  const ip = clientAddress || "unknown";
  const limit = await rateLimit(
    `chat:${ip}`,
    RATE_LIMIT.windowMs,
    RATE_LIMIT.max,
  );
  if (!limit.ok) {
    return new Response("Too many requests. Try again shortly.", {
      status: 429,
      headers: {
        "Retry-After": String(limit.retryAfter),
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!isValidMessages(messages)) {
    return new Response("Invalid messages payload.", { status: 400 });
  }
  if (messages[messages.length - 1].role !== "user") {
    return new Response("Last message must be from user.", { status: 400 });
  }

  const systemInstruction = await buildSystemPrompt();
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const ai = new GoogleGenAI({ apiKey });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        });
        for await (const chunk of response) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        if (isUpstreamRateLimit(err)) {
          // Conservative retry hint — Gemini's free tier resets per minute.
          controller.enqueue(
            encoder.encode(
              `${RATE_LIMIT_SENTINEL}60${RATE_LIMIT_SENTINEL_END}`,
            ),
          );
        } else {
          const friendly = friendlyErrorMessage(err);
          controller.enqueue(
            encoder.encode(`${ERROR_SENTINEL}${friendly}${ERROR_SENTINEL_END}`),
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
