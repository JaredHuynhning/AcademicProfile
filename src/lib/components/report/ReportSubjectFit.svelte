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
		<p class="text-sm text-gray-500 mb-4">How you feel about the three core subjects: passion, confidence, and where the gaps are</p>

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
							<div class="space-y-2 mt-2">
								<div>
									<div class="flex items-center gap-2">
										<span class="text-xs font-medium text-gray-700">Passion: {subject.passion}/5</span>
										<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded {subject.passionClassification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
											{subject.passionClassification === 'strength' ? 'Strength' : 'Needs Work'}
										</span>
									</div>
									<p class="text-[10px] text-gray-500 mt-0.5 italic">{subject.passionTip}</p>
								</div>
								<div>
									<div class="flex items-center gap-2">
										<span class="text-xs font-medium text-gray-700">Confidence: {subject.confidence}/5</span>
										<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded {subject.confidenceClassification === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
											{subject.confidenceClassification === 'strength' ? 'Strength' : 'Needs Work'}
										</span>
									</div>
									<p class="text-[10px] text-gray-500 mt-0.5 italic">{subject.confidenceTip}</p>
								</div>
							</div>
						</div>
					</div>

					<p class="text-sm text-gray-600 leading-relaxed">{subject.narrative}</p>
				</div>
			{/each}
		</div>
	</section>
{/if}
