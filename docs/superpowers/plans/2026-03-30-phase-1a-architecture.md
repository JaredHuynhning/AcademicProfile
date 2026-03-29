# Phase 1a: PDF Fixes + Report Architecture Refactor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the report from 23 thin sections to 12 mega-sections, fix PDF rendering bugs, and create the new generator/renderer architecture that Phase 1b-3 will fill with deep content.

**Architecture:** New `MegaSection` data shape consumed by both web and PDF renderers. Old generators still run but their output is funneled through consolidation functions into the 12 mega-sections. Content expansion happens in Phase 1b-3 — this phase only restructures.

**Tech Stack:** TypeScript, React, react-pdf/renderer, Next.js App Router

**Assumptions:**
- Assumes the existing 23 generators produce correct data — will NOT rewrite generator logic
- Assumes Complete assessment mode only (per ticket #13) — will NOT handle personality-only or learning-only modes in the new architecture
- Assumes react-pdf can handle 50+ pages without performance issues — will NOT add server-side rendering yet

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/lib/report/mega-sections.ts` | MegaSection type definition + consolidation functions (23→12) |
| Modify | `src/lib/report/index.ts` | New `generateMegaReport()` entry point that calls existing generators then consolidates |
| Modify | `src/app/report/page.tsx` | Render 12 mega-sections instead of 23 raw sections |
| Modify | `src/components/pdf/ReportPDF.tsx` | PDF renderer for 12 mega-sections + all 9 rendering fixes |

---

### Task 1: Define MegaSection types

**Files:**
- Create: `src/lib/report/mega-sections.ts`

**Does NOT cover:** Content expansion — this only defines the data shape. Actual deep content is Phase 1b.

- [ ] **Step 1: Create the MegaSection type file**

```typescript
// src/lib/report/mega-sections.ts
/**
 * Mega-section data shapes for the 50-page report.
 * Each mega-section consolidates 1-4 old section generators.
 */

export interface Finding {
  title: string;
  text: string;
  type: 'strength' | 'barrier' | 'insight' | 'warning' | 'action';
  color?: string;
}

export interface CrossRef {
  targetSection: string;
  text: string;
}

export interface Action {
  title: string;
  description: string;
  priority: number;
}

export interface ResearchNote {
  text: string;
  topic: string;
}

export interface MegaSectionContent {
  narrative: string[];        // Paragraphs of flowing analysis
  keyFindings: Finding[];     // Structured data for callouts/cards
  researchNotes: ResearchNote[]; // "Research shows..." sentences
  scenarios: string[];        // "In the classroom..." examples
  crossReferences: CrossRef[];   // Links to other sections
  actions: Action[];          // Specific, named strategies
}

export interface MegaSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  content: MegaSectionContent;
  subsections?: { title: string; content: MegaSectionContent }[];
  /** Raw data from old generators — available for custom rendering */
  rawData?: Record<string, unknown>;
}

export interface MegaReport {
  studentName: string;
  date: string;
  archetype: string;
  sections: MegaSection[];
  /** Radar chart data for cover */
  radarData: { dim: string; score: number; color: string }[];
  /** Score summary for cover dashboard */
  scoreSummary: { dim: string; score: number; percentile: number; level: string; label: string; color: string }[];
}
```

- [ ] **Step 2: Verify file compiles**

Run: `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile && npx tsc --noEmit src/lib/report/mega-sections.ts 2>&1 | head -5`
Expected: No errors (or only errors from missing imports in other files)

- [ ] **Step 3: Commit**

```bash
git add src/lib/report/mega-sections.ts
git commit -m "feat(report): define MegaSection types for 12-section architecture"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile` | Directory exists |
| File exists | `test -f src/lib/report/mega-sections.ts && echo OK` | `OK` |
| Exports MegaReport | `grep 'export interface MegaReport' src/lib/report/mega-sections.ts` | Match found |
| Exports MegaSection | `grep 'export interface MegaSection' src/lib/report/mega-sections.ts` | Match found |
| Exports MegaSectionContent | `grep 'export interface MegaSectionContent' src/lib/report/mega-sections.ts` | Match found |
| Health: build | `npm run build 2>&1 \| tail -3` | "Compiled successfully" or exit 0 |

---

### Task 2: Create consolidation functions (23 → 12 mega-sections)

**Files:**
- Modify: `src/lib/report/mega-sections.ts` (add consolidation functions)

**Does NOT cover:** Deep content generation — consolidation functions take existing generator output and restructure it. They do NOT add new narratives yet.

- [ ] **Step 1: Add consolidation functions to mega-sections.ts**

Add these functions after the type definitions:

```typescript
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, DIM_SHORT, scorePercentile, interpretiveLabel, formatScore } from './helpers';

