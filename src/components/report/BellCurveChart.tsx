'use client';

import {
	bellCurvePoints,
	bellCurvePathD,
	bellCurveFilledPathD,
	scoreToX,
	scoreToY,
	withAlpha,
} from '@/lib/chart-geometry';

interface BellCurveChartProps {
	score: number;
	color: string;
	label: string;
	percentile: number;
	width?: number;
	height?: number;
	className?: string;
}

export function BellCurveChart({
	score,
	color,
	label,
	percentile,
	width = 320,
	height = 140,
	className,
}: BellCurveChartProps) {
	const pad = { top: 20, bottom: 28, left: 16, right: 16 };
	const points = bellCurvePoints(width, height, pad);
	const curveD = bellCurvePathD(points);
	const baselineY = height - pad.bottom;
	const markerX = scoreToX(score, width, pad);
	const markerY = scoreToY(score, height, pad);
	const filledD = bellCurveFilledPathD(points, markerX, baselineY);

	// Tick marks at 1, 2, 3, 4, 5
	const ticks = [1, 2, 3, 4, 5];

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
			{/* Filled area up to student score */}
			<path d={filledD} fill={withAlpha(color, 0.15)} />

			{/* Curve line */}
			<path d={curveD} fill="none" stroke="#c4b9a8" strokeWidth={1.5} />

			{/* Baseline */}
			<line x1={pad.left} y1={baselineY} x2={width - pad.right} y2={baselineY} stroke="#e8e0d4" strokeWidth={1} />

			{/* Tick marks */}
			{ticks.map((t) => {
				const tx = scoreToX(t, width, pad);
				return (
					<g key={t}>
						<line x1={tx} y1={baselineY} x2={tx} y2={baselineY + 4} stroke="#c4b9a8" strokeWidth={0.5} />
						<text x={tx} y={baselineY + 14} textAnchor="middle" fontSize={9} fill="#8a7e6b" fontFamily="sans-serif">
							{t}
						</text>
					</g>
				);
			})}

			{/* Vertical marker line */}
			<line x1={markerX} y1={markerY} x2={markerX} y2={baselineY} stroke={color} strokeWidth={1.5} strokeDasharray="3,2" />

			{/* Marker dot */}
			<circle cx={markerX} cy={markerY} r={5} fill={color} stroke="white" strokeWidth={2} />

			{/* Score label */}
			<text
				x={markerX}
				y={markerY - 10}
				textAnchor="middle"
				fontSize={11}
				fontWeight="600"
				fill={color}
				fontFamily="sans-serif"
			>
				{score.toFixed(1)}
			</text>

			{/* Percentile badge */}
			<text
				x={width - pad.right}
				y={pad.top - 4}
				textAnchor="end"
				fontSize={10}
				fill="#8a7e6b"
				fontFamily="sans-serif"
			>
				Top {100 - percentile}%
			</text>

			{/* Label */}
			<text
				x={pad.left}
				y={pad.top - 4}
				textAnchor="start"
				fontSize={10}
				fontWeight="600"
				fill={color}
				fontFamily="sans-serif"
			>
				{label}
			</text>
		</svg>
	);
}
