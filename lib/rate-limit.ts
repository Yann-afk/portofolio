import "server-only";

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export const LOGIN_LIMIT: RateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 10,
};

// Tighter than the per-IP budget: a single account should not survive ten
// guesses even when they arrive from different addresses.
export const LOGIN_EMAIL_LIMIT: RateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 5,
};

export const MESSAGE_LIMIT: RateLimitOptions = {
  windowMs: 10 * 60 * 1000,
  max: 5,
};

const buckets = new Map<string, { count: number; resetAt: number }>();
const SWEEP_THRESHOLD = 10_000;

export function consume(
  key: string,
  options: RateLimitOptions,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();

  if (buckets.size > SWEEP_THRESHOLD) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + options.windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  if (bucket.count > options.max) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }
  return { allowed: true, retryAfterMs: 0 };
}

export function resetKey(key: string) {
  buckets.delete(key);
}
