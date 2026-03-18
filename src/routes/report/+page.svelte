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
	import ReportRootCause from '$lib/components/report/ReportRootCause.svelte';
	import ReportAcademicGuide from '$lib/components/report/ReportAcademicGuide.svelte';
	import ReportExecutiveSummary from '$lib/components/report/ReportExecutiveSummary.svelte';
	import ReportWhoYouAre from '$lib/components/report/ReportWhoYouAre.svelte';
	import ReportHowYouLearn from '$lib/components/report/ReportHowYouLearn.svelte';
	import ReportWhatsWorking from '$lib/components/report/ReportWhatsWorking.svelte';
	import ReportBarriers from '$lib/components/report/ReportBarriers.svelte';
	import ReportActionPlan from '$lib/components/report/ReportActionPlan.svelte';
	import ReportUnifiedGuide from '$lib/components/report/ReportUnifiedGuide.svelte';

	let results = $state(null);
	let name = $state('');
	let report = $state(null);
	let activeSection = $state('section-cover');
	let activeTab = $state('personality');

	// Determine which tabs are available
	let availableTabs = $derived(() => {
		if (!report) return [];
		const tabs = [];
		if (report.hasPersonality) tabs.push({ id: 'personality', label: 'Personality Profile', icon: '🧠' });
		if (report.hasLearning) tabs.push({ id: 'academic', label: 'Academic Assessment', icon: '📚' });
		if (report.hasComplete) tabs.push({ id: 'complete', label: 'Complete Profile', icon: '🎯' });
		return tabs;
	});

	// Auto-select first available tab
	$effect(() => {
		const tabs = availableTabs();
		if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
			activeTab = tabs[0].id;
		}
	});

	// Build sections list filtered by active tab
	let sections = $derived(() => {
		if (!report) return [];
		const s = [];
		if (activeTab === 'personality') {
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
		} else if (activeTab === 'academic') {
			if (report.studyProfile) s.push({ id: 'section-study-profile', label: 'Study Profile', num: '11' });
			if (report.academicCharacter) s.push({ id: 'section-academic-character', label: 'Academic Character', num: '12' });
			if (report.subjectFit) s.push({ id: 'section-subject-fit', label: 'Subject Fit', num: '13' });
			if (report.whatWorks) s.push({ id: 'section-what-works', label: 'What Works', num: '14' });
			if (report.rootCause) s.push({ id: 'section-root-cause', label: 'Root Cause', num: '15' });
			if (report.academicGuide) s.push({ id: 'section-academic-guide', label: 'Guide', num: '16' });
		} else if (activeTab === 'complete') {
			if (report.executiveSummary) s.push({ id: 'section-executive-summary', label: 'Summary', num: 'C1' });
			if (report.whoYouAre) s.push({ id: 'section-who-you-are', label: 'Who You Are', num: 'C2' });
			if (report.howYouLearn) s.push({ id: 'section-how-you-learn', label: 'How You Learn', num: 'C3' });
			if (report.whatsWorking) s.push({ id: 'section-whats-working', label: "What's Working", num: 'C4' });
			if (report.barriers) s.push({ id: 'section-barriers', label: 'Barriers', num: 'C5' });
			if (report.actionPlan) s.push({ id: 'section-action-plan', label: 'Action Plan', num: 'C6' });
			if (report.unifiedGuide) s.push({ id: 'section-unified-guide', label: 'Guide', num: 'C7' });
		}
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

	function switchTab(tabId) {
		activeTab = tabId;
		window.scrollTo({ top: 0, behavior: 'smooth' });
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

	let printTitle = $derived(
		activeTab === 'complete' ? 'Complete Student Profile'
			: activeTab === 'personality' ? 'Personality Profile'
			: 'Academic Assessment'
	);

	let printBasis = $derived(
		activeTab === 'complete' ? 'Based on HEXACO-PI-R + Grit-S, SVS, ASSIST, AMS, MSLQ, TIMSS assessments'
			: activeTab === 'personality' ? 'Based on HEXACO-PI-R personality assessment'
			: 'Based on Grit-S, SVS, ASSIST, AMS, MSLQ, TIMSS'
	);
</script>

{#if report}
	<!-- Sidebar Nav (screen only) -->
	<nav class="report-sidebar no-print">
		<!-- Tab Switcher -->
		{#if availableTabs().length > 1}
			<div class="px-1 mb-4">
				<div class="flex rounded-lg bg-gray-100 p-0.5">
					{#each availableTabs() as tab}
						<button
							onclick={() => switchTab(tab.id)}
							class="flex-1 px-2 py-1.5 text-[10px] font-semibold rounded-md transition-all
								{activeTab === tab.id
									? 'bg-white text-gray-900 shadow-sm'
									: 'text-gray-500 hover:text-gray-700'}"
						>
							{tab.label}
						</button>
					{/each}
				</div>
			</div>
		{/if}

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

			<!-- Mobile Tab Switcher (hidden on desktop where sidebar has it) -->
			{#if availableTabs().length > 1}
				<div class="md:hidden mb-6 no-print">
					<div class="flex rounded-xl bg-gray-100 p-1">
						{#each availableTabs() as tab}
							<button
								onclick={() => switchTab(tab.id)}
								class="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5
									{activeTab === tab.id
										? 'bg-white text-gray-900 shadow-sm'
										: 'text-gray-500 hover:text-gray-700'}"
							>
								<span>{tab.icon}</span>
								<span>{tab.label}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Personality Sections (1-10) -->
			{#if activeTab === 'personality'}
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
					<div class="bg-violet-50 rounded-2xl p-8 text-center mb-8">
						<div class="text-4xl mb-3">🔬</div>
						<h2 class="text-xl font-bold text-gray-900 mb-2">Personality Profile Available</h2>
						<p class="text-sm text-gray-600 mb-4">
							Take the Personality Profile quiz to unlock 10 sections covering your HEXACO personality dimensions, tutor matching, and personalised learning insights.
						</p>
						<button
							onclick={() => goto('/test?quiz=personality')}
							class="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition"
						>
							Take Personality Quiz
						</button>
					</div>
				{/if}
			{/if}

			<!-- Academic Sections (11-15) -->
			{#if activeTab === 'academic'}
				{#if report.hasLearning}
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
					{#if report.rootCause}
						<ReportRootCause data={report.rootCause} />
					{/if}
					{#if report.academicGuide}
						<ReportAcademicGuide data={report.academicGuide} />
					{/if}
				{:else}
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
			{/if}

			<!-- Complete Profile Sections (C1-C7) -->
			{#if activeTab === 'complete'}
				{#if report.hasComplete}
					<ReportExecutiveSummary data={report.executiveSummary} />
					<ReportWhoYouAre data={report.whoYouAre} />
					<ReportHowYouLearn data={report.howYouLearn} />
					<ReportWhatsWorking data={report.whatsWorking} />
					<ReportBarriers data={report.barriers} />
					<ReportActionPlan data={report.actionPlan} />
					<ReportUnifiedGuide data={report.unifiedGuide} />
				{/if}
			{/if}

			<!-- Print Footer -->
			<div class="print-only text-center border-t border-gray-300 pt-4 mt-8 text-xs text-gray-400">
				<p>{printTitle}: {name || 'Student'}</p>
				<p class="mt-1">{printBasis}</p>
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
