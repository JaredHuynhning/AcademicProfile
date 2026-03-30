import { Svg, Rect, Line, Text as SvgText, G } from '@react-pdf/renderer';
import { withAlpha } from '@/lib/chart-geometry';

interface FacetData {
	name: string;
	score: number;
}

interface PDFFacetBarChartProps {
	dimensionColor: string;
	facets: FacetData[];
	width?: number;
}

export function PDFFacetBarChart({
	dimensionColor,
	facets,
	width = 240,
}: PDFFacetBarChartProps) {
	const barHeight = 12;
	const gap = 6;
	const labelWidth = 80;
	const scoreTextWidth = 28;
	const barAreaWidth = width - labelWidth - scoreTextWidth - 8;
	const totalHeight = facets.length * (barHeight + gap) + 4;

	return (
		<Svg width={width} height={totalHeight} viewBox={`0 0 ${width} ${totalHeight}`}>
			{facets.map((facet, i) => {
				const y = i * (barHeight + gap) + 2;
				const pct = Math.max(0.04, facet.score / 5);
				const fillWidth = pct * barAreaWidth;
				const isHigh = facet.score >= 3.5;
				const isLow = facet.score < 2.5;
				const fillColor = isHigh
					? dimensionColor
					: isLow
						? withAlpha(dimensionColor, 0.4)
						: withAlpha(dimensionColor, 0.65);

				const displayName = facet.name
					.replace(/_/g, ' ')
					.replace(/\b\w/g, (c) => c.toUpperCase());

				return (
					<G key={facet.name}>
						{/* Label */}
						<SvgText
							x={String(labelWidth - 4)}
							y={String(y + barHeight / 2 + 1)}
							textAnchor="end"
							style={{ fontSize: 7, fill: '#2c2417' }}
						>
							{displayName}
						</SvgText>

						{/* Background bar */}
						<Rect
							x={String(labelWidth)}
							y={String(y)}
							width={String(barAreaWidth)}
							height={String(barHeight)}
							fill={withAlpha(dimensionColor, 0.06)}
							rx="3"
						/>

						{/* Fill bar */}
						<Rect
							x={String(labelWidth)}
							y={String(y)}
							width={String(fillWidth)}
							height={String(barHeight)}
							fill={fillColor}
							rx="3"
						/>

						{/* Average marker */}
						<Line
							x1={String(labelWidth + barAreaWidth * 0.6)}
							y1={String(y)}
							x2={String(labelWidth + barAreaWidth * 0.6)}
							y2={String(y + barHeight)}
							stroke={withAlpha('#2c2417', 0.12)}
							strokeWidth={0.5}
						/>

						{/* Score text */}
						<SvgText
							x={String(labelWidth + barAreaWidth + 6)}
							y={String(y + barHeight / 2 + 1)}
							textAnchor="start"
							style={{ fontSize: 7, fontWeight: 600, fill: dimensionColor }}
						>
							{facet.score.toFixed(1)}
						</SvgText>
					</G>
				);
			})}
		</Svg>
	);
}
