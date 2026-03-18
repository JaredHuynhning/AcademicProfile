<script>
	let { data = {} } = $props();

	const brief = $derived(data.oneMinuteBrief || {});
	const forTeachers = $derived(data.forTeachers || {});
	const forParents = $derived(data.forParents || {});
	const tutorMatch = $derived(data.tutorMatch || {});
</script>

<section class="report-section print-break-before" id="section-unified-guide">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Guide for Teachers & Parents</h2>
	<p class="text-sm text-gray-500 mb-6">A personalised reference for everyone supporting this student — with specific strategies, warning signals, and conversation starters.</p>

	<!-- One-Minute Brief -->
	<div class="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 mb-5 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">One-Minute Brief</h3>
		<div class="space-y-2">
			<div class="flex items-start gap-2">
				<span class="text-xs font-bold text-indigo-600 uppercase tracking-wide w-24 flex-shrink-0 mt-0.5">Archetype</span>
				<span class="text-sm text-gray-800 font-medium">{brief.archetype}</span>
			</div>
			<div class="flex items-start gap-2">
				<span class="text-xs font-bold text-green-600 uppercase tracking-wide w-24 flex-shrink-0 mt-0.5">Strength</span>
				<span class="text-xs text-gray-700 leading-relaxed">{brief.topStrength}</span>
			</div>
			<div class="flex items-start gap-2">
				<span class="text-xs font-bold text-amber-600 uppercase tracking-wide w-24 flex-shrink-0 mt-0.5">Watch For</span>
				<span class="text-xs text-gray-700 leading-relaxed">{brief.topWarning}</span>
			</div>
		</div>
	</div>

	<!-- For Teachers -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
			<span class="text-lg">🏫</span> For Teachers
		</h3>

		{#if forTeachers.strategies?.length > 0}
			<div class="mb-4">
				<p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Classroom Strategies</p>
				<div class="space-y-2">
					{#each forTeachers.strategies as strategy}
						<div class="flex items-start gap-2">
							<span class="text-blue-400 flex-shrink-0 mt-0.5">•</span>
							<p class="text-xs text-gray-700 leading-relaxed">{strategy}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if forTeachers.feedbackApproach}
			<div class="bg-blue-50 rounded-xl p-4 mb-4">
				<p class="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Feedback Approach</p>
				<p class="text-xs text-gray-700 leading-relaxed">{forTeachers.feedbackApproach}</p>
			</div>
		{/if}

		{#if forTeachers.warningSignals?.length > 0}
			<div>
				<p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Warning Signals</p>
				<div class="space-y-2">
					{#each forTeachers.warningSignals as signal}
						<div class="bg-amber-50 rounded-lg p-3">
							<p class="text-xs font-semibold text-amber-800 mb-0.5">Watch for: {signal.watch}</p>
							<p class="text-xs text-gray-600 mb-0.5">It means: {signal.means}</p>
							<p class="text-xs text-amber-700 font-medium">Do: {signal.do}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- For Parents -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
			<span class="text-lg">🏠</span> For Parents
		</h3>

		<div class="space-y-3 mb-4">
			{#if forParents.homeEnvironment}
				<div class="bg-teal-50 rounded-xl p-3">
					<p class="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">Home Environment</p>
					<p class="text-xs text-gray-700 leading-relaxed">{forParents.homeEnvironment}</p>
				</div>
			{/if}
			{#if forParents.studySupport}
				<div class="bg-blue-50 rounded-xl p-3">
					<p class="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Study Support</p>
					<p class="text-xs text-gray-700 leading-relaxed">{forParents.studySupport}</p>
				</div>
			{/if}
			{#if forParents.emotionalSupport}
				<div class="bg-pink-50 rounded-xl p-3">
					<p class="text-xs font-bold text-pink-700 uppercase tracking-wide mb-1">Emotional Support</p>
					<p class="text-xs text-gray-700 leading-relaxed">{forParents.emotionalSupport}</p>
				</div>
			{/if}
		</div>

		{#if forParents.conversationStarters?.length > 0}
			<div class="mb-4">
				<p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Conversation Starters</p>
				<div class="space-y-2">
					{#each forParents.conversationStarters as question}
						<div class="bg-violet-50 rounded-lg px-4 py-2.5 border border-violet-100">
							<p class="text-xs text-violet-900 font-medium">{question}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if forParents.warningSignals?.length > 0}
			<div>
				<p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Warning Signals</p>
				<div class="space-y-2">
					{#each forParents.warningSignals as signal}
						<div class="bg-amber-50 rounded-lg p-3">
							<p class="text-xs font-semibold text-amber-800 mb-0.5">Watch for: {signal.watch}</p>
							<p class="text-xs text-gray-600 mb-0.5">It means: {signal.means}</p>
							<p class="text-xs text-amber-700 font-medium">{signal.do}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- Tutor Match -->
	<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
			<span class="text-lg">🎓</span> Tutor Matching Guide
		</h3>

		{#if tutorMatch.traits?.length > 0}
			<div class="mb-3">
				<p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ideal Tutor Traits</p>
				<div class="space-y-1.5">
					{#each tutorMatch.traits as trait}
						<div class="flex items-start gap-2">
							<span class="text-indigo-400 flex-shrink-0 mt-0.5">•</span>
							<p class="text-xs text-gray-700 leading-relaxed capitalize-first">{trait}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if tutorMatch.rationale}
			<div class="bg-indigo-50 rounded-xl p-4">
				<p class="text-xs text-indigo-800 leading-relaxed">{tutorMatch.rationale}</p>
			</div>
		{/if}
	</div>
</section>
