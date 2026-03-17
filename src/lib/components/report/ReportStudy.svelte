<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-study">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Study Strategies & Exam Prep</h2>
	<p class="text-sm text-gray-500 mb-6">Personalised study methods, subject strategies, and exam preparation plan.</p>

	<!-- Study Approach -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-2">Your Study Approach: {data.studyApproach.label}</h3>
		<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.studyApproach.description}</p>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<div class="text-xs font-semibold text-green-700 mb-1">Strengths</div>
				<ul class="space-y-1">
					{#each data.studyApproach.strengths as s}
						<li class="text-xs text-gray-600 flex items-start gap-1.5">
							<span class="text-green-400 mt-0.5">+</span>{s}
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="text-xs font-semibold text-amber-700 mb-1">Watch For</div>
				<ul class="space-y-1">
					{#each data.studyApproach.risks as r}
						<li class="text-xs text-gray-600 flex items-start gap-1.5">
							<span class="text-amber-400 mt-0.5">!</span>{r}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Recommended Methods -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Recommended Study Methods</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			{#each data.methods as method}
				<div class="bg-gray-50 rounded-lg p-3">
					<div class="flex items-center gap-2 mb-1">
						<span>{method.icon}</span>
						<span class="text-sm font-bold text-gray-800">{method.name}</span>
						<span class="text-xs font-medium px-1.5 py-0.5 rounded-full
							{method.fit === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">
							{method.fit}
						</span>
					</div>
					<p class="text-xs text-gray-600 leading-relaxed">{method.description}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Subject Strategies -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Subject-Specific Strategies</h3>
		{#each Object.values(data.subjectStrategies) as subject}
			<div class="mb-4 last:mb-0">
				<div class="flex items-center gap-2 mb-2">
					<span>{subject.icon}</span>
					<span class="text-sm font-semibold text-gray-800">{subject.label}</span>
				</div>
				<ul class="space-y-1 ml-7">
					{#each subject.strategies as strategy}
						<li class="text-xs text-gray-600 flex items-start gap-1.5">
							<span class="text-blue-400 mt-0.5">-</span>{strategy}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<!-- Exam Prep Timeline -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Exam Preparation Timeline</h3>
		<div class="space-y-2 mb-4">
			{#each data.examPrep.timeline as step}
				<div class="flex gap-3 items-start">
					<span class="text-xs font-bold text-blue-600 w-24 shrink-0 pt-0.5">{step.week}</span>
					<span class="text-xs text-gray-700">{step.action}</span>
				</div>
			{/each}
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<div class="bg-amber-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-amber-800 mb-1">The Day Before</div>
				<ul class="space-y-1">
					{#each data.examPrep.dayBefore as tip}
						<li class="text-xs text-amber-700">{tip}</li>
					{/each}
				</ul>
			</div>
			<div class="bg-green-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-green-800 mb-1">Exam Day</div>
				<ul class="space-y-1">
					{#each data.examPrep.dayOf as tip}
						<li class="text-xs text-green-700">{tip}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Time Management -->
	<div class="bg-white rounded-2xl shadow-sm p-5 mb-4 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-2">Time Management: {data.timeManagement.style}</h3>
		<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.timeManagement.description}</p>
		<div class="flex flex-wrap gap-2 mb-2">
			{#each data.timeManagement.tools as tool}
				<span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{tool}</span>
			{/each}
		</div>
		<p class="text-xs text-amber-700 italic">{data.timeManagement.warning}</p>
	</div>

	<!-- Weekly Plan -->
	<div class="bg-white rounded-2xl shadow-sm p-5 print-break-avoid">
		<h3 class="font-bold text-gray-900 mb-3">Sample Weekly Rhythm</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-gray-700 mb-2">Weekdays</div>
				<div class="space-y-2">
					<div>
						<div class="text-xs font-medium text-gray-500">After School</div>
						<div class="text-xs text-gray-700">{data.weeklyPlan.weekdays.afterSchool}</div>
					</div>
					<div>
						<div class="text-xs font-medium text-gray-500">Evening</div>
						<div class="text-xs text-gray-700">{data.weeklyPlan.weekdays.evening}</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 rounded-lg p-3">
				<div class="text-xs font-semibold text-gray-700 mb-2">Weekend</div>
				<div class="space-y-2">
					<div>
						<div class="text-xs font-medium text-gray-500">Saturday</div>
						<div class="text-xs text-gray-700">{data.weeklyPlan.weekend.saturday}</div>
					</div>
					<div>
						<div class="text-xs font-medium text-gray-500">Sunday</div>
						<div class="text-xs text-gray-700">{data.weeklyPlan.weekend.sunday}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
