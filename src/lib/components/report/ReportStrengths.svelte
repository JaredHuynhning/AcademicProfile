<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-strengths">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Strengths, Challenges & Growth</h2>
	<p class="text-sm text-gray-500 mb-6">Each dimension analysed: what you do well, where to grow, and what to do about it.</p>

	<!-- Per-Dimension Breakdown -->
	{#each data.dimensions as dim}
		{#if dim.strengths.length > 0 || dim.weaknesses.length > 0 || (dim.preferences && dim.preferences.length > 0)}
			<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
				<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
					<span>{dim.icon}</span>
					<span>{dim.name}</span>
					<span class="text-sm font-medium" style="color: {dim.color}">{dim.score}/5</span>
				</h3>

				<!-- Strengths -->
				{#if dim.strengths.length > 0}
					<div class="mb-3">
						<h4 class="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
							<span class="text-green-500">+</span> Strengths
						</h4>
						<div class="space-y-2">
							{#each dim.strengths as strength}
								<div class="border-l-3 border-green-400 pl-3">
									<div class="flex items-center gap-2 mb-0.5">
										<span class="text-sm font-semibold text-gray-900">{strength.name}</span>
										<span class="text-xs font-bold text-green-600">{strength.score}/5</span>
									</div>
									<p class="text-xs text-gray-600 leading-relaxed">{strength.analysis}</p>
									<p class="text-xs text-green-700 mt-1"><strong>Leverage:</strong> {strength.leverageTip}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Weaknesses -->
				{#if dim.weaknesses.length > 0}
					<div class="mb-3">
						<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
							<span class="text-amber-500">!</span> Growth Areas
						</h4>
						<div class="space-y-2">
							{#each dim.weaknesses as weakness}
								<div class="border-l-3 border-amber-400 pl-3">
									<div class="flex items-center gap-2 mb-0.5">
										<span class="text-sm font-semibold text-gray-900">{weakness.name}</span>
										<span class="text-xs font-bold text-amber-600">{weakness.score}/5</span>
									</div>
									<p class="text-xs text-gray-600 leading-relaxed">{weakness.challenge}</p>
									<p class="text-xs text-amber-700 mt-1"><strong>Action:</strong> {weakness.actionTip}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Preferences (Your Style) -->
				{#if dim.preferences && dim.preferences.length > 0}
					<div class="mb-3">
						<h4 class="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2 flex items-center gap-1">
							<span class="text-violet-500">~</span> Your Style
						</h4>
						<div class="space-y-2">
							{#each dim.preferences as pref}
								<div class="border-l-3 border-violet-300 pl-3">
									<div class="flex items-center gap-2 mb-0.5">
										<span class="text-sm font-semibold text-gray-900">{pref.name}</span>
										<span class="text-xs font-bold text-violet-600">{pref.score}/5</span>
									</div>
									<p class="text-xs text-gray-600 leading-relaxed">{pref.description}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- What To Do -->
				<div class="bg-blue-50 rounded-lg p-3">
					<p class="text-xs text-blue-800"><strong>What To Do:</strong> {dim.whatToDo}</p>
				</div>
			</div>
		{:else}
			<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
				<h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
					<span>{dim.icon}</span>
					<span>{dim.name}</span>
					<span class="text-sm font-medium" style="color: {dim.color}">{dim.score}/5</span>
				</h3>
				<p class="text-xs text-gray-500">Your scores in this area are balanced. Continue developing steadily across all facets.</p>
			</div>
		{/if}
	{/each}

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
