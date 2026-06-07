<script lang="ts">
  import { categoryLabel } from "$lib/categories";
  import { pageTitle } from "$lib/constants";
  import { formatDateTime } from "$lib/date";
  import { formatTWD } from "$lib/money";
  import * as m from "$lib/paraglide/messages";
  import { getLocale } from "$lib/paraglide/runtime";
  import { createSortedTable, headerLabel } from "$lib/table/sorted-table.svelte";
  import { type ColumnDef } from "@tanstack/table-core";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  type UserRow = (typeof data.users)[number];
  type AuditRow = (typeof data.recentAudits)[number];

  function roleLabel(role: UserRow["role"]): string {
    return role === "admin" ? m.role_admin() : m.role_member();
  }

  function actionLabel(action: AuditRow["action"]): string {
    if (action === "create") {
      return m.action_create();
    }
    return action === "delete" ? m.action_delete() : m.action_update();
  }

  const NUMERIC_USER_COLS = new Set(["transactionCount", "income", "expense"]);

  // Label-based columns (role, action) sort by their localized text so the order
  // matches what is shown; numeric/date columns sort by their raw value.
  const userColumns: ColumnDef<UserRow, unknown>[] = [
    { accessorKey: "name", header: () => m.admin_col_user() },
    { id: "role", accessorFn: (row) => roleLabel(row.role), header: () => m.admin_role() },
    { accessorKey: "transactionCount", header: () => m.admin_col_transactions() },
    { id: "income", accessorKey: "totalIncome", header: () => m.admin_col_income() },
    { id: "expense", accessorKey: "totalExpense", header: () => m.admin_col_expense() }
  ];

  const auditColumns: ColumnDef<AuditRow, unknown>[] = [
    { id: "time", accessorKey: "createdAt", header: () => m.audit_col_time() },
    { id: "actor", accessorFn: (row) => row.actor.name, header: () => m.audit_col_actor() },
    {
      id: "action",
      accessorFn: (row) => actionLabel(row.action),
      header: () => m.audit_col_action()
    },
    { id: "summary", enableSorting: false, header: () => m.audit_col_summary() }
  ];

  const userTable = createSortedTable<UserRow>({
    data: () => data.users,
    columns: userColumns,
    prefix: "u."
  });

  const auditTable = createSortedTable<AuditRow>({
    data: () => data.recentAudits,
    columns: auditColumns,
    prefix: "a."
  });

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
            {#each userTable.headerGroups as headerGroup (headerGroup.id)}
              <tr>
                {#each headerGroup.headers as header (header.id)}
                  <th
                    class={[
                      "px-3 py-2 font-medium",
                      NUMERIC_USER_COLS.has(header.column.id) && "text-right"
                    ]}
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
                          class={[
                            "flex w-full items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100",
                            NUMERIC_USER_COLS.has(header.column.id) && "justify-end"
                          ]}
                          onclick={header.column.getToggleSortingHandler()}
                        >
                          {headerLabel(header)}
                          <span class="text-xs text-gray-400" aria-hidden="true">
                            {userTable.sorting && ""}
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
          <tbody>
            {#each userTable.rows as row (row.original.id)}
              {@const user = row.original}
              <tr
                class="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
              >
                <td class="px-3 py-2 whitespace-nowrap">
                  <span class="mr-1">{user.avatar}</span>
                  <span class="font-medium">{user.name}</span>
                  <span class="ml-1 text-gray-400">{user.email}</span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <span
                    class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {user.role ===
                    'admin'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}"
                  >
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap tabular-nums"
                  >{user.transactionCount}</td
                >
                <td class="px-3 py-2 text-right whitespace-nowrap tabular-nums"
                  >{formatTWD(user.totalIncome)}</td
                >
                <td class="px-3 py-2 text-right whitespace-nowrap tabular-nums"
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
            {#each auditTable.headerGroups as headerGroup (headerGroup.id)}
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
                          type="button"
                          class="flex w-full items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
                          onclick={header.column.getToggleSortingHandler()}
                        >
                          {headerLabel(header)}
                          <span class="text-xs text-gray-400" aria-hidden="true">
                            {auditTable.sorting && ""}
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
          <tbody>
            {#each auditTable.rows as row (row.original.id)}
              {@const audit = row.original}
              {@const summary = parseAuditSummary(audit.summary)}
              <tr
                class="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
              >
                <td class="px-3 py-2 whitespace-nowrap text-gray-500">
                  {formatDateTime(audit.createdAt, getLocale())}
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <span class="mr-1">{audit.actor.avatar}</span>
                  <span>{audit.actor.name}</span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <span
                    class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {audit.action ===
                    'create'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : audit.action === 'delete'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}"
                  >
                    {actionLabel(audit.action)}
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
