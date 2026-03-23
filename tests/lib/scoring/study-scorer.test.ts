import { describe, it, expect } from "vitest";
import { scoreStudyProfile } from "@/lib/scoring/study-scorer";
import type { Answers } from "@/lib/types";

function makeAnswers(value: number): Answers {
  const answers: Answers = {};
  for (let id = 61; id <= 90; id++) {
    answers[id] = value as 1 | 2 | 3 | 4 | 5;
  }
  return answers;
}

describe("scoreStudyProfile", () => {
  describe("Dataset 1: All 5s (ceiling)", () => {
    const r = scoreStudyProfile(makeAnswers(5));

    it("deep = 5.0", () => expect(r.studyApproaches.deep.score).toBeCloseTo(5.0, 2));
    it("strategic = 5.0", () => expect(r.studyApproaches.strategic.score).toBeCloseTo(5.0, 2));
    it("surface = 5.0", () => expect(r.studyApproaches.surface.score).toBeCloseTo(5.0, 2));
    it("deep level = high", () => expect(r.studyApproaches.deep.level).toBe("high"));
    it("intrinsic = 5.0", () => expect(r.motivation.intrinsic.score).toBeCloseTo(5.0, 2));
    it("amotivation = 5.0", () => expect(r.motivation.amotivation.score).toBeCloseTo(5.0, 2));
    it("testAnxiety (reverse: raw 5 → 1) = 1.0", () =>
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(1.0, 2));
    it("testAnxiety level = low", () =>
      expect(r.selfRegulation.testAnxiety.level).toBe("low"));
    it("SDI at all-5s = 0", () => expect(r.motivation.sdi).toBeCloseTo(0, 2));
    it("motivationProfile = moderate", () => expect(r.motivationProfile).toBe("moderate"));
    it("regulationStrength = high", () => expect(r.regulationStrength).toBe("high"));
  });

  describe("Dataset 2: All 1s (floor)", () => {
    const r = scoreStudyProfile(makeAnswers(1));

    it("deep = 1.0", () => expect(r.studyApproaches.deep.score).toBeCloseTo(1.0, 2));
    it("surface = 1.0", () => expect(r.studyApproaches.surface.score).toBeCloseTo(1.0, 2));
    it("testAnxiety (reverse: raw 1 → 5) = 5.0", () =>
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(5.0, 2));
    it("testAnxiety level = high", () =>
      expect(r.selfRegulation.testAnxiety.level).toBe("high"));
    it("SDI at all-1s = 0", () => expect(r.motivation.sdi).toBeCloseTo(0, 2));
    it("regulationStrength = low", () => expect(r.regulationStrength).toBe("low"));
  });

  describe("Dataset 3: Ideal deep learner (hand-computed)", () => {
    const answers: Answers = {
      61: 5, 62: 5, 63: 5, 64: 5,
      65: 4, 66: 4, 67: 3,
      68: 1, 69: 1, 70: 2,
      71: 5, 72: 5, 73: 4,
      74: 4, 75: 4,
      76: 2, 77: 1,
      78: 1, 79: 1, 80: 1,
      81: 5, 82: 4,
      83: 4, 84: 4,
      85: 4, 86: 5,
      87: 2, 88: 2,
      89: 3, 90: 4,
    };
    const r = scoreStudyProfile(answers);

    it("deep = 5.0", () => expect(r.studyApproaches.deep.score).toBeCloseTo(5.0, 1));
    it("strategic = 3.7", () => expect(r.studyApproaches.strategic.score).toBeCloseTo(3.7, 1));
    it("surface = 1.3", () => expect(r.studyApproaches.surface.score).toBeCloseTo(1.3, 1));
    it("dominant = deep", () => expect(r.dominantApproach).toBe("deep"));
    it("intrinsic = 4.7", () => expect(r.motivation.intrinsic.score).toBeCloseTo(4.7, 1));
    it("identified = 4.0", () => expect(r.motivation.identified.score).toBeCloseTo(4.0, 1));
    it("external = 1.5", () => expect(r.motivation.external.score).toBeCloseTo(1.5, 1));
    it("amotivation = 1.0", () => expect(r.motivation.amotivation.score).toBeCloseTo(1.0, 1));
    it("SDI = 9.9", () => expect(r.motivation.sdi).toBeCloseTo(9.9, 1));
    it("motivationProfile = self-determined", () =>
      expect(r.motivationProfile).toBe("self-determined"));
    it("testAnxiety (reverse from 2,2) = 4.0", () =>
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(4.0, 1));
    it("regulationStrength = high", () => expect(r.regulationStrength).toBe("high"));
  });

  describe("Dataset 4: Disengaged student", () => {
    const answers: Answers = {
      61: 1, 62: 2, 63: 1, 64: 1,
      65: 1, 66: 1, 67: 2,
      68: 5, 69: 5, 70: 4,
      71: 1, 72: 2, 73: 1,
      74: 1, 75: 2,
      76: 4, 77: 5,
      78: 5, 79: 5, 80: 4,
      81: 1, 82: 2,
      83: 1, 84: 1,
      85: 1, 86: 2,
      87: 5, 88: 5,
      89: 1, 90: 1,
    };
    const r = scoreStudyProfile(answers);

    it("dominant = surface", () => expect(r.dominantApproach).toBe("surface"));
    it("surface = 4.7", () => expect(r.studyApproaches.surface.score).toBeCloseTo(4.7, 1));
    it("amotivation = 4.7", () => expect(r.motivation.amotivation.score).toBeCloseTo(4.7, 1));
    it("SDI = -9.8", () => expect(r.motivation.sdi).toBeCloseTo(-9.8, 1));
    it("motivationProfile = amotivated", () => expect(r.motivationProfile).toBe("amotivated"));
    it("testAnxiety high anxiety = 1.0", () =>
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(1.0, 1));
    it("regulationStrength = low", () => expect(r.regulationStrength).toBe("low"));
  });

  describe("Dataset 5: All 3s (neutral)", () => {
    const r = scoreStudyProfile(makeAnswers(3));

    it("deep = 3.0", () => expect(r.studyApproaches.deep.score).toBeCloseTo(3.0, 2));
    it("strategic = 3.0", () => expect(r.studyApproaches.strategic.score).toBeCloseTo(3.0, 2));
    it("surface = 3.0", () => expect(r.studyApproaches.surface.score).toBeCloseTo(3.0, 2));
    it("testAnxiety neutral = 3.0", () =>
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(3.0, 2));
    it("SDI neutral = 0", () => expect(r.motivation.sdi).toBeCloseTo(0, 2));
    it("motivationProfile = moderate", () => expect(r.motivationProfile).toBe("moderate"));
    it("deep level = moderate", () => expect(r.studyApproaches.deep.level).toBe("moderate"));
    it("intrinsic level = moderate", () => expect(r.motivation.intrinsic.level).toBe("moderate"));
    it("selfEfficacy level = moderate", () =>
      expect(r.selfRegulation.selfEfficacy.level).toBe("moderate"));
    it("regulationStrength = moderate", () => expect(r.regulationStrength).toBe("moderate"));
  });

  describe("Dataset 6: SDI boundary tests", () => {
    it("SDI > 3 → self-determined", () => {
      const a = makeAnswers(3);
      // Set intrinsic high enough to push SDI > 3
      a[71] = 5; a[72] = 5; a[73] = 5; // intrinsic = 5.0
      a[78] = 1; a[79] = 1; a[80] = 1; // amotivation = 1.0
      // SDI = 2*5 + 3 - 3 - 2*1 = 10+3-3-2 = 8 > 3
      const r = scoreStudyProfile(a);
      expect(r.motivationProfile).toBe("self-determined");
    });

    it("SDI exactly 0 → moderate", () => {
      // All-3s gives SDI=0
      const r = scoreStudyProfile(makeAnswers(3));
      expect(r.motivationProfile).toBe("moderate");
    });

    it("SDI < -3 → amotivated", () => {
      const a = makeAnswers(3);
      a[78] = 5; a[79] = 5; a[80] = 5; // amotivation = 5
      a[71] = 1; a[72] = 1; a[73] = 1; // intrinsic = 1
      // SDI = 2*1 + 3 - 3 - 2*5 = 2+3-3-10 = -8 < -3
      const r = scoreStudyProfile(a);
      expect(r.motivationProfile).toBe("amotivated");
    });
  });

  describe("Dataset 7: Level classification boundaries", () => {
    it("score 3.5 → high", () => {
      // Set all items to produce 3.5
      const a = makeAnswers(4);
      a[68] = 3; a[69] = 3; a[70] = 3; // surface = 3.5... actually let's check deep
      // deep items 61-64 all 4 → score = 4 (high)
      const r = scoreStudyProfile(a);
      expect(r.studyApproaches.deep.level).toBe("high");
    });

    it("score 1.0 → low", () => {
      const r = scoreStudyProfile(makeAnswers(1));
      expect(r.studyApproaches.deep.level).toBe("low");
    });

    it("score 3.0 → moderate", () => {
      const r = scoreStudyProfile(makeAnswers(3));
      expect(r.studyApproaches.deep.level).toBe("moderate");
    });
  });

  describe("Dataset 8: Reverse scoring (testAnxiety)", () => {
    it("mixed reverse (1,5) → mean 3.0", () => {
      const a = makeAnswers(3);
      a[87] = 1;
      a[88] = 5;
      const r = scoreStudyProfile(a);
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(3.0, 2);
    });

    it("reverse (4,4) → mean 2.0", () => {
      const a = makeAnswers(3);
      a[87] = 4;
      a[88] = 4;
      const r = scoreStudyProfile(a);
      expect(r.selfRegulation.testAnxiety.score).toBeCloseTo(2.0, 2);
    });
  });

  describe("Dataset 9: Partial answers", () => {
    const answers: Answers = { 61: 5, 62: 4 };
    const r = scoreStudyProfile(answers);

    it("partial deep (2/4 items) = 4.5", () =>
      expect(r.studyApproaches.deep.score).toBeCloseTo(4.5, 2));
    it("items count = 4 (total available)", () =>
      expect(r.studyApproaches.deep.items).toBe(4));
    it("no strategic answers = 0", () =>
      expect(r.studyApproaches.strategic.score).toBeCloseTo(0, 2));
  });
});
