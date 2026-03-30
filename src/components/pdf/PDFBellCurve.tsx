import { Svg, Path, Line, Circle, Text as SvgText, G } from '@react-pdf/renderer';
import {
	bellCurvePoints,
	bellCurvePathD,
	bellCurveFilledPathD,
	scoreToX,
	scoreToY,
	withAlpha,
} from '@/lib/chart-geometry';

interface PDFBellCurveProps {
	score: number;
	color: string;
	label: string;
	percentile: number;
	width?: number;
	height?: number;
}

export function PDFBellCurve({
	score,
	color,
	label,
	percentile,
	width = 240,
	height = 100,
}: PDFBellCurveProps) {
	const pad = { top: 16, bottom: 22, left: 12, right: 12 };
	const points = bellCurvePoints(width, height, pad, 80);
	const curveD = bellCurvePathD(points);
	const baselineY = height - pad.bottom;
	const markerX = scoreToX(score, width, pad);
	const markerY = scoreToY(score, height, pad);
	const filledD = bellCurveFilledPathD(points, markerX, baselineY);

	const ticks = [1, 2, 3, 4, 5];

	return (
		<Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
			{/* Filled area */}
			<Path d={filledD} fill={withAlpha(color, 0.12)} />

			{/* Curve */}
			<Path d={curveD} fill="none" stroke="#c4b9a8" strokeWidth={1} />

			{/* Baseline */}
			<Line
				x1={String(pad.left)}
				y1={String(baselineY)}
				x2={String(width - pad.right)}
				y2={String(baselineY)}
				stroke="#e8e0d4"
				strokeWidth={0.5}
			/>

			{/* Tick marks */}
			<G>
				{ticks.map((t) => {
					const tx = scoreToX(t, width, pad);
					return (
						<G key={`tick-${t}`}>
							<Line
								x1={String(tx)}
								y1={String(baselineY)}
								x2={String(tx)}
								y2={String(baselineY + 3)}
								stroke="#c4b9a8"
								strokeWidth={0.3}
							/>
							<SvgText
								x={String(tx)}
								y={String(baselineY + 12)}
								textAnchor="middle"
								style={{ fontSize: 7, fill: '#8a7e6b' }}
							>
								{String(t)}
							</SvgText>
						</G>
					);
				})}
			</G>

			{/* Vertical marker line */}
			<Line
				x1={String(markerX)}
				y1={String(markerY)}
				x2={String(markerX)}
				y2={String(baselineY)}
				stroke={color}
				strokeWidth={1}
				strokeDasharray="2,1"
			/>

			{/* Marker dot */}
			<Circle cx={String(markerX)} cy={String(markerY)} r="3.5" fill={color} stroke="white" strokeWidth={1.5} />

			{/* Score text */}
			<SvgText
				x={String(markerX)}
				y={String(markerY - 7)}
				textAnchor="middle"
				style={{ fontSize: 8, fontWeight: 700, fill: color }}
			>
				{score.toFixed(1)}
			</SvgText>

			{/* Label */}
			<SvgText
				x={String(pad.left)}
				y={String(pad.top - 5)}
				textAnchor="start"
				style={{ fontSize: 7, fontWeight: 600, fill: color }}
			>
				{label}
			</SvgText>

			{/* Percentile */}
			<SvgText
				x={String(width - pad.right)}
				y={String(pad.top - 5)}
				textAnchor="end"
				style={{ fontSize: 7, fill: '#8a7e6b' }}
			>
				{`Top ${100 - percentile}%`}
			</SvgText>
		</Svg>
	);
}
