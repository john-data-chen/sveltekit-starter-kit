<script lang="ts">
  import { enhance } from "$app/forms";
  import { pageTitle } from "$lib/constants";
  import * as m from "$lib/paraglide/messages";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
</script>

<svelte:head><title>{pageTitle(m.sign_in())}</title></svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
  <header class="text-center">
    <h1 class="text-2xl font-bold">{m.login_heading()}</h1>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {m.login_subtitle()}
    </p>
  </header>

  {#if form?.message}
    <p
      class="rounded bg-red-50 p-3 text-center text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
    >
      {form.message}
    </p>
  {/if}

  <form method="POST" use:enhance class="grid gap-3">
    <label class="grid gap-1">
      <span class="text-sm font-medium">{m.login_email_label()}</span>
      <input
        type="email"
        name="email"
        value={form?.email ?? data.defaultEmail}
        required
        autocomplete="email"
        class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
      />
    </label>
    <button
      type="submit"
      class="rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
    >
      {m.continue_with_email()}
    </button>
  </form>
</main>
