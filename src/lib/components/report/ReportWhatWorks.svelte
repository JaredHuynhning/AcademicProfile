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
			{#if data.teacher.insights?.length > 0}
				<div class="flex flex-wrap gap-1.5 mb-3">
					{#each data.teacher.insights as ins}
						<div class="flex items-start gap-1.5 text-xs">
							<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 {ins.type === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
								{ins.type === 'strength' ? 'Strength' : 'Needs Work'}
							</span>
							<span class="text-gray-600">{ins.text}</span>
						</div>
					{/each}
				</div>
			{/if}
			<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.teacher.desc}</p>
			<div class="bg-blue-50 rounded-lg p-3">
				<p class="text-xs text-blue-800"><strong>For tutors & parents:</strong> {data.teacher.tutorTip}</p>
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
			{#if data.response.insights?.length > 0}
				<div class="flex flex-wrap gap-1.5 mb-3">
					{#each data.response.insights as ins}
						<div class="flex items-start gap-1.5 text-xs">
							<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 {ins.type === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
								{ins.type === 'strength' ? 'Strength' : 'Needs Work'}
							</span>
							<span class="text-gray-600">{ins.text}</span>
						</div>
					{/each}
				</div>
			{/if}
			<p class="text-sm text-gray-700 leading-relaxed mb-3">{data.response.desc}</p>
			<div class="bg-amber-50 rounded-lg p-3">
				<p class="text-xs text-amber-800"><strong>Strategy:</strong> {data.response.strategy}</p>
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
			{#if data.examBarrier.insights?.length > 0}
				<div class="flex flex-wrap gap-1.5 mb-3">
					{#each data.examBarrier.insights as ins}
						<div class="flex items-start gap-1.5 text-xs">
							<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 {ins.type === 'strength' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
								{ins.type === 'strength' ? 'Strength' : 'Needs Work'}
							</span>
							<span class="text-gray-600">{ins.text}</span>
						</div>
					{/each}
				</div>
			{/if}
			<p class="text-sm text-gray-700 leading-relaxed mb-4">{data.examBarrier.desc}</p>

			{#if data.examBarrier.strategies?.length > 0}
				<div class="bg-emerald-50 rounded-lg p-4">
					<h4 class="text-xs font-bold text-emerald-800 mb-2">Action Steps</h4>
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
