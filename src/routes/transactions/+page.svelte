<script lang="ts">
  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";
  import { type ColumnDef } from "@tanstack/table-core";
  import { categoryLabel } from "$lib/categories";
  import { pageTitle } from "$lib/constants";
  import { formatTWD } from "$lib/money";
  import * as m from "$lib/paraglide/messages";
  import { createSortedTable, headerLabel } from "$lib/table/sorted-table.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  type Tx = (typeof data.transactions)[number];

  function typeLabel(type: Tx["type"]): string {
    return type === "income" ? m.type_income() : m.type_expense();
  }

  // Category and type sort by their localized label, so the order matches what
  // the user actually sees (important under zh-tw); amount sorts numerically.
  const columns: ColumnDef<Tx, unknown>[] = [
    { accessorKey: "occurredOn", header: () => m.field_date() },
    {
      id: "category",
      accessorFn: (row) => categoryLabel(row.category),
      header: () => m.field_category()
    },
    { id: "type", accessorFn: (row) => typeLabel(row.type), header: () => m.field_type() },
    {
      id: "amount",
      accessorFn: (row) => (row.type === "income" ? row.amount : -row.amount),
      header: () => m.field_amount()
    },
    {
      id: "note",
      accessorFn: (row) => row.note || "",
      header: () => m.field_note()
    },
    { id: "actions", enableSorting: false, header: () => "" }
  ];

  const table = createSortedTable<Tx>({
    data: () => data.transactions,
    columns,
    prefix: "t.",
    defaultSort: [{ id: "occurredOn", desc: true }]
  });
</script>

<svelte:head><title>{pageTitle(m.nav_transactions())}</title></svelte:head>

