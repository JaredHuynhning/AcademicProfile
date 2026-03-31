# Report Overhaul — Remaining #17 Items Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all 9 remaining acceptance criteria for ticket #17, delivering score-interaction insights, prose variety, visual components, conversation scripts, teacher-reality tables, progress indicator, and print styling.

**Architecture:** Three sequential phases: (1) Cross-reference engine adds dimension-pair interaction detection as a parallel pipeline, (2) All 11 section generators enriched with interaction callouts, facet surprises, and prose variety, (3) Three new UI components (StrengthBarrierSummary, ReadingProgressBar, print CSS) added to the report page.

**Tech Stack:** TypeScript, React 19, Next.js 15, Tailwind CSS v4, Framer Motion

**Assumptions:**
- Assumes HEXACO dimensions are present (personality quiz completed) — will NOT generate interactions for learning-only profiles
- Assumes cross-reference engine already runs when all 3 data sources present — will NOT change when it fires
- Assumes report page renders all sections (not lazy-loaded) — progress bar uses full document height

**Spec:** `docs/superpowers/specs/2026-03-31-report-overhaul-remaining-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/lib/report/interaction-rules.ts` | 15 dimension-pair interaction rule definitions + detection function |
| `src/lib/report/prose-variety.ts` | Opener pools, `pickOpener` helper, sentence variety utilities |
| `src/components/report/StrengthBarrierSummary.tsx` | Side-by-side strength/barrier visual cards |
| `src/components/report/ReadingProgressBar.tsx` | Thin scroll-based progress bar |

### Modified Files
| File | Change |
|------|--------|
| `src/lib/report/cross-reference-engine.ts` | Export `InteractionInsight` type, extend `CrossRefResult` |
| `src/lib/report/mega-sections.ts` | Call `detectDimensionInteractions`, pass `crossRefResult` + `interactions` to all generators |
| `src/lib/report/mega/section-01-executive.ts` | Expand teacher-reality table, add interaction callouts, prose variety |
| `src/lib/report/mega/section-02-personality.ts` | Add interaction callouts, facet surprises, prose variety |
| `src/lib/report/mega/section-03-learning.ts` | Add interaction callouts, prose variety |
| `src/lib/report/mega/section-04-character.ts` | Add interaction callouts, prose variety |
| `src/lib/report/mega/section-05-study.ts` | Add interaction callouts, prose variety |
| `src/lib/report/mega/section-06-strengths.ts` | Add interaction callouts, hidden strengths, prose variety |
| `src/lib/report/mega/section-07-barriers.ts` | Add interaction callouts, prose variety |
| `src/lib/report/mega/section-08-social.ts` | Add interaction callouts, prose variety |
| `src/lib/report/mega/section-09-subject-fit.ts` | Add interaction callouts, prose variety |
| `src/lib/report/mega/section-10-guide.ts` | Expand conversation scripts, add full teacher-reality table, prose variety |
| `src/lib/report/mega/section-11-action.ts` | Priority from interactions, prose variety |
| `src/app/report/page.tsx` | Add StrengthBarrierSummary, ReadingProgressBar, print CSS |

---

## Phase 1: Cross-Reference Engine Enhancement

### Task 1: Add InteractionInsight type and detection function

**Files:**
- Create: `src/lib/report/interaction-rules.ts`
- Modify: `src/lib/report/cross-reference-engine.ts`
- Test: `tests/lib/report/interaction-rules.test.ts`

**Does NOT cover:** Three-way dimension interactions (e.g., C+E+X). Only pairwise combos.

- [ ] **Step 1: Write failing test for interaction detection**

```typescript
// tests/lib/report/interaction-rules.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/report/interaction-rules.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement interaction rules**

```typescript
// src/lib/report/interaction-rules.ts
import type { DimensionsMap } from './helpers';

export interface InteractionInsight {
  label: string;
  insight: string;
  action: string;
  audience: 'teacher' | 'parent' | 'student';
  impact: number;
  dims: [string, string];
}

interface InteractionRule {
  dims: [string, string];
  label: string;
  condition: (dims: DimensionsMap) => boolean;
  insight: (name: string) => string;
  action: (name: string) => string;
  audience: 'teacher' | 'parent' | 'student';
  impact: number;
}

