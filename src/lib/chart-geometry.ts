/**
 * Shared geometry utilities for bell curves, bar charts, and other visualisations.
 * Used by both web (SVG) and PDF (react-pdf Svg) chart components.
 */

// ─── Bell curve (normal distribution) ────────────────────────────────────────

/** Generate points along a normal distribution curve (standard normal scaled to 0-5) */
export function bellCurvePoints(
	width: number,
	height: number,
	padding: { top: number; bottom: number; left: number; right: number },
	steps = 100,
): { x: number; y: number }[] {
	const drawW = width - padding.left - padding.right;
	const drawH = height - padding.top - padding.bottom;

	const points: { x: number; y: number }[] = [];
	const mean = 2.5; // centre of 0-5 scale
	const sd = 0.8; // typical spread

	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const scoreVal = t * 5; // 0 → 5
		const z = (scoreVal - mean) / sd;
		const density = Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));

		const x = padding.left + t * drawW;
		const maxDensity = 1 / (sd * Math.sqrt(2 * Math.PI));
		const y = padding.top + drawH - (density / maxDensity) * drawH;
		points.push({ x, y });
	}
	return points;
}

/** Convert bell curve points to an SVG path `d` attribute */
export function bellCurvePathD(points: { x: number; y: number }[]): string {
	if (points.length === 0) return '';
	const [first, ...rest] = points;
	return `M ${first.x},${first.y} ` + rest.map((p) => `L ${p.x},${p.y}`).join(' ');
}

/** Get the x position on the bell curve for a given score value (0-5) */
export function scoreToX(
	score: number,
	width: number,
	padding: { left: number; right: number },
): number {
	const drawW = width - padding.left - padding.right;
	return padding.left + (score / 5) * drawW;
}

/** Get the y position on the bell curve for a given score (for the marker dot) */
export function scoreToY(
	score: number,
	height: number,
	padding: { top: number; bottom: number },
): number {
	const drawH = height - padding.top - padding.bottom;
	const mean = 2.5;
	const sd = 0.8;
	const z = (score - mean) / sd;
	const density = Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
	const maxDensity = 1 / (sd * Math.sqrt(2 * Math.PI));
	return padding.top + drawH - (density / maxDensity) * drawH;
}

/** Generate filled area path from baseline up through the curve to a specific score */
export function bellCurveFilledPathD(
	points: { x: number; y: number }[],
	targetX: number,
	baselineY: number,
): string {
	const filtered = points.filter((p) => p.x <= targetX);
	if (filtered.length === 0) return '';
	const first = filtered[0];
	const last = filtered[filtered.length - 1];
	return (
		`M ${first.x},${baselineY} ` +
		filtered.map((p) => `L ${p.x},${p.y}`).join(' ') +
		` L ${last.x},${baselineY} Z`
	);
}

// ─── Percentile helpers ──────────────────────────────────────────────────────

export function scorePercentile(score: number): number {
	// Approximate percentile on a normal distribution (mean=3.0, sd=0.7 for HEXACO norms)
	const mean = 3.0;
	const sd = 0.7;
	const z = (score - mean) / sd;
	// CDF approximation (Abramowitz & Stegun)
	const t = 1 / (1 + 0.2316419 * Math.abs(z));
	const d = 0.3989422804 * Math.exp(-0.5 * z * z);
	const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
	const cdf = z > 0 ? 1 - p : p;
	return Math.round(cdf * 100);
}

// ─── Bar chart helpers ───────────────────────────────────────────────────────

export interface BarData {
	label: string;
	value: number;
	maxValue?: number;
	color: string;
	sublabel?: string;
}

export function barWidth(value: number, maxValue: number, availableWidth: number): number {
	return Math.max(2, (value / maxValue) * availableWidth);
}

// ─── Colour utilities ────────────────────────────────────────────────────────

/** Lighten a hex colour by mixing with white */
export function lighten(hex: string, amount: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const nr = Math.round(r + (255 - r) * amount);
	const ng = Math.round(g + (255 - g) * amount);
	const nb = Math.round(b + (255 - b) * amount);
	return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

/** Add alpha to a hex colour, return rgba string */
export function withAlpha(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r},${g},${b},${alpha})`;
}
