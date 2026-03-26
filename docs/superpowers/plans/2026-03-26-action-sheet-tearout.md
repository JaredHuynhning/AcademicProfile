# Action Sheet Tear-Out Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated "What To Do Monday" tear-out component that renders the action plan data with visual distinction in both the web report and PDF.

**Architecture:** Two new components — `ActionSheet.tsx` (web) and `PDFActionSheet.tsx` (PDF) — each consuming the existing `generateActionPlan()` output. A shared parser module extracts structured fields from the generator's concatenated description strings. Web report page and PDF document conditionally render these components when the section key is `actionPlan`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, @react-pdf/renderer, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/report/action-sheet-parser.ts` | Create | Parse description strings into structured display fields |
| `tests/lib/report/action-sheet-parser.test.ts` | Create | Unit tests for parser |
| `src/components/report/ActionSheet.tsx` | Create | Web tear-out component |
| `src/components/pdf/PDFActionSheet.tsx` | Create | PDF tear-out component |
| `src/app/report/page.tsx` | Modify | Conditionally render `ActionSheet` for `actionPlan` key |
| `src/components/pdf/ReportPDF.tsx` | Modify | Conditionally render `PDFActionSheet` for `actionPlan` key |

---

### Task 1: Action Sheet Parser — Tests

**Files:**
- Create: `tests/lib/report/action-sheet-parser.test.ts`

The generator embeds structured info in prose strings. We need a parser to extract display-ready fields.

- [ ] **Step 1: Write failing tests for parseTopAction**

```typescript
// tests/lib/report/action-sheet-parser.test.ts
import { describe, it, expect } from 'vitest';
import { parseTopAction, parseQuickWin, parseStopDoing, parseWeeklyRhythm } from '@/lib/report/action-sheet-parser';

describe('parseTopAction', () => {
  it('extracts action and why from a standard description', () => {
    const desc = 'Priority 1: Set up a structured note system. Why: Your low organisation connects to scattered study patterns. This connects your organisation (Conscientiousness) personality trait to your study-method study pattern. Addressing this first will have the biggest impact on your academic performance.';
    const result = parseTopAction(desc);
    expect(result.action).toBe('Set up a structured note system');
    expect(result.why).toContain('Your low organisation connects to scattered study patterns');
  });

  it('handles description without Why: prefix', () => {
    const desc = 'Priority 2: Study with a peer after school. This connects your extraversion personality trait to social learning.';
    const result = parseTopAction(desc);
    expect(result.action).toBe('Study with a peer after school');
    expect(result.why).toBeTruthy();
  });
});

describe('parseQuickWin', () => {
  it('extracts action from quick win description', () => {
    const desc = 'Use teach-back method with a friend. This builds on a confirmed strength: Your openness drives curiosity-based learning.';
    const result = parseQuickWin(desc);
    expect(result.action).toBe('Use teach-back method with a friend');
  });
});

describe('parseStopDoing', () => {
  it('extracts stop and instead from Stop: format', () => {
    const desc = 'Stop: Re-reading without testing yourself. Instead: Close notes and force recall. This change addresses the root cause rather than just the symptom.';
    const result = parseStopDoing(desc);
    expect(result.stop).toBe('Re-reading without testing yourself');
    expect(result.instead).toContain('Close notes and force recall');
  });

  it('extracts watchFor and rootCause from Watch for: format', () => {
    const desc = 'Watch for: Cramming the night before exams. Root cause: Surface approach leads to last-minute panic. Space your study across 4 weeks.';
    const result = parseStopDoing(desc);
    expect(result.stop).toBe('Cramming the night before exams');
    expect(result.instead).toBeTruthy();
  });
});

describe('parseWeeklyRhythm', () => {
  it('splits weekday and weekend from description', () => {
    const desc = 'After school: 30-45 min study with a peer or group. Evening: 45-60 min independent focused review. Saturday: deep-dive one topic — read beyond the notes, ask questions. Sunday: light review + plan the coming week. Consistency matters more than duration. Three 30-minute sessions beat one 3-hour cramming session every time.';
    const result = parseWeeklyRhythm(desc);
    expect(result.weekday).toContain('After school');
    expect(result.weekend).toContain('Saturday');
    expect(result.closing).toContain('Consistency');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/lib/report/action-sheet-parser.test.ts`
