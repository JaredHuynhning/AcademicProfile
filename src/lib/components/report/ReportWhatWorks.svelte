<script>
	let { data } = $props();
</script>

{#if data}
	<section id="section-what-works" class="report-section print-break-before">
		<h2 class="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
			<span class="text-amber-600">14</span> What Works For You
		</h2>
		<p class="text-sm text-gray-500 mb-6">Your instruction manual: how you learn best, what motivates you, and what holds you back in exams</p>

		<!-- Teacher Preference -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="text-xl">{data.teacher.icon}</span> Teaching Style: {data.teacher.label}
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Structure preference: {data.teacher.structureScore}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Warmth preference: {data.teacher.warmthScore}/5
				</span>
			</div>
			<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.teacher.desc}</p>

			{#if data.teacher.strengths?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Strengths</h4>
					{#each data.teacher.strengths as s}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1"><span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}</p>
					{/each}
				</div>
			{/if}
			{#if data.teacher.weaknesses?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Weaknesses</h4>
					{#each data.teacher.weaknesses as w}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1"><span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}</p>
					{/each}
				</div>
			{/if}

			<div class="bg-blue-50 rounded-lg p-3 mt-3">
				<p class="text-xs text-blue-800"><strong>What To Do:</strong> {data.teacher.tutorTip}</p>
			</div>
		</div>

		<!-- Response Type -->
		<div class="bg-white rounded-xl shadow-sm p-6 mb-6">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="text-xl">{data.response.icon}</span> Motivation Style: {data.response.label}
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Encouragement response: {data.response.carrotScore}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Accountability response: {data.response.stickScore}/5
				</span>
			</div>
			<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.response.desc}</p>

			{#if data.response.strengths?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Strengths</h4>
					{#each data.response.strengths as s}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1"><span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}</p>
					{/each}
				</div>
			{/if}
			{#if data.response.weaknesses?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Weaknesses</h4>
					{#each data.response.weaknesses as w}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1"><span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}</p>
					{/each}
				</div>
			{/if}

			<div class="bg-amber-50 rounded-lg p-3 mt-3">
				<p class="text-xs text-amber-800"><strong>What To Do:</strong> {data.response.strategy}</p>
			</div>
		</div>

		<!-- Exam Barrier Diagnosis -->
		<div class="bg-white rounded-xl shadow-sm p-6">
			<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
				<span class="text-xl">{data.examBarrier.icon}</span> Exam Barrier: {data.examBarrier.label}
			</h3>
			<div class="flex flex-wrap gap-2 mb-3">
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Preparation: {data.examBarrier.scores.preparation}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					External: {data.examBarrier.scores.external}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Anxiety: {data.examBarrier.scores.anxiety}/5
				</span>
				<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
					Time Mgmt: {data.examBarrier.scores.timeManagement}/5
				</span>
			</div>
			<p class="text-sm text-gray-700 leading-relaxed mb-4">{data.examBarrier.desc}</p>

			{#if data.examBarrier.strengths?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">Strengths</h4>
					{#each data.examBarrier.strengths as s}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1"><span class="text-emerald-500 mt-0.5 shrink-0">+</span>{s}</p>
					{/each}
				</div>
			{/if}
			{#if data.examBarrier.weaknesses?.length > 0}
				<div class="mt-3">
					<h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Weaknesses</h4>
					{#each data.examBarrier.weaknesses as w}
						<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1"><span class="text-amber-500 mt-0.5 shrink-0">-</span>{w}</p>
					{/each}
				</div>
			{/if}

			{#if data.examBarrier.strategies?.length > 0}
				<div class="bg-emerald-50 rounded-lg p-4 mt-3">
					<h4 class="text-xs font-bold text-emerald-800 mb-2">What To Do</h4>
					<ul class="space-y-1.5">
						{#each data.examBarrier.strategies as strategy}
							<li class="text-xs text-emerald-700 flex items-start gap-1.5">
								<span class="text-emerald-500 mt-0.5 shrink-0">→</span>
								<span>{strategy}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</section>
{/if}
