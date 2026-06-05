<script lang="ts">
  import { pageTitle } from "$lib/constants";
  import { formatDateTime } from "$lib/date";
  import { formatTWD } from "$lib/money";
  import * as m from "$lib/paraglide/messages";
  import { getLocale } from "$lib/paraglide/runtime";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
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
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.login_email_label()}</th>
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.admin_role()}</th>
              <th class="whitespace-nowrap px-3 py-2 text-right font-medium"
                >{m.admin_col_transactions()}</th
              >
              <th class="whitespace-nowrap px-3 py-2 text-right font-medium"
                >{m.admin_col_income()}</th
              >
              <th class="whitespace-nowrap px-3 py-2 text-right font-medium"
                >{m.admin_col_expense()}</th
              >
            </tr>
          </thead>
          <tbody>
            {#each data.users as user (user.id)}
              <tr class="border-b border-gray-100 dark:border-gray-800">
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
        <table class="w-full text-left text-sm">
          <thead>
            <tr
              class="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.audit_col_time()}</th>
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.audit_col_actor()}</th>
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.audit_col_action()}</th>
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.audit_col_entity()}</th>
              <th class="whitespace-nowrap px-3 py-2 font-medium">{m.audit_col_summary()}</th>
            </tr>
          </thead>
          <tbody>
            {#each data.recentAudits as audit (audit.id)}
              <tr class="border-b border-gray-100 dark:border-gray-800">
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
                <td class="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-300">
                  {audit.entity}
                  {audit.entityId ? `#${audit.entityId}` : ""}
                </td>
                <td class="px-3 py-2 text-gray-500">
                  {audit.summary || "-"}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>