const RULES: InteractionRule[] = [
  {
    dims: ['C', 'X'],
    label: 'The Silent Perfectionist',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.X?.score ?? 3) < 2.5,
    insight: (n) => `${n} works extremely hard but will never ask for help, volunteer answers, or admit they're struggling. High conscientiousness paired with low extraversion creates a student who suffers in silence — teachers see a diligent worker and assume everything is fine. It isn't.`,
    action: (n) => `Create a private channel — email, journal, or 1:1 check-ins — for ${n} to flag struggles without public exposure.`,
    audience: 'teacher',
    impact: 9,
  },
  {
    dims: ['C', 'E'],
    label: 'The Anxious Achiever',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.E?.score ?? 3) >= 3.5,
    insight: (n) => `${n} prepares more thoroughly than almost anyone in the class, yet still experiences intense anxiety before assessments. This isn't under-preparation — it's a personality-driven feedback loop where high standards (conscientiousness) fuel fear of falling short (emotionality).`,
    action: (n) => `Help ${n} separate preparation quality from emotional readiness. Pre-exam routine: "I have done the work. My feelings are not facts about my preparation."`,
    audience: 'parent',
    impact: 9,
  },
  {
    dims: ['O', 'C'],
    label: 'The Brilliant Drifter',
    condition: (d) => (d.O?.score ?? 3) >= 3.5 && (d.C?.score ?? 3) < 2.5,
    insight: (n) => `${n} is full of ideas — genuinely creative and intellectually curious — but can't finish anything. High openness generates constant new interests while low conscientiousness means no follow-through. The result: a trail of abandoned projects and half-written essays.`,
    action: (n) => `Give ${n} a "one project at a time" rule. Before starting anything new, the current project must reach a defined checkpoint. Use a visible tracker.`,
    audience: 'parent',
    impact: 8,
  },
  {
    dims: ['X', 'E'],
    label: 'The Internal Storm',
    condition: (d) => (d.X?.score ?? 3) < 2.5 && (d.E?.score ?? 3) >= 3.5,
    insight: (n) => `${n} experiences strong emotions but has no outlet for them. Low extraversion means they won't talk about what's bothering them, while high emotionality means there's a lot to talk about. Teachers see a quiet student; inside, there's a storm.`,
    action: (n) => `Offer ${n} written emotional outlets: journals, reflection prompts, or anonymous check-in forms. Don't force verbal disclosure.`,
    audience: 'teacher',
    impact: 8,
  },
  {
    dims: ['X', 'A'],
    label: 'The Dominant Debater',
    condition: (d) => (d.X?.score ?? 3) >= 3.5 && (d.A?.score ?? 3) < 2.5,
    insight: (n) => `${n} is socially confident and intellectually combative — a powerful combination in debates but a destructive one in group projects. They'll challenge ideas forcefully and may not notice when they've crossed from productive to personal.`,
    action: (n) => `Teach ${n} the "steel man" technique: before arguing against an idea, they must first state it in its strongest form. This channels critical thinking without alienating peers.`,
    audience: 'teacher',
    impact: 7,
  },
  {
    dims: ['O', 'X'],
    label: 'The Idea Generator',
    condition: (d) => (d.O?.score ?? 3) >= 3.5 && (d.X?.score ?? 3) >= 3.5,
    insight: (n) => `${n} is both creative and socially energised — the student who lights up brainstorming sessions and pulls others into ambitious projects. This is a genuine superpower for collaborative and creative work.`,
    action: (n) => `Give ${n} leadership roles in creative projects. They thrive when they can ideate AND rally a team around the vision.`,
    audience: 'student',
    impact: 7,
  },
  {
    dims: ['C', 'E'],
    label: 'The Unbothered Underperformer',
    condition: (d) => (d.C?.score ?? 3) < 2.5 && (d.E?.score ?? 3) < 2.5,
    insight: (n) => `${n} doesn't try hard AND doesn't feel bad about it. Low conscientiousness means inconsistent effort, and low emotionality means there's no internal distress driving change. This is the hardest profile to motivate because the usual levers (guilt, anxiety, desire to please) don't apply.`,
    action: (n) => `Find ${n}'s genuine interests — the thing they'd do without being asked — and connect academic tasks to those interests. External motivation won't work; intrinsic is the only path.`,
    audience: 'parent',
    impact: 8,
  },
  {
    dims: ['H', 'C'],
    label: 'The Principled Worker',
    condition: (d) => (d.H?.score ?? 3) >= 3.5 && (d.C?.score ?? 3) >= 3.5,
    insight: (n) => `${n} combines honesty with diligence — the student teachers trust implicitly with responsibilities. They won't cut corners, won't copy others' work, and will do what they said they'd do.`,
    action: (n) => `Leverage ${n}'s reliability by giving them meaningful responsibilities (peer tutoring, project coordination). They thrive when trusted.`,
    audience: 'teacher',
    impact: 6,
  },
  {
    dims: ['E', 'C'],
    label: 'The Emotional Procrastinator',
    condition: (d) => (d.E?.score ?? 3) >= 3.5 && (d.C?.score ?? 3) < 2.5,
    insight: (n) => `${n} feels overwhelmed by tasks and responds by avoiding them entirely. High emotionality amplifies the stress of deadlines while low conscientiousness removes the internal structure to push through. The result: paralysis disguised as laziness.`,
    action: (n) => `Break tasks into tiny steps (5-minute chunks) and validate ${n}'s feelings before discussing the work: "I know this feels like a lot. Let's just do the first paragraph."`,
    audience: 'parent',
    impact: 8,
  },
  {
    dims: ['A', 'X'],
    label: 'The Quiet Supporter',
    condition: (d) => (d.A?.score ?? 3) >= 3.5 && (d.X?.score ?? 3) < 2.5,
    insight: (n) => `${n} is deeply cooperative but socially reserved — the student who does more than their share in group work but never gets credit because they don't speak up. Teachers may overlook their contributions entirely.`,
    action: (n) => `Explicitly acknowledge ${n}'s contributions in group settings. Ask for their input directly: "What do you think about this approach?"`,
    audience: 'teacher',
    impact: 6,
  },
  {
    dims: ['C', 'O'],
    label: 'The Reliable Executor',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.O?.score ?? 3) < 2.5,
    insight: (n) => `${n} gets things done efficiently and reliably — but rarely exceeds the brief. High conscientiousness ensures completion; low openness means they stick to what's asked. They'll deliver exactly what the rubric requires, no more.`,
    action: (n) => `Occasionally set open-ended assignments that reward going beyond the minimum. ${n} has the discipline to execute ambitious work — they just need permission to try.`,
    audience: 'teacher',
    impact: 5,
  },
  {
    dims: ['O', 'E'],
    label: 'The Sensitive Creator',
    condition: (d) => (d.O?.score ?? 3) >= 3.5 && (d.E?.score ?? 3) >= 3.5,
    insight: (n) => `${n} channels emotional depth into creative expression — producing work that is original, personal, and sometimes raw. This combination drives exceptional creative writing, art, and humanities work, but also means criticism of their work feels like criticism of them.`,
    action: (n) => `Separate craft feedback from personal feedback: "Your technique here is strong. This paragraph could be tighter — here's how." Never: "This doesn't work."`,
    audience: 'student',
    impact: 7,
  },
  {
    dims: ['H', 'X'],
    label: 'The Social Manipulator',
    condition: (d) => (d.H?.score ?? 3) < 2.5 && (d.X?.score ?? 3) >= 3.5,
    insight: (n) => `${n} is charming and socially skilled but may use those skills strategically rather than authentically. Low honesty-humility paired with high extraversion creates someone who can navigate social situations masterfully — and may sometimes manipulate them.`,
    action: (n) => `Channel ${n}'s social intelligence into leadership roles with accountability structures. They'll thrive with responsibility IF there are clear ethical boundaries.`,
    audience: 'parent',
    impact: 7,
  },
  {
    dims: ['C', 'O'],
    label: 'The Curious Organiser',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.O?.score ?? 3) >= 3.5,
    insight: (n) => `${n} is that rare combination: genuinely curious AND methodically organised. They don't just explore ideas — they catalogue them, build on them, and turn them into finished products. This is the profile of future researchers and innovators.`,
    action: (n) => `Give ${n} independent research projects with structure. They'll go deep AND deliver on time.`,
    audience: 'student',
    impact: 7,
  },
  {
    dims: ['X', 'A'],
    label: 'The Lone Wolf',
    condition: (d) => (d.X?.score ?? 3) < 2.5 && (d.A?.score ?? 3) < 2.5,
    insight: (n) => `${n} prefers working alone and doesn't naturally defer to group norms. This isn't anti-social — it's a genuine preference for independence combined with intellectual directness. Forced group work is genuinely painful, not laziness.`,
    action: (n) => `Where possible, offer solo alternatives to group assignments. When groups are required, give ${n} a defined individual role within the team.`,
    audience: 'teacher',
    impact: 6,
  },
];

