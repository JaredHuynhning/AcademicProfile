<script>
	import { goto } from '$app/navigation';
	import { studentName, testResults } from '$lib/stores/test.js';
	import { savedReportsStore } from '$lib/stores/reports.js';

	let name = $state($studentName);

	let nameValid = $derived(name.trim().length > 0);

	function startQuiz() {
		if (!nameValid) return;
		$studentName = name.trim();
		goto('/test');
	}

	let hasResults = $derived($testResults !== null);
	let hasReports = $derived($savedReportsStore.length > 0);
</script>

<div class="max-w-2xl mx-auto px-4 py-12">
	<div class="text-center mb-12">
		<div class="text-6xl mb-4">🧠</div>
		<h1 class="text-4xl font-extrabold text-gray-900 mb-3">
			Discover Your Learning Personality
		</h1>
		<p class="text-lg text-gray-600 max-w-lg mx-auto">
			Take this short quiz to understand how you learn best and find the perfect tutor match for your style.
		</p>
	</div>

	<div class="grid gap-6 mb-10">
		<div class="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
			<div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
			<div>
				<h3 class="font-semibold text-gray-900">Answer 90 questions</h3>
				<p class="text-sm text-gray-500">Rate how much each statement sounds like you. Takes about 12-15 minutes.</p>
			</div>
		</div>
		<div class="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
			<div class="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold shrink-0">2</div>
			<div>
				<h3 class="font-semibold text-gray-900">Get your personality profile</h3>
				<p class="text-sm text-gray-500">See your scores across 6 personality dimensions with detailed insights.</p>
			</div>
		</div>
		<div class="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
			<div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">3</div>
			<div>
				<h3 class="font-semibold text-gray-900">Find your ideal tutor match</h3>
				<p class="text-sm text-gray-500">We match you with tutor teaching styles that complement your personality.</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-2xl p-8 shadow-sm">
		<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
			Your name <span class="text-red-500">*</span>
		</label>
		<input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Enter your name"
			required
			class="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-6
				{!nameValid && name.length > 0 ? 'border-red-300' : 'border-gray-300'}"
			onkeydown={(e) => e.key === 'Enter' && startQuiz()}
		/>

		<button
			onclick={startQuiz}
			disabled={!nameValid}
			class="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg rounded-xl
				hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]
				disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
		>
			Start Quiz
		</button>

		{#if hasResults}
			<button
				onclick={() => goto('/results')}
				class="w-full mt-3 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
			>
				View Previous Results
			</button>
		{/if}

		{#if hasReports}
			<button
				onclick={() => goto('/reports')}
				class="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
			>
				View All Saved Profiles →
			</button>
		{/if}
	</div>

	<p class="text-center text-xs text-gray-400 mt-6">
		Based on the HEXACO-PI-R personality assessment, ASSIST study approaches,
		AMS academic motivation, and MSLQ self-regulation scales.
		Your answers are stored locally on your device only.
	</p>
</div>
