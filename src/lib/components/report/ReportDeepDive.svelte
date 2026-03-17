<script>
	let { data = {} } = $props();

	function levelLabel(level) {
		const labels = { very_low: 'Very Low', low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High' };
		return labels[level] || level;
	}

	function levelColor(level) {
		if (level === 'high' || level === 'very_high') return 'text-green-700 bg-green-50';
		if (level === 'low' || level === 'very_low') return 'text-amber-700 bg-amber-50';
		return 'text-blue-700 bg-blue-50';
	}
</script>

<section class="report-section print-break-before" id="section-deep-dive">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Deep Dive: Your Six Dimensions</h2>
	<p class="text-sm text-gray-500 mb-6">Each dimension broken down into four facets with personalised insights.</p>

	<div class="space-y-5">
		{#each data.dimensions as dim}
			<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
				<div class="flex items-center gap-3 mb-3">
					<span class="text-2xl">{dim.icon}</span>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<h3 class="text-lg font-bold text-gray-900">{dim.name}</h3>
							<span class="text-xs font-bold px-2 py-0.5 rounded-full"
								style="background: {dim.color}15; color: {dim.color}">
								{dim.score}/5 / {levelLabel(dim.level)}
							</span>
						</div>
					</div>
				</div>

				<p class="text-sm text-gray-700 leading-relaxed mb-4">{dim.insight}</p>

				<!-- Facet Insights (narrative, not bars) -->
				{#if dim.facetInsights?.length > 0}
					<div class="space-y-2.5 mb-4">
						{#each dim.facetInsights as fi}
							{#if fi}
								<div class="flex items-start gap-2">
									<span class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 {levelColor(fi.level)}">
										{fi.name}
									</span>
									<p class="text-sm text-gray-600 leading-relaxed">{fi.text}</p>
								</div>
							{/if}
						{/each}
					</div>
				{/if}

				{#if dim.learningCallout.text}
					<div class="bg-gray-50 rounded-lg p-3 border-l-3"
						style="border-left: 3px solid {dim.color}">
						<div class="flex items-center gap-2 mb-1">
							<span>{dim.learningCallout.icon}</span>
							<span class="text-xs font-bold text-gray-800">{dim.learningCallout.title}</span>
						</div>
						<p class="text-xs text-gray-600 leading-relaxed">{dim.learningCallout.text}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
