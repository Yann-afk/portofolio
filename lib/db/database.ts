import "server-only";
import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  DB_FILE,
  TURSO_AUTH_TOKEN,
  TURSO_URL,
} from "./constants";
import { hashPassword } from "./password";
import {
  placeholderExperiences,
  placeholderProfile,
  placeholderProjects,
  placeholderSkills,
} from "@/lib/placeholder";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  role          TEXT,
  roles         TEXT NOT NULL DEFAULT '[]',
  tagline       TEXT,
  bio           TEXT,
  location      TEXT,
  availability  TEXT,
  resume_link   TEXT,
  avatar_url    TEXT,
  socials       TEXT NOT NULL DEFAULT '{}',
  password_hash TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  live_url        TEXT,
  github_url      TEXT,
  category        TEXT NOT NULL DEFAULT 'web',
  featured        INTEGER NOT NULL DEFAULT 0,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  icon_url   TEXT,
  category   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id TEXT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  skill_id   TEXT NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS experiences (
  id           TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  role         TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'work',
  start_date   TEXT NOT NULL,
  end_date     TEXT,
  is_current   INTEGER NOT NULL DEFAULT 0,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id           TEXT PRIMARY KEY,
  sender_name  TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  message      TEXT NOT NULL,
  is_read      INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages (is_read);
`;

export const JSON_COLUMNS: Record<string, string[]> = {
  users: ["roles", "socials"],
};

export const BOOLEAN_COLUMNS: Record<string, string[]> = {
  projects: ["featured"],
  experiences: ["is_current"],
  messages: ["is_read"],
};

export const VALID_TABLES: ReadonlySet<string> = new Set([
  "users",
  "projects",
  "skills",
  "project_skills",
  "experiences",
  "messages",
]);

export function assertValidTable(table: string) {
  if (!VALID_TABLES.has(table)) {
    throw new Error(`Unknown table "${table}".`);
  }
}

export type Row = Record<string, unknown>;
export type SqlValue = string | number | bigint | null | Uint8Array;

export interface DbStatement {
  all(...params: SqlValue[]): Promise<Row[]>;
  get(...params: SqlValue[]): Promise<Row | undefined>;
  run(...params: SqlValue[]): Promise<{
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }>;
}

export interface Db {
  prepare(sql: string): DbStatement;
  exec(sql: string): Promise<void>;
}

class LocalDb implements Db {
  private db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db;
  }

  prepare(sql: string): DbStatement {
    const stmt = this.db.prepare(sql);
    return {
      all: (...params) => Promise.resolve(stmt.all(...params)),
      get: (...params) => Promise.resolve(stmt.get(...params)),
      run: (...params) => Promise.resolve(stmt.run(...params)),
    };
  }

  exec(sql: string): Promise<void> {
    this.db.exec(sql);
    return Promise.resolve();
  }
}

class TursoDb implements Db {
  private client: import("@libsql/client").Client;

  constructor(client: import("@libsql/client").Client) {
    this.client = client;
  }

  prepare(sql: string): DbStatement {
    return {
      all: async (...params) => {
        const result = await this.client.execute({ sql, args: params });
        return result.rows as Row[];
      },
      get: async (...params) => {
        const result = await this.client.execute({ sql, args: params });
        return result.rows[0] as Row | undefined;
      },
      run: async (...params) => {
        const result = await this.client.execute({ sql, args: params });
        return {
          changes: Number(result.rowsAffected),
          lastInsertRowid: Number(result.lastInsertRowid ?? 0),
        };
      },
    };
  }

  async exec(sql: string) {
    await this.client.executeMultiple(sql);
  }
}

const globalForDb = globalThis as unknown as {
  __portfolioDb?: Db;
};

export async function tableColumns(
  db: Db,
  table: string,
): Promise<Set<string>> {
  assertValidTable(table);
  const rows = (await db
    .prepare(`PRAGMA table_info("${table}")`)
    .all()) as unknown as Array<{ name: string }>;
  return new Set(rows.map((r) => r.name));
}

function normalizeSeedValue(value: unknown, table: string, column: string) {
  if (value == null) return null;
  if (JSON_COLUMNS[table]?.includes(column) && typeof value !== "string") {
    return JSON.stringify(value);
  }
  if (BOOLEAN_COLUMNS[table]?.includes(column)) return value ? 1 : 0;
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

async function insertRows(
  db: Db,
  table: string,
  rows: Array<Record<string, unknown>>,
) {
  assertValidTable(table);
  const cols = await tableColumns(db, table);
  const now = new Date().toISOString();
  for (const raw of rows) {
    const row: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (!cols.has(key) || value == null) continue;
      row[key] = normalizeSeedValue(value, table, key);
    }
    if (cols.has("id") && !row.id) row.id = randomUUID();
    if (cols.has("created_at") && !row.created_at) row.created_at = now;
    if (cols.has("updated_at") && !row.updated_at) row.updated_at = now;
    if (table === "users" && !row.password_hash) {
      row.password_hash = hashPassword(ADMIN_PASSWORD);
    }
    if (Object.keys(row).length === 0) continue;

    const keys = Object.keys(row);
    const columns = keys.map((k) => `"${k}"`).join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`;
    await db.prepare(sql).run(...(keys.map((k) => row[k] as SqlValue)));
  }
}

