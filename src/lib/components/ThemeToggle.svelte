<script lang="ts">
  import { theme } from "$lib/theme.svelte";
  import { THEME_ORDER, type ThemePreference } from "$lib/theme";

  const labels: Record<ThemePreference, string> = {
    dark: "🌙 Dark",
    light: "☀️ Light",
    system: "🖥️ System"
  };
</script>

<select
  aria-label="Theme"
  value={theme.preference}
  onchange={(event) => theme.set(event.currentTarget.value as ThemePreference)}
  class="rounded border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
>
  {#each THEME_ORDER as option (option)}
    <option value={option}>{labels[option]}</option>
  {/each}
</select>
