# PDF Redesign — Editorial Clean — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the PDF report from generic rendering into a magazine-quality "editorial clean" document with refined typography, section eyebrows, a table of contents, and contextual three-column footers.

**Architecture:** All changes happen in `ReportPDF.tsx` (styles, cover, section headers, footer) plus one new `PDFTableOfContents.tsx` component. No structural changes to content rendering logic — only typography, layout, and navigation upgrades.

**Tech Stack:** React, @react-pdf/renderer, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/pdf/PDFTableOfContents.tsx` | Create | TOC component with dot leaders |
| `src/components/pdf/ReportPDF.tsx` | Modify | Cover refinement, section headers with eyebrows, footer upgrade, typography, TOC integration |

---

### Task 1: Create PDFTableOfContents Component

**Files:**
- Create: `src/components/pdf/PDFTableOfContents.tsx`

- [ ] **Step 1: Create the TOC component**

```tsx
// src/components/pdf/PDFTableOfContents.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const ESPRESSO = "#2c2417";
const WARM_GRAY = "#8b7355";
const BORDER = "#e8e0d4";

const s = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: ESPRESSO,
    textAlign: "center",
    marginBottom: 8,
  },
  rule: {
    width: 40,
    height: 3,
    backgroundColor: ESPRESSO,
    alignSelf: "center",
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "baseline",
  },
  number: {
    fontSize: 9,
    color: WARM_GRAY,
    width: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 11,
    color: ESPRESSO,
  },
  dots: {
    flex: 1,
    fontSize: 9,
    color: BORDER,
    marginHorizontal: 8,
    overflow: "hidden",
  },
});

interface PDFTableOfContentsProps {
  sections: Array<{ number: string; title: string }>;
}

export function PDFTableOfContents({ sections }: PDFTableOfContentsProps) {
  const dotLeader = " . ".repeat(80);

  return (
    <View style={s.container}>
      <Text style={s.title}>Contents</Text>
      <View style={s.rule} />

      {sections.map((section) => (
        <View key={section.number} style={s.row}>
          <Text style={s.number}>{section.number}</Text>
          <Text style={s.sectionTitle}>{section.title}</Text>
          <Text style={s.dots}>{dotLeader}</Text>
        </View>
      ))}
    </View>
  );
}
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx tsc --noEmit 2>&1 | grep -i PDFTableOfContents`
Expected: No errors mentioning the new file

- [ ] **Step 3: Commit**

```bash
git add src/components/pdf/PDFTableOfContents.tsx
git commit -m "feat(pdf): add table of contents component with dot leaders"
```

---

### Task 2: Upgrade Cover Page Typography

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

- [ ] **Step 1: Update cover styles**

In the `styles` object (lines 22-62), replace the cover styles:

Replace:
```typescript
  coverPage: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: CREAM,
    justifyContent: "center",
    alignItems: "center",
  },
  coverEyebrow: {
    fontSize: 9,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 12,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 12,
    color: WARM_GRAY,
    marginBottom: 40,
  },
```

With:
```typescript
  coverPage: {
    padding: 40,
    paddingTop: 80,
    fontFamily: "Helvetica",
    backgroundColor: CREAM,
    alignItems: "center",
  },
  coverEyebrow: {
    fontSize: 8,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 14,
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 6,
  },
  coverDate: {
    fontSize: 9,
    color: WARM_GRAY,
    marginBottom: 6,
  },
