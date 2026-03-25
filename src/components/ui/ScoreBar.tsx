"use client";

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ScoreBar({ score, maxScore = 5, color = "#2c2417", label, sublabel }: ScoreBarProps) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <div className="flex items-center gap-3">
      {label && (
        <div className="min-w-[90px] text-right">
          <p className="text-xs font-medium text-espresso">{label}</p>
          {sublabel && <p className="text-[10px] text-warm-gray">{sublabel}</p>}
        </div>
      )}
      <div className="flex-1 h-2 rounded-full bg-warm-gray/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold text-espresso min-w-[28px] text-right">
        {score.toFixed(1)}
      </span>
    </div>
  );
}