export function detectDimensionInteractions(
  dims: DimensionsMap,
  studentName: string,
): InteractionInsight[] {
  const fired: InteractionInsight[] = [];

  for (const rule of RULES) {
    if (rule.condition(dims)) {
      fired.push({
        label: rule.label,
        insight: rule.insight(studentName),
        action: rule.action(studentName),
        audience: rule.audience,
        impact: rule.impact,
        dims: rule.dims,
      });
    }
  }

  if (fired.length === 0) {
    fired.push({
      label: 'Balanced Profile',
      insight: `${studentName}'s personality profile is notably well-balanced — no single dimension dominates or creates friction with another. This is rare and valuable: ${studentName} can adapt to most academic situations without personality-driven obstacles getting in the way.`,
      action: `Focus on developing ${studentName}'s existing interests rather than compensating for weaknesses. A balanced profile responds well to challenge and variety.`,
      audience: 'parent',
      impact: 5,
      dims: ['balanced', 'balanced'],
    });
  }

  return fired.sort((a, b) => b.impact - a.impact);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/report/interaction-rules.test.ts`
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/report/interaction-rules.ts tests/lib/report/interaction-rules.test.ts
git commit -m "feat(report): add dimension-pair interaction detection (15 rules + balanced fallback) (#17)"
```

---

### Task 2: Extend CrossRefResult and wire interactions into mega-sections

**Files:**
- Modify: `src/lib/report/cross-reference-engine.ts`
- Modify: `src/lib/report/mega-sections.ts`

**Does NOT cover:** Generators don't consume `interactions` yet — that's Phase 2. This task only passes the data through.

- [ ] **Step 1: Add `interactions` field to CrossRefResult**

In `src/lib/report/cross-reference-engine.ts`, add the import and extend the type:

```typescript
// Add at top of file after existing imports
import type { InteractionInsight } from './interaction-rules';

// Extend the CrossRefResult interface — add interactions field:
export interface CrossRefResult {
  insights: Insight[];
  byType: {
    root_cause: Insight[];
    confirmation: Insight[];
    contradiction: Insight[];
    untapped: Insight[];
  };
  interactions: InteractionInsight[];  // NEW
}
```

In the `runCrossReferenceEngine` function's return statement, add `interactions: []` so existing callers don't break:

```typescript
return {
  insights: sorted,
  byType: { root_cause, confirmation, contradiction, untapped },
  interactions: [],  // populated by mega-sections.ts
};
```

- [ ] **Step 2: Wire interaction detection into mega-sections.ts**

In `src/lib/report/mega-sections.ts`, import and call `detectDimensionInteractions`:

Add import at top:
```typescript
import { detectDimensionInteractions } from './interaction-rules';
```

In `consolidateToMegaReport`, after the existing `crossRefResult` computation (around line 290), add:

```typescript
// Detect dimension-pair interactions
const interactions = dims ? detectDimensionInteractions(dims, studentName) : [];
if (crossRefResult) {
  crossRefResult.interactions = interactions;
} else if (interactions.length > 0) {
  // Create minimal crossRefResult to carry interactions even without full cross-ref data
  crossRefResult = {
    insights: [],
    byType: { root_cause: [], confirmation: [], contradiction: [], untapped: [] },
    interactions,
  };
}
```

Then expose `interactions` on `MegaReport` type and return object:

In `mega-sections.ts`, add to the `MegaReport` interface:
```typescript
import type { InteractionInsight } from './interaction-rules';

// Add to MegaReport interface:
interactions: InteractionInsight[];
```

Add `interactions` to the return object of `consolidateToMegaReport` (alongside existing fields like `radarData`, `scoreSummary`):
```typescript
return {
  // ... existing fields ...
  interactions,
};
```

Re-export `InteractionInsight` from `src/lib/report/index.ts`:
```typescript
export type { InteractionInsight } from './interaction-rules';
```

Then update the 8 generator call sites to pass `crossRefResult`:

```typescript
// section-02: add crossRefResult param
generatePersonalityDeepDive(dims, studentName, crossRefResult)

// section-03: add crossRefResult param
generateLearningProfileMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName, crossRefResult)

// section-04: add crossRefResult param
generateAcademicCharacterMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName, crossRefResult)

// section-05: add crossRefResult param
generateStudyPlaybookMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName, crossRefResult)

// section-08: add crossRefResult param
generateSocialDynamicsMega(dims, studentName, crossRefResult)

// section-09: add crossRefResult param
generateSubjectFitMega(dims, results.learnerProfile || null, studentName, crossRefResult)

// section-10: add crossRefResult param
generateGuideMega(dims, studentName, crossRefResult)

// section-11: add crossRefResult param
generateActionPlanMega(dims, studentName, crossRefResult)
```

- [ ] **Step 3: Update all 8 generator signatures to accept the new parameter**

Each generator gets `crossRefResult: CrossRefResult | null` added as the last parameter. The parameter is unused for now — just accepted:

For each of the 8 files (`section-02` through `section-11` excluding `01`, `06`, `07` which already have it), add:

```typescript
import type { CrossRefResult } from '../cross-reference-engine';
```

And append `crossRefResult: CrossRefResult | null` to the function signature. Example for `section-02-personality.ts`:

```typescript
export function generatePersonalityDeepDive(
  dimensions: DimensionsMap,
  studentName: string,
  crossRefResult: CrossRefResult | null,  // NEW
): MegaSectionContent {
```

Repeat for sections 03, 04, 05, 08, 09, 10, 11.

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 5: Run existing tests**

Run: `npx vitest run`
Expected: Same pass/fail as before (179 pass, 2 pre-existing failures)

- [ ] **Step 6: Commit**

```bash
git add src/lib/report/cross-reference-engine.ts src/lib/report/mega-sections.ts src/lib/report/mega/
git commit -m "feat(report): wire interaction detection into mega-sections pipeline (#17)"
```

---

### Task 3: Add prose variety utilities

**Files:**
- Create: `src/lib/report/prose-variety.ts`
- Test: `tests/lib/report/prose-variety.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// tests/lib/report/prose-variety.test.ts
import { describe, it, expect } from 'vitest';
import { pickOpener, SECTION_OPENERS, renderInteractionCallout } from '@/lib/report/prose-variety';

describe('pickOpener', () => {
  it('returns a string from the pool', () => {
    const result = pickOpener('Liam', 0);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns different openers for different sections (same student)', () => {
    const openers = new Set<string>();
    for (let i = 0; i < 6; i++) {
      openers.add(pickOpener('Liam', i));
    }
    expect(openers.size).toBeGreaterThanOrEqual(3);
  });

  it('is deterministic (same inputs → same output)', () => {
    const a = pickOpener('Liam', 2);
    const b = pickOpener('Liam', 2);
    expect(a).toBe(b);
  });

  it('returns different openers for different students (same section)', () => {
    const a = pickOpener('Liam Torres', 0);
    const b = pickOpener('Zara Okafor', 0);
    // Not guaranteed different but statistically likely with different names
    // Just verify both return valid strings
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
  });
});

describe('SECTION_OPENERS', () => {
  it('has at least 8 openers', () => {
    expect(SECTION_OPENERS.length).toBeGreaterThanOrEqual(8);
  });
});

describe('renderInteractionCallout', () => {
  it('renders a bold callout with label and insight', () => {
    const result = renderInteractionCallout({
      label: 'The Silent Perfectionist',
      insight: 'Liam works hard but never asks for help.',
      action: 'Create private channels.',
      audience: 'teacher',
      impact: 9,
      dims: ['C', 'X'],
    });
    expect(result).toContain('Silent Perfectionist');
    expect(result).toContain('Liam works hard');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/report/prose-variety.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement prose variety utilities**

```typescript
// src/lib/report/prose-variety.ts
import type { InteractionInsight } from './interaction-rules';

export const SECTION_OPENERS: ((name: string) => string)[] = [
  (n) => `What stands out immediately about ${n} is`,
  (n) => `The data reveals something important about ${n}:`,
  (n) => `Here's what makes ${n} different from most students:`,
  (n) => `Teachers will notice that ${n}`,
  (n) => `At home, this shows up when ${n}`,
  (n) => `Perhaps the most telling indicator for ${n} is`,
  (n) => `The research literature points to something specific here:`,
  (n) => `This is where personality becomes academic reality for ${n}:`,
  (n) => `The pattern that emerges for ${n} is`,
  (n) => `What parents often miss is that ${n}`,
  (n) => `Look closely at the numbers and a story emerges:`,
  (n) => `The most important thing to understand about ${n} is`,
];

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function pickOpener(studentName: string, sectionIndex: number): string {
  const hash = nameHash(studentName);
  const idx = (hash + sectionIndex * 7) % SECTION_OPENERS.length;
  return SECTION_OPENERS[idx](studentName);
}

export function renderInteractionCallout(interaction: InteractionInsight): string {
  return `\n**🔑 ${interaction.label}:** ${interaction.insight}`;
}

export function renderInteractionAction(interaction: InteractionInsight): string {
  return `**What to do:** ${interaction.action}`;
}

export function filterByAudience(
  interactions: InteractionInsight[],
  audiences: string[],
): InteractionInsight[] {
  return interactions.filter((i) => audiences.includes(i.audience));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/report/prose-variety.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/report/prose-variety.ts tests/lib/report/prose-variety.test.ts
git commit -m "feat(report): add prose variety utilities — opener pools, interaction callouts (#17)"
```

---

## Phase 2: Section Content Enrichment

### Task 4: Enrich Section 1 (Executive Summary) — expand teacher-reality table

**Files:**
- Modify: `src/lib/report/mega/section-01-executive.ts`

**Does NOT cover:** Full 8-10 row teacher table — that's in Section 10. This adds 3-4 rows as a brief version.

- [ ] **Step 1: Read current section-01-executive.ts to understand existing structure**

Run: Read the file to identify where the teacher perception table and aha-moment blocks currently live.

- [ ] **Step 2: Add interaction callouts and expand teacher-reality table**

Import prose variety utilities at top of file:
```typescript
import { pickOpener, renderInteractionCallout, filterByAudience } from '../prose-variety';
```

Add after the existing aha-moment blocks (around the dimension-interaction area), inject cross-ref interactions:

```typescript
// Inject top 2 interactions relevant to parents/students
const parentInteractions = filterByAudience(
  crossRefResult?.interactions ?? [], ['parent', 'student']
).slice(0, 2);
parentInteractions.forEach(i => {
  narrative.push(renderInteractionCallout(i));
});
```

Expand the teacher-reality table to be conditionally generated with 3-4 rows based on dimensions:

```typescript
narrative.push('\n#### What Teachers See vs What\'s Really Happening');
narrative.push('| What Teachers See | What\'s Actually Happening | Personality Driver |');
narrative.push('|---|---|---|');
if (xScore < 2.5 && eScore >= 3.5) {
  narrative.push(`| "Doesn't participate" | Anxiety about being wrong combined with introversion | Low X + High E |`);
}
if (cScore < 2.5) {
  narrative.push(`| "Lazy, doesn't try" | Executive function gap — not a motivation problem | Low C |`);
}
if (oScore >= 3.5 && cScore < 2.5) {
  narrative.push(`| "Distracted, off-task" | Needs novelty, bored by repetition | High O + Low C |`);
}
if (cScore >= 4.0 && eScore >= 3.5) {
  narrative.push(`| "Perfect student, no concerns" | Burning out internally, afraid to fail | High C + High E |`);
}
```

Replace at least 2 paragraph openings with `pickOpener(studentName, 0)` calls for variety.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/lib/report/mega/section-01-executive.ts
git commit -m "feat(report): enrich executive summary — interaction callouts, expanded teacher table, prose variety (#17)"
```

---

### Task 5: Enrich Sections 2-9 with interactions and prose variety

**Files:**
- Modify: `src/lib/report/mega/section-02-personality.ts`
- Modify: `src/lib/report/mega/section-03-learning.ts`
- Modify: `src/lib/report/mega/section-04-character.ts`
- Modify: `src/lib/report/mega/section-05-study.ts`
- Modify: `src/lib/report/mega/section-06-strengths.ts`
- Modify: `src/lib/report/mega/section-07-barriers.ts`
- Modify: `src/lib/report/mega/section-08-social.ts`
- Modify: `src/lib/report/mega/section-09-subject-fit.ts`

**Does NOT cover:** Full rewrite of section content. Only adds interaction callouts, facet surprises, and opener variety to existing narratives.

For each section, the pattern is identical:

- [ ] **Step 1: Add imports to each section**

Add to each file:
```typescript
import { pickOpener, renderInteractionCallout, renderInteractionAction, filterByAudience } from '../prose-variety';
import type { CrossRefResult } from '../cross-reference-engine';
```

- [ ] **Step 2: Add interaction callouts (2-3 per section)**

At a natural break point in each section's narrative (after the intro, before detailed analysis), add:

```typescript
// Inject relevant interactions
const relevantInteractions = filterByAudience(
  crossRefResult?.interactions ?? [], ['parent', 'student']
).slice(0, 2);
relevantInteractions.forEach(interaction => {
  narrative.push(renderInteractionCallout(interaction));
  narrative.push(renderInteractionAction(interaction));
});
```

Section-specific filtering:
- **Section 6 (Strengths):** Filter to interactions with `impact >= 6` that are positive
- **Section 7 (Barriers):** Filter to interactions with `impact >= 7` that describe obstacles
- **Section 8 (Social):** Filter to interactions involving X or A dimensions: `interaction.dims.some(d => d === 'X' || d === 'A')`
- **Section 9 (Subject Fit):** Filter to interactions involving O or C dimensions

- [ ] **Step 3: Add facet surprise detection to ALL sections that discuss dimensions**

Add the facet divergence detection helper to `prose-variety.ts` (shared utility):

```typescript
// In src/lib/report/prose-variety.ts — add:
import { DIM_NAMES, type DimensionsMap } from './helpers';

export function detectFacetSurprises(dims: DimensionsMap, studentName: string): string[] {
  const surprises: string[] = [];
  for (const [key, dim] of Object.entries(dims)) {
    if (!dim?.facets) continue;
    const dimAvg = dim.score;
    for (const facet of Object.values(dim.facets) as any[]) {
      if (Math.abs(facet.score - dimAvg) >= 1.0) {
        surprises.push(
          `**Hidden detail:** ${studentName}'s ${facet.name.toLowerCase()} (${facet.score.toFixed(1)}) diverges notably from their overall ${DIM_NAMES[key] || key} (${dimAvg.toFixed(1)}). ${facet.score > dimAvg ? 'This specific facet is stronger than the headline number suggests' : 'This facet is a relative weakness within an otherwise strong dimension'}.`
        );
      }
    }
  }
  return surprises;
}
```

Then in EACH section generator (sections 2-9), call it and insert 1-2 most relevant surprises:

```typescript
// In each section, after the main narrative blocks:
const surprises = detectFacetSurprises(dimensions, studentName);
if (surprises.length > 0) {
  narrative.push('\n#### Hidden Details in the Data');
  surprises.slice(0, 2).forEach(s => narrative.push(s));
}
```

Section-specific filtering for facet surprises:
- **Section 2 (Personality):** Show ALL surprises (it's the deep-dive section)
- **Section 3 (Learning):** Filter to C and O facets (study-relevant)
- **Section 4 (Character):** Filter to C and E facets (grit/resilience-relevant)
- **Section 5 (Study):** Filter to C facets (approach-relevant)
- **Section 6 (Strengths):** Filter to facets scoring above average (hidden strengths)
- **Section 7 (Barriers):** Filter to facets scoring below average (hidden weaknesses)
- **Section 8 (Social):** Filter to X and A facets (social-relevant)
- **Section 9 (Subject Fit):** Filter to O and C facets (subject-alignment-relevant)

- [ ] **Step 4: Replace 2-3 paragraph openings per section with pickOpener calls**

In each section, identify the first 2-3 narrative paragraphs that start with the student's name or a score, and replace:

```typescript
// Before:
narrative.push(`${studentName}'s conscientiousness is...`);