/**
 * Consolidate raw section data into 12 mega-sections.
 * Phase 1a: pass-through of existing content in new structure.
 * Phase 1b+: generators produce deeper content directly.
 */
export function consolidateToMegaReport(
  rawReport: Record<string, unknown>,
  studentName: string,
): MegaReport {
  const sections: MegaSection[] = [];
  const dims = rawReport.dimensions as Record<string, { score: number; name: string; level: string; facets: Record<string, { score: number }> }> | null;

  // Build radar + score summary from dimensions
  const radarData: MegaReport['radarData'] = [];
  const scoreSummary: MegaReport['scoreSummary'] = [];
  if (dims) {
    for (const key of DIM_ORDER) {
      const d = dims[key];
      if (!d) continue;
      radarData.push({ dim: DIM_SHORT[key], score: d.score, color: DIM_COLORS[key] });
      scoreSummary.push({
        dim: DIM_NAMES[key],
        score: d.score,
        percentile: scorePercentile(d.score),
        level: d.level,
        label: interpretiveLabel(d.score),
        color: DIM_COLORS[key],
      });
    }
  }

  // Section 1: Cover + Executive Summary
  const execData = rawReport.executiveSummary as Record<string, unknown> | null;
  const coverData = rawReport.cover as Record<string, unknown> | null;
  const glanceData = rawReport.glance as Record<string, unknown> | null;
  sections.push({
    id: 'cover-summary',
    title: 'Executive Summary',
    icon: '📊',
    content: {
      narrative: [
        (execData?.narrative as string) || `${studentName}'s complete academic personality profile.`,
      ],
      keyFindings: [
        ...(execData?.topStrength ? [{ title: 'Top Strength', text: (execData.topStrength as any)?.insight || '', type: 'strength' as const, color: '#22c55e' }] : []),
        ...(execData?.topBarrier ? [{ title: 'Top Barrier', text: (execData.topBarrier as any)?.insight || '', type: 'barrier' as const, color: '#f59e0b' }] : []),
      ],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: execData?.topAction ? [{ title: 'Priority Action', description: execData.topAction as string, priority: 1 }] : [],
    },
    rawData: { executiveSummary: execData, cover: coverData, glance: glanceData },
  });

  // Section 2: Who You Are — Personality Deep Dive
  const deepDiveData = rawReport.deepDive as Record<string, unknown> | null;
  const whoYouAreData = rawReport.whoYouAre as Record<string, unknown> | null;
  sections.push({
    id: 'personality-deep-dive',
    title: 'Who You Are',
    subtitle: 'Personality Deep Dive',
    icon: '🧠',
    content: {
      narrative: extractNarratives(deepDiveData) || extractNarratives(whoYouAreData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { deepDive: deepDiveData, whoYouAre: whoYouAreData },
  });

  // Section 3: How Your Mind Works — Learning Profile
  const learningData = rawReport.learning as Record<string, unknown> | null;
  const howYouLearnData = rawReport.howYouLearn as Record<string, unknown> | null;
  const studyProfileData = rawReport.studyProfile as Record<string, unknown> | null;
  sections.push({
    id: 'learning-profile',
    title: 'How Your Mind Works',
    subtitle: 'Learning Profile',
    icon: '💡',
    content: {
      narrative: extractNarratives(learningData) || extractNarratives(howYouLearnData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { learning: learningData, howYouLearn: howYouLearnData, studyProfile: studyProfileData },
  });

  // Section 4: Academic Character & Drive
  const academicCharData = rawReport.academicCharacter as Record<string, unknown> | null;
  const drivesData = rawReport.drives as Record<string, unknown> | null;
  sections.push({
    id: 'academic-character',
    title: 'Academic Character & Drive',
    icon: '🔥',
    content: {
      narrative: extractNarratives(academicCharData) || extractNarratives(drivesData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { academicCharacter: academicCharData, drives: drivesData },
  });

  // Section 5: Study Strategy Playbook
  const studyData = rawReport.study as Record<string, unknown> | null;
  const whatWorksData = rawReport.whatWorks as Record<string, unknown> | null;
  sections.push({
    id: 'study-playbook',
    title: 'Study Strategy Playbook',
    icon: '📚',
    content: {
      narrative: extractNarratives(studyData) || extractNarratives(whatWorksData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { study: studyData, whatWorks: whatWorksData },
  });

  // Section 6: Strengths & Superpowers
  const strengthsData = rawReport.strengths as Record<string, unknown> | null;
  const whatsWorkingData = rawReport.whatsWorking as Record<string, unknown> | null;
  sections.push({
    id: 'strengths',
    title: 'Strengths & Superpowers',
    icon: '💪',
    content: {
      narrative: extractNarratives(strengthsData) || extractNarratives(whatsWorkingData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { strengths: strengthsData, whatsWorking: whatsWorkingData },
  });

  // Section 7: Barriers & Root Causes
  const barriersData = rawReport.barriers as Record<string, unknown> | null;
  const rootCauseData = rawReport.rootCause as Record<string, unknown> | null;
  sections.push({
    id: 'barriers',
    title: 'Barriers & Root Causes',
    icon: '🚧',
    content: {
      narrative: extractNarratives(barriersData) || extractNarratives(rootCauseData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { barriers: barriersData, rootCause: rootCauseData },
  });

  // Section 8: Social & Group Dynamics
  const groupData = rawReport.group as Record<string, unknown> | null;
  sections.push({
    id: 'social-dynamics',
    title: 'Social & Group Dynamics',
    icon: '👥',
    content: {
      narrative: extractNarratives(groupData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { group: groupData },
  });

  // Section 9: Subject Fit & Career Signals
  const subjectFitData = rawReport.subjectFit as Record<string, unknown> | null;
  sections.push({
    id: 'subject-fit',
    title: 'Subject Fit & Career Signals',
    icon: '🎯',
    content: {
      narrative: extractNarratives(subjectFitData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { subjectFit: subjectFitData },
  });

  // Section 10: Teacher & Parent Guide
  const guideData = rawReport.guide as Record<string, unknown> | null;
  const unifiedGuideData = rawReport.unifiedGuide as Record<string, unknown> | null;
  const tutorData = rawReport.tutor as Record<string, unknown> | null;
  const academicGuideData = rawReport.academicGuide as Record<string, unknown> | null;
  sections.push({
    id: 'guide',
    title: 'Teacher & Parent Guide',
    icon: '📋',
    content: {
      narrative: extractNarratives(unifiedGuideData) || extractNarratives(guideData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { guide: guideData, unifiedGuide: unifiedGuideData, tutor: tutorData, academicGuide: academicGuideData },
  });

  // Section 11: Action Plan
  const actionPlanData = rawReport.actionPlan as Record<string, unknown> | null;
  sections.push({
    id: 'action-plan',
    title: 'What To Do Monday',
    subtitle: 'Action Plan',
    icon: '✅',
    content: {
      narrative: extractNarratives(actionPlanData) || [],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: { actionPlan: actionPlanData },
  });

  // Section 12: Appendix
  sections.push({
    id: 'appendix',
    title: 'Appendix',
    icon: '📎',
    content: {
      narrative: [
        `This report was generated on ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} based on ${studentName}'s responses to 120 self-report questions covering personality (HEXACO-PI-R) and academic learning patterns.`,
        'The HEXACO model of personality measures six broad dimensions: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, and Openness to Experience. Each dimension contains four facets, measured on a 1-5 scale.',
      ],
      keyFindings: [],
      researchNotes: [],
      scenarios: [],
      crossReferences: [],
      actions: [],
    },
    rawData: {},
  });

  const archetype = (execData?.archetype as string)
    || (coverData as any)?.personalityArchetype
    || 'The Balanced Generalist';

  return {
    studentName,
    date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
    archetype,
    sections,
    radarData,
    scoreSummary,
  };
}

/** Extract narrative strings from a section data object */
function extractNarratives(data: Record<string, unknown> | null | undefined): string[] {
  if (!data) return [];
  const narrative = data.narrative;
  if (typeof narrative === 'string' && narrative.length > 0) {
    return narrative.split(/\n\n/).filter(Boolean).map(p => p.trim());
  }
  return [];
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build 2>&1 | tail -5`
Expected: Compiled successfully

- [ ] **Step 3: Commit**

```bash
git add src/lib/report/mega-sections.ts
git commit -m "feat(report): add consolidation functions for 23→12 mega-sections"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile` | Directory exists |
| consolidateToMegaReport exported | `grep 'export function consolidateToMegaReport' src/lib/report/mega-sections.ts` | Match found |
| Returns 12 sections | `grep "id: '" src/lib/report/mega-sections.ts \| wc -l` | `12` |
| extractNarratives helper exists | `grep 'function extractNarratives' src/lib/report/mega-sections.ts` | Match found |
| Health: build | `npm run build 2>&1 \| tail -3` | Compiled successfully |

---

### Task 3: Add generateMegaReport to index.ts

**Files:**
- Modify: `src/lib/report/index.ts`

**Does NOT cover:** Removing the old `generateReport` function — it stays for backwards compatibility until Phase 1b completes.

- [ ] **Step 1: Add the mega-report entry point**

Add to the end of `src/lib/report/index.ts`, after the existing `generateReport` function:

```typescript
import { consolidateToMegaReport, type MegaReport } from './mega-sections';

/**
 * Generate the mega-report (12 consolidated sections).
 * Runs all existing generators, then consolidates into the new structure.
 */
export function generateMegaReport(results: any, name: string): MegaReport {
	const rawReport = generateReport(results, name);
	return consolidateToMegaReport(rawReport, name);
}

export type { MegaReport, MegaSection, MegaSectionContent } from './mega-sections';
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build 2>&1 | tail -5`
Expected: Compiled successfully

- [ ] **Step 3: Commit**

```bash
git add src/lib/report/index.ts
git commit -m "feat(report): add generateMegaReport entry point"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile` | Directory exists |
| generateMegaReport exported | `grep 'export function generateMegaReport' src/lib/report/index.ts` | Match found |
| Old generateReport still exists | `grep 'export function generateReport' src/lib/report/index.ts` | Match found |
| Health: build | `npm run build 2>&1 \| tail -3` | Compiled successfully |

---

### Task 4: Update web report page to use mega-sections

**Files:**
- Modify: `src/app/report/page.tsx`

**Does NOT cover:** Custom rendering for each mega-section — this task uses the existing generic renderer with the rawData fallback. Custom mega-section renderers are Phase 1b.

- [ ] **Step 1: Import generateMegaReport and update the report generation call**

In `src/app/report/page.tsx`, find the line that calls `generateReport` and add the mega-report call alongside it. The page should use `generateMegaReport` and render the 12 mega-sections using `rawData` pass-through to the existing generic renderer.

Replace the `generateReport` import with:
```typescript
import { generateReport, generateMegaReport } from "@/lib/report";
import type { MegaSection } from "@/lib/report";
```

In the component body where `generateReport` is called, add:
```typescript
const megaReport = generateMegaReport(results, studentName);
```

Then update the section rendering to iterate over `megaReport.sections` instead of the flat raw report keys. Each mega-section renders using the existing `ObjectCard`/`renderValue` system on its `rawData`:

```typescript
{megaReport.sections.map((section) => (
  <ReportSection
    key={section.id}
    id={section.id}
    number={megaReport.sections.indexOf(section) + 1}
    title={section.title}
    subtitle={section.subtitle}
  >
    {/* Narratives */}
    {section.content.narrative.map((para, i) => (
      <p key={`n${i}`} className="text-espresso/80 leading-relaxed mb-4">{para}</p>
    ))}
    {/* Key findings as callouts */}
    {section.content.keyFindings.map((f, i) => (
      <Callout key={`f${i}`} variant={f.type === 'warning' ? 'warning' : f.type === 'barrier' ? 'caution' : 'tip'}>
        <p className="font-semibold text-sm mb-1">{f.title}</p>
        <p className="text-sm">{f.text}</p>
      </Callout>
    ))}
    {/* Actions */}
    {section.content.actions.map((a, i) => (
      <Callout key={`a${i}`} variant="tip">
        <p className="font-semibold text-sm mb-1">{a.title}</p>
        <p className="text-sm">{a.description}</p>
      </Callout>
    ))}
    {/* Raw data fallback — render old section data with existing generic renderer */}
    {section.rawData && Object.entries(section.rawData).map(([key, data]) => {
      if (!data || typeof data !== 'object') return null;
      return <div key={key}>{renderValue(data, key, 0)}</div>;
    })}
  </ReportSection>
))}
```

- [ ] **Step 2: Update StickyNav and FloatingTOC to use mega-section titles**

Update the section navigation arrays to use `megaReport.sections.map(s => ({ id: s.id, label: s.title }))`.

- [ ] **Step 3: Verify it compiles and the page loads**

Run: `npm run build 2>&1 | tail -5`
Expected: Compiled successfully

- [ ] **Step 4: Commit**

```bash
git add src/app/report/page.tsx
git commit -m "feat(report): render 12 mega-sections on web report page"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile && npm run build` | Compiled successfully |
| Uses generateMegaReport | `grep 'generateMegaReport' src/app/report/page.tsx` | Match found |
| Renders 12 sections | `grep 'megaReport.sections' src/app/report/page.tsx` | Match found |
| Health: build | `npm run build 2>&1 \| tail -3` | Compiled successfully |

---

### Task 5: Apply all 9 PDF rendering fixes

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

**Does NOT cover:** New mega-section PDF rendering — this task only applies the 9 fixes from the PDF rendering spec (docs/superpowers/specs/2026-03-29-pdf-rendering-fixes-design.md).

NOTE: If commit 75b673b already applied these fixes, verify they're present and skip to Task 6.

- [ ] **Step 1: Verify PDF fixes are already applied**

Run: `git log --oneline | grep -i 'pdf rendering'`

If commit 75b673b exists with these fixes, verify each:

```bash
# Fix 1: PDFCallout has no wrap={false}
grep -n 'wrap={false}' src/components/pdf/ReportPDF.tsx | head -10

# Fix 2: PDFTwoColumn has minWidth: 0
grep -n 'minWidth: 0' src/components/pdf/ReportPDF.tsx

# Fix 7: renderBarriers has vertical layout with ↓
grep -n '↓' src/components/pdf/ReportPDF.tsx
```

Expected: wrap={false} should NOT appear on PDFCallout or dimension cards. minWidth: 0 should appear on PDFTwoColumn columns. ↓ should appear in renderBarriers.

If all verified, skip implementation and commit. If any missing, apply from the spec.

- [ ] **Step 2: Commit (if any changes needed)**

```bash
git add src/components/pdf/ReportPDF.tsx
git commit -m "fix(pdf): apply remaining rendering fixes from spec"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile` | Directory exists |
| PDFCallout no wrap={false} | `grep -A2 'function PDFCallout' src/components/pdf/ReportPDF.tsx \| grep -c 'wrap={false}'` | `0` |
| PDFTwoColumn has minWidth | `grep -c 'minWidth: 0' src/components/pdf/ReportPDF.tsx` | `2` (one per column) |
| Vertical root-cause | `grep -c '↓' src/components/pdf/ReportPDF.tsx` | `1` or more |
| Health: build | `npm run build 2>&1 \| tail -3` | Compiled successfully |

---

### Task 6: Update PDF renderer for mega-sections

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

**Does NOT cover:** Deep content rendering for each mega-section — this task updates the PDF entry point to iterate mega-sections. Existing CUSTOM_SECTION_RENDERERS still handle the rawData. Custom mega-section PDF renderers are Phase 1b.

- [ ] **Step 1: Import MegaReport type and add mega-section PDF entry**

Add import at top of ReportPDF.tsx:
```typescript
import { generateMegaReport, type MegaReport, type MegaSection } from "@/lib/report";
```

- [ ] **Step 2: Add MegaSectionPage component**

Add after the existing helper components (PDFCallout, PDFTwoColumn, etc.):

```typescript
function MegaSectionPage({ section, index, total }: { section: MegaSection; index: number; total: number }) {
  // Try custom renderer for rawData keys first
  const customElements: React.ReactElement[] = [];
  if (section.rawData) {
    for (const [key, data] of Object.entries(section.rawData)) {
      if (data && typeof data === 'object' && CUSTOM_SECTION_RENDERERS[key]) {
        customElements.push(...CUSTOM_SECTION_RENDERERS[key](data as Record<string, unknown>));
      }
    }
  }

  return (
    <Page size="A4" style={styles.page}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Section {String(index + 1).padStart(2, '0')} of {total}</Text>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.subtitle && <Text style={{ fontSize: 11, color: WARM_GRAY, marginBottom: 8 }}>{section.subtitle}</Text>}
        <View style={styles.sectionRule} />
      </View>

      {/* Mega-section narratives */}
      {section.content.narrative.map((para, i) => (
        <Text key={`n${i}`} style={styles.body}>{para}</Text>
      ))}

      {/* Key findings as callouts */}
      {section.content.keyFindings.map((f, i) => (
        <PDFCallout key={`f${i}`} text={f.text} title={f.title} color={f.color || WARM_GRAY} />
      ))}

      {/* Actions */}
      {section.content.actions.map((a, i) => (
        <PDFCallout key={`a${i}`} text={a.description} title={a.title} color="#3b82f6" />
      ))}

      {/* Custom-rendered raw data */}
      {customElements}

      {/* Generic fallback for unrendered rawData */}
      {section.rawData && Object.entries(section.rawData).map(([key, data]) => {
        if (!data || typeof data !== 'object' || CUSTOM_SECTION_RENDERERS[key]) return null;
        return <View key={key}>{deepRenderValue(data, key, 0)}</View>;
      })}

      {/* Footer */}
      <View style={styles.footer} fixed>
        <View style={styles.footerRule} />
        <View style={styles.footerRow}>
          <Text>AcademicProfile</Text>
          <Text style={styles.footerCenter}>{section.title}</Text>
          <Text render={({ pageNumber }) => `${pageNumber}`} />
        </View>
      </View>
    </Page>
  );
}
```

- [ ] **Step 3: Update downloadReportPDF to use mega-sections**

Update the `downloadReportPDF` function to call `generateMegaReport` and pass the mega-report to the Document:

```typescript
export async function downloadReportPDF(results: TestResults, studentName: string) {
  const megaReport = generateMegaReport(results, studentName);

  const doc = (
    <Document>
      {/* Cover Page (unchanged — keep existing cover) */}
      <Page size="A4" style={styles.coverPage}>
        {/* ... existing cover content using megaReport.archetype, radarData, scoreSummary ... */}
      </Page>

      {/* Table of Contents */}
      <PDFTableOfContents sections={megaReport.sections.map((s, i) => ({
        number: i + 1,
        title: s.title,
        subtitle: s.subtitle,
      }))} />

      {/* Mega-sections */}
      {megaReport.sections.filter(s => s.id !== 'cover-summary').map((section, i) => (
        <MegaSectionPage
          key={section.id}
          section={section}
          index={i}
          total={megaReport.sections.length - 1}
        />
      ))}
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  // ... existing download logic ...
}
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run build 2>&1 | tail -5`
Expected: Compiled successfully

- [ ] **Step 5: Commit**

```bash
git add src/components/pdf/ReportPDF.tsx
git commit -m "feat(pdf): render 12 mega-sections in PDF with fallback to custom renderers"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `cd /Users/jared/Desktop/Software\ Developement/AcademicProfile` | Directory exists |
| MegaSectionPage component | `grep 'function MegaSectionPage' src/components/pdf/ReportPDF.tsx` | Match found |
| Uses generateMegaReport | `grep 'generateMegaReport' src/components/pdf/ReportPDF.tsx` | Match found |
| Health: build | `npm run build 2>&1 \| tail -3` | Compiled successfully |

---

### Task 7: End-to-end verification

**Files:** None (verification only)

- [ ] **Step 1: Build the project**

Run: `npm run build 2>&1 | tail -10`
Expected: Compiled successfully, all routes generated

- [ ] **Step 2: Start dev server and test report page**

Run: `npm run dev &` then wait 5 seconds.
Navigate to localhost:3000, complete a quick test assessment, verify the report page renders with 12 mega-sections.

- [ ] **Step 3: Test PDF download**

On the report page, click the PDF download button. Verify the PDF opens with:
- Cover page with radar chart
- Table of contents with 12 sections
- Each mega-section renders content (from rawData fallback)
- No overlapping text or broken wrapping

- [ ] **Step 4: Final commit with AGENTS.md update**

```bash
git add -A
git commit -m "feat(report): Phase 1a complete — 12 mega-section architecture with PDF fixes"
```

#### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup | `npm run build` | Exit 0 |
| Build passes | `npm run build 2>&1 \| tail -3` | Compiled successfully |
| MegaSection types exist | `grep -c 'MegaSection' src/lib/report/mega-sections.ts` | > 5 |
| 12 sections consolidated | `grep -c "id: '" src/lib/report/mega-sections.ts` | 12 |
| Web page uses mega-report | `grep 'generateMegaReport' src/app/report/page.tsx` | Match found |
| PDF uses mega-report | `grep 'generateMegaReport' src/components/pdf/ReportPDF.tsx` | Match found |
| Health: build | `npm run build 2>&1 \| tail -3` | Compiled successfully |
