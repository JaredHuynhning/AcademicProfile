<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { testResults, studentName } from '$lib/stores/test.js';
	import { savedReportsStore } from '$lib/stores/reports.js';
	import { generateReport } from '$lib/report/index.js';

	import ReportCover from '$lib/components/report/ReportCover.svelte';
	import ReportGlance from '$lib/components/report/ReportGlance.svelte';
	import ReportDeepDive from '$lib/components/report/ReportDeepDive.svelte';
	import ReportLearning from '$lib/components/report/ReportLearning.svelte';
	import ReportDrives from '$lib/components/report/ReportDrives.svelte';
	import ReportStudy from '$lib/components/report/ReportStudy.svelte';
	import ReportGroup from '$lib/components/report/ReportGroup.svelte';
	import ReportStrengths from '$lib/components/report/ReportStrengths.svelte';
	import ReportGuide from '$lib/components/report/ReportGuide.svelte';
	import ReportTutor from '$lib/components/report/ReportTutor.svelte';
	import ReportStudyProfile from '$lib/components/report/ReportStudyProfile.svelte';
	import ReportAcademicCharacter from '$lib/components/report/ReportAcademicCharacter.svelte';
	import ReportSubjectFit from '$lib/components/report/ReportSubjectFit.svelte';
	import ReportWhatWorks from '$lib/components/report/ReportWhatWorks.svelte';

	let results = $state(null);
	let name = $state('');
	let report = $state(null);
	let activeSection = $state('section-cover');

	// Build sections list dynamically based on available data
	let sections = $derived(() => {
		if (!report) return [];
		const s = [];
		if (report.cover) s.push({ id: 'section-cover', label: 'Cover', num: '1' });
		if (report.glance) s.push({ id: 'section-glance', label: 'At a Glance', num: '2' });
		if (report.deepDive) s.push({ id: 'section-deep-dive', label: 'Deep Dive', num: '3' });
		if (report.learning) s.push({ id: 'section-learning', label: 'Learning', num: '4' });
		if (report.drives) s.push({ id: 'section-drives', label: 'Drives', num: '5' });
		if (report.study) s.push({ id: 'section-study', label: 'Study', num: '6' });
		if (report.group) s.push({ id: 'section-group', label: 'Groups', num: '7' });
		if (report.strengths) s.push({ id: 'section-strengths', label: 'Strengths', num: '8' });
		if (report.guide) s.push({ id: 'section-guide', label: 'Guide', num: '9' });
		if (report.tutor) s.push({ id: 'section-tutor', label: 'Tutor Match', num: '10' });
		if (report.studyProfile) s.push({ id: 'section-study-profile', label: 'Study Profile', num: '11' });
		if (report.academicCharacter) s.push({ id: 'section-academic-character', label: 'Academic Character', num: '12' });
		if (report.subjectFit) s.push({ id: 'section-subject-fit', label: 'Subject Fit', num: '13' });
		if (report.whatWorks) s.push({ id: 'section-what-works', label: 'What Works', num: '14' });
		return s;
	});

	onMount(() => {
		const reportId = $page.url.searchParams.get('id');
		if (reportId) {
			const saved = $savedReportsStore.find((r) => r.id === reportId);
			if (saved) {
				results = saved.results;
				name = saved.name;
			}
		}

		if (!results) {
			const unsub1 = testResults.subscribe((v) => (results = v));
			const unsub2 = studentName.subscribe((v) => (name = v));

			if (!results) {
				goto('/');
				return;
			}

			return () => {
				unsub1();
				unsub2();
			};
		}
	});

	$effect(() => {
		if (results && name !== undefined) {
			report = generateReport(results, name);
		}
	});

	function scrollToSection(id) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			activeSection = id;
		}
	}

	function handlePrint() {
		window.print();
	}

	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				}
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);

		setTimeout(() => {
			const secs = sections();
			for (const sec of secs) {
				const el = document.getElementById(sec.id);
				if (el) observer.observe(el);
			}
		}, 500);

		return () => observer.disconnect();
	});

	let reportDate = $derived(
		new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
	);