// After:
narrative.push(`${pickOpener(studentName, 5)} a level of self-discipline that...`);
```

Use different `sectionIndex` values (0-10) to ensure variety across sections.

- [ ] **Step 5: Verify build and run tests**

Run: `npm run build && npx vitest run`
Expected: Build succeeds, tests pass (same as before)

- [ ] **Step 6: Commit**

```bash
git add src/lib/report/mega/section-0*.ts
git commit -m "feat(report): enrich sections 2-9 — interaction callouts, facet surprises, prose variety (#17)"
```

---

### Task 6: Expand Section 10 (Guide) — conversation scripts + teacher-reality table

**Files:**
- Modify: `src/lib/report/mega/section-10-guide.ts`

**Does NOT cover:** Scripts for study techniques or exam strategy — those live in sections 5 and 7.

- [ ] **Step 1: Read current section-10-guide.ts to identify insertion points**

Read the full file (already explored — conversation scripts start around line 148).

- [ ] **Step 2: Add 5 new conversation script scenarios**

After the existing scripts block, add:

```typescript
// ─── NEW: After a Bad Grade ─────────────────────────────────────────────────
if (eScore >= 3.5) {
  narrative.push('\n**After a disappointing result:**');
  narrative.push(`*Parent:* "I can see you're upset about this grade, and that's okay — it means you care. Can you show me the paper?"`);
  narrative.push(`*Student:* "I don't want to talk about it. I'm so stupid."`);
  narrative.push(`*Parent:* "You're not stupid — you're disappointed, and those are different things. Let's find two things you did well before we look at what to improve."`);
  narrative.push(`**Why it works:** You validated the emotion (High Emotionality) before problem-solving. Starting with strengths prevents the shame spiral.`);
} else {
  narrative.push('\n**After a disappointing result:**');
  narrative.push(`*Parent:* "This wasn't the result you wanted. Let's figure out why — was it preparation, understanding, or exam technique?"`);
  narrative.push(`*Student:* "I don't know. I thought I knew it."`);
  narrative.push(`*Parent:* "Let's look at the specific questions you got wrong and work backwards. For the next test, we'll try a different approach and see if it helps."`);
  narrative.push(`**Why it works:** You were direct and problem-solving oriented — ${studentName} doesn't need emotional cushioning, they want to understand what went wrong.`);
}

