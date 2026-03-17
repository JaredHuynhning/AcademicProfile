<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-strengths">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Strengths, Challenges & Self-Awareness</h2>
	<p class="text-sm text-gray-500 mb-6">Your top strengths deep-analysed, challenges reframed, and reflections for growth.</p>

	<!-- Top Strengths -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
		<h3 class="font-bold text-green-800 mb-4 flex items-center gap-2">
			<span class="text-green-500">✦</span> Your Top Strengths
		</h3>
		<div class="space-y-4">
			{#each data.strengths as strength}
				<div class="border-l-3 pl-4 print-break-avoid" style="border-color: {strength.color}">
					<div class="flex items-center gap-2 mb-1">
						<span class="text-sm font-bold text-gray-900">{strength.name}</span>
						<span class="text-xs text-gray-500">({strength.dimShort})</span>
						<span class="text-xs font-bold" style="color: {strength.color}">{strength.score}/5</span>
					</div>
					<div class="space-y-1.5 text-xs text-gray-600 leading-relaxed">
						<p><strong class="text-gray-700">Academic Impact:</strong> {strength.analysis.academic}</p>
						<p><strong class="text-gray-700">In the Classroom:</strong> {strength.analysis.classroom}</p>
						<p><strong class="text-gray-700">How to Leverage:</strong> {strength.analysis.leverage}</p>
					</div>
					<div class="bg-green-50 rounded p-2 mt-2">
						<p class="text-xs text-green-800"><strong>Action Tip:</strong> {strength.leverageTip}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Challenges (Reframed) -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
		<h3 class="font-bold text-blue-800 mb-2 flex items-center gap-2">
			<span class="text-blue-500">↗</span> Growth Edges
		</h3>
		<p class="text-xs text-gray-500 mb-4">These are not weaknesses. They are areas where small improvements create big results.</p>
		<div class="space-y-4">
			{#each data.challenges as challenge}
				<div class="border-l-3 pl-4 print-break-avoid" style="border-color: {challenge.color}">
					<div class="flex items-center gap-2 mb-1">
						<span class="text-sm font-bold text-gray-900">{challenge.name}</span>
						<span class="text-xs text-gray-500">({challenge.dimShort})</span>
						<span class="text-xs font-bold" style="color: {challenge.color}">{challenge.score}/5</span>
					</div>
					<p class="text-xs text-gray-700 leading-relaxed mb-1.5 italic">{challenge.reframe}</p>
					<div class="bg-blue-50 rounded p-2">
						<p class="text-xs text-blue-800"><strong>Growth Tip:</strong> {challenge.supportTip}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Self-Reflection -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Self-Reflection Prompts</h3>
		<div class="space-y-3">
			{#each data.selfReflection as prompt}
				<div class="bg-violet-50 rounded-lg p-3">
					<p class="text-sm font-medium text-violet-900">{prompt.question}</p>
					<p class="text-xs text-violet-700 mt-1 italic">{prompt.purpose}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Growth Mindset -->
	<div class="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-5 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-2">Growth Mindset</h3>
		<p class="text-sm text-gray-700 leading-relaxed mb-2">{data.growthMindset.message}</p>
		<p class="text-sm text-gray-800 font-medium mb-2">{data.growthMindset.keyPrinciple}</p>
		<div class="bg-white/70 rounded-lg p-3">
			<p class="text-xs text-gray-700"><strong>This Week's Challenge:</strong> {data.growthMindset.actionStep}</p>
		</div>
	</div>
</section>
