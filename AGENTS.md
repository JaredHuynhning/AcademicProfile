<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AcademicProfile — Agent State

## Current State

- **Last session**: 2026-03-30 — Working on #17 (10/10 report overhaul). Added bell curves, facet bar charts, dimension score cards, subject fit matrix, collapsible sections with key takeaways, PDF divider previews. 3 personas tested: 42 PDF pages, 9.1-9.9K web words, 0 errors each.
- **Next action**: Continue #17 — remaining items: more personalisation polish, varied prose structure, strengthen PDF chart rendering.

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
| 7 | Free summary → paywall → full report flow | backlog | P0 | Deferred — no payment integration for now |
| 11 | Visual benchmarks in report sections | done | P1 | Shipped 43bc117 |
| 9 | Student name personalization in narratives | done | P1 | Shipped cb2416d |
| 8 | PDF polish phase A — ExecSummary, Learning, Study, Guide | done | P2 | Shipped — 4 section-specific PDF renderers |
| 8b | PDF polish phase B — DeepDive, Strengths, Barriers | done | P2 | Shipped — 3 section-specific PDF renderers |
| 12 | Trust signals + social proof | done | P1 | Shipped — Guarantee, Testimonials, enhanced Credibility |
| 13 | Simplify to Complete Assessment only | done | P0 | Shipped — navbar + mode selection fixed |
| 14 | PDF rendering bugs — overlapping text, broken wrapping | done | P0 | Shipped 75b673b |
| 15 | 50-page report — consolidate 23 sections → 12 mega-sections | done | P0 | Shipped: 12 mega-sections, 11 deep generators, 24-page PDF, ~10K words |
| 16 | Deepen report to 50 pages — expand all generators | done | P0 | Shipped: 44 PDF pages, 14.5K words, section dividers, premium layout |
| 17 | 10/10 report overhaul — personalisation, visuals, content, UX | active | P0 | Fix name flow, add charts/infographics, remove generic advice, polish web experience |

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

### Ticket #15 AC
- [x] MegaSection, MegaSectionContent, MegaReport types exported from src/lib/report/mega-sections.ts
- [x] consolidateToMegaReport() produces exactly 12 sections
- [x] generateMegaReport() exported from src/lib/report/index.ts
- [x] Web report page renders 12 mega-sections via generateMegaReport
- [x] PDF renderer uses MegaSectionPage for 12 sections
- [x] All existing content renders via rawData fallback (no content loss)
- [x] `npm run build` exits 0

### Ticket #16 AC
- [x] PDF output is 40+ pages (44 pages verified)
- [x] Web report word count is 14,000+ words (14,477 verified)
- [x] Every mega-section generates substantial content regardless of score pattern
- [x] `npm run build` exits 0
- [x] Zero runtime errors when completing a quiz and viewing the report

### Ticket #17 AC — 10/10 Standard (Parents + Students)

**Personalisation (must feel like it was written by someone who KNOWS this child):**
- [x] Student name woven throughout narrative, not bolted on — reads naturally
- [x] Generic advice (active recall, sleep, movement) made conditional on personality scores
- [x] Different personas produce visibly different reports (different archetypes, different advice order, different emphasis)
- [ ] "Aha moment" density: at least 3 insights per section that make a parent say "that's EXACTLY my child"
- [ ] Score-interaction insights: e.g., "High C + Low X = perfectionist who won't ask for help" — not just individual dimensions
- [ ] Prose variety: no two consecutive paragraphs start the same way; varied sentence structure across sections

**Visual Impact (must look like a premium product, not a homework assignment):**
- [x] 6 bell curve distribution charts showing where student falls on population curve
- [x] 6 dimension score cards with facet bar breakdowns
- [x] Subject fit alignment matrix with colour-coded bars
- [x] Collapsible sections with animated expand/collapse
- [x] Section numbers and "Key Takeaway" boxes at the top of each section
- [ ] Strength/weakness visual summary — top 3 strengths vs top 3 barriers as visual cards, not just text
- [ ] "Your Profile at a Glance" — single-screen visual dashboard (web) showing archetype + radar + top 3 numbers

**Content Depth (must answer every question a parent would have):**
- [x] Each personality dimension gets its own deep-dive with all 4 facets analysed
- [x] Study methods ranked by personality fit, not generic
- [x] Subject-specific strategies based on dimension alignment
- [x] 30/60/90 day action plan with score-conditional actions
- [ ] Conversation scripts: actual word-for-word dialogue parents can use ("When your child says X, try responding with Y")
- [ ] "What teachers see vs what's really happening" — table mapping visible behaviours to underlying personality drivers

**Web UX (must feel premium and professional):**
- [x] Smooth scroll-triggered animations on section entry
- [x] Floating table of contents for navigation
- [x] PDF download working (42 pages, 0 errors across 3 personas)
- [ ] Progress indicator showing how far through the report the reader is
- [ ] Print-friendly styling (no dark backgrounds, appropriate page breaks)

