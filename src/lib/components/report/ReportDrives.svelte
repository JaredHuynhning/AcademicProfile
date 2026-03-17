<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-drives">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">What Drives You</h2>
	<p class="text-sm text-gray-500 mb-6">Your motivators, demotivators, and what engagement looks like for you.</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
		<!-- Motivators -->
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-green-800 mb-3 flex items-center gap-2">
				<span class="text-green-500">✦</span> What Motivates You
			</h3>
			<div class="space-y-2">
				{#each data.motivators as m}
					<div class="flex items-start gap-2">
						<span class="shrink-0">{m.icon}</span>
						<span class="text-sm text-gray-700">{m.text}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Demotivators -->
		<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
			<h3 class="font-bold text-red-800 mb-3 flex items-center gap-2">
				<span class="text-red-400">✦</span> What Demotivates You
			</h3>
			<div class="space-y-2">
				{#each data.demotivators as d}
					<div class="flex items-start gap-2">
						<span class="shrink-0">{d.icon}</span>
						<span class="text-sm text-gray-700">{d.text}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Flow State -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
			<span class="text-blue-500">🌊</span> When You Are "In the Zone"
		</h3>
		<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.flowState.description}</p>
		<div class="bg-blue-50 rounded-lg p-3">
			<div class="text-xs font-semibold text-blue-700 mb-2">Flow Triggers</div>
			<ul class="space-y-1">
				{#each data.flowState.triggers as trigger}
					<li class="text-xs text-blue-800 flex items-start gap-1.5">
						<span class="text-blue-400 mt-0.5">+</span>
						{trigger}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Disengagement -->
	<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
			<span class="text-amber-500">⚠️</span> Signs of Disengagement
		</h3>
		<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.disengagement.description}</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<div class="bg-red-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-red-700 mb-2">Warning Signs</div>
				<ul class="space-y-1">
					{#each data.disengagement.signs as sign}
						<li class="text-xs text-red-800 flex items-start gap-1.5">
							<span class="text-red-400 mt-0.5">!</span>
							{sign}
						</li>
					{/each}
				</ul>
			</div>
			<div class="bg-green-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-green-700 mb-2">What Helps</div>
				<ul class="space-y-1">
					{#each data.disengagement.interventions as intervention}
						<li class="text-xs text-green-800 flex items-start gap-1.5">
							<span class="text-green-400 mt-0.5">+</span>
							{intervention}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
