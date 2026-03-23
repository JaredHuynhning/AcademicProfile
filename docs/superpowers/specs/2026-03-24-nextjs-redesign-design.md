# AcademicProfile — Next.js Redesign with Taste-Skill (Soft Skill)

## Overview

Full rebuild of the AcademicProfile student assessment app from SvelteKit to Next.js, applying taste-skill's "Soft Skill" (Warm Editorial) design language. The app helps students (grades 7-12) understand their personality, learning style, and academic strengths through a 120-question assessment with detailed personalized reports.

## Goals

1. **Framework migration:** SvelteKit → Next.js 15 (App Router)
2. **Visual redesign:** Apply Warm Editorial design language with premium typography, double-bezel card architecture, and scroll-driven animations
3. **Backend consolidation:** Port HEXACO scoring from Python to Next.js API routes
4. **Feature parity:** All existing functionality preserved
5. **New feature:** PDF export of reports

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React Server Components) |
| Styling | Tailwind CSS v4 + custom warm editorial theme tokens |
| Typography | Playfair Display (headings) + Satoshi (body) |
| Icons | Phosphor Icons (Light weight) |
| Animation | Framer Motion (card-swipe quiz, scroll reveals, page transitions) |
| State | Zustand with localStorage persistence |
| PDF | @react-pdf/renderer |
| Deployment | Vercel |

### Directory Structure

```
src/
  app/
    layout.tsx              # Root layout (fonts, theme, navbar)
    page.tsx                # Homepage (bento grid)
    test/
      page.tsx              # Quiz (card-swipe)
    report/
      page.tsx              # Report viewer (scrollable long-form)
    reports/
      page.tsx              # Saved reports gallery
    api/
      hexaco/
        items/route.ts      # Return HEXACO question items
        score/route.ts      # Score HEXACO answers (ported from Python)
  components/
    ui/                     # Shared primitives
      Button.tsx            # Pill button with nested icon pattern
      Card.tsx              # Double-bezel card component
      Badge.tsx             # Eyebrow pill badge
      ProgressBar.tsx       # Gradient progress bar
      FloatingTOC.tsx       # Expandable table of contents
    quiz/
      QuizCard.tsx          # Single question card (client component)
      LikertScale.tsx       # 1-5 scale buttons
      SectionInterstitial.tsx # Section transition card
      QuizProgress.tsx      # Top progress bar
    report/
      ReportCover.tsx
      ReportExecutiveSummary.tsx
      ReportWhoYouAre.tsx
      ReportHowYouLearn.tsx
      ReportWhatsWorking.tsx
      ReportBarriers.tsx
      ReportActionPlan.tsx
      ReportUnifiedGuide.tsx
      ReportGlance.tsx
      ReportDeepDive.tsx
      ReportLearning.tsx
      ReportDrives.tsx
      ReportStudy.tsx
      ReportGroup.tsx
      ReportStrengths.tsx
      ReportGuide.tsx
      ReportTutor.tsx
      ReportStudyProfile.tsx
      ReportAcademicCharacter.tsx
      ReportSubjectFit.tsx
      ReportWhatWorks.tsx
      ReportRootCause.tsx
      ReportAcademicGuide.tsx
    layout/
      Navbar.tsx            # Floating pill navbar
      Footer.tsx            # Minimal footer
      MobileMenu.tsx        # Full-screen overlay menu
    pdf/
      ReportPDF.tsx         # PDF layout for @react-pdf/renderer
  lib/
    scoring/
      hexaco-scorer.ts      # HEXACO scoring (ported from Python)
      learner-scorer.ts     # Learning profile scoring (ported from JS)
      study-scorer.ts       # Study profile scoring (ported from JS)
    report/
      index.ts              # Report generation orchestrator
      combinations.ts       # Cross-dimension scoring
      cross-reference-engine.ts
      cross-reference-rules.ts
      helpers.ts
      section-*.ts          # All 23 section generators (ported from JS)
    stores/
      quiz-store.ts         # Zustand: quiz state (answers, progress, results, name, mode)
      reports-store.ts      # Zustand: saved reports (localStorage)
    data/
      hexaco-items.ts       # 60 HEXACO items
      learner-items.ts      # 30 learner items
      study-items.ts        # 30 study items
      sample-profiles.ts    # Pre-generated demo data
```

### Data Flow

```
Homepage (select quiz mode, enter name)
  → Quiz Page (120 questions, card-swipe UX)
    → On complete: score all answers
      → HEXACO: POST /api/hexaco/score
      → Learning: client-side learner-scorer.ts
      → Study: client-side study-scorer.ts
    → Combine results → generate report sections
  → Report Page (scrollable long-form, 23 sections)
    → Save to localStorage (reports-store)
    → Export to PDF (@react-pdf/renderer)
```

## Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Cream | `#FDFBF7` | Page background |
| Espresso | `#2c2417` | Primary text, buttons |
| Warm Gray | `#8b7355` | Secondary text, labels |
| Parchment | `#f5f0e8` | Card outer shells, subtle backgrounds |
| White | `#ffffff` | Card inner cores |

**Dimension accent colors (preserved):**
- Honesty: `#14b8a6` (Teal)
- Emotionality: `#f43f5e` (Rose)
- Extraversion: `#f97316` (Orange)
- Agreeableness: `#22c55e` (Green)
- Conscientiousness: `#3b82f6` (Blue)
- Openness: `#8b5cf6` (Purple)

### Typography

| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| Display | Playfair Display | 36-64px | 700 | -0.02em |
| Section heading | Playfair Display | 24px | 700 | -0.01em |
| Body | Satoshi | 14-16px | 400 | normal |
| Eyebrow | Satoshi | 10px | 500 | 0.2em uppercase |
| Data/numbers | Satoshi | 20-28px | 700 | -0.01em |

**Minimum font size: 10px. No exceptions.**

### Card Architecture (Double-Bezel)

Every elevated card uses nested enclosures:

```
Outer Shell:
  - bg: rgba(139,115,85, 0.03)
  - border: 1px solid rgba(139,115,85, 0.06)
  - padding: 5-6px
  - border-radius: 24-28px

Inner Core:
  - bg: white
  - border-radius: calc(outer - padding)
  - box-shadow: inset 0 1px 1px rgba(255,255,255,0.8), 0 8px 32px rgba(139,115,85,0.06)
```

### Button Patterns

**Primary:** Espresso pill with nested trailing arrow icon
```
bg-espresso text-cream px-6 py-3 rounded-full
  → trailing: 28x28 circle, bg-cream/15, arrow icon
```

**Secondary:** Outlined pill
```
border border-espresso/20 text-espresso px-6 py-3 rounded-full
```

**Text:** Underlined link
```
text-warm-gray underline underline-offset-4
```

### Motion

All transitions use custom spring physics (never `linear` or `ease-in-out`):

```
Default: cubic-bezier(0.32, 0.72, 0, 1) duration 700ms
Spring: stiffness 300, damping 30 (for card swipes)
Scroll reveal: translate-y-16 blur-md opacity-0 → settled, 800ms
Stagger: 100ms delay between siblings
```

**Performance rules:**
- Animate only `transform` and `opacity`
- `backdrop-blur` only on sticky/fixed elements
- No `window.addEventListener('scroll')` — use Framer Motion `whileInView` or IntersectionObserver
- Use `min-h-[100dvh]` instead of `h-screen`

## Page Designs

### 1. Homepage (`/`)

**Layout:** Asymmetric bento grid

**Structure:**
- Full-width hero card at top: title, description, CTA button
- Below: 2x2 bento grid of assessment area cards (Personality, Learning, Study Style, Full Report)
- Each card shows: icon, title, brief description, item count
- Below bento: saved reports section (if any exist in localStorage)

**Interaction:**
- Name input in hero card
- CTA: "Begin" → navigates to `/test` with complete mode
- Individual bento cards could also be clickable for partial modes
- Scroll reveal animations on all cards (staggered)

**Mobile:** Single column stack, full-width cards, `px-4 py-8`

### 2. Quiz (`/test`)

**Layout:** Centered card-swipe

**Structure:**
- Sticky top bar: question counter (42/120), gradient progress bar, time estimate
- Section indicator pills (dimension name + question N of 10)
- Centered double-bezel card with question text (Playfair Display)
- Likert scale: 5 numbered buttons (48x48, rounded-xl)
- Keyboard hint at bottom (10px)

**Card-Swipe Behavior:**
- On answer: selected button fills espresso, card slides left + fades, next card enters from right with spring physics (400ms)
- On go back (left arrow): reverse animation, previous answer pre-selected
- Section transition: interstitial card showing new dimension name, accent color, question count. Auto-advances 1.5s.
- Completion: final card morphs into "Generating your report..." with loading animation, redirects to `/report`

**State:** Zustand quiz-store. Answers persisted to localStorage on each change.

**Mobile:** Card fills width with `px-4`. Likert buttons shrink to 40x40. Swipe gestures supported in addition to taps.

### 3. Report (`/report`)

**Layout:** Scrollable long-form magazine

**Structure:**
- Sticky frosted glass nav: student name, current section indicator, PDF download + Save buttons
- Cover section: student name, year, date, question count, 6 dimension score tiles (double-bezel)
- 23 report sections flowing vertically, separated by thin dividers
- Each section: eyebrow badge ("Section N"), Playfair heading, body text (max 65ch), data cards
- Floating TOC pill (bottom-right): expandable list of all sections with scroll-to-anchor links

**Scroll Behavior:**
- Each section fades up on viewport entry (translate-y-16 + blur → settled, 800ms)
- Data cards within sections stagger in (100ms delays)
- Sticky nav updates current section indicator based on scroll position

