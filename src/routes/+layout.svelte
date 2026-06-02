<script lang="ts">
  import { dev } from "$app/environment";
  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import * as m from "$lib/paraglide/messages";
  import type { LayoutProps } from "./$types";

  injectAnalytics({ mode: dev ? "development" : "production" });

  let { children, data }: LayoutProps = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if data.user}
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto flex max-w-3xl items-center justify-between gap-4 p-4">
      <nav class="flex gap-4 text-sm font-medium">
        <a href={resolve("/")} class="hover:underline">{m.nav_dashboard()}</a>
        <a href={resolve("/transactions")} class="hover:underline">{m.nav_transactions()}</a>
      </nav>
      <div class="flex items-center gap-3 text-sm">
        <ThemeToggle />
        <span aria-hidden="true">{data.user.avatar}</span>
        <span class="font-medium">{data.user.name}</span>
        <form method="POST" action="/logout" use:enhance>
          <button
            type="submit"
            class="rounded border border-gray-200 px-3 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {m.sign_out()}
          </button>
        </form>
      </div>
    </div>
  </header>
  <main class="mx-auto max-w-3xl p-4">{@render children()}</main>
{:else}
  <div class="fixed right-4 top-4 z-10"><ThemeToggle /></div>
  {@render children()}
{/if}
