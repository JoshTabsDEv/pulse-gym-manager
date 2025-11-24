## Pulse Gym Management

A minimal Vercel-ready gym management system using **Next.js App Router**, **Tailwind CSS**, **NextAuth**, and **MySQL** (via `mysql2`). It ships with:

- Admin-only CRUD over gym members (create, update, delete)
- Read-only dashboard for regular users
- Credentials login for the built-in `admin`/`admin` account
- Google OAuth sign-in that automatically provisions the `user` role
- REST-style API routes backed by MySQL, no Prisma required

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS (v4) for styling
- NextAuth (JWT sessions) with Credentials + Google providers
- MySQL via `mysql2/promise`

## Database

Run the SQL in `db/schema.sql` on your MySQL instance to provision the single `members` table. The table stores:

```
id, full_name, membership_type, status, start_date, end_date,
created_at, updated_at
```

## Environment variables

Copy `env.example` to `.env.local` (or the environment panel on Vercel) and fill in the values:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Standard MySQL connection string |
| `NEXTAUTH_SECRET` | Random 32+ char string |
| `NEXTAUTH_URL` | Usually `http://localhost:3000` in dev |
| `GOOGLE_CLIENT_ID` | OAuth client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `ADMIN_USERNAME` | Defaults to `admin` |
| `ADMIN_PASSWORD` | Defaults to `admin` |

> Google login is automatically disabled until both Google env vars are provided.

## Getting started locally

```bash
# install dependencies
npm install

# run the dev server
npm run dev
```

Visit `http://localhost:3000`.

- Admin portal: use `/login` with the configured admin credentials (default `admin` / `admin`).
- User dashboard: click “Continue with Google” after setting the OAuth keys. Every Google login is assigned the `user` role and lands on `/dashboard`.

## Deployment

1. Push this repo to GitHub/GitLab.
2. Create a new Vercel project, importing that repository.
3. Add the same environment variables in the Vercel dashboard (Production + Preview).
4. Provide a managed MySQL instance (Neon, Planetscale, etc.) or Vercel MySQL and load `db/schema.sql`.
5. Deploy—Vercel will install dependencies, run `next build`, and host the app globally.

## Project layout

```
src/
  app/
    admin/          # Admin dashboard with CRUD
    dashboard/      # Read-only user dashboard
    login/          # Auth entry point (credentials + Google)
    api/members/    # REST endpoints for member CRUD
    api/auth/       # NextAuth route handler
  components/       # UI + forms
  lib/              # Auth options, DB pool, member queries, validation
  types/            # Shared TS contracts (Members, NextAuth extensions)
db/schema.sql       # MySQL schema
middleware.ts       # Route protection + role guard
```

Everything is ready for production; just plug in your database and OAuth keys.
