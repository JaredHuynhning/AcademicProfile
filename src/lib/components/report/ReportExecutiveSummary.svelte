<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-executive-summary">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Executive Summary</h2>
	<p class="text-sm text-gray-500 mb-6">Cross-system synthesis: who this student is, what drives them, and what to do first.</p>

	<!-- Archetype badge -->
	<div class="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 mb-4 print-break-avoid">
		<p class="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">Learning Archetype</p>
		<span class="inline-block bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full">
			{data.archetype}
		</span>
	</div>

	<!-- Narrative paragraph -->
	{#if data.narrative}
		<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
			<p class="text-sm text-gray-700 leading-relaxed">{data.narrative}</p>
		</div>
	{/if}

	<!-- Top Strength + Top Challenge side-by-side -->
	<div class="grid grid-cols-2 gap-4 mb-4 print-break-avoid">
		<!-- Top Strength -->
		<div class="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-400">
			<h3 class="text-xs font-bold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-1">
				<span class="text-green-500">✓</span> Top Strength
			</h3>
			{#if data.topStrength}
				<p class="text-xs text-gray-600 leading-relaxed mb-2">{data.topStrength.insight}</p>
				<div class="flex flex-wrap gap-1 mt-2">
					<span class="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">{data.topStrength.personality}</span>
					<span class="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">→ {data.topStrength.academic}</span>
				</div>
			{:else}
				<p class="text-xs text-gray-500 italic">Your scores are well-balanced — a solid all-round foundation.</p>
			{/if}
		</div>

		<!-- Top Challenge -->
		<div class="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-amber-400">
			<h3 class="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1">
				<span class="text-amber-500">!</span> Top Challenge
			</h3>
			{#if data.topBarrier}
				<p class="text-xs text-gray-600 leading-relaxed mb-2">{data.topBarrier.insight}</p>
				<div class="flex flex-wrap gap-1 mt-2">
					<span class="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-medium">{data.topBarrier.personality}</span>
					<span class="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">→ {data.topBarrier.academic}</span>
				</div>
			{:else}
				<p class="text-xs text-gray-500 italic">No major barriers detected — keep building on what works.</p>
			{/if}
		</div>
	</div>

	<!-- Most Impactful Action -->
	<div class="bg-blue-50 rounded-2xl p-5 print-break-avoid">
		<h3 class="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1">
			<span>→</span> Most Impactful Action
		</h3>
		<p class="text-sm text-blue-900 font-medium leading-relaxed">
			{data.topAction || 'Continue building on existing strengths and monitor for emerging challenges.'}
		</p>
	</div>
</section>
