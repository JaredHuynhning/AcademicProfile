'use client';

import { HexacoRadarChart } from './HexacoRadarChart';
import { withAlpha } from '@/lib/chart-geometry';
import type { DimensionDetail } from '@/lib/report';

interface ProfileAtAGlanceProps {
	studentName: string;
	archetype: string;
	radarData: { label: string; value: number; color: string }[];
	dimensionDetails: DimensionDetail[];
	topStrength?: string;
	topBarrier?: string;
}

export function ProfileAtAGlance({
	studentName,
	archetype,
	radarData,
	dimensionDetails,
	topStrength,
	topBarrier,
}: ProfileAtAGlanceProps) {
	const sorted = [...dimensionDetails].sort((a, b) => b.score - a.score);
	const top3 = sorted.slice(0, 3);
	const bottom3 = sorted.slice(-3).reverse();

	return (
		<div className="bg-white/60 rounded-2xl border border-warm-gray/10 p-6 md:p-8 mb-10">
			{/* Header row */}
			<div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
				{/* Left: radar + archetype */}
				<div className="flex-shrink-0 flex flex-col items-center">
					<HexacoRadarChart data={radarData} size={260} />
					<p className="text-sm text-espresso/50 italic mt-2">{archetype}</p>
				</div>

				{/* Right: key numbers + strengths/barriers */}
				<div className="flex-1 min-w-0">
					<h3 className="font-display text-lg font-bold text-espresso mb-4">
						{studentName}&rsquo;s Profile at a Glance
					</h3>

					{/* Top strengths */}
					<div className="mb-4">
						<p className="text-[10px] uppercase tracking-widest text-warm-gray/50 mb-2">Top Strengths</p>
						<div className="flex flex-wrap gap-2">
							{top3.map((d) => (
								<div
									key={d.key}
									className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
									style={{ borderColor: withAlpha(d.color, 0.3), backgroundColor: withAlpha(d.color, 0.05) }}
								>
									<div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
									<span className="text-xs font-medium" style={{ color: d.color }}>
										{d.name.split(' ')[0]}
									</span>
									<span className="text-xs font-bold" style={{ color: d.color }}>
										{d.score.toFixed(1)}
									</span>
									<span className="text-[10px] text-warm-gray/40">
										top {100 - d.percentile}%
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Growth areas */}
					<div className="mb-4">
						<p className="text-[10px] uppercase tracking-widest text-warm-gray/50 mb-2">Growth Areas</p>
						<div className="flex flex-wrap gap-2">
							{bottom3.map((d) => (
								<div
									key={d.key}
									className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-warm-gray/15 bg-warm-gray/[0.02]"
								>
									<span className="text-xs text-espresso/60">
										{d.name.split(' ')[0]}
									</span>
									<span className="text-xs font-bold text-espresso/70">
										{d.score.toFixed(1)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Key insight callouts */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{topStrength && (
							<div className="p-3 rounded-lg bg-green-50/50 border border-green-200/30">
								<p className="text-[10px] uppercase tracking-widest text-green-600/60 mb-1">Top Strength</p>
								<p className="text-xs text-espresso/80 leading-relaxed">{topStrength}</p>
							</div>
						)}
						{topBarrier && (
							<div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/30">
								<p className="text-[10px] uppercase tracking-widest text-amber-600/60 mb-1">Priority Barrier</p>
								<p className="text-xs text-espresso/80 leading-relaxed">{topBarrier}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
