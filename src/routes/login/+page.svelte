<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Sign in · Expense Tracker</title></svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 p-6">
	<header class="text-center">
		<h1 class="text-2xl font-bold">Expense Tracker</h1>
		<p class="mt-1 text-sm text-gray-500">Pick a profile to sign in</p>
	</header>

	{#if form?.message}
		<p class="rounded bg-red-50 p-3 text-center text-sm text-red-700">{form.message}</p>
	{/if}

	<form method="POST" use:enhance class="grid gap-3">
		{#each data.accounts as account (account.id)}
			<button
				type="submit"
				name="userId"
				value={account.id}
				class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-400 hover:bg-gray-50"
			>
				<span class="text-3xl" aria-hidden="true">{account.avatar}</span>
				<span class="font-medium">{account.name}</span>
			</button>
		{/each}
	</form>
</main>
