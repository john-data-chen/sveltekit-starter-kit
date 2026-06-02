[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=john-data-chen_sveltekit-starter-kit&token=6c61941d26a0ba1e36bc438f28dba039c8e3700d)](https://sonarcloud.io/summary/new_code?id=john-data-chen_sveltekit-starter-kit)

# SvelteKit Starter Kit

A modern [SvelteKit](https://svelte.dev/docs/kit) starter project (Svelte 5, runes mode) with TypeScript, Tailwind CSS v4, Drizzle ORM + PostgreSQL, oxlint/oxfmt (with ESLint/Prettier for Svelte), and conventional commits.

## Expense Tracker (demo app)

Built on top of the starter, this repo ships a minimal multi-user expense tracker:

- **Passwordless email login** — three built-in accounts (`john@example.com`, `sophia@example.com`, `mark@example.com`). The login form is pre-filled with `john@example.com`, so you can press **Continue With Email** to sign in immediately. The signed-in `userId` is kept in a signed, httpOnly session cookie.
- **Transactions CRUD** — record income/expense entries (amount, type, category, date, optional note).
- **List & filter** — filter transactions by category and by month; the filters live in the URL.
- **Dashboard** — current-month income / expense / balance plus a category-share donut chart built with **pure CSS** (no charting dependency).
- **Per-user data isolation** — every query is scoped to the signed-in user; you only ever see your own data.
- **Currency** — TWD only, stored as integers (no decimals).

Categories are fixed lists in `src/lib/categories.ts`; the cookie is signed with `SESSION_SECRET` from `.env`.

## Tech Stack

| Category         | Tooling                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| Framework        | [SvelteKit](https://svelte.dev/docs/kit) 2.x + Svelte 5 (runes)                |
| Styling          | [Tailwind CSS](https://tailwindcss.com) v4 (Vite plugin)                       |
| Database         | [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL via `postgres`            |
| Local DB         | Docker Compose (`compose.yaml`)                                                |
| Language         | TypeScript (strict)                                                            |
| Linting          | [oxlint](https://oxc.rs) (JS/TS) + [ESLint](https://eslint.org) (Svelte)       |
| Formatting       | [oxfmt](https://oxc.rs) (JS/TS/etc) + [Prettier](https://prettier.io) (Svelte) |
| Unit tests       | [Vitest](https://vitest.dev)                                                   |
| E2E tests        | [Playwright](https://playwright.dev)                                           |
| Git hooks        | Husky + lint-staged + commitlint (conventional commits)                        |
| Package manager  | pnpm 11.5                                                                      |
| Node requirement | >= 24                                                                          |

## Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript compile + Vite build
pnpm preview       # Preview production build
pnpm lint          # oxlint --fix (JS/TS) + eslint (Svelte)
pnpm format        # oxfmt --write . (JS/TS/etc) + prettier --write Svelte
pnpm test          # vitest run
pnpm test:watch    # vitest (watch mode)
pnpm test:coverage # vitest run --coverage
pnpm test:e2e      # Playwright e2e (needs a seeded local DB + dev server)
pnpm check         # svelte-kit sync + svelte-check
pnpm commit        # git-cz (commitizen with commitlint)
pnpm db:start      # docker compose up (PostgreSQL)
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate    # drizzle-kit migrate
pnpm db:push       # drizzle-kit push
pnpm db:seed       # Seed 3 demo users + sample transactions
pnpm db:studio     # drizzle-kit studio
```

## Getting Started

```bash
pnpm install
cp .env.example .env   # set DATABASE_URL + SESSION_SECRET
pnpm db:start          # Start PostgreSQL via Docker
pnpm db:migrate        # Apply migrations to the local DB
pnpm db:seed           # Seed 3 demo users + sample transactions
pnpm dev               # Start dev server
```

The default `DATABASE_URL` in `.env.example` matches `compose.yaml`. Set `SESSION_SECRET` to any long random string — it signs the session cookie. Then open the dev server and press **Continue With Email** to sign in as `john@example.com`.

## Deployment (Vercel)

The app targets Vercel via the `@sveltejs/adapter-vercel` adapter (Node.js serverless runtime — required for the `postgres` TCP driver). A GitHub Actions workflow (`.github/workflows/ci.yml`) runs CI on every push/PR and, on push to `main`, deploys to Vercel with the Vercel CLI.

One-time setup:

1. Create/link a Vercel project (`vercel link`, or import the repo in the Vercel dashboard).
2. Add these **GitHub Actions secrets** (repo → Settings → Secrets and variables → Actions):
   - `VERCEL_TOKEN` — a Vercel access token
   - `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — found in `.vercel/project.json` after `vercel link`
3. Add these **Vercel project environment variables** (Production):
   - `DATABASE_URL` — a production PostgreSQL connection string (e.g. [Neon](https://neon.tech))
   - `SESSION_SECRET` — a long random string
4. Apply the schema to the production database once, and after any schema change:

   ```bash
   DATABASE_URL="<prod-url>" pnpm db:migrate   # optionally: pnpm db:seed
   ```

## Project Structure

```
.
├── .agents/skills/          # Agent skills (see below for details)
├── .husky/                  # Git hooks (pre-commit, commit-msg)
├── .opencode/               # OpenCode AI configuration
├── .vscode/                 # VS Code settings + extension recommendations
├── ai-docs/                 # AI task templates + session-handoff logs
├── src/
│   ├── lib/
│   │   ├── assets/          # Static assets (favicon)
│   │   ├── components/      # Shared components (TransactionForm, CategoryChart)
│   │   ├── server/          # Server-only: auth, validation, db/ (client, schema, queries, seed)
│   │   ├── categories.ts    # Fixed income/expense category lists
│   │   └── money.ts         # TWD integer formatting/parsing
│   ├── routes/
│   │   ├── login/           # Email sign-in (page + action)
│   │   ├── logout/          # Sign-out action
│   │   ├── transactions/    # List + filter, new, [id]/edit (CRUD)
│   │   ├── +layout.svelte   # Root layout (header/nav when signed in)
│   │   ├── +layout.server.ts# Loads the user + guards protected routes
│   │   ├── +page.svelte     # Dashboard (stats + pure-CSS chart)
│   │   └── layout.css       # Tailwind import
│   ├── hooks.server.ts      # Resolves the session cookie → locals.user
│   ├── app.d.ts             # SvelteKit app types (Locals.user)
│   └── app.html             # HTML shell
├── static/                  # Public assets (robots.txt)
├── drizzle/                 # Generated SQL migrations (drizzle-kit)
├── compose.yaml             # PostgreSQL service
├── commitlint.config.mjs    # Conventional commit config
├── drizzle.config.ts        # Drizzle Kit config
├── svelte.config.js         # SvelteKit config (runes mode forced)
├── vite.config.ts           # Vite + Vitest config
└── pnpm-workspace.yaml      # pnpm settings
```

## AI Agent Skills

The `.agents/skills/` directory contains skill definitions that guide AI coding assistants (via AGENTS.md) when working in this repo.

| Skill                         | Description                                                                                                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **doc-coauthoring**           | Structured 3-stage workflow (Context Gathering → Refinement → Reader Testing) for co-authoring documentation, proposals, technical specs, and decision docs.                                                                                                                   |
| **drizzle**                   | Drizzle ORM schema conventions: pgTable with plural snake_case, `db.select()` builder API (not relational `db.query`), explicit JOINs, and separate queries for one-to-many. Config aligns with `drizzle.config.ts`.                                                           |
| **karpathy-guidelines**       | Reduces LLM coding mistakes: Think before coding (surface assumptions), simplicity first (no speculative features), surgical changes (touch only what's needed), and goal-driven execution (define then verify).                                                               |
| **session-handoff**           | Maintains `ai-docs/tasks.md` + `ai-docs/session-log.md` so work hands off cleanly across AI sessions. Breaks goals into verifiable sub-tasks, logs every checkpoint, and produces handoff notes for the next session.                                                          |
| **svelte-code-writer**        | CLI tools (`npx @sveltejs/mcp`) for Svelte 5 docs lookup, code analysis, and auto-fixing. Must be used when creating/editing any `.svelte` file or module.                                                                                                                     |
| **svelte-core-bestpractices** | Guidance for Svelte 5 runes mode: prefer `$state` for reactive vars, `$derived` over `$effect` for computed values, avoid legacy features (`export let`, `on:click`, slots), use `{@render}`/`{#snippet}` instead of slots, and attach event listeners via element attributes. |
