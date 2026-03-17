<script>
	let { data } = $props();
</script>

{#if data}
	<section id="section-study-profile" class="report-section print-break-before">
		<h2 class="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
			<span class="text-violet-600">11</span> Study & Motivation Profile
		</h2>
		<p class="text-sm text-gray-500 mb-6">Based on validated study approach, academic motivation, and self-regulation assessments</p>

		<!-- A. Dominant Study Approach -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="text-xl">{data.approach.icon}</span> Your Study Approach: {data.approach.label}
			</h3>
			<p class="text-gray-700 mb-4">{data.approach.desc}</p>

			<!-- Approach bar chart -->
			<div class="space-y-3 mb-5">
				{#each Object.entries(data.approaches) as [key, a]}
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span class="font-medium text-gray-700">{a.label}</span>
							<span class="text-gray-500">{a.score}/5 ({a.level})</span>
						</div>
						<div class="h-3 bg-gray-100 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full transition-all"
								style="width: {(a.score / 5) * 100}%; background-color: {a.color}"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h4 class="text-sm font-semibold text-green-700 mb-2">Strengths</h4>
					<ul class="space-y-1">
						{#each data.approach.strengths as s}
							<li class="text-sm text-gray-700 flex items-start gap-1.5">
								<span class="text-green-500 mt-0.5">+</span>{s}
							</li>
						{/each}
					</ul>
				</div>
				<div>
					<h4 class="text-sm font-semibold text-blue-700 mb-2">Tips</h4>
					<ul class="space-y-1">
						{#each data.approach.tips as t}
							<li class="text-sm text-gray-700 flex items-start gap-1.5">
								<span class="text-blue-500 mt-0.5">→</span>{t}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<!-- B. Motivation Profile -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="text-xl">{data.motivation.icon}</span> Motivation: {data.motivation.label}
			</h3>
			<p class="text-gray-700 mb-2">{data.motivation.desc}</p>
			<p class="text-sm text-gray-600 italic mb-4">{data.motivation.insight}</p>

			<!-- Motivation bars -->
			<div class="space-y-3 mb-4">
				{#each Object.entries(data.motivationScores) as [key, m]}
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span class="font-medium text-gray-700">{m.label}</span>
							<span class="text-gray-500">{m.score}/5 ({m.level})</span>
						</div>
						<div class="h-3 bg-gray-100 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full transition-all"
								style="width: {(m.score / 5) * 100}%; background-color: {m.color}"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<div class="bg-gray-50 rounded-lg px-4 py-3 text-sm">
				<span class="font-semibold text-gray-700">Self-Determination Index:</span>
				<span class="font-bold {data.sdi > 3 ? 'text-green-600' : data.sdi >= 0 ? 'text-amber-600' : 'text-red-600'}">
					{data.sdi}
				</span>
				<span class="text-gray-500 ml-1">(range: -12 to +15)</span>
			</div>
		</div>

		<!-- C. Self-Regulation -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-1">Self-Regulation Skills</h3>
			<p class="text-sm text-gray-500 mb-4">
				Overall strength: <span class="font-semibold capitalize">{data.regulationStrength}</span>
			</p>

			<div class="space-y-4">
				{#each data.regulation as r}
					<div class="flex items-center gap-3">
						<span class="text-xl w-8 text-center">{r.icon}</span>
						<div class="flex-1">
							<div class="flex justify-between text-sm mb-1">
								<span class="font-medium text-gray-700">{r.label}</span>
								<span class="text-gray-500">{r.score}/5</span>
							</div>
							<div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
								<div
									class="h-full rounded-full transition-all {r.level === 'high' ? 'bg-green-500' : r.level === 'moderate' ? 'bg-amber-400' : 'bg-red-400'}"
									style="width: {(r.score / 5) * 100}%"
								></div>
							</div>
							<p class="text-xs text-gray-400 mt-0.5">{r.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- D. Cross-System Insights (HEXACO × Study Profile) -->
		{#if data.crossInsights.length > 0}
			<div class="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6">
				<h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
					<span class="text-xl">🔗</span> Personality × Study Insights
				</h3>
				<p class="text-sm text-gray-600 mb-4">
					How your personality traits interact with your study habits and motivation:
				</p>
				<div class="space-y-4">
					{#each data.crossInsights as insight}
						<div class="bg-white/80 rounded-lg p-4">
							<h4 class="font-semibold text-gray-900 flex items-center gap-2">
								<span>{insight.icon}</span> {insight.title}
							</h4>
							<p class="text-sm text-gray-700 mt-1">{insight.text}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
