# Portfolio

Personal portfolio built with Next.js, Tailwind CSS, Framer Motion, and SQLite.

## Tech Stack

- **Next.js 16** (App Router, Turbopack, Server Actions, `proxy.ts`)
- **Tailwind CSS v4** + `next-themes` (dark/light toggle, default dark)
- **Framer Motion** for scroll animations
- **SQLite** (`node:sqlite`, built into Node 24+) for data, sessions, and admin auth — or **Turso** (libSQL) in production

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No database setup is required. On first run the app creates
`data/portofolio.db` automatically: tables are created and seeded from
`data/demo.json` when present (otherwise placeholder content is used).

## Admin Panel

Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

On a **fresh** database the admin account is seeded from `ADMIN_EMAIL` /
`ADMIN_PASSWORD`, which fall back to `admin@demo.dev` / `demo1234`. Those
fallbacks are development conveniences only — set both variables before you
deploy. Seeding runs **only when the `users` table is empty**
(`lib/db/database.ts`), so changing the variables later does not touch an
existing account.

- `/admin` — dashboard with content counts and recent messages.
- `/admin/projects` — create/edit/delete projects, pick skills, set category/featured.
- `/admin/skills` — add/remove skills shown in the About marquee.
- `/admin/experience` — work/education/organization/award timeline entries.
- `/admin/messages` — read/toggle/delete contact form messages.
- `/admin/settings` — edit the profile shown in Hero and About, and change the
  admin password.

Every mutating server action calls `requireSessionUser()`
(`lib/db/require-session.ts`) before touching the database, so the actions are
safe independently of `proxy.ts`, which is only a routing-level convenience.
Passwords are stored as scrypt hashes.

The session cookie carries the salt of the password it was issued against, so
changing the password invalidates every existing session on every device.

### Locked out?

The `users` table doubles as the profile table, so do **not** delete rows to
reset a password — that discards your name, bio, socials, avatar and resume,
and the re-seed restores `data/demo.json` values. Use the password command,
which only rewrites `password_hash`:

```bash
export TURSO_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
npm run admin:list                                  # which accounts exist
npm run admin:password -- you@example.com 'new-password'
```

Locally, point `TURSO_URL` at the SQLite file instead
(`file:data/portofolio.db`) to run the same commands offline.

## Environment

Copy `.env.example` to `.env.local` to override defaults:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | `local-dev-secret-change-me` | Signs the `admin_session` cookie. **Required in production** — the app throws on startup/login while the default is set |
| `DATABASE_PATH` | `data/portofolio.db` | SQLite database file location |
| `ADMIN_EMAIL` | `admin@demo.dev` | Admin email, used only when seeding an empty `users` table |
| `ADMIN_PASSWORD` | `demo1234` | Admin password, used only when seeding an empty `users` table |
| `TURSO_URL` | *(unset)* | When set, the app uses Turso/libSQL instead of the local file (see below) |
| `TURSO_AUTH_TOKEN` | *(unset)* | Turso auth token for `TURSO_URL` |

## Deploying to Vercel with Turso

Local SQLite files don't persist on Vercel's serverless runtime, so point the
app at a Turso (libSQL) database. The free tier includes 100 databases / 5 GB —
no credit card required.

1. Create a database and token:

   ```bash
   npm i -g @turso/cli
   turso auth login
   turso db create portofolio
   turso db show portofolio --url
   turso db tokens create portofolio
   ```

2. In the Vercel dashboard (Project → Settings → Environment Variables) set:

   - `TURSO_URL` = the `libsql://...` URL
   - `TURSO_AUTH_TOKEN` = the token
   - `SESSION_SECRET` = a long random string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` = your admin credentials

   Generate the secret with `openssl rand -base64 32`. Without it the app
   refuses to sign or verify sessions in production.

3. Push to the connected Git repo. On first request the Turso database
   auto-creates its tables and seeds placeholder content (the local
   `data/demo.json` is git-ignored and not deployed).

The database layer is interchangeable: with `TURSO_URL` set it talks to Turso;
otherwise it uses the local SQLite file. **These are separate databases** — a
password reset run against the local file has no effect on the deployed site.

> Note: changing `ADMIN_EMAIL` / `ADMIN_PASSWORD` after first run does not update
> an existing database. Use `npm run admin:password` (see [Locked out?](#locked-out)).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run admin:list` — list admin accounts in the configured database
- `npm run admin:password` — set a password for an account
