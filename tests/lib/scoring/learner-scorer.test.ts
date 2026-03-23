import { describe, it, expect } from "vitest";
import { scoreLearnerProfile } from "@/lib/scoring/learner-scorer";
import type { Answers } from "@/lib/types";

function makeAnswers(defaultValue: number): Answers {
  const answers: Answers = {};
  for (let id = 91; id <= 120; id++) {
    answers[id] = defaultValue as 1 | 2 | 3 | 4 | 5;
  }
  return answers;
}

describe("scoreLearnerProfile", () => {
  describe("Dataset 1: All 5s (ceiling)", () => {
    const result = scoreLearnerProfile(makeAnswers(5));

    it("perseverance ceiling = 5.0", () => {
      expect(result.grit.perseverance.score).toBeCloseTo(5.0, 1);
    });

    it("consistency ceiling (reversed) = 1.0", () => {
      expect(result.grit.consistency.score).toBeCloseTo(1.0, 1);
    });

    it("grit overall ceiling = 3.0", () => {
      expect(result.grit.overall.score).toBeCloseTo(3.0, 1);
    });

    it("concentration ceiling (2 reverse + 1 forward) = 2.3", () => {
      expect(result.focus.concentration.score).toBeCloseTo(2.3, 1);
    });

    it("procrastination ceiling (all reverse) = 1.0", () => {
      expect(result.focus.procrastination.score).toBeCloseTo(1.0, 1);
    });

    it("vitality ceiling = 5.0", () => {
      expect(result.energy.vitality.score).toBeCloseTo(5.0, 1);
    });

    it("depletion ceiling (reversed) = 1.0", () => {
      expect(result.energy.depletion.score).toBeCloseTo(1.0, 1);
    });

    it("net energy ceiling = 3.0", () => {
      expect(result.energy.netEnergy.score).toBeCloseTo(3.0, 1);
    });

    it("maths passion ceiling = 5", () => {
      expect(result.subjectFit.maths.passion).toBe(5);
    });

    it("maths alignment ceiling = aligned", () => {
      expect(result.subjectFit.maths.alignment).toBe("aligned");
    });

    it("teacher profile ceiling = warm-structured", () => {
      expect(result.teacherPreference.profile).toBe("warm-structured");
    });

    it("response type ceiling = balanced", () => {
      expect(result.teacherPreference.responseType).toBe("balanced");
    });

    it("barrier ceiling = anxiety (highest score when tied)", () => {
      expect(result.examBarriers.primaryBarrier).toBe("anxiety");
    });
  });

  describe("Dataset 2: All 1s (floor)", () => {
    const result = scoreLearnerProfile(makeAnswers(1));

    it("perseverance floor = 1.0", () => {
      expect(result.grit.perseverance.score).toBeCloseTo(1.0, 1);
    });

    it("consistency floor (reversed) = 5.0", () => {
      expect(result.grit.consistency.score).toBeCloseTo(5.0, 1);
    });

    it("grit overall floor = 3.0", () => {
      expect(result.grit.overall.score).toBeCloseTo(3.0, 1);
    });

    it("concentration floor (2 reverse + 1 forward) = 3.7", () => {
      expect(result.focus.concentration.score).toBeCloseTo(3.7, 1);
    });

    it("procrastination floor (all reversed) = 5.0", () => {
      expect(result.focus.procrastination.score).toBeCloseTo(5.0, 1);
    });

    it("vitality floor = 1.0", () => {
      expect(result.energy.vitality.score).toBeCloseTo(1.0, 1);
    });

    it("depletion floor (reversed) = 5.0", () => {
      expect(result.energy.depletion.score).toBeCloseTo(5.0, 1);
    });

    it("maths alignment floor = disengaged", () => {
      expect(result.subjectFit.maths.alignment).toBe("disengaged");
    });

    it("teacher profile floor = firm-flexible", () => {
      expect(result.teacherPreference.profile).toBe("firm-flexible");
    });
  });

  describe("Dataset 3: Gritty focused student", () => {
    const answers = makeAnswers(3);
    answers[91] = 5; answers[92] = 5; answers[93] = 5;
    answers[94] = 1; answers[95] = 1; answers[96] = 1;
    answers[97] = 1; answers[98] = 5; answers[99] = 1;
    answers[100] = 1; answers[101] = 1; answers[102] = 1;
    const result = scoreLearnerProfile(answers);

    it("gritty perseverance = 5.0", () => {
      expect(result.grit.perseverance.score).toBeCloseTo(5.0, 1);
    });

    it("gritty consistency = 5.0", () => {
      expect(result.grit.consistency.score).toBeCloseTo(5.0, 1);
    });

    it("gritty overall = 5.0", () => {
      expect(result.grit.overall.score).toBeCloseTo(5.0, 1);
    });

    it("gritty level = high", () => {
      expect(result.grit.overall.level).toBe("high");
    });

    it("gritty concentration = 5.0", () => {
      expect(result.focus.concentration.score).toBeCloseTo(5.0, 1);
    });

    it("gritty no-procrastination = 5.0", () => {
      expect(result.focus.procrastination.score).toBeCloseTo(5.0, 1);
    });
  });

  describe("Dataset 4: Subject fit alignments", () => {
    const answers = makeAnswers(3);
    answers[107] = 4; answers[108] = 5;
    answers[109] = 2; answers[110] = 4;
    answers[111] = 5; answers[112] = 2;
    const result = scoreLearnerProfile(answers);

    it("maths = aligned", () => {
      expect(result.subjectFit.maths.alignment).toBe("aligned");
    });

    it("english = passion-gap", () => {
      expect(result.subjectFit.english.alignment).toBe("passion-gap");
    });

    it("science = confidence-gap", () => {
      expect(result.subjectFit.science.alignment).toBe("confidence-gap");
    });
  });

  describe("Dataset 5: Teacher preference profiles", () => {
    it("warm-structured: structure=4, warmth=4", () => {
      const a = makeAnswers(3);
      a[113] = 4; a[114] = 4;
      expect(scoreLearnerProfile(a).teacherPreference.profile).toBe("warm-structured");
    });

    it("warm-flexible: structure=2, warmth=5", () => {
      const a = makeAnswers(3);
      a[113] = 2; a[114] = 5;
      expect(scoreLearnerProfile(a).teacherPreference.profile).toBe("warm-flexible");
    });

    it("firm-structured: structure=5, warmth=2", () => {
      const a = makeAnswers(3);
      a[113] = 5; a[114] = 2;
      expect(scoreLearnerProfile(a).teacherPreference.profile).toBe("firm-structured");
    });

    it("firm-flexible: structure=2, warmth=2", () => {
      const a = makeAnswers(3);
      a[113] = 2; a[114] = 2;
      expect(scoreLearnerProfile(a).teacherPreference.profile).toBe("firm-flexible");
    });
  });

  describe("Dataset 6: Response types", () => {
    it("encouragement: carrot=5, stick=2", () => {
      const a = makeAnswers(3);
      a[115] = 5; a[116] = 2;
      expect(scoreLearnerProfile(a).teacherPreference.responseType).toBe("encouragement");
    });

    it("accountability: carrot=2, stick=5", () => {
      const a = makeAnswers(3);
      a[115] = 2; a[116] = 5;
      expect(scoreLearnerProfile(a).teacherPreference.responseType).toBe("accountability");
    });

    it("balanced: carrot=3, stick=3", () => {
      const a = makeAnswers(3);
      a[115] = 3; a[116] = 3;
      expect(scoreLearnerProfile(a).teacherPreference.responseType).toBe("balanced");
    });
  });

  describe("Dataset 7: Exam barrier primary", () => {
    it("anxiety dominant", () => {
      const a = makeAnswers(3);
      a[117] = 4; a[118] = 2; a[119] = 5; a[120] = 2;
      expect(scoreLearnerProfile(a).examBarriers.primaryBarrier).toBe("anxiety");
    });

    it("time-management dominant", () => {
      const a = makeAnswers(3);
      a[117] = 3; a[118] = 2; a[119] = 2; a[120] = 4;
      expect(scoreLearnerProfile(a).examBarriers.primaryBarrier).toBe("time-management");
    });

    it("external-blame dominant", () => {
      const a = makeAnswers(3);
      a[117] = 3; a[118] = 4; a[119] = 2; a[120] = 2;
      expect(scoreLearnerProfile(a).examBarriers.primaryBarrier).toBe("external-blame");
    });

    it("no barrier (all below 3, preparation high)", () => {
      const a = makeAnswers(3);
      a[117] = 4; a[118] = 2; a[119] = 2; a[120] = 2;
      expect(scoreLearnerProfile(a).examBarriers.primaryBarrier).toBe("none");
    });
  });

  describe("Dataset 8: Partial answers", () => {
    const answers: Answers = { 91: 4, 92: 4, 107: 5, 108: 5 };
    const result = scoreLearnerProfile(answers);

    it("partial perseverance = 4.0", () => {
      expect(result.grit.perseverance.score).toBeCloseTo(4.0, 1);
    });

    it("partial perseverance item count = 3", () => {
      expect(result.grit.perseverance.items).toBe(3);
    });

    it("partial maths passion = 5", () => {
      expect(result.subjectFit.maths.passion).toBe(5);
    });

    it("missing english passion = 0", () => {
      expect(result.subjectFit.english.passion).toBe(0);
    });
  });

  describe("Dataset 9: Energy net score", () => {
    const answers = makeAnswers(3);
    answers[103] = 5; answers[104] = 5;
    answers[105] = 1; answers[106] = 1;
    const result = scoreLearnerProfile(answers);

    it("high vitality = 5.0", () => {
      expect(result.energy.vitality.score).toBeCloseTo(5.0, 1);
    });

    it("high depletion recovery = 5.0", () => {
      expect(result.energy.depletion.score).toBeCloseTo(5.0, 1);
    });

    it("max net energy = 5.0", () => {
      expect(result.energy.netEnergy.score).toBeCloseTo(5.0, 1);
    });

    it("high energy level = high", () => {
      expect(result.energy.netEnergy.level).toBe("high");
    });
  });
});
