# Pulse — CEO/PMO Operating System

A task and project management dashboard built with React, Vite, Tailwind CSS, and Supabase.

## Two-environment setup

This project uses two separate Supabase projects: one for production data and one for development/testing.

### Environment files

| File | Purpose |
|------|---------|
| `.env` | **Production** — contains real Supabase credentials. Never commit this file. |
| `.env.development` | **Development** — points to a test Supabase project with dummy data. Safe to commit placeholder values. |

Vite automatically loads `.env.development` when you run `npm run dev` and `.env` (or `.env.production`) for production builds.

### Setting up your dev environment

1. Create a new Supabase project for development at [supabase.com](https://supabase.com).
2. Run the same schema migrations as production (tables: `entities`, `tasks`, `ideas`, `people`, `projects`).
3. Copy your dev project's URL and anon key into `.env.development`.
4. Run `npm run dev` — it will connect to your dev Supabase automatically.

### Running the app

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (uses .env.development)
npm run build     # Production build (uses .env)
npm run preview   # Preview production build locally
```

## Features

- **Dashboard** — Full / Nums / People / Ideas / Projects view toggles
- **Projects** — Create and manage projects linked to entities; drill down to project task lists
- **Orphans** — Badge and dedicated tab for tasks/ideas missing owner or entity
- **History** — Full task log with filters, sort, Days-to-Complete column, and Excel export
- **Settings** — Manage people, entities, sections, and projects