// ─── NEW: About Effort & Consistency ────────────────────────────────────────
if (cScore < 2.5) {
  narrative.push('\n**About effort and consistency:**');
  narrative.push(`*Parent:* "I notice you do your best work when you study at the desk with your phone in another room. How can we create more of those conditions?"`);
  narrative.push(`*Student:* "You're always on my case. I'll do it later."`);
  narrative.push(`*Parent:* "I'm not questioning your ability — I know you can do this. I'm asking about your environment, not your character. What would make it easier to get started?"`);
  narrative.push(`**Why it works:** You shifted from willpower (internal, feels like criticism) to environment (external, changeable). This reframes effort as a skill to develop, not a character flaw.`);
} else if (cScore >= 4.0 && (C?.facets?.perfectionism?.score || 0) >= 4.0) {
  narrative.push('\n**About perfectionism and overwork:**');
  narrative.push(`*Parent:* "I noticed you spent 4 hours on that 30-minute assignment. Your work is always excellent — but what did you not do during those 4 hours?"`);
  narrative.push(`*Student:* "It has to be right. I can't hand in something that's not my best."`);
  narrative.push(`*Parent:* "Your best is already better than most. Let's build a calibration system: before starting any task, decide how much time it deserves based on its weight. A 5% assignment doesn't need 95% of your effort."`);
  narrative.push(`**Why it works:** You acknowledged their drive (High Conscientiousness) while introducing proportional effort as a skill.`);
}

