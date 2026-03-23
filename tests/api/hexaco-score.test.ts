import { describe, it, expect } from "vitest";
import { scoreHexaco } from "@/lib/scoring/hexaco-scorer";

describe("HEXACO scoring integration", () => {
  it("returns 6 dimensions from 60 neutral answers", () => {
    const answers: Record<number, number> = {};
    for (let i = 1; i <= 60; i++) answers[i] = 3;
    const result = scoreHexaco(answers);
    expect(result.dimensions).toHaveLength(6);
    result.dimensions.forEach(d => {
      expect(d).toHaveProperty("name");
      expect(d).toHaveProperty("score");
      expect(d).toHaveProperty("facets");
    });
  });

  it("returns higher scores for high answers on non-reversed items", () => {
    const answers: Record<number, number> = {};
    for (let i = 1; i <= 60; i++) answers[i] = 5;
    const result = scoreHexaco(answers);
    const avgScore = result.dimensions.reduce((sum, d) => sum + d.score, 0) / 6;
    expect(avgScore).toBeGreaterThan(2.5);
  });
});
