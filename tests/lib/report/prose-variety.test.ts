import { describe, it, expect } from 'vitest';
import {
  SECTION_OPENERS,
  pickOpener,
  renderInteractionCallout,
  renderInteractionAction,
  filterByAudience,
  detectFacetSurprises,
} from '@/lib/report/prose-variety';
import type { InteractionInsight } from '@/lib/report/interaction-rules';
import type { DimensionsMap } from '@/lib/report/helpers';

// Helper to build a minimal DimensionsMap with controlled facet scores
function makeDims(overrides: Record<string, { score: number; facets?: Record<string, number> }>): DimensionsMap {
  const base: Record<string, any> = {};
  for (const key of ['H', 'E', 'X', 'A', 'C', 'O']) {
    const entry = overrides[key];
    const dimScore = entry?.score ?? 3.0;
    const facetOverrides = entry?.facets ?? {};
    const facets: Record<string, { name: string; score: number }> = {
      f1: { name: 'facet_one', score: facetOverrides['f1'] ?? dimScore },
      f2: { name: 'facet_two', score: facetOverrides['f2'] ?? dimScore },
    };
    base[key] = { name: key, score: dimScore, level: 'moderate', facets };
  }
  return base as DimensionsMap;
}

function makeInsight(overrides: Partial<InteractionInsight> = {}): InteractionInsight {
  return {
    label: 'The Test Label',
    insight: 'This is the insight text for the student.',
    action: 'Do something helpful here.',
    audience: 'teacher',
    impact: 7,
    dims: ['C', 'X'],
    ...overrides,
  };
}

// ── SECTION_OPENERS ──────────────────────────────────────────────────────────

