# AGENTS.md

AI guidance for this repo. Read first.

# Verification Workflow (MANDATORY)

After **every** code modification, run in order:

```bash
pnpm lint      # 1. Lint — zero errors and warnings
pnpm build     # 2. Build — TypeScript compile + Vite build must succeed
pnpm check     # 3. Typecheck
## after user confirms the code modification, then run below
pnpm test      # 4. Test — zero errors and warnings
pnpm test:e2e  # 5. E2E — zero errors and warnings
```

Any step fails → fix immediately before proceeding. Add/update test cases after user confirms results.

# Commands

- `pnpm dev` — Dev server (usually running; don't run without confirmation)
- `pnpm test` — `vitest run` (single run)
- `pnpm test:coverage` — `vitest run --coverage`

# Architecture

See README.md (root folder).

# Skills

Default **caveman** ON for all tasks → cut tokens (prose only; code/commits/PRs stay normal).

| Skill                                | When to invoke                                                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| caveman                              | ALL tasks. Global user skill, not in repo (https://github.com/juliusbrussee/caveman). Default on to reduce token usage. |
| karpathy-guidelines                  | Every coding task.                                                                                                      |
| doc-coauthoring                      | Add or modify documentation.                                                                                            |
| session-handoff                      | Create task plans + execution logs for handoff across models/sessions. Private skill, not committed.                    |
| prisma-database-setup                | Prisma ORM setup across DB providers.                                                                                   |
| prisma-client-api                    | Prisma Client model queries, CRUD, filters, relations, transactions.                                                    |
| prisma-cli                           | Prisma CLI commands, options, migrations.                                                                               |
| prisma-postgres                      | Create/manage/integrate Prisma Postgres.                                                                                |
| prisma-driver-adapter-implementation | Implement a Prisma v7 driver adapter.                                                                                   |
| svelte-code-writer                   | MUST when creating/editing/analyzing any `.svelte` or `.svelte.ts`/`.svelte.js`.                                        |
| svelte-core-bestpractices            | Writing/analyzing any Svelte component or module.                                                                       |

# MCP

If any server below is missing or disabled, warn user before starting the task.

| Server          | Use                                                                                                                                                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| svelte          | Svelte/SvelteKit tasks. Flow: `list-sections` first (discover) → `get-documentation` (fetch ALL relevant sections per use_cases) → `svelte-autofixer` (MUST before showing code; loop until no issues) → `playground-link` (only after user confirms, NEVER if code was written to project files). |
| context7        | Query library/framework/API docs.                                                                                                                                                                                                                                                                  |
| chrome-devtools | Verify results in the running app.                                                                                                                                                                                                                                                                 |
| Prisma-Local    | Prisma DB ops (migrate, studio).                                                                                                                                                                                                                                                                   |
