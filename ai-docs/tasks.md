# Task: Add i18n (en + zh-TW, default zh-TW) to the SvelteKit Starter Kit

## Context

The app is SvelteKit 2 + Svelte 5 (runes) + Tailwind v4, SSR with a signed httpOnly cookie
session. Today there is **no i18n** — every user-facing string is hardcoded English across the
root layout, dashboard, login, transactions pages, `TransactionForm` / `CategoryChart`, and the
server-side validation messages in `src/lib/server/validation.ts`. Category display labels live
in `src/lib/categories.ts` and the **same English strings are also stored as DB values**
(`transactions.category`), so labels must be localized for display while the stored value stays
the English key.

Goal: add internationalization with **two locales — `en` and `zh-TW`** — defaulting to
**`zh-TW`**, with a user-facing language switcher, persisted in a cookie, rendered correctly
under SSR (correct `<html lang>`, no flash of the wrong language).

### Chosen approach (decided with user)

- **Library: Paraglide JS (inlang)** — SvelteKit's recommended i18n. Compile-time, zero runtime
  overhead, type-safe, tree-shakeable. Fits the repo's strict-TS, modern ethos. Exact v2 API/
  setup to be confirmed against current docs (context7 + svelte MCP) before coding.
- **Locales:** `zh-TW` (Traditional Chinese) and `en`. **`baseLocale` / default = `zh-TW`.**
- **Strategy: cookie + no URL prefix** — mirrors the existing theme cookie+SSR pattern; URLs do
  not change. Paraglide `strategy: ["cookie", "baseLocale"]` (no `url` strategy).
- **Bilingual + switcher:** keep English as a switchable second language; add a `LocaleSwitcher`
  component (2-way `zh-TW ⇄ en`) mounted globally next to `ThemeToggle`.
- **Scope (user-selected):** UI text + navigation, **category labels**, **form validation
  messages**. **Out of scope:** locale-aware date/number formatting (dates/numbers stay as-is;
  TWD currency unchanged).
- **Message authoring:** message keys in English; `messages/zh-TW.json` + `messages/en.json`
  hold the catalog. zh-TW values are Chinese (user-approved Chinese content).
- **Verification: NO chrome-devtools** (per task-template: do not open chrome-devtools-mcp unless
  requested). Verify via `pnpm lint` / `pnpm build` / `pnpm check` / `pnpm test` + Playwright e2e.

## Sub-Tasks

- [x] **1. Install + scaffold Paraglide JS (inlang)** — ✅ DONE (paraglide-js 2.18.1; cookie
      strategy; baseLocale=zh-tw; build+lint green; see session-log.md Entry 4)
  - Scope: `package.json`, `vite.config.ts`, `project.inlang/settings.json`,
    `messages/zh-TW.json`, `messages/en.json`, `.gitignore` (ignore generated
    `src/lib/paraglide/`)
  - Confirm current Paraglide v2 + SvelteKit setup via context7 + svelte MCP first. Configure
    `baseLocale: "zh-TW"`, `locales: ["zh-TW", "en"]`, `strategy: ["cookie", "baseLocale"]`.
  - Done when: Paraglide compiles, generated runtime imports resolve, `pnpm build` passes with
    placeholder messages.
  - **CURRENT STATE (2026-06-03):** bad scaffold fully REVERTED — source tree back to commit
    `2bf7cb8` (green dark-mode baseline). Redoing Task 1 from scratch per plan: cookie strategy,
    `baseLocale: zh-tw`, NO `src/hooks.ts` reroute, 2-space style, dark mode untouched.

- [x] **2. SSR locale wiring (hooks + app.html, cookie strategy, no flash)** — ✅ DONE
      (curl-verified: no-cookie→zh-tw, en-cookie→en, dark mode intact; see session-log.md Entry 5)
  - Scope: `src/hooks.server.ts` (add Paraglide handle/middleware, integrate with the existing
    theme `transformPageChunk`), `src/app.html` (`<html lang>` placeholder), confirm whether a
    `src/hooks.ts` reroute is needed (likely not for cookie strategy).
  - Done when: first visit (no cookie) renders `zh-TW` with the correct `<html lang>`; an `en`
    cookie renders English; coexists with the existing `.dark` theme class; no flash.
  - Depends on: Task 1

- [x] **3. Inventory all hardcoded UI strings → message catalog** — ✅ DONE (53 keys × 2 locales,
      identical key sets, compiles; ThemeToggle added as flagged scope addition; see session-log
      Entry 6)
  - Scope: every `.svelte` under `src/routes` + `src/lib/components`, plus
    `src/lib/server/validation.ts` and any message strings returned from `*.server.ts` actions.
  - Produce the full key set in both `messages/en.json` and `messages/zh-TW.json`.
  - Done when: every user-visible string has a key with both `en` and `zh-TW` values.
  - Depends on: Task 1

- [x] **4. Replace UI strings with messages across pages/components** — ✅ DONE (9 components;
      autofixer-clean; runtime-verified zh-tw/en; +field_month key; see session-log Entry 7)
  - Scope: `+layout.svelte`, `+page.svelte`, `login/+page.svelte`,
    `transactions/+page.svelte`, `transactions/new/+page.svelte`,
    `transactions/[id]/edit/+page.svelte`, `TransactionForm.svelte`, `CategoryChart.svelte`.
  - Use svelte-code-writer; validate each edited component with the svelte MCP `svelte-autofixer`
    until clean.
  - Done when: no hardcoded user-facing English remains in these files; pages render translated.
  - Depends on: Tasks 2, 3

