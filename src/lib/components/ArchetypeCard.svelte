<script>
	let { archetype, rank } = $props();

	let matchPercent = $derived(Math.round(archetype.match_score * 100));

	const rankColors = {
		1: 'from-amber-400 to-amber-500',
		2: 'from-gray-300 to-gray-400',
		3: 'from-orange-300 to-orange-400'
	};

	let badgeGradient = $derived(rankColors[rank] || 'from-gray-200 to-gray-300');
</script>

<div class="bg-white rounded-xl shadow-sm p-6 border-l-4"
	style="border-color: {rank === 1 ? '#f59e0b' : rank === 2 ? '#9ca3af' : '#f97316'}">
	<div class="flex items-start justify-between mb-3">
		<div class="flex items-center gap-3">
			<span class="text-3xl">{archetype.icon}</span>
			<div>
				<h3 class="font-bold text-gray-900">{archetype.name}</h3>
				<p class="text-sm text-gray-500">{archetype.description}</p>
			</div>
		</div>
		<div class="flex flex-col items-end shrink-0">
			<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r {badgeGradient}">
				#{rank}
			</span>
			<span class="text-lg font-bold mt-1" style="color: {rank === 1 ? '#f59e0b' : '#6b7280'}">
				{matchPercent}%
			</span>
		</div>
	</div>

	<div class="space-y-2 mt-4">
		<div>
			<h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Teaching Style</h4>
			<p class="text-sm text-gray-700">{archetype.teaching_style}</p>
		</div>
		<div>
			<h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Key Insight</h4>
			<p class="text-sm text-gray-700 italic">{archetype.key_insight}</p>
		</div>
		{#if archetype.explanation}
			<div class="mt-3 px-3 py-2 bg-blue-50 rounded-lg">
				<p class="text-sm text-blue-700">{archetype.explanation}</p>
			</div>
		{/if}
	</div>
</div>
