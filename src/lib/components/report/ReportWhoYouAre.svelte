<script>
	let { data = {} } = $props();

	const personalityDNA = $derived(data.personalityDNA || []);
	const crossRefTable = $derived(data.crossRefTable || []);
	const topStrengths = $derived(personalityDNA.filter(d => d.role === 'strength'));
	const growthAreas = $derived(personalityDNA.filter(d => d.role === 'growth'));
</script>

<section class="report-section print-break-before" id="section-who-you-are">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Who You Are</h2>
	<p class="text-sm text-gray-500 mb-6">Your personality DNA — the traits that shape how you show up in every learning situation.</p>

	<!-- Personality DNA grid -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-4">Personality DNA</h3>
		<div class="grid grid-cols-3 gap-3 mb-2">
			{#each topStrengths as dim}
				<div class="border-l-4 border-green-400 bg-green-50 rounded-xl p-3">
					<div class="flex items-center gap-2 mb-1">
						<span class="text-lg">{dim.icon}</span>
						<span class="text-xs font-bold text-gray-800">{dim.name}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-base font-extrabold" style="color: {dim.color}">{dim.score}</span>
						<span class="text-xs text-gray-500">/5</span>
						<span class="text-xs text-green-600 font-medium capitalize ml-auto">{dim.level}</span>
					</div>
					<p class="text-xs text-green-700 mt-1 font-medium">#{dim.rank} Strongest</p>
				</div>
			{/each}
		</div>
		<div class="grid grid-cols-3 gap-3">
			{#each growthAreas as dim}
				<div class="border-l-4 border-blue-300 bg-blue-50 rounded-xl p-3">
					<div class="flex items-center gap-2 mb-1">
						<span class="text-lg">{dim.icon}</span>
						<span class="text-xs font-bold text-gray-800">{dim.name}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-base font-extrabold" style="color: {dim.color}">{dim.score}</span>
						<span class="text-xs text-gray-500">/5</span>
						<span class="text-xs text-blue-600 font-medium capitalize ml-auto">{dim.level}</span>
					</div>
					<p class="text-xs text-blue-700 mt-1 font-medium">Growth Area</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Cross-reference table -->
	{#if crossRefTable.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-4">Personality ↔ Academic Behaviour Links</h3>
			<div class="space-y-2">
				{#each crossRefTable as row}
					<div class="rounded-xl p-3 {row.type === 'confirmation' ? 'bg-green-50' : 'bg-amber-50'}">
						<div class="flex flex-wrap items-center gap-2 mb-1">
							<span class="text-xs font-bold {row.type === 'confirmation' ? 'text-green-700' : 'text-amber-700'}">
								{row.trait}
							</span>
							<span class="text-xs text-gray-500">{row.traitScore}/5</span>
							<span class="text-xs text-gray-400">→</span>
							<span class="text-xs font-semibold text-gray-700">{row.behaviour}</span>
							<span class="text-xs text-gray-500">{row.behaviourScore}/5</span>
							<span class="ml-auto text-xs uppercase font-bold px-2 py-0.5 rounded-full {row.type === 'confirmation' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}">
								{row.type === 'confirmation' ? 'Confirms' : 'Root Cause'}
							</span>
						</div>
						<p class="text-xs text-gray-600 leading-relaxed">{row.evidence}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="bg-gray-50 rounded-2xl p-5 print-break-avoid">
			<p class="text-sm text-gray-500 text-center">Cross-system patterns will appear here when both personality and academic data are available.</p>
		</div>
	{/if}
</section>
