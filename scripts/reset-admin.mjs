// Reset/inspect the admin user on a Turso database without installing the Turso CLI.
//
// Usage (PowerShell):
//   $env:TURSO_URL="libsql://..."
//   $env:TURSO_AUTH_TOKEN="..."
//   node scripts/reset-admin.mjs list     # show the users rows
//   node scripts/reset-admin.mjs password <email> <password>
//   node scripts/reset-admin.mjs delete --yes   # DESTRUCTIVE, see below
//
// The app seeds the admin account from ADMIN_EMAIL / ADMIN_PASSWORD whenever the
// users table is empty, so after `delete` just open the site once and log in.
//
// `delete` is destructive: the users table is also the profile (name, bio,
// socials, avatar, resume), and the re-seed restores demo.json values, so your
// profile is lost. Prefer `password` — it only touches password_hash and is
// what you want in every "I can't log in" situation.

import { createClient } from "@libsql/client";
import { randomBytes, scryptSync } from "node:crypto";

const url = process.env.TURSO_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("Set TURSO_URL first, e.g.  $env:TURSO_URL=\"libsql://...\"");
  process.exit(1);
}

const command = process.argv[2] ?? "list";
if (command !== "list" && command !== "delete" && command !== "password") {
  console.error('Usage: node scripts/reset-admin.mjs [list|delete|password] [email] [password]');
  process.exit(1);
}

const db = createClient({ url, authToken: token });

if (command === "list") {
  const { rows } = await db.execute(
    "SELECT id, email, password_hash FROM users ORDER BY created_at",
  );
  console.log(`users: ${rows.length}`);
  for (const row of rows) {
    const hash = String(row.password_hash ?? "");
    console.log(`  ${String(row.id).slice(0, 8)}  ${row.email}  ${
      hash ? `${hash.split(":")[0].slice(0, 12)}:${hash.split(":")[1]?.slice(0, 12)}...` : "(no hash)"
    }`);
  }
} else if (command === "delete") {
  if (!process.argv.includes("--yes")) {
    console.error("Refusing to run: `delete` also erases the profile stored in `users`.");
    console.error("Use `password <email> <password>` instead — it only changes password_hash.");
    console.error("If you really do want a wipe, re-run with --yes.");
    process.exit(1);
  }
  const result = await db.execute("DELETE FROM users");
  console.log(`Deleted ${result.rowsAffected} user row(s).`);
  console.log("Next request to the site will re-seed the admin from ADMIN_EMAIL / ADMIN_PASSWORD.");
  console.log("(Only if ADMIN_EMAIL / ADMIN_PASSWORD env vars are set correctly in Vercel!)");
} else if (command === "password") {
  const email = (process.argv[3] ?? "").trim().toLowerCase();
  const password = process.argv[4];

  if (!email || !password) {
    console.error("Usage: node scripts/reset-admin.mjs password <email> <password>");
    process.exit(1);
  }

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [email],
  });
  if (existing.rows.length === 0) {
    console.error(`No user with email ${email}. Run \`list\` to see the accounts.`);
    process.exit(1);
  }

  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  const result = await db.execute({
    sql: "UPDATE users SET password_hash = ? WHERE email = ?",
    args: [`${salt}:${hash}`, email],
  });
  console.log(`Updated password for ${email} (${result.rowsAffected} row).`);
  console.log("Only password_hash changed — the profile columns are untouched.");
}

process.exit(0);
