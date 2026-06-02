<script lang="ts">
  import TransactionForm from "$lib/components/TransactionForm.svelte";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  let values = $derived({
    type: form?.values?.type ?? "expense",
    category: form?.values?.category ?? "",
    amount: form?.values?.amount ?? "",
    occurredOn: form?.values?.occurredOn ?? data.today,
    note: form?.values?.note ?? ""
  });
</script>

<svelte:head><title>New transaction · Expense Tracker</title></svelte:head>

<section class="grid max-w-md gap-6">
  <h1 class="text-xl font-bold">New transaction</h1>
  <TransactionForm {values} error={form?.error} submitLabel="Add transaction" />
</section>
