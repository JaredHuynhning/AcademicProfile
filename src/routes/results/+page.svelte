<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { testResults, studentName, resetTest } from '$lib/stores/test.js';
	import RadarChart from '$lib/components/RadarChart.svelte';
	import DimensionCard from '$lib/components/DimensionCard.svelte';
	import ArchetypeCard from '$lib/components/ArchetypeCard.svelte';

	let results = $state(null);
	let name = $state('');

	const dimOrder = ['H', 'E', 'X', 'A', 'C', 'O'];
	const dimColors = {
		H: 'var(--dim-H)',
		E: 'var(--dim-E)',
		X: 'var(--dim-X)',
		A: 'var(--dim-A)',
		C: 'var(--dim-C)',
		O: 'var(--dim-O)'
	};

	onMount(() => {
		const unsub1 = testResults.subscribe((v) => (results = v));
		const unsub2 = studentName.subscribe((v) => (name = v));

		if (!results) {
			goto('/');
		}

		return () => {
			unsub1();
			unsub2();
		};
	});

	function handleRetake() {
		resetTest();
		goto('/test');
	}

	function handlePrint() {
		window.print();
	}

	let radarData = $derived(
		results
			? dimOrder.map((d) => ({
					label: results.dimensions[d].name,
					value: results.dimensions[d].score,
					color: dimColors[d]
				}))
			: []
	);

	let topArchetypes = $derived(results ? results.archetypes.slice(0, 3) : []);

	let formattedDate = $derived(
		new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
	);
</script>

