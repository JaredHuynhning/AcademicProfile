import { describe, it, expect } from 'vitest';
import { detectDimensionInteractions, type InteractionInsight } from '@/lib/report/interaction-rules';
import type { DimensionsMap } from '@/lib/report/helpers';

// Helper to build a minimal DimensionsMap
function makeDims(overrides: Record<string, number>): DimensionsMap {
  const base: Record<string, any> = {};
  for (const key of ['H', 'E', 'X', 'A', 'C', 'O']) {
    base[key] = {
      name: key, score: overrides[key] ?? 3.0, level: 'moderate',
      facets: { f1: { name: 'f1', score: overrides[key] ?? 3.0 } },
    };
  }
  return base as DimensionsMap;
}

describe('detectDimensionInteractions', () => {
  it('detects Silent Perfectionist (High C + Low X)', () => {
    const dims = makeDims({ C: 4.2, X: 1.8 });
    const results = detectDimensionInteractions(dims, 'Liam');
    const sp = results.find(r => r.label === 'The Silent Perfectionist');
    expect(sp).toBeDefined();
    expect(sp!.dims).toEqual(['C', 'X']);
    expect(sp!.insight).toContain('Liam');
    expect(sp!.impact).toBeGreaterThanOrEqual(1);
    expect(sp!.impact).toBeLessThanOrEqual(10);
  });

  it('detects Anxious Achiever (High C + High E)', () => {
    const dims = makeDims({ C: 4.0, E: 4.0 });
    const results = detectDimensionInteractions(dims, 'Sophie');
    expect(results.find(r => r.label === 'The Anxious Achiever')).toBeDefined();
  });

  it('returns Balanced Profile when no interactions fire', () => {
    const dims = makeDims({ H: 3.0, E: 3.0, X: 3.0, A: 3.0, C: 3.0, O: 3.0 });
    const results = detectDimensionInteractions(dims, 'Average');
    expect(results.length).toBe(1);
    expect(results[0].label).toBe('Balanced Profile');
  });

  it('returns multiple interactions for extreme profiles', () => {
    const dims = makeDims({ C: 4.5, E: 4.5, X: 1.5, O: 4.5 });
    const results = detectDimensionInteractions(dims, 'Multi');
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('personalises insight text with student name', () => {
    const dims = makeDims({ O: 4.5, C: 1.8 });
    const results = detectDimensionInteractions(dims, 'Zara');
    const bd = results.find(r => r.label === 'The Brilliant Drifter');
    expect(bd).toBeDefined();
    expect(bd!.insight).toContain('Zara');
    expect(bd!.action).toContain('Zara');
  });
});
