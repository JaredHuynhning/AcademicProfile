/**
 * Frontend scorer for the 30 learner profile items (IDs 91-120).
 * No backend involved — all scoring happens client-side.
 *
 * Based on: Grit-S (Duckworth), ASRS/APS-S, SVS (Ryan & Frederick),
 * TIMSS (IEA), MMCS attribution theory
 */

import { learnerItems } from "@/lib/data/learner-items";
import type { Answers, ClassifyLevel, SubscaleScore, LearnerProfile } from "@/lib/types";

function classifyLevel(score: number): ClassifyLevel {
  if (score >= 3.5) return "high";
  if (score >= 2.5) return "moderate";
  return "low";
}

function scoreSubscale(answers: Answers, domain: string, subscale: string): SubscaleScore {
  const items = learnerItems.filter((i) => i.domain === domain && i.subscale === subscale);
  if (items.length === 0) return { score: 0, level: "low", items: 0 };

  let total = 0;
  let count = 0;

  for (const item of items) {
    const raw = answers[item.id];
    if (raw === undefined) continue;
    total += item.reverse ? 6 - raw : raw;
    count++;
  }

  if (count === 0) return { score: 0, level: "low", items: items.length };

  const score = Math.round((total / count) * 10) / 10;
  return { score, level: classifyLevel(score), items: items.length };
}

function singleItemScore(answers: Answers, domain: string, subscale: string): number {
  const items = learnerItems.filter((i) => i.domain === domain && i.subscale === subscale);
  if (items.length === 0) return 0;
  const raw = answers[items[0].id];
  if (raw === undefined) return 0;
  return items[0].reverse ? 6 - raw : raw;
}

function classifyAlignment(
  passion: number,
  confidence: number
): "aligned" | "passion-gap" | "confidence-gap" | "disengaged" {
  const highPassion = passion >= 3.5;
  const highConfidence = confidence >= 3.5;
  if (highPassion && highConfidence) return "aligned";
  if (!highPassion && highConfidence) return "passion-gap";
  if (highPassion && !highConfidence) return "confidence-gap";
  return "disengaged";
}

function classifyTeacherProfile(
  structure: number,
  warmth: number
): "warm-structured" | "warm-flexible" | "firm-structured" | "firm-flexible" {
  const highStructure = structure >= 3.5;
  const highWarmth = warmth >= 3.5;
  if (highWarmth && highStructure) return "warm-structured";
  if (highWarmth && !highStructure) return "warm-flexible";
  if (!highWarmth && highStructure) return "firm-structured";
  return "firm-flexible";
}

function classifyResponseType(
  carrot: number,
  stick: number
): "encouragement" | "accountability" | "balanced" {
  const diff = carrot - stick;
  if (diff >= 1) return "encouragement";
  if (diff <= -1) return "accountability";
  return "balanced";
}

function classifyPrimaryBarrier(
  preparation: number,
  external: number,
  anxiety: number,
  timeManagement: number
): "preparation" | "anxiety" | "time-management" | "external-blame" | "none" {
  const barriers = [
    { key: "anxiety" as const, score: anxiety },
    { key: "time-management" as const, score: timeManagement },
    { key: "external-blame" as const, score: external },
  ];

  const topBarrier = barriers.sort((a, b) => b.score - a.score)[0];

  if (topBarrier.score < 3) {
    if (preparation < 2.5) return "preparation";
    return "none";
  }

  return topBarrier.key;
}

export function scoreLearnerProfile(answers: Answers): LearnerProfile {
  // Domain 4: Grit
  const perseverance = scoreSubscale(answers, "grit", "perseverance");
  const consistency = scoreSubscale(answers, "grit", "consistency");
  const gritOverall = {
    score: Math.round(((perseverance.score + consistency.score) / 2) * 10) / 10,
    level: classifyLevel((perseverance.score + consistency.score) / 2),
    items: 0,
  };

  // Domain 5: Focus & Procrastination
  const concentration = scoreSubscale(answers, "focus", "concentration");
  const procrastination = scoreSubscale(answers, "focus", "procrastination");

  // Domain 6: Energy
  const vitality = scoreSubscale(answers, "energy", "vitality");
  const depletion = scoreSubscale(answers, "energy", "depletion");
  const netEnergy = {
    score: Math.round(((vitality.score + depletion.score) / 2) * 10) / 10,
    level: classifyLevel((vitality.score + depletion.score) / 2),
    items: 0,
  };

  // Domain 7: Subject Fit
  const mathsPassion = singleItemScore(answers, "subjectFit", "mathsPassion");
  const mathsConfidence = singleItemScore(answers, "subjectFit", "mathsConfidence");
  const englishPassion = singleItemScore(answers, "subjectFit", "englishPassion");
  const englishConfidence = singleItemScore(answers, "subjectFit", "englishConfidence");
  const sciencePassion = singleItemScore(answers, "subjectFit", "sciencePassion");
  const scienceConfidence = singleItemScore(answers, "subjectFit", "scienceConfidence");

  // Domain 8: Teacher Preference
  const structureScore = singleItemScore(answers, "teacherPreference", "structure");
  const warmthScore = singleItemScore(answers, "teacherPreference", "warmth");
  const carrotScore = singleItemScore(answers, "teacherPreference", "carrot");
  const stickScore = singleItemScore(answers, "teacherPreference", "stick");

  // Domain 9: Exam Barriers
  const preparationScore = singleItemScore(answers, "examBarriers", "preparation");
  const externalScore = singleItemScore(answers, "examBarriers", "external");
  const anxietyScore = singleItemScore(answers, "examBarriers", "anxiety");
  const timeMgmtScore = singleItemScore(answers, "examBarriers", "timeManagement");

  return {
    grit: {
      perseverance,
      consistency,
      overall: gritOverall,
    },
    focus: {
      concentration,
      procrastination,
    },
    energy: {
      vitality,
      depletion,
      netEnergy,
    },
    subjectFit: {
      maths: {
        passion: mathsPassion,
        confidence: mathsConfidence,
        alignment: classifyAlignment(mathsPassion, mathsConfidence),
      },
      english: {
        passion: englishPassion,
        confidence: englishConfidence,
        alignment: classifyAlignment(englishPassion, englishConfidence),
      },
      science: {
        passion: sciencePassion,
        confidence: scienceConfidence,
        alignment: classifyAlignment(sciencePassion, scienceConfidence),
      },
    },
    teacherPreference: {
      structure: structureScore,
      warmth: warmthScore,
      profile: classifyTeacherProfile(structureScore, warmthScore),
      carrot: carrotScore,
      stick: stickScore,
      responseType: classifyResponseType(carrotScore, stickScore),
    },
    examBarriers: {
      preparation: preparationScore,
      external: externalScore,
      anxiety: anxietyScore,
      timeManagement: timeMgmtScore,
      primaryBarrier: classifyPrimaryBarrier(
        preparationScore,
        externalScore,
        anxietyScore,
        timeMgmtScore
      ),
    },
  };
}