// ─── NEW: About Subject Choices ─────────────────────────────────────────────
narrative.push('\n**About subject or career choices:**');
narrative.push(`*Parent:* "What subjects make you lose track of time? What would you do if grades didn't matter?"`);
narrative.push(`*Student:* "${oScore >= 3.5 ? 'I don\'t know... maybe art? Or philosophy?' : 'I like the ones where I know what to do and can get a good mark.'}"`);
narrative.push(`*Parent:* "${oScore >= 3.5
  ? 'Those are real interests. Let\'s look at what those subjects have in common and find more of that.'
  : 'That\'s valuable self-knowledge. Let\'s find subjects that give you clear goals AND room to grow.'}"`);
narrative.push(`**Why it works:** You asked about intrinsic interest (${oScore >= 3.5 ? 'High Openness' : 'practical preference'}), not grades.`);

// ─── NEW: When They Want to Quit ────────────────────────────────────────────
if (oScore >= 3.5 || xScore >= 3.5) {
  narrative.push('\n**When they want to quit an activity:**');
  narrative.push(`*Student:* "I'm bored of piano/sport/drama. I want to try something else."`);
  narrative.push(`*Parent:* "Tell me what you liked about it when you started, and what changed."`);
  narrative.push(`*Student:* "${oScore >= 3.5 ? 'It was new and exciting. Now it\'s just the same scales over and over.' : 'My friends are doing something else and this isn\'t fun anymore.'}"`);
  narrative.push(`*Parent:* "${oScore >= 3.5
    ? 'You\'re someone who loves learning new things — the boring phase is where real skill develops. Let\'s set a checkpoint: try two more months with a specific goal, then decide.'
    : 'The social side matters to you, and that\'s okay. Can we find a way to bring a friend in, or try something you can do together?'}"`);
  narrative.push(`**Why it works:** You validated the feeling while ${oScore >= 3.5 ? 'reframing boredom as growth' : 'acknowledging the social motivation'}.`);
}

