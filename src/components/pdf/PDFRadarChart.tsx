import { Svg, Polygon, Circle, Line, G, Text as SvgText } from '@react-pdf/renderer';
import { computeRadarGeometry, toPointsString, type RadarDataItem } from '@/lib/radar-geometry';

interface PDFRadarChartProps {
	data: RadarDataItem[];
	size?: number;
}

export function PDFRadarChart({ data, size = 200 }: PDFRadarChartProps) {
	const padding = 30;
	const radius = (size - padding * 2) / 2;
	const cx = size / 2;
	const cy = size / 2;

	const geo = computeRadarGeometry(data, cx, cy, radius);

	return (
		<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			{/* Grid rings */}
			{geo.gridRings.map((ring, i) => (
				<Polygon
					key={`ring-${i}`}
					points={toPointsString(ring)}
					fill="none"
					stroke="#e8e0d4"
					strokeWidth={i === geo.gridRings.length - 1 ? 0.8 : 0.4}
				/>
			))}

			{/* Axis lines */}
			{geo.axisLines.map((line, i) => (
				<Line
					key={`axis-${i}`}
					x1={String(line.from.x)}
					y1={String(line.from.y)}
					x2={String(line.to.x)}
					y2={String(line.to.y)}
					stroke="#e8e0d4"
					strokeWidth={0.4}
				/>
			))}

			{/* Data polygon */}
			<Polygon
				points={toPointsString(geo.dataPoints)}
				fill="rgba(44, 36, 23, 0.06)"
				stroke="rgba(44, 36, 23, 0.3)"
				strokeWidth={1.2}
			/>

			{/* Data dots */}
			<G>
				{geo.dataPoints.map((pt, i) => (
					<Circle key={`dot-${i}`} cx={String(pt.x)} cy={String(pt.y)} r="3" fill={data[i].color} />
				))}
			</G>

			{/* Labels */}
			<G>
				{geo.labelPositions.map((lp, i) => (
					<SvgText
						key={`label-${i}`}
						x={String(lp.x)}
						y={String(lp.y)}
						textAnchor={lp.anchor}
						style={{ fontSize: 8, fill: '#2c2417' }}
					>
						{lp.label}
					</SvgText>
				))}
			</G>
		</Svg>
	);
}
