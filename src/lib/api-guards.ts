import { createClient } from "@vercel/kv";

const ALLOWED_HOSTS = new Set(["jrlnd.dev", "www.jrlnd.dev"]);

/**
 * Check whether the request's Origin / Referer points at a host we serve. Used
 * to keep `/api/*` from being called as a public proxy from arbitrary origins.
 * Allows production, any *.vercel.app preview, and localhost for dev.
 */
export function isAllowedOrigin(request: Request): boolean {
  const source =
    request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;
  try {
    const host = new URL(source).hostname;
    if (ALLOWED_HOSTS.has(host)) return true;
    if (host.endsWith(".vercel.app")) return true;
    if (host === "localhost" || host === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}

type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

const KV_CONFIGURED =
  Boolean(import.meta.env.KV_REST_API_URL) &&
  Boolean(import.meta.env.KV_REST_API_TOKEN);

// Build the client from `import.meta.env` (Astro's idiom) instead of relying
// on the default `kv` singleton, which reads `process.env` directly — Vite
// doesn't mirror `.env` into `process.env`, so the singleton would be unusable
// in local dev even with valid credentials.
const kv = KV_CONFIGURED
  ? createClient({
      url: import.meta.env.KV_REST_API_URL!,
      token: import.meta.env.KV_REST_API_TOKEN!,
    })
  : null;

// In-memory fallback bucket (per serverless instance). Entries are pruned on
// each call so the map can't grow without bound.
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Fixed-window rate limit. Uses Vercel KV (Upstash Redis) when the
 * KV_REST_API_* env vars are present — that's the path that survives cold
 * starts and is shared across serverless instances. Falls back to per-instance
 * in-memory counting for local dev or if KV is unreachable, so requests still
 * work either way.
 */
export async function rateLimit(
  key: string,
  windowMs: number,
  max: number,
): Promise<RateLimitResult> {
  if (kv) {
    try {
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, Math.ceil(windowMs / 1000));
      }
      if (count > max) {
        const ttl = await kv.ttl(key);
        return {
          ok: false,
          retryAfter: ttl > 0 ? ttl : Math.ceil(windowMs / 1000),
        };
      }
      return { ok: true };
    } catch (err) {
      console.warn("KV rate-limit unavailable, using in-memory fallback:", err);
    }
  }

  const now = Date.now();
  for (const [k, b] of memoryBuckets) {
    if (b.resetAt < now) memoryBuckets.delete(k);
  }
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}