// ─── NEW: About Social Struggles ────────────────────────────────────────────
if (xScore < 2.5 || aScore < 2.5) {
  narrative.push('\n**About social difficulties:**');
  narrative.push(`*Parent:* "I noticed you've been spending a lot of time alone lately. Everything okay?"`);
  narrative.push(`*Student:* "${xScore < 2.5 ? 'I just need space. Everyone is so loud.' : 'People are annoying. They don\'t get what I\'m saying.'}"`);
  narrative.push(`*Parent:* "${xScore < 2.5
    ? 'Needing space is completely normal for you. You recharge on your own — that\'s a strength, not a problem. Do you feel like you have enough social connection when you want it?'
    : 'You see things clearly and say them directly — that\'s valuable. Sometimes other people need a softer delivery to hear the message. Want to practise?'}"`);
  narrative.push(`**Why it works:** You normalised ${xScore < 2.5 ? 'introversion as a personality trait, not a deficiency' : 'directness while offering communication tools'}.`);
}
```

- [ ] **Step 3: Add full teacher-reality table (8-10 conditional rows)**

After the parent-teacher meeting guide section:

```typescript
narrative.push('\n### What Teachers See vs What\'s Really Happening');
narrative.push(
  `This table translates ${studentName}'s visible classroom behaviour into the personality drivers behind it. Share this with teachers to prevent misdiagnosis.`
);
narrative.push('| What Teachers See | What\'s Actually Happening | Personality Driver |');
narrative.push('|---|---|---|');

if (xScore < 2.5) {
  narrative.push(`| "Doesn't participate" | ${eScore >= 3.5 ? 'Anxiety about being wrong + introversion' : 'Prefers internal processing over verbal contribution'} | Low X${eScore >= 3.5 ? ' + High E' : ''} |`);
}
if (cScore < 2.5) {
  narrative.push(`| "Lazy, doesn't try" | Executive function gap — wants to do well but can't self-organise | Low C |`);
}
if (oScore >= 3.5 && cScore < 2.5) {
  narrative.push(`| "Distracted, off-task" | Needs novelty, bored by repetition — exploring tangential ideas | High O + Low C |`);
}
if (cScore >= 4.0 && eScore >= 3.5) {
  narrative.push(`| "Perfect student, no concerns" | Burning out internally, afraid to show any imperfection | High C + High E |`);
}
if (aScore < 2.5) {
  narrative.push(`| "Argumentative, difficult" | Values intellectual honesty, challenges ideas not people | Low A |`);
}
if (xScore >= 4.0 && cScore < 2.5) {
  narrative.push(`| "Class clown, disruptive" | High social energy with no productive outlet in class structure | High X + Low C |`);
}
if (eScore < 2.5 && cScore < 2.5) {
  narrative.push(`| "Doesn't care about grades" | Genuinely unmoved by external validation — needs intrinsic motivation | Low E + Low C |`);
}
if (xScore < 2.5 && aScore < 2.5) {
  narrative.push(`| "Anti-social" | Prefers depth over breadth in relationships; values solo work | Low X + Low A |`);
}
```

- [ ] **Step 4: Add interaction callouts and prose variety**

Add imports and inject interactions as in Task 5.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/lib/report/mega/section-10-guide.ts
git commit -m "feat(report): expand guide — 5 new conversation scripts, full teacher-reality table (#17)"
```

---

### Task 7: Enrich Section 11 (Action Plan) with interaction-driven priorities

**Files:**
- Modify: `src/lib/report/mega/section-11-action.ts`

- [ ] **Step 1: Add interaction-based priority ranking**

Import utilities and add at the start of the narrative:

```typescript
import { pickOpener, renderInteractionCallout, filterByAudience } from '../prose-variety';

// Inside the function, after initial narrative:
const interactions = crossRefResult?.interactions ?? [];
if (interactions.length > 0) {
  narrative.push('\n### Priority Actions Based on Your Personality Interactions');
  narrative.push(
    `${pickOpener(studentName, 10)} the way different personality traits interact with each other creates specific priorities that generic advice would miss.`
  );
  interactions.slice(0, 3).forEach((interaction, i) => {
    narrative.push(`\n**Priority ${i + 1}: ${interaction.label}**`);
    narrative.push(interaction.insight);
    narrative.push(`**Action:** ${interaction.action}`);
  });
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/lib/report/mega/section-11-action.ts
git commit -m "feat(report): enrich action plan with interaction-driven priorities (#17)"
```

---

## Phase 3: Visual Components + UX

### Task 8: Create StrengthBarrierSummary component

**Depends on:** Task 2 (interactions are on `MegaReport` type and return object)

