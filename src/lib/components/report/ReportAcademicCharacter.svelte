<script>
	let { data } = $props();

	function levelBadge(level) {
		if (level === 'high') return 'bg-green-50 text-green-700';
		if (level === 'moderate') return 'bg-amber-50 text-amber-700';
		return 'bg-red-50 text-red-700';
	}
</script>

{#if data}
	<section id="section-academic-character" class="report-section">
		<h2 class="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
			<span class="text-emerald-600">12</span> Academic Character
		</h2>
		<p class="text-sm text-gray-500 mb-6">Your grit, focus, procrastination patterns, and energy: the engine behind your learning</p>

		<!-- Grit & Resilience -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-1 flex items-center gap-2">
				<span class="text-xl">🔥</span> Grit & Resilience
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.grit.overall.level)}">
					Overall: {data.grit.overall.score}/5 / {data.grit.overall.level}
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.grit.perseverance.level)}">
					Perseverance: {data.grit.perseverance.score}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full {levelBadge(data.grit.consistency.level)}">
					Consistency: {data.grit.consistency.score}/5
				</span>
			</div>

			<p class="text-sm text-gray-700 leading-relaxed mb-2">{data.grit.overallNarrative}</p>
			<div class="flex items-start gap-1.5 mt-1">
				<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.grit.overall.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
					{data.grit.overall.classification === 'strength' ? 'Strength' : 'Needs Work'}
				</span>
			</div>
			<p class="text-xs text-gray-600 mt-1 mb-3 italic">{data.grit.overall.tip}</p>

			<div class="space-y-2 text-sm text-gray-600">
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Perseverance:</span> {data.grit.perseveranceNarrative}
					<div class="flex items-start gap-1.5 mt-2">
						<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.grit.perseverance.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
							{data.grit.perseverance.classification === 'strength' ? 'Strength' : 'Needs Work'}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1 italic">{data.grit.perseverance.tip}</p>
				</div>
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Goal Consistency:</span> {data.grit.consistencyNarrative}
					<div class="flex items-start gap-1.5 mt-2">
						<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.grit.consistency.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
							{data.grit.consistency.classification === 'strength' ? 'Strength' : 'Needs Work'}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1 italic">{data.grit.consistency.tip}</p>
				</div>
			</div>

			{#if data.grit.strengths?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Strengths</h4>
					{#each data.grit.strengths as s}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}
						</p>
					{/each}
				</div>
			{/if}

			{#if data.grit.weaknesses?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Weaknesses</h4>
					{#each data.grit.weaknesses as w}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}
						</p>
					{/each}
				</div>
			{/if}

			{#if data.grit.actions?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">What To Do</h4>
					{#each data.grit.actions as a}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-blue-500 mt-0.5 shrink-0">&rarr;</span>{a}
						</p>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Focus & Procrastination -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6 print-break-avoid">
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
					<div class="flex items-start gap-1.5 mt-2">
						<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.focus.concentration.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
							{data.focus.concentration.classification === 'strength' ? 'Strength' : 'Needs Work'}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1 italic">{data.focus.concentration.tip}</p>
				</div>
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Procrastination:</span> {data.focus.procrastinationNarrative}
					<div class="flex items-start gap-1.5 mt-2">
						<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.focus.procrastination.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
							{data.focus.procrastination.classification === 'strength' ? 'Strength' : 'Needs Work'}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1 italic">{data.focus.procrastination.tip}</p>
				</div>
			</div>

			{#if data.focus.strengths?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Strengths</h4>
					{#each data.focus.strengths as s}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}
						</p>
					{/each}
				</div>
			{/if}

			{#if data.focus.weaknesses?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Weaknesses</h4>
					{#each data.focus.weaknesses as w}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}
						</p>
					{/each}
				</div>
			{/if}

			{#if data.focus.actions?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">What To Do</h4>
					{#each data.focus.actions as a}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-blue-500 mt-0.5 shrink-0">&rarr;</span>{a}
						</p>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Energy & Stamina -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6 print-break-avoid">
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

			<p class="text-sm text-gray-600 leading-relaxed mb-3">{data.energy.narrative}</p>

			<div class="space-y-2 text-sm text-gray-600">
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Vitality:</span>
					<div class="flex items-start gap-1.5 mt-2">
						<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.energy.vitality.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
							{data.energy.vitality.classification === 'strength' ? 'Strength' : 'Needs Work'}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1 italic">{data.energy.vitality.tip}</p>
				</div>
				<div class="bg-gray-50 rounded-lg p-3">
					<span class="font-semibold text-gray-700">Net Energy:</span>
					<div class="flex items-start gap-1.5 mt-2">
						<span class="text-xs font-semibold px-1.5 py-0.5 rounded {data.energy.netEnergy.classification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
							{data.energy.netEnergy.classification === 'strength' ? 'Strength' : 'Needs Work'}
						</span>
					</div>
					<p class="text-xs text-gray-600 mt-1 italic">{data.energy.netEnergy.tip}</p>
				</div>
			</div>

			{#if data.energy.strengths?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Strengths</h4>
					{#each data.energy.strengths as s}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}
						</p>
					{/each}
				</div>
			{/if}

			{#if data.energy.weaknesses?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Weaknesses</h4>
					{#each data.energy.weaknesses as w}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}
						</p>
					{/each}
				</div>
			{/if}

			{#if data.energy.actions?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">What To Do</h4>
					{#each data.energy.actions as a}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
							<span class="text-blue-500 mt-0.5 shrink-0">&rarr;</span>{a}
						</p>
					{/each}
				</div>
			{/if}
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
