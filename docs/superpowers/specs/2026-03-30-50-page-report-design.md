# 50-Page Hyper-Detailed Academic Profile — Design Spec

**Tickets:** #14 (PDF bugs) + #15 (content depth) — combined into phased mega-ticket
**Date:** 2026-03-30
**Scope:** Consolidate 23 thin sections → 12 mega-sections producing ~50 pages of parent-friendly, research-backed academic profiling

## Vision

Transform the report from a lightweight personality summary into a comprehensive, $49-worth academic profile that:
- Analyzes personality AND academic patterns in deep, actionable detail
- Backs claims with research findings (parent-friendly tone)
- Provides specific, named strategies (not vague advice)
- Cross-references personality → academic connections throughout
- Reads like a professional psychologist's report, not a quiz result

## Architecture: 12 Mega-Sections

### Section 1: Cover + Executive Summary (3 pages)
**Merges:** `cover`, `executiveSummary`, `glance`, `personalityArchetype`
**Content:**
- Page 1: Cover with student name, date, radar chart, archetype label
- Page 2: One-page narrative executive summary — who this student is, strongest cross-system pattern, biggest barrier, most impactful action. Written as flowing prose, not bullets.
- Page 3: Key metrics dashboard — 6 dimension scores with benchmark bars, percentile rankings, 3 "headline findings" callouts, interpretive labels

**New depth:** Executive narrative expands from 1 paragraph to 3-4 paragraphs. Includes learning style label, dominant study approach, and personality-academic alignment score. The dashboard page is new — a visual summary parents can reference quickly.

### Section 2: Who You Are — Personality Deep Dive (8 pages)
**Merges:** `deepDive`, `whoYouAre`, `combinations`
**Content per dimension (~1.3 pages each, × 6 = ~8 pages):**
- **Score analysis**: Score, percentile, interpretive label, benchmark comparison
- **What this means**: 2-3 paragraph narrative explaining the dimension in plain English with research backing ("Research on conscientiousness shows that students scoring in the top quartile complete homework assignments 40% more consistently...")
- **Your 4 facets**: Each facet gets its own paragraph — score, what it means, how it shows up in daily life ("In the classroom, Sophie's high sincerity means she's unlikely to copy homework or take credit for others' work. Teachers may notice she's uncomfortable when asked to be diplomatic about poor group work...")
- **How this connects to learning**: Cross-reference callout linking personality to academic behavior ("Sophie's low anxiety (2.1/5) means she handles exam pressure well — see Section 5 for how to leverage this in study strategy")
- **Developmental context**: Brief note on how this trait typically develops in adolescence ("Conscientiousness typically increases through the teen years. Sophie's current score of 3.8 suggests she's ahead of the developmental curve...")

**New depth vs current:** Current deep dive is ~1 paragraph per dimension + facet bullet points. New version is 1.3 pages per dimension with flowing narrative, scenarios, research, and cross-references.

### Section 3: How Your Mind Works — Learning Profile (6 pages)
**Merges:** `learning`, `howYouLearn`, `studyProfile`
**Content:**
- **Learning style deep analysis** (1.5 pages): Primary and secondary learning styles with detailed descriptions, not just labels. How they interact ("Sophie is primarily a visual-spatial learner with strong kinesthetic secondary. This combination means she learns best when she can see AND do — pure lectures without visual aids will lose her attention within 15 minutes...")
- **Attention & focus profile** (1 page): Attention span patterns, optimal session length, distraction vulnerability, deep work capacity. Backed by attention research ("Research on adolescent attention shows the average sustained focus period is 20-25 minutes. Sophie's high conscientiousness extends this to approximately 35-40 minutes before a break is needed...")
- **Motivation drivers** (1 page): Intrinsic vs extrinsic motivation balance, what fuels engagement, what kills it. Specific to this student's personality combination ("Sophie's low greed-avoidance combined with high conscientiousness creates a powerful achievement loop: she's motivated by recognition AND has the discipline to earn it. Feed this with visible progress tracking...")
- **Curiosity & exploration patterns** (0.5 page): How the student explores new material, tolerance for ambiguity, preference for breadth vs depth
- **Ideal environment blueprint** (1 page): Physical environment, social setting, noise level, time of day, tool preferences — all derived from personality + learning data. Formatted as a concrete "room setup" specification.
- **Cross-reference synthesis** (1 page): How personality shapes learning — the unique interactions in THIS student's profile. Not generic advice, but specific "because you scored X on Y, your learning is affected like Z" connections.