async function seedFromDemoJson(db: Db): Promise<boolean> {
  const file = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "demo.json");
  if (!existsSync(file)) return false;

  let demo: {
    users?: Array<Record<string, unknown>>;
    projects?: Array<Record<string, unknown>>;
    skills?: Array<Record<string, unknown>>;
    project_skills?: Array<Record<string, unknown>>;
    experiences?: Array<Record<string, unknown>>;
    messages?: Array<Record<string, unknown>>;
  };
  try {
    demo = JSON.parse(readFileSync(file, "utf8")) as typeof demo;
  } catch {
    return false;
  }
  if (!Array.isArray(demo.skills) || demo.skills.length === 0) return false;

  const users = demo.users ?? [];
  if (users.length === 0) {
    const p = placeholderProfile;
    users.push({
      id: ADMIN_USER_ID,
      email: ADMIN_EMAIL,
      username: p.username,
      name: p.name,
      role: p.role,
      roles: p.roles,
      tagline: p.tagline,
      bio: p.bio,
      location: p.location,
      availability: p.availability,
      resume_link: p.resume,
      avatar_url: p.avatarUrl,
      socials: p.socials,
    });
  } else {
    users[0] = { ...users[0], id: ADMIN_USER_ID, email: ADMIN_EMAIL };
  }

  await insertRows(db, "users", users);
  await insertRows(db, "skills", demo.skills);
  await insertRows(db, "projects", demo.projects ?? []);
  await insertRows(db, "project_skills", demo.project_skills ?? []);
  await insertRows(db, "experiences", demo.experiences ?? []);
  await insertRows(db, "messages", demo.messages ?? []);
  return true;
}

async function seedPlaceholder(db: Db) {
  const profile = placeholderProfile;
  await insertRows(db, "users", [
    {
      id: ADMIN_USER_ID,
      username: profile.username,
      name: profile.name,
      email: ADMIN_EMAIL,
      role: profile.role,
      roles: profile.roles,
      tagline: profile.tagline,
      bio: profile.bio,
      location: profile.location,
      availability: profile.availability,
      resume_link: profile.resume,
      avatar_url: profile.avatarUrl,
      socials: profile.socials,
    },
  ]);

  const skills = placeholderSkills.map((s) => ({
    id: s.id,
    name: s.name,
    icon_url: s.iconUrl,
    category: s.category,
    sort_order: s.sortOrder,
  }));
  await insertRows(db, "skills", skills);

  const skillIdByName = new Map(skills.map((s) => [s.name, s.id as string]));
  const projectSkills: Array<Record<string, unknown>> = [];
  const projects = placeholderProjects.map((p, i) => {
    for (const name of p.skills) {
      const skillId = skillIdByName.get(name);
      if (skillId) projectSkills.push({ project_id: p.id, skill_id: skillId });
    }
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      cover_image_url: p.coverImageUrl,
      live_url: p.liveUrl,
      github_url: p.githubUrl,
      category: p.category,
      featured: p.featured,
      sort_order: i + 1,
    };
  });
  await insertRows(db, "projects", projects);
  await insertRows(db, "project_skills", projectSkills);

  await insertRows(
    db,
    "experiences",
    placeholderExperiences.map((e, i) => ({
      id: e.id,
      company_name: e.company,
      role: e.role,
      type: e.type,
      start_date: e.startDate,
      end_date: e.endDate,
      is_current: e.isCurrent,
      description: e.description,
      sort_order: i + 1,
    })),
  );

  await insertRows(db, "messages", [
    {
      id: "m1",
      sender_name: "Budi Santoso",
      sender_email: "budi@example.com",
      message:
        "Halo! Saya melihat portfolio kamu dan tertarik untuk kolaborasi bikin web app bareng tim saya. Bisa diskusi lebih lanjut?",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "m2",
      sender_name: "Sarah Wijaya",
      sender_email: "sarah@example.com",
      message:
        "Saya lagi cari freelancer untuk landing page produk baru. Kira-kira untuk rate dan estimasi pengerjaan bagaimana ya?",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: "m3",
      sender_name: "Andi Pratama",
      sender_email: "andi@example.com",
      message:
        "Terima kasih sudah membalas email saya sebelumnya. Sudah saya baca juga, nanti saya kabari lagi ya!",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ]);
}

async function seed(db: Db) {
  if (!(await seedFromDemoJson(db))) await seedPlaceholder(db);
}

export async function getDb(): Promise<Db> {
  if (!globalForDb.__portfolioDb) {
    const tursoUrl = TURSO_URL;

    if (tursoUrl) {
      const { createClient } = await import("@libsql/client");
      const client = createClient({
        url: tursoUrl,
        authToken: TURSO_AUTH_TOKEN,
      });
      const db: Db = new TursoDb(client);
      await db.exec(SCHEMA_SQL);
      const { n } = (await db
        .prepare("SELECT COUNT(*) AS n FROM users")
        .get()) as { n: number };
      if (n === 0) await seed(db);
      globalForDb.__portfolioDb = db;
    } else {
      const dbPath = path.join(/*turbopackIgnore: true*/ process.cwd(), DB_FILE);
      mkdirSync(path.dirname(dbPath), { recursive: true });
      const raw = new DatabaseSync(dbPath);
      raw.exec("PRAGMA journal_mode = WAL;");
      raw.exec("PRAGMA foreign_keys = ON;");
      const db: Db = new LocalDb(raw);
      await db.exec(SCHEMA_SQL);
      const { n } = (await db
        .prepare("SELECT COUNT(*) AS n FROM users")
        .get()) as { n: number };
      if (n === 0) await seed(db);
      globalForDb.__portfolioDb = db;
    }
  }
  return globalForDb.__portfolioDb;
}
