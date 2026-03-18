<script>
	let { data = {} } = $props();

	const rootCauseChains = $derived(data.rootCauseChains || []);
	const cycles = $derived(data.cycles || []);
	const misdiagnoses = $derived(data.misdiagnoses || []);
	const priorityRanking = $derived(data.priorityRanking || []);
</script>

<section class="report-section print-break-before" id="section-barriers">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">What's Holding You Back</h2>
	<p class="text-sm text-gray-500 mb-6">Root cause analysis — the personality patterns that drive academic challenges, with the real diagnosis behind the visible symptoms.</p>

	<!-- Fallback -->
	{#if data.fallbackMessage && rootCauseChains.length === 0}
		<div class="bg-green-50 rounded-2xl p-5 mb-4 print-break-avoid">
			<p class="text-sm text-green-800 font-medium">{data.fallbackMessage}</p>
		</div>
	{/if}

	<!-- Root Cause Chains -->
	{#if rootCauseChains.length > 0}
		<div class="mb-4 space-y-4 print-break-avoid">
			<h3 class="font-bold text-gray-900">Root Cause Chains</h3>
			{#each rootCauseChains as chain}
				<div class="bg-white rounded-2xl shadow-sm p-5">
					<!-- Visual flow -->
					<div class="flex items-center flex-wrap gap-2 mb-3">
						<span class="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full">
							{chain.personalityRoot} ({chain.personalityScore}/5)
						</span>
						<span class="text-gray-400 text-sm">→</span>
						<span class="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
							{chain.academicSymptom} ({chain.academicScore}/5)
						</span>
						<span class="text-gray-400 text-sm">→</span>
						<span class="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
							{chain.visibleBehaviour}
						</span>
					</div>
					<p class="text-sm text-gray-700 leading-relaxed mb-3">{chain.insight}</p>
					<div class="bg-amber-50 rounded-lg p-3">
						<p class="text-xs text-amber-800"><strong>What to do:</strong> {chain.action}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Cycle Narratives -->
	{#if cycles.length > 0}
		<div class="mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3">The Cycles Behind the Symptoms</h3>
			<div class="space-y-3">
				{#each cycles as cycle}
					<div class="bg-amber-50 rounded-xl p-4 border border-amber-200">
						<p class="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">{cycle.title}</p>
						<p class="text-xs text-gray-700 leading-relaxed italic">{cycle.narrative}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Misdiagnoses -->
	{#if misdiagnoses.length > 0}
		<div class="mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3">Common Misdiagnoses</h3>
			<div class="space-y-2">
				{#each misdiagnoses as mis}
					<div class="grid grid-cols-2 gap-2">
						<div class="bg-gray-50 rounded-xl p-3">
							<p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">What it looks like</p>
							<p class="text-xs text-gray-700">{mis.looksLike}</p>
						</div>
						<div class="bg-green-50 rounded-xl p-3">
							<p class="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">What's really happening</p>
							<p class="text-xs text-gray-700">{mis.actuallyIs}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Priority Ranking -->
	{#if priorityRanking.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3">Barriers by Priority</h3>
			<div class="space-y-2">
				{#each priorityRanking as item}
					<div class="flex items-start gap-3">
						<span class="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
							{item.rank}
						</span>
						<p class="text-xs text-gray-700 leading-relaxed">{item.barrier}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>
