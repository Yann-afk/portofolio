# Portfolio

Personal portfolio built with Next.js, Tailwind CSS, Framer Motion, and SQLite.

## Tech Stack

- **Next.js 16** (App Router, Turbopack, Server Actions, `proxy.ts`)
- **Tailwind CSS v4** + `next-themes` (dark/light toggle, default dark)
- **Framer Motion** for scroll animations
- **SQLite** (`node:sqlite`, built into Node 24+) for data, sessions, and admin auth

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

> Note: changing `ADMIN_EMAIL` / `ADMIN_PASSWORD` after first run does not update
> an existing database. Delete `data/portofolio.db` (or edit the row in the
> `users` table) to reset the account.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
