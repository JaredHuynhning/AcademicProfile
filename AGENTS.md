<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AcademicProfile — Agent State

## Current State

- **Last session**: 2026-03-25 — Fixed quiz navigation (stuck questions), report crashes (array→map conversion, nullable narrative). Visual tested all 3 assessment modes end-to-end.
- **Next action**: Start ticket #1 — Radar chart + personality archetype

## Active Tickets

| ID | Title | Status | Next Step |
|----|-------|--------|-----------|
| 1 | Radar chart + personality archetype | active | Building radar geometry + archetype engine |
| 2 | Score percentiles ("higher than 78%") | ready | - |
| 3 | Report visual rhythm (callouts, bars, pull quotes) | ready | - |
| 4 | Action sheet tear-out page | ready | - |
| 5 | PDF redesign (cover, TOC, charts, page breaks) | ready | - |
| 6 | Landing page with value proposition | ready | - |
| 7 | Free summary → paywall → full report flow | backlog | Needs Stripe integration decision |

## Ticket Details

### #1 — Radar chart + personality archetype
**Goal**: The "mirror moment" — a 6-axis HEXACO radar chart and a computed personality archetype label on the report cover.

### Ticket #1 AC
- [ ] 6-axis radar chart renders on Personality Profile report cover showing all HEXACO dimension scores
- [ ] Archetype label (format: "The [Adjective] [Noun]") displays above the radar chart on the cover
- [ ] Same archetype inputs always produce the same label (deterministic)
- [ ] Radar chart renders in PDF download with correct dimensions and colors
- [ ] Learning Assessment report does NOT show radar chart or archetype (no HEXACO data)
- [ ] Chart scales correctly on mobile viewport (393px width)
- [ ] No new npm dependencies added (custom SVG, not recharts)
- [ ] Features documented in feature-registry.md
- [ ] No dead code in modified files
- [ ] Code follows existing project patterns

### #2 — Score percentiles
**Goal**: Make scores meaningful with "higher than X% of students" context.
**Tasks**:
- Define normative distribution for each HEXACO dimension (from published research or simulated)
- Add percentile computation to helpers.ts
- Display percentile in dimension cards ("3.6 — higher than 78% of students")
- Add percentile to PDF output

### #3 — Report visual rhythm
**Goal**: Break up wall-of-text sections with visual variety.
**Tasks**:
- Add "Key Insight" callout boxes (colored left border, icon)
- Add score bar visualizations (horizontal bars with color-coded levels)
- Add pull quote component for standout findings
- Apply to at least sections 01 (cover), 02 (glance), 03 (deep dive), 08 (strengths)

### #4 — Action sheet tear-out page
**Goal**: Single "What to do Monday" page with top 5 actionable items extracted from all sections.
**Tasks**:
- Build action extractor that pulls top items from sections 06, 09, 15, 16
- Create ActionSheet component with numbered steps, simple layout
- Add as final section in web report
- Add as dedicated page in PDF with "tear out" styling

### #5 — PDF redesign
**Goal**: Make the PDF feel like a designed document worth $49.
**Tasks**:
- Redesign cover page (large name, radar chart, archetype, date)
- Add table of contents with page numbers
- Add colored section dividers between major sections
- Embed radar chart as image in PDF
- Add page numbers and footer branding
- Ensure proper page breaks between sections

### #6 — Landing page with value proposition
**Goal**: Build a sales page that explains what the assessment measures and why it's worth paying for.
**Tasks**:
- Hero section with headline + subline + CTA
- "What you'll discover" feature grid (6 HEXACO dimensions explained simply)
- Sample report preview (interactive or image carousel)
- Credibility section ("Based on HEXACO-PI-R framework from peer-reviewed personality research")
- FAQ section (Is this legit? How long does it take? Who is it for?)
- Pricing section (free preview vs full report comparison)

### #7 — Free summary → paywall → full report
**Goal**: Split report into free teaser + paid unlock.
**Tasks**:
- Create free summary page (archetype + radar chart + 3 key insights)
- Add Stripe Checkout integration for $49 payment
- Store payment status (Supabase or localStorage for MVP)
- Gate full report sections behind payment verification
- Add "Unlock Full Report" CTA on free summary page
- Handle payment success/failure flows

## Recently Completed

- [2026-03-25] Quiz navigation fix — faster animation, clear answers on restart, persist currentIndex
- [2026-03-25] Report crash fix — toDimensionsMap conversion, nullable narrative guard
- [2026-03-25] Branch cleanup — deleted stale worktree branches

## Session Log

### 2026-03-25
- Fixed quiz getting stuck (animation 600ms→200ms, answers persist cleared on restart)
- Fixed report TypeError crashes (scorer array→map conversion, optional chaining on narrative)
- Visual tested all 3 assessment modes end-to-end (Personality 60q, Learning 60q, Complete 120q)
- Cleaned up stale worktree branches
