<script>
	let { data } = $props();

	function alignmentColor(alignment) {
		const colors = {
			aligned: 'bg-green-50 text-green-700',
			'passion-gap': 'bg-amber-50 text-amber-700',
			'confidence-gap': 'bg-blue-50 text-blue-700',
			disengaged: 'bg-red-50 text-red-700'
		};
		return colors[alignment] || 'bg-gray-50 text-gray-700';
	}
</script>

{#if data}
	<section id="section-subject-fit" class="report-section print-break-before">
		<h2 class="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
			<span class="text-blue-600">13</span> Subject Interests & Confidence
		</h2>
		<p class="text-sm text-gray-500 mb-4">How you feel about the three core subjects — passion, confidence, and where the gaps are</p>

		<p class="text-sm text-gray-700 mb-6 bg-white rounded-xl shadow-sm p-4">{data.summary}</p>

		<div class="space-y-4">
			{#each data.subjects as subject}
				<div class="bg-white rounded-xl shadow-sm p-6 print-break-avoid">
					<div class="flex items-center gap-3 mb-3">
						<span class="text-2xl">{subject.icon}</span>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-bold text-gray-900">{subject.name}</h3>
								<span class="text-xs font-semibold px-2.5 py-1 rounded-full {alignmentColor(subject.alignment)}">
									{subject.alignmentLabel}
								</span>
							</div>
							<div class="flex gap-3 mt-1 text-xs text-gray-500">
								<span>Passion: <strong class="text-gray-700">{subject.passion}/5</strong></span>
								<span>Confidence: <strong class="text-gray-700">{subject.confidence}/5</strong></span>
							</div>
						</div>
					</div>

					<p class="text-sm text-gray-600 leading-relaxed">{subject.narrative}</p>
				</div>
			{/each}
		</div>
	</section>
{/if}
