# Report Overhaul — Remaining #17 Items Design

**Date**: 2026-03-31
**Ticket**: #17 — 10/10 report overhaul (personalisation, visuals, content, UX)
**Scope**: 9 remaining acceptance criteria items

## Overview

Enhance-and-extend approach: leverage the existing cross-reference engine (60+ rules) and spread proven patterns from sections that already work well. Add data (rules), templates (prose), and 3 small components.

## Implementation Phases

This spec decomposes into 3 sequential phases:

1. **Phase 1: Cross-Reference Engine Enhancement** — Add interaction rules, extend types, update `mega-sections.ts` to pass `crossRefResult` to all generators. Must complete before Phase 2.
2. **Phase 2: Section Content Enrichment** — All 11 section generators: interaction injection, facet surprises, prose variety, expanded scripts/tables. Depends on Phase 1.
3. **Phase 3: Visual Components + UX** — StrengthBarrierSummary, ReadingProgressBar, ProfileAtAGlance enhancement, print CSS. Independent of Phase 2 (can run in parallel).

## 1. Cross-Reference Engine Enhancement

**File**: `src/lib/report/cross-reference-engine.ts`

Add a new insight type `interaction` to the existing engine. 15 dimension-pair interaction rules that fire when specific score combinations are present.

### New Rules

| Combo | Label | Insight | Audience |
|-------|-------|---------|----------|
| High C (≥3.5) + Low X (<2.5) | Silent Perfectionist | Works hard, never asks for help | teacher |
| High C (≥3.5) + High E (≥3.5) | Anxious Achiever | Prepares thoroughly, still panics | parent |
| High O (≥3.5) + Low C (<2.5) | Brilliant Drifter | Full of ideas, can't finish anything | parent |
| Low X (<2.5) + High E (≥3.5) | Internal Storm | Overwhelmed but invisible to teachers | teacher |
| High X (≥3.5) + Low A (<2.5) | Dominant Debater | Confident but steamrolls peers | teacher |
| High O (≥3.5) + High X (≥3.5) | Idea Generator | Creative + social = born brainstormer | student |
| Low C (<2.5) + Low E (<2.5) | Unbothered Underperformer | Doesn't try, doesn't care | parent |
| High H (≥3.5) + High C (≥3.5) | Principled Worker | Honest + diligent = trustworthy | teacher |
| High E (≥3.5) + Low C (<2.5) | Emotional Procrastinator | Feels overwhelmed, avoids starting | parent |
| High A (≥3.5) + Low X (<2.5) | Quiet Supporter | Cooperative but invisible | teacher |
| High C (≥3.5) + Low O (<2.5) | Reliable Executor | Gets things done, never innovates | teacher |
| High O (≥3.5) + High E (≥3.5) | Sensitive Creator | Emotionally rich creative work | student |
| Low H (<2.5) + High X (≥3.5) | Social Manipulator | Charming but self-serving | parent |
| High C (≥3.5) + High O (≥3.5) | Curious Organiser | Methodical explorer | student |
| Low X (<2.5) + Low A (<2.5) | Lone Wolf | Prefers solo, resists group work | teacher |

**Fallback rule**: When no interaction fires (all scores 2.5-3.5), generate a "Balanced Profile" insight acknowledging the absence of extremes.

### Architecture: Parallel Pipeline (Not Extending Existing Rules)

The existing cross-reference engine matches HEXACO dimensions against academic profiles (studyProfile/learnerProfile). The new interaction rules match HEXACO dimensions against OTHER HEXACO dimensions — a fundamentally different kind of rule. Therefore, interaction detection runs as a **separate function** called alongside the existing engine, NOT extending `CrossRefRule`.

```typescript
// New function in cross-reference-engine.ts
export function detectDimensionInteractions(
  dims: DimensionsMap,
  studentName: string
): InteractionInsight[] { ... }

// New type — distinct from existing Insight
export interface InteractionInsight {
  label: string;        // "The Silent Perfectionist"
  insight: string;      // Personalized narrative with student name
  action: string;       // Recommended intervention
  audience: string;     // "teacher" | "parent" | "student"
  impact: number;       // 1-10, calibrated to same scale as Insight.impact
  dims: [string, string]; // ["C", "X"] — the interacting dimensions
}
```

### Output Format

`CrossRefResult` extended with a new field (not mixed into existing `byType`):

```typescript
interface CrossRefResult {
  insights: Insight[];
  byType: { root_cause: Insight[]; confirmation: Insight[]; contradiction: Insight[]; untapped: Insight[] };
  interactions: InteractionInsight[];  // NEW — separate from byType
}
```

When no interactions fire (balanced profile), the fallback rule produces a single `InteractionInsight` with label "Balanced Profile" as a post-processing step inside `detectDimensionInteractions`.

### Impact Calibration

Interaction `impact` scores use the same 1-10 scale as existing `Insight.impact`. Scores are assigned statically per rule (not computed). When interactions and insights are ranked together (e.g., in Section 11 action plan), they are merged into a single sorted array by impact.

