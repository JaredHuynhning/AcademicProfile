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
						</div>
					</div>

					<p class="text-sm text-gray-600 leading-relaxed">{subject.narrative}</p>

					{#if subject.strengths?.length > 0}
						<div class="mt-2">
							<h4 class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Strengths</h4>
							{#each subject.strengths as s}
								<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-0.5"><span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}</p>
							{/each}
						</div>
					{/if}
					{#if subject.weaknesses?.length > 0}
						<div class="mt-2">
							<h4 class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Weaknesses</h4>
							{#each subject.weaknesses as w}
								<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-0.5"><span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}</p>
							{/each}
						</div>
					{/if}
					{#if subject.actions?.length > 0}
						<div class="mt-2">
							<h4 class="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">What To Do</h4>
							{#each subject.actions as a}
								<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-0.5"><span class="text-blue-500 mt-0.5 shrink-0">→</span>{a}</p>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
{/if}
