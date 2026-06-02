<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatTWD } from '$lib/money';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head><title>Transactions · Expense Tracker</title></svelte:head>

<section class="grid gap-6">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Transactions</h1>
		<a
			href="/transactions/new"
			class="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
		>
			+ New
		</a>
	</div>

	<form method="GET" class="flex flex-wrap items-end gap-3">
		<label class="grid gap-1 text-sm">
			<span class="text-gray-500">Category</span>
			<select name="category" class="rounded border border-gray-300 p-2">
				<option value="" selected={data.filters.category === ''}>All categories</option>
				{#each data.categoryOptions as category (category)}
					<option value={category} selected={data.filters.category === category}>{category}</option>
				{/each}
			</select>
		</label>

		<label class="grid gap-1 text-sm">
			<span class="text-gray-500">Month</span>
			<input
				type="month"
				name="month"
				value={data.filters.month}
				class="rounded border border-gray-300 p-2"
			/>
		</label>

		<button type="submit" class="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
			Apply
		</button>
		<a href="/transactions" class="px-2 py-2 text-sm text-gray-500 hover:underline">Clear</a>
	</form>

	{#if data.transactions.length === 0}
		<p class="rounded border border-dashed border-gray-300 p-8 text-center text-gray-500">
			No transactions match these filters.
		</p>
	{:else}
		<ul class="divide-y divide-gray-100 rounded-lg border border-gray-200">
			{#each data.transactions as tx (tx.id)}
				<li class="flex items-center justify-between gap-4 p-4">
					<div class="min-w-0">
						<p class="font-medium">{tx.category}</p>
						<p class="text-sm text-gray-500">
							{tx.occurredOn}{#if tx.note} · {tx.note}{/if}
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-4">
						<span
							class={[
								'font-semibold tabular-nums',
								tx.type === 'income' ? 'text-green-600' : 'text-red-600'
							]}
						>
							{tx.type === 'income' ? '+' : '-'}{formatTWD(tx.amount)}
						</span>
						<a href="/transactions/{tx.id}/edit" class="text-sm text-gray-500 hover:underline">
							Edit
						</a>
						<form
							method="POST"
							action="?/delete"
							use:enhance={({ cancel }) => {
								if (!confirm('Delete this transaction?')) {
									cancel();
								}
							}}
						>
							<input type="hidden" name="id" value={tx.id} />
							<button type="submit" class="text-sm text-red-500 hover:underline">Delete</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>
