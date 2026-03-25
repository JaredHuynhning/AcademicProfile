'use client';

import { computeRadarGeometry, toPointsString, type RadarDataItem } from '@/lib/radar-geometry';

interface HexacoRadarChartProps {
	data: RadarDataItem[];
	size?: number;
	className?: string;
}

export function HexacoRadarChart({ data, size = 340, className }: HexacoRadarChartProps) {
	const padding = 60;
	const radius = (size - padding * 2) / 2;
	const cx = size / 2;
	const cy = size / 2;

	const geo = computeRadarGeometry(data, cx, cy, radius);

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
			{/* Grid rings */}
			{geo.gridRings.map((ring, i) => (
				<polygon
					key={`ring-${i}`}
					points={toPointsString(ring)}
					fill="none"
					stroke="#e8e0d4"
					strokeWidth={i === geo.gridRings.length - 1 ? 1 : 0.5}
				/>
			))}

			{/* Axis lines */}
			{geo.axisLines.map((line, i) => (
				<line
					key={`axis-${i}`}
					x1={line.from.x}
					y1={line.from.y}
					x2={line.to.x}
					y2={line.to.y}
					stroke="#e8e0d4"
					strokeWidth={0.5}
				/>
			))}

			{/* Data polygon fill */}
			<polygon
				points={toPointsString(geo.dataPoints)}
				fill="rgba(44, 36, 23, 0.06)"
				stroke="rgba(44, 36, 23, 0.3)"
				strokeWidth={1.5}
				strokeLinejoin="round"
			/>

			{/* Data dots */}
			{geo.dataPoints.map((pt, i) => (
				<circle key={`dot-${i}`} cx={pt.x} cy={pt.y} r={4} fill={data[i].color} />
			))}

			{/* Labels */}
			{geo.labelPositions.map((lp, i) => (
				<text
					key={`label-${i}`}
					x={lp.x}
					y={lp.y}
					textAnchor={lp.anchor}
					dominantBaseline="central"
					fontSize={11}
					fill="#2c2417"
					fontFamily="sans-serif"
				>
					{lp.label}
				</text>
			))}
		</svg>
	);
}
