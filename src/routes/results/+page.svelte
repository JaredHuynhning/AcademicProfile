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
		goto('/');
	}

	function handlePrint() {
		window.print();
	}

	let hasPersonality = $derived(results?.dimensions != null);
	let hasStudy = $derived(results?.studyProfile != null);
	let hasLearner = $derived(results?.learnerProfile != null);

	let radarData = $derived(
		hasPersonality
			? dimOrder.map((d) => ({
					label: results.dimensions[d].name,
					value: results.dimensions[d].score,
					color: dimColors[d]
				}))
			: []
	);

	let topArchetypes = $derived(results?.archetypes ? results.archetypes.slice(0, 3) : []);

	let formattedDate = $derived(
		new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
	);
</script>

{#if results}
	<div class="max-w-3xl mx-auto px-4 py-8 space-y-10">
		<!-- Print header -->
		<div class="print-only text-center border-b-2 border-gray-300 pb-6 mb-4">
			<h1 class="text-2xl font-extrabold text-gray-900">{name || 'Student'}</h1>
			<p class="text-lg font-semibold text-gray-700 mt-1">Learning Personality Profile</p>
			<p class="text-sm text-gray-500 mt-1">Generated {formattedDate}</p>
		</div>

		<!-- Header -->
		<div class="text-center no-print">
			<div class="text-5xl mb-3">🎓</div>
			<h1 class="text-3xl font-extrabold text-gray-900">
				{name ? `${name}'s` : 'Your'} Learning Profile
			</h1>
			{#if hasPersonality}
				<p class="text-gray-500 mt-2">{results.narrative.summary}</p>
			{:else}
				<p class="text-gray-500 mt-2">Your learning assessment results are ready.</p>
			{/if}
		</div>

		<!-- A. Radar Chart (personality only) -->
		{#if hasPersonality}
			<section class="bg-white rounded-2xl shadow-sm p-8 print-break-avoid">
				<h2 class="text-xl font-bold text-gray-900 mb-6 text-center">Personality Overview</h2>
				<p class="text-gray-500 mt-2 text-center print-only">{results.narrative.summary}</p>
				<div class="flex justify-center radar-chart-container">
					<RadarChart data={radarData} size={320} />
				</div>
			</section>
		{/if}

		<!-- B. Dimension Breakdown (personality only) -->
		{#if hasPersonality}
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
		{/if}

		<!-- C. Learning Profile (personality) -->
		{#if hasPersonality}
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
		{/if}

		<!-- D. Study & Motivation Profile -->
		{#if hasStudy}
			{@const sp = results.studyProfile}
			<section class="bg-white rounded-2xl shadow-sm p-8 space-y-6 print-break-before">
				<h2 class="text-xl font-bold text-gray-900">Study & Motivation Profile</h2>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="bg-indigo-50 rounded-xl p-4">
						<h3 class="font-semibold text-indigo-900 text-sm mb-2">Dominant Study Approach</h3>
						<p class="text-2xl font-bold text-indigo-700 capitalize">{sp.dominantApproach}</p>
						<div class="mt-2 space-y-1 text-xs text-indigo-600">
							<div class="flex justify-between"><span>Deep</span><span>{sp.studyApproaches.deep.score}/5</span></div>
							<div class="flex justify-between"><span>Strategic</span><span>{sp.studyApproaches.strategic.score}/5</span></div>
							<div class="flex justify-between"><span>Surface</span><span>{sp.studyApproaches.surface.score}/5</span></div>
						</div>
					</div>

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

		<!-- E. Learner Profile Summary -->
		{#if hasLearner}
			{@const lp = results.learnerProfile}
			<section class="bg-white rounded-2xl shadow-sm p-8 space-y-6 print-break-before">
				<h2 class="text-xl font-bold text-gray-900">Learner Profile</h2>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="bg-rose-50 rounded-xl p-4">
						<h3 class="font-semibold text-rose-900 text-sm mb-2">Grit</h3>
						<p class="text-2xl font-bold text-rose-700 capitalize">{lp.grit.overall.level}</p>
						<div class="mt-2 space-y-1 text-xs text-rose-600">
							<div class="flex justify-between"><span>Perseverance</span><span>{lp.grit.perseverance.score}/5</span></div>
							<div class="flex justify-between"><span>Consistency</span><span>{lp.grit.consistency.score}/5</span></div>
						</div>
					</div>

					<div class="bg-sky-50 rounded-xl p-4">
						<h3 class="font-semibold text-sky-900 text-sm mb-2">Focus & Energy</h3>
						<p class="text-2xl font-bold text-sky-700 capitalize">{lp.energy.netEnergy.level}</p>
						<div class="mt-2 space-y-1 text-xs text-sky-600">
							<div class="flex justify-between"><span>Concentration</span><span>{lp.focus.concentration.score}/5</span></div>
							<div class="flex justify-between"><span>Anti-Procrastination</span><span>{lp.focus.procrastination.score}/5</span></div>
							<div class="flex justify-between"><span>Net Energy</span><span>{lp.energy.netEnergy.score}/5</span></div>
						</div>
					</div>

					<div class="bg-teal-50 rounded-xl p-4">
						<h3 class="font-semibold text-teal-900 text-sm mb-2">Teaching Style</h3>
						<p class="text-2xl font-bold text-teal-700 capitalize">{lp.teacherPreference.profile.replace(/-/g, ' ')}</p>
						<div class="mt-2 space-y-1 text-xs text-teal-600">
							<div class="flex justify-between"><span>Response Type</span><span class="capitalize">{lp.teacherPreference.responseType}</span></div>
							<div class="flex justify-between"><span>Exam Barrier</span><span class="capitalize">{lp.examBarriers.primaryBarrier.replace(/-/g, ' ')}</span></div>
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- F. Tutor Matches (personality only) -->
		{#if topArchetypes.length > 0}
			<section class="print-break-before">
				<h2 class="text-xl font-bold text-gray-900 mb-4">Your Top Tutor Matches</h2>
				<div class="space-y-4">
					{#each topArchetypes as archetype, i}
						<ArchetypeCard {archetype} rank={i + 1} />
					{/each}
				</div>
			</section>
		{/if}

		<!-- Prompt for missing quiz -->
		{#if !hasPersonality}
			<div class="bg-violet-50 rounded-2xl p-6 text-center no-print">
				<p class="text-sm text-gray-600 mb-3">Want deeper personality insights and tutor matching?</p>
				<button
					onclick={() => goto('/test?quiz=personality')}
					class="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition"
				>
					Take Personality Quiz
				</button>
			</div>
		{/if}
		{#if !hasLearner}
			<div class="bg-emerald-50 rounded-2xl p-6 text-center no-print">
				<p class="text-sm text-gray-600 mb-3">Want grit, focus, subject interest, and study strategy insights?</p>
				<button
					onclick={() => goto('/test?quiz=learning')}
					class="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
				>
					Take Learning Assessment
				</button>
			</div>
		{/if}

		<!-- Print footer -->
		<div class="print-only text-center border-t border-gray-300 pt-4 mt-8 text-xs text-gray-400">
			<p>Based on HEXACO-PI-R, Grit-S, SVS, ASSIST, AMS, MSLQ, TIMSS</p>
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
				New Assessment
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
