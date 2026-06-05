# SvelteKit Expense Tracker | Full-Stack Starter with AI-Assisted Engineering

[![codecov](https://codecov.io/gh/john-data-chen/sveltekit-starter-kit/graph/badge.svg?token=9Mdwd8ibQs)](https://codecov.io/gh/john-data-chen/sveltekit-starter-kit)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=john-data-chen_sveltekit-starter-kit&metric=alert_status&token=6c61941d26a0ba1e36bc438f28dba039c8e3700d)](https://sonarcloud.io/summary/new_code?id=john-data-chen_sveltekit-starter-kit)
[![CI](https://github.com/john-data-chen/sveltekit-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/john-data-chen/sveltekit-starter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade SvelteKit starter kit built around a real multi-user **expense tracker**, demonstrating technical decision-making, quality engineering, and AI-assisted development practices. Built with Svelte 5 (runes mode), TypeScript, Tailwind CSS v4, and Drizzle ORM + PostgreSQL.

**[Live Demo](https://sveltekit-starter-kit.vercel.app/login)** — press **Continue With Email** to sign in instantly as a seeded demo user.

繁體中文版本請見 **[README-cht.md](./README-cht.md)**.

<table>
  <tr>
    <td align="center"><img src="./src/lib/assets/screenshots/login.png" alt="Passwordless email login screen, pre-filled with a demo account" width="200"></td>
    <td align="center"><img src="./src/lib/assets/screenshots/dashboard.png" alt="Dashboard showing monthly income, expense, balance and a pure-CSS category donut chart" width="200"></td>
    <td align="center"><img src="./src/lib/assets/screenshots/transactions.png" alt="Transaction list with category and month filters, plus edit and delete actions" width="200"></td>
    <td align="center"><img src="./src/lib/assets/screenshots/add-new-record.png" alt="New transaction form with type, category, amount, date and optional note fields" width="200"></td>
  </tr>
  <tr>
    <td align="center"><b>Login</b></td>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>Transactions</b></td>
    <td align="center"><b>Add Record</b></td>
  </tr>
</table>

---

| Metric         | Result                                                                              |
| -------------- | ----------------------------------------------------------------------------------- |
| Test Coverage  | See **codecov** badge above — measured via Vitest (unit + integration)              |
| Code Quality   | See **SonarQube Quality Gate** badge above (Security, Reliability, Maintainability) |
| E2E Validation | Cross-browser via Playwright (Chrome / Edge / Safari)                               |
| CI/CD Pipeline | GitHub Actions → Gemini PR Review + SonarQube + Codecov → Vercel                    |

---

## Technical Decisions

### Architecture

| Type       | Choice                                         | Rationale                                                                                  |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Framework  | SvelteKit 2 + Svelte 5 (runes)                 | Fine-grained reactivity, minimal boilerplate, SSR + form actions                           |
| Styling    | Tailwind CSS v4 (Vite plugin)                  | Utility-first, zero-runtime, fast builds via the v4 Vite plugin                            |
| Database   | Drizzle ORM + PostgreSQL                       | Type-safe SQL with explicit queries; lightweight, no heavy ORM                             |
| DB Driver  | `postgres` (TCP)                               | Fast pooled driver; pairs with the Vercel Node serverless runtime                          |
| Auth       | Password-less email + signed `httpOnly` cookie | No password storage; minimal, secure session model                                         |
| Validation | Zod (server-side schemas)                      | Runtime validation at form-action boundaries — TS at compile time, Zod for untrusted input |
| Charts     | Pure CSS donut                                 | Zero charting dependency — smaller bundle, full control                                    |
| i18n       | Paraglide JS (`@inlang/paraglide-js`)          | Type-safe, tree-shakeable messages; English + Traditional Chinese                          |
| Deploy     | `@sveltejs/adapter-vercel` (Node serverless)   | Node runtime required for the `postgres` TCP driver                                        |

### Quality Assurance

| Type              | Tool       | Rationale                                   |
| ----------------- | ---------- | ------------------------------------------- |
| Unit/Integration  | Vitest     | Faster than Jest, native ESM, Vite-native   |
| E2E               | Playwright | Cross-browser support, lighter than Cypress |
| Static Analysis   | SonarQube  | Quality gates enforced in CI                |
| Coverage Tracking | Codecov    | Automated PR integration                    |

**Testing Strategy:**

- Unit tests target query logic, validation, and money formatting/parsing
- E2E tests validate critical flows (login, transaction CRUD)
- Every push/PR triggers the full pipeline before merge (Free server is not powerful enough, so CI only executes unit tests)

### Developer Experience

| Tool                       | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| oxlint                     | Rust-based linter for JS/TS, 50-100x faster than ESLint |
| oxfmt                      | Rust-based formatter for JS/TS/CSS/HTML/JSON/MD         |
| ESLint + Prettier (Svelte) | Svelte-aware lint/format for `.svelte` files            |
| Vite                       | Near-instant HMR and fast production builds             |
| Husky + lint-staged        | Pre-commit quality enforcement                          |
| commitlint + Commitizen    | Conventional commits for a clean history                |

---

## Features

- **Password-less email login** — three built-in accounts (`john@example.com`, `sophia@example.com`, `mark@example.com`); the form is pre-filled with `john@example.com`, so one click signs you in. The `userId` lives in a signed, `httpOnly` session cookie.
- **Transactions CRUD** — record income/expense entries (amount, type, category, date, optional note).
- **List & filter** — filter transactions by category and by month; filter state lives in the URL.
- **Dashboard** — current-month income / expense / balance plus a category-share donut chart built with **pure CSS** (no charting dependency).
- **Per-user data isolation** — every query is scoped to the signed-in user; you only ever see your own data.
- **Currency** — TWD only, stored as integers (no decimals).
- **i18n** — English and Traditional Chinese (Paraglide JS).
- **Theme switching** — light / dark / system.
- **Responsive design** — mobile-first, scales to desktop.

Categories are fixed lists in `src/lib/categories.ts`; the session cookie is signed with `SESSION_SECRET` from `.env`.

---

## AI-Augmented Engineering Workflow

This project was built with a "Human-in-the-Loop" approach where AI tools are orchestrated to amplify engineering impact — focusing not just on code generation, but on **architectural leverage, rigorous quality assurance, and accelerated velocity**.

### AI Agent Skills (`.agents/skills/`)

Skills are committed to the repo and surfaced to AI assistants via `AGENTS.md` / `CLAUDE.md`. Each skill encodes instructions and conventions the assistant must follow.

| Skill                                                                                    | Responsibility                                                                                                              |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [karpathy-guidelines](https://github.com/forrestchang/andrej-karpathy-skills)            | Reduce LLM coding mistakes: surface assumptions, simplicity first, surgical changes, goal-driven loops                      |
| [doc-coauthoring](https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring) | 3-stage workflow (Context → Refinement → Reader Testing) for co-authoring docs (this README is made by user and this skill) |
| **session-handoff (my private skill)**                                                   | Maintain `ai-docs/tasks.md` + `ai-docs/session-log.md` so work hands off cleanly across AI sessions                         |
| [drizzle](https://skillsmp.com/skills/lobehub-lobehub-agents-skills-drizzle-skill-md)    | Drizzle ORM best practices                                                                                                  |
| [svelte-code-writer](https://svelte.dev/docs/ai/skills)                                  | CLI tooling for Svelte 5 docs lookup and code analysis when creating/editing any `.svelte` file                             |
| [velte-core-bestpractices](https://svelte.dev/docs/ai/skills)                            | Guidance on writing fast, robust, modern Svelte code.                                                                       |

### MCP (Model Context Protocol) Servers

MCP lets AI tools interact directly with development infrastructure, removing context-switching overhead.

| Server                                                                       | Integration Point | Workflow Enhancement                                                                         |
| ---------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| [svelte-mcp](https://svelte.dev/docs/ai/mcp)                                 | Svelte docs       | Official Svelte 5 / SvelteKit docs, examples, and code autofixing (committed in `.mcp.json`) |
| [context7](https://github.com/upstash/context7)                              | Documentation     | Current, version-accurate library docs for AI agents                                         |
| [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Browser state     | Lets AI agents inspect and verify the running app via the DevTools Protocol                  |

### AI Guidelines (`AGENTS.md` / `CLAUDE.md`)

Project-specific instructions for AI assistants: the mandatory verification workflow (`pnpm lint` → `pnpm build` → `pnpm check`), commands, and which skills/MCP servers to use for which tasks. AI tools should read this file first when working on the repo.

### Measurable Impact

By treating AI as an integrated part of the stack, this project achieves:

- **Velocity**: 5-10x faster implementation of boilerplate and standard patterns, reduce time of PR review 30~40% by Gemini Code Assist.
- **Quality**: Higher test coverage (80%+) through AI-generated test scaffolding, and PR review by Gemini Code Assist to reduce bugs and bed smell.
- **Learning**: Rapid mastery of new tools (Svelte, Sveltekit, Drizzle...and more) via AI-guided implementation.
- **Cost**: Lower costs by using AI agents skills to reduce tokens and match the best practices.
- **Focus**: Shifted engineering time from syntax to system architecture and user experience.

---

## Quick Start

### Requirements

- Node.js >= 24
- pnpm 11.5+
- Docker / OrbStack (for local PostgreSQL)

### Setup

```bash
pnpm install

# Environment — set DATABASE_URL + SESSION_SECRET
cp .env.example .env

# Database
pnpm db:start          # Start PostgreSQL via Docker (compose.yaml)
pnpm db:migrate        # Apply migrations to the local DB
pnpm db:seed           # Seed 3 demo users + sample transactions

# Run
pnpm dev               # Development server
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests (needs a seeded DB + dev server)
pnpm build             # Production build
```

The default `DATABASE_URL` in `.env.example` matches `compose.yaml`. Set `SESSION_SECRET` to any long random string — it signs the session cookie. Then open the dev server (default `http://localhost:5173`) and press **Continue With Email** to sign in as `john@example.com`.

### Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript compile + Vite build
pnpm preview       # Preview production build
pnpm lint          # oxlint --fix (JS/TS) + eslint (Svelte)
pnpm format        # oxfmt --write . (JS/TS/etc) + prettier --write Svelte
pnpm test          # vitest run
pnpm test:coverage # vitest run --coverage
pnpm test:e2e      # Playwright e2e
pnpm check         # svelte-kit sync + svelte-check
pnpm commit        # git-cz (commitizen with commitlint)
pnpm db:start      # docker compose up (PostgreSQL)
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate    # drizzle-kit migrate
pnpm db:push       # drizzle-kit push
pnpm db:seed       # Seed demo users + sample transactions
pnpm db:studio     # drizzle-kit studio
```

---

## Project Structure

```text
.
├── .agents/skills/              # Repo-specific AI skills used by AGENTS.md / CLAUDE.md
│   ├── doc-coauthoring/         # Documentation co-authoring workflow
│   ├── drizzle/                 # Drizzle schema/query conventions
│   ├── karpathy-guidelines/     # Surgical-change and verification discipline
│   ├── session-handoff/         # Maintains ai-docs/tasks.md + session-log.md
│   ├── svelte-code-writer/      # Svelte MCP/CLI lookup and autofix workflow
│   └── svelte-core-bestpractices/
├── .github/workflows/ci.yml     # GitHub Actions: install, test, Codecov, SonarQube
├── .husky/                      # Git hooks (pre-commit, commit-msg)
├── .opencode/                   # OpenCode AI configuration
├── .vscode/                     # VS Code settings + extension recommendations
├── ai-docs/                     # AI task template, task plan, and session log
├── drizzle/                     # Generated SQL migrations + Drizzle metadata snapshots
├── e2e/
│   └── expense.spec.ts          # Playwright login + transaction CRUD happy path
├── messages/                    # Paraglide source messages
│   ├── en.json                  # English UI copy
│   └── zh-tw.json               # Traditional Chinese UI copy
├── src/
│   ├── app.d.ts                 # SvelteKit app types (App.Locals.user)
│   ├── app.html                 # HTML shell with Paraglide lang/dir placeholders
│   ├── hooks.server.ts          # Session lookup, locale middleware, theme class injection
│   ├── lib/
│   │   ├── assets/              # Favicon and README screenshots
│   │   ├── components/          # CategoryChart, LocaleSwitcher, ThemeToggle, TransactionForm
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── index.ts     # Drizzle client using DATABASE_URL
│   │   │   │   ├── queries.ts   # User-scoped CRUD + dashboard aggregates
│   │   │   │   ├── schema.ts    # users / transactions tables and transaction_type enum
│   │   │   │   ├── schema.spec.ts
│   │   │   │   └── seed.ts      # Demo users and transactions
│   │   │   ├── auth.ts          # HMAC-signed httpOnly session cookie
│   │   │   ├── guards.ts        # requireUser protected-route helper
│   │   │   ├── login.ts         # Password-less email lookup
│   │   │   ├── session.ts       # Cookie -> database-backed SessionUser resolver
│   │   │   └── validation.ts    # Zod schemas: transaction form + login email
│   │   ├── categories.ts        # Fixed category keys + localized labels
│   │   ├── constants.ts         # App name, demo email, pageTitle helper
│   │   ├── date.ts              # YYYY-MM / YYYY-MM-DD helpers
│   │   ├── money.ts             # TWD integer formatting/parsing
│   │   ├── theme.svelte.ts      # Client theme store (light / dark / system)
│   │   ├── theme.ts             # Server-safe theme constants and helpers
│   │   └── transaction.ts       # Transaction form value types
│   ├── routes/
│   │   ├── login/               # Password-less email sign-in page/action + route spec
│   │   ├── logout/              # Sign-out action
│   │   ├── transactions/
│   │   │   ├── [id]/edit/       # Edit form load/action, ownership-checked
│   │   │   ├── new/             # Create form load/action
│   │   │   └── +page.*          # List/filter page plus delete action
│   │   ├── +layout.server.ts    # Auth guard and user data for all pages
│   │   ├── +layout.svelte       # App shell, nav, locale/theme controls, logout form
│   │   ├── +page.server.ts      # Dashboard monthly stats loader
│   │   ├── +page.svelte         # Dashboard UI and pure-CSS category chart
│   │   └── layout.css           # Tailwind v4 import and global styles
│   └── *.spec.ts                # Unit/integration specs colocated with source modules
├── static/
│   └── robots.txt               # Public static asset
├── .env.example                 # DATABASE_URL + SESSION_SECRET template
├── .mcp.json                    # Svelte MCP server registration
├── .npmrc                       # pnpm/node package manager settings
├── .oxfmtrc.json                # oxfmt formatter config
├── .oxlintrc.json               # oxlint JS/TS lint rules
├── .prettierignore              # Prettier ignore rules
├── .prettierrc                  # Prettier + Svelte/Tailwind plugin config
├── AGENTS.md                    # AI agent instructions for this repo
├── README.md                    # English README
├── README-cht.md                # Traditional Chinese README
├── commitlint.config.mjs        # Conventional commit config
├── compose.yaml                 # Local PostgreSQL service
├── drizzle.config.ts            # Drizzle Kit config
├── eslint.config.js             # ESLint config for Svelte files
├── package.json                 # Scripts, dependencies, lint-staged, engines
├── playwright.config.ts         # Cross-browser e2e configuration
├── pnpm-lock.yaml               # Locked dependency graph
├── pnpm-workspace.yaml          # pnpm workspace and minimum-release-age policy
├── skills-lock.json             # Locked AI skill/plugin metadata
├── sonar-project.properties     # SonarQube project configuration
├── svelte.config.js             # SvelteKit config, Vercel adapter, forced runes mode
├── tsconfig.json                # TypeScript config extending generated SvelteKit config
└── vite.config.ts               # Vite plugins: Tailwind, SvelteKit, Paraglide; Vitest config
```

---

## Next Generations Tooling Adoption

This project continuously evaluates emerging tools and adopts them based on measurable impact.

### Oxlint (Rust-based Linter)

| Aspect      | Details                                       |
| ----------- | --------------------------------------------- |
| Status      | **Production** — JS/TS linting enabled        |
| Performance | 50-100x faster than ESLint                    |
| Scope       | ESLint + Prettier retained only for `.svelte` |

[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

### Oxfmt (Rust-based Formatter)

| Aspect      | Details                                           |
| ----------- | ------------------------------------------------- |
| Status      | **Production** — formats JS/TS/CSS/HTML/JSON/MD   |
| Performance | ~30x faster than Prettier with instant cold start |
| Scope       | ESLint + Prettier retained only for `.svelte`     |

[Oxfmt](https://oxc.rs/docs/guide/usage/formatter)

---

## Live Demo Constraints

| Aspect       | Current State                                                                              | Production Recommendation           |
| ------------ | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| **Hosting**  | Vercel free tier                                                                           | Paid tier / multi-region deployment |
| **Database** | Free-tier Neon                                                                             | Managed, regionally optimized DB    |
| **Data**     | Seeded demo data; demo accounts shared by visitors, but each account's data stays isolated | Real user accounts with sign-up     |

The demo deployment uses free-tier infrastructure to minimize costs. Production deployments should implement proper regional optimization and real user onboarding.
