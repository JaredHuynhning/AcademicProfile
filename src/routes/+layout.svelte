<script>
	import '../app.css';
	import { progress } from '$lib/stores/test.js';
	import { savedReportsStore } from '$lib/stores/reports.js';
	import { page } from '$app/stores';

	let { children } = $props();

	let showProgress = $derived($page.url.pathname === '/test');
	let pct = $derived($progress.percent);
	let reportCount = $derived($savedReportsStore.length);
</script>

<div class="min-h-screen flex flex-col">
	<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 no-print">
		<div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors">
				<span class="text-2xl">🎓</span>
				<span class="font-bold text-lg">Learning Profile</span>
			</a>
			{#if !showProgress}
				<a href="/reports" class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
					Reports
					{#if reportCount > 0}
						<span class="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{reportCount}</span>
					{/if}
				</a>
			{/if}
			{#if showProgress}
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-500">{$progress.answered}/{$progress.total}</span>
					<div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							class="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300"
							style="width: {pct}%"
						></div>
					</div>
				</div>
			{/if}
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="text-center py-6 text-xs text-gray-400 no-print">
		Based on HEXACO-PI-R (Lee & Ashton), Grit-S (Duckworth), SVS (Ryan & Frederick), ASSIST (Entwistle), AMS (Vallerand), MSLQ (Pintrich), TIMSS (IEA)
	</footer>
</div>
