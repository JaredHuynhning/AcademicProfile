<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-learning">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">How You Learn Best</h2>
	<p class="text-sm text-gray-500 mb-6">Your ideal learning environment, attention profile, and preferred formats.</p>

	<!-- Learning Style Summary -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-2">Your Learning Style</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
			<div class="bg-blue-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-blue-600 uppercase tracking-wide">Study Style</div>
				<div class="font-bold text-blue-900 mt-1 text-sm">{data.learningStyle.primary.label}</div>
			</div>
			<div class="bg-violet-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-violet-600 uppercase tracking-wide">Work Approach</div>
				<div class="font-bold text-violet-900 mt-1 text-sm">{data.learningStyle.secondary.label}</div>
			</div>
			<div class="bg-orange-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-orange-600 uppercase tracking-wide">Curiosity Style</div>
				<div class="font-bold text-orange-900 mt-1 text-sm">{data.learningStyle.curiosity.label}</div>
			</div>
		</div>
		<p class="text-sm text-gray-700 leading-relaxed">{data.learningStyle.summary}</p>
	</div>

	<!-- Ideal Environment -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Your Ideal Learning Environment</h3>
		<div class="space-y-3">
			{#each data.idealEnvironment as env}
				<div class="flex gap-3">
					<span class="text-lg shrink-0">{env.icon}</span>
					<div>
						<div class="text-sm font-semibold text-gray-800">{env.category}</div>
						{#each env.recommendation as line}
							<p class="text-xs text-gray-600 leading-relaxed">{line}</p>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Attention Profile -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Attention & Focus Profile</h3>
		<div class="grid grid-cols-2 gap-3">
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-gray-500 uppercase">Sustained Focus</div>
				<div class="text-sm text-gray-800 mt-1">{data.attentionProfile.sustainedFocus}</div>
			</div>
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-gray-500 uppercase">Best Time Blocks</div>
				<div class="text-sm text-gray-800 mt-1">{data.attentionProfile.bestTimeBlocks}</div>
			</div>
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-gray-500 uppercase">Distraction Risk</div>
				<div class="text-sm text-gray-800 mt-1">{data.attentionProfile.distractionRisk}</div>
			</div>
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-gray-500 uppercase">Engagement Driver</div>
				<div class="text-sm text-gray-800 mt-1">{data.attentionProfile.engagementDriver}</div>
			</div>
		</div>
	</div>

	<!-- Preferred Formats -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Preferred Learning Formats</h3>
		<div class="space-y-2">
			{#each data.preferredFormats as fmt}
				<div class="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
					<span class="text-xs font-bold px-2 py-0.5 rounded-full
						{fmt.fit === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">
						{fmt.fit}
					</span>
					<div>
						<span class="text-sm font-medium text-gray-800">{fmt.format}</span>
						<span class="text-xs text-gray-500 ml-1">/ {fmt.reason}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Key Insight -->
	{#if data.keyInsight}
		<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 print-break-avoid">
			<div class="flex items-start gap-2">
				<span class="text-lg">💡</span>
				<div>
					<div class="text-sm font-bold text-amber-900">Key Insight</div>
					<p class="text-xs text-amber-800 leading-relaxed mt-1">{data.keyInsight}</p>
				</div>
			</div>
		</div>
	{/if}
</section>
