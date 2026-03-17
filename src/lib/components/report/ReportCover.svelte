<script>
	import RadarChart from '$lib/components/RadarChart.svelte';

	let { data = {} } = $props();
</script>

<section class="report-section" id="section-cover">
	<div class="text-center mb-8">
		<div class="text-5xl mb-3">🎓</div>
		<h1 class="text-3xl font-extrabold text-gray-900">{data.name}</h1>
		<p class="text-lg font-semibold text-gray-600 mt-1">HEXACO Learning Personality Profile</p>
		<p class="text-sm text-gray-400 mt-1">{data.date}</p>
	</div>

	<div class="bg-white rounded-2xl shadow-sm p-6 mb-6 print-break-avoid">
		<div class="flex justify-center radar-chart-container">
			<RadarChart data={data.radarData} size={300} />
		</div>
	</div>

	<div class="bg-white rounded-2xl shadow-sm p-6 mb-6 print-break-avoid">
		<h2 class="text-lg font-bold text-gray-900 mb-3">Profile Summary</h2>
		<p class="text-gray-700 leading-relaxed text-sm">{data.narrativeSummary}</p>
		<p class="text-gray-600 leading-relaxed text-sm mt-3">{data.summary}</p>
	</div>

	<div class="grid grid-cols-3 gap-3 print-break-avoid">
		{#each data.topTraits as trait}
			<div class="bg-white rounded-xl shadow-sm p-4 text-center">
				<div class="text-2xl font-bold" style="color: {trait.color}">{trait.score}</div>
				<div class="text-sm font-semibold text-gray-800 mt-1">{trait.name}</div>
				<div class="text-xs font-medium mt-0.5 px-2 py-0.5 rounded-full inline-block"
					style="background: {trait.color}15; color: {trait.color}">
					{trait.level}
				</div>
			</div>
		{/each}
	</div>
</section>
