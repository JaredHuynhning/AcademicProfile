'use client';

import { BellCurveChart } from './BellCurveChart';
import { FacetBarChart } from './FacetBarChart';
import { withAlpha } from '@/lib/chart-geometry';

interface FacetInfo {
	name: string;
	score: number;
}

interface DimensionScoreCardProps {
	dimensionKey: string;
	dimensionName: string;
	score: number;
	percentile: number;
	level: string;
	color: string;
	facets: FacetInfo[];
	interpretation: string;
	className?: string;
}

export function DimensionScoreCard({
	dimensionKey,
	dimensionName,
	score,
	percentile,
	level,
	color,
	facets,
	interpretation,
	className,
}: DimensionScoreCardProps) {
	return (
		<div
			className={`rounded-2xl border p-5 ${className || ''}`}
			style={{ borderColor: withAlpha(color, 0.2), backgroundColor: withAlpha(color, 0.03) }}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div>
					<h4 className="font-display text-lg font-bold text-espresso">{dimensionName}</h4>
					<p className="text-xs mt-0.5" style={{ color }}>{level}</p>
				</div>
				<div className="text-right">
					<span className="font-display text-3xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
					<p className="text-[10px] text-warm-gray">/ 5.0</p>
				</div>
			</div>

			{/* Bell curve */}
			<div className="mb-4">
				<BellCurveChart
					score={score}
					color={color}
					label={dimensionName}
					percentile={percentile}
					width={320}
					height={120}
				/>
			</div>

			{/* Facet breakdown */}
			{facets.length > 0 && (
				<div className="mb-3">
					<p className="text-[10px] uppercase tracking-widest text-warm-gray/60 mb-2">Facet Breakdown</p>
					<FacetBarChart
						dimensionName={dimensionName}
						dimensionColor={color}
						facets={facets}
					/>
				</div>
			)}

			{/* Interpretation */}
			<p className="text-xs text-espresso/70 leading-relaxed mt-3 border-t pt-3" style={{ borderColor: withAlpha(color, 0.1) }}>
				{interpretation}
			</p>
		</div>
	);
}
