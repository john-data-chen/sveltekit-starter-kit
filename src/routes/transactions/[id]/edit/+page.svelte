<script lang="ts">
  import TransactionForm from "$lib/components/TransactionForm.svelte";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  let values = $derived({
    type: form?.values?.type ?? data.transaction.type,
    category: form?.values?.category ?? data.transaction.category,
    amount: form?.values?.amount ?? String(data.transaction.amount),
    occurredOn: form?.values?.occurredOn ?? data.transaction.occurredOn,
    note: form?.values?.note ?? data.transaction.note ?? ""
  });
</script>

<svelte:head><title>Edit transaction · Expense Tracker</title></svelte:head>

<section class="grid max-w-md gap-6">
  <h1 class="text-xl font-bold">Edit transaction</h1>
  <TransactionForm {values} error={form?.error} submitLabel="Save changes" />
</section>
