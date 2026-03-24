# AcademicProfile

## Current State
**Last session**: 2026-03-24 - Report renderer overhaul, PDF generation, homepage validation, section deduplication
**Next action**: Rewrite 23 section generators to output consistent data shapes (standardize report data schema)

---

## Active Tickets

| ID | Title | Status | Next Step |
|----|-------|--------|-----------|
| T1 | Frontend redesign with taste-skill | active | Standardize section generator output shapes |
| T2 | Rewrite section generators for consistent data | ready | Define standard ContentBlock schema, rewrite generators |

**Statuses:** `backlog` → `ready` → `active` → `done`

### Ticket #T1 AC
- [x] Homepage shows 3 clickable assessment cards: Personality (~10 min), Learning (~10 min), Complete (~20 min)
- [x] Clicking a card sets the correct quiz mode and navigates to /test
- [x] Hero card "Begin Assessment" button defaults to complete mode
- [x] Homepage collects full name, email, date of birth with validation
- [x] Report renders 15 deduplicated sections with rich content
- [x] PDF download generates proper document (not window.print)
- [x] Back button on report page
- [x] No navbar overlap on report page
- [ ] Features documented in feature-registry.md
- [ ] No dead code in modified files
- [ ] Code follows existing project patterns

### Ticket #T2 AC
- [ ] Define standard output schema (ContentBlock types: text, titled-text, bullet-list, rich-list, strengths-weaknesses, score-card)
- [ ] All 23 section generators output the standard schema
- [ ] Single renderer handles all sections consistently
- [ ] PDF renderer uses same schema for parity
- [ ] No inconsistent card styles (some with labels, some raw text dumps)
- [ ] No bare numbers or unformatted field names in output

---

## Blocked / Waiting

---

## Recently Completed
- [2026-03-24] Report renderer: eliminated empty cards, fixed title-casing, removed em dashes
- [2026-03-24] PDF: rewrote from window.print to @react-pdf/renderer with deep content extraction
- [2026-03-24] Homepage: added name+email+DOB validation with shake animation
- [2026-03-24] Sections: deduplicated from 21 to 15, removed 7 redundant sections
- [2026-03-24] Strengths: rich descriptions with analysis/tips, full-width single-side layout

---

## Gotchas
- Dev server runs from main project dir, NOT the worktree. Copy files to main before testing.
- Tailwind v4 uses CSS @theme, not JS config file
- Section generators output wildly different data shapes (23 files, each unique). Generic renderer can't handle them all consistently.
- `results.dimensions` is an object {H, E, X, A, C, O}, NOT an array. Cast through `unknown` for TypeScript.
- Vercel deploys fail silently if TypeScript errors exist. Always check deployment status.

---

## Decisions
- Complete mode shows all personality + academic + cross-referenced sections (no hiding)
- Removed "Who You Are" (bare scores), "Personality at a Glance" (covered by Deep Dive), guide duplicates (covered by Complete Guide)
- Em dashes globally replaced with colons for readability
- Every dimension guaranteed at least one growth area (promotes lowest neutral facet)
- Report uses @react-pdf/renderer for PDF, not window.print()

---

## Session Log
- [2026-03-24]: Report renderer overhaul (15 commits): fixed empty cards, PDF generation, homepage validation, section dedup, rich descriptions, back button, navbar hiding, DOB field | Next: Rewrite section generators for consistent output
- [2026-03-23]: Fixed low extraversion framing, widened sidebar, wired up Complete Profile tab with C1-C7 sections, added cross-reference engine | Next: Frontend redesign