## 2. Aha-Moment Density & Prose Variety

### Plumbing: Section Generator Signature Changes (Phase 1)

Currently only 3 of 11 generators receive `crossRefResult`. In Phase 1, `mega-sections.ts` is updated to pass it to all 11. Each generator's signature changes:

**Already receiving crossRefResult (no change needed):**
- `generateExecutiveSummaryMega(dims, studentName, archetype, crossRefResult)`
- `generateStrengthsMega(dims, studentName, crossRefResult)`
- `generateBarriersMega(dims, studentName, crossRefResult, learnerProfile)`

**Need new `crossRefResult` parameter added:**
- `generatePersonalityDeepDive(dims, studentName)` → add `crossRefResult`
- `generateLearningProfileMega(dims, studentName, studyProfile)` → add `crossRefResult`
- `generateAcademicCharacterMega(dims, studentName, learnerProfile)` → add `crossRefResult`
- `generateStudyPlaybookMega(dims, studentName, studyProfile)` → add `crossRefResult`
- `generateSocialDynamicsMega(dims, studentName)` → add `crossRefResult`
- `generateSubjectFitMega(dims, studentName, learnerProfile)` → add `crossRefResult`
- `generateGuideMega(dims, studentName)` → add `crossRefResult`
- `generateActionPlanMega(dims, studentName, crossRefResult)` → already has it (verify)

### Per-Section Enrichment

Every section generator receives the full `CrossRefResult` (including `interactions`) and uses three techniques:

**A. Interaction injection**: Pick 2-3 most relevant interaction insights for the section's topic. Render as bold-highlighted callout blocks.

**B. Facet-level surprises**: Scan for divergences (e.g., low C overall but high prudence). Render as "hidden truth" insights.

**C. Opener pool system**: Each section maintains 8-10 sentence opener templates. Selection is deterministic per student (hash of name + section index) but varied across sections.

```typescript
const OPENERS = [
  (name: string) => `What stands out immediately about ${name} is`,
  (name: string) => `The data reveals something important:`,
  (name: string) => `Here's what makes ${name} different from most students:`,
  (name: string) => `Teachers will notice that ${name}`,
  (name: string) => `At home, this shows up as`,
  (name: string) => `Perhaps the most telling indicator is`,
  (name: string) => `The research literature is clear on this:`,
  (name: string) => `This is where personality becomes academic advantage:`,
];

function pickOpener(pool: Function[], name: string, sectionIdx: number): string {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return pool[(hash + sectionIdx) % pool.length](name);
}
```

### Audience Filtering

When injecting interaction insights into sections, filter by audience relevance:
- Sections 1-9 (student/parent facing): include `audience: "parent"` and `audience: "student"` interactions
- Section 10 (guide): include all audiences, grouped by target (`### For Teachers`, `### For Parents`)
- Section 11 (action plan): include all audiences (actions are universal)

### Prose Variety Rules
- No two consecutive paragraphs start the same way
- Scores embedded mid-sentence, never as opening words
- Concrete examples replace abstract descriptions ("30-minute assignment becomes 90-minute ordeal")
- Facet comparisons (perfectionism vs diligence) not just score listings
- Dimension interaction callouts in bold with named patterns

### Section-by-Section Aha Sources

| Section | Interaction Insights | Facet Surprises | Domain-Specific |
|---------|---------------------|-----------------|-----------------|
| 1. Executive | Top 3 interactions | Top divergent facet | Archetype naming |
| 2. Personality | All relevant interactions | All 24 facets scanned | Dimension-pair narratives |
| 3. Learning | Study × personality combos | Deep vs surface mismatch | Motivation alignment |
| 4. Character | Grit × conscientiousness | Perseverance vs consistency gap | Energy paradoxes |
| 5. Study | Approach × personality fit | Strategic but surface | Method recommendations |
| 6. Strengths | Confirmation patterns | Hidden strengths (facet diverge) | Leverage strategies |
| 7. Barriers | Root cause chains | Barrier interactions | Cycle detection |
| 8. Social | Group dynamics combos | Sociability vs boldness | Peer strategy |
| 9. Subject Fit | Subject × dimension alignment | Passion-confidence gaps | Per-subject insights |
| 10. Guide | All interactions (for scripts) | Teacher perception mismatches | Conversation framing |
| 11. Action Plan | Priority ranking from interactions | Quick win identification | Timeline calibration |

## 3. Visual Components

### 3a. StrengthBarrierSummary (New Component)

**File**: `src/components/report/StrengthBarrierSummary.tsx`
**Design**: Side-by-side cards (Option A from brainstorming)
- Left column: Top 3 strengths (green accent, score + percentile + one-line impact)
- Right column: Top 3 barriers (red accent, score + one-line consequence)
- Each card has: dimension name, score, percentile/level, personality-driven description
- Placement: After ProfileAtAGlance, before detailed sections

