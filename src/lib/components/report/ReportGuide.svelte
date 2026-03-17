<script>
	let { data = {} } = $props();
</script>

<section class="report-section print-break-before" id="section-guide">
	<h2 class="text-2xl font-extrabold text-gray-900 mb-1">Guide for Teachers & Parents</h2>
	<p class="text-sm text-gray-500 mb-6">Practical strategies for supporting this student at school and at home.</p>

	<!-- Shared Insight -->
	<div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4 print-break-avoid">
		<p class="text-sm text-gray-800 leading-relaxed">{data.sharedInsights.keyMessage}</p>
		<p class="text-xs text-gray-600 mt-2 italic">{data.sharedInsights.alignmentTip}</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Teacher Section -->
		<div class="space-y-4">
			<h3 class="text-lg font-bold text-blue-800 flex items-center gap-2">
				<span>🏫</span> For Teachers
			</h3>

			<!-- Quick Profile -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Quick Profile</h4>
				<ul class="space-y-1.5">
					{#each data.teacher.quickProfile as trait}
						<li class="text-xs text-gray-600 flex items-start gap-1.5">
							<span class="text-blue-400 mt-0.5 shrink-0">-</span>{trait}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Motivation -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Motivation Strategies</h4>
				<div class="space-y-2">
					{#each data.teacher.motivationStrategies as strategy}
						<div>
							<div class="text-xs font-semibold text-blue-700">{strategy.approach}</div>
							<p class="text-xs text-gray-600">{strategy.details}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Feedback -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Feedback Approach</h4>
				<div class="space-y-1.5">
					<div class="text-xs"><strong class="text-green-700">Preferred:</strong> <span class="text-gray-600">{data.teacher.feedbackStyle.preferred}</span></div>
					<p class="text-xs text-gray-600">{data.teacher.feedbackStyle.description}</p>
					<div class="text-xs"><strong class="text-red-600">Avoid:</strong> <span class="text-gray-600">{data.teacher.feedbackStyle.avoid}</span></div>
				</div>
			</div>

			<!-- Classroom Tips -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Classroom Tips</h4>
				<ul class="space-y-1.5">
					{#each data.teacher.classroomTips as tip}
						<li class="text-xs text-gray-600 flex items-start gap-1.5">
							<span class="text-blue-400 mt-0.5 shrink-0">-</span>{tip}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Warning Signals -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-red-700 mb-2">Warning Signals</h4>
				<div class="space-y-2">
					{#each data.teacher.warningSignals as warning}
						<div class="bg-red-50 rounded-lg p-2">
							<div class="text-xs font-semibold text-red-800">{warning.signal}</div>
							<p class="text-xs text-red-700">{warning.meaning}</p>
							<p class="text-xs text-green-700 mt-0.5"><strong>Action:</strong> {warning.action}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Parent Section -->
		<div class="space-y-4">
			<h3 class="text-lg font-bold text-green-800 flex items-center gap-2">
				<span>🏠</span> For Parents
			</h3>

			<!-- Understanding -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Understanding Your Child</h4>
				<p class="text-xs text-gray-700 leading-relaxed">{data.parent.understandingProfile}</p>
			</div>

			<!-- Home Environment -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Home Environment</h4>
				<div class="space-y-2">
					{#each data.parent.homeEnvironment as env}
						<div>
							<div class="text-xs font-semibold text-green-700">{env.area}</div>
							<p class="text-xs text-gray-600">{env.tip}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Conversation Starters -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Conversation Starters</h4>
				<div class="space-y-2">
					{#each data.parent.conversationStarters as starter}
						<div class="bg-green-50 rounded-lg p-2">
							<p class="text-xs text-green-900 italic">"{starter.text}"</p>
							<span class="text-xs text-green-600">({starter.type})</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Support Strategies -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-gray-800 mb-2">Support Strategies</h4>
				<div class="space-y-3">
					{#each data.parent.supportStrategies as strategy}
						<div>
							<div class="text-xs font-semibold text-gray-800 mb-1">{strategy.area}</div>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<div class="text-xs font-medium text-green-600 mb-0.5">Do</div>
									<ul class="space-y-0.5">
										{#each strategy.dos as d}
											<li class="text-xs text-gray-600">+ {d}</li>
										{/each}
									</ul>
								</div>
								<div>
									<div class="text-xs font-medium text-red-600 mb-0.5">Avoid</div>
									<ul class="space-y-0.5">
										{#each strategy.donts as d}
											<li class="text-xs text-gray-600">- {d}</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Warning Signs -->
			<div class="bg-white rounded-2xl shadow-sm p-4 print-break-avoid">
				<h4 class="text-sm font-bold text-red-700 mb-2">Warning Signs</h4>
				<div class="space-y-2">
					{#each data.parent.warningSignals as warning}
						<div class="bg-red-50 rounded-lg p-2">
							<div class="text-xs font-semibold text-red-800">{warning.signal}</div>
							<p class="text-xs text-green-700 mt-0.5"><strong>Action:</strong> {warning.action}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Reminder -->
	<div class="bg-gray-50 rounded-xl p-4 mt-4 print-break-avoid">
		<p class="text-xs text-gray-600 italic text-center">{data.sharedInsights.reminderNote}</p>
	</div>
</section>