<section class="grid gap-6">
  <div class="flex items-center justify-between">
    <h1 class="text-xl font-bold">{m.nav_transactions()}</h1>
    <a
      href={resolve("/transactions/new")}
      class="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
    >
      {m.new_transaction_button()}
    </a>
  </div>

  <form method="GET" class="flex flex-wrap items-end gap-3">
    <label class="grid gap-1 text-sm">
      <span class="text-gray-500 dark:text-gray-400">{m.field_category()}</span>
      <select
        name="category"
        class="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="" selected={data.filters.category === ""}>{m.all_categories()}</option>
        {#each data.categoryOptions as category (category)}
          <option value={category} selected={data.filters.category === category}
            >{categoryLabel(category)}</option
          >
        {/each}
      </select>
    </label>

    <label class="grid gap-1 text-sm">
      <span class="text-gray-500 dark:text-gray-400">{m.field_month()}</span>
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
      {m.filter_apply()}
    </button>
    <a
      href={resolve("/transactions")}
      class="px-2 py-2 text-sm text-gray-500 hover:underline dark:text-gray-400"
      >{m.filter_clear()}</a
    >
  </form>

  {#if data.transactions.length === 0}
    <p
      class="rounded border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400"
    >
      {m.no_transactions_match()}
    </p>
  {:else}
    <!-- Mobile Sort Control -->
    <div class="md:hidden flex items-center justify-end gap-2 mb-2">
      <select
        aria-label="Sort field"
        class="rounded border border-gray-300 py-1 px-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        onchange={(e) => {
          const colId = e.currentTarget.value;
          const header = table.headerGroups[0].headers.find((h) => h.id === colId);
          if (header) header.column.toggleSorting(table.sorting[0]?.desc ?? true);
        }}
      >
        {#each table.headerGroups[0].headers as header (header.id)}
          {#if header.column.getCanSort()}
            <option value={header.id} selected={table.sorting[0]?.id === header.id}>
              {headerLabel(header)}
            </option>
          {/if}
        {/each}
      </select>
      <button
        type="button"
        aria-label="Sort direction"
        class="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        onclick={() => {
          const currentId = table.sorting[0]?.id;
          const currentDesc = table.sorting[0]?.desc;
          const header = table.headerGroups[0].headers.find((h) => h.id === currentId);
          if (header) header.column.toggleSorting(!currentDesc);
        }}
      >
        {table.sorting[0]?.desc ? "▼" : "▲"}
      </button>
    </div>

    <!-- Mobile List View -->
    <ul
      class="md:hidden divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800 mb-6"
    >
      {#each table.rows as row (row.original.id)}
        {@const tx = row.original}
        <li class="flex items-center justify-between gap-4 p-4">
          <div class="min-w-0">
            <p class="font-medium">{categoryLabel(tx.category)}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {tx.occurredOn}{#if tx.note}
                · <span class="truncate">{tx.note}</span>{/if}
            </p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1">
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
            <div class="flex items-center gap-3">
              <a
                href={resolve("/transactions/[id]/edit", { id: String(tx.id) })}
                class="text-sm text-gray-500 hover:underline dark:text-gray-400 shrink-0"
              >
                {m.action_edit()}
              </a>
              <form
                method="POST"
                action="?/delete"
                class="shrink-0"
                use:enhance={({ cancel }) => {
                  if (!confirm(m.confirm_delete_transaction())) {
                    cancel();
                  }
                }}
              >
                <input type="hidden" name="id" value={tx.id} />
                <button type="submit" class="text-sm text-red-500 hover:underline dark:text-red-400"
                  >{m.action_delete()}</button
                >
              </form>
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <!-- Desktop Table View -->
    <div
      class="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800"
    >
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead
          class="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
        >
          {#each table.headerGroups as headerGroup (headerGroup.id)}
            <tr>
              {#each headerGroup.headers as header (header.id)}
                <th
                  class="px-2 py-3 font-medium"
                  aria-sort={header.column.getCanSort()
                    ? header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                    : undefined}
                >
                  {#if !header.isPlaceholder}
                    {#if header.column.getCanSort()}
                      <button
                        type="button"
                        class="flex w-full items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
                        onclick={header.column.getToggleSortingHandler()}
                      >
                        {headerLabel(header)}
                        <span class="text-xs text-gray-400" aria-hidden="true">
                          {table.sorting && ""}
                          {#if header.column.getIsSorted() === "asc"}
                            ▲
                          {:else if header.column.getIsSorted() === "desc"}
                            ▼
                          {:else}
                            ⇅
                          {/if}
                        </span>
                      </button>
                    {:else}
                      <span>{headerLabel(header)}</span>
                    {/if}
                  {/if}
                </th>
              {/each}
            </tr>
          {/each}
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          {#each table.rows as row (row.original.id)}
            {@const tx = row.original}
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-2 py-3">{tx.occurredOn}</td>
              <td class="px-2 py-3 font-medium">{categoryLabel(tx.category)}</td>
              <td class="px-2 py-3">
                <span
                  class={tx.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"}
                >
                  {typeLabel(tx.type)}
                </span>
              </td>
              <td class="px-2 py-3">
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
              </td>
              <td
                class="px-2 py-3 text-gray-500 dark:text-gray-400 w-full max-w-0 truncate"
                title={tx.note || ""}>{tx.note || ""}</td
              >
              <td class="px-2 py-3 text-right w-1 whitespace-nowrap">
                <div class="flex items-center justify-end gap-3 shrink-0">
                  <a
                    href={resolve("/transactions/[id]/edit", { id: String(tx.id) })}
                    class="text-sm text-gray-500 hover:underline dark:text-gray-400 shrink-0"
                  >
                    {m.action_edit()}
                  </a>
                  <form
                    method="POST"
                    action="?/delete"
                    class="shrink-0"
                    use:enhance={({ cancel }) => {
                      if (!confirm(m.confirm_delete_transaction())) {
                        cancel();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={tx.id} />
                    <button
                      type="submit"
                      class="text-sm text-red-500 hover:underline dark:text-red-400"
                      >{m.action_delete()}</button
                    >
                  </form>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