Expected: FAIL — module `@/lib/report/action-sheet-parser` not found

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/lib/report/action-sheet-parser.test.ts
git commit -m "test(action-sheet): add parser unit tests (red)"
```

---

### Task 2: Action Sheet Parser — Implementation

**Files:**
- Create: `src/lib/report/action-sheet-parser.ts`

- [ ] **Step 1: Implement the parser functions**

```typescript
// src/lib/report/action-sheet-parser.ts

/**
 * Parsers for section-c6-action-plan description strings.
 * Extracts structured display fields from concatenated prose.
 */

export interface ParsedTopAction {
  action: string;
  why: string;
}

export interface ParsedQuickWin {
  action: string;
}

export interface ParsedStopDoing {
  stop: string;
  instead: string;
}

export interface ParsedWeeklyRhythm {
  weekday: string;
  weekend: string;
  closing: string;
}

/**
 * Parse "Priority N: {action}. Why: {insight}. This connects..." into action + why.
 */
export function parseTopAction(description: string): ParsedTopAction {
  // Strip "Priority N: " prefix
  const withoutPrefix = description.replace(/^Priority \d+:\s*/, '');

  // Split on ". Why: " if present
  const whyIndex = withoutPrefix.indexOf('. Why: ');
  if (whyIndex !== -1) {
    const action = withoutPrefix.slice(0, whyIndex);
    // Get the "why" up to ". This connects" or end
    const rest = withoutPrefix.slice(whyIndex + 7); // skip ". Why: "
    const connectsIndex = rest.indexOf('. This connects');
    const why = connectsIndex !== -1 ? rest.slice(0, connectsIndex) : rest.split('. ')[0];
    return { action, why };
  }

  // Fallback: first sentence is action, rest is why
  const firstDot = withoutPrefix.indexOf('. ');
  if (firstDot !== -1) {
    return {
      action: withoutPrefix.slice(0, firstDot),
      why: withoutPrefix.slice(firstDot + 2),
    };
  }

  return { action: withoutPrefix, why: '' };
}

/**
 * Parse "{action}. This builds on a confirmed strength: {insight}" into action.
 */
export function parseQuickWin(description: string): ParsedQuickWin {
  const marker = '. This builds on';
  const idx = description.indexOf(marker);
  const action = idx !== -1 ? description.slice(0, idx) : description.split('. ')[0];
  return { action };
}

/**
 * Parse "Stop: {habit}. Instead: {alternative}." or "Watch for: {behaviour}. Root cause: ..." into stop + instead.
 */
export function parseStopDoing(description: string): ParsedStopDoing {
  // "Stop: X. Instead: Y." format
  const stopMatch = description.match(/^Stop:\s*(.+?)\.\s*Instead:\s*(.+?)(?:\.\s*This change|$)/);
  if (stopMatch) {
    return { stop: stopMatch[1], instead: stopMatch[2] };
  }

  // "Watch for: X. Root cause: Y. Z" format
  const watchMatch = description.match(/^Watch for:\s*(.+?)\.\s*Root cause:\s*(.+?)\.?\s*(.*)/);
  if (watchMatch) {
    const instead = watchMatch[3] || watchMatch[2];
    return { stop: watchMatch[1], instead };
  }

  // Fallback
  const firstDot = description.indexOf('. ');
  if (firstDot !== -1) {
    return { stop: description.slice(0, firstDot), instead: description.slice(firstDot + 2) };
  }
  return { stop: description, instead: '' };
}

/**
 * Parse weekly rhythm description into weekday, weekend, and closing line.
 */
