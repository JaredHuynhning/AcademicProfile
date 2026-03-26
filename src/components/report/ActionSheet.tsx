"use client";

import {
  parseTopAction,
  parseQuickWin,
  parseStopDoing,
  parseWeeklyRhythm,
} from "@/lib/report/action-sheet-parser";

export interface ActionSheetProps {
  data: {
    topActions: Array<{ rank: number; description: string }>;
    quickWins: Array<{ description: string }>;
    studyPrescription: { method: string; rationale: string };
    stopDoing: Array<{ description: string }>;
    weeklyRhythm: { description: string };
  };
  studentName: string;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2.5 border-b border-warm-gray/15 pb-1">
      {children}
    </div>
  );
}

export function ActionSheet({ data, studentName }: ActionSheetProps) {
  const actions = data.topActions.map((a) => ({
    rank: a.rank,
    ...parseTopAction(a.description),
  }));
  const quickWins = data.quickWins.map((q) => parseQuickWin(q.description));
  const stopItems = data.stopDoing.map((s) => parseStopDoing(s.description));
  const rhythm = parseWeeklyRhythm(data.weeklyRhythm.description);

  return (
    <div className="relative border-2 border-dashed border-warm-gray rounded-xl bg-gradient-to-br from-[#faf5eb] to-[#f7f0e3] p-7">
      <span className="absolute -top-3 left-5 bg-[#faf5eb] px-2 text-base">✂️</span>

      <div className="text-center mb-6 pt-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-warm-gray">What To Do Monday</p>
        <h3 className="font-display text-xl font-extrabold text-espresso mt-1">Your Action Plan</h3>
        <p className="text-xs text-warm-gray mt-1">
          Personalised for <strong className="text-espresso">{studentName}</strong> — based on your HEXACO profile
        </p>
      </div>

      <div className="mb-5">
        <SectionLabel>Priority Actions</SectionLabel>
        <div className="space-y-3">
          {actions.map((a) => (
            <div key={a.rank} className="flex gap-2.5 items-start">
              <span className="w-7 h-7 rounded-full bg-espresso text-cream flex items-center justify-center font-bold text-sm shrink-0">{a.rank}</span>
              <div>
                <p className="font-bold text-[13px] text-espresso leading-snug">{a.action}</p>
                {a.why && <p className="text-[11px] text-warm-gray mt-0.5 leading-relaxed">Why: {a.why}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <SectionLabel>Study Prescription</SectionLabel>
        <div className="border-l-[3px] border-espresso pl-3.5">
          <p className="font-bold text-[15px] text-espresso">{data.studyPrescription.method}</p>
          <p className="text-xs text-warm-gray mt-1 leading-relaxed">{data.studyPrescription.rationale}</p>
        </div>
      </div>

      {quickWins.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Quick Wins</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickWins.map((q, i) => (
              <div key={i} className="bg-white/60 rounded-lg px-3 py-2.5 text-[11px] text-espresso leading-relaxed">
                <span className="text-[#7a8a5e] font-bold mr-1.5">✓</span>{q.action}
              </div>
            ))}
          </div>
        </div>
      )}

      {stopItems.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Stop Doing</SectionLabel>
          <div className="space-y-1.5 text-xs leading-relaxed">
            {stopItems.map((s, i) => (
              <p key={i}>
                🚫 <span className="line-through text-warm-gray">{s.stop}</span>
                {s.instead && <span className="text-espresso"> — instead, {s.instead}</span>}
              </p>
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionLabel>Weekly Rhythm</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {rhythm.weekday && (
            <div className="bg-white/60 rounded-lg px-3 py-2.5">
              <p className="font-bold text-espresso mb-1">Mon — Fri</p>
              <p className="text-espresso/80 leading-relaxed">{rhythm.weekday}</p>
            </div>
          )}
          {rhythm.weekend && (
            <div className="bg-white/60 rounded-lg px-3 py-2.5">
              <p className="font-bold text-espresso mb-1">Weekend</p>
              <p className="text-espresso/80 leading-relaxed">{rhythm.weekend}</p>
            </div>
          )}
        </div>
        {rhythm.closing && (
          <p className="text-center text-[11px] text-warm-gray italic mt-2.5">{rhythm.closing}</p>
        )}
      </div>
    </div>
  );
}
