<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-tutor">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Tutor Match Guide</h2>
	<p class="text-sm text-gray-500 mb-6">Your top tutor archetypes expanded with what to look for and red flags.</p>

	<!-- Archetypes -->
	<div class="space-y-4 mb-6">
		{#each data.archetypes as arch}
			<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
				<div class="flex items-start gap-3 mb-3">
					<span class="text-3xl">{arch.icon}</span>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="text-xs font-bold text-gray-400">#{arch.rank}</span>
							<h3 class="text-lg font-bold text-gray-900">{arch.name}</h3>
							<span class="text-sm font-bold text-blue-600">{arch.matchPercent}% match</span>
						</div>
						<p class="text-sm text-gray-600 mt-0.5">{arch.description}</p>
					</div>
				</div>

				<!-- Teaching Style -->
				<div class="bg-gray-50 rounded-lg p-3 mb-3">
					<div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Teaching Style</div>
					<div class="text-sm text-gray-800">{arch.teaching_style}</div>
					{#if arch.key_insight}
						<p class="text-xs text-gray-600 mt-1 italic">{arch.key_insight}</p>
					{/if}
				</div>

				<!-- Expanded Info -->
				<div class="grid grid-cols-2 gap-3 mb-3">
					<div class="bg-green-50 rounded-lg p-3">
						<div class="text-xs font-semibold text-green-700 mb-1">Ideal For</div>
						<p class="text-xs text-green-800">{arch.expanded.idealFor}</p>
					</div>
					<div class="bg-blue-50 rounded-lg p-3">
						<div class="text-xs font-semibold text-blue-700 mb-1">Best When</div>
						<p class="text-xs text-blue-800">{arch.expanded.bestWhen}</p>
					</div>
				</div>

				<p class="text-xs text-gray-600 leading-relaxed mb-3">{arch.expanded.approach}</p>

				{#if arch.expanded.notIdeal}
					<p class="text-xs text-amber-700 bg-amber-50 rounded p-2 mb-3">
						<strong>Not ideal:</strong> {arch.expanded.notIdeal}
					</p>
				{/if}

				<!-- What to Look For -->
				<div class="mb-3">
					<div class="text-xs font-semibold text-gray-700 mb-1">What to Look For</div>
					<ul class="space-y-1">
						{#each arch.lookFor as item}
							<li class="text-xs text-gray-600 flex items-start gap-1.5">
								<span class="text-green-400 mt-0.5">+</span>{item}
							</li>
						{/each}
					</ul>
				</div>

				<!-- Red Flags -->
				<div>
					<div class="text-xs font-semibold text-red-700 mb-1">Red Flags</div>
					<ul class="space-y-1">
						{#each arch.redFlags as flag}
							<li class="text-xs text-gray-600 flex items-start gap-1.5">
								<span class="text-red-400 mt-0.5">!</span>{flag}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}
	</div>

	<!-- Evaluation Tips -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">How to Evaluate a Tutor</h3>
		<div class="grid grid-cols-2 gap-3">
			{#each data.evaluationTips as tip}
				<div class="bg-gray-50 rounded-lg p-3">
					<div class="text-sm font-bold text-gray-800">{tip.tip}</div>
					<p class="text-xs text-gray-600 mt-0.5">{tip.details}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- General Advice -->
	<div class="bg-violet-50 rounded-xl p-4 print-break-avoid">
		<h3 class="font-bold text-violet-900 mb-2 text-sm">General Advice</h3>
		<ul class="space-y-1.5">
			{#each data.generalAdvice as advice}
				<li class="text-xs text-violet-800 flex items-start gap-1.5">
					<span class="text-violet-400 mt-0.5">-</span>{advice}
				</li>
			{/each}
		</ul>
	</div>
</section>