{#if results}
	<div class="max-w-3xl mx-auto px-4 py-8 space-y-10">
		<!-- Print header -->
		<div class="print-only text-center border-b-2 border-gray-300 pb-6 mb-4">
			<h1 class="text-2xl font-extrabold text-gray-900">{name || 'Student'}</h1>
			<p class="text-lg font-semibold text-gray-700 mt-1">HEXACO Learning Personality Profile</p>
			<p class="text-sm text-gray-500 mt-1">Generated {formattedDate}</p>
		</div>

		<!-- Header -->
		<div class="text-center no-print">
			<div class="text-5xl mb-3">🎓</div>
			<h1 class="text-3xl font-extrabold text-gray-900">
				{name ? `${name}'s` : 'Your'} Learning Profile
			</h1>
			<p class="text-gray-500 mt-2">{results.narrative.summary}</p>
		</div>

		<!-- A. Radar Chart -->
		<section class="bg-white rounded-2xl shadow-sm p-8 print-break-avoid">
			<h2 class="text-xl font-bold text-gray-900 mb-6 text-center">Personality Overview</h2>
			<p class="text-gray-500 mt-2 text-center print-only">{results.narrative.summary}</p>
			<div class="flex justify-center radar-chart-container">
				<RadarChart data={radarData} size={320} />
			</div>
		</section>

		<!-- B. Dimension Breakdown -->
		<section class="print-break-before">
			<h2 class="text-xl font-bold text-gray-900 mb-4">Dimension Breakdown</h2>
			<div class="space-y-3">
				{#each dimOrder as dim}
					<DimensionCard
						dimension={results.dimensions[dim]}
						dimKey={dim}
						insight={results.narrative.dimension_insights[dim]}
						color={dimColors[dim]}
					/>
				{/each}
			</div>
		</section>

		<!-- C. Learning Profile -->
		<section class="bg-white rounded-2xl shadow-sm p-8 space-y-6 print-break-before">
			<h2 class="text-xl font-bold text-gray-900">Your Learning Profile</h2>

			{#if results.narrative.strengths.length > 0}
				<div>
					<h3 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
						<span class="text-green-500">✦</span> Your Strengths
					</h3>
					<ul class="space-y-2">
						{#each results.narrative.strengths as strength}
							<li class="flex items-start gap-2 text-gray-700">
								<span class="text-green-500 mt-0.5">•</span>
								{strength}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if results.narrative.growth_areas.length > 0}
				<div>
					<h3 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
						<span class="text-blue-500">↗</span> Growth Areas
					</h3>
					<ul class="space-y-2">
						{#each results.narrative.growth_areas as area}
							<li class="flex items-start gap-2 text-gray-700">
								<span class="text-blue-500 mt-0.5">•</span>
								{area}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if results.narrative.study_recommendations.length > 0}
				<div>
					<h3 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
						<span class="text-violet-500">📚</span> Study Recommendations
					</h3>
					<ul class="space-y-2">
						{#each results.narrative.study_recommendations as tip}
							<li class="flex items-start gap-2 text-gray-700">
								<span class="text-violet-500 mt-0.5">•</span>
								{tip}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>

		<!-- D. Study & Motivation Profile (if available) -->
		{#if results.studyProfile}
			{@const sp = results.studyProfile}
			<section class="bg-white rounded-2xl shadow-sm p-8 space-y-6 print-break-before">
				<h2 class="text-xl font-bold text-gray-900">Study & Motivation Profile</h2>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Study Approach -->
					<div class="bg-indigo-50 rounded-xl p-4">
						<h3 class="font-semibold text-indigo-900 text-sm mb-2">Dominant Study Approach</h3>
						<p class="text-2xl font-bold text-indigo-700 capitalize">{sp.dominantApproach}</p>
						<div class="mt-2 space-y-1 text-xs text-indigo-600">
							<div class="flex justify-between"><span>Deep</span><span>{sp.studyApproaches.deep.score}/5</span></div>
							<div class="flex justify-between"><span>Strategic</span><span>{sp.studyApproaches.strategic.score}/5</span></div>
							<div class="flex justify-between"><span>Surface</span><span>{sp.studyApproaches.surface.score}/5</span></div>
						</div>
					</div>

					<!-- Motivation -->
					<div class="bg-amber-50 rounded-xl p-4">
						<h3 class="font-semibold text-amber-900 text-sm mb-2">Motivation Profile</h3>
						<p class="text-2xl font-bold text-amber-700 capitalize">{sp.motivationProfile.replace('-', ' ')}</p>
						<div class="mt-2 space-y-1 text-xs text-amber-600">
							<div class="flex justify-between"><span>Intrinsic</span><span>{sp.motivation.intrinsic.score}/5</span></div>
							<div class="flex justify-between"><span>Identified</span><span>{sp.motivation.identified.score}/5</span></div>
							<div class="flex justify-between"><span>External</span><span>{sp.motivation.external.score}/5</span></div>
							<div class="flex justify-between"><span>SDI</span><span>{sp.motivation.sdi}</span></div>
						</div>
					</div>

					<!-- Self-Regulation -->
					<div class="bg-emerald-50 rounded-xl p-4">
						<h3 class="font-semibold text-emerald-900 text-sm mb-2">Self-Regulation</h3>
						<p class="text-2xl font-bold text-emerald-700 capitalize">{sp.regulationStrength}</p>
						<div class="mt-2 space-y-1 text-xs text-emerald-600">
							<div class="flex justify-between"><span>Self-Efficacy</span><span>{sp.selfRegulation.selfEfficacy.score}/5</span></div>
							<div class="flex justify-between"><span>Planning</span><span>{sp.selfRegulation.planning.score}/5</span></div>
							<div class="flex justify-between"><span>Effort</span><span>{sp.selfRegulation.effortRegulation.score}/5</span></div>
							<div class="flex justify-between"><span>Help-Seeking</span><span>{sp.selfRegulation.helpSeeking.score}/5</span></div>
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- E. Tutor Matches -->
		<section class="print-break-before">
			<h2 class="text-xl font-bold text-gray-900 mb-4">Your Top Tutor Matches</h2>
			<div class="space-y-4">
				{#each topArchetypes as archetype, i}
					<ArchetypeCard {archetype} rank={i + 1} />
				{/each}
			</div>
		</section>

		<!-- Print footer -->
		<div class="print-only text-center border-t border-gray-300 pt-4 mt-8 text-xs text-gray-400">
			<p>Based on the HEXACO-PI-R by Lee & Ashton (2018)</p>
			<p class="mt-1">Generated {formattedDate}</p>
		</div>

		<!-- Actions -->
		<div class="flex flex-wrap gap-3 justify-center no-print">
			<button
				onclick={() => goto('/report')}
				class="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium
					hover:from-blue-700 hover:to-violet-700 transition-all shadow-sm"
			>
				View Full Report
			</button>
			<button
				onclick={handlePrint}
				class="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
			>
				Print / Save PDF
			</button>
			<button
				onclick={handleRetake}
				class="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
			>
				Retake Quiz
			</button>
			<button
				onclick={() => goto('/')}
				class="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
			>
				Home
			</button>
		</div>
	</div>
{:else}
	<div class="text-center py-20">
		<p class="text-gray-500">No results found. Take the quiz first!</p>
		<button onclick={() => goto('/')} class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
			Go to Quiz
		</button>
	</div>
{/if}
