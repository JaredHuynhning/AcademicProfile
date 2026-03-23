/**
 * Frontend scorer for the 30 study/motivation/self-regulation items (IDs 61-90).
 * No backend involved — all scoring happens client-side.
 *
 * Based on: ASSIST (Entwistle), AMS (Vallerand), MSLQ (Pintrich), MES (Martin)
 */

import { studyItems } from "@/lib/data/study-items";
import type { Answers, ClassifyLevel, SubscaleScore, StudyProfile } from "@/lib/types";

function classifyLevel(score: number): ClassifyLevel {
  if (score >= 3.5) return "high";
  if (score >= 2.5) return "moderate";
  return "low";
}

function scoreSubscale(answers: Answers, domain: string, subscale: string): SubscaleScore {
  const items = studyItems.filter((i) => i.domain === domain && i.subscale === subscale);
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

/**
 * Compute the Self-Determination Index (SDI).
 * Formula: 2×intrinsic + identified - external - 2×amotivation
 * Range: roughly -12 to +15
 *   > 3  → self-determined
 *   0-3  → moderate
 *  -3-0  → controlled
 *   <-3  → amotivated
 */
function computeSDI(
  intrinsicScore: number,
  identifiedScore: number,
  externalScore: number,
  amotivationScore: number
): number {
  return (
    Math.round(
      (2 * intrinsicScore + identifiedScore - externalScore - 2 * amotivationScore) * 10
    ) / 10
  );
}

function classifyMotivationProfile(
  sdi: number
): "self-determined" | "moderate" | "controlled" | "amotivated" {
  if (sdi > 3) return "self-determined";
  if (sdi >= 0) return "moderate";
  if (sdi >= -3) return "controlled";
  return "amotivated";
}

function classifyRegulationStrength(
  efficacy: number,
  planning: number,
  effort: number
): ClassifyLevel {
  const mean = Math.round(((efficacy + planning + effort) / 3) * 10) / 10;
  return classifyLevel(mean);
}

export function scoreStudyProfile(answers: Answers): StudyProfile {
  // Domain 1: Study Approaches
  const deep = scoreSubscale(answers, "studyApproaches", "deep");
  const strategic = scoreSubscale(answers, "studyApproaches", "strategic");
  const surface = scoreSubscale(answers, "studyApproaches", "surface");

  // Domain 2: Motivation
  const intrinsic = scoreSubscale(answers, "motivation", "intrinsic");
  const identified = scoreSubscale(answers, "motivation", "identified");
  const external = scoreSubscale(answers, "motivation", "external");
  const amotivation = scoreSubscale(answers, "motivation", "amotivation");

  const sdi = computeSDI(intrinsic.score, identified.score, external.score, amotivation.score);

  // Domain 3: Self-Regulation
  const selfEfficacy = scoreSubscale(answers, "selfRegulation", "selfEfficacy");
  const planning = scoreSubscale(answers, "selfRegulation", "planning");
  const effortRegulation = scoreSubscale(answers, "selfRegulation", "effortRegulation");
  const testAnxiety = scoreSubscale(answers, "selfRegulation", "testAnxiety");
  const helpSeeking = scoreSubscale(answers, "selfRegulation", "helpSeeking");

  // Derived
  const approaches = { deep, strategic, surface };
  const dominantApproach = Object.entries(approaches).sort(
    ([, a], [, b]) => b.score - a.score
  )[0][0] as "deep" | "strategic" | "surface";

  const motivationProfile = classifyMotivationProfile(sdi);
  const regulationStrength = classifyRegulationStrength(
    selfEfficacy.score,
    planning.score,
    effortRegulation.score
  );

  return {
    studyApproaches: { deep, strategic, surface },
    motivation: { intrinsic, identified, external, amotivation, sdi },
    selfRegulation: { selfEfficacy, planning, effortRegulation, testAnxiety, helpSeeking },
    dominantApproach,
    motivationProfile,
    regulationStrength,
  };
}
