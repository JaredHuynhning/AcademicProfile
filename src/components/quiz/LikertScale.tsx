"use client";

import type { LikertScore } from "@/lib/types";

interface LikertScaleProps {
  value: LikertScore | null;
  onClick: (value: LikertScore) => void;
}

const LABELS: Partial<Record<LikertScore, string>> = {
  1: "Strongly Disagree",
  3: "Neutral",
  5: "Strongly Agree",
};

export function LikertScale({ value, onClick }: LikertScaleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 sm:gap-3">
        {([1, 2, 3, 4, 5] as LikertScore[]).map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              onClick={() => onClick(n)}
              className={[
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/40",
                selected
                  ? "bg-espresso text-cream border-espresso scale-105 shadow-md"
                  : "bg-white text-espresso border-warm-gray/30 hover:border-espresso/50 hover:bg-cream",
              ].join(" ")}
              aria-label={`${n} — ${LABELS[n] ?? ""}`}
              aria-pressed={selected}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex w-full justify-between px-0.5">
        {([1, 2, 3, 4, 5] as LikertScore[]).map((n) =>
          LABELS[n] ? (
            <span
              key={n}
              className="text-warm-gray text-center"
              style={{ fontSize: "10px", width: "3rem" }}
            >
              {LABELS[n]}
            </span>
          ) : (
            <span key={n} style={{ width: "3rem" }} />
          )
        )}
      </div>
    </div>
  );
}
