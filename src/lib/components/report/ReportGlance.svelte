<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-glance">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Personality at a Glance</h2>
	<p class="text-sm text-gray-500 mb-6">Your scores across the six HEXACO dimensions.</p>

	<div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
		{#each data.rows as row}
			<div class="flex items-start gap-3 print-break-avoid">
				<span class="text-lg w-7 text-center shrink-0 mt-0.5">{row.icon}</span>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-0.5">
						<span class="font-semibold text-gray-900 text-sm">{row.name}</span>
						<span class="text-xs font-bold px-2 py-0.5 rounded-full"
							style="background: {row.color}15; color: {row.color}">
							{row.score}/5 / {row.level}
						</span>
					</div>
					<p class="text-sm text-gray-600 leading-relaxed">{row.oneLiner}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="bg-blue-50 rounded-xl p-4 mt-4 print-break-avoid">
		<p class="text-xs text-blue-800 leading-relaxed">
			<strong>How to read these scores:</strong> Scores reflect tendencies, not abilities. A low score in Extraversion does not mean you lack social skills. It means you prefer quieter settings. There are no "good" or "bad" scores. Each level brings unique strengths and growth opportunities.
		</p>
	</div>
</section>