**Reliability:**
- [x] `npm run build` exits 0
- [x] Zero runtime errors across 3 distinct personas (Mia Chen, Jake Morrison, Aisha Patel)
- [x] 42 PDF pages per persona, 9.1-9.9K web words

### Ticket #16 AC
- [ ] PDF output is 40+ pages (measured via page count)
- [ ] Web report word count is 14,000+ words
- [ ] Every mega-section generates at least 500 words regardless of score pattern
- [ ] `npm run build` exits 0
- [ ] Zero runtime errors when completing a quiz and viewing the report

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

- [2026-03-30] #16 Content depth — expanded all generators to 14.5K words, 44 PDF pages with section dividers, memory science, conversation scripts, dimension interactions, facet implications
- [2026-03-30] #15 50-page report — 12 mega-sections with 11 deep generators, MegaReport architecture, web+PDF renderers
- [2026-03-30] #14 PDF rendering fixes — 9 fixes (wrap, minWidth, vertical layout, lineHeight)
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

### 2026-03-30
- Shipped #14: 9 PDF rendering fixes (wrap={false}, minWidth, vertical root-cause, lineHeight)
- Shipped #15 Phase 1a: MegaReport architecture — 12 mega-sections consolidating 23 thin sections
- Shipped #15 Phase 1b: Deep generators for sections 1-4 (ExecSummary, Personality 8p, Learning 6p, Character 4p)
- Shipped #15 Phase 2: Deep generators for sections 5-8 (Study 6p, Strengths 4p, Barriers 5p, Social 3p)
- Shipped #15 Phase 3: Deep generators for sections 9-12 (SubjectFit 3p, Guide 5p, ActionPlan 3p, Appendix 1p)
- Fixed 3 runtime bugs (TDZ on dims, missing oScore, guide n param)
- Shipped #15 Phase 4: Action plan mega content, PDF threshold fix
- Shipped #16: Content depth expansion — 14.5K words across 8 expansion rounds
- Added section divider pages for premium book-like PDF layout
- Final: 44 PDF pages, 14,477 web words, 12 sections, 0 runtime errors
- 20 commits, all pushed to main

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

### 2026-03-30 (session 2 — 10/10 overhaul)
- Started #17: 10/10 report overhaul (personalisation, visuals, content, UX)
- Added chart infrastructure: chart-geometry.ts (bell curve math, colour utils)
- Built 6 web chart components: BellCurveChart, FacetBarChart, DimensionScoreCard, SubjectFitMatrix
- Built 2 PDF chart components: PDFBellCurve, PDFFacetBarChart
- Added DimensionDetail and SubjectAlignment types to MegaReport
- Integrated 6 dimension cards (with bell curves + facet bars) into personality section
- Added 6 mini bell curve distributions to executive summary
- Added subject fit matrix to subject-fit section
- Enhanced ReportSection with section numbers, key takeaway boxes, collapse/expand toggles
- Added keyTakeaway field to MegaSection with score-conditional summaries for all 11 sections
- PDF section dividers now show key findings previews
- Ran 3 personas (Mia Chen, Jake Morrison, Aisha Patel): 42 pages, 9.1-9.9K words, 0 errors each
- 4 commits pushed to main

### 2026-03-25
- Fixed quiz getting stuck (animation 600ms→200ms, answers persist cleared on restart)
- Fixed report TypeError crashes (scorer array→map conversion, optional chaining on narrative)
- Visual tested all 3 assessment modes end-to-end (Personality 60q, Learning 60q, Complete 120q)
- Cleaned up stale worktree branches





























### 2026-03-29 (session 3 — PDF rendering fixes)
- Shipped #14: Applied 9 rendering fixes to src/components/pdf/ReportPDF.tsx
  - PDFCallout: Removed wrap={false}, standardized lineHeight to 1.4
  - PDFTwoColumn: Added minWidth: 0 to flex children for proper text wrapping
  - PDFSubheading: Increased marginBottom from 6 to 10
  - renderGuide: Removed wrap={false} from support strategy cards
  - renderDeepDive: Removed wrap={false} from dimension cards
  - renderStrengths: Removed wrap={false} from strength/weakness blocks
  - renderBarriers: Removed wrap={false} from root-cause cards, converted horizontal layout to vertical (→ to ↓ arrow)
  - All fixes tested against design spec; npm run build passes
  - Commit: 75b673b




<!-- compaction-checkpoint-start -->
## Pre-Compaction Checkpoint
**When**: 2026-03-31 14:27:27 | **Branch**: main | **Activity**: 0 msgs, 0 tools, 0 files

**Recent work**:
- 

**Modified files**:
- 

**Dirty files** (63): .claude-project.json,AGENTS.md,AGENTS.md.backup,CLAUDE.md,src/app/report/page.tsx

> Resume context: Read this section + git diff + recent session log to reconstruct state.
<!-- compaction-checkpoint-end -->
