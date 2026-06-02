# SvelteKit Starter Kit

A modern [SvelteKit](https://svelte.dev/docs/kit) starter project (Svelte 5, runes mode) with TypeScript, Tailwind CSS v4, Drizzle ORM + PostgreSQL, oxlint/oxfmt, and conventional commits.

## Tech Stack

| Category         | Tooling                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Framework        | [SvelteKit](https://svelte.dev/docs/kit) 2.x + Svelte 5 (runes)     |
| Styling          | [Tailwind CSS](https://tailwindcss.com) v4 (Vite plugin)            |
| Database         | [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL via `postgres` |
| Local DB         | Docker Compose (`compose.yaml`)                                     |
| Language         | TypeScript (strict)                                                 |
| Linting          | [oxlint](https://oxc.rs)                                            |
| Formatting       | [oxfmt](https://oxc.rs)                                             |
| Unit tests       | [Vitest](https://vitest.dev)                                        |
| Git hooks        | Husky + lint-staged + commitlint (conventional commits)             |
| Package manager  | pnpm 11.5                                                           |
| Node requirement | >= 24                                                               |

## Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript compile + Vite build
pnpm preview       # Preview production build
pnpm lint          # oxlint --fix
pnpm format        # oxfmt --write .
pnpm test          # vitest run
pnpm test:watch    # vitest (watch mode)
pnpm test:coverage # vitest run --coverage
pnpm check         # svelte-kit sync + svelte-check
pnpm commit        # git-cz (commitizen with commitlint)
pnpm db:start      # docker compose up (PostgreSQL)
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate    # drizzle-kit migrate
pnpm db:push       # drizzle-kit push
pnpm db:studio     # drizzle-kit studio
```

## Getting Started

```bash
pnpm install
pnpm db:start        # Start PostgreSQL via Docker
pnpm db:push         # Push schema to local DB
pnpm dev             # Start dev server
```

Copy `.env.example` to `.env` — the default credentials match `compose.yaml`.

## Project Structure

```
.
├── .agents/skills/          # Agent skill definitions (doc-coauthoring, drizzle, etc.)
├── .husky/                  # Git hooks (pre-commit, commit-msg)
├── .opencode/               # OpenCode AI configuration
├── .vscode/                 # VS Code settings + extension recommendations
├── ai-docs/                 # AI task templates
├── src/
│   ├── lib/
│   │   ├── assets/          # Static assets (favicon)
│   │   ├── server/db/       # Drizzle client + schema (PostgreSQL)
│   │   └── vitest-examples/ # Sample tests (greet, Welcome.svelte)
│   ├── routes/
│   │   ├── +layout.svelte   # Root layout (Tailwind + favicon)
│   │   ├── +page.svelte     # Home page
│   │   └── layout.css       # Tailwind import
│   ├── app.d.ts             # SvelteKit app types
│   └── app.html             # HTML shell
├── static/                  # Public assets (robots.txt)
├── compose.yaml             # PostgreSQL service
├── commitlint.config.mjs    # Conventional commit config
├── drizzle.config.ts        # Drizzle Kit config
├── svelte.config.js         # SvelteKit config (runes mode forced)
├── vite.config.ts           # Vite + Vitest config
└── pnpm-workspace.yaml      # pnpm settings
```
