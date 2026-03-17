<script>
	import ScoreTable from './ScoreTable.svelte';

	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-glance">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Personality at a Glance</h2>
	<p class="text-sm text-gray-500 mb-6">Your scores across the six HEXACO dimensions, from 0 (lowest) to 5 (highest).</p>

	<div class="bg-white rounded-2xl shadow-sm p-6">
		<ScoreTable rows={data.rows} />
	</div>

	<div class="bg-blue-50 rounded-xl p-4 mt-4 print-break-avoid">
		<p class="text-xs text-blue-800 leading-relaxed">
			<strong>How to read these scores:</strong> Scores reflect tendencies, not abilities. A low score in Extraversion does not mean you lack social skills — it means you prefer quieter settings. There are no "good" or "bad" scores. Each level brings unique strengths and growth opportunities.
		</p>
	</div>
</section>
