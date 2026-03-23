import { describe, it, expect } from "vitest";
import { scoreHexaco } from "@/lib/scoring/hexaco-scorer";
import type { Answers } from "@/lib/types";

function makeAnswers(value: number): Answers {
  const answers: Answers = {};
  for (let id = 1; id <= 60; id++) {
    answers[id] = value as 1 | 2 | 3 | 4 | 5;
  }
  return answers;
}

describe("scoreHexaco", () => {
  describe("return shape", () => {
    const result = scoreHexaco(makeAnswers(3));

    it("returns object with dimensions array", () => {
      expect(result).toHaveProperty("dimensions");
      expect(Array.isArray(result.dimensions)).toBe(true);
    });

    it("has exactly 6 dimensions", () => {
      expect(result.dimensions).toHaveLength(6);
    });

    it("each dimension has name, score, and facets", () => {
      for (const dim of result.dimensions) {
        expect(dim).toHaveProperty("name");
        expect(dim).toHaveProperty("score");
        expect(dim).toHaveProperty("facets");
        expect(typeof dim.score).toBe("number");
        expect(Array.isArray(dim.facets)).toBe(true);
      }
    });

    it("each dimension has 4 facets", () => {
      for (const dim of result.dimensions) {
        expect(dim.facets).toHaveLength(4);
      }
    });

    it("each facet has name and score", () => {
      for (const dim of result.dimensions) {
        for (const facet of dim.facets) {
          expect(facet).toHaveProperty("name");
          expect(facet).toHaveProperty("score");
          expect(typeof facet.score).toBe("number");
        }
      }
    });

    it("dimension names are the 6 HEXACO domains", () => {
      const names = result.dimensions.map((d) => d.name);
      expect(names).toContain("H");
      expect(names).toContain("E");
      expect(names).toContain("X");
      expect(names).toContain("A");
      expect(names).toContain("C");
      expect(names).toContain("O");
    });
  });

  describe("scoring: all 3s (neutral)", () => {
    const result = scoreHexaco(makeAnswers(3));

    it("all dimension scores = 3.0", () => {
      for (const dim of result.dimensions) {
        expect(dim.score).toBeCloseTo(3.0, 1);
      }
    });

    it("all facet scores = 3.0", () => {
      for (const dim of result.dimensions) {
        for (const facet of dim.facets) {
          expect(facet.score).toBeCloseTo(3.0, 1);
        }
      }
    });
  });

  describe("scoring: all 5s (ceiling)", () => {
    const result = scoreHexaco(makeAnswers(5));

    it("scores are between 1 and 5 (reverse items bring some down)", () => {
      for (const dim of result.dimensions) {
        expect(dim.score).toBeGreaterThanOrEqual(1);
        expect(dim.score).toBeLessThanOrEqual(5);
      }
    });
  });

  describe("scoring: all 1s (floor)", () => {
    const result = scoreHexaco(makeAnswers(1));

    it("scores are between 1 and 5 (reverse items bring some up)", () => {
      for (const dim of result.dimensions) {
        expect(dim.score).toBeGreaterThanOrEqual(1);
        expect(dim.score).toBeLessThanOrEqual(5);
      }
    });
  });

  describe("reverse scoring", () => {
    it("item 1 (H sincerity, reverse=true): raw 5 → scored 1", () => {
      // Item 1 is domain H, subscale sincerity, reverse=true
      // If only item 1 = 5 and all others = 3:
      // H facets: sincerity has items 1,2,3
      // item2 reverse=false, item3 reverse=true
      // With all=3, sincerity = 3.0
      // Change item 1 to 5: sincerity = (6-5 + 3 + 6-3) / 3 = (1+3+3)/3 = 2.33
      const a = makeAnswers(3);
      a[1] = 5;
      const r = scoreHexaco(a);
      const H = r.dimensions.find((d) => d.name === "H")!;
      const sincerity = H.facets.find((f) => f.name === "sincerity")!;
      expect(sincerity.score).toBeCloseTo(2.3, 1);
    });

    it("item 2 (H sincerity, reverse=false): raw 5 → scored 5", () => {
      const a = makeAnswers(3);
      a[2] = 5;
      const r = scoreHexaco(a);
      const H = r.dimensions.find((d) => d.name === "H")!;
      const sincerity = H.facets.find((f) => f.name === "sincerity")!;
      // items: 1(rev,3→3), 2(fwd,5→5), 3(rev,3→3) → mean = (3+5+3)/3 = 3.67
      expect(sincerity.score).toBeCloseTo(3.7, 1);
    });
  });

  describe("dimension score = mean of all items in dimension", () => {
    it("H dimension score matches mean of items 1-10 with reverse applied", () => {
      // H items: 1-10
      // reverses: 1,3,5,6,7,8 are reverse=true
      // forward: 2,4,9,10
      // All set to 4:
      // reverse items: 6-4=2
      // forward items: 4
      // reverses count: 6, forwards count: 4
      // mean = (6*2 + 4*4) / 10 = (12+16)/10 = 2.8
      const a = makeAnswers(3);
      for (let id = 1; id <= 10; id++) a[id] = 4;
      const r = scoreHexaco(a);
      const H = r.dimensions.find((d) => d.name === "H")!;
      expect(H.score).toBeCloseTo(2.8, 1);
    });
  });

  describe("facet score = mean of facet items", () => {
    it("H fairness facet (items 4,5,6): item4 fwd, 5 rev, 6 rev", () => {
      const a = makeAnswers(3);
      a[4] = 5; a[5] = 1; a[6] = 2;
      // scored: 5, 6-1=5, 6-2=4 → mean = (5+5+4)/3 = 4.67
      const r = scoreHexaco(a);
      const H = r.dimensions.find((d) => d.name === "H")!;
      const fairness = H.facets.find((f) => f.name === "fairness")!;
      expect(fairness.score).toBeCloseTo(4.7, 1);
    });
  });

  describe("partial answers", () => {
    it("handles empty answers without crashing", () => {
      const r = scoreHexaco({});
      expect(r.dimensions).toHaveLength(6);
      for (const dim of r.dimensions) {
        expect(dim.score).toBe(0);
      }
    });
  });

  describe("score range", () => {
    it("scores are on 1-5 scale for answered items", () => {
      const r = scoreHexaco(makeAnswers(3));
      for (const dim of r.dimensions) {
        expect(dim.score).toBeGreaterThanOrEqual(1);
        expect(dim.score).toBeLessThanOrEqual(5);
        for (const facet of dim.facets) {
          expect(facet.score).toBeGreaterThanOrEqual(1);
          expect(facet.score).toBeLessThanOrEqual(5);
        }
      }
    });
  });
});
