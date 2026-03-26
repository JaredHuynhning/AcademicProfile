# Landing Page — Problem-Agitate-Solution — Design Spec

## Overview

A marketing landing page at `/landing` targeting parents and teachers. Uses the Problem-Agitate-Solution storytelling flow to explain what the assessment measures and why it's worth paying for. Funnels visitors to `/` to begin the assessment.

## Route & Architecture

- **Route**: `/landing` — new Next.js page at `src/app/landing/page.tsx`
- **Relationship to `/`**: Landing page links to `/` via CTA buttons. No shared state needed — landing page is purely presentational.
- **Components**: All sections built as inline components within the page file. If any section exceeds ~80 lines, extract to `src/components/landing/`.

## Target Audience

Parents and teachers looking to understand a student's academic performance through personality and learning style analysis.

**Tone**: Authoritative but warm. "Unlock your student's potential." Not clinical, not playful — professional and caring.

## Section-by-Section Spec

### Section 1: Hero

**Content**:
- Eyebrow: "Academic Profile Assessment"
- Headline: "Grades don't tell the full story"
- Subline: "Discover the personality traits and learning patterns behind your student's academic performance — backed by peer-reviewed psychology."
- CTA: Button "Get Your Student's Profile" → link to `/`
- Pricing hint: small text below CTA: "Free preview available · Full report $49"

**Layout**: Centered, generous vertical padding (py-24 md:py-32). Headline is font-display text-4xl md:text-5xl. Max-width 640px for text block.

### Section 2: Problem — "The Problem with Grades"

**Content**: Three frustration cards that parents/teachers recognize:

| Icon | Frustration | Reframe |
|------|-------------|---------|
| 🚀 | "They're smart but won't study" | Their personality craves novelty — routine study methods bore them |
| 📚 | "Tutoring isn't helping" | The study method doesn't match their learning profile |
| 😰 | "They freeze during exams" | High emotionality drives test anxiety — it's not laziness |

**Layout**: Centered heading "The problem with grades" + 3 cards in a `grid-cols-1 md:grid-cols-3` grid. Each card uses existing `Card` component with icon at top, frustration text bold, reframe text as warm-gray body.

### Section 3: Agitate — "What If You Could See the Root Cause?"

**Content**:
- Heading: "What if you could see the root cause?"
- Body paragraph: "Most academic interventions treat symptoms — extra tutoring, stricter schedules, more practice exams. But when the real issue is a personality trait driving the behaviour, those interventions miss the mark. Our assessment finds the root cause by connecting who your student is with how they learn."
- Pattern cards: Show 3 archetypal patterns as examples:
  - 🚀 Energy Without Direction — "High openness and extraversion without the structure to channel it"
  - 🪞 Perfectionism Paralysis — "High conscientiousness creating analysis paralysis and avoidance"
  - 🔥 Burnout Risk — "Over-extending across commitments with no energy recovery system"

**Layout**: Narrative paragraph (max-w-[65ch], centered text), followed by 3 pattern cards in a grid.

### Section 4: Solution — "What You'll Discover"

**Content**: The 6 HEXACO dimensions, each explained for a parent/teacher audience:

| Dimension | Label | One-liner |
|-----------|-------|-----------|
| H | Honesty-Humility | How they handle rules, authority, and ethical decisions |
| E | Emotionality | Their stress response, anxiety patterns, and resilience |
| X | Extraversion | Social energy, classroom participation, and group dynamics |
| A | Agreeableness | Conflict style, teamwork, and response to feedback |
| C | Conscientiousness | Organisation, self-discipline, and study habits |
| O | Openness | Curiosity, creativity, and adaptability to new subjects |

**Layout**: "What you'll discover" heading + "Your student's complete learning DNA" subtext. 6 cards in `grid-cols-2 md:grid-cols-3` grid. Each card: dimension letter as large bold text (colored with DIM_COLORS), label, and one-liner.

### Section 5: Report Preview

**Content**:
- Heading: "See what's inside"
- 4 preview tabs/cards showing report sections:
  1. "Profile Cover" — radar chart + archetype
  2. "Action Plan" — the tear-out "What To Do Monday" page
  3. "Personality Deep Dive" — dimension analysis with strengths/growth
  4. "Guide for Parents" — practical guidance and conversation starters
