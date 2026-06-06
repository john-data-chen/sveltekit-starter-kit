<script lang="ts">
  import { pageTitle } from "$lib/constants";
  import * as m from "$lib/paraglide/messages";
  import Button from "$lib/components/ui/Button.svelte";
  import { inputClass } from "$lib/components/ui/field";
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

  <!-- Native submit (no use:enhance): the login action sets the session cookie and 303s to "/".
       Safari/WebKit only persists that Set-Cookie on a top-level navigation, not on an enhance
       fetch response, so a native submit is required for cross-browser sign-in. -->
  <form method="POST" class="grid gap-3">
    <label class="grid gap-1">
      <span class="text-sm font-medium">{m.login_email_label()}</span>
      <input
        type="email"
        name="email"
        value={form?.email ?? data.defaultEmail}
        required
        autocomplete="email"
        class={inputClass}
      />
    </label>
    <Button type="submit">
      {m.continue_with_email()}
    </Button>
  </form>
</main>