### Section 4: Academic Character & Drive (4 pages)
**Merges:** `academicCharacter`, `drives`
**Content:**
- **Work ethic analysis** (1 page): How conscientiousness, organization, and diligence interact. Specific behaviors observed in students with this score pattern. Homework completion predictions, project management style.
- **Persistence & grit profile** (1 page): How the student handles difficulty, setbacks, and boring-but-necessary work. Based on conscientiousness + emotionality + agreeableness interaction. Includes "quit point" analysis — when and why this student gives up, and what prevents it.
- **Goal orientation** (1 page): Mastery vs performance goals, competition sensitivity, self-assessment accuracy. How the student measures success internally.
- **Intrinsic vs extrinsic motivation deep dive** (1 page): What truly drives this student — autonomy, mastery, purpose, rewards, social approval, fear of failure? Specific to their HEXACO profile with actionable parent/teacher strategies for each motivator.

### Section 5: Study Strategy Playbook (6 pages)
**Merges:** `study`, `whatWorks`
**Content:**
- **Optimal study methods** (1.5 pages): Ranked list of study techniques with fit analysis. Not just "use flashcards" but "Spaced repetition with Anki works well because Sophie's high conscientiousness means she'll actually maintain the review schedule. Set intervals at 1-3-7-14-30 days..."
- **Subject-specific strategies** (1.5 pages): Different approaches for STEM, humanities, languages, creative subjects — tailored to this student's learning style + personality. ("For mathematics: Sophie's visual-spatial learning style means worked examples are more effective than abstract proofs. Start each topic with a concrete problem, then generalize...")
- **Exam preparation timeline** (1 page): Week-by-week plan for exam periods, calibrated to this student's anxiety level, conscientiousness, and study style. Includes day-before and day-of protocols.
- **Weekly schedule template** (1 page): Specific time blocks for study, breaks, review, and recreation — based on attention profile and energy patterns. Includes weekday and weekend variants.
- **Study environment design** (0.5 page): Physical setup, digital tools, noise preferences, social study vs solo study recommendations — all derived from personality and learning data.
- **What NOT to do** (0.5 page): Anti-patterns specific to this student. "Don't force group study — Sophie's low extraversion means collaborative sessions drain energy faster than solo work. Limit group sessions to 1 per week, max 90 minutes."

### Section 6: Strengths & Superpowers (4 pages)
**Merges:** `strengths`, `whatsWorking`
**Content:**
- **Cross-referenced strengths** (1.5 pages): Each strength backed by personality + academic evidence. Not just "good at organization" but "Sophie's conscientiousness score of 3.8 (78th percentile) combines with her structured study approach to create a natural organizational advantage. In academic settings, this manifests as..."
- **Leverage strategies** (1.5 pages): For each strength, specific ways to amplify it. Named techniques, tools, habits. "Double down" plan for turning strengths into competitive advantages.
- **Strength interaction map** (0.5 page): How strengths reinforce each other — positive cycles in this student's profile.
- **Hidden strengths** (0.5 page): Strengths that aren't obvious from individual scores but emerge from combinations. Cross-reference engine findings that reveal unique capability patterns.

### Section 7: Barriers & Root Causes (5 pages)
**Merges:** `barriers`, `rootCause`
**Content:**
- **Root cause analysis** (2 pages): Each barrier traced from personality trait → academic symptom → visible behavior, with full explanatory narrative. Not just "low agreeableness → conflict" but a paragraph explaining the chain, with examples and research.
- **Misdiagnosis table** (1 page): Common wrong interpretations of this student's behavior. "It looks like laziness, but it's actually low extrinsic motivation combined with high openness — she's not lazy, she's bored by repetitive tasks and craves novelty..."
- **Negative cycles** (1 page): Self-reinforcing patterns that could get worse without intervention. Each cycle gets a narrative description, warning signs, and circuit-breaker actions.
- **Priority-ranked intervention plan** (1 page): Barriers ranked by urgency and impact, with specific interventions for each. Top 3 get detailed action protocols.

