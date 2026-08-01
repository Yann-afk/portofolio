export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const DEFAULT_SESSION_SECRET = "local-dev-secret-change-me";

export const SESSION_SECRET =
  process.env.SESSION_SECRET ?? DEFAULT_SESSION_SECRET;

export function assertSessionSecretConfigured() {
  if (process.env.NODE_ENV === "production" && SESSION_SECRET === DEFAULT_SESSION_SECRET) {
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
