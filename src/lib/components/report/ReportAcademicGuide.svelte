<script>
	let { data } = $props();

	function urgencyColor(u) {
		if (u === 'enrichment') return 'bg-emerald-100 text-emerald-700';
		if (u === 'support') return 'bg-blue-100 text-blue-700';
		if (u === 'intervention') return 'bg-amber-100 text-amber-700';
		return 'bg-red-100 text-red-700';
	}

	function urgencyLabel(u) {
		if (u === 'enrichment') return 'Enrichment';
		if (u === 'support') return 'Support';
		if (u === 'intervention') return 'Intervention';
		return 'Urgent';
	}

	function severityColor(s) {
		if (s === 'urgent') return 'bg-red-100 text-red-700';
		if (s === 'act') return 'bg-amber-100 text-amber-700';
		return 'bg-blue-100 text-blue-700';
	}

	function alignmentColor(a) {
		if (a === 'aligned') return 'bg-emerald-100 text-emerald-700';
		if (a === 'passion-gap') return 'bg-amber-100 text-amber-700';
		if (a === 'confidence-gap') return 'bg-orange-100 text-orange-700';
		return 'bg-red-100 text-red-700';
	}

	function alignmentLabel(a) {
		if (a === 'aligned') return 'Aligned';
		if (a === 'passion-gap') return 'Passion Gap';
		if (a === 'confidence-gap') return 'Confidence Gap';
		return 'Disengaged';
	}

	function whoColor(w) {
		if (w === 'teacher') return 'text-blue-600';
		if (w === 'parent') return 'text-emerald-600';
		return 'text-violet-600';
	}

	function whoLabel(w) {
		if (w === 'teacher') return 'Teacher';
		if (w === 'parent') return 'Parent';
		return 'Both';
	}

	function priorityDot(p) {
		return p === 'high' ? 'bg-red-400' : 'bg-amber-300';
	}

	function actionBg(i) {
		if (i === 0) return 'bg-rose-500';
		if (i === 1) return 'bg-amber-500';
		return 'bg-blue-500';
	}
</script>

