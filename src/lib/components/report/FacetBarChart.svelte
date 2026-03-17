<script>
	let { facets = [], color = '#6366f1' } = $props();
</script>

<div class="space-y-2">
	{#each facets as facet}
		<div class="flex items-center gap-2 print-break-avoid">
			<span class="text-xs text-gray-600 w-28 shrink-0 text-right">{facet.name}</span>
			<div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
				<div class="h-full rounded-full transition-all duration-500"
					style="width: {facet.percent}%; background: {color}">
				</div>
			</div>
			<span class="text-xs font-medium text-gray-600 w-8 shrink-0">{facet.score}</span>
		</div>
	{/each}
</div>
