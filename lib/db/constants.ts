export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const DEFAULT_SESSION_SECRET = "local-dev-secret-change-me";
const MIN_SESSION_SECRET_LENGTH = 32;

// `??` only falls back on null/undefined, so a variable that exists but is
// blank would survive as "". WebCrypto then rejects the zero-length HMAC key
// with "Zero-length key is not supported", which surfaced as an opaque 500 on
// the login route instead of a configuration error. Treat blank as unset.
const configuredSecret = process.env.SESSION_SECRET;

export const SESSION_SECRET =
  configuredSecret !== undefined && configuredSecret.trim() !== ""
    ? configuredSecret
    : DEFAULT_SESSION_SECRET;

export function assertSessionSecretConfigured() {
  if (process.env.NODE_ENV !== "production") return;
  if (
    SESSION_SECRET === DEFAULT_SESSION_SECRET ||
    SESSION_SECRET.trim().length < MIN_SESSION_SECRET_LENGTH
  ) {
    throw new Error(
      "SESSION_SECRET must be set to a strong random value in production.",
    );
  }
}

export const ADMIN_USER_ID = "9e3c4f6e-1a2b-4c5d-8e9f-0a1b2c3d4e5f";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@demo.dev";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "demo1234";

export const DB_FILE = process.env.DATABASE_PATH ?? "data/portofolio.db";

// Turso/libSQL remote storage. When TURSO_URL is set the app uses Turso
// instead of the local SQLite file (used on Vercel).
export const TURSO_URL = process.env.TURSO_URL;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
