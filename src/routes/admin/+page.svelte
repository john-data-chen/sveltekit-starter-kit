<script lang="ts">
  import { pageTitle } from "$lib/constants";
  import { formatDateTime } from "$lib/date";
  import { formatTWD } from "$lib/money";
  import * as m from "$lib/paraglide/messages";
  import { getLocale } from "$lib/paraglide/runtime";
  import { categoryLabel } from "$lib/categories";
  import type { PageProps } from "./$types";

  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    createTable,
    getCoreRowModel,
    getSortedRowModel,
    createColumnHelper,
    type Updater,
    type SortingState
  } from "@tanstack/table-core";
  import { readSort, writeSort } from "$lib/table/sort";

  let { data }: PageProps = $props();

  let uSort = $state(readSort($page.url.searchParams, "u."));
  let aSort = $state(readSort($page.url.searchParams, "a."));

  function handleUSortChange(updater: Updater<SortingState>) {
    uSort = typeof updater === "function" ? updater(uSort) : updater;
    const newParams = writeSort($page.url.searchParams, uSort, "u.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goto(("?" + newParams.toString()) as any, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
  }

  function handleASortChange(updater: Updater<SortingState>) {
    aSort = typeof updater === "function" ? updater(aSort) : updater;
    const newParams = writeSort($page.url.searchParams, aSort, "a.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goto(("?" + newParams.toString()) as any, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
  }

  const uHelper = createColumnHelper<(typeof data.users)[0]>();
  const uColumns = [
    uHelper.accessor("name", { header: () => m.admin_col_user() }),
    uHelper.accessor("role", { header: () => m.admin_role() }),
    uHelper.accessor("transactionCount", { header: () => m.admin_col_transactions() }),
    uHelper.accessor("totalIncome", { id: "income", header: () => m.admin_col_income() }),
    uHelper.accessor("totalExpense", { id: "expense", header: () => m.admin_col_expense() })
  ];

  let uTable = $derived.by(() => {
    const t = createTable({
      data: data.users,
      columns: uColumns,
      state: {},
      onStateChange: () => {},
      onSortingChange: handleUSortChange,
      renderFallbackValue: null,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel()
    });
    t.setOptions((prev) => ({
      ...prev,
      state: { ...t.initialState, sorting: uSort }
    }));
    return t;
  });

  const aHelper = createColumnHelper<(typeof data.recentAudits)[0]>();
  const aColumns = [
    aHelper.accessor("createdAt", { id: "time", header: () => m.audit_col_time() }),
    aHelper.accessor((row) => row.actor.name, { id: "actor", header: () => m.audit_col_actor() }),
    aHelper.accessor("action", { header: () => m.audit_col_action() }),
    aHelper.display({ id: "summary", header: () => m.audit_col_summary(), enableSorting: false })
  ];

  let aTable = $derived.by(() => {
    const t = createTable({
      data: data.recentAudits,
      columns: aColumns,
      state: {},
      onStateChange: () => {},
      onSortingChange: handleASortChange,
      renderFallbackValue: null,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel()
    });
    t.setOptions((prev) => ({
      ...prev,
      state: { ...t.initialState, sorting: aSort }
    }));
    return t;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderHeader(headerDef: any, context: any) {
    return typeof headerDef === "function" ? headerDef(context) : headerDef;
  }

  function parseAuditSummary(summary: string | null) {
    if (!summary) {
      return { text: "-", isIncome: null };
    }
    if (summary.startsWith("income ") || summary.startsWith("expense ")) {
      const isIncome = summary.startsWith("income ");
      const typeStr = isIncome ? "income" : "expense";
      const rest = summary.slice(typeStr.length + 1);

      const lastSpace = rest.lastIndexOf(" ");
      if (lastSpace !== -1) {
        const cat = rest.slice(0, lastSpace);
        const amt = rest.slice(lastSpace + 1);

        const catLabel = categoryLabel(cat);
        const tType = isIncome ? m.type_income() : m.type_expense();
        const num = Number(amt);
        const fAmt = Number.isNaN(num) ? `NT$${amt}` : formatTWD(num);
        const sign = isIncome ? "+" : "-";

        const text =
          getLocale() === "zh-tw"
            ? `${catLabel}${tType} ${sign} ${fAmt}`
            : `${catLabel} ${tType} ${sign} ${fAmt}`;

        return { text, isIncome };
      }
    }
    return { text: summary, isIncome: null };
  }
</script>

<svelte:head><title>{pageTitle(m.admin_title())}</title></svelte:head>

<section class="grid gap-6">
  <h1 class="text-xl font-bold">{m.admin_title()}</h1>

  <div>
    <h2 class="mb-3 text-lg font-semibold">{m.admin_users_heading()}</h2>

    {#if data.users.length === 0}
      <p class="text-gray-500 dark:text-gray-400">{m.admin_empty()}</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
          >
            {#each uTable.getHeaderGroups() as headerGroup (headerGroup.id)}
              <tr>
                {#each headerGroup.headers as header (header.id)}
                  <th
                    class="px-3 py-2 font-medium {header.column.id === 'transactionCount' ||
                    header.column.id === 'income' ||
                    header.column.id === 'expense'
                      ? 'text-right'
                      : ''}"
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
                          class="flex w-full items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 {header
                            .column.id === 'transactionCount' ||
                          header.column.id === 'income' ||
                          header.column.id === 'expense'
                            ? 'justify-end'
                            : ''}"
                          onclick={header.column.getToggleSortingHandler()}
                        >
                          {renderHeader(header.column.columnDef.header, header.getContext())}
                          <span class="text-xs text-gray-400">
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
                        <span
                          class="flex items-center gap-1 {header.column.id === 'transactionCount' ||
                          header.column.id === 'income' ||
                          header.column.id === 'expense'
                            ? 'justify-end'
                            : ''}"
                        >
                          {renderHeader(header.column.columnDef.header, header.getContext())}
                        </span>
                      {/if}
                    {/if}
                  </th>
                {/each}
              </tr>
            {/each}
          </thead>
          <tbody>
            {#each uTable.getRowModel().rows as row (row.original.id)}
              {@const user = row.original}
              <tr
                class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="whitespace-nowrap px-3 py-2">
                  <span class="mr-1">{user.avatar}</span>
                  <span class="font-medium">{user.name}</span>
                  <span class="ml-1 text-gray-400">{user.email}</span>
                </td>
                <td class="whitespace-nowrap px-3 py-2">
                  <span
                    class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {user.role ===
                    'admin'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}"
                  >
                    {user.role === "admin" ? m.role_admin() : m.role_member()}
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-2 text-right tabular-nums"
                  >{user.transactionCount}</td
                >
                <td class="whitespace-nowrap px-3 py-2 text-right tabular-nums"
                  >{formatTWD(user.totalIncome)}</td
                >
                <td class="whitespace-nowrap px-3 py-2 text-right tabular-nums"
                  >{formatTWD(user.totalExpense)}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <div class="mt-8">
    <h2 class="mb-3 text-lg font-semibold">{m.admin_activity_heading()}</h2>

    {#if data.recentAudits.length === 0}
      <p class="text-gray-500 dark:text-gray-400">{m.admin_activity_empty()}</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead
            class="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
          >
            {#each aTable.getHeaderGroups() as headerGroup (headerGroup.id)}
              <tr>
                {#each headerGroup.headers as header (header.id)}
                  <th
                    class="px-3 py-2 font-medium"
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
                          class="flex w-full items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
                          onclick={header.column.getToggleSortingHandler()}
                        >
                          {renderHeader(header.column.columnDef.header, header.getContext())}
                          <span class="text-xs text-gray-400">
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
                        <span class="flex items-center gap-1">
                          {renderHeader(header.column.columnDef.header, header.getContext())}
                        </span>
                      {/if}
                    {/if}
                  </th>
                {/each}
              </tr>
            {/each}
          </thead>
          <tbody>
            {#each aTable.getRowModel().rows as row (row.original.id)}
              {@const audit = row.original}
              {@const summary = parseAuditSummary(audit.summary)}
              <tr
                class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="whitespace-nowrap px-3 py-2 text-gray-500">
                  {formatDateTime(audit.createdAt, getLocale())}
                </td>
                <td class="whitespace-nowrap px-3 py-2">
                  <span class="mr-1">{audit.actor.avatar}</span>
                  <span>{audit.actor.name}</span>
                </td>
                <td class="whitespace-nowrap px-3 py-2">
                  <span
                    class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {audit.action ===
                    'create'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : audit.action === 'delete'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}"
                  >
                    {audit.action === "create"
                      ? m.action_create()
                      : audit.action === "delete"
                        ? m.action_delete()
                        : m.action_update()}
                  </span>
                </td>
                <td
                  class="px-3 py-2 font-medium {summary.isIncome === true
                    ? 'text-green-600 dark:text-green-400'
                    : summary.isIncome === false
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500'}"
                >
                  {summary.text}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>