{#if data}
	<section id="section-academic-guide" class="report-section">
		<div class="flex items-start justify-between mb-1">
			<h2 class="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
				<span class="text-teal-600">16</span> Academic Guide for Teachers & Parents
			</h2>
			<span class="text-xs font-semibold px-2.5 py-1 rounded-full {urgencyColor(data.urgency)} shrink-0 mt-1">
				{urgencyLabel(data.urgency)}
			</span>
		</div>
		<p class="text-sm text-gray-500 mb-6">Data-driven strategies for supporting this student's learning at school and at home</p>

		<!-- Key Message -->
		<div class="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 mb-6 border border-teal-100">
			<p class="text-sm text-gray-800 leading-relaxed font-medium">{data.shared.keyMessage}</p>
		</div>

		<!-- Two-column layout -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

			<!-- TEACHER COLUMN -->
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-blue-800 flex items-center gap-2">
					<span>🏫</span> For Teachers
				</h3>

				<!-- Snapshot -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Student Snapshot</h4>
					<p class="text-xs text-gray-700 font-medium mb-2">{data.teacher.snapshot.headline}</p>
					<div class="flex flex-wrap gap-1.5">
						<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
							{data.teacher.snapshot.approach}
						</span>
						<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">
							{data.teacher.snapshot.motivationType}
						</span>
						<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
							{data.teacher.snapshot.regulationLevel} regulation
						</span>
					</div>
				</div>

				<!-- Instruction Tips -->
				{#if data.teacher.instructionTips.length > 0}
					<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
						<h4 class="text-sm font-bold text-gray-800 mb-2">Instruction Tips</h4>
						<div class="space-y-3">
							{#each data.teacher.instructionTips as tip}
								<div class="flex items-start gap-2">
									<span class="w-2 h-2 rounded-full {priorityDot(tip.priority)} mt-1.5 shrink-0"></span>
									<div>
										<p class="text-xs text-gray-700 leading-relaxed">{tip.tip}</p>
										<p class="text-xs text-gray-400 mt-0.5">{tip.evidence}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Motivation Levers -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Motivation Levers</h4>
					<div class="space-y-2 mb-2">
						<div>
							<div class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Do more</div>
							{#each data.teacher.motivationLevers.doMore as item}
								<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
									<span class="text-emerald-400 mt-0.5 shrink-0">+</span>{item}
								</p>
							{/each}
						</div>
						<div>
							<div class="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Avoid</div>
							{#each data.teacher.motivationLevers.avoid as item}
								<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
									<span class="text-red-400 mt-0.5 shrink-0">-</span>{item}
								</p>
							{/each}
						</div>
					</div>
					<p class="text-xs text-gray-400">{data.teacher.motivationLevers.evidence}</p>
				</div>

				<!-- Exam Support -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Exam Support</h4>
					<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2 inline-block">
						{data.teacher.examSupport.barrier}
					</span>
					<div class="space-y-1.5 mt-1">
						{#each data.teacher.examSupport.strategies as s}
							<p class="text-xs text-gray-700 flex items-start gap-1.5">
								<span class="text-blue-400 mt-0.5 shrink-0">→</span>{s}
							</p>
						{/each}
					</div>
					{#if data.teacher.examSupport.evidence}
						<p class="text-xs text-gray-400 mt-2">{data.teacher.examSupport.evidence}</p>
					{/if}
				</div>

				<!-- Subject Notes -->
				{#if data.teacher.subjectNotes.length > 0}
					<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
						<h4 class="text-sm font-bold text-gray-800 mb-2">Subject Notes</h4>
						<div class="space-y-2">
							{#each data.teacher.subjectNotes as sn}
								<div>
									<div class="flex items-center gap-2 mb-0.5">
										<span class="text-xs font-semibold text-gray-900">{sn.subject}</span>
										<span class="text-xs font-semibold px-2 py-0.5 rounded-full {alignmentColor(sn.alignment)}">
											{alignmentLabel(sn.alignment)}
										</span>
										<span class="text-xs text-gray-400">P:{sn.passion} C:{sn.confidence}</span>
									</div>
									<p class="text-xs text-gray-600">{sn.note}</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Teacher Warning Signals -->
				<div class="bg-red-50 rounded-2xl p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-red-800 mb-2">Warning Signals</h4>
					<div class="space-y-2.5">
						{#each data.teacher.warningSignals as w}
							<div>
								<p class="text-xs text-red-900 font-medium">{w.signal}</p>
								<p class="text-xs text-red-700 mt-0.5"><strong>Means:</strong> {w.meaning}</p>
								<p class="text-xs text-red-700"><strong>Action:</strong> {w.action}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- PARENT COLUMN -->
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-emerald-800 flex items-center gap-2">
					<span>🏠</span> For Parents
				</h3>

				<!-- Summary -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Your Child's Learning Profile</h4>
					<p class="text-xs text-gray-700 leading-relaxed">{data.parent.summary}</p>
				</div>

				<!-- Strengths -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Strengths to Celebrate</h4>
					<div class="space-y-2">
						{#each data.parent.strengths as s}
							<div class="flex items-start gap-2">
								<span class="text-emerald-500 mt-0.5 shrink-0">+</span>
								<div>
									<span class="text-xs font-semibold text-gray-900">{s.area}</span>
									<span class="text-xs text-emerald-600 ml-1">{s.score}</span>
									<p class="text-xs text-gray-600">{s.detail}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Concerns -->
				{#if data.parent.concerns.length > 0}
					<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
						<h4 class="text-sm font-bold text-gray-800 mb-2">Areas to Watch</h4>
						<div class="space-y-2">
							{#each data.parent.concerns as c}
								<div class="flex items-start gap-2">
									<span class="text-xs font-semibold px-1.5 py-0.5 rounded {severityColor(c.severity)} shrink-0 mt-0.5">
										{c.severity}
									</span>
									<div>
										<span class="text-xs font-semibold text-gray-900">{c.area}</span>
										<span class="text-xs text-gray-400 ml-1">{c.score}</span>
										<p class="text-xs text-gray-600">{c.detail}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Home Study -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Home Study Guide</h4>
					<div class="space-y-2.5">
						<div>
							<div class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Environment</div>
							<p class="text-xs text-gray-700">{data.parent.homeStudy.environment}</p>
						</div>
						<div>
							<div class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Schedule</div>
							<p class="text-xs text-gray-700">{data.parent.homeStudy.schedule}</p>
						</div>
						{#if data.parent.homeStudy.tips.length > 0}
							<div>
								<div class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Tips</div>
								{#each data.parent.homeStudy.tips as tip}
									<p class="text-xs text-gray-700 flex items-start gap-1.5 mb-1">
										<span class="text-emerald-400 mt-0.5 shrink-0">→</span>{tip}
									</p>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Conversations -->
				<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-gray-800 mb-2">Conversation Starters</h4>
					<div class="space-y-2.5">
						{#each data.parent.conversations as c}
							<div>
								<div class="flex items-center gap-1.5 mb-0.5">
									<span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">{c.category}</span>
								</div>
								<p class="text-xs text-gray-900 font-medium italic">"{c.opener}"</p>
								<p class="text-xs text-gray-500 mt-0.5">{c.why}</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Parent Warning Signals -->
				<div class="bg-red-50 rounded-2xl p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-red-800 mb-2">Warning Signals</h4>
					<div class="space-y-2.5">
						{#each data.parent.warningSignals as w}
							<div>
								<p class="text-xs text-red-900 font-medium">{w.signal}</p>
								<p class="text-xs text-red-700 mt-0.5"><strong>Action:</strong> {w.action}</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Celebration Signals -->
				<div class="bg-emerald-50 rounded-2xl p-4 print-break-avoid">
					<h4 class="text-sm font-bold text-emerald-800 mb-2">What to Celebrate</h4>
					<div class="space-y-2">
						{#each data.parent.celebrationSignals as c}
							<div>
								<p class="text-xs text-emerald-900 font-medium">{c.signal}</p>
								<p class="text-xs text-emerald-700 mt-0.5">{c.meaning}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- SHARED SECTION (full width) -->

		<!-- Root Cause Summary -->
		{#if data.shared.rootCauseSummary}
			<div class="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-5 mb-4 border border-rose-100 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
					<span>🔍</span> Root Cause (for Adults)
				</h4>
				<p class="text-xs text-gray-700 leading-relaxed">{data.shared.rootCauseSummary}</p>
			</div>
		{/if}

		<!-- Top 3 Actions -->
		<div class="bg-white rounded-xl shadow-sm p-5 print-break-avoid">
			<h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
				<span>📋</span> Top 3 Actions
			</h4>
			<div class="space-y-4">
				{#each data.shared.topThreeActions as step, i}
					<div class="flex gap-3">
						<div class="shrink-0 w-7 h-7 rounded-full {actionBg(i)} flex items-center justify-center text-white text-xs font-bold">
							{i + 1}
						</div>
						<div class="min-w-0">
							<p class="text-sm font-semibold text-gray-900">{step.action}</p>
							<div class="flex items-center gap-2 mt-0.5">
								<span class="text-xs font-semibold {whoColor(step.who)}">{whoLabel(step.who)}</span>
								<span class="text-xs text-gray-400">{step.timeframe}</span>
							</div>
							<p class="text-xs text-gray-500 mt-0.5">{step.why}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}
