<script>
	let { data } = $props();

	function levelBadge(level) {
		if (level === 'high') return 'bg-green-50 text-green-700';
		if (level === 'moderate') return 'bg-amber-50 text-amber-700';
		return 'bg-red-50 text-red-700';
	}
</script>

{#if data}
	<section id="section-academic-character" class="report-section print-break-before">
		<h2 class="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
			<span class="text-emerald-600">12</span> Academic Character
		</h2>
		<p class="text-sm text-gray-500 mb-6">Your grit, focus, procrastination patterns, and energy — the engine behind your learning</p>

		<!-- Grit & Resilience -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-1 flex items-center gap-2">
				<span class="text-xl">🔥</span> Grit & Resilience
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.grit.overall.level)}">
					Overall: {data.grit.overall.score}/5 — {data.grit.overall.level}
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.grit.perseverance.level)}">
					Perseverance: {data.grit.perseverance.score}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.grit.consistency.level)}">
					Consistency: {data.grit.consistency.score}/5
				</span>
			</div>

			<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.grit.overallNarrative}</p>

			<div class="space-y-2 text-sm text-gray-600">
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Perseverance:</span> {data.grit.perseveranceNarrative}
				</div>
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Goal Consistency:</span> {data.grit.consistencyNarrative}
				</div>
			</div>
		</div>

		<!-- Focus & Procrastination -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-1 flex items-center gap-2">
				<span class="text-xl">🎯</span> Focus & Procrastination
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.focus.concentration.level)}">
					Concentration: {data.focus.concentration.score}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.focus.procrastination.level)}">
					Anti-Procrastination: {data.focus.procrastination.score}/5
				</span>
			</div>

			<div class="space-y-2 text-sm text-gray-600">
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Concentration:</span> {data.focus.concentrationNarrative}
				</div>
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Procrastination:</span> {data.focus.procrastinationNarrative}
				</div>
			</div>
		</div>

		<!-- Energy & Stamina -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-1 flex items-center gap-2">
				<span class="text-xl">⚡</span> Energy & Stamina
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.energy.netEnergy.level)}">
					Net Energy: {data.energy.netEnergy.score}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.energy.vitality.level)}">
					Vitality: {data.energy.vitality.score}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.energy.depletion.level)}">
					Recovery: {data.energy.depletion.score}/5
				</span>
			</div>

			<p class="text-sm text-gray-600 leading-relaxed">{data.energy.narrative}</p>
		</div>

		<!-- Cross-System Reference -->
		{#if data.crossRef}
			<div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
				<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
					<span class="text-xl">🔗</span> Personality × Character Insights
				</h3>
				<div class="space-y-3">
					{#each data.crossRef as insight}
						<div class="bg-white/80 rounded-lg p-3">
							<span class="mr-2">{insight.icon}</span>
							<span class="text-sm text-gray-700">{insight.text}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
