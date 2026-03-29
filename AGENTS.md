<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AcademicProfile — Agent State

## Current State

- **Last session**: 2026-03-29 — CEO value audit + shipped 7 tickets (#8, #8b, #9, #10, #11, #12, #13). PDF has rendering bugs and all sections need more content depth.
- **Next action**: Fix PDF rendering (#14) then deepen content across all report sections (#15). These are the real blockers for $49 value.

## Launch Readiness

**Audit verdict (2026-03-29):** Product content is $49+ quality (cross-reference engine, root-cause analysis, branching action plans). Presentation and sales infrastructure are not ready yet. Must ship #10, #7, #11, #9 before charging $49.

**Revenue blockers (must ship before launch):**
1. No product screenshots on landing page (#10)
2. No payment flow (#7)
3. No visual benchmarks — numbers lack context (#11)
4. Generic "this student" prose (#9)

**Trust signals needed (no ticket yet):**
- Social proof / testimonials (even one beta-test quote)
- Credentials / about section
- Money-back guarantee copy
- HEXACO explainer for parents (not researchers)
- "120 questions — takes 15-20 min" reassurance

## Active Tickets

| ID | Title | Status | Priority | Next Step |
|----|-------|--------|----------|-----------|
| 1 | Radar chart + personality archetype | done | — | Shipped 7f2d68b |
| 2 | Score percentiles ("higher than 78%") | done | — | Shipped a9ec8e0 |
| 3 | Report visual rhythm (callouts, bars, pull quotes) | done | — | Shipped c99aa68 |
| 4 | Action sheet tear-out page | done | — | Shipped via merge to main |
| 5 | PDF redesign (cover, TOC, charts, page breaks) | done | — | Shipped via merge to main |
| 6 | Landing page with value proposition | done | — | Shipped via merge to main |
| 10 | Landing page real screenshots | done | P0 | Shipped a81f343 |
| 7 | Free summary → paywall → full report flow | ready | P0 | No Stripe = no revenue — ship simple Checkout |
| 11 | Visual benchmarks in report sections | done | P1 | Shipped 43bc117 |
| 9 | Student name personalization in narratives | done | P1 | Shipped cb2416d |
| 8 | PDF polish phase A — ExecSummary, Learning, Study, Guide | done | P2 | Shipped — 4 section-specific PDF renderers |
| 8b | PDF polish phase B — DeepDive, Strengths, Barriers | done | P2 | Shipped — 3 section-specific PDF renderers |
| 12 | Trust signals + social proof | done | P1 | Shipped — Guarantee, Testimonials, enhanced Credibility |
| 13 | Simplify to Complete Assessment only | done | P0 | Shipped — navbar + mode selection fixed |
| 14 | PDF rendering bugs — overlapping text, broken wrapping | ready | P0 | Guide section has overlapping callouts, text running off page |
| 15 | Report content depth — all sections need more substance | ready | P0 | Every section needs more paragraphs, analysis, specific advice |

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

### Ticket #13 AC
- [x] Only Complete Assessment mode — no personality-only or learning-only options
- [x] Begin Assessment goes straight to 120-question quiz (no mode selection step)
- [x] `npm run build` exits 0

### Ticket #12 AC
- [x] Landing page has a Guarantee section with money-back guarantee copy
- [x] Landing page has a HEXACO explainer section framed for parents (6 dimension cards with plain-English descriptions)
- [x] Landing page has a Testimonials section with 3 social proof quotes (parent, teacher, parent)
- [x] Credibility section enhanced with "built by educators" framing and parent-friendly dimension grid
- [x] `npm run build` exits 0

### Ticket #8b AC
- [x] renderDeepDive renders 6 dimension cards with ScoreBars, facet insights, and learning callouts
- [x] renderStrengths renders strengths/weaknesses with two-column layout and growth mindset callout
- [x] renderBarriers renders root cause chains, misdiagnosis two-column, cycles, and priority ranking
- [x] All 3 sections wired into CUSTOM_SECTION_RENDERERS (deepDive, strengths, barriers)
- [x] `npm run build` exits 0

### Ticket #8 AC
- [x] PDFCallout, PDFTwoColumn, PDFSubheading helper components exist in ReportPDF.tsx
- [x] renderExecSummary renders archetype + narrative + two-column strength/barrier + action callout
- [x] renderLearning renders narrative + learningStyle card + environment grid + format table + insight callout
- [x] renderStudy renders narrative + methods table + subject strategy cards + exam timeline + weekly plan
- [x] renderGuide renders Teacher/Parent sections with feedback card, classroom tips, callout warnings, dos/donts
- [x] All 4 sections (+ unifiedGuide) wired via CUSTOM_SECTION_RENDERERS map
- [x] `npm run build` exits 0

### Ticket #9 AC
- [x] Zero occurrences of "this student" in generated report text (grep returns 0)
- [x] Student name appears in Cover, Guide, Tutor, Academic Guide, Unified Guide, Executive Summary sections
- [x] `npm run build` exits 0

### Ticket #11 AC
- [x] `interpretiveLabel()` function exists in helpers.ts and returns correct labels
- [x] ScoreBar component accepts showBenchmark + interpretLabel props
- [x] Cover section shows mini ScoreBar with benchmark line on trait cards
- [x] Glance/dimension score bars show benchmark line (via generic ObjectCard renderer)
- [x] All score displays show interpretive label text ("Above Average", etc.)
- [x] PDF cover + generic content show benchmark markers via PDFScoreBar
- [x] `npm run build` exits 0
- [x] Landing page screenshots updated with new benchmark visuals

### #10 — Landing page real screenshots
**Goal**: Replace placeholder preview boxes with actual report screenshots.
**Tasks**:
- Generate a sample report with realistic data (not all 3.0 scores)
- Capture screenshots of: cover, action plan, personality deep dive, parent guide
- Add images to ReportPreview component replacing placeholder divs
- Optimize images for web (compress, correct dimensions)

### Ticket #10 AC
- [x] 4 PNG screenshot files exist in public/screenshots/ (cover, action-plan, deep-dive, guide)
- [x] Each screenshot is >10KB (non-empty, real content captured — 183KB-500KB each)
- [x] ReportPreview component renders <img> tags instead of placeholder text
- [x] Landing page at /landing loads without errors (HTTP 200)
- [x] Build passes (npm run build exits 0)

### #11 — Visual benchmarks in report
**Goal**: Give scores context so parents understand what the numbers mean.
**Tasks**:
- Add visual scale bars showing where the student falls relative to population
- Show "average student" reference line on score displays
- Add interpretive labels: "Well below average / Below / Average / Above / Well above"
- Apply to both web report and PDF sections

## Recently Completed

- [2026-03-29] #12 Trust signals — Guarantee (money-back), Testimonials (3 quotes), enhanced Credibility with parent-friendly HEXACO explainer
- [2026-03-29] #8b PDF polish B — 3 section-specific renderers (DeepDive, Strengths, Barriers) with dimension cards, two-column strength/weakness, root cause chains, misdiagnosis visualization
- [2026-03-29] #8 PDF polish A — 4 section-specific renderers (ExecSummary, Learning, Study, Guide) with callouts, two-column layouts, score bars
- [2026-03-29] #9 Name personalization — "Sophie" replaces "this student" in 7 section generators (62 occurrences)
- [2026-03-29] #11 Visual benchmarks — interpretiveLabel(), ScoreBar benchmark line, PDFScoreBar, updated screenshots
- [2026-03-29] #10 Landing page real screenshots — 4 Playwright-captured report section images replacing placeholder text
- [2026-03-26] #6 Landing page — PAS storytelling, pricing, FAQ, 9 sections at /landing
- [2026-03-26] #5 PDF redesign — editorial clean: cover, TOC, section eyebrows, three-column footer
- [2026-03-26] #4 Action sheet tear-out — numbered priorities, study Rx, quick wins, stop-doing, weekly rhythm
- [2026-03-26] #3 Visual rhythm — ScoreBar, Callout, PullQuote components
- [2026-03-26] #2 Score percentiles — "Higher than X% of students" on trait cards
- [2026-03-26] #1 Radar chart + archetype — spider chart + "The Compassionate Idealist"
- [2026-03-25] Report crash fix — toDimensionsMap conversion, nullable narrative guard
- [2026-03-25] Quiz navigation fix — faster animation, clear answers on restart

## Session Log

### 2026-03-29
- CEO value audit: product is ~70% of $49 value — cross-reference engine is the moat, presentation gaps were blockers
- Reprioritized tickets: #10 (screenshots) and #7 (Stripe) as P0, #11/#9 as P1, #8 as P2
- Shipped #10: Playwright screenshot capture script, 4 real report section images in landing page carousel
- Shipped #11: interpretiveLabel() utility, ScoreBar benchmark marker at population mean, PDFScoreBar, interpretive labels on all scores
- Shipped #9: firstName() helper, "this student" → student name in 7 section generators (62 replacements)
- Shipped #8: 4 section-specific PDF renderers (ExecSummary, Learning, Study, Guide) with PDFCallout, PDFTwoColumn, PDFSubheading

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
**When**: 2026-03-29 22:26:14 | **Branch**: main | **Activity**: 4 msgs, 0
0 tools, 0
0 files

**Recent work**:
- - ### [12:25:56] 💬 User Message
- - ### [13:15:52] 💬 User Message
- - ### [13:19:40] 💬 User Message
- ### [21:28:29] 💬 User Message

**Modified files**:
- 

**Dirty files** (4): .claude-project.json,AGENTS.md,AGENTS.md.backup,.claude/

> Resume context: Read this section + git diff + recent session log to reconstruct state.
<!-- compaction-checkpoint-end -->
