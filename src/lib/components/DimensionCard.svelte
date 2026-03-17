<script>
	let { dimension, dimKey, insight, color } = $props();
	let expanded = $state(false);

	const levelLabels = {
		very_low: 'Very Low',
		low: 'Low',
		moderate: 'Moderate',
		high: 'High',
		very_high: 'Very High'
	};

	let barWidth = $derived(((dimension.score / 5) * 100).toFixed(0));
	let facets = $derived(Object.entries(dimension.facets));
</script>

<div class="bg-white rounded-xl shadow-sm overflow-hidden">
	<button
		onclick={() => (expanded = !expanded)}
		class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
	>
		<div class="flex items-center gap-3">
			<div class="w-3 h-3 rounded-full shrink-0" style="background: {color}"></div>
			<div>
				<span class="font-semibold text-gray-900">{dimension.name}</span>
				<span class="ml-2 text-sm text-gray-400">({dimKey})</span>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<span class="text-sm font-medium px-2.5 py-0.5 rounded-full"
				style="background: {color}20; color: {color}">
				{dimension.score.toFixed(1)} / {levelLabels[dimension.level]}
			</span>
			<span class="text-gray-400 transition-transform dimension-toggle-arrow {expanded ? 'rotate-180' : ''}">▼</span>
		</div>
	</button>

	<!-- Score bar -->
	<div class="px-6 pb-3">
		<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
			<div class="h-full rounded-full transition-all duration-500" style="width: {barWidth}%; background: {color}"></div>
		</div>
	</div>

	<div class="dimension-details px-6 pb-5 space-y-4 border-t border-gray-100 pt-4" style:display={expanded ? 'block' : 'none'}>
		<!-- Insight -->
		<p class="text-sm text-gray-600 leading-relaxed">{insight.insight}</p>

		<!-- Facet breakdown -->
		<div class="space-y-2">
			<h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Facets</h4>
			{#each facets as [key, facet]}
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 w-36 shrink-0">{facet.name}</span>
					<div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
						<div class="h-full rounded-full" style="width: {(facet.score / 5) * 100}%; background: {color}80"></div>
					</div>
					<span class="text-xs text-gray-400 w-8 text-right">{facet.score.toFixed(1)}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
