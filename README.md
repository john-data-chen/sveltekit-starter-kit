# SvelteKit Starter Kit

A modern SvelteKit starter project.

# Architecture

```
.
├── .claude/
│   └── settings.local.json
├── .codex/
│   └── config.toml
├── .opencode/
│   ├── opencode.json
│   ├── svelte.json
│   ├── package.json
│   └── package-lock.json
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── src/
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   ├── server/
│   │   │   └── db/
│   │   │       ├── index.ts
│   │   │       └── schema.ts
│   │   ├── vitest-examples/
│   │   │   ├── greet.ts
│   │   │   ├── greet.spec.ts
│   │   │   ├── Welcome.svelte
│   │   │   └── Welcome.svelte.spec.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── demo/
│   │   │   ├── playwright/
│   │   │   │   ├── +page.svelte
│   │   │   │   └── page.svelte.e2e.ts
│   │   │   └── +page.svelte
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   └── layout.css
│   ├── app.d.ts
│   └── app.html
├── static/
│   └── robots.txt
├── .env
├── .env.example
├── .gitignore
├── .mcp.json
├── .npmrc
├── AGENTS.md
├── CLAUDE.md
├── compose.yaml
├── drizzle.config.ts
├── LICENSE
├── package.json
├── playwright.config.ts
├── pnpm-workspace.yaml
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```
