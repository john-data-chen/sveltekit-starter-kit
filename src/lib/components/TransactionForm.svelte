<script lang="ts">
	import { enhance } from '$app/forms';
	import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '$lib/categories';

	interface Values {
		type: string;
		category: string;
		amount: string;
		occurredOn: string;
		note: string;
	}

	let {
		values,
		error,
		submitLabel,
		cancelHref = '/transactions'
	}: { values: Values; error?: string; submitLabel: string; cancelHref?: string } = $props();

	// Writable derived: seeded from the prop, re-set by the radios, and re-evaluated when
	// the prop changes (e.g. server echoes values back after a failed submit).
	let type = $derived(values.type === 'income' ? 'income' : 'expense');
	let categories = $derived(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES);
</script>

<form method="POST" use:enhance class="grid gap-4">
	{#if error}
		<p class="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
	{/if}

	<fieldset class="grid gap-1">
		<span class="text-sm text-gray-500">Type</span>
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
		<span class="text-sm text-gray-500">Category</span>
		<select name="category" class="rounded border border-gray-300 p-2">
			{#each categories as category (category)}
				<option value={category} selected={category === values.category}>{category}</option>
			{/each}
		</select>
	</label>

	<label class="grid gap-1">
		<span class="text-sm text-gray-500">Amount (TWD)</span>
		<input
			type="number"
			name="amount"
			min="1"
			step="1"
			inputmode="numeric"
			value={values.amount}
			required
			class="rounded border border-gray-300 p-2"
		/>
	</label>

	<label class="grid gap-1">
		<span class="text-sm text-gray-500">Date</span>
		<input
			type="date"
			name="occurredOn"
			value={values.occurredOn}
			required
			class="rounded border border-gray-300 p-2"
		/>
	</label>

	<label class="grid gap-1">
		<span class="text-sm text-gray-500">Note (optional)</span>
		<input
			type="text"
			name="note"
			value={values.note}
			maxlength="200"
			class="rounded border border-gray-300 p-2"
		/>
	</label>

	<div class="flex gap-3">
		<button
			type="submit"
			class="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
		>
			{submitLabel}
		</button>
		<a href={cancelHref} class="px-4 py-2 text-sm text-gray-500 hover:underline">Cancel</a>
	</div>
</form>
