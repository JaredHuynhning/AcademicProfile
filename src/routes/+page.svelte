<script>
	import { goto } from '$app/navigation';
	import { studentName, testResults, quizMode } from '$lib/stores/test.js';
	import { savedReportsStore } from '$lib/stores/reports.js';

	let name = $state($studentName);

	let nameValid = $derived(name.trim().length > 0);

	function startQuiz(mode) {
		if (!nameValid) return;
		$studentName = name.trim();
		$quizMode = mode;
		goto(`/test?quiz=${mode}`);
	}

	let hasResults = $derived($testResults !== null);
	let hasReports = $derived($savedReportsStore.length > 0);
</script>

<div class="max-w-2xl mx-auto px-4 py-12">
	<div class="text-center mb-10">
		<div class="text-6xl mb-4">🧠</div>
		<h1 class="text-4xl font-extrabold text-gray-900 mb-3">
			Discover Your Learning Personality
		</h1>
		<p class="text-lg text-gray-600 max-w-lg mx-auto">
			Understand how you learn, what drives you, and find the perfect tutor match for your style.
		</p>
	</div>

	<!-- Name Input -->
	<div class="bg-white rounded-2xl p-6 shadow-sm mb-8">
		<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
			Your name <span class="text-red-500">*</span>
		</label>
		<input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Enter your name"
			required
			class="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
				{!nameValid && name.length > 0 ? 'border-red-300' : 'border-gray-300'}"
			onkeydown={(e) => e.key === 'Enter' && startQuiz('complete')}
		/>
	</div>

	<!-- Quiz Options -->
	<div class="grid gap-4 mb-8">
		<!-- Learning Assessment -->
		<button
			onclick={() => startQuiz('learning')}
			disabled={!nameValid}
			class="w-full text-left bg-white rounded-xl p-5 shadow-sm border-2 border-transparent
				hover:border-emerald-300 hover:shadow-md transition-all
				disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:shadow-sm"
		>
			<div class="flex items-start gap-4">
				<div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0">📚</div>
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="font-bold text-gray-900">Learning Assessment</h3>
						<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">~10 min</span>
					</div>
					<p class="text-sm text-gray-500">60 questions covering study approaches, motivation, grit, focus, energy, subject interests, teacher preferences, and exam strategies.</p>
				</div>
			</div>
		</button>

		<!-- Personality Profile -->
		<button
			onclick={() => startQuiz('personality')}
			disabled={!nameValid}
			class="w-full text-left bg-white rounded-xl p-5 shadow-sm border-2 border-transparent
				hover:border-violet-300 hover:shadow-md transition-all
				disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:shadow-sm"
		>
			<div class="flex items-start gap-4">
				<div class="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl shrink-0">🔬</div>
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="font-bold text-gray-900">Personality Profile</h3>
						<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">~10 min</span>
					</div>
					<p class="text-sm text-gray-500">60 HEXACO personality questions revealing your six core dimensions, tutor matching, and personalised learning insights.</p>
				</div>
			</div>
		</button>

		<!-- Complete Assessment -->
		<button
			onclick={() => startQuiz('complete')}
			disabled={!nameValid}
			class="w-full text-left bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-5 shadow-sm border-2 border-transparent
				hover:border-blue-300 hover:shadow-md transition-all
				disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:shadow-sm"
		>
			<div class="flex items-start gap-4">
				<div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl shrink-0">🎯</div>
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="font-bold text-gray-900">Complete Assessment</h3>
						<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">~20 min</span>
						<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Recommended</span>
					</div>
					<p class="text-sm text-gray-500">All 120 questions — personality + learning combined. Get the full picture with cross-system insights.</p>
				</div>
			</div>
		</button>
	</div>

	<!-- Secondary Actions -->
	<div class="space-y-3">
		{#if hasResults}
			<button
				onclick={() => goto('/results')}
				class="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
			>
				View Previous Results
			</button>
		{/if}

		{#if hasReports}
			<button
				onclick={() => goto('/reports')}
				class="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
			>
				View All Saved Profiles →
			</button>
		{/if}
	</div>

	<p class="text-center text-xs text-gray-400 mt-6">
		Based on HEXACO-PI-R (Lee & Ashton), Grit-S (Duckworth), SVS (Ryan & Frederick),
		ASSIST (Entwistle), AMS (Vallerand), MSLQ (Pintrich), TIMSS (IEA).
		Your answers are stored locally on your device only.
	</p>
</div>
