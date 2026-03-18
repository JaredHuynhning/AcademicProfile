<script>
	let { data = {} } = $props();

	const idealConditions = $derived(data.idealConditions || []);
	const alignments = $derived(data.alignments || []);
	const aligned = $derived(alignments.filter(a => a.type === 'aligned'));
	const conflicts = $derived(alignments.filter(a => a.type === 'conflict'));
</script>

<section class="report-section print-break-before" id="section-how-you-learn">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">How You Learn Best</h2>
	<p class="text-sm text-gray-500 mb-6">Your ideal learning conditions and where your personality aligns (or clashes) with your current habits.</p>

	<!-- Archetype badge -->
	<div class="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-4 mb-4 print-break-avoid flex items-center gap-3">
		<span class="text-xs font-bold text-violet-500 uppercase tracking-wider">Learning Style:</span>
		<span class="inline-block bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
			{data.archetype}
		</span>
	</div>

	<!-- Ideal conditions 2×2 grid -->
	<div class="grid grid-cols-2 gap-3 mb-4 print-break-avoid">
		{#each idealConditions as condition}
			<div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-xl">{condition.icon}</span>
					<h4 class="text-xs font-bold text-gray-700 uppercase tracking-wide">{condition.category}</h4>
				</div>
				<p class="text-xs text-gray-600 leading-relaxed">{condition.description}</p>
			</div>
		{/each}
	</div>

	<!-- Alignments & Conflicts -->
	{#if aligned.length > 0 || conflicts.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-4">Alignments & Conflicts</h3>

			{#if aligned.length > 0}
				<div class="mb-4">
					<p class="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
						<span class="text-green-500">✓</span> Aligned — personality supports current habits
					</p>
					<div class="space-y-2">
						{#each aligned as item}
							<div class="bg-green-50 rounded-lg p-3 border-l-3 border-green-400">
								<p class="text-xs text-gray-700 leading-relaxed">{item.description}</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if conflicts.length > 0}
				<div>
					<p class="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
						<span class="text-amber-500">!</span> Conflicts — personality and habits are pulling in different directions
					</p>
					<div class="space-y-2">
						{#each conflicts as item}
							<div class="bg-amber-50 rounded-lg p-3 border-l-3 border-amber-400">
								<p class="text-xs text-gray-700 leading-relaxed">{item.description}</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</section>