```

- [ ] **Step 2: Add thin rule below date on cover page**

In the cover page JSX (around line 712), after the `coverDate` text and before the archetype, add:

After:
```tsx
<Text style={styles.coverDate}>{date}</Text>
```

Add:
```tsx
<View style={{ width: 60, height: 2, backgroundColor: ESPRESSO, marginBottom: 20, marginTop: 4 }} />
```

- [ ] **Step 3: Reduce radar chart size**

Find (around line 722):
```tsx
<PDFRadarChart data={coverData.radarData as { label: string; value: number; color: string }[]} size={200} />
```

Replace with:
```tsx
<PDFRadarChart data={coverData.radarData as { label: string; value: number; color: string }[]} size={160} />
```

- [ ] **Step 4: Update cover eyebrow text**

Find (around line 710):
```tsx
<Text style={styles.coverEyebrow}>Academic Profile Report</Text>
```

Replace with:
```tsx
<Text style={styles.coverEyebrow}>Your Learning Profile</Text>
```

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(pdf): refine cover page typography and layout"
```

---

### Task 3: Upgrade Section Headers with Numbered Eyebrows

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

- [ ] **Step 1: Update section header styles**

In the `styles` object (lines 74-90), replace the section header styles:

Replace:
```typescript
  sectionHeader: {
    marginTop: 16,
    marginBottom: 10,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: ESPRESSO,
  },
```

With:
```typescript
  sectionHeader: {
    marginBottom: 24,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 8,
  },
  sectionRule: {
    width: 40,
    height: 3,
    backgroundColor: ESPRESSO,
  },
```

- [ ] **Step 2: Update the section rendering loop to include numbered eyebrows**

In the `activeSections.map()` loop (around line 770-785), replace:

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

With:
```tsx
        const sectionNumber = String(sectionIndex + 1).padStart(2, "0");

        return (
          <Page key={sectionDef.key} size="A4" style={styles.page} wrap>
            <View style={styles.sectionHeader} wrap={false} minPresenceAhead={80}>
              <Text style={styles.sectionEyebrow}>Section {sectionNumber}</Text>
              <Text style={styles.sectionTitle}>{sectionDef.title}</Text>
              <View style={styles.sectionRule} />
            </View>

            {contentElements}

            <View style={styles.footer} fixed>
              <Text>{name} — Academic Profile</Text>
              <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </View>
          </Page>
        );
```

Also update the `.map()` to include the index. Change:
```tsx
      {activeSections.map((sectionDef) => {
```
To:
```tsx
      {activeSections.map((sectionDef, sectionIndex) => {
```

- [ ] **Step 3: Commit**

```bash
git commit -am "feat(pdf): add numbered section eyebrows and thin rules"
```

---

### Task 4: Upgrade Footer to Three-Column with Section Title

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

- [ ] **Step 1: Update footer styles**

In the `styles` object (lines 151-161), replace the footer:

Replace:
```typescript
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: WARM_GRAY,
  },
```

With:
```typescript
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
  },
  footerRule: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 8,
    color: WARM_GRAY,
  },
  footerCenter: {
    fontSize: 8,
    color: WARM_GRAY,
    fontStyle: "italic",
  },
```

- [ ] **Step 2: Update footer in the section loop**

In the `activeSections.map()` loop, replace the footer View inside the generic section page:

Replace:
```tsx
            <View style={styles.footer} fixed>
              <Text>{name} — Academic Profile</Text>
              <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </View>
```

With:
```tsx
            <View style={styles.footer} fixed>
              <View style={styles.footerRule} />
              <View style={styles.footerRow}>
                <Text>{name}</Text>
                <Text style={styles.footerCenter}>{sectionDef.title}</Text>
                <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              </View>
            </View>
```

- [ ] **Step 3: Update footer in the actionPlan early return**

Find the actionPlan early return block (around line 755-764), replace its footer:

Replace:
```tsx
              <View style={styles.footer} fixed>
                <Text>{name} — Academic Profile</Text>
                <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
              </View>
```

With:
```tsx
              <View style={styles.footer} fixed>
                <View style={styles.footerRule} />
                <View style={styles.footerRow}>
                  <Text>{name}</Text>
                  <Text style={styles.footerCenter}>Your Action Plan</Text>
                  <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
              </View>
```

- [ ] **Step 4: Update cover page footer to match style (no section title)**

Find the cover footer (around line 744-747):

