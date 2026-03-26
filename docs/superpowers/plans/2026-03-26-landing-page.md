# Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Problem-Agitate-Solution marketing landing page at `/landing` targeting parents and teachers, with pricing comparison and trust-focused FAQ.

**Architecture:** A new Next.js page at `src/app/landing/page.tsx` that assembles 9 section components from `src/components/landing/`. Each section is a self-contained component. The page is purely presentational — no data fetching, no state beyond UI toggles for FAQ and preview tabs.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, framer-motion

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/landing/Hero.tsx` | Create | Hero with headline, subline, CTA |
| `src/components/landing/ProblemCards.tsx` | Create | 3 frustration cards |
| `src/components/landing/RootCause.tsx` | Create | Agitate section with pattern cards |
| `src/components/landing/FeatureGrid.tsx` | Create | 6 HEXACO dimensions grid |
| `src/components/landing/ReportPreview.tsx` | Create | Tabbed screenshot preview |
| `src/components/landing/Credibility.tsx` | Create | Science/research section |
| `src/components/landing/Pricing.tsx` | Create | Free vs Full comparison |
| `src/components/landing/FAQ.tsx` | Create | 5 trust-focused Q&As |
| `src/components/landing/FinalCTA.tsx` | Create | Closing CTA |
| `src/app/landing/page.tsx` | Create | Page assembling all sections |

---

### Task 1: Hero + FinalCTA Components

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Create: `src/components/landing/FinalCTA.tsx`

These two sections share the same centered CTA pattern, so build them together.

- [ ] **Step 1: Create Hero component**

```tsx
// src/components/landing/Hero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function Hero() {
  return (
    <section className="py-24 md:py-32 text-center">
      <motion.div {...fadeUp} className="max-w-[640px] mx-auto">
        <Badge>Academic Profile Assessment</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-4 leading-[1.1] text-espresso">
          Grades don&apos;t tell the full story
        </h1>
        <p className="text-warm-gray mt-4 text-lg leading-relaxed">
          Discover the personality traits and learning patterns behind your
          student&apos;s academic performance — backed by peer-reviewed psychology.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" icon>
              Get Your Student&apos;s Profile
            </Button>
          </Link>
        </div>
        <p className="text-xs text-warm-gray/60 mt-3">
          Free preview available · Full report $49
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create FinalCTA component**

```tsx
// src/components/landing/FinalCTA.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function FinalCTA() {
  return (
    <section className="py-24 text-center">
      <motion.div {...fadeUp} className="max-w-[640px] mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso">
          Ready to understand your student?
        </h2>
        <p className="text-warm-gray mt-3 text-lg leading-relaxed">
          It takes 20 minutes and could change how they learn forever.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" icon>
              Start the Assessment
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Hero.tsx src/components/landing/FinalCTA.tsx
git commit -m "feat(landing): add Hero and FinalCTA components"
```

---

### Task 2: ProblemCards Component

**Files:**
- Create: `src/components/landing/ProblemCards.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/landing/ProblemCards.tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const problems = [
  {
    icon: "🚀",
    frustration: "\"They're smart but won't study\"",
    reframe: "Their personality craves novelty — routine study methods bore them",
  },
  {
    icon: "📚",
    frustration: "\"Tutoring isn't helping\"",
    reframe: "The study method doesn't match their learning profile",
  },
  {
    icon: "😰",
    frustration: "\"They freeze during exams\"",
    reframe: "High emotionality drives test anxiety — it's not laziness",
  },
];

export function ProblemCards() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          The problem with grades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.icon}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              viewport={{ once: true }}
            >
              <Card className="!p-6 h-full">
                <span className="text-2xl">{p.icon}</span>
                <p className="font-semibold text-espresso mt-3">{p.frustration}</p>
                <p className="text-sm text-warm-gray mt-2 leading-relaxed">{p.reframe}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/ProblemCards.tsx
git commit -m "feat(landing): add ProblemCards component"
```

---

### Task 3: RootCause Component

**Files:**
- Create: `src/components/landing/RootCause.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/landing/RootCause.tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const patterns = [
  {
    icon: "🚀",
    name: "Energy Without Direction",
    desc: "High openness and extraversion without the structure to channel it",
  },
  {
    icon: "🪞",
    name: "Perfectionism Paralysis",
    desc: "High conscientiousness creating analysis paralysis and avoidance",
  },
  {
    icon: "🔥",
    name: "Burnout Risk",
    desc: "Over-extending across commitments with no energy recovery system",
  },
];

export function RootCause() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-4">
          What if you could see the root cause?
        </h2>
        <p className="text-warm-gray text-center max-w-[65ch] mx-auto leading-relaxed mb-10">
          Most academic interventions treat symptoms — extra tutoring, stricter
          schedules, more practice exams. But when the real issue is a personality
          trait driving the behaviour, those interventions miss the mark. Our
          assessment finds the root cause by connecting who your student is with
          how they learn.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patterns.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              viewport={{ once: true }}
            >
              <Card className="!p-5 h-full">
                <span className="text-2xl">{p.icon}</span>
                <p className="font-semibold text-espresso mt-2">{p.name}</p>
                <p className="text-sm text-warm-gray mt-1.5 leading-relaxed">{p.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/RootCause.tsx
git commit -m "feat(landing): add RootCause agitate component"
```

---

### Task 4: FeatureGrid Component

**Files:**
- Create: `src/components/landing/FeatureGrid.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/landing/FeatureGrid.tsx
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const DIM_COLORS: Record<string, string> = {
  H: "#a67c52",
  E: "#8b5a5a",
  X: "#d4a574",
  A: "#7a8a5e",
  C: "#6b7a8f",
  O: "#9b6d9c",
};

const dimensions = [
  { key: "H", label: "Honesty-Humility", desc: "How they handle rules, authority, and ethical decisions" },
  { key: "E", label: "Emotionality", desc: "Their stress response, anxiety patterns, and resilience" },
  { key: "X", label: "Extraversion", desc: "Social energy, classroom participation, and group dynamics" },
  { key: "A", label: "Agreeableness", desc: "Conflict style, teamwork, and response to feedback" },
  { key: "C", label: "Conscientiousness", desc: "Organisation, self-discipline, and study habits" },
  { key: "O", label: "Openness", desc: "Curiosity, creativity, and adaptability to new subjects" },
];

export function FeatureGrid() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-2">
          What you&apos;ll discover
        </h2>
        <p className="text-warm-gray text-center mb-10">
          Your student&apos;s complete learning DNA
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dimensions.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.07 * i }}
              viewport={{ once: true }}
            >
              <Card className="!p-5 h-full">
                <p
                  className="font-display text-3xl font-bold"
                  style={{ color: DIM_COLORS[d.key] }}
                >
                  {d.key}
                </p>
                <p className="font-semibold text-espresso text-sm mt-2">{d.label}</p>
                <p className="text-xs text-warm-gray mt-1 leading-relaxed">{d.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/FeatureGrid.tsx
git commit -m "feat(landing): add FeatureGrid HEXACO dimensions component"
```

---

### Task 5: ReportPreview Component

**Files:**
- Create: `src/components/landing/ReportPreview.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/landing/ReportPreview.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const tabs = [
  { id: "cover", label: "Profile Cover", desc: "Personality archetype, radar chart, and dimension scores at a glance" },
  { id: "action", label: "Action Plan", desc: "\"What To Do Monday\" — numbered priorities, study prescription, and weekly rhythm" },
  { id: "personality", label: "Personality Deep Dive", desc: "Strengths, growth areas, and practical insights for each dimension" },
  { id: "guide", label: "Guide for Parents", desc: "Conversation starters, home study tips, and warning signs to watch for" },
];

export function ReportPreview() {
  const [active, setActive] = useState("cover");
  const current = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          See what&apos;s inside
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === tab.id
                  ? "bg-espresso text-cream"
                  : "bg-warm-gray/5 text-warm-gray hover:bg-warm-gray/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-warm-gray/5 rounded-2xl border border-warm-gray/10 overflow-hidden">
            <div className="h-[240px] md:h-[320px] flex items-center justify-center bg-warm-gray/[0.03]">
              <div className="text-center px-6">
                <p className="text-warm-gray/40 text-sm">Preview</p>
                <p className="text-warm-gray/60 text-lg font-semibold mt-1">{current.label}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-warm-gray leading-relaxed">{current.desc}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/ReportPreview.tsx
git commit -m "feat(landing): add ReportPreview tabbed component"
```

---

### Task 6: Credibility + Pricing + FAQ Components

**Files:**
- Create: `src/components/landing/Credibility.tsx`
- Create: `src/components/landing/Pricing.tsx`
- Create: `src/components/landing/FAQ.tsx`

- [ ] **Step 1: Create Credibility component**

```tsx
// src/components/landing/Credibility.tsx
"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function Credibility() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp} className="max-w-[65ch] mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso mb-4">
          Built on science, not guesswork
        </h2>
        <p className="text-warm-gray leading-relaxed">
          The HEXACO Personality Inventory (HEXACO-PI-R) is a peer-reviewed
          assessment framework developed by psychologists Kibeom Lee and Michael
          Ashton. It&apos;s used by researchers and universities worldwide to
          measure six fundamental personality dimensions.
        </p>
        <p className="text-warm-gray/60 text-sm italic mt-4">
          Lee, K., &amp; Ashton, M. C. (2018). Psychometric properties of the
          HEXACO-100. Assessment, 25(5), 543–556.
        </p>
        <p className="text-warm-gray text-sm mt-4 leading-relaxed">
          Combined with validated academic assessment instruments including the
          Grit Scale (Duckworth, 2007), ASRS attention screening, and Study
          Process Questionnaire.
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create Pricing component**

```tsx
// src/components/landing/Pricing.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const freeFeatures = [
  "Personality archetype label",
  "Radar chart visualisation",
  "3 key personality insights",
];

