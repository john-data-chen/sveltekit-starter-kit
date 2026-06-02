<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head><title>Sign in · Expense Tracker</title></svelte:head>

<main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
	<header class="text-center">
		<h1 class="text-2xl font-bold">Expense Tracker</h1>
		<p class="mt-1 text-sm text-gray-500">
			Please press Continue — you don't need to register.
		</p>
	</header>

	{#if form?.message}
		<p class="rounded bg-red-50 p-3 text-center text-sm text-red-700">{form.message}</p>
	{/if}

	<form method="POST" use:enhance class="grid gap-3">
		<label class="grid gap-1">
			<span class="text-sm font-medium">Email</span>
			<input
				type="email"
				name="email"
				value={form?.email ?? data.defaultEmail}
				required
				autocomplete="email"
				class="rounded border border-gray-300 p-2"
			/>
		</label>
		<button
			type="submit"
			class="rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700"
		>
			Continue With Email
		</button>
	</form>
</main>
