"use client";

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  showBenchmark?: boolean;
  benchmarkValue?: number;
  interpretLabel?: string;
}

export function ScoreBar({
  score,
  maxScore = 5,
  color = "#2c2417",
  label,
  sublabel,
  showBenchmark,
  benchmarkValue = 3.0,
  interpretLabel,
}: ScoreBarProps) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const benchPct = Math.min(100, Math.max(0, (benchmarkValue / maxScore) * 100));

  return (
    <div>
      <div className="flex items-center gap-3">
        {label && (
          <div className="min-w-[90px] text-right">
            <p className="text-xs font-medium text-espresso">{label}</p>
            {sublabel && <p className="text-[10px] text-warm-gray">{sublabel}</p>}
          </div>
        )}
        <div className="relative flex-1 h-2 rounded-full bg-warm-gray/10 overflow-visible">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
          {showBenchmark && (
            <div
              className="absolute -top-0.5 w-px h-3 bg-warm-gray/40"
              style={{ left: `${benchPct}%` }}
            >
              <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[9px] text-warm-gray/50 whitespace-nowrap">
                Avg
              </span>
            </div>
          )}
        </div>
        <span className="text-xs font-semibold text-espresso min-w-[28px] text-right">
          {score.toFixed(1)}
        </span>
      </div>
      {interpretLabel && (
        <p className={`text-[10px] text-warm-gray/70 mt-0.5 ${label ? "ml-[102px]" : ""}`}>
          {interpretLabel}
        </p>
      )}
    </div>
  );
}
