/**
 * HEXACO-PI-R scorer for the 60-item personality inventory.
 * Scores 6 dimensions (H, E, X, A, C, O) each with 4 facets.
 * Items 1-60, scored on a 1-5 scale with reverse scoring applied.
 */

import { hexacoItems } from "@/lib/data/hexaco-items";
import type { Answers, DimensionScore, FacetScore } from "@/lib/types";

export interface HexacoResult {
  dimensions: DimensionScore[];
}

/**
 * Score all 60 HEXACO items and return dimension + facet scores.
 * @param answers - Record<number, 1-5> for items 1-60
 * @returns HexacoResult with 6 dimensions, each with 4 facets
 */
export function scoreHexaco(answers: Answers): HexacoResult {
  const domainOrder = ["H", "E", "X", "A", "C", "O"] as const;

  const dimensions: DimensionScore[] = domainOrder.map((domain) => {
    const domainItems = hexacoItems.filter((i) => i.domain === domain);

    // Get unique facets in order of first appearance
    const facetNames: string[] = [];
    for (const item of domainItems) {
      if (!facetNames.includes(item.subscale)) {
        facetNames.push(item.subscale);
      }
    }

    const facets: FacetScore[] = facetNames.map((facetName) => {
      const facetItems = domainItems.filter((i) => i.subscale === facetName);
      const scored: number[] = [];

      for (const item of facetItems) {
        const raw = answers[item.id];
        if (raw !== undefined) {
          scored.push(item.reverse ? 6 - raw : raw);
        }
      }

      if (scored.length === 0) return { name: facetName, score: 0 };

      const score = Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10;
      return { name: facetName, score };
    });

    // Dimension score = mean of all item scores in the dimension
    const allScored: number[] = [];
    for (const item of domainItems) {
      const raw = answers[item.id];
      if (raw !== undefined) {
        allScored.push(item.reverse ? 6 - raw : raw);
      }
    }

    const dimensionScore =
      allScored.length === 0
        ? 0
        : Math.round((allScored.reduce((a, b) => a + b, 0) / allScored.length) * 10) / 10;

    return { name: domain, score: dimensionScore, facets };
  });

  return { dimensions };
}
