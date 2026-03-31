'use client';

import { HexacoRadarChart } from './HexacoRadarChart';
import { withAlpha } from '@/lib/chart-geometry';
import { Card } from '@/components/ui/Card';
import type { DimensionDetail, InteractionInsight } from '@/lib/report';
import type { Action } from '@/lib/report/mega-sections';

interface ProfileDashboardProps {
	studentName: string;
	archetype: string;
	radarData: { label: string; value: number; color: string }[];
	dimensionDetails: DimensionDetail[];
	mantra: string;
	primaryAction: Action;
	topInteraction?: InteractionInsight;
}

export function ProfileDashboard({
	studentName,
	archetype,
	radarData,
	dimensionDetails,
	mantra,
	primaryAction,
	topInteraction,
}: ProfileDashboardProps) {
	const sorted = [...dimensionDetails].sort((a, b) => b.score - a.score);
	const strengths = sorted.slice(0, 3);
	const barriers = [...dimensionDetails].sort((a, b) => a.score - b.score).slice(0, 3);
	const firstName = studentName.split(' ')[0];

	return (
		<div className="space-y-6 mb-10">
			{/* ── Row 1: Identity + Radar ─────────────────────────────────── */}
			<div className="bg-white/60 rounded-2xl border border-warm-gray/10 p-6 md:p-8">
				<div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
					<div className="flex-shrink-0 flex flex-col items-center">
						<HexacoRadarChart data={radarData} size={260} />
					</div>
					<div className="flex-1 min-w-0 text-center md:text-left">
						<h3 className="font-display text-lg font-bold text-espresso mb-1">
							{studentName}&rsquo;s Profile at a Glance
						</h3>
						<p className="text-sm text-espresso/50 italic mb-5">{archetype}</p>

						{/* Dimension tags — compact overview */}
						<div className="flex flex-wrap justify-center md:justify-start gap-2">
							{sorted.map((d) => (
								<div
									key={d.key}
									className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
									style={{ borderColor: withAlpha(d.color, 0.25), backgroundColor: withAlpha(d.color, 0.04) }}
								>
									<div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
									<span className="text-xs font-medium" style={{ color: d.color }}>
										{d.name.split(' ')[0]}
									</span>
									<span className="text-xs font-bold" style={{ color: d.color }}>
										{d.score.toFixed(1)}
									</span>
									<span className="text-[10px] text-warm-gray/40">
										P{d.percentile}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ── Row 2: Mantra + Primary Action ──────────────────────────── */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="!p-6 bg-espresso text-white border-none relative overflow-hidden">
					<div className="relative z-10">
						<p className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 mb-2">The Mantra</p>
						<h2 className="font-display text-2xl font-bold leading-tight mb-4">&ldquo;{mantra}&rdquo;</h2>
						<p className="text-white/70 text-sm leading-relaxed italic">
							A guiding principle tailored for {firstName}&rsquo;s specific profile.
						</p>
					</div>
					<div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
				</Card>

				<Card className="!p-6 border-2 border-espresso/5 bg-white">
					<p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-3">Top Priority Action</p>
					<div className="flex gap-4">
						<div className="w-10 h-10 rounded-full bg-espresso text-white flex items-center justify-center shrink-0 font-bold">1</div>
						<div>
							<h3 className="font-bold text-espresso mb-1">{primaryAction.title}</h3>
							<p className="text-espresso/70 text-sm leading-relaxed">{primaryAction.description}</p>
						</div>
					</div>
				</Card>
			</div>

			{/* ── Row 3: Strengths + Focus Areas ──────────────────────────── */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<p className="text-xs uppercase tracking-widest text-green-600 font-semibold mb-3">Top Strengths</p>
					<div className="flex flex-col gap-2">
						{strengths.map((d) => (
							<Card key={d.key} className="border-l-[3px] border-l-green-500 bg-green-50/50 p-3">
								<p className="font-semibold text-sm">{d.name}</p>
								<p className="text-xs text-warm-gray">{d.score.toFixed(1)}/5 &middot; {d.percentile}th percentile</p>
								{d.superpower && <p className="text-xs text-espresso/80 mt-1">{d.superpower}</p>}
							</Card>
						))}
					</div>
				</div>
				<div>
					<p className="text-xs uppercase tracking-widest text-red-600 font-semibold mb-3">Focus Areas</p>
					<div className="flex flex-col gap-2">
						{barriers.map((d) => (
							<Card key={d.key} className="border-l-[3px] border-l-red-500 bg-red-50/50 p-3">
								<p className="font-semibold text-sm">{d.name}</p>
								<p className="text-xs text-warm-gray">{d.score.toFixed(1)}/5 &middot; {d.percentile}th percentile</p>
								{d.style && <p className="text-xs text-espresso/80 mt-1">{d.style}</p>}
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* ── Row 4: Key Interaction ──────────────────────────────────── */}
			{topInteraction && (
				<Card className="bg-amber-50 border-amber-200 p-4 text-center">
					<p className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-1">Key Interaction</p>
					<p className="text-sm font-medium text-amber-900">{topInteraction.label}</p>
					<p className="text-xs text-amber-800 mt-1">
						{topInteraction.insight.substring(0, 200)}{topInteraction.insight.length > 200 ? '...' : ''}
					</p>
				</Card>
			)}
		</div>
	);
}