Replace:
```tsx
        <View style={styles.footer}>
          <Text>AcademicProfile — HEXACO-PI-R Assessment</Text>
          <Text>{date}</Text>
        </View>
```

With:
```tsx
        <View style={styles.footer}>
          <View style={styles.footerRule} />
          <View style={styles.footerRow}>
            <Text>AcademicProfile</Text>
            <Text style={styles.footerCenter}>HEXACO-PI-R Assessment</Text>
            <Text>{date}</Text>
          </View>
        </View>
```

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(pdf): upgrade to three-column footer with section title"
```

---

### Task 5: Integrate TOC and Refine Typography

**Files:**
- Modify: `src/components/pdf/ReportPDF.tsx`

- [ ] **Step 1: Import PDFTableOfContents**

After the PDFActionSheet import (line 5), add:

```typescript
import { PDFTableOfContents } from "./PDFTableOfContents";
```

- [ ] **Step 2: Add TOC page after cover**

In `ReportPDFDocument`, after the cover `</Page>` (around line 748) and before the `{activeSections.map(...)}`, add:

```tsx
      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <PDFTableOfContents
          sections={activeSections.map((s, i) => ({
            number: String(i + 1).padStart(2, "0"),
            title: s.title,
          }))}
        />
        <View style={styles.footer} fixed>
          <View style={styles.footerRule} />
          <View style={styles.footerRow}>
            <Text>{name}</Text>
            <Text style={styles.footerCenter}>Contents</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </View>
      </Page>
```

- [ ] **Step 3: Update body text typography**

In the `styles` object, update the `body` style (around line 92-97):

Replace:
```typescript
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#4a3f2f",
    marginBottom: 8,
  },
```

With:
```typescript
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#4a3f2f",
    marginBottom: 8,
  },
```

Note: body text is already at 10pt and 1.6 line-height — no change needed. The spec's typography refinements are already present in the current code.

- [ ] **Step 4: Commit**

```bash
git commit -am "feat(pdf): add table of contents page and finalize typography"
```

---

### Task 6: Full Verification

**Files:** None (verification only)

- [ ] **Step 1: Run type checker**

Run: `npx tsc --noEmit`
Expected: No new type errors (pre-existing hexaco-score test errors are acceptable)

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Run test suite**

Run: `npx vitest run`
Expected: No new test failures

- [ ] **Step 4: Visual verification**

Run: `npm run dev`
Navigate to report, download PDF. Check:
- Cover has refined typography, thin rule, smaller radar chart
- TOC page appears after cover with dot leaders
- Each section starts with "SECTION 01" eyebrow + title + thin rule
- Footer has three columns: name | section title (italic) | Page N of M
- Footer has thin rule above it
- Action sheet page retains its tear-out design with correct footer
- No layout breaks or overflow issues

- [ ] **Step 5: Final commit if fixes needed**

```bash
git commit -am "chore(pdf): fix any issues from verification"
```

### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup: dev server | `npm run dev &` then `curl -s localhost:3000` | HTML response |
| Type check | `npx tsc --noEmit` | No new errors |
| Build | `npm run build` | Exit code 0 |
| Test suite | `npx vitest run` | No new failures |
| PDF: cover has thin rule | Download PDF, inspect cover page | 60px espresso rule below date |
| PDF: TOC page exists | Download PDF, check page 2 | "Contents" title with section list and dot leaders |
| PDF: section eyebrows | Download PDF, check any content section | "SECTION 01" eyebrow above title, thin rule below |
| PDF: three-column footer | Download PDF, check any page | Name (left), Section title italic (center), Page N of M (right) |
| PDF: footer rule | Download PDF, inspect footer area | 1px warm-gray rule above footer text |
| PDF: action sheet intact | Download PDF, check action plan page | Dashed-border tear-out still renders correctly |
| Health: no regressions | All other report sections render unchanged | Content rendering unaffected |
