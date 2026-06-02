<script lang="ts">
	import { formatTWD } from '$lib/money';

	interface Slice {
		category: string;
		total: number;
	}

	let { items, total }: { items: Slice[]; total: number } = $props();

	// Fixed palette; assigned by index. Pure CSS — no charting dependency.
	const palette = ['#0ea5e9', '#f97316', '#22c55e', '#a855f7', '#ef4444', '#eab308', '#14b8a6'];

	let slices = $derived.by(() => {
		let acc = 0;
		return items.map((item, i) => {
			const start = total > 0 ? (acc / total) * 100 : 0;
			acc += item.total;
			const end = total > 0 ? (acc / total) * 100 : 0;
			const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
			return { ...item, color: palette[i % palette.length], start, end, pct };
		});
	});

	let gradient = $derived(
		slices.length > 0
			? `conic-gradient(${slices.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')})`
			: '#e5e7eb'
	);
</script>

{#if items.length === 0}
	<p class="text-sm text-gray-500">No expenses for this month.</p>
{:else}
	<div class="flex flex-wrap items-center gap-6">
		<div class="relative size-40 shrink-0">
			<div class="size-40 rounded-full" style:background={gradient}></div>
			<div class="absolute inset-0 m-auto size-20 rounded-full bg-white"></div>
		</div>
		<ul class="grid gap-2 text-sm">
			{#each slices as slice (slice.category)}
				<li class="flex items-center gap-2">
					<span class="size-3 shrink-0 rounded-sm" style:background={slice.color}></span>
					<span class="font-medium">{slice.category}</span>
					<span class="text-gray-500">{formatTWD(slice.total)} · {slice.pct}%</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
