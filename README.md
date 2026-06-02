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
├── .agents/skills/          # Agent skills (see below for details)
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

```

```