- [x] **5. Localize category labels (keep English keys as stored values)** — ✅ DONE
      (`categoryLabel()` helper; runtime-verified value="Food"→飲食/Food, stored key unchanged; see
      session-log Entry 8)
  - Scope: `src/lib/categories.ts` (add a `categoryLabel()` display helper), consumers
    (`TransactionForm.svelte`, transactions filter, dashboard chart legend).
  - DB stored value + `isValidCategory` stay the English key; only the display label is
    localized.
  - Done when: category dropdowns/labels show localized text; stored value still the English
    key; validation unchanged.
  - Depends on: Tasks 3, 4

- [x] **6. Localize server-side validation messages** — ✅ DONE (validation.ts 4 msgs,
      login action 2 msgs, edit-page 4×404; AsyncLocalStorage resolves locale; see session-log
      Entry 10)
  - Scope: `src/lib/server/validation.ts` and its callers in `*.server.ts` actions.
  - Use Paraglide messages with the request locale resolved server-side (confirm the v2
    server-side locale API during impl).
  - Done when: validation errors display in the active locale.
  - Depends on: Tasks 2, 3

- [x] **7. LocaleSwitcher component + mount globally** — ✅ DONE (2-way zh-tw⇄en select;
      uses Paraglide setLocale() with auto-reload; mounted in header + login overlay; see
      session-log Entry 11)
  - Scope: new `src/lib/components/LocaleSwitcher.svelte`; mount in `+layout.svelte` (signed-in
    header + login overlay, next to `ThemeToggle`).
  - 2-way toggle `zh-TW ⇄ en`; `setLocale` writes the cookie and persists across reload;
    accessible (`aria-label`, keyboard operable). Built with svelte-code-writer + validated with
    `svelte-autofixer`.
  - Done when: switching flips all UI, persists across reload, visible on login + signed-in
    pages.
  - Depends on: Tasks 4, 5, 6

- [x] **8. Verify lint + build + check + unit tests (MANDATORY; NO chrome-devtools)** — ✅ DONE
      (lint 0, build ✓, check 0, test 24/24; no hardcoded strings remain; see session-log Entry 12)
  - Scope: whole repo. Run `pnpm lint`, `pnpm build`, `pnpm check`, `pnpm test`.
  - Done when: all pass with zero errors/warnings. (No chrome-devtools per task-template.)
  - Depends on: Tasks 1–7

- [ ] **9. Add/Update tests (AFTER user confirms results — per AGENTS.md)**
  - Scope: unit (`categoryLabel` mapping, any locale-resolve helper); Playwright e2e under `e2e/`
    (default `zh-TW` on first load, switch to `en` persists across reload, a validation message
    shown localized).
  - Done when: `pnpm test` and e2e (where DB/dev-server available) pass.
  - Depends on: Task 8 + explicit user confirmation

- [ ] **10. Update documentation (doc-coauthoring)**
  - Scope: `README.md` (feature list + an i18n/語系 note: locales, default `zh-TW`, cookie
    persistence, switcher, Paraglide, categories stored as English keys), `AGENTS.md` if a
    workflow note is warranted.
  - Done when: README reflects the i18n implementation, concise and consistent with its voice.
  - Depends on: Task 8

## Notes for Next Session

### Current State

- Plan (Tasks 1–10) is approved in spirit but **execution has NOT been confirmed** — do not run
  Tasks 2–10 until the user confirms.
- A **partial, divergent, broken** Paraglide scaffold exists in the working tree (from an
  unrecorded `npx @inlang/paraglide-js init`). It does NOT match the agreed plan and it
  **regressed the committed dark-mode feature**. Full breakdown in session-log.md Entry 2.
- The working tree almost certainly **does not lint or build** right now (paraglide dep not
  installed, runtime not generated, tab/space style mismatch).

### Important Context

- **Two regressions introduced by the scaffold** (must be fixed regardless of i18n approach):
  1. `src/app.html` — theme-bootstrap `<script>` collapsed to one `//`-prefixed line → IIFE is
     commented out → theme bootstrap dead.
  2. `src/hooks.server.ts` — `originalHandle` injects `.dark` via
     `html.replace('<html lang="en"', …)`, but `app.html` is now `<html lang="%paraglide.lang%"`
     → injection no-ops; plus an orphaned duplicate comment block.
- **Config divergences from plan**: `baseLocale: "en"` (want `zh-tw`); `src/hooks.ts` reroute uses
  URL strategy `deLocalizeUrl` (plan = cookie + no URL prefix → reroute likely unneeded);
  messages are placeholder `hello_world` only.
- Note locale tag casing: scaffold uses lowercase `zh-tw` (Paraglide normalizes tags). The plan
  text says `zh-TW`; align on `zh-tw` as the actual runtime locale id, message file `zh-tw.json`.

### Recommended Next Steps (pending user decision: fix-in-place vs revert-and-redo)

1. Decide reconciliation approach (see the question posed to the user this session).
2. If revert-and-redo: `git checkout` the 5 touched source files + remove `messages/`,
   `project.inlang/`, `src/hooks.ts`; then redo Task 1 cleanly per plan (cookie strategy,
   `baseLocale: zh-tw`).
3. If fix-in-place: run `pnpm install`; fix `project.inlang/settings.json` baseLocale → `zh-tw`;
   remove/justify `src/hooks.ts` reroute; repair `app.html` theme script + `hooks.server.ts`
   `.dark` injection (re-target the replace to the new `<html>` tag); reformat to 2-space.
4. Either way: re-establish a GREEN baseline (`pnpm lint && pnpm build && pnpm check`) BEFORE
   touching Tasks 2–10.