export function parseWeeklyRhythm(description: string): ParsedWeeklyRhythm {
  // Find where weekend starts (Saturday or Sunday)
  const satIndex = description.indexOf('Saturday:');
  const sunIndex = description.indexOf('Sunday:');
  const weekendStart = satIndex !== -1 ? satIndex : sunIndex;

  // Find the closing motivational line ("Consistency...")
  const closingIndex = description.indexOf('Consistency');

  if (weekendStart !== -1 && closingIndex !== -1) {
    return {
      weekday: description.slice(0, weekendStart).trim(),
      weekend: description.slice(weekendStart, closingIndex).trim(),
      closing: description.slice(closingIndex).trim(),
    };
  }

  if (weekendStart !== -1) {
    return {
      weekday: description.slice(0, weekendStart).trim(),
      weekend: description.slice(weekendStart).trim(),
      closing: '',
    };
  }

  return { weekday: description, weekend: '', closing: '' };
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run tests/lib/report/action-sheet-parser.test.ts`
Expected: PASS — all 5 tests green

- [ ] **Step 3: Commit**

```bash
git add src/lib/report/action-sheet-parser.ts tests/lib/report/action-sheet-parser.test.ts
git commit -m "feat(action-sheet): add parser for action plan descriptions"
```

---

### Task 3: Web ActionSheet Component

**Files:**
- Create: `src/components/report/ActionSheet.tsx`

- [ ] **Step 1: Create the ActionSheet component**

```tsx
// src/components/report/ActionSheet.tsx
"use client";

import {
  parseTopAction,
  parseQuickWin,
  parseStopDoing,
  parseWeeklyRhythm,
} from "@/lib/report/action-sheet-parser";

interface ActionSheetProps {
  data: {
    topActions: Array<{ rank: number; description: string }>;
    quickWins: Array<{ description: string }>;
    studyPrescription: { method: string; rationale: string };
    stopDoing: Array<{ description: string }>;
    weeklyRhythm: { description: string };
  };
  studentName: string;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2.5 border-b border-warm-gray/15 pb-1">
      {children}
    </div>
  );
}

