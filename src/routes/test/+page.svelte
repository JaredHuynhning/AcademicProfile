<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { fetchItems, submitAnswers } from '$lib/api/client.js';
	import { testItems, answers, currentIndex, testResults, studentName, isComplete } from '$lib/stores/test.js';
	import { saveReport } from '$lib/stores/reports.js';
	import { studyItems } from '$lib/data/study-items.js';
	import { scoreStudyProfile } from '$lib/scoring/study-scorer.js';

	let loading = $state(true);
	let submitting = $state(false);
	let error = $state('');
	let items = $state([]);
	let idx = $state(0);
	let ans = $state({});
	let feedbackId = $state(null);

	const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

	/**
	 * Fisher-Yates shuffle — deterministic in-place.
	 */
	function shuffle(arr) {
		const a = [...arr];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	onMount(async () => {
		try {
			const data = await fetchItems();
			// Merge HEXACO items (from backend) + study items (frontend), then shuffle
			const hexacoItems = data.items;
			const allItems = shuffle([...hexacoItems, ...studyItems.map((i) => ({ id: i.id, text: i.text }))]);
			items = allItems;
			testItems.set(allItems);
		} catch (e) {
			error = 'Failed to load questions. Is the backend running?';
		}
		loading = false;

		// Restore position
		const unsub1 = currentIndex.subscribe((v) => (idx = v));
		const unsub2 = answers.subscribe((v) => (ans = { ...v }));

		// Keyboard shortcuts
		function handleKey(e) {
			if (e.key >= '1' && e.key <= '5') {
				selectAnswer(parseInt(e.key));
			} else if (e.key === 'ArrowLeft' && idx > 0) {
				goTo(idx - 1);
			} else if (e.key === 'ArrowRight' && idx < items.length - 1) {
				goTo(idx + 1);
			}
		}
		window.addEventListener('keydown', handleKey);

		return () => {
			unsub1();
			unsub2();
			window.removeEventListener('keydown', handleKey);
		};
	});

	function goTo(i) {
		idx = i;
		currentIndex.set(i);
	}

	function selectAnswer(value) {
		if (!items[idx]) return;
		const id = items[idx].id;
		ans[id] = value;
		answers.set({ ...ans });

		feedbackId = id;

		// Auto-advance after brief delay
		if (idx < items.length - 1) {
			setTimeout(() => {
				goTo(idx + 1);
				feedbackId = null;
			}, 300);
		} else {
			feedbackId = null;
		}
	}

	async function submit() {
		submitting = true;
		error = '';
		try {
			// Split answers: IDs 1-60 → backend, IDs 61-90 → frontend scorer
			const hexacoAnswers = {};
			const studyAnswers = {};
			for (const [k, v] of Object.entries(ans)) {
				const id = parseInt(k);
				if (id <= 60) {
					hexacoAnswers[String(id)] = v;
				} else {
					studyAnswers[id] = v;
				}
			}

			// Score HEXACO via backend (unchanged)
			const results = await submitAnswers(hexacoAnswers);

			// Score study items on frontend
			const studyProfile = scoreStudyProfile(studyAnswers);

			// Merge: attach studyProfile to results
			results.studyProfile = studyProfile;

			testResults.set(results);
			const currentName = get(studentName);
			saveReport(currentName, results);
			goto('/results');
		} catch (e) {
			error = e.message || 'Failed to submit. Please try again.';
			submitting = false;
		}
	}

	let currentItem = $derived(items[idx]);
	let currentAnswer = $derived(currentItem ? ans[currentItem.id] : undefined);
	let allAnswered = $derived(items.length > 0 && items.every((item) => ans[item.id] !== undefined));
	let isLastQuestion = $derived(idx === items.length - 1);
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
	{#if loading}
		<div class="text-center py-20">
			<div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			<p class="mt-4 text-gray-500">Loading questions...</p>
		</div>
	{:else if error && items.length === 0}
		<div class="text-center py-20">
			<div class="text-4xl mb-4">⚠️</div>
			<p class="text-red-600 font-medium">{error}</p>
			<button onclick={() => location.reload()} class="mt-4 px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
				Retry
			</button>
		</div>
	{:else if currentItem}
		<!-- Question card -->
		<div class="bg-white rounded-2xl shadow-sm p-8 mb-6">
			<div class="text-sm text-gray-400 mb-1 font-medium">
				Question {idx + 1} of {items.length}
			</div>

			<p class="text-xl font-semibold text-gray-900 mb-8 leading-relaxed min-h-[3.5rem]">
				{currentItem.text}
			</p>

			<div class="space-y-3">
				{#each [1, 2, 3, 4, 5] as value}
					{@const isSelected = currentAnswer === value}
					{@const justSelected = feedbackId === currentItem.id && isSelected}
					<button
						onclick={() => selectAnswer(value)}
						class="w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left
							{isSelected
								? justSelected
									? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md'
									: 'border-blue-500 bg-blue-50'
								: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}"
					>
						<span class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
							{isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}">
							{value}
						</span>
						<span class="font-medium {isSelected ? 'text-blue-700' : 'text-gray-700'}">
							{labels[value - 1]}
						</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex items-center justify-between">
			<button
				onclick={() => goTo(idx - 1)}
				disabled={idx === 0}
				class="px-5 py-2.5 rounded-xl font-medium transition
					{idx === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'}"
			>
				← Back
			</button>

			{#if isLastQuestion && allAnswered}
				<button
					onclick={submit}
					disabled={submitting}
					class="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl
						hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25 transition-all
						disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
				>
					{submitting ? 'Calculating...' : 'See My Results'}
				</button>
			{:else if !isLastQuestion}
				<button
					onclick={() => goTo(idx + 1)}
					class="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-white hover:shadow-sm transition"
				>
					Skip →
				</button>
			{:else}
				<span class="text-sm text-gray-400">Answer all questions to continue</span>
			{/if}
		</div>

		{#if error}
			<p class="mt-4 text-center text-red-600 text-sm">{error}</p>
		{/if}

		<!-- Question dots (mini-map) -->
		<div class="mt-8 flex flex-wrap gap-1.5 justify-center">
			{#each items as item, i}
				{@const answered = ans[item.id] !== undefined}
				<button
					onclick={() => goTo(i)}
					class="w-3 h-3 rounded-full transition-all
						{i === idx
							? 'bg-blue-500 ring-2 ring-blue-300 scale-125'
							: answered
								? 'bg-blue-300'
								: 'bg-gray-200 hover:bg-gray-300'}"
					title="Question {i + 1}{answered ? ' (answered)' : ''}"
				></button>
			{/each}
		</div>

		<p class="text-center text-xs text-gray-400 mt-4">
			Press 1-5 to answer, arrow keys to navigate
		</p>
	{/if}
</div>
