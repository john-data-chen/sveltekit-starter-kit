<script lang="ts">
  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";
  import { pageTitle } from "$lib/constants";
  import { formatTWD } from "$lib/money";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head><title>{pageTitle("Transactions")}</title></svelte:head>

<section class="grid gap-6">
  <div class="flex items-center justify-between">
    <h1 class="text-xl font-bold">Transactions</h1>
    <a
      href={resolve("/transactions/new")}
      class="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
    >
      + New
    </a>
  </div>

  <form method="GET" class="flex flex-wrap items-end gap-3">
    <label class="grid gap-1 text-sm">
      <span class="text-gray-500 dark:text-gray-400">Category</span>
      <select
        name="category"
        class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="" selected={data.filters.category === ""}>All categories</option>
        {#each data.categoryOptions as category (category)}
          <option value={category} selected={data.filters.category === category}>{category}</option>
        {/each}
      </select>
    </label>

    <label class="grid gap-1 text-sm">
      <span class="text-gray-500 dark:text-gray-400">Month</span>
      <input
        type="month"
        name="month"
        value={data.filters.month}
        class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
      />
    </label>

    <button
      type="submit"
      class="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      Apply
    </button>
    <a
      href={resolve("/transactions")}
      class="px-2 py-2 text-sm text-gray-500 hover:underline dark:text-gray-400">Clear</a
    >
  </form>

  {#if data.transactions.length === 0}
    <p
      class="rounded border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400"
    >
      No transactions match these filters.
    </p>
  {:else}
    <ul
      class="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800"
    >
      {#each data.transactions as tx (tx.id)}
        <li class="flex items-center justify-between gap-4 p-4">
          <div class="min-w-0">
            <p class="font-medium">{tx.category}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {tx.occurredOn}{#if tx.note}
                · {tx.note}{/if}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-4">
            <span
              class={[
                "font-semibold tabular-nums",
                tx.type === "income"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              ]}
            >
              {tx.type === "income" ? "+" : "-"}{formatTWD(tx.amount)}
            </span>
            <a
              href={resolve("/transactions/[id]/edit", { id: String(tx.id) })}
              class="text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
              Edit
            </a>
            <form
              method="POST"
              action="?/delete"
              use:enhance={({ cancel }) => {
                if (!confirm("Delete this transaction?")) {
                  cancel();
                }
              }}
            >
              <input type="hidden" name="id" value={tx.id} />
              <button type="submit" class="text-sm text-red-500 hover:underline dark:text-red-400"
                >Delete</button
              >
            </form>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