### Section 8: Social & Group Dynamics (3 pages)
**Merges:** `group`
**Content:**
- **Collaboration style** (1 page): How this student works in groups — leader, contributor, mediator, or independent? Based on extraversion + agreeableness + conscientiousness interaction. Specific scenarios for group projects.
- **Conflict patterns** (0.5 page): How the student handles disagreement, what triggers them, and constructive alternatives.
- **Friendship & social dynamics** (0.5 page): Social energy patterns, friendship depth vs breadth, social support needs for academic performance.
- **Leadership profile** (0.5 page): Natural leadership style (if any), conditions under which they lead effectively, how to develop leadership skills.
- **Team role recommendation** (0.5 page): Belbin-style team role analysis derived from HEXACO scores.

### Section 9: Subject Fit & Career Signals (3 pages)
**Merges:** `subjectFit`
**Content:**
- **Subject alignment matrix** (1.5 pages): Each major subject area scored for personality fit, learning style fit, and overall alignment. Detailed narrative for top 3 best fits and top 3 worst fits.
- **Passion & confidence analysis** (0.5 page): Where passion and confidence align (flow zone), where they diverge (growth zone or danger zone).
- **Early career signals** (1 page): Personality patterns that correlate with career satisfaction in different fields. Not career counseling — "early signals" framed as interesting patterns to explore. Research-backed connections between HEXACO profiles and professional satisfaction.

### Section 10: Teacher & Parent Guide (5 pages)
**Merges:** `guide`, `unifiedGuide`, `tutor`, `academicGuide`
**Content:**
- **For Teachers** (2 pages):
  - Quick personality profile summary (bullet list)
  - Feedback style guide: what works, what doesn't, specific phrasing suggestions
  - Classroom accommodation strategies (seating, participation, group work)
  - Warning signals and what to do when you see them
  - Conversation starters for parent-teacher meetings about this student
- **For Parents** (2 pages):
  - Understanding your child's profile (narrative)
  - Home environment optimization (specific, room-by-room)
  - Support strategies with Do/Don't columns
  - Homework help approach calibrated to personality
  - Warning signals at home and intervention scripts
  - Conversation guides: how to talk to your child about effort, grades, and growth
- **For Tutors** (1 page):
  - Tutor matching criteria: personality traits to look for
  - Session structure recommendations
  - Pacing and difficulty calibration
  - Rapport-building specific to this student's personality

### Section 11: Action Plan — What To Do Monday (3 pages)
**Merges:** `actionPlan`, `actionSheetParser`
**Content:**
- **Priority actions** (1 page): Top 5 numbered actions ranked by impact, each with a 1-paragraph explanation of why it matters for THIS student.
- **30/60/90 day plan** (1 page): Phased implementation timeline. Week 1-4: quick wins. Month 2: habit formation. Month 3: assessment and adjustment.
- **Weekly rhythm template** (0.5 page): Specific daily/weekly schedule recommendations.
- **Stop doing list** (0.5 page): Counterproductive habits to eliminate, with replacement behaviors.

### Section 12: Appendix (1 page)
**Content:**
- Score summary table (all dimensions + facets with scores)
- HEXACO methodology note (brief, parent-friendly)
- Glossary of terms used in the report
- "This report was generated on [date] based on 120 self-report questions..."

## Content Generation Model

Each generator function will produce content using this pattern:

```typescript
{
  narrative: string,           // 3-5 paragraphs of flowing analysis
  keyFindings: Finding[],      // Structured data for callouts/cards
  researchNotes: string[],     // "Research shows..." sentences
  scenarios: string[],         // "In the classroom..." examples
  crossReferences: CrossRef[], // Links to other sections
  actions: Action[],           // Specific, named strategies
}
```

The web report renderer and PDF renderer both consume this shape. Narratives render as prose. Structured data renders as cards, callouts, tables.

