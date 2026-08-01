import "server-only";
import { randomUUID } from "node:crypto";
import {
  assertValidTable,
  BOOLEAN_COLUMNS,
  JSON_COLUMNS,
  getDb,
  tableColumns,
  type Db,
  type Row,
  type SqlValue,
} from "./database";

export interface UserRow {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string | null;
  roles: unknown;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  availability: string | null;
  resume_link: string | null;
  avatar_url: string | null;
  socials: unknown;
  password_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  category: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  skills: Array<{ name: string; id?: string }>;
}

export interface SkillRow {
  id: string;
  name: string;
  icon_url: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProjectSkillRow {
  project_id: string;
  skill_id: string;
}

export interface ExperienceRow {
  id: string;
  company_name: string;
  role: string;
  type: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface RowMap {
  users: UserRow;
  projects: ProjectRow;
  skills: SkillRow;
  project_skills: ProjectSkillRow;
  experiences: ExperienceRow;
  messages: MessageRow;
}

type TableName = keyof RowMap;

export interface Result<T> {
  data: T;
  error: { message: string } | null;
  count?: number;
}

export interface DbClient {
  from<T extends TableName>(table: T): SqliteQuery<RowMap[T]>;
}

interface SelectSpec {
  columns: string[];
  hasStar: boolean;
  relation: { key: string; cols: string[] } | null;
}

function parseSelect(cols: string): SelectSpec {
  const parts = cols
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const spec: SelectSpec = { columns: [], hasStar: false, relation: null };
  for (const part of parts) {
    if (part === "*") {
      spec.hasStar = true;
      continue;
    }
    const match = part.match(/^(\w+)\(([^)]*)\)$/);
    if (match) {
      spec.relation = {
        key: match[1],
        cols: match[2]
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };
    } else {
      spec.columns.push(part);
    }
  }
  return spec;
}

function toDbValue(value: unknown, table: string, column: string): SqlValue {
  if (value == null) return null;
  if (JSON_COLUMNS[table]?.includes(column) && typeof value !== "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function normalizeRow(row: Row, table: string): Row {
  const out: Row = { ...row };
  for (const column of JSON_COLUMNS[table] ?? []) {
    if (typeof out[column] === "string") {
      try {
        out[column] = JSON.parse(out[column]);
      } catch {
        // keep the raw string when it is not valid JSON
      }
    }
  }
  for (const column of BOOLEAN_COLUMNS[table] ?? []) {
    const value = out[column];
    if (value != null) out[column] = Boolean(value);
  }
  return out;
}

function projectRow(row: Row, spec: SelectSpec | null): Row {
  if (!spec || spec.hasStar) return { ...row };
  const out: Row = {};
  for (const column of spec.columns) {
    if (column in row) out[column] = row[column];
  }
  return out;
}

async function projectSkillsRelation(
  db: Db,
  parentIds: string[],
  cols: string[],
): Promise<Map<string, Row[]>> {
  const map = new Map<string, Row[]>();
  if (parentIds.length === 0) return map;
  const placeholders = parentIds.map(() => "?").join(", ");
  const rows = (await db
    .prepare(
      `SELECT s.*, ps.project_id AS __project_id
       FROM skills s
       JOIN project_skills ps ON ps.skill_id = s.id
       WHERE ps.project_id IN (${placeholders})
       ORDER BY s.sort_order ASC`,
    )
    .all(...parentIds)) as Row[];

  for (const row of rows) {
    const projectId = String(row.__project_id);
    const rel: Row = {};
    for (const column of cols) {
      if (column in row) rel[column] = row[column];
    }
    const existing = map.get(projectId);
    if (existing) existing.push(rel);
    else map.set(projectId, [rel]);
  }
  return map;
}

type Mode = "select" | "insert" | "update" | "delete" | "upsert";

class SqliteQuery<T> {
  private table: TableName;
  private mode: Mode = "select";
  private spec: SelectSpec | null = null;
  private countRequested = false;
  private filters: Array<{ col: string; value: unknown }> = [];
  private orders: Array<{ col: string; ascending: boolean }> = [];
  private limitVal: number | null = null;
  private insertRows: Row[] = [];
  private updatePayload: Row = {};
  private onConflict: string | null = null;

  constructor(table: TableName) {
    this.table = table;
  }

  select(
    cols?: string | string[],
    opts?: { count?: "exact"; head?: boolean },
  ) {
    if (typeof cols === "string") {
      this.spec = parseSelect(cols);
    } else if (Array.isArray(cols)) {
      this.spec = { columns: cols.map(String), hasStar: false, relation: null };
    }
    if (opts?.count === "exact") this.countRequested = true;
    return this;
  }

  eq(col: string, value: unknown) {
    this.filters.push({ col, value });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orders.push({ col, ascending: opts?.ascending ?? true });
    return this;
  }

  limit(n: number) {
    this.limitVal = n;
    return this;
  }

  single() {
    return new SingleResult<T>(this);
  }

  maybeSingle() {
    return new SingleResult<T>(this);
  }

  insert(rows: Row | Row[]) {
    this.mode = "insert";
    this.insertRows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(payload: Row) {
    this.mode = "update";
    this.updatePayload = payload;
    return this;
  }

  delete() {
    this.mode = "delete";
    return this;
  }

  upsert(rows: Row | Row[], opts?: { onConflict?: string }) {
    this.mode = "upsert";
    this.insertRows = Array.isArray(rows) ? rows : [rows];
    this.onConflict = opts?.onConflict ?? null;
    return this;
  }

  then<TResult1 = Result<T[]>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<T[]>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null,
  ): Promise<TResult1 | TResult2> {
    return (this.execute() as unknown as Promise<Result<T[]>>).then(
      onfulfilled,
      onrejected,
    );
  }

  private assertColumn(cols: Set<string>, col: string): string {
    if (!cols.has(col)) {
      throw new Error(`Unknown column "${col}" on table "${this.table}".`);
    }
    return col;
  }

  private async execute(): Promise<Result<Row[]>> {
    try {
      switch (this.mode) {
        case "select":
          return await this.execSelect();
        case "insert":
          return await this.execInsert();
        case "update":
          return await this.execUpdate();
        case "delete":
          return await this.execDelete();
        case "upsert":
          return await this.execUpsert();
      }
    } catch (e) {
      return {
        data: [],
        error: { message: e instanceof Error ? e.message : String(e) },
      };
    }
  }

  async executeSingle(): Promise<Result<Row | null>> {
    const result = await this.execute();
    if (result.error) return { data: null, error: result.error };
    return { data: result.data[0] ?? null, error: null };
  }

  private async execSelect(): Promise<Result<Row[]>> {
    const db = await getDb();
    const cols = await tableColumns(db, this.table);
    const where = this.filters
      .map((f) => `"${this.assertColumn(cols, f.col)}" = ?`)
      .join(" AND ");
    const args = this.filters.map((f) => toDbValue(f.value, this.table, f.col));

    if (this.countRequested) {
      const sql = `SELECT COUNT(*) AS n FROM "${this.table}"${
        where ? ` WHERE ${where}` : ""
      }`;
      const row = (await db.prepare(sql).get(...args)) as { n: number };
      return { data: [], count: Number(row.n), error: null };
    }

    let sql = `SELECT * FROM "${this.table}"${where ? ` WHERE ${where}` : ""}`;
    if (this.orders.length > 0) {
      sql += ` ORDER BY ${this.orders
        .map(
          (o) =>
            `"${this.assertColumn(cols, o.col)}" ${o.ascending ? "ASC" : "DESC"}`,
        )
        .join(", ")}`;
    }
    const params: SqlValue[] = [...args];
    if (this.limitVal != null) {
      sql += " LIMIT ?";
      params.push(this.limitVal);
    }

    const rows = (await db.prepare(sql).all(...params)) as Row[];
    const normalized = rows.map((row) => normalizeRow(row, this.table));
    let data = normalized.map((row) => projectRow(row, this.spec));

    if (this.spec?.relation && this.table === "projects") {
      const key = this.spec.relation.key;
      if (key === "skills") {
        const map = await projectSkillsRelation(
          db,
          normalized.map((row) => String(row.id)),
          this.spec.relation.cols,
        );
        data = data.map((row) => ({
          ...row,
          [key]: map.get(String(row.id)) ?? [],
        }));
      }
    }

    return { data, error: null };
  }

  private async execInsert(): Promise<Result<Row[]>> {
    const db = await getDb();
    const cols = await tableColumns(db, this.table);
    const now = new Date().toISOString();
    const rows = this.insertRows.map((raw) => {
      const row: Row = { ...raw };
      if (cols.has("id") && !row.id) row.id = randomUUID();
      if (cols.has("created_at") && !row.created_at) row.created_at = now;
      if (cols.has("updated_at") && !row.updated_at) row.updated_at = now;
      return row;
    });

    for (const row of rows) {
      const keys = Object.keys(row);
      const columns = keys
        .map((k) => `"${this.assertColumn(cols, k)}"`)
        .join(", ");
      const placeholders = keys.map(() => "?").join(", ");
      const sql = `INSERT INTO "${this.table}" (${columns}) VALUES (${placeholders})`;
      await db
        .prepare(sql)
        .run(...keys.map((k) => toDbValue(row[k], this.table, k)));
    }

    const normalized = rows.map((row) => normalizeRow(row, this.table));
    const data = normalized.map((row) => projectRow(row, this.spec));
    return { data, error: null };
  }

  private async execUpdate(): Promise<Result<Row[]>> {
    const db = await getDb();
    const cols = await tableColumns(db, this.table);
    const entries = Object.entries(this.updatePayload);
    if (entries.length === 0) return { data: [], error: null };

    const setSql = entries
      .map(([key]) => `"${this.assertColumn(cols, key)}" = ?`)
      .join(", ");
    const where = this.filters
      .map((f) => `"${this.assertColumn(cols, f.col)}" = ?`)
      .join(" AND ");
    const params = [
      ...entries.map(([key, value]) => toDbValue(value, this.table, key)),
      ...this.filters.map((f) => toDbValue(f.value, this.table, f.col)),
    ];
    await db.prepare(
      `UPDATE "${this.table}" SET ${setSql}${where ? ` WHERE ${where}` : ""}`,
    ).run(...params);
    return { data: [], error: null };
  }

  private async execDelete(): Promise<Result<Row[]>> {
    const db = await getDb();
    const cols = await tableColumns(db, this.table);
    const where = this.filters
      .map((f) => `"${this.assertColumn(cols, f.col)}" = ?`)
      .join(" AND ");
    const params = this.filters.map((f) =>
      toDbValue(f.value, this.table, f.col),
    );
    await db.prepare(
      `DELETE FROM "${this.table}"${where ? ` WHERE ${where}` : ""}`,
    ).run(...params);
    return { data: [], error: null };
  }

  private async execUpsert(): Promise<Result<Row[]>> {
    const db = await getDb();
    const cols = await tableColumns(db, this.table);
    const conflictCol = this.onConflict ?? "id";
    this.assertColumn(cols, conflictCol);
    const now = new Date().toISOString();

    for (const raw of this.insertRows) {
      const row: Row = { ...raw };
      if (cols.has("id") && !row.id) row.id = randomUUID();
      if (cols.has("created_at") && !row.created_at) row.created_at = now;
      if (cols.has("updated_at") && !row.updated_at) row.updated_at = now;

      const keys = Object.keys(row);
      const columns = keys
        .map((k) => `"${this.assertColumn(cols, k)}"`)
        .join(", ");
      const placeholders = keys.map(() => "?").join(", ");
      const updates = keys
        .filter((k) => k !== conflictCol)
        .map((k) => `"${k}" = excluded."${k}"`)
        .join(", ");
      const sql = `INSERT INTO "${this.table}" (${columns}) VALUES (${placeholders})
        ON CONFLICT("${conflictCol}") DO UPDATE SET ${updates}`;
      await db
        .prepare(sql)
        .run(...keys.map((k) => toDbValue(row[k], this.table, k)));
    }
    return { data: [], error: null };
  }
}

class SingleResult<T> {
  private query: SqliteQuery<T>;

  constructor(query: SqliteQuery<T>) {
    this.query = query;
  }

  then<TResult1 = Result<T>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<T>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null,
  ): Promise<TResult1 | TResult2> {
    return (this.query.executeSingle() as unknown as Promise<Result<T>>).then(
      onfulfilled,
      onrejected,
    );
  }
}

export function createAdminClient(): DbClient {
  return {
    from<T extends TableName>(table: T): SqliteQuery<RowMap[T]> {
      assertValidTable(table);
      return new SqliteQuery<RowMap[T]>(table);
    },
  };
}
