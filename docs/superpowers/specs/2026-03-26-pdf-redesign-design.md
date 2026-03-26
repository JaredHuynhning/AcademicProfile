# PDF Redesign — Editorial Clean — Design Spec

## Overview

Upgrade the PDF report from generic rendering to a magazine-quality "editorial clean" aesthetic. Centered typography, numbered section eyebrows, thin rules, contextual footers, and a proper table of contents. The report should feel like a designed document worth paying for.

## Style Direction: Editorial Clean

- Restrained palette: espresso (#2c2417) + warm-gray (#8b7355) + cream (#fdfbf7)
- Serif-style headings (react-pdf default serif or registered font)
- Generous whitespace and vertical rhythm
- Numbered section eyebrows ("SECTION 01")
- Thin horizontal rules as dividers
- No color accents except dimension-specific colors on the radar chart

## Cover Page Redesign

### Current State
The cover already has: eyebrow, student name, archetype, radar chart, and dimension score cards. It works but lacks typographic refinement and visual hierarchy.

### Changes
- **Eyebrow**: Keep "YOUR LEARNING PROFILE" — increase letter-spacing to 4px, font-size 8pt
- **Student name**: Increase to 26pt, bold
- **Archetype**: Italic, 12pt, warm-gray
- **Date**: Add date below archetype, 9pt, warm-gray
- **Thin rule**: Add 2px × 60px espresso rule below date, centered
- **Radar chart**: Reduce size to 160px (from 180px), add more padding around it
- **Dimension scores**: Keep existing score cards, refine spacing to be more compact
- **Percentile context**: Keep existing percentile text below scores

### No Changes
- PDFRadarChart component itself (geometry, colors, grid)
- Dimension color scheme
- Score card data structure

## Table of Contents (New — Page 2)

### Component: PDFTableOfContents

**Location**: `src/components/pdf/PDFTableOfContents.tsx`

**Props**:
```typescript
interface PDFTableOfContentsProps {
  sections: Array<{ number: string; title: string }>;
}
```

**Layout**:
- Title: "Contents" — 18pt, bold, centered
- Thin rule below title
- Section list: each row is a flex container
  - Left: "01  Executive Summary" (10pt, espresso)
  - Right: page number placeholder (10pt, warm-gray)
  - Dot leaders filling the gap (repeating "." characters)
- Spacing: 10pt between rows

**Page Number Challenge**: React-pdf's `render` prop only works within `Text` components and returns the current page/total — it doesn't know which page a *future* section will land on. Options:
1. **Omit actual page numbers** — just list section names with dot leaders. Simpler, still useful as a roadmap.
2. **Hardcode approximate page numbers** — fragile, breaks when content length changes.
3. **Use section numbers instead of page numbers** — "01 ... Executive Summary"

**Decision**: Option 1 — list sections with dot leaders, no page numbers. A TOC without page numbers is still valuable as a content overview. Real page numbers would require a two-pass render which adds significant complexity for marginal value.

### Section List
The TOC renders the same `activeSections` array used by the report body. Section numbers are derived from array index + 1 (cover is not counted).

## Section Headers Redesign

### Current State
Each section starts with a simple `sectionTitle` text element (14pt, bold).

### Changes
Replace the existing section header `View` with a new structure:

```
SECTION 01            ← eyebrow (8pt, uppercase, letter-spacing 2px, warm-gray)
Executive Summary     ← title (18pt, bold, espresso)
────                  ← thin rule (40px × 3px, espresso)
[24pt vertical space]
```

**Implementation**: Modify the existing section header rendering in the `activeSections.map()` loop. No new component needed — just restructure the existing `View`.

### Section Numbering
Each section gets a zero-padded two-digit number based on its position in `activeSections`: "01", "02", "03", etc. The action sheet page (already handled by PDFActionSheet) skips the numbered header — it has its own header.

## Typography Refinements

### Changes to Existing Styles

| Property | Current | New | Applies To |
|----------|---------|-----|------------|
| Body text size | 9pt | 10pt | All paragraph text |
| Narrative text size | 9pt | 11pt | Extracted narrative paragraphs |
| Line height | ~1.4 | 1.6 | All text |
| Paragraph spacing | 6pt | 8pt | Between paragraphs |
| Section title size | 14pt | 18pt | Section headings |

### Implementation
Modify the `styles` object in `ReportPDF.tsx`. No structural changes — just value updates.

## Page Footer Redesign

### Current State
Footer has: student name (left) + "Page N / M" (right). Basic.

### Changes
Three-column footer on every page except the cover:

```
Jared Williams    |    Executive Summary    |    Page 3 of 18
```

- Left: student name (8pt, warm-gray)
- Center: current section title (8pt, warm-gray, italic)
- Right: "Page N of M" (8pt, warm-gray) — uses react-pdf `render` prop
- 1px warm-gray rule above the footer row
- 8pt vertical padding above rule

**Section Title in Footer Challenge**: The footer is `fixed` (appears on every page), but the section title changes per section. React-pdf `fixed` elements render once per page. Since each section is its own `<Page>` component, the footer can receive the section title as a prop/variable within each page's JSX.

### Implementation
Move the footer into a reusable helper that accepts `name` and `sectionTitle`. Render it inside each `<Page>` in the section loop.

## Page Breaks

### Current State
Each section is already its own `<Page>` component, so sections naturally start on new pages. The `minPresenceAhead={80}` on section headers prevents orphaned titles.

### Changes
- Keep the existing one-page-per-section structure
- Ensure the TOC page and action sheet page have proper page breaks
- Add `break` style to prevent mid-paragraph page breaks where possible (react-pdf handles this with `wrap` prop)

## File Changes

| File | Action | What Changes |
|------|--------|-------------|
| `src/components/pdf/ReportPDF.tsx` | Modify | Cover refinements, section headers, footer, typography, TOC integration |
| `src/components/pdf/PDFTableOfContents.tsx` | Create | New TOC component |

## Scope

### In Scope
- Cover typography refinement (sizes, spacing, thin rule)
- New TOC page (section names + dot leaders, no page numbers)
- Section headers with numbered eyebrows + thin rules
- Three-column footer with section title
- Typography upgrades (sizes, line-height, spacing)
- Footer rule above footer content

### Out of Scope
- Changing the radar chart component
- Changing the action sheet component (already redesigned in ticket #4)
- Changing section content rendering logic (`deepRenderValue`)
- Font registration (stick with react-pdf defaults)
- Two-pass rendering for accurate TOC page numbers
- Color palette changes