### Research Integration

Each generator includes pre-written research-backed statements that are conditionally selected based on score ranges. These are NOT citations — they're plain-English research summaries:

- "Students with conscientiousness scores above 3.5 complete homework 40% more consistently (personality research meta-analysis)"
- "High openness correlates with stronger performance in creative subjects but can cause boredom in repetitive drill-based courses"
- "Adolescent anxiety peaks around ages 13-15 and typically decreases with age — a current high score may moderate naturally"

These are embedded in generators, not fetched externally.

### Student Name Personalization

All narrative text uses the student's first name at key moments (2-3 times per page). Not every sentence — natural insertion points only.

## Phased Implementation

### Phase 1a: PDF Fixes + Architecture
1. Apply all 9 PDF rendering fixes (see `docs/superpowers/specs/2026-03-29-pdf-rendering-fixes-design.md`)
2. Create new consolidated generator architecture (new mega-section shape, updated `index.ts`, updated types)
3. Update web report renderer for new mega-section structure
4. Update PDF renderer for new section structure

**Deliverable:** Existing content in new architecture + fixed PDF rendering

### Phase 1b: Sections 1-4 Content
1. Implement Section 1: Cover + Executive Summary (expanded, 3 pages)
2. Implement Section 2: Who You Are — Personality Deep Dive (8 pages)
3. Implement Section 3: How Your Mind Works — Learning Profile (6 pages)
4. Implement Section 4: Academic Character & Drive (4 pages)

**Deliverable:** ~21 pages of deep content

### Phase 2: Strategy & Strengths (sections 5-8)
1. Implement Section 5: Study Strategy Playbook (6 pages)
2. Implement Section 6: Strengths & Superpowers (4 pages)
3. Implement Section 7: Barriers & Root Causes (5 pages)
4. Implement Section 8: Social & Group Dynamics (3 pages)
5. Expand cross-reference engine to feed all new sections

**Deliverable:** +18 pages, total ~39 pages

### Phase 3: Guides & Action (sections 9-12)
1. Implement Section 9: Subject Fit & Career Signals (3 pages)
2. Implement Section 10: Teacher & Parent Guide (5 pages)
3. Implement Section 11: Action Plan (3 pages)
4. Implement Section 12: Appendix (1 page)
5. End-to-end visual testing of 50-page PDF

**Deliverable:** +12 pages, total ~50 pages

### Phase 4: Final Polish
1. PDF running headers and page numbers for 50-page document (required)
2. Table of contents update for new 12-section structure (required)
3. Performance optimization if PDF generation >10s
4. Visual rhythm review — ensure 50 pages don't feel monotonous

## Non-Goals

- No changes to the quiz itself (still 120 questions)
- No new scoring algorithms (same HEXACO scorer)
- No external API calls or database changes
- No changes to the landing page or payment flow
- No AI/LLM-generated content at runtime — all content is template-driven from score ranges

## Failure Modes

1. **Repetitive content across 50 pages.** Severity: Critical if ignored. Mitigation: each section uses a distinct content pattern (narrative, scenario, research, action, cross-reference). Section templates vary their rhythm: flowing prose → structured data → callout → scenario → action.

2. **PDF generation performance.** Severity: Minor-Medium. 50-page react-pdf may take 5-15 seconds. Mitigation: test after Phase 1 (21 pages). If >8s, add loading indicator. If >15s, consider server-side generation.

3. **Cross-reference engine coverage.** Severity: Medium. Current engine only produces `confirmation` and `root_cause` insights. New sections need more cross-reference types (learning style connections, study method fits, social dynamics). Mitigation: expand cross-reference rules in Phase 2.

4. **Web report page length.** 50 pages of content in a single web page may feel overwhelming. Mitigation: the web report already has a floating TOC and sticky nav. New mega-sections should collapse by default with "Read more" expansion.

## Verification

After each phase:
1. Generate a test PDF with realistic varied scores
2. Verify page count is on target for that phase
3. Verify no text overlap, wrapping bugs, or cut-off content
4. Verify all cross-references point to real sections
5. Verify student name appears naturally throughout
6. `npm run build` exits 0
