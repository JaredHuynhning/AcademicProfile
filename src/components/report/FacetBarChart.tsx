'use client';

import { withAlpha, lighten } from '@/lib/chart-geometry';

interface FacetData {
	name: string;
	score: number;
	description?: string;
}

interface FacetBarChartProps {
	dimensionName: string;
	dimensionColor: string;
	facets: FacetData[];
	maxScore?: number;
	className?: string;
}

export function FacetBarChart({
	dimensionName,
	dimensionColor,
	facets,
	maxScore = 5,
	className,
}: FacetBarChartProps) {
	const barHeight = 22;
	const labelWidth = 120;
	const scoreWidth = 40;
	const gap = 6;

	return (
		<div className={className}>
			<div className="space-y-1">
				{facets.map((facet, i) => {
					const pct = Math.max(2, (facet.score / maxScore) * 100);
					const isHigh = facet.score >= 3.5;
					const isLow = facet.score < 2.5;

					return (
						<div key={facet.name} className="flex items-center gap-2">
							<div className="min-w-[110px] text-right">
								<span className="text-xs text-espresso/80 leading-tight">
									{facet.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
								</span>
							</div>
							<div className="flex-1 relative h-[18px] rounded-full overflow-hidden" style={{ backgroundColor: withAlpha(dimensionColor, 0.08) }}>
								<div
									className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
									style={{
										width: `${pct}%`,
										backgroundColor: isHigh
											? dimensionColor
											: isLow
												? withAlpha(dimensionColor, 0.4)
												: withAlpha(dimensionColor, 0.7),
									}}
								/>
								{/* Average marker */}
								<div
									className="absolute top-0 bottom-0 w-px"
									style={{ left: '60%', backgroundColor: withAlpha('#2c2417', 0.15) }}
								/>
							</div>
							<span
								className="text-xs font-semibold min-w-[32px] text-right"
								style={{ color: dimensionColor }}
							>
								{facet.score.toFixed(1)}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