const fullFeatures = [
  "Everything in Free, plus:",
  "Complete personality deep dive (6 dimensions)",
  "Root cause analysis",
  "Personalised action plan",
  "Study prescription with weekly rhythm",
  "Guide for teachers, parents & tutors",
  "Downloadable PDF report",
];

export function Pricing() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          Simple pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Card className="!p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray">
              Free Preview
            </p>
            <p className="font-display text-3xl font-bold text-espresso mt-2">$0</p>
            <ul className="mt-5 space-y-2.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-warm-gray">
                  <span className="text-warm-gray/40 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/">
                <Button variant="secondary" className="w-full justify-center">
                  Try Free Preview
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="!p-6 ring-2 ring-espresso/10">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray">
              Full Report
            </p>
            <p className="font-display text-3xl font-bold text-espresso mt-2">$49</p>
            <ul className="mt-5 space-y-2.5">
              {fullFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-espresso">
                  <span className="text-espresso/40 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/">
                <Button variant="primary" icon className="w-full justify-center">
                  Get the Full Report
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Create FAQ component**

```tsx
// src/components/landing/FAQ.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const faqs = [
  {
    q: "Is this scientifically valid?",
    a: "Yes. The HEXACO-PI-R is a peer-reviewed personality framework published in Assessment, Journal of Personality, and other academic journals. It has been validated across cultures and age groups.",
  },
  {
    q: "How long does the assessment take?",
    a: "The complete assessment is 120 questions and takes about 20 minutes. A personality-only version (60 questions, ~10 minutes) is also available.",
  },
  {
    q: "Is my child's data safe?",
    a: "All responses are processed in-browser. No data is sent to external servers. Reports are generated locally and can be downloaded as PDF.",
  },
  {
    q: "Who created this?",
    a: "Built by Eyes of AI, combining validated psychometric instruments with modern data analysis to produce personalised, actionable learning profiles.",
  },
  {
    q: "Can I see a sample before paying?",
    a: "Yes. Every assessment includes a free preview with your student's personality archetype, radar chart, and 3 key insights. You only pay if you want the full report.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-warm-gray/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4"
      >
        <span className="font-semibold text-espresso">{q}</span>
        <span className="text-warm-gray text-xl shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="pb-4"
        >
          <p className="text-sm text-warm-gray leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp} className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          Frequently asked questions
        </h2>
        <div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Credibility.tsx src/components/landing/Pricing.tsx src/components/landing/FAQ.tsx
git commit -m "feat(landing): add Credibility, Pricing, and FAQ components"
```

---

### Task 7: Assemble Landing Page

**Files:**
- Create: `src/app/landing/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// src/app/landing/page.tsx
import { Hero } from "@/components/landing/Hero";
import { ProblemCards } from "@/components/landing/ProblemCards";
import { RootCause } from "@/components/landing/RootCause";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ReportPreview } from "@/components/landing/ReportPreview";
import { Credibility } from "@/components/landing/Credibility";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4">
        <Hero />
        <ProblemCards />
        <RootCause />
        <FeatureGrid />
        <ReportPreview />
        <Credibility />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Run: `npm run dev`
Navigate to: `http://localhost:3000/landing`
Expected: All 9 sections render in order with cream background, animations, and working CTAs. FAQ toggles work. Preview tabs switch. CTA buttons link to `/`.

- [ ] **Step 3: Commit**

```bash
git add src/app/landing/page.tsx
git commit -m "feat(landing): assemble landing page with all 9 sections"
```

---

### Task 8: Full Verification

**Files:** None (verification only)

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: No new type errors

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Build succeeds, `/landing` route listed in output

- [ ] **Step 3: Run test suite**

Run: `npx vitest run`
Expected: No new failures

- [ ] **Step 4: Visual verification**

Run: `npm run dev`
Navigate to `http://localhost:3000/landing`. Verify:
- Hero: headline, subline, CTA button, pricing hint
- Problem cards: 3 cards with icons, frustrations, reframes
- Root cause: narrative paragraph + 3 pattern cards
- Feature grid: 6 HEXACO dimension cards with colored letters
- Report preview: 4 tabs, switching works, placeholder areas
- Credibility: academic citations
- Pricing: free vs $49 comparison, CTAs
- FAQ: 5 questions, accordion toggles open/close
- Final CTA: heading + button
- All CTA buttons navigate to `/`
- Mobile responsive (check at 393px width)

- [ ] **Step 5: Final commit if fixes needed**

```bash
git commit -am "chore(landing): fix any issues from verification"
```

### Contract

| Criterion | Verify With | Expected |
|-----------|-------------|----------|
| Setup: dev server | `npm run dev &` then `curl -s localhost:3000/landing` | HTML response |
| Type check | `npx tsc --noEmit` | No new errors |
| Build | `npm run build` | Exit code 0, `/landing` route in output |
| Test suite | `npx vitest run` | No new failures |
| Page loads | Navigate to `/landing` | 9 sections render with animations |
| Hero CTA works | Click "Get Your Student's Profile" | Navigates to `/` |
| FAQ toggles | Click any FAQ question | Answer expands/collapses |
| Preview tabs | Click each tab | Content switches with animation |
| Pricing CTAs work | Click "Get the Full Report" | Navigates to `/` |
| Mobile responsive | Resize to 393px width | Grid collapses to single column, all content readable |
| Health: existing pages | Navigate to `/` and `/report` | Unchanged, no regressions |
