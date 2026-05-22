import type { APIRoute } from "astro";
import { Resend } from "resend";
import { profile } from "../../content/profile";

export const prerender = false;

const RATE_LIMIT = { windowMs: 60_000, max: 3 };
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true };
  }
  if (bucket.count >= RATE_LIMIT.max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 5000;

function jsonError(status: number, error: string, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? "unknown";
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return jsonError(429, "Too many requests. Please try again later.", {
      "retry-after": String(rl.retryAfter),
    });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(400, "Invalid request body.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const honeypot = typeof body.honeypot === "string" ? body.honeypot.trim() : "";

  // Honeypot: silently accept (don't tip off bots) but don't send.
  if (honeypot.length > 0) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (!name || !email || !message) {
    return jsonError(400, "Name, email, and message are required.");
  }
  if (name.length > MAX_FIELD || email.length > MAX_FIELD || company.length > MAX_FIELD || message.length > MAX_FIELD) {
    return jsonError(400, "One or more fields are too long.");
  }
  if (!EMAIL_RE.test(email)) {
    return jsonError(400, "Please provide a valid email address.");
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return jsonError(500, "Email service is not configured.");
  }

  const fromAddress = import.meta.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  const toAddress = profile.links.email;

  const resend = new Resend(apiKey);
  const subject = `Portfolio: ${name}${company ? ` (${company})` : ""}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company / Role: ${company}` : null,
    "",
    "Message:",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject,
      text,
    });
    if (result.error) {
      console.error("Resend error:", result.error);
      return jsonError(500, "Couldn't send your message. Please try again.");
    }
  } catch (err) {
    console.error("Contact API error:", err);
    return jsonError(500, "Couldn't send your message. Please try again.");
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