- Each tab shows a placeholder image area (320x200px warm-gray/10 box with label text) that can be replaced with real screenshots later.

**Layout**: Tab-style selector at top (horizontal buttons), content area below showing the selected preview. Default to tab 1. Use React state to switch tabs.

### Section 6: Credibility

**Content**:
- Heading: "Built on science, not guesswork"
- Body: "The HEXACO Personality Inventory (HEXACO-PI-R) is a peer-reviewed assessment framework developed by psychologists Kibeom Lee and Michael Ashton. It's used by researchers and universities worldwide to measure six fundamental personality dimensions."
- Citation: "Lee, K., & Ashton, M. C. (2018). Psychometric properties of the HEXACO-100. Assessment, 25(5), 543-556."
- Additional line: "Combined with validated academic assessment instruments including the Grit Scale (Duckworth, 2007), ASRS attention screening, and Study Process Questionnaire."

**Layout**: Centered, max-w-[65ch]. Heading, body paragraph, citation in warm-gray italic, additional line.

### Section 7: Pricing

**Content**: Two-column comparison table.

**Free Preview**:
- Personality archetype ("The Compassionate Idealist")
- Radar chart visualisation
- 3 key personality insights
- Price: Free

**Full Report ($49)**:
- Everything in Free, plus:
- Complete personality deep dive (6 dimensions)
- Root cause analysis
- Personalised action plan ("What To Do Monday")
- Study prescription with weekly rhythm
- Guide for teachers, parents & tutors
- Downloadable PDF report
- Price: $49
- CTA: "Get the Full Report" button

**Layout**: `grid-cols-1 md:grid-cols-2` with Card components. Full report card has a subtle highlight (e.g., ring-2 ring-espresso/10 or slightly different background).

### Section 8: FAQ

**Content**: 5 trust-focused questions with expandable answers.

1. **"Is this scientifically valid?"** — Yes. The HEXACO-PI-R is a peer-reviewed personality framework published in Assessment, Journal of Personality, and other academic journals. It's been validated across cultures and age groups.

2. **"How long does the assessment take?"** — The complete assessment is 120 questions and takes about 20 minutes. A personality-only version (60 questions, ~10 minutes) is also available.

3. **"Is my child's data safe?"** — All responses are processed in-browser. No data is sent to external servers. Reports are generated locally and can be downloaded as PDF.

4. **"Who created this?"** — Built by Eyes of AI, combining validated psychometric instruments with modern data analysis to produce personalised, actionable learning profiles.

5. **"Can I see a sample before paying?"** — Yes. Every assessment includes a free preview with your student's personality archetype, radar chart, and 3 key insights. You only pay if you want the full report.

**Layout**: Accordion/disclosure pattern. Question as bold text, answer hidden until clicked. Use React state for toggle — no external dependency.

### Section 9: Final CTA

**Content**:
- Heading: "Ready to understand your student?"
- Subline: "It takes 20 minutes and could change how they learn forever."
- CTA: "Start the Assessment" button → `/`

**Layout**: Centered, generous padding, same styling as hero.

## Visual Style

- **Background**: cream (#fdfbf7) — matches existing app
- **Text**: espresso (#2c2417) primary, warm-gray (#8b7355) secondary
- **Components**: Reuse existing Card, Badge, Button from `@/components/ui/`
- **Animations**: framer-motion fadeUp pattern already used on `/` page
- **Typography**: font-display for headings, system font for body
- **No new dependencies**

## Dimension Colors (reused from existing palette)

```typescript
const DIM_COLORS = {
  H: "#a67c52",
  E: "#8b5a5a",
  X: "#d4a574",
  A: "#7a8a5e",
  C: "#6b7a8f",
  O: "#9b6d9c",
};
```

## Scope

### In Scope
- New `/landing` route with all 9 sections
- Reuse existing UI components
- Placeholder images for report preview (can be replaced later)
- Responsive design (mobile + desktop)
- Motion animations matching existing patterns

### Out of Scope
- Stripe integration (ticket #7)
- Actual payment flow
- Real report screenshot images (use placeholders)
- Analytics/tracking
- SEO meta tags (can be added later)
- Navigation changes to existing pages
