'use client';

import { withAlpha } from '@/lib/chart-geometry';

interface SubjectFit {
	subject: string;
	alignment: number; // 0-5
	passion?: number;
	confidence?: number;
	category: 'Excellent' | 'Good' | 'Challenging';
}

interface SubjectFitMatrixProps {
	subjects: SubjectFit[];
	className?: string;
}

const categoryColors: Record<string, string> = {
	Excellent: '#4a7c59',
	Good: '#8a7e6b',
	Challenging: '#c17f59',
};

export function SubjectFitMatrix({ subjects, className }: SubjectFitMatrixProps) {
	const sorted = [...subjects].sort((a, b) => b.alignment - a.alignment);
	const maxVal = 5;

	return (
		<div className={className}>
			<div className="space-y-2">
				{sorted.map((subj) => {
					const pct = (subj.alignment / maxVal) * 100;
					const color = categoryColors[subj.category] || '#8a7e6b';

					return (
						<div key={subj.subject} className="group">
							<div className="flex items-center gap-3">
								<div className="min-w-[100px] text-right">
									<span className="text-xs font-medium text-espresso">{subj.subject}</span>
								</div>
								<div className="flex-1 relative h-6 rounded-lg overflow-hidden bg-warm-gray/5">
									{/* Fill bar */}
									<div
										className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
										style={{
											width: `${Math.max(15, pct)}%`,
											backgroundColor: withAlpha(color, 0.8),
										}}
									>
										<span className="text-[10px] font-semibold text-white/90">{subj.alignment.toFixed(1)}</span>
									</div>
								</div>
								<span
									className="text-[10px] font-medium min-w-[70px]"
									style={{ color }}
								>
									{subj.category}
								</span>
							</div>
							{/* Passion/confidence mini-bars */}
							{(subj.passion != null || subj.confidence != null) && (
								<div className="flex gap-4 ml-[112px] mt-1 mb-1">
									{subj.passion != null && (
										<div className="flex items-center gap-1.5">
											<span className="text-[9px] text-warm-gray/50 min-w-[50px]">Passion</span>
											<div className="w-16 h-1.5 rounded-full bg-warm-gray/5 overflow-hidden">
												<div
													className="h-full rounded-full"
													style={{ width: `${(subj.passion / 5) * 100}%`, backgroundColor: withAlpha(color, 0.5) }}
												/>
											</div>
											<span className="text-[9px] text-warm-gray/50">{subj.passion.toFixed(1)}</span>
										</div>
									)}
									{subj.confidence != null && (
										<div className="flex items-center gap-1.5">
											<span className="text-[9px] text-warm-gray/50 min-w-[50px]">Confidence</span>
											<div className="w-16 h-1.5 rounded-full bg-warm-gray/5 overflow-hidden">
												<div
													className="h-full rounded-full"
													style={{ width: `${(subj.confidence / 5) * 100}%`, backgroundColor: withAlpha(color, 0.3) }}
												/>
											</div>
											<span className="text-[9px] text-warm-gray/50">{subj.confidence.toFixed(1)}</span>
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
			{/* Legend */}
			<div className="flex gap-4 justify-center mt-4">
				{['Excellent', 'Good', 'Challenging'].map((cat) => (
					<div key={cat} className="flex items-center gap-1.5">
						<div className="w-3 h-3 rounded-sm" style={{ backgroundColor: withAlpha(categoryColors[cat], 0.8) }} />
						<span className="text-[10px] text-warm-gray/60">{cat}</span>
					</div>
				))}
			</div>
		</div>
	);
}
