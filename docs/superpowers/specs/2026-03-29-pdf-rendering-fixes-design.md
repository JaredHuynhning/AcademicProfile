# PDF Rendering Fixes — Design Spec

**Ticket:** #14 — PDF rendering bugs (overlapping text, broken wrapping)
**Date:** 2026-03-29
**Scope:** All PDF section renderers in `src/components/pdf/ReportPDF.tsx`

## Problem

The PDF report has text overlapping and content running off the page in multiple sections. The root cause is a pattern of using `wrap={false}` on containers that hold variable-length generated text. In react-pdf, `wrap={false}` prevents page breaks within a View — but it also prevents the content from reflowing when it exceeds the available space, causing overlap with adjacent elements.

Secondary issues include inconsistent `lineHeight` values across text elements and horizontal layouts that don't handle long labels.

## Affected Components

### Shared Helpers

| Component | File:Line | Issue |
|-----------|-----------|-------|
| `PDFCallout` | ReportPDF.tsx:254-264 | `wrap={false}` on outer View prevents long callout text from wrapping to next page |
| `PDFTwoColumn` | ReportPDF.tsx:266-273 | No width constraints on flex columns; text can overflow column boundary |
| `PDFSubheading` | ReportPDF.tsx:275-282 | Missing bottom margin after decorative rule causes crowding |

### Section Renderers

