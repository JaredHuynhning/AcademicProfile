<script>
	let { data } = $props();

	function formatValue(value) {
		if (typeof value === 'number') return `${value.toFixed(1)}/5`;
		return value;
	}

	function directionClass(direction) {
		if (direction === 'low') return 'text-red-600';
		if (direction === 'high') return 'text-amber-600';
		if (direction === 'adequate') return 'text-blue-600';
		return 'text-gray-600';
	}

	function priorityColor(priority) {
		if (priority === 1) return 'bg-rose-500';
		if (priority === 2) return 'bg-amber-500';
		return 'bg-blue-500';
	}

	function timeframeColor(timeframe) {
		if (timeframe === 'This week') return 'text-rose-600';
		if (timeframe === 'This month') return 'text-amber-600';
		return 'text-blue-600';
	}
</script>

{#if data}
	<section id="section-root-cause" class="report-section print-break-before">
		<h2 class="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
			<span class="text-rose-600">15</span> Root Cause Analysis
		</h2>
		<p class="text-sm text-gray-500 mb-6">Connecting the dots across your entire profile to explain <em>why</em>, not just <em>what</em></p>

		<!-- Synthesis Box -->
		<div class="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 mb-6 border border-rose-100">
			<h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
				<span class="text-xl">🔍</span> The Big Picture
			</h3>
			<p class="text-sm text-gray-700 leading-relaxed">{data.synthesis}</p>
		</div>

		<!-- Primary Pattern -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<div class="flex items-start justify-between mb-3">
				<h3 class="font-bold text-gray-900 flex items-center gap-2">
					<span class="text-xl">{data.primaryPattern.icon}</span> {data.primaryPattern.title}
				</h3>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 shrink-0">
					Primary
				</span>
			</div>
			<p class="text-sm text-gray-700 leading-relaxed mb-4">{data.primaryPattern.diagnosis}</p>

			<!-- Evidence Trail -->
			<div class="bg-gray-50 rounded-lg p-4 mb-4">
				<h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Evidence Trail</h4>
				<div class="space-y-1.5">
					{#each data.primaryPattern.evidence as ev}
						<div class="flex items-center gap-2 text-xs flex-wrap">
							<span class="text-gray-400">→</span>
							<span class="text-gray-500">{ev.source}</span>
							<span class="text-gray-300">|</span>
							<span class="text-gray-700 font-medium">{ev.metric}:</span>
							<span class="font-bold {directionClass(ev.direction)}">{formatValue(ev.value)}</span>
							<span class="text-gray-400">({ev.direction})</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- One Thing Callout -->
			<div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
				<h4 class="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
					<span>⭐</span> The One Thing
				</h4>
				<p class="text-sm font-semibold text-amber-900 mb-1">{data.primaryPattern.oneThing.action}</p>
				<p class="text-xs text-amber-700 leading-relaxed">{data.primaryPattern.oneThing.why}</p>
			</div>
		</div>

		<!-- Secondary Pattern -->
		{#if data.secondaryPattern}
			<div class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
				<div class="flex items-start justify-between mb-3">
					<h3 class="font-bold text-gray-900 flex items-center gap-2">
						<span class="text-xl">{data.secondaryPattern.icon}</span> {data.secondaryPattern.title}
					</h3>
					<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 shrink-0">
						Contributing
					</span>
				</div>
				<p class="text-sm text-gray-700 leading-relaxed mb-4">{data.secondaryPattern.diagnosis}</p>

				<div class="bg-gray-50 rounded-lg p-4 mb-4">
					<h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Evidence Trail</h4>
					<div class="space-y-1.5">
						{#each data.secondaryPattern.evidence as ev}
							<div class="flex items-center gap-2 text-xs flex-wrap">
								<span class="text-gray-400">→</span>
								<span class="text-gray-500">{ev.source}</span>
								<span class="text-gray-300">|</span>
								<span class="text-gray-700 font-medium">{ev.metric}:</span>
								<span class="font-bold {directionClass(ev.direction)}">{formatValue(ev.value)}</span>
								<span class="text-gray-400">({ev.direction})</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="bg-blue-50 rounded-lg p-3">
					<p class="text-xs text-blue-800">
						<strong>Also try:</strong> {data.secondaryPattern.oneThing.action}
					</p>
				</div>
			</div>
		{/if}

		<!-- Action Plan -->
		{#if data.actionPlan?.length > 0}
			<div class="bg-white rounded-xl shadow-sm p-6">
				<h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
					<span class="text-xl">📋</span> Your Action Plan
				</h3>
				<div class="space-y-4">
					{#each data.actionPlan as step}
						<div class="flex gap-3">
							<div class="shrink-0 w-7 h-7 rounded-full {priorityColor(step.priority)} flex items-center justify-center text-white text-xs font-bold">
								{step.priority}
							</div>
							<div class="min-w-0">
								<p class="text-sm font-semibold text-gray-900">{step.action}</p>
								<p class="text-xs text-gray-500 mt-0.5">{step.impact}</p>
								<span class="text-xs font-medium {timeframeColor(step.timeframe)} mt-1 inline-block">{step.timeframe}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
