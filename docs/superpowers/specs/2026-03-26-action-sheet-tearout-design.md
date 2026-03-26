# Action Sheet Tear-Out Page — Design Spec

## Overview

A dedicated "What To Do Monday" page that renders the action plan data as a visually distinct tear-out sheet in both the web report and PDF. Uses the numbered priorities layout with full action plan content (all 5 categories).

## Data Source

**Existing generator**: `src/lib/report/section-c6-action-plan.ts` — `generateActionPlan(results, crossRefResult)`

No changes to the data generator. The component consumes the existing return shape:

```typescript
{
  narrative: string;
  topActions: Array<{ rank: number; description: string }>;
  quickWins: Array<{ description: string }>;
  studyPrescription: { method: string; rationale: string };
  stopDoing: Array<{ description: string }>;
  weeklyRhythm: { description: string };
}
```

## Component: ActionSheet

**Location**: `src/components/report/ActionSheet.tsx`

### Props

```typescript
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
```

### Layout Structure

Single container with dashed border, tinted parchment background, scissors icon:

```
┌ ✂️ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                             │
│         WHAT TO DO MONDAY                   │
│         Your Action Plan                    │
│         Personalised for {name}             │
│                                             │
│  ── Priority Actions ────────────────────   │
│  ① Action title                             │
│     Why: explanation                        │
│  ② Action title                             │
│     Why: explanation                        │
│  ③ Action title                             │
│     Why: explanation                        │
│                                             │
│  ── Study Prescription ──────────────────   │
│  │ Method Name                              │
│  │ Rationale text                           │
│                                             │
│  ── Quick Wins ──────────────────────────   │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ ✓ Win 1     │  │ ✓ Win 2     │          │
│  ├─────────────┤  ├─────────────┤          │
│  │ ✓ Win 3     │  │ ✓ Win 4     │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  ── Stop Doing ──────────────────────────   │
│  🚫 ~~Bad habit~~ → instead do X           │
│  🚫 ~~Bad habit~~ → instead do X           │
│                                             │
│  ── Weekly Rhythm ───────────────────────   │
│  ┌─ Mon-Fri ──┐  ┌─ Weekend ──┐            │
│  │ schedule   │  │ schedule   │             │
│  └────────────┘  └────────────┘             │
│                                             │
│  "Consistency > duration" closing line      │
│                                             │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Visual Treatment

- **Border**: 2px dashed `#8b7355` (warm-gray), 12px border-radius
- **Background**: Linear gradient `#faf5eb → #f7f0e3` (slightly warmer than the report's cream)
- **Scissors icon**: `✂️` positioned above the top border with background color knockout
- **Section dividers**: 1px solid `#e8e0d4` under each section label
- **Section labels**: 10px uppercase, letter-spacing 2px, warm-gray color
- **Priority numbers**: 28px circles, espresso background, cream text, bold
- **Quick wins**: 2x2 grid, semi-transparent white cards, green checkmarks
- **Stop doing**: Strikethrough text in warm-gray + "instead" alternative
- **Weekly rhythm**: Two equal columns (weekday/weekend), semi-transparent white cards
- **Closing line**: Centered italic warm-gray text

### Color Palette (matches existing report)

| Token | Hex | Usage |
|-------|-----|-------|
| cream | `#fdfbf7` | Report background |
| parchment | `#faf5eb` → `#f7f0e3` | Tear-out gradient |
| espresso | `#2c2417` | Primary text, priority circles |
| warm-gray | `#8b7355` | Secondary text, borders, labels |
| accent-green | `#7a8a5e` | Quick win checkmarks |

## PDF Component: PDFActionSheet

**Location**: `src/components/pdf/PDFActionSheet.tsx`

Uses `@react-pdf/renderer` primitives (`View`, `Text`) to replicate the same layout. React-pdf doesn't support CSS grid, so quick wins use flex-wrap with percentage widths.

Key differences from web:
- No CSS grid → use `flexDirection: 'row'` with `flexWrap: 'wrap'` and `width: '48%'`
- No linear-gradient → use solid `#faf5eb`
- Dashed border via `borderStyle: 'dashed'`
- Scissors as plain text character positioned absolutely

## Integration Points

### Web Report (`src/app/report/page.tsx`)

Replace the generic `SectionContent` rendering for the `actionPlan` key with the dedicated `ActionSheet` component:

```typescript
// In the section rendering loop
{sectionDef.key === "actionPlan" ? (
  <ActionSheet data={data} studentName={name || "Student"} />
) : sectionDef.isCover ? (
  <CoverSection data={data} />
) : (
  <SectionContent data={data} />
)}
```

The `ReportSection` wrapper still provides the section ID and title ("Your Action Plan").

### PDF (`src/components/pdf/ReportPDF.tsx`)

Add `PDFActionSheet` as a dedicated page in the PDF rendering. When the section key is `actionPlan`, render the tear-out component instead of the generic `deepRenderValue` path. Force a page break before the action sheet so it starts on its own page.

### Section Ordering

No change needed. The action plan already sits at position 8 of 9 in complete mode:
1. Cover → 2. Executive Summary → 3. Your Personality → 4. How You Learn → 5. Study Strategies → 6. Strengths & Growth → 7. Barriers → **8. Your Action Plan** → 9. Guide

## Data Parsing

The `description` field in `topActions` and `stopDoing` contains concatenated prose (e.g., "Priority 1: {action}. Why: {insight}. This connects your..."). The ActionSheet component needs to parse these into structured display:

- **topActions**: Extract action text (before first period) and why text (after "Why:")
- **quickWins**: Extract action text (before first period)
- **stopDoing**: Extract the "Stop:" and "Instead:" parts, or "Watch for:" and root cause

This parsing happens in the component, not in the generator.

## Scope

### In Scope
- New `ActionSheet.tsx` web component
- New `PDFActionSheet.tsx` PDF component
- Integration into report page (replace generic rendering)
- Integration into PDF (dedicated page with page break)
- Text parsing for structured display

### Out of Scope
- Changes to `section-c6-action-plan.ts` data generator
- Interactive checkboxes in web version
- Print-specific CSS (PDF handles printability)
- New section ordering
