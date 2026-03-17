<script>
	import { goto } from '$app/navigation';
	import { savedReportsStore, loadReport, deleteReport } from '$lib/stores/reports.js';

	let search = $state('');
	let confirmDeleteId = $state(null);

	const dimOrder = ['H', 'E', 'X', 'A', 'C', 'O'];
	const dimColors = {
		H: 'var(--dim-H)',
		E: 'var(--dim-E)',
		X: 'var(--dim-X)',
		A: 'var(--dim-A)',
		C: 'var(--dim-C)',
		O: 'var(--dim-O)'
	};

	let filtered = $derived(
		$savedReportsStore.filter((r) =>
			r.name.toLowerCase().includes(search.toLowerCase())
		)
	);

	function getTopDimension(results) {
		let top = { key: 'H', score: 0 };
		for (const dim of dimOrder) {
			if (results.dimensions[dim].score > top.score) {
				top = { key: dim, score: results.dimensions[dim].score };
			}
		}
		return { ...top, name: results.dimensions[top.key].name };
	}

	function getTopArchetype(results) {
		if (!results.archetypes || results.archetypes.length === 0) return null;
		return results.archetypes[0];
	}

	function relativeDate(dateStr) {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now - date;
		const mins = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		const weeks = Math.floor(days / 7);
		const months = Math.floor(days / 30);

		if (mins < 1) return 'Just now';
		if (mins < 60) return `${mins}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		if (weeks < 5) return `${weeks}w ago`;
		if (months < 12) return `${months}mo ago`;
		return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function handleView(report) {
		loadReport(report);
		goto('/results');
	}

	function handleDelete(id) {
		if (confirmDeleteId === id) {
			deleteReport(id);
			confirmDeleteId = null;
		} else {
			confirmDeleteId = id;
			setTimeout(() => {
				if (confirmDeleteId === id) confirmDeleteId = null;
			}, 3000);
		}
	}

	function isSample(id) {
		return id.startsWith('sample-');
	}
</script>

<div class="max-w-3xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-extrabold text-gray-900">Saved Profiles</h1>
			<p class="text-sm text-gray-500 mt-1">{$savedReportsStore.length} profile{$savedReportsStore.length !== 1 ? 's' : ''}</p>
		</div>
		<button
			onclick={() => goto('/')}
			class="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-xl
				hover:from-blue-700 hover:to-violet-700 transition-all shadow-sm text-sm"
		>
			+ New Quiz
		</button>
	</div>

	{#if $savedReportsStore.length > 3}
		<div class="mb-4">
			<input
				type="text"
				bind:value={search}
				placeholder="Search by name..."
				class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
			/>
		</div>
	{/if}

	{#if filtered.length === 0}
		<div class="text-center py-16 bg-white rounded-2xl shadow-sm">
			{#if search}
				<div class="text-4xl mb-3">🔍</div>
				<p class="text-gray-500">No profiles match "{search}"</p>
				<button onclick={() => (search = '')} class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
					Clear search
				</button>
			{:else}
				<div class="text-4xl mb-3">📋</div>
				<p class="text-gray-600 font-medium">No saved profiles yet</p>
				<p class="text-gray-400 text-sm mt-1">Take the quiz to create your first profile</p>
				<button
					onclick={() => goto('/')}
					class="mt-4 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition text-sm"
				>
					Take Quiz
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid gap-3 md:grid-cols-2">
			{#each filtered as report (report.id)}
				{@const topDim = getTopDimension(report.results)}
				{@const topArch = getTopArchetype(report.results)}
				<div class="bg-white rounded-xl shadow-sm p-5 flex flex-col">
					<div class="flex items-start justify-between mb-3">
						<div>
							<div class="flex items-center gap-2">
								<h3 class="font-bold text-gray-900">{report.name}</h3>
								{#if isSample(report.id)}
									<span class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Sample</span>
								{/if}
							</div>
							<p class="text-xs text-gray-400 mt-0.5">{relativeDate(report.date)}</p>
						</div>
						<span
							class="text-xs font-semibold px-2.5 py-1 rounded-full"
							style="background: {dimColors[topDim.key]}15; color: {dimColors[topDim.key]}"
						>
							{topDim.name}
						</span>
					</div>

					{#if topArch}
						<div class="flex items-center gap-2 mb-4 text-sm text-gray-600">
							<span>{topArch.icon}</span>
							<span class="font-medium">{topArch.name}</span>
							<span class="text-gray-400">({Math.round(topArch.match_score * 100)}%)</span>
						</div>
					{/if}

					<div class="flex gap-2 mt-auto">
						<button
							onclick={() => handleView(report)}
							class="flex-1 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition text-sm"
						>
							View
						</button>
						<button
							onclick={() => goto(`/report?id=${report.id}`)}
							class="px-4 py-2 bg-violet-50 text-violet-700 font-medium rounded-lg hover:bg-violet-100 transition text-sm"
						>
							Report
						</button>
						<button
							onclick={() => handleDelete(report.id)}
							class="px-4 py-2 rounded-lg font-medium transition text-sm
								{confirmDeleteId === report.id
									? 'bg-red-500 text-white hover:bg-red-600'
									: 'bg-gray-100 text-gray-500 hover:bg-gray-200'}"
						>
							{confirmDeleteId === report.id ? 'Confirm?' : 'Delete'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
