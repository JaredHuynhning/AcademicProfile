<script>
	let { rows = [] } = $props();
</script>

<div class="score-table space-y-3">
	{#each rows as row}
		<div class="flex items-center gap-3 print-break-avoid">
			<span class="text-lg w-7 text-center shrink-0">{row.icon}</span>
			<div class="flex-1 min-w-0">
				<div class="flex items-center justify-between mb-1">
					<span class="font-semibold text-gray-900 text-sm">{row.name}</span>
					<div class="flex items-center gap-2">
						<span class="text-xs font-medium px-2 py-0.5 rounded-full"
							style="background: {row.color}15; color: {row.color}">
							{row.level}
						</span>
						<span class="text-sm font-bold text-gray-700 w-8 text-right">{row.score}</span>
					</div>
				</div>
				<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
					<div class="h-full rounded-full transition-all duration-500"
						style="width: {row.percent}%; background: {row.color}">
					</div>
				</div>
				<p class="text-xs text-gray-500 mt-1 leading-relaxed">{row.oneLiner}</p>
			</div>
		</div>
	{/each}
</div>