**PDF Export:**
- @react-pdf/renderer generates styled PDF matching on-screen design
- All 23 sections included with page breaks
- Triggered by "Download PDF" button in sticky nav

**Mobile:** Full-width sections, `px-4`. Floating TOC moves to bottom-center pill. Sticky nav simplified (name + PDF button).

### 4. Saved Reports (`/reports`)

**Layout:** Bento grid of report cards

**Structure:**
- Page title with eyebrow badge
- Grid of saved report cards (double-bezel): student name, date, quiz mode, score preview
- Sample profiles auto-loaded for demo
- Click card → navigate to `/report` with that profile's data
- Delete button (with confirmation) on each card

**State:** reports-store (Zustand + localStorage). Sample profiles refreshed when data version increments.

**Consolidation:** The current `/results` page is merged into `/reports` — one page for all saved/previous assessments.

### 5. Global Layout

**Navbar:** Floating glass pill, detached from top (`mt-6 mx-auto w-max rounded-full`). Logo left, nav links right. On scroll: subtle shadow increase.

**Mobile Menu:** Hamburger icon → lines morph to X → full-screen cream overlay with frosted glass. Links stagger in (translate-y-12 → settled, 100ms between each).

**Footer:** Minimal — copyright, assessment source attribution. Centered, warm gray text.

**Background:** `#FDFBF7` on all pages.

## Backend: HEXACO Scoring API

### Port Strategy

The current Python backend at `localhost:8000` provides:
- `GET /api/hexaco/items` — returns 60 HEXACO items with metadata
- `POST /api/hexaco/score` — accepts answers, returns 6 dimension scores + 24 facet scores

Both will be reimplemented as Next.js API routes in TypeScript:

**`/api/hexaco/items` (GET):**
- Return static item data from `hexaco-items.ts`
- No computation needed

**`/api/hexaco/score` (POST):**
- Accept: `{ answers: Record<number, number> }`
- Apply HEXACO-PI-R scoring algorithm (reverse-scored items, facet grouping, dimension aggregation)
- Return: `{ dimensions: DimensionScore[], facets: FacetScore[] }`

The scoring algorithm must be faithfully ported from the Python implementation. The existing `learner-scorer.js` and `study-scorer.js` are already client-side JS and port directly to TypeScript.

## PDF Export

**Library:** `@react-pdf/renderer`

**Approach:** A dedicated `ReportPDF.tsx` component that mirrors the on-screen report layout using react-pdf primitives (View, Text, StyleSheet). Generated client-side when user clicks "Download PDF."

**Includes:**
- Cover page with student info and dimension scores
- All 23 sections with proper page breaks
- Dimension accent colors for data visualization
- Playfair Display + Satoshi fonts embedded
- Minimum 12px font size in PDF (print-optimized)

## Constraints

1. **Minimum font size: 10px** across the entire app (12px in PDF)
2. **No banned fonts:** No Inter, Roboto, Arial, Open Sans, Helvetica
3. **No banned icons:** No thick-stroked Lucide/FontAwesome/Material. Phosphor Light only.
4. **No generic shadows:** No `shadow-md` or `rgba(0,0,0,0.3)`. All shadows warm-tinted.
5. **No centered heroes** for homepage (bento grid instead)
6. **No linear/ease-in-out motion:** Custom cubic-bezier or spring physics only
7. **GPU-safe animation only:** Transform + opacity. Never animate layout properties.
8. **Mobile-first responsive:** All layouts collapse to single column below 768px with `w-full px-4 py-8`
9. **No emojis in code or UI**
10. **Performance:** backdrop-blur only on sticky/fixed elements. Noise/grain on fixed pseudo-elements only.

## Testing Strategy

- Unit tests for all scoring logic (hexaco, learner, study)
- Unit tests for cross-reference engine
- Component tests for quiz card interactions
- E2E: complete quiz flow → report generation → PDF download
- Visual regression on key pages (homepage, quiz, report)

## Migration Checklist

1. [ ] Initialize Next.js 15 project with Tailwind v4
2. [ ] Set up fonts (Playfair Display, Satoshi) and theme tokens
3. [ ] Create shared UI components (Button, Card, Badge, ProgressBar)
4. [ ] Build global layout (Navbar, Footer, MobileMenu)
5. [ ] Port scoring logic to TypeScript (hexaco, learner, study)
6. [ ] Port report generation logic (23 section generators + orchestrator)
7. [ ] Port cross-reference engine
8. [ ] Create Zustand stores (quiz, reports) with localStorage persistence
9. [ ] Build homepage (bento grid)
10. [ ] Build quiz page (card-swipe with Framer Motion)
11. [ ] Build report page (scrollable long-form with scroll reveals)
12. [ ] Build saved reports page
13. [ ] Implement HEXACO API routes
14. [ ] Implement PDF export
15. [ ] Port sample profiles and demo data
16. [ ] Mobile responsive pass on all pages
17. [ ] Animation polish pass
18. [ ] Deploy to Vercel
