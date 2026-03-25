export interface RadarPoint {
	x: number;
	y: number;
}

export interface RadarDataItem {
	label: string;
	value: number;
	color: string;
}

export interface RadarGeometry {
	dataPoints: RadarPoint[];
	gridRings: RadarPoint[][];
	axisLines: Array<{ from: RadarPoint; to: RadarPoint }>;
	labelPositions: Array<RadarPoint & { anchor: 'start' | 'middle' | 'end'; label: string; color: string }>;
	center: RadarPoint;
}

function angleFor(i: number, n: number): number {
	return (2 * Math.PI * i) / n - Math.PI / 2;
}

function pointAt(cx: number, cy: number, radius: number, angle: number): RadarPoint {
	return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function anchorFor(angle: number): 'start' | 'middle' | 'end' {
	const cos = Math.cos(angle);
	if (cos > 0.3) return 'start';
	if (cos < -0.3) return 'end';
	return 'middle';
}

export function computeRadarGeometry(
	data: RadarDataItem[],
	cx: number,
	cy: number,
	radius: number,
	maxValue = 5,
): RadarGeometry {
	const n = data.length;

	const dataPoints = data.map((d, i) => {
		const angle = angleFor(i, n);
		const r = radius * (d.value / maxValue);
		return pointAt(cx, cy, r, angle);
	});

	const gridFractions = [0.2, 0.4, 0.6, 0.8, 1.0];
	const gridRings = gridFractions.map((frac) =>
		Array.from({ length: n }, (_, i) => pointAt(cx, cy, radius * frac, angleFor(i, n))),
	);

	const axisLines = Array.from({ length: n }, (_, i) => {
		const angle = angleFor(i, n);
		return { from: { x: cx, y: cy }, to: pointAt(cx, cy, radius, angle) };
	});

	const labelPositions = data.map((d, i) => {
		const angle = angleFor(i, n);
		const pt = pointAt(cx, cy, radius * 1.18, angle);
		return { ...pt, anchor: anchorFor(angle), label: d.label, color: d.color };
	});

	return { dataPoints, gridRings, axisLines, labelPositions, center: { x: cx, y: cy } };
}

export function toPointsString(points: RadarPoint[]): string {
	return points.map((p) => `${p.x},${p.y}`).join(' ');
}