| Renderer | File:Line | Issue |
|----------|-----------|-------|
| `renderGuide` | :598 | `wrap={false}` on support strategy cards (Do/Don't lists) |
| `renderDeepDive` | :661 | `wrap={false}` on dimension cards with many facet insights |
| `renderStrengths` | :715 | `wrap={false}` on strength/weakness dimension blocks |
| `renderBarriers` | :780-785 | Horizontal row for root-cause chain overflows with long labels |

### Inconsistent lineHeight

Text elements use a mix of `lineHeight: 1.4`, `1.5`, `1.6`, or no lineHeight (inheriting page default of 1.6). This causes inconsistent vertical spacing within and between cards.

## Design

### Fix 1: PDFCallout — Remove wrap={false}

**Before:**
```tsx
<View style={{ flexDirection: "row", marginBottom: 8 }} wrap={false}>
```

**After:**
```tsx
<View style={{ flexDirection: "row", marginBottom: 8 }}>
```

Removing `wrap={false}` allows callouts to break across pages when text is long. The callout's visual structure (colored border + text) will still render correctly because react-pdf handles flex row wrapping.

### Fix 2: PDFTwoColumn — Add minWidth: 0

**Before:**
```tsx
<View style={{ flex: 1 }}>{left}</View>
<View style={{ flex: 1 }}>{right}</View>
```

**After:**
```tsx
<View style={{ flex: 1, minWidth: 0 }}>{left}</View>
<View style={{ flex: 1, minWidth: 0 }}>{right}</View>
```

In react-pdf's flexbox, `flex: 1` without `minWidth: 0` can cause children to overflow their container. Adding `minWidth: 0` allows the flex item to shrink below its content size, forcing text to wrap within the column boundary.

### Fix 3: PDFSubheading — Increase outer margin

**Before:**
```tsx
<View style={{ marginTop: 14, marginBottom: 6 }}>
```

**After:**
```tsx
<View style={{ marginTop: 14, marginBottom: 10 }}>
```

The outer View already has `marginBottom: 6`; increase to 10 for more breathing room after subheadings. (The inner rule View is the last child, so adding margin there would be a no-op.)

### Fix 4: renderGuide — Remove wrap={false} from strategy cards

**Before (line 598):**
```tsx
<View key={`ss${i}`} style={[styles.card, { marginTop: 4 }]} wrap={false}>
```

**After:**
```tsx
<View key={`ss${i}`} style={[styles.card, { marginTop: 4 }]}>
```

Support strategy cards contain variable-length Do/Don't bullet lists. Preventing page breaks causes the entire card to overlap adjacent content when it doesn't fit on the current page.

### Fix 5: renderDeepDive — Remove wrap={false} from dimension cards

**Before (line 661):**
```tsx
<View key={`d${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: dim.color || ESPRESSO }]} wrap={false}>
```

**After:**
```tsx
<View key={`d${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: dim.color || ESPRESSO }]}>
```

Dimension cards with 4 facet insights + a learning callout can exceed one page. Allowing wrapping lets them flow naturally.

### Fix 6: renderStrengths — Remove wrap={false} from dimension blocks

**Before (line 715):**
```tsx
<View key={`d${i}`} style={{ marginBottom: 10 }} wrap={false}>
```

**After:**
```tsx
<View key={`d${i}`} style={{ marginBottom: 10 }}>
```

Same rationale as Fix 5.

### Fix 7: renderBarriers — Vertical root-cause layout

**Before (lines 781-785):**
```tsx
<View style={{ flexDirection: "row" as const, gap: 8, marginBottom: 3 }}>
  <Text style={{ fontSize: 8, color: "#f59e0b", fontWeight: "bold" }}>Personality: {rc.personalityRoot}</Text>
  <Text style={{ fontSize: 8, color: WARM_GRAY }}>→</Text>
  <Text style={{ fontSize: 8, color: "#ef4444", fontWeight: "bold" }}>Symptom: {rc.academicSymptom}</Text>
</View>
```

**After:**
```tsx
<View style={{ marginBottom: 3 }}>
  <Text style={{ fontSize: 8, color: "#f59e0b", fontWeight: "bold" }}>Personality: {rc.personalityRoot}</Text>
  <Text style={{ fontSize: 7, color: WARM_GRAY, marginVertical: 1 }}>  ↓</Text>
  <Text style={{ fontSize: 8, color: "#ef4444", fontWeight: "bold" }}>Symptom: {rc.academicSymptom}</Text>
</View>
```

Converting from horizontal row to vertical stack ensures long labels wrap correctly. The arrow changes from `→` to `↓` to match the vertical flow.

### Fix 8: Standardize lineHeight

All body/content text elements within section renderers will use `lineHeight: 1.4` consistently. This applies to:
- Facet insight text (renderDeepDive)
- Strength/weakness analysis text (renderStrengths)
- Do/Don't list items (renderGuide)
- Root cause descriptions (renderBarriers)
- Home environment tips (renderGuide)

The page-level `styles.body` keeps `lineHeight: 1.6` for narrative paragraphs (intentionally more spacious for readability). Only inline card/list text gets standardized to 1.4. This includes the PDFCallout text element (currently `lineHeight: 1.5` at `fontSize: 9`) — standardize to 1.4 for consistency with other card-level text.

### Fix 9: Remove wrap={false} from renderBarriers root-cause cards

**Before (line 780):**
```tsx
<View key={`rc${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#f59e0b" }]} wrap={false}>
```

**After:**
```tsx
<View key={`rc${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#f59e0b" }]}>
```

Same pattern as fixes 4-6.

## Non-Goals

- No changes to cover page layout
- No changes to PDF page dimensions or margins
- No changes to content generators (data shape stays the same)
- No changes to web report components (only PDF)
- No new dependencies

## Failure Modes

1. **Removing `wrap={false}` may cause ugly mid-card page breaks.** Severity: Minor. react-pdf handles this reasonably — it will break at the nearest View boundary. If specific cards need to stay together, we can add `break={false}` on smaller inner Views instead.

2. **Vertical root-cause layout may look sparse with short labels.** Severity: Minor. Short labels still look clean in vertical layout; the readability gain for long labels outweighs the aesthetic cost for short ones.

3. **`minWidth: 0` on PDFTwoColumn may cause columns to collapse with very short content.** Severity: Minor. We keep `flex: 1` which gives equal space — `minWidth: 0` only affects overflow behavior, not minimum sizing in practice.

## Verification

After implementing, generate a test PDF with realistic data and visually inspect:
- Guide section Do/Don't cards render without overlap
- Deep Dive dimension cards with long facet text wrap to next page cleanly
- Strengths two-column layout stays within page boundaries
- Barriers root-cause chains display fully (no text cut off)
- Callouts with long text break to next page instead of overlapping
- No regressions in existing cover, TOC, or action sheet
