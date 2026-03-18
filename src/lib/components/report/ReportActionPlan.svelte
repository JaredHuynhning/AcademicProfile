<script>
	let { data = {} } = $props();

	const topActions = $derived(data.topActions || []);
	const quickWins = $derived(data.quickWins || []);
	const stopDoing = $derived(data.stopDoing || []);

	const rankColors = ['bg-rose-600', 'bg-amber-500', 'bg-blue-500'];
</script>

<section class="report-section print-break-before" id="section-action-plan">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Action Plan</h2>
	<p class="text-sm text-gray-500 mb-6">Prioritised actions drawn directly from your cross-system patterns — ranked by impact, not complexity.</p>

	<!-- Top 3 actions -->
	{#if topActions.length > 0}
		<div class="mb-4 space-y-3 print-break-avoid">
			<h3 class="font-bold text-gray-900">Top Priority Actions</h3>
			{#each topActions as action}
				<div class="bg-white rounded-2xl shadow-sm p-5 flex gap-4">
					<div class="flex-shrink-0">
						<span class="w-9 h-9 rounded-full {rankColors[action.rank - 1] || 'bg-gray-500'} text-white text-lg font-extrabold flex items-center justify-center">
							{action.rank}
						</span>
					</div>
					<div class="flex-1">
						<div class="flex flex-wrap gap-2 mb-2">
							<span class="text-xs bg-rose-100 text-rose-700 rounded-full px-2 py-0.5 font-medium">{action.personalityRoot}</span>
							<span class="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">→ {action.academicTarget}</span>
						</div>
						<p class="text-xs text-gray-500 leading-relaxed mb-2 italic">{action.context}</p>
						<p class="text-sm text-gray-900 font-semibold leading-relaxed">{action.action}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Quick Wins -->
	{#if quickWins.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3">Quick Wins — Leverage Your Strengths</h3>
			<div class="flex flex-wrap gap-2">
				{#each quickWins as win}
					<span class="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
						<span class="text-green-500">✓</span>
						{win.action}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Study Prescription -->
	{#if data.studyPrescription}
		<div class="bg-blue-50 rounded-2xl p-5 mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-2">Study Prescription</h3>
			<p class="text-sm font-bold text-blue-900 mb-2">{data.studyPrescription.method}</p>
			<p class="text-xs text-blue-800 leading-relaxed">{data.studyPrescription.rationale}</p>
		</div>
	{/if}

	<!-- Stop Doing -->
	{#if stopDoing.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3">Stop Doing</h3>
			<div class="space-y-2">
				{#each stopDoing as item}
					<div class="border-l-4 border-rose-400 pl-3 py-1">
						<p class="text-sm font-semibold text-gray-800">{item.behaviour}</p>
						<p class="text-xs text-gray-500 mt-0.5">{item.reason}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Weekly Rhythm -->
	{#if data.weeklyRhythm}
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-gray-900 mb-3">Recommended Weekly Rhythm</h3>
			<div class="grid grid-cols-2 gap-4">
				<div class="bg-indigo-50 rounded-xl p-4">
					<p class="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Weekdays</p>
					<p class="text-xs text-gray-700 leading-relaxed">{data.weeklyRhythm.weekday}</p>
				</div>
				<div class="bg-violet-50 rounded-xl p-4">
					<p class="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2">Weekend</p>
					<p class="text-xs text-gray-700 leading-relaxed">{data.weeklyRhythm.weekend}</p>
				</div>
			</div>
		</div>
	{/if}
</section>