</script>

{#if report}
	<!-- Sidebar Nav (screen only) -->
	<nav class="report-sidebar no-print">
		<div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Sections</div>
		{#each sections() as sec}
			<button
				onclick={() => scrollToSection(sec.id)}
				class="report-nav-item {activeSection === sec.id ? 'active' : ''}"
			>
				<span class="report-nav-num">{sec.num}</span>
				<span>{sec.label}</span>
			</button>
		{/each}
		<div class="mt-4 px-2 space-y-2">
			<button
				onclick={handlePrint}
				class="w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
			>
				Print / PDF
			</button>
			<button
				onclick={() => goto('/results')}
				class="w-full px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition"
			>
				Back to Results
			</button>
		</div>
	</nav>

	<!-- Main Report Content -->
	<div class="report-content">
		<div class="max-w-3xl mx-auto px-4 py-8 space-y-0">

			<!-- Personality Sections (1-10) -->
			{#if report.hasPersonality}
				<ReportCover data={report.cover} />
				<ReportGlance data={report.glance} />
				<ReportDeepDive data={report.deepDive} />
				<ReportLearning data={report.learning} />
				<ReportDrives data={report.drives} />
				<ReportStudy data={report.study} />
				<ReportGroup data={report.group} />
				<ReportStrengths data={report.strengths} />
				<ReportGuide data={report.guide} />
				<ReportTutor data={report.tutor} />
			{:else}
				<!-- Prompt for personality quiz -->
				<div class="bg-violet-50 rounded-2xl p-8 text-center mb-8">
					<div class="text-4xl mb-3">🔬</div>
					<h2 class="text-xl font-bold text-gray-900 mb-2">Personality Profile Available</h2>
					<p class="text-sm text-gray-600 mb-4">
						Take the Personality Profile quiz to unlock 10 additional sections covering your HEXACO personality dimensions, tutor matching, and personalised learning insights.
					</p>
					<button
						onclick={() => goto('/test?quiz=personality')}
						class="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition"
					>
						Take Personality Quiz
					</button>
				</div>
			{/if}

			<!-- Learning Sections (11-14) -->
			{#if report.studyProfile}
				<ReportStudyProfile data={report.studyProfile} />
			{/if}
			{#if report.academicCharacter}
				<ReportAcademicCharacter data={report.academicCharacter} />
			{/if}
			{#if report.subjectFit}
				<ReportSubjectFit data={report.subjectFit} />
			{/if}
			{#if report.whatWorks}
				<ReportWhatWorks data={report.whatWorks} />
			{/if}

			{#if !report.hasLearning}
				<!-- Prompt for learning quiz -->
				<div class="bg-emerald-50 rounded-2xl p-8 text-center mb-8">
					<div class="text-4xl mb-3">📚</div>
					<h2 class="text-xl font-bold text-gray-900 mb-2">Learning Assessment Available</h2>
					<p class="text-sm text-gray-600 mb-4">
						Take the Learning Assessment to unlock sections on your study approach, academic character, subject interests, and personalised strategies.
					</p>
					<button
						onclick={() => goto('/test?quiz=learning')}
						class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
					>
						Take Learning Assessment
					</button>
				</div>
			{/if}

			<!-- Print Footer -->
			<div class="print-only text-center border-t border-gray-300 pt-4 mt-8 text-xs text-gray-400">
				<p>Learning Personality Profile — {name || 'Student'}</p>
				<p class="mt-1">Based on HEXACO-PI-R, Grit-S, SVS, ASSIST, AMS, MSLQ, TIMSS</p>
				<p class="mt-1">Generated {reportDate}</p>
			</div>

			<!-- Screen Footer -->
			<div class="text-center py-8 no-print">
				<div class="flex flex-wrap gap-3 justify-center">
					<button
						onclick={handlePrint}
						class="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
					>
						Print / Save as PDF
					</button>
					<button
						onclick={() => goto('/results')}
						class="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						Back to Results
					</button>
					<button
						onclick={() => goto('/reports')}
						class="px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						Saved Profiles
					</button>
				</div>
			</div>
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