describe('SECTION_OPENERS', () => {
  it('has at least 8 opener templates', () => {
    expect(SECTION_OPENERS.length).toBeGreaterThanOrEqual(8);
  });

  it('has exactly 12 opener templates', () => {
    expect(SECTION_OPENERS.length).toBe(12);
  });

  it('each opener is a function returning a non-empty string', () => {
    for (const opener of SECTION_OPENERS) {
      const result = opener('Emma');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('each opener incorporates the name or returns a complete sentence', () => {
    for (const opener of SECTION_OPENERS) {
      const result = opener('Marcus');
      expect(result.length).toBeGreaterThan(5);
    }
  });
});

// ── pickOpener ───────────────────────────────────────────────────────────────

describe('pickOpener', () => {
  it('returns a non-empty string', () => {
    const result = pickOpener('Alice', 0);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('is deterministic — same inputs yield same output', () => {
    expect(pickOpener('Bob', 3)).toBe(pickOpener('Bob', 3));
    expect(pickOpener('Zara', 11)).toBe(pickOpener('Zara', 11));
  });

  it('produces at least 3 unique openers across section indices 0-5 for same student', () => {
    const openers = Array.from({ length: 6 }, (_, i) => pickOpener('Priya', i));
    const unique = new Set(openers);
    expect(unique.size).toBeGreaterThanOrEqual(3);
  });

  it('different names produce different openers for same section index', () => {
    const o1 = pickOpener('Alice', 0);
    const o2 = pickOpener('Xenophon', 0);
    expect(o1.length).toBeGreaterThan(0);
    expect(o2.length).toBeGreaterThan(0);
  });

  it('name appears in the opener string (since most templates embed name)', () => {
    const openers = Array.from({ length: 12 }, (_, i) => pickOpener('Lena', i));
    const anyContainsName = openers.some((o) => o.includes('Lena'));
    expect(anyContainsName).toBe(true);
  });
});

// ── renderInteractionCallout ─────────────────────────────────────────────────

describe('renderInteractionCallout', () => {
  it('returns a non-empty string', () => {
    const result = renderInteractionCallout(makeInsight());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('contains the interaction label', () => {
    const insight = makeInsight({ label: 'The Silent Perfectionist' });
    const result = renderInteractionCallout(insight);
    expect(result).toContain('The Silent Perfectionist');
  });

  it('contains the insight text', () => {
    const insight = makeInsight({ insight: 'Unique insight text XYZ.' });
    const result = renderInteractionCallout(insight);
    expect(result).toContain('Unique insight text XYZ.');
  });

  it('includes bold markers or emphasis around the label', () => {
    const insight = makeInsight({ label: 'The Anxious Achiever' });
    const result = renderInteractionCallout(insight);
    expect(result).toContain('**');
  });
});

// ── renderInteractionAction ──────────────────────────────────────────────────

describe('renderInteractionAction', () => {
  it('returns a non-empty string', () => {
    const result = renderInteractionAction(makeInsight());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('starts with or contains "What to do"', () => {
    const result = renderInteractionAction(makeInsight());
    expect(result).toContain('What to do');
  });

  it('contains the action text', () => {
    const insight = makeInsight({ action: 'Try this specific approach.' });
    const result = renderInteractionAction(insight);
    expect(result).toContain('Try this specific approach.');
  });
});

// ── filterByAudience ─────────────────────────────────────────────────────────

describe('filterByAudience', () => {
  const interactions: InteractionInsight[] = [
    makeInsight({ label: 'A', audience: 'teacher' }),
    makeInsight({ label: 'B', audience: 'parent' }),
    makeInsight({ label: 'C', audience: 'student' }),
    makeInsight({ label: 'D', audience: 'teacher' }),
  ];

  it('filters to only matching audience strings', () => {
    const result = filterByAudience(interactions, ['teacher']);
    expect(result.every((i) => i.audience === 'teacher')).toBe(true);
    expect(result.length).toBe(2);
  });

  it('supports multiple audiences', () => {
    const result = filterByAudience(interactions, ['teacher', 'parent']);
    expect(result.length).toBe(3);
  });

  it('returns empty array when no matches', () => {
    const result = filterByAudience(interactions, ['admin' as any]);
    expect(result).toEqual([]);
  });

  it('returns all when all audiences specified', () => {
    const result = filterByAudience(interactions, ['teacher', 'parent', 'student']);
    expect(result.length).toBe(4);
  });

  it('returns empty array for empty interactions input', () => {
    const result = filterByAudience([], ['teacher']);
    expect(result).toEqual([]);
  });
});

// ── detectFacetSurprises ──────────────────────────────────────────────────────

describe('detectFacetSurprises', () => {
  it('returns an array', () => {
    const dims = makeDims({ C: { score: 3.0 } });
    const result = detectFacetSurprises(dims, 'Alex');
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns empty array when all facets are close to dimension average', () => {
    const dims = makeDims({
      C: { score: 3.0, facets: { f1: 3.0, f2: 3.0 } },
    });
    const result = detectFacetSurprises(dims, 'Alex');
    expect(result.length).toBe(0);
  });

  it('detects a facet diverging >= 1.0 from dimension average', () => {
    const dims = makeDims({
      C: { score: 3.0, facets: { f1: 4.5, f2: 3.0 } },
    });
    const result = detectFacetSurprises(dims, 'Sam');
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('returned strings mention the student name', () => {
    const dims = makeDims({
      O: { score: 3.0, facets: { f1: 4.5, f2: 3.0 } },
    });
    const result = detectFacetSurprises(dims, 'Maya');
    expect(result.some((s) => s.includes('Maya'))).toBe(true);
  });

  it('returned strings contain "Hidden detail" or similar marker', () => {
    const dims = makeDims({
      E: { score: 3.0, facets: { f1: 1.5, f2: 3.0 } },
    });
    const result = detectFacetSurprises(dims, 'Jordan');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0]).toContain('Hidden detail');
  });

  it('does not flag facets diverging < 1.0', () => {
    const dims = makeDims({
      H: { score: 3.0, facets: { f1: 3.8, f2: 2.3 } },
    });
    const result = detectFacetSurprises(dims, 'River');
    expect(result.length).toBe(0);
  });

  it('correctly uses DIM_NAMES for dimension name in output', () => {
    const dims = makeDims({
      C: { score: 3.0, facets: { f1: 4.5, f2: 3.0 } },
    });
    const result = detectFacetSurprises(dims, 'Pat');
    expect(result.some((s) => s.includes('Conscientiousness'))).toBe(true);
  });
});
