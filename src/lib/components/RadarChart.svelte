<script>
	let { data = [], size = 300 } = $props();

	let cx = $derived(size / 2);
	let cy = $derived(size / 2);
	let maxRadius = $derived(size * 0.38);
	const levels = [1, 2, 3, 4, 5];

	function polarToCart(angle, radius) {
		const rad = (angle - 90) * (Math.PI / 180);
		return {
			x: cx + radius * Math.cos(rad),
			y: cy + radius * Math.sin(rad)
		};
	}

	function getPoints(values, max) {
		const step = 360 / values.length;
		return values.map((v, i) => {
			const r = (v / max) * maxRadius;
			return polarToCart(i * step, r);
		});
	}

	function pointsToPath(points) {
		return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
	}

	let gridPaths = $derived(
		levels.map((level) => {
			const r = (level / 5) * maxRadius;
			const pts = data.map((_, i) => polarToCart((i * 360) / data.length, r));
			return pointsToPath(pts);
		})
	);

	let axisLines = $derived(
		data.map((_, i) => {
			const angle = (i * 360) / data.length;
			const end = polarToCart(angle, maxRadius);
			return { x1: cx, y1: cy, x2: end.x, y2: end.y };
		})
	);

	let dataPoints = $derived(getPoints(data.map((d) => d.value), 5));
	let dataPath = $derived(dataPoints.length > 0 ? pointsToPath(dataPoints) : '');

	let labelPositions = $derived(
		data.map((d, i) => {
			const angle = (i * 360) / data.length;
			const pos = polarToCart(angle, maxRadius + 24);
			return { ...pos, label: d.label, color: d.color, value: d.value };
		})
	);
</script>

<svg viewBox="0 0 {size} {size}" width={size} height={size} class="mx-auto">
	<!-- Grid -->
	{#each gridPaths as path, i}
		<path d={path} fill="none" stroke="#e5e7eb" stroke-width={i === levels.length - 1 ? 1.5 : 0.5} />
	{/each}

	<!-- Axes -->
	{#each axisLines as line}
		<line {...line} stroke="#e5e7eb" stroke-width="0.5" />
	{/each}

	<!-- Data polygon -->
	{#if dataPath}
		<path d={dataPath} fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" stroke-width="2.5" stroke-linejoin="round" />
	{/if}

	<!-- Data points -->
	{#each dataPoints as point, i}
		<circle cx={point.x} cy={point.y} r="4" fill={data[i]?.color || '#6366f1'} stroke="white" stroke-width="2" />
	{/each}

	<!-- Labels -->
	{#each labelPositions as lbl}
		<text
			x={lbl.x}
			y={lbl.y}
			text-anchor="middle"
			dominant-baseline="middle"
			class="text-[10px] font-semibold"
			fill={lbl.color}
		>
			{lbl.label.split(' ').length > 1 ? lbl.label.split(' ')[0] : lbl.label}
		</text>
		<text
			x={lbl.x}
			y={lbl.y + 12}
			text-anchor="middle"
			dominant-baseline="middle"
			class="text-[9px]"
			fill="#9ca3af"
		>
			{lbl.value.toFixed(1)}
		</text>
	{/each}
</svg>
