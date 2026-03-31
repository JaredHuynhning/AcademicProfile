'use client';
import type { DimensionDetail, InteractionInsight } from '@/lib/report';
import { Card } from '@/components/ui/Card';

interface Props {
  dimensionDetails: DimensionDetail[];
  topInteraction?: InteractionInsight;
}

export function StrengthBarrierSummary({ dimensionDetails, topInteraction }: Props) {
  const sorted = [...dimensionDetails].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const barriers = [...dimensionDetails].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
      {topInteraction && (
        <div className="col-span-full">
          <Card className="bg-amber-50 border-amber-200 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-1">Key Interaction</p>
            <p className="text-sm font-medium text-amber-900">{topInteraction.label}</p>
            <p className="text-xs text-amber-800 mt-1">{topInteraction.insight.substring(0, 200)}{topInteraction.insight.length > 200 ? '...' : ''}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