### 3b. ProfileAtAGlance Enhancement

**Existing file**: `src/components/report/ProfileAtAGlance.tsx`
- Add StrengthBarrierSummary below existing content
- Add "key interaction" callout (highest-impact interaction from cross-ref)
- No separate dashboard component needed

### 3c. ReadingProgressBar (New Component)

**File**: `src/components/report/ReadingProgressBar.tsx`
- Fixed to top of viewport, 3px height, espresso color
- Width = `scrollY / (documentHeight - viewportHeight) * 100%`
- Only visible after scrolling past intro section
- Uses `useEffect` with scroll event listener (throttled)
- Tagged with `data-progress-bar` for print CSS exclusion

### 3d. Print-Friendly Styling

**Location**: Added to report page or global CSS
```css
@media print {
  .no-print, nav, [data-sticky-nav], [data-floating-toc],
  [data-progress-bar], button { display: none !important; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .bg-espresso { background: #2c2417 !important; color: white !important; }
  section { break-inside: avoid; page-break-inside: avoid; }
  .collapsible-content { display: block !important; max-height: none !important; }
}
```

## 4. Section 10 Expansion — Conversation Scripts

### New Scenarios (conditional on dimension scores)

| Scenario | Triggers When | Format |
|----------|--------------|--------|
| After a bad grade | Always (framed by E score) | Parent → Student → Parent redirect |
| About subject choices | Always (framed by O score) | Exploratory questions + personality guidance |
| About effort & consistency | C < 2.5 OR C ≥ 4.0 | Reframing effort as skill vs character |
| When they want to quit | O or X driven | Interest consistency check |
| About social struggles | X < 2.5 OR A < 2.5 | Normalizing personality preferences |

Each script follows the existing format: `*Parent:* "..." → *Student:* "..." → *Parent:* "..." → **Why it works:** explanation referencing specific dimensions.

## 5. Teacher-vs-Reality Table

### Brief Version (Section 1 — Executive Summary)
3-4 rows, highest-impact misperceptions for this student. Expands existing table.

### Full Version (Section 10 — Teacher Guide)
8-10 rows, all relevant dimension-driven misperceptions. Each row conditionally generated.

| What Teachers See | What's Actually Happening | Personality Driver |
|---|---|---|
| "Doesn't participate" | Anxiety about being wrong + introversion | Low X + High E |
| "Lazy, doesn't try" | Executive function deficit, not motivation | Low C (not low effort) |
| "Distracted, off-task" | Needs novelty, bored by repetition | High O + Low C |
| "Perfect student" | Burning out internally, afraid to fail | High C + High E |
| "Argumentative" | Thinks critically, values honest debate | Low A + High O |
| "Doesn't care about grades" | Intrinsically motivated, extrinsic grades meaningless | High intrinsic + low identified |
| "Class clown" | Social energy with no productive outlet | High X + Low C |
| "Anti-social" | Prefers depth over breadth in relationships | Low X (not anti-social) |

## 6. Non-Goals

- No changes to quiz flow or scoring
- No new mega-sections (stay at 11)
- No PDF-specific rendering of new components (web-only for now)
- Progress bar for web only, not print/PDF
- Moderate profiles (all 2.5-3.5) get a balanced-profile insight, not empty sections

## 7. Files Changed

| File | Change |
|------|--------|
| `src/lib/report/cross-reference-engine.ts` | Add interaction rules + balanced fallback |
| `src/lib/report/mega-sections.ts` | Pass crossRefResult to all section generators |
| `src/lib/report/mega/section-01-executive.ts` | Expand teacher table, add interaction callouts, prose variety |
| `src/lib/report/mega/section-02-personality.ts` | Add interactions, facet surprises, prose variety |
| `src/lib/report/mega/section-03-learning.ts` | Add study×personality interactions, prose variety |
| `src/lib/report/mega/section-04-character.ts` | Add grit×personality interactions, prose variety |
| `src/lib/report/mega/section-05-study.ts` | Add approach×personality interactions, prose variety |
| `src/lib/report/mega/section-06-strengths.ts` | Add interaction callouts, hidden strengths, prose variety |
| `src/lib/report/mega/section-07-barriers.ts` | Add interaction-driven root causes, prose variety |
| `src/lib/report/mega/section-08-social.ts` | Add group dynamics interactions, prose variety |
| `src/lib/report/mega/section-09-subject-fit.ts` | Add subject×dimension interactions, prose variety |
| `src/lib/report/mega/section-10-guide.ts` | Expand scripts, add full teacher table, prose variety |
| `src/lib/report/mega/section-11-action.ts` | Priority from interactions, prose variety |
| `src/components/report/StrengthBarrierSummary.tsx` | NEW — side-by-side cards |
| `src/components/report/ReadingProgressBar.tsx` | NEW — thin scroll progress |
| `src/app/report/page.tsx` | Add new components, print CSS |
