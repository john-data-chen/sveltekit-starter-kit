<script lang="ts">
  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";
  import { categoriesFor, type TransactionType } from "$lib/categories";
  import type { TransactionFormValues } from "$lib/transaction";

  let {
    values,
    error,
    submitLabel,
    cancelHref = "/transactions"
  }: {
    values: TransactionFormValues;
    error?: string;
    submitLabel: string;
    // Accept exactly what `resolve()` accepts so the cancel link stays type-safe.
    cancelHref?: Parameters<typeof resolve>[0];
  } = $props();

  // Writable derived: seeded from the prop, re-set by the radios, and re-evaluated when
  // the prop changes (e.g. server echoes values back after a failed submit).
  // `bind:group` widens `type` to `string`; the ternary guarantees a valid TransactionType.
  let type = $derived(values.type === "income" ? "income" : "expense");
  let categories = $derived(categoriesFor(type as TransactionType));
</script>

<form method="POST" use:enhance class="grid gap-4">
  {#if error}
    <p class="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
      {error}
    </p>
  {/if}

  <fieldset class="grid gap-1">
    <span class="text-sm text-gray-500 dark:text-gray-400">Type</span>
    <div class="flex gap-4">
      <label class="flex items-center gap-2">
        <input type="radio" name="type" value="expense" bind:group={type} /> Expense
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" name="type" value="income" bind:group={type} /> Income
      </label>
    </div>
  </fieldset>

  <label class="grid gap-1">
    <span class="text-sm text-gray-500 dark:text-gray-400">Category</span>
    <select
      name="category"
      class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
    >
      {#each categories as category (category)}
        <option value={category} selected={category === values.category}>{category}</option>
      {/each}
    </select>
  </label>

  <label class="grid gap-1">
    <span class="text-sm text-gray-500 dark:text-gray-400">Amount (TWD)</span>
    <input
      type="number"
      name="amount"
      min="1"
      step="1"
      inputmode="numeric"
      value={values.amount}
      required
      class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
    />
  </label>

  <label class="grid gap-1">
    <span class="text-sm text-gray-500 dark:text-gray-400">Date</span>
    <input
      type="date"
      name="occurredOn"
      value={values.occurredOn}
      required
      class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
    />
  </label>

  <label class="grid gap-1">
    <span class="text-sm text-gray-500 dark:text-gray-400">Note (optional)</span>
    <input
      type="text"
      name="note"
      value={values.note}
      maxlength="200"
      class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
    />
  </label>

  <div class="flex gap-3">
    <button
      type="submit"
      class="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
    >
      {submitLabel}
    </button>
    <a
      href={resolve(cancelHref)}
      class="px-4 py-2 text-sm text-gray-500 hover:underline dark:text-gray-400">Cancel</a
    >
  </div>
</form>
