// Reset/inspect the admin user on a Turso database without installing the Turso CLI.
//
// Usage (PowerShell):
//   $env:TURSO_URL="libsql://..."
//   $env:TURSO_AUTH_TOKEN="..."
//   node scripts/reset-admin.mjs list     # show the users rows
//   node scripts/reset-admin.mjs delete   # delete all users (app re-seeds on next request)
//
// The app seeds the admin account from ADMIN_EMAIL / ADMIN_PASSWORD whenever the
// users table is empty, so after `delete` just open the site once and log in.

import { createClient } from "@libsql/client";

const url = process.env.TURSO_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("Set TURSO_URL first, e.g.  $env:TURSO_URL=\"libsql://...\"");
  process.exit(1);
}

const command = process.argv[2] ?? "list";
if (command !== "list" && command !== "delete") {
  console.error('Usage: node scripts/reset-admin.mjs [list|delete]');
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
  const result = await db.execute("DELETE FROM users");
  console.log(`Deleted ${result.rowsAffected} user row(s).`);
  console.log("Next request to the site will re-seed the admin from ADMIN_EMAIL / ADMIN_PASSWORD.");
  console.log("(Only if ADMIN_EMAIL / ADMIN_PASSWORD env vars are set correctly in Vercel!)");
}

process.exit(0);
