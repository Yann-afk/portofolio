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

Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
with the default account `admin@demo.dev` / `demo1234` — override both via
`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`.

- `/admin` — dashboard with content counts and recent messages.
- `/admin/projects` — create/edit/delete projects, pick skills, set category/featured.
- `/admin/skills` — add/remove skills shown in the About marquee.
- `/admin/experience` — work/education/organization/award timeline entries.
- `/admin/messages` — read/toggle/delete contact form messages.
- `/admin/settings` — edit the profile shown in Hero and About.

Admin routes are guarded by `proxy.ts` (verifies a signed, stateless session
cookie) and re-checked in the layout. Passwords are stored as scrypt hashes.

## Environment

Copy `.env.example` to `.env.local` to override defaults:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` | `local-dev-secret-change-me` | Signs the `admin_session` cookie — set a strong value in production |
| `DATABASE_PATH` | `data/portofolio.db` | SQLite database file location |
| `ADMIN_EMAIL` | `admin@demo.dev` | Default admin email created on first run |
| `ADMIN_PASSWORD` | `demo1234` | Default admin password created on first run |
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

3. Push to the connected Git repo. On first request the Turso database
   auto-creates its tables and seeds placeholder content (the local
   `data/demo.json` is git-ignored and not deployed).

The database layer is interchangeable: with `TURSO_URL` set it talks to Turso;
otherwise it uses the local SQLite file.

> Note: changing `ADMIN_EMAIL` / `ADMIN_PASSWORD` after first run does not update
> an existing database. Delete `data/portofolio.db` (or edit the row in the
> `users` table) to reset the account.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
