<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AcademicProfile — Agent State

## Current State

- **Last session**: 2026-03-27 — Shipped tickets #4-#6, added "$49 polish" tickets #8-#11, began brainstorming #8 Phase A (ExecSummary, Learning, Study, Guide PDF components). Design approved, spec not yet written.
- **Next action**: Write spec for ticket #8 Phase A, then plan and implement. Design is already approved — just needs the spec doc written and committed.

## Active Tickets

| ID | Title | Status | Next Step |
|----|-------|--------|-----------|
| 1 | Radar chart + personality archetype | done | Shipped 7f2d68b |
| 2 | Score percentiles ("higher than 78%") | done | Shipped a9ec8e0 |
| 3 | Report visual rhythm (callouts, bars, pull quotes) | done | Shipped c99aa68 |
| 4 | Action sheet tear-out page | done | Shipped via merge to main |
| 5 | PDF redesign (cover, TOC, charts, page breaks) | done | Shipped via merge to main |
| 6 | Landing page with value proposition | done | Shipped via merge to main |
| 7 | Free summary → paywall → full report flow | backlog | Needs Stripe integration decision |
| 8 | PDF polish phase A — ExecSummary, Learning, Study, Guide | active | Write spec (design approved) |
| 8b | PDF polish phase B — DeepDive, Strengths, Barriers | ready | Depends on 8 patterns |
| 9 | Student name personalization in narratives | ready | Weave student name into generated prose across all sections |
| 10 | Landing page real screenshots | ready | Capture actual report screenshots for the preview carousel |
| 11 | Visual benchmarks in report sections | ready | Add score scales/comparisons so numbers have context |

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

### Ticket #2 AC
- [ ] Each HEXACO dimension shows "higher than X% of students" on the cover trait cards
- [ ] Percentile computation uses a normal distribution approximation (mean ~3.0, SD ~0.7)
- [ ] Percentile values are between 1 and 99 (clamped, never 0% or 100%)
- [ ] Percentile appears in the PDF cover score cards
- [ ] Glance section dimension cards include percentile
- [ ] Features documented in feature-registry.md
- [ ] No dead code in modified files
- [ ] Code follows existing project patterns

### #3 — Report visual rhythm
**Goal**: Break up wall-of-text sections with visual variety.

### Ticket #3 AC
- [ ] ScoreBar component renders horizontal bar with fill color, score label, and level text
- [ ] Callout component renders with colored left border, optional icon, and body text
- [ ] PullQuote component renders emphasized quote text distinct from body paragraphs
- [ ] Glance section uses ScoreBar for each dimension instead of plain text scores
- [ ] Deep Dive section uses Callout for learningCallout data
- [ ] Strengths section uses Callout for growthMindset/whatToDo
- [ ] No new npm dependencies
- [ ] Features documented in feature-registry.md
- [ ] No dead code in modified files
- [ ] Code follows existing project patterns

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

### #8 — PDF body polish
**Goal**: Make every PDF section as visually polished as the action sheet tear-out.
**Tasks**:
- Replace generic `deepRenderValue()` with designed layouts for each major section
- Add ScoreBar equivalents in PDF for dimension scores
- Add Callout-style boxes for key insights, warnings, tips
- Add two-column layouts for strengths/weaknesses with proper cards
- Ensure consistent visual rhythm: heading → narrative → visual data → callout

### #9 — Student name personalization
**Goal**: Make the report feel personal by weaving the student's name into narrative prose.
**Tasks**:
- Pass student name into each section generator function
- Replace "your student" / "the student" with first name in key narrative paragraphs
- Cover page already uses name; extend to section narratives, action plan, guide sections
- Keep it natural — not every sentence, just key moments ("Sophie's high extraversion...")

### #10 — Landing page real screenshots
**Goal**: Replace placeholder preview boxes with actual report screenshots.
**Tasks**:
- Generate a sample report with realistic data (not all 3.0 scores)
- Capture screenshots of: cover, action plan, personality deep dive, parent guide
- Add images to ReportPreview component replacing placeholder divs
- Optimize images for web (compress, correct dimensions)

### #11 — Visual benchmarks in report
**Goal**: Give scores context so parents understand what the numbers mean.
**Tasks**:
- Add visual scale bars showing where the student falls relative to population
- Show "average student" reference line on score displays
- Add interpretive labels: "Well below average / Below / Average / Above / Well above"
- Apply to both web report and PDF sections

## Recently Completed

- [2026-03-26] #6 Landing page — PAS storytelling, pricing, FAQ, 9 sections at /landing
- [2026-03-26] #5 PDF redesign — editorial clean: cover, TOC, section eyebrows, three-column footer
- [2026-03-26] #4 Action sheet tear-out — numbered priorities, study Rx, quick wins, stop-doing, weekly rhythm
- [2026-03-26] #3 Visual rhythm — ScoreBar, Callout, PullQuote components
- [2026-03-26] #2 Score percentiles — "Higher than X% of students" on trait cards
- [2026-03-26] #1 Radar chart + archetype — spider chart + "The Compassionate Idealist"
- [2026-03-25] Report crash fix — toDimensionsMap conversion, nullable narrative guard
- [2026-03-25] Quiz navigation fix — faster animation, clear answers on restart

## Session Log

### 2026-03-26 (session 2)
- Shipped #4: Action sheet tear-out — "What To Do Monday" with numbered priorities, study Rx, quick wins, stop-doing, weekly rhythm (web + PDF)
- Shipped #5: PDF editorial clean redesign — refined cover, TOC with dot leaders, numbered section eyebrows, three-column contextual footer
- Shipped #6: PAS landing page at /landing — hero, problem cards, root cause patterns, HEXACO feature grid, report preview tabs, credibility, pricing ($0/$49), trust FAQ, final CTA
- Visual tested all new features with Playwright screenshots — all pass

### 2026-03-26 (session 1)
- Brainstormed "$49 product" roadmap — identified 7 tickets to transform from free quiz to sellable product
- Shipped #1: HEXACO radar chart (custom SVG, zero deps) + 22 personality archetypes
- Shipped #2: Score percentiles using normal CDF approximation (mean=3.0, SD=0.7)
- Shipped #3: ScoreBar, Callout, PullQuote components for visual variety in report
- Visual tested all features with Playwright across Personality/Learning/Complete modes

### 2026-03-25
- Fixed quiz getting stuck (animation 600ms→200ms, answers persist cleared on restart)
- Fixed report TypeError crashes (scorer array→map conversion, optional chaining on narrative)
- Visual tested all 3 assessment modes end-to-end (Personality 60q, Learning 60q, Complete 120q)
- Cleaned up stale worktree branches























<!-- compaction-checkpoint-start -->
## Pre-Compaction Checkpoint
**When**: 2026-03-26 22:29:47 | **Branch**: main | **Activity**: 5 msgs, 0
0 tools, 0
0 files

**Recent work**:
- - - - - - - - - - - - - - - - - - - ### [20:30:21] 💬 User Message
- - - - - - - - - - - - - - - - - - - ### [21:00:27] 💬 User Message
- - - - - - - - - - - - - - - - - - - ### [21:12:54] 💬 User Message
- - - - - - - - - - - - - - - - - - - ### [21:13:53] 💬 User Message
- - - - - - - - - - - - - - - - - - - ### [22:10:40] 💬 User Message

**Modified files**:
- 

**Dirty files** (3): .claude-project.json,AGENTS.md,AGENTS.md.backup

> Resume context: Read this section + git diff + recent session log to reconstruct state.
<!-- compaction-checkpoint-end -->
