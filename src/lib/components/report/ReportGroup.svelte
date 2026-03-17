<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-group">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Working With Others</h2>
	<p class="text-sm text-gray-500 mb-6">Your group role, communication style, conflict approach, and ideal partners.</p>

	<!-- Group Role -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<div class="flex items-start gap-3">
			<span class="text-3xl">{data.groupRole.icon}</span>
			<div>
				<h3 class="text-lg font-bold text-gray-900">{data.groupRole.role}</h3>
				<p class="text-sm text-gray-700 leading-relaxed mt-1">{data.groupRole.description}</p>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3 mt-4">
			<div>
				<div class="text-xs font-semibold text-green-700 mb-1">Strengths in Groups</div>
				<ul class="space-y-1">
					{#each data.groupRole.strengths as s}
						<li class="text-xs text-gray-600 flex items-start gap-1.5">
							<span class="text-green-400 mt-0.5">+</span>{s}
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="text-xs font-semibold text-amber-700 mb-1">Watch Out For</div>
				<p class="text-xs text-gray-600">{data.groupRole.watchOut}</p>
			</div>
		</div>
	</div>

	<!-- Communication Style -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-2">Communication Style: {data.communicationStyle.style}</h3>
		<p class="text-sm text-gray-700 leading-relaxed mb-2">{data.communicationStyle.description}</p>
		<p class="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">{data.communicationStyle.tip}</p>
	</div>

	<!-- Conflict Handling -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-2">How You Handle Conflict</h3>
		<div class="bg-gray-50 rounded-lg p-3 mb-3">
			<div class="text-sm font-medium text-gray-800">{data.conflictHandling.profile.label}</div>
			<p class="text-xs text-gray-600 mt-1">{data.conflictHandling.profile.description}</p>
		</div>
		<div class="text-xs font-semibold text-gray-700 mb-2">Strategies for You</div>
		<ul class="space-y-1.5">
			{#each data.conflictHandling.strategies as strategy}
				<li class="text-xs text-gray-600 flex items-start gap-1.5">
					<span class="text-blue-400 mt-0.5">-</span>{strategy}
				</li>
			{/each}
		</ul>
	</div>

	<!-- Best Partners -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Your Ideal Study Partners</h3>
		<div class="space-y-3">
			{#each data.bestPartners as partner}
				<div class="bg-gray-50 rounded-lg p-3">
					<div class="text-sm font-bold text-gray-800">{partner.type}</div>
					<p class="text-xs text-gray-600 mt-0.5">{partner.description}</p>
					<p class="text-xs text-blue-700 mt-1 italic">{partner.why}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Team Tips -->
	<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Team Success Tips</h3>
		<ul class="space-y-2">
			{#each data.teamTips as tip}
				<li class="text-sm text-gray-700 flex items-start gap-2">
					<span class="text-blue-500 mt-0.5 shrink-0">-</span>{tip}
				</li>
			{/each}
		</ul>
	</div>
</section>
