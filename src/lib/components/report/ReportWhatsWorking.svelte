<script>
	let { data = {} } = $props();

	const confirmed = $derived(data.confirmed || []);
	const untapped = $derived(data.untapped || []);
	const learnedSkills = $derived(data.learnedSkills || []);
	const strengthStack = $derived(data.strengthStack || []);
</script>

<section class="report-section print-break-before" id="section-whats-working">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">What's Working</h2>
	<p class="text-sm text-gray-500 mb-6">Your confirmed strengths, untapped potential, and skills you've built — with evidence from both personality and academic data.</p>

	<!-- Fallback message -->
	{#if data.fallbackMessage && confirmed.length === 0}
		<div class="bg-blue-50 rounded-2xl p-5 mb-4 print-break-avoid">
			<p class="text-sm text-blue-800">{data.fallbackMessage}</p>
		</div>
	{/if}

	<!-- Confirmed Strengths -->
	{#if confirmed.length > 0}
		<div class="mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</span>
				Confirmed Strengths
			</h3>
			<div class="space-y-3">
				{#each confirmed as insight}
					<div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
						<p class="text-sm text-gray-800 font-medium leading-relaxed mb-2">{insight.insight}</p>
						<div class="flex flex-wrap gap-2 mb-2">
							<span class="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
								Personality: {insight.personality.facet ?? insight.personality.dim} {insight.personality.score}/5
							</span>
							<span class="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
								Academic: {insight.academic.metric} {insight.academic.score}/5
							</span>
							{#if insight.dualFire}
								<span class="text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">Dual-fire trait</span>
							{/if}
						</div>
						<div class="bg-green-50 rounded-lg p-2">
							<p class="text-xs text-green-800"><strong>Action:</strong> {insight.action}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Untapped Potential -->
	{#if untapped.length > 0}
		<div class="mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">→</span>
				Untapped Potential
			</h3>
			<div class="space-y-3">
				{#each untapped as insight}
					<div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-400">
						<p class="text-sm text-gray-800 font-medium leading-relaxed mb-2">{insight.insight}</p>
						<div class="flex flex-wrap gap-2 mb-2">
							<span class="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
								Personality: {insight.personality.facet ?? insight.personality.dim} {insight.personality.score}/5
							</span>
							<span class="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
								Opportunity: {insight.academic.metric} {insight.academic.score}/5
							</span>
						</div>
						<div class="bg-blue-50 rounded-lg p-2">
							<p class="text-xs text-blue-800"><strong>Opportunity:</strong> {insight.action}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Learned Skills -->
	{#if learnedSkills.length > 0}
		<div class="mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">★</span>
				Learned Skills — Protect These
			</h3>
			<div class="space-y-2">
				{#each learnedSkills as skill}
					<div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-400">
						<div class="flex items-center gap-2 mb-1">
							<span class="text-sm font-semibold text-gray-900">{skill.metric}</span>
							<span class="text-xs font-bold text-purple-600 ml-auto">{skill.score}/5</span>
						</div>
						<p class="text-xs text-gray-600 leading-relaxed">{skill.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Strength Stack top 5 -->
	{#if strengthStack.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-4">Your Top Strength Stack</h3>
			<div class="space-y-2">
				{#each strengthStack as item}
					<div class="flex items-start gap-3">
						<span class="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
							{item.rank}
						</span>
						<p class="text-xs text-gray-700 leading-relaxed">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>