export function ActionSheet({ data, studentName }: ActionSheetProps) {
  const actions = data.topActions.map((a) => ({
    rank: a.rank,
    ...parseTopAction(a.description),
  }));
  const quickWins = data.quickWins.map((q) => parseQuickWin(q.description));
  const stopItems = data.stopDoing.map((s) => parseStopDoing(s.description));
  const rhythm = parseWeeklyRhythm(data.weeklyRhythm.description);

  return (
    <div className="relative border-2 border-dashed border-warm-gray rounded-xl bg-gradient-to-br from-[#faf5eb] to-[#f7f0e3] p-7">
      {/* Scissors */}
      <span className="absolute -top-3 left-5 bg-[#faf5eb] px-2 text-base">
        ✂️
      </span>

      {/* Header */}
      <div className="text-center mb-6 pt-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-warm-gray">
          What To Do Monday
        </p>
        <h3 className="font-display text-xl font-extrabold text-espresso mt-1">
          Your Action Plan
        </h3>
        <p className="text-xs text-warm-gray mt-1">
          Personalised for{" "}
          <strong className="text-espresso">{studentName}</strong> — based on
          your HEXACO profile
        </p>
      </div>

      {/* Priority Actions */}
      <div className="mb-5">
        <SectionLabel>Priority Actions</SectionLabel>
        <div className="space-y-3">
          {actions.map((a) => (
            <div key={a.rank} className="flex gap-2.5 items-start">
              <span className="w-7 h-7 rounded-full bg-espresso text-cream flex items-center justify-center font-bold text-sm shrink-0">
                {a.rank}
              </span>
              <div>
                <p className="font-bold text-[13px] text-espresso leading-snug">
                  {a.action}
                </p>
                {a.why && (
                  <p className="text-[11px] text-warm-gray mt-0.5 leading-relaxed">
                    Why: {a.why}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Prescription */}
      <div className="mb-5">
        <SectionLabel>Study Prescription</SectionLabel>
        <div className="border-l-[3px] border-espresso pl-3.5">
          <p className="font-bold text-[15px] text-espresso">
            {data.studyPrescription.method}
          </p>
          <p className="text-xs text-warm-gray mt-1 leading-relaxed">
            {data.studyPrescription.rationale}
          </p>
        </div>
      </div>

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Quick Wins</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickWins.map((q, i) => (
              <div
                key={i}
                className="bg-white/60 rounded-lg px-3 py-2.5 text-[11px] text-espresso leading-relaxed"
              >
                <span className="text-[#7a8a5e] font-bold mr-1.5">✓</span>
                {q.action}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stop Doing */}
      {stopItems.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Stop Doing</SectionLabel>
          <div className="space-y-1.5 text-xs leading-relaxed">
            {stopItems.map((s, i) => (
              <p key={i}>
                🚫{" "}
                <span className="line-through text-warm-gray">{s.stop}</span>
                {s.instead && (
                  <span className="text-espresso"> — instead, {s.instead}</span>
                )}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Rhythm */}
      <div>
        <SectionLabel>Weekly Rhythm</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {rhythm.weekday && (
            <div className="bg-white/60 rounded-lg px-3 py-2.5">
              <p className="font-bold text-espresso mb-1">Mon — Fri</p>
              <p className="text-espresso/80 leading-relaxed">
                {rhythm.weekday}
              </p>
            </div>
          )}
          {rhythm.weekend && (
            <div className="bg-white/60 rounded-lg px-3 py-2.5">
              <p className="font-bold text-espresso mb-1">Weekend</p>
              <p className="text-espresso/80 leading-relaxed">
                {rhythm.weekend}
              </p>
            </div>
          )}
        </div>
        {rhythm.closing && (
          <p className="text-center text-[11px] text-warm-gray italic mt-2.5">
            {rhythm.closing}
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/ActionSheet.tsx
git commit -m "feat(action-sheet): add web ActionSheet tear-out component"
```

---

### Task 4: Integrate ActionSheet into Web Report

**Files:**
- Modify: `src/app/report/page.tsx`

- [ ] **Step 1: Add import for ActionSheet**

At the top of `src/app/report/page.tsx`, after the existing component imports (around line 17):

```typescript
import { ActionSheet } from "@/components/report/ActionSheet";
```

- [ ] **Step 2: Replace generic rendering for actionPlan section**

In the section rendering loop (around line 790-803), replace the current conditional:

```tsx
{sectionDef.isCover ? (
  <CoverSection data={data} />
) : (
  <SectionContent data={data} />
)}
```

With:

```tsx
{sectionDef.isCover ? (
  <CoverSection data={data} />
) : sectionDef.key === "actionPlan" ? (
  <ActionSheet
    data={data as ActionSheetProps["data"]}
    studentName={name || "Student"}
  />
) : (
  <SectionContent data={data} />
)}
```

Also add the type import near the top:

```typescript
import type { ActionSheetProps } from "@/components/report/ActionSheet";
```

Note: Export the `ActionSheetProps` interface from `ActionSheet.tsx` by adding `export` before it.

- [ ] **Step 3: Verify the dev server renders correctly**

Run: `npm run dev`
Navigate to: `http://localhost:3000/report` (complete a full assessment first or use existing results)
Expected: The "Your Action Plan" section now shows the dashed-border tear-out card instead of generic bullet points.

- [ ] **Step 4: Commit**

```bash
git add src/app/report/page.tsx src/components/report/ActionSheet.tsx
git commit -m "feat(action-sheet): integrate tear-out into web report page"
```

---

### Task 5: PDF ActionSheet Component

**Files:**
- Create: `src/components/pdf/PDFActionSheet.tsx`

- [ ] **Step 1: Create the PDF tear-out component**

```tsx
// src/components/pdf/PDFActionSheet.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import {
  parseTopAction,
  parseQuickWin,
  parseStopDoing,
  parseWeeklyRhythm,
} from "@/lib/report/action-sheet-parser";

const ESPRESSO = "#2c2417";
const WARM_GRAY = "#8b7355";
const PARCHMENT = "#faf5eb";
const BORDER = "#e8e0d4";
const GREEN = "#7a8a5e";

const s = StyleSheet.create({
  container: {
    margin: 20,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: WARM_GRAY,
    borderRadius: 10,
    backgroundColor: PARCHMENT,
  },
  scissors: {
    position: "absolute",
    top: -8,
    left: 20,
    fontSize: 12,
    backgroundColor: PARCHMENT,
    paddingHorizontal: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 3,
    color: WARM_GRAY,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: ESPRESSO,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 9,
    color: WARM_GRAY,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: WARM_GRAY,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 3,
  },
  section: {
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  actionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ESPRESSO,
    justifyContent: "center",
    alignItems: "center",
  },
  actionCircleText: {
    color: "#fdfbf7",
    fontSize: 10,
    fontWeight: "bold",
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: ESPRESSO,
  },
  actionWhy: {
    fontSize: 8,
    color: WARM_GRAY,
    marginTop: 1,
  },
  prescriptionBorder: {
    borderLeftWidth: 3,
    borderLeftColor: ESPRESSO,
    paddingLeft: 10,
  },
  prescriptionMethod: {
    fontSize: 12,
    fontWeight: "bold",
    color: ESPRESSO,
  },
  prescriptionRationale: {
    fontSize: 8,
    color: WARM_GRAY,
    marginTop: 3,
    lineHeight: 1.5,
  },
  quickWinGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  quickWinCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 6,
    padding: 8,
  },
  quickWinText: {
    fontSize: 8,
    color: ESPRESSO,
  },
  stopItem: {
    fontSize: 9,
    color: ESPRESSO,
    marginBottom: 3,
  },
  rhythmGrid: {
    flexDirection: "row",
    gap: 6,
  },
  rhythmCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 6,
    padding: 8,
  },
  rhythmLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 3,
  },
  rhythmText: {
    fontSize: 8,
    color: ESPRESSO,
    lineHeight: 1.4,
  },
  closing: {
    fontSize: 8,
    color: WARM_GRAY,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 6,
  },
});

interface PDFActionSheetProps {
  data: {
    topActions: Array<{ rank: number; description: string }>;
    quickWins: Array<{ description: string }>;
    studyPrescription: { method: string; rationale: string };
    stopDoing: Array<{ description: string }>;
    weeklyRhythm: { description: string };
  };
  studentName: string;
}

export function PDFActionSheet({ data, studentName }: PDFActionSheetProps) {
  const actions = data.topActions.map((a) => ({
    rank: a.rank,
    ...parseTopAction(a.description),
  }));
  const quickWins = data.quickWins.map((q) => parseQuickWin(q.description));
  const stopItems = data.stopDoing.map((si) => parseStopDoing(si.description));
  const rhythm = parseWeeklyRhythm(data.weeklyRhythm.description);

  return (
    <View style={s.container}>
      <Text style={s.scissors}>✂</Text>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.eyebrow}>What To Do Monday</Text>
        <Text style={s.title}>Your Action Plan</Text>
        <Text style={s.subtitle}>
          Personalised for {studentName} — based on your HEXACO profile
        </Text>
      </View>

      {/* Priority Actions */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Priority Actions</Text>
        {actions.map((a) => (
          <View key={a.rank} style={s.actionRow}>
            <View style={s.actionCircle}>
              <Text style={s.actionCircleText}>{a.rank}</Text>
            </View>
            <View style={s.actionText}>
              <Text style={s.actionTitle}>{a.action}</Text>
              {a.why ? (
                <Text style={s.actionWhy}>Why: {a.why}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      {/* Study Prescription */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Study Prescription</Text>
        <View style={s.prescriptionBorder}>
          <Text style={s.prescriptionMethod}>
            {data.studyPrescription.method}
          </Text>
          <Text style={s.prescriptionRationale}>
            {data.studyPrescription.rationale}
          </Text>
        </View>
      </View>

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>Quick Wins</Text>
          <View style={s.quickWinGrid}>
            {quickWins.map((q, i) => (
              <View key={i} style={s.quickWinCard}>
                <Text style={s.quickWinText}>✓ {q.action}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Stop Doing */}
      {stopItems.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>Stop Doing</Text>
          {stopItems.map((si, i) => (
            <Text key={i} style={s.stopItem}>
              ✕ {si.stop}{si.instead ? ` — instead, ${si.instead}` : ""}
            </Text>
          ))}
        </View>
      )}

      {/* Weekly Rhythm */}
      <View>
        <Text style={s.sectionLabel}>Weekly Rhythm</Text>
        <View style={s.rhythmGrid}>
          {rhythm.weekday ? (
            <View style={s.rhythmCard}>
              <Text style={s.rhythmLabel}>Mon — Fri</Text>
              <Text style={s.rhythmText}>{rhythm.weekday}</Text>
            </View>
          ) : null}
          {rhythm.weekend ? (
            <View style={s.rhythmCard}>
              <Text style={s.rhythmLabel}>Weekend</Text>
              <Text style={s.rhythmText}>{rhythm.weekend}</Text>
            </View>
          ) : null}
        </View>
        {rhythm.closing ? (
          <Text style={s.closing}>{rhythm.closing}</Text>
        ) : null}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pdf/PDFActionSheet.tsx
git commit -m "feat(action-sheet): add PDF tear-out component"
```

---

### Task 6: Integrate PDFActionSheet into ReportPDF

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

- [ ] **Step 1: Add import**

At the top of `ReportPDF.tsx`, after the `PDFRadarChart` import (line 4):

```typescript
import { PDFActionSheet } from "./PDFActionSheet";
```

- [ ] **Step 2: Replace generic rendering for actionPlan in the section loop**

In the `activeSections.map()` loop (around line 750-773), replace the current generic rendering:

```tsx
return (
  <Page key={sectionDef.key} size="A4" style={styles.page} wrap>
    {/* Section header */}
    <View style={styles.sectionHeader} wrap={false} minPresenceAhead={80}>
      <Text style={styles.sectionTitle}>{sectionDef.title}</Text>
    </View>

    {/* Section content */}
    {contentElements}

    <View style={styles.footer} fixed>
      <Text>{name} — Academic Profile</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  </Page>
);
```

With a conditional for the actionPlan key:

```tsx
if (sectionDef.key === "actionPlan") {
  return (
    <Page key={sectionDef.key} size="A4" style={styles.page} wrap={false}>
      <PDFActionSheet data={data as any} studentName={name || "Student"} />
      <View style={styles.footer} fixed>
        <Text>{name} — Academic Profile</Text>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

return (
  <Page key={sectionDef.key} size="A4" style={styles.page} wrap>
    <View style={styles.sectionHeader} wrap={false} minPresenceAhead={80}>
      <Text style={styles.sectionTitle}>{sectionDef.title}</Text>
    </View>
    {contentElements}
    <View style={styles.footer} fixed>
      <Text>{name} — Academic Profile</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  </Page>
);
```

Note: `wrap={false}` on the action sheet page ensures it stays on a single page.

- [ ] **Step 3: Verify PDF renders correctly**

Run: `npm run dev`
Navigate to report page, click "Download PDF". Open the PDF and verify the action plan page has the dashed-border tear-out style.

- [ ] **Step 4: Commit**

```bash
git add src/components/pdf/ReportPDF.tsx
git commit -m "feat(action-sheet): integrate PDF tear-out into report PDF"
```

---

### Task 7: Run Full Test Suite + Verify

**Files:** None (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing + new parser tests)

- [ ] **Step 2: Run type checker**

Run: `npx tsc --noEmit`
Expected: No type errors (note: section-c6-action-plan.ts has `@ts-nocheck`, so types are relaxed there)

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "chore(action-sheet): fix any type/lint issues from integration"
```

### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup: dev server | `npm run dev &` then `curl -s localhost:3000` | HTML response |
| Parser tests pass | `npx vitest run tests/lib/report/action-sheet-parser.test.ts` | 5 tests, 0 failures |
| Full test suite | `npx vitest run` | 0 failures |
| Type check | `npx tsc --noEmit` | Exit code 0 |
| Build | `npm run build` | Exit code 0 |
| Web: action plan renders as tear-out | Navigate to /report with complete results, scroll to "Your Action Plan" | Dashed-border card with numbered actions, not generic bullets |
| PDF: action plan renders as tear-out | Download PDF, open action plan page | Dashed-border page with scissors, numbered actions, prescription, quick wins |
| Health: no regressions | All other report sections render unchanged | Sections unaffected |