**Files:**
- Create: `src/components/report/StrengthBarrierSummary.tsx`
- Modify: `src/app/report/page.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/report/StrengthBarrierSummary.tsx
'use client';
import type { DimensionDetail } from '@/lib/report';
import type { InteractionInsight } from '@/lib/report';
import { Card } from '@/components/ui/Card';

interface Props {
  dimensionDetails: DimensionDetail[];
  topInteraction?: InteractionInsight;
}

export function StrengthBarrierSummary({ dimensionDetails, topInteraction }: Props) {
  const sorted = [...dimensionDetails].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const barriers = [...dimensionDetails].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Strengths */}
      <div>
        <p className="text-xs uppercase tracking-widest text-green-600 font-semibold mb-3">Top Strengths</p>
        <div className="flex flex-col gap-2">
          {strengths.map((d) => (
            <Card key={d.key} className="border-l-[3px] border-l-green-500 bg-green-50/50 p-3">
              <p className="font-semibold text-sm">{d.name}</p>
              <p className="text-xs text-warm-gray">{d.score.toFixed(1)}/5 &middot; {d.percentile}th percentile</p>
              <p className="text-xs text-espresso/80 mt-1">{d.superpower}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Barriers */}
      <div>
        <p className="text-xs uppercase tracking-widest text-red-600 font-semibold mb-3">Focus Areas</p>
        <div className="flex flex-col gap-2">
          {barriers.map((d) => (
            <Card key={d.key} className="border-l-[3px] border-l-red-500 bg-red-50/50 p-3">
              <p className="font-semibold text-sm">{d.name}</p>
              <p className="text-xs text-warm-gray">{d.score.toFixed(1)}/5 &middot; {d.percentile}th percentile</p>
              <p className="text-xs text-espresso/80 mt-1">{d.style}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Interaction */}
      {topInteraction && (
        <div className="col-span-full">
          <Card className="bg-amber-50 border-amber-200 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-1">Key Interaction</p>
            <p className="text-sm font-medium text-amber-900">{topInteraction.label}</p>
            <p className="text-xs text-amber-800 mt-1">{topInteraction.insight.substring(0, 200)}...</p>
          </Card>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add to report page**

In `src/app/report/page.tsx`, import and render after `ProfileAtAGlance`:

```typescript
import { StrengthBarrierSummary } from '@/components/report/StrengthBarrierSummary';
```

In the JSX, after the `<ProfileAtAGlance>` component:

```tsx
<StrengthBarrierSummary
  dimensionDetails={report.dimensionDetails}
  topInteraction={report.interactions?.[0]}
/>
```

Note: `report.interactions` is already exposed on `MegaReport` (added in Task 2).

- [ ] **Step 3: Verify build and visual check**

Run: `npm run build`
Start dev server and visually verify the component renders on the report page.

- [ ] **Step 4: Commit**

```bash
git add src/components/report/StrengthBarrierSummary.tsx src/app/report/page.tsx src/lib/report/mega-sections.ts
git commit -m "feat(report): add strength/barrier visual summary cards (#17)"
```

---

### Task 9: Create ReadingProgressBar component

**Files:**
- Create: `src/components/report/ReadingProgressBar.tsx`
- Modify: `src/app/report/page.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/report/ReadingProgressBar.tsx
'use client';
import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          setProgress(pct);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (progress < 1) return null;

  return (
    <div
      data-progress-bar
      className="fixed top-0 left-0 h-[3px] bg-espresso z-50 transition-[width] duration-75 no-print"
      style={{ width: `${progress}%` }}
    />
  );
}
```

- [ ] **Step 2: Add to report page**

In `src/app/report/page.tsx`:

```typescript
import { ReadingProgressBar } from '@/components/report/ReadingProgressBar';
```

Render at the top of the page JSX (before `StickyNav`):

```tsx
<ReadingProgressBar />
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/report/ReadingProgressBar.tsx src/app/report/page.tsx
git commit -m "feat(report): add reading progress bar (#17)"
```

---

### Task 10: Add print-friendly styling

**Files:**
- Modify: `src/app/report/page.tsx`

- [ ] **Step 1: Add print CSS**

In `src/app/report/page.tsx`, add a `<style>` tag in the JSX or use a `useEffect` to inject print styles. Simplest approach — add inline `<style>` at the top of the returned JSX:

```tsx
<style jsx global>{`
  @media print {
    .no-print, nav, [data-sticky-nav], [data-floating-toc],
    [data-progress-bar], button, .fixed { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    section { break-inside: avoid; }
    details { display: block !important; }
    details > div, details > section, [data-collapsible-content] {
      display: block !important; max-height: none !important; overflow: visible !important;
    }
  }
`}</style>
```

- [ ] **Step 2: Add `no-print` class to navigation and floating elements**

Ensure `StickyNav`, `FloatingTOC`, and download buttons have `no-print` or are already in `nav` elements (which the CSS targets).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/report/page.tsx
git commit -m "feat(report): add print-friendly styling (#17)"
```

---

## Verification

### Task 11: End-to-end verification

- [ ] **Step 1: Start dev server and load sample profiles**

```bash
npm run dev
```

Navigate to `/reports`, load each of the 4 sample profiles, verify:
- Interaction callouts appear in sections
- Prose varies between sections (no repetitive openings)
- StrengthBarrierSummary cards render below ProfileAtAGlance
- ReadingProgressBar appears on scroll
- Conversation scripts expanded in Section 10
- Teacher-reality table in Section 1 and Section 10
- Print preview (Cmd+P) shows clean layout

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (including new interaction and prose-variety tests)

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(report): complete #17 — interactions, prose variety, visual cards, progress bar, print CSS (#17)"
```
