# AcademicProfile Next.js Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild AcademicProfile from SvelteKit to Next.js 15 with taste-skill Warm Editorial design, porting all scoring/report logic to TypeScript.

**Architecture:** Next.js 15 App Router with Server Components default, Zustand for client state, Framer Motion for animations. 4-phase build: foundation → data layer → pages → polish.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Zustand, @react-pdf/renderer, Phosphor Icons, Playfair Display + Satoshi fonts.

**Spec:** `docs/superpowers/specs/2026-03-24-nextjs-redesign-design.md`

**Existing codebase reference:** The current SvelteKit app at `src/` — all scoring logic, report generators, and data files are the source of truth for porting.

---

## File Map

### New Project Root (created fresh)

```
src/
  app/
    layout.tsx                    # Root layout: fonts, theme, metadata
    globals.css                   # Tailwind imports + custom theme tokens
    page.tsx                      # Homepage (bento grid)
    test/
      page.tsx                    # Quiz page (card-swipe)
    report/
      page.tsx                    # Report viewer (scrollable long-form)
    reports/
      page.tsx                    # Saved reports gallery
    api/
      hexaco/
        items/route.ts            # GET: return HEXACO items
        score/route.ts            # POST: score HEXACO answers
  components/
    ui/
      Button.tsx                  # Pill button with nested trailing icon
      Card.tsx                    # Double-bezel card component
      Badge.tsx                   # Eyebrow pill badge
      ProgressBar.tsx             # Gradient progress bar
    layout/
      Navbar.tsx                  # Floating pill navbar (client component)
      Footer.tsx                  # Minimal footer
      MobileMenu.tsx              # Full-screen overlay (client component)
    quiz/
      QuizCard.tsx                # Animated question card (client component)
      LikertScale.tsx             # 1-5 numbered buttons
      SectionInterstitial.tsx     # Section transition screen
      QuizShell.tsx               # Quiz orchestrator (client component)
    report/
      ReportSection.tsx           # Generic section wrapper with scroll reveal
      ReportCover.tsx
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
      ReportExecutiveSummary.tsx
      ReportWhoYouAre.tsx
      ReportHowYouLearn.tsx
      ReportWhatsWorking.tsx
      ReportBarriers.tsx
      ReportActionPlan.tsx
      ReportUnifiedGuide.tsx
      FloatingTOC.tsx             # Expandable table of contents (client)
      StickyNav.tsx               # Frosted glass top bar (client)
    pdf/
      ReportPDF.tsx               # @react-pdf/renderer layout
  lib/
    types.ts                      # Shared TypeScript types
    scoring/
      learner-scorer.ts           # Port of learner-scorer.js
      study-scorer.ts             # Port of study-scorer.js
      hexaco-scorer.ts            # Port of Python HEXACO scoring
    report/
      index.ts                    # Report generation orchestrator
      combinations.ts             # Cross-dimension scoring
      cross-reference-engine.ts
      cross-reference-rules.ts
      helpers.ts
      section-01-cover.ts
      section-02-glance.ts
      section-03-deep-dive.ts
      section-04-learning.ts
      section-05-drives.ts
      section-06-study.ts
      section-07-group.ts
      section-08-strengths.ts
      section-09-guide.ts
      section-10-tutor.ts
      section-11-study-profile.ts
      section-12-academic-character.ts
      section-13-subject-fit.ts
      section-14-what-works.ts
      section-15-root-cause.ts
      section-16-academic-guide.ts
      section-c1-executive-summary.ts
      section-c2-who-you-are.ts
      section-c3-how-you-learn.ts
      section-c4-whats-working.ts
      section-c5-barriers.ts
      section-c6-action-plan.ts
      section-c7-guide.ts
    stores/
      quiz-store.ts               # Zustand: quiz state + localStorage persistence
      reports-store.ts            # Zustand: saved reports + localStorage persistence
    data/
      hexaco-items.ts             # 60 HEXACO items (port from Python backend)
      learner-items.ts            # 30 learner items (port from JS)
      study-items.ts              # 30 study items (port from JS)
      sample-profiles.ts          # Sample demo data (port from JS)
tests/
  lib/
    scoring/
      learner-scorer.test.ts
      study-scorer.test.ts
      hexaco-scorer.test.ts
    report/
      cross-reference-engine.test.ts
      strengths-classification.test.ts
    stores/
      quiz-store.test.ts
      reports-store.test.ts
  api/
    hexaco-score.test.ts
```

---

## Phase 1: Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Create Next.js 15 project**

```bash
cd "/Users/jared/Desktop/Software Developement/AcademicProfile"
npx create-next-app@latest next-app --typescript --tailwind --eslint --app --src-dir
```

Accept defaults. This creates `next-app/` subdirectory.

- [ ] **Step 2: Move next-app contents to project root**

```bash
# Move all next-app files to project root (alongside existing src/)
shopt -s dotglob && cp -r next-app/* . && rm -rf next-app
```

Note: This will create a `src/app/` directory alongside the existing `src/lib/` and `src/routes/`. The existing SvelteKit files stay for reference during porting.

- [ ] **Step 3: Install dependencies**

```bash
npm install framer-motion zustand @phosphor-icons/react @react-pdf/renderer
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Verify tsconfig path alias**

`create-next-app` should have configured `@/*` → `./src/*` in `tsconfig.json`. Verify:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

If missing, add it manually. All imports in this plan use `@/lib/...`, `@/components/...` etc.

- [ ] **Step 5: Configure next.config.ts for @react-pdf/renderer**

`@react-pdf/renderer` needs webpack fallbacks for Node built-ins. Add to `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Next.js dev server on http://localhost:3000 with default page.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 project with dependencies"
```

---

### Task 2: Design System — Theme Tokens & Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Configure Tailwind v4 theme tokens via CSS**

In Tailwind v4, theme customization uses `@theme` in CSS (not a JS config file). Edit `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-cream: #FDFBF7;
  --color-espresso: #2c2417;
  --color-warm-gray: #8b7355;
  --color-parchment: #f5f0e8;
  --color-honesty: #14b8a6;
  --color-emotionality: #f43f5e;
  --color-extraversion: #f97316;
  --color-agreeableness: #22c55e;
  --color-conscientiousness: #3b82f6;
  --color-openness: #8b5cf6;
  --font-display: var(--font-playfair), Georgia, serif;
  --font-body: var(--font-satoshi), system-ui, sans-serif;
}
```

This enables classes like `bg-cream`, `text-espresso`, `font-display`, `font-body` etc. Delete `tailwind.config.ts` if `create-next-app` created one — v4 uses CSS-only config.

- [ ] **Step 2: Download Satoshi font**

Satoshi is not on Google Fonts. Download from https://www.fontshare.com/fonts/satoshi and save to `public/fonts/`:

```
public/fonts/Satoshi-Variable.woff2
public/fonts/Satoshi-VariableItalic.woff2
```

- [ ] **Step 3: Set up fonts in layout.tsx**

```typescript
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata = {
  title: "Academic Profile — Discover How You Learn",
  description: "Student personality and learning assessment for grades 7-12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${satoshi.variable}`}>
      <body className="bg-cream text-espresso font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add global styles to globals.css**

Append these global styles after the `@theme` block added in Step 1:

```css
/* Smooth scroll for anchor navigation */
html {
  scroll-behavior: smooth;
}

/* Print styles for report */
@media print {
  body { background: white; }
  .no-print { display: none !important; }
}
```

Note: The spec requires minimum 10px font size. There is no CSS property for this — enforce it via code review and component design. All components in this plan use 10px as the smallest size (Badge, hints, labels).

- [ ] **Step 5: Verify fonts render**

```bash
npm run dev
```

Open http://localhost:3000, inspect — confirm `--font-playfair` and `--font-satoshi` CSS variables are set on `<html>`. Confirm `bg-cream` applies the cream background.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx public/fonts/
git commit -m "feat: add Warm Editorial design system tokens and fonts"
```

---

### Task 3: Shared UI Components

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/ProgressBar.tsx`
- Test: `tests/components/ui.test.tsx` (optional smoke test)

- [ ] **Step 1: Create shared types**

```typescript
// src/lib/types.ts
export type LikertScore = 1 | 2 | 3 | 4 | 5;
export type Answers = Record<number, LikertScore>;

export type QuizMode = "complete" | "personality" | "learning";

export interface QuizItem {
  id: number;
  text: string;
  domain: string;
  subscale: string;
  reverse: boolean;
}

export type ClassifyLevel = "high" | "moderate" | "low";

export interface SubscaleScore {
  score: number;
  level: ClassifyLevel;
  items: number[];
}

export interface DimensionScore {
  name: string;
  score: number;
  facets: FacetScore[];
}

export interface FacetScore {
  name: string;
  score: number;
}

export interface SavedReport {
  id: string;
  name: string;
  date: string;
  results: TestResults;
}

export interface TestResults {
  dimensions?: DimensionScore[];
  studyProfile?: StudyProfile;
  learnerProfile?: LearnerProfile;
  quizMode?: QuizMode;
}

// Detailed types for scoring results — filled in during Task 5/6
export interface LearnerProfile {
  grit: { perseverance: SubscaleScore; consistency: SubscaleScore; overall: SubscaleScore };
  focus: { concentration: SubscaleScore; procrastination: SubscaleScore };
  energy: { vitality: SubscaleScore; depletion: SubscaleScore; netEnergy: SubscaleScore };
  subjectFit: {
    maths: { passion: number; confidence: number; alignment: string };
    english: { passion: number; confidence: number; alignment: string };
    science: { passion: number; confidence: number; alignment: string };
  };
  teacherPreference: {
    structure: number; warmth: number; profile: string;
    carrot: number; stick: number; responseType: string;
  };
  examBarriers: {
    preparation: number; external: number; anxiety: number;
    timeManagement: number; primaryBarrier: string;
  };
}

export interface StudyProfile {
  studyApproaches: { deep: SubscaleScore; strategic: SubscaleScore; surface: SubscaleScore };
  motivation: {
    intrinsic: SubscaleScore; identified: SubscaleScore;
    external: SubscaleScore; amotivation: SubscaleScore; sdi: number;
  };
  selfRegulation: {
    selfEfficacy: SubscaleScore; planning: SubscaleScore;
    effortRegulation: SubscaleScore; testAnxiety: SubscaleScore;
    helpSeeking: SubscaleScore;
  };
  dominantApproach: "deep" | "strategic" | "surface";
  motivationProfile: "self-determined" | "moderate" | "controlled" | "amotivated";
  regulationStrength: ClassifyLevel;
}
```

- [ ] **Step 2: Create Button component**

```typescript
// src/components/ui/Button.tsx
import { ArrowRight } from "@phosphor-icons/react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  onClick?: () => void;
  className?: string;
  href?: string;
  icon?: boolean;
}

export function Button({ children, variant = "primary", onClick, className = "", icon = false }: ButtonProps) {
  const base = "inline-flex items-center gap-2.5 font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]";

  const variants = {
    primary: "bg-espresso text-cream px-6 py-3 rounded-full hover:bg-espresso/90",
    secondary: "border border-espresso/20 text-espresso px-6 py-3 rounded-full hover:bg-espresso/5",
    text: "text-warm-gray underline underline-offset-4 hover:text-espresso",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {icon && variant === "primary" && (
        <span className="w-7 h-7 rounded-full bg-cream/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight size={14} weight="bold" />
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 3: Create Card (Double-Bezel) component**

```typescript
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
}

export function Card({ children, className = "", outerClassName = "" }: CardProps) {
  return (
    <div className={`bg-warm-gray/[0.03] p-1.5 rounded-[1.75rem] border border-warm-gray/[0.06] ${outerClassName}`}>
      <div className={`bg-white rounded-[calc(1.75rem-0.375rem)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(139,115,85,0.06)] ${className}`}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Badge component**

```typescript
// src/components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = "" }: BadgeProps) {
  const style = color ? { color, backgroundColor: `${color}15` } : {};
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium ${!color ? "text-warm-gray bg-warm-gray/[0.06]" : ""} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Create ProgressBar component**

```typescript
// src/components/ui/ProgressBar.tsx
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div className={`h-1 bg-warm-gray/[0.08] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-espresso to-warm-gray rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/components/ui/
git commit -m "feat: add shared types and UI components (Button, Card, Badge, ProgressBar)"
```

---

### Task 4: Layout Components (Navbar, Footer, MobileMenu)

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/MobileMenu.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Navbar**

```typescript
// src/components/layout/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-6 px-4 pointer-events-none no-print">
        <div className="pointer-events-auto bg-cream/85 backdrop-blur-xl border border-warm-gray/[0.08] rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_4px_24px_rgba(139,115,85,0.06)] transition-shadow duration-500">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            AcademicProfile
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-warm-gray">
            <Link href="/test" className="hover:text-espresso transition-colors">Assessment</Link>
            <Link href="/reports" className="hover:text-espresso transition-colors">Reports</Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
```

- [ ] **Step 2: Create MobileMenu**

```typescript
// src/components/layout/MobileMenu.tsx
"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/test", label: "Assessment" },
  { href: "/reports", label: "Reports" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 bg-cream/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 md:hidden"
        >
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="font-display text-3xl font-bold text-espresso hover:text-warm-gray transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Create Footer**

```typescript
// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="py-12 text-center text-warm-gray/60 text-sm no-print">
      <p>&copy; {new Date().getFullYear()} AcademicProfile. Assessment based on HEXACO-PI-R framework.</p>
    </footer>
  );
}
```

- [ ] **Step 4: Wire layout components into root layout**

Update `src/app/layout.tsx` to include Navbar and Footer wrapping `{children}`.

- [ ] **Step 5: Verify nav renders and mobile menu animates**

```bash
npm run dev
```

Open http://localhost:3000, resize to mobile, click hamburger — confirm staggered animation.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: add Navbar, MobileMenu, and Footer with Framer Motion"
```

---

## Phase 2: Data Layer

### Task 5: Port Data Files (Items + Samples)

**Files:**
- Create: `src/lib/data/learner-items.ts` — port from `src/lib/data/learner-items.js`
- Create: `src/lib/data/study-items.ts` — port from `src/lib/data/study-items.js`
- Create: `src/lib/data/hexaco-items.ts` — port from Python backend (items endpoint)
- Create: `src/lib/data/sample-profiles.ts` — port from `src/lib/data/sample-profiles.js`

- [ ] **Step 1: Port learner-items.ts**

Copy `src/lib/data/learner-items.js` → `src/lib/data/learner-items.ts`. Add types:

```typescript
import type { QuizItem } from "../types";
export const learnerItems: QuizItem[] = [ /* copy existing array */ ];
export const learnerItemMap: Record<number, QuizItem> = Object.fromEntries(learnerItems.map(i => [i.id, i]));
```

- [ ] **Step 2: Port study-items.ts**

Same pattern. Copy from `src/lib/data/study-items.js`.

- [ ] **Step 3: Create hexaco-items.ts**

Extract from the current Python backend. Start dev server, call the API, save response:

```bash
# If Python backend is available:
curl http://localhost:8000/api/hexaco/items > /tmp/hexaco-items.json
```

If not available, create from the HEXACO-PI-R item set (60 items, IDs 1-60). Structure matches `QuizItem` interface.

- [ ] **Step 4: Port sample-profiles.ts**

Copy from `src/lib/data/sample-profiles.js`, add TypeScript types using `SavedReport[]`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/
git commit -m "feat: port quiz items and sample profiles to TypeScript"
```

---

### Task 6: Port Scoring Logic

**Files:**
- Create: `src/lib/scoring/learner-scorer.ts` — port from `src/lib/scoring/learner-scorer.js`
- Create: `src/lib/scoring/study-scorer.ts` — port from `src/lib/scoring/study-scorer.js`
- Create: `src/lib/scoring/hexaco-scorer.ts` — new (port from Python)
- Test: `tests/lib/scoring/learner-scorer.test.ts` — port from `tests/learner-scorer.test.js`
- Test: `tests/lib/scoring/study-scorer.test.ts` — port from `tests/study-scorer.test.js`
- Test: `tests/lib/scoring/hexaco-scorer.test.ts` — new

- [ ] **Step 1: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`

- [ ] **Step 2: Port existing learner-scorer tests**

Copy `tests/learner-scorer.test.js` → `tests/lib/scoring/learner-scorer.test.ts`. Update imports to use `@/lib/scoring/learner-scorer` and add type annotations.

- [ ] **Step 3: Run tests — verify they fail (no implementation yet)**

```bash
npm test -- tests/lib/scoring/learner-scorer.test.ts
```

Expected: FAIL (module not found)

- [ ] **Step 4: Port learner-scorer.ts**

Copy `src/lib/scoring/learner-scorer.js` → `src/lib/scoring/learner-scorer.ts`. Add TypeScript types:

- `classifyLevel(score: number): ClassifyLevel`
- `scoreSubscale(answers: Answers, domain: string, subscale: string): SubscaleScore`
- `scoreLearnerProfile(answers: Answers): LearnerProfile`

Key: reverse scoring uses `6 - raw` when `item.reverse === true`.

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm test -- tests/lib/scoring/learner-scorer.test.ts
```

Expected: ALL PASS

- [ ] **Step 6: Repeat for study-scorer**

Port tests first → fail → port implementation → pass.

- [ ] **Step 7: Create hexaco-scorer.ts with tests**

Port the HEXACO-PI-R scoring algorithm from Python. Key logic:
- 60 items → 6 dimensions (10 items each)
- Each dimension has 4 facets
- Some items are reverse-scored (`6 - raw`)
- Dimension score = mean of 10 item scores
- Facet score = mean of facet items

Write tests first using known input/output pairs from the existing Python backend.

- [ ] **Step 8: Run full scoring test suite**

```bash
npm test -- tests/lib/scoring/
```

Expected: ALL PASS

- [ ] **Step 9: Commit**

```bash
git add src/lib/scoring/ tests/lib/scoring/ vitest.config.ts
git commit -m "feat: port scoring logic (learner, study, hexaco) to TypeScript with tests"
```

---

### Task 7: Port Report Generation Logic

**Files:**
- Create: `src/lib/report/*.ts` — port all 23 section generators + orchestrator + utilities
- Test: `tests/lib/report/cross-reference-engine.test.ts` — port from existing

- [ ] **Step 1: Port cross-reference engine with tests**

Port tests first from `tests/cross-reference-engine.test.js`. Then port:
- `src/lib/report/cross-reference-engine.ts` from `cross-reference-engine.js`
- `src/lib/report/cross-reference-rules.ts` from `cross-reference-rules.js`

- [ ] **Step 2: Port helpers and combinations**

Port `src/lib/report/helpers.js` → `helpers.ts` and `combinations.js` → `combinations.ts`. These are utility functions used by section generators.

- [ ] **Step 3: Port strengths-classification tests**

Port `tests/strengths-classification.test.js` → `tests/lib/report/strengths-classification.test.ts`. This covers `classifyFacetDirection` and `classifyDimensionFacets` from `helpers.ts` — critical for inverse-facet logic (where high anxiety = weakness, not strength).

- [ ] **Step 4: Port personality section generators (sections 01-10)**

Port these 10 files from `.js` → `.ts`, adding type annotations:
`section-01-cover.ts` through `section-10-tutor.ts`

These are pure functions — no framework dependencies. The port is mechanical: add types to function signatures and return values.

- [ ] **Step 5: Commit personality sections**

```bash
git add src/lib/report/section-{01,02,03,04,05,06,07,08,09,10}*.ts
git commit -m "feat: port personality report sections (01-10) to TypeScript"
```

- [ ] **Step 6: Port academic section generators (sections 11-16)**

Port 6 files: `section-11-study-profile.ts` through `section-16-academic-guide.ts`.

- [ ] **Step 7: Commit academic sections**

```bash
git add src/lib/report/section-{11,12,13,14,15,16}*.ts
git commit -m "feat: port academic report sections (11-16) to TypeScript"
```

- [ ] **Step 8: Port consolidated section generators (sections c1-c7)**

Port 7 files: `section-c1-executive-summary.ts` through `section-c7-guide.ts`.

- [ ] **Step 9: Commit consolidated sections**

```bash
git add src/lib/report/section-c*.ts
git commit -m "feat: port consolidated report sections (c1-c7) to TypeScript"
```

- [ ] **Step 10: Port report orchestrator**

Port `src/lib/report/index.js` → `index.ts`. This imports all 23 sections and conditionally calls them based on available data.

- [ ] **Step 11: Run all report tests**

```bash
npm test -- tests/lib/report/
```

Expected: ALL PASS

- [ ] **Step 12: Commit orchestrator and remaining files**

```bash
git add src/lib/report/index.ts src/lib/report/cross-reference-engine.ts src/lib/report/cross-reference-rules.ts src/lib/report/helpers.ts src/lib/report/combinations.ts tests/lib/report/
git commit -m "feat: port report orchestrator, cross-reference engine, and helpers to TypeScript"
```

---

### Task 8: Zustand Stores

**Files:**
- Create: `src/lib/stores/quiz-store.ts`
- Create: `src/lib/stores/reports-store.ts`
- Test: `tests/lib/stores/quiz-store.test.ts`
- Test: `tests/lib/stores/reports-store.test.ts`

- [ ] **Step 1: Write quiz-store tests**

```typescript
// tests/lib/stores/quiz-store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useQuizStore } from "@/lib/stores/quiz-store";

describe("quiz-store", () => {
  beforeEach(() => {
    useQuizStore.getState().reset();
    localStorage.clear();
  });

  it("records an answer", () => {
    useQuizStore.getState().setAnswer(91, 4);
    expect(useQuizStore.getState().answers[91]).toBe(4);
  });

  it("tracks progress", () => {
    useQuizStore.getState().setItems(Array(120).fill({ id: 1 }));
    useQuizStore.getState().setAnswer(1, 3);
    expect(useQuizStore.getState().progress.percent).toBeCloseTo(0.83, 0);
  });

  it("persists answers to localStorage", () => {
    useQuizStore.getState().setAnswer(91, 5);
    const stored = JSON.parse(localStorage.getItem("hexaco_answers") || "{}");
    expect(stored[91]).toBe(5);
  });

  it("resets all state", () => {
    useQuizStore.getState().setAnswer(91, 3);
    useQuizStore.getState().setName("Sarah");
    useQuizStore.getState().reset();
    expect(Object.keys(useQuizStore.getState().answers)).toHaveLength(0);
    expect(useQuizStore.getState().name).toBe("");
  });
});
```

- [ ] **Step 2: Run tests — verify fail**

```bash
npm test -- tests/lib/stores/quiz-store.test.ts
```

Expected: FAIL (module not found)

- [ ] **Step 3: Implement quiz-store**

```typescript
// src/lib/stores/quiz-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Answers, QuizItem, QuizMode, TestResults, LikertScore } from "../types";

interface QuizState {
  name: string;
  quizMode: QuizMode;
  items: QuizItem[];
  answers: Answers;
  currentIndex: number;
  results: TestResults | null;
  progress: { answered: number; total: number; percent: number };

  setName: (name: string) => void;
  setMode: (mode: QuizMode) => void;
  setItems: (items: QuizItem[]) => void;
  setAnswer: (itemId: number, value: LikertScore) => void;
  setIndex: (index: number) => void;
  setResults: (results: TestResults) => void;
  reset: () => void;
}

const initialState = {
  name: "",
  quizMode: "complete" as QuizMode,
  items: [] as QuizItem[],
  answers: {} as Answers,
  currentIndex: 0,
  results: null as TestResults | null,
  progress: { answered: 0, total: 0, percent: 0 },
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setName: (name) => set({ name }),
      setMode: (mode) => set({ quizMode: mode }),
      setItems: (items) => set({ items }),
      setAnswer: (itemId, value) => {
        const answers = { ...get().answers, [itemId]: value };
        const total = get().items.length || 120;
        const answered = Object.keys(answers).length;
        set({ answers, progress: { answered, total, percent: (answered / total) * 100 } });
      },
      setIndex: (index) => set({ currentIndex: index }),
      setResults: (results) => set({ results }),
      reset: () => set(initialState),
    }),
    {
      name: "hexaco_answers",
      partialize: (state) => ({
        answers: state.answers,
        name: state.name,
        quizMode: state.quizMode,
        results: state.results,
      }),
    }
  )
);
```

- [ ] **Step 4: Run tests — verify pass**

- [ ] **Step 5: Write reports-store tests, then implement**

Same TDD pattern. Port logic from `src/lib/stores/reports.js`:
- `saveReport(name, results)` — generates UUID, prepends to array, handles QuotaExceeded
- `loadReport(report)` — writes to quiz-store
- `deleteReport(id)` — removes by id
- Auto-loads sample profiles, version-checks for refresh

- [ ] **Step 6: Run all store tests**

```bash
npm test -- tests/lib/stores/
```

Expected: ALL PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/stores/ tests/lib/stores/
git commit -m "feat: add Zustand stores with localStorage persistence"
```

---

### Task 9: HEXACO API Routes

**Files:**
- Create: `src/app/api/hexaco/items/route.ts`
- Create: `src/app/api/hexaco/score/route.ts`
- Test: `tests/api/hexaco-score.test.ts`

- [ ] **Step 1: Write API scoring test**

```typescript
// tests/api/hexaco-score.test.ts
import { describe, it, expect } from "vitest";
import { scoreHexaco } from "@/lib/scoring/hexaco-scorer";

describe("HEXACO API scoring", () => {
  it("returns 6 dimensions from 60 answers", () => {
    const answers: Record<number, number> = {};
    for (let i = 1; i <= 60; i++) answers[i] = 3; // all neutral
    const result = scoreHexaco(answers);
    expect(result.dimensions).toHaveLength(6);
    expect(result.dimensions[0]).toHaveProperty("name");
    expect(result.dimensions[0]).toHaveProperty("score");
    expect(result.dimensions[0]).toHaveProperty("facets");
  });
});
```

- [ ] **Step 2: Create items API route**

```typescript
// src/app/api/hexaco/items/route.ts
import { hexacoItems } from "@/lib/data/hexaco-items";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(hexacoItems);
}
```

- [ ] **Step 3: Create score API route**

```typescript
// src/app/api/hexaco/score/route.ts
import { scoreHexaco } from "@/lib/scoring/hexaco-scorer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { answers } = await request.json();
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ detail: "Missing answers object" }, { status: 400 });
  }
  const result = scoreHexaco(answers);
  return NextResponse.json(result);
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- tests/api/
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ tests/api/
git commit -m "feat: add HEXACO items and scoring API routes"
```

---

## Phase 3: Pages

### Task 10: Homepage (Bento Grid)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build homepage**

```tsx
// src/app/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Brain, BookOpen, ChartBar } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useReportsStore } from "@/lib/stores/reports-store";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
  viewport: { once: true, margin: "-50px" },
};

const assessmentAreas = [
  { icon: Brain, title: "Personality", desc: "6 dimensions of who you are", color: "#8b5cf6", domain: "HEXACO-PI-R" },
  { icon: GraduationCap, title: "Learning", desc: "Grit, focus, energy & more", color: "#22c55e", domain: "Grit-S, ASRS, SVS" },
  { icon: BookOpen, title: "Study Style", desc: "Habits & strategies", color: "#3b82f6", domain: "Study approaches" },
  { icon: ChartBar, title: "Full Report", desc: "23 sections, PDF-ready", color: "#f43f5e", domain: "Cross-referenced" },
];

export default function HomePage() {
  const router = useRouter();
  const { setName, setMode, name } = useQuizStore();
  const { reports } = useReportsStore();
  const [inputName, setInputName] = useState(name);

  const handleStart = () => {
    setName(inputName);
    setMode("complete");
    router.push("/test");
  };

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 px-4 max-w-5xl mx-auto">
      {/* Hero Card */}
      <motion.div {...fadeUp}>
        <Card outerClassName="mb-8" className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge>20-Minute Assessment</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3 leading-[1.1]">
                Your Learning Profile
              </h1>
              <p className="text-warm-gray mt-3 max-w-md leading-relaxed">
                120 questions. Personalised report covering your personality,
                learning style, and academic strengths.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[260px]">
              <input
                type="text"
                placeholder="Enter your first name..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-parchment rounded-2xl px-4 py-3 text-sm text-espresso placeholder:text-warm-gray/50 outline-none focus:ring-2 focus:ring-espresso/10 transition-shadow"
              />
              <Button onClick={handleStart} icon className="justify-center">
                Begin Assessment
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessmentAreas.map((area, i) => (
          <motion.div key={area.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 * (i + 1) }}>
            <Card className="p-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${area.color}15`, color: area.color }}
              >
                <area.icon size={22} weight="duotone" />
              </div>
              <h3 className="font-semibold text-espresso">{area.title}</h3>
              <p className="text-sm text-warm-gray mt-1">{area.desc}</p>
              <p className="text-[10px] text-warm-gray/60 mt-2 uppercase tracking-wider">{area.domain}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Saved Reports */}
      {reports.length > 0 && (
        <motion.section {...fadeUp} className="mt-12">
          <Badge className="mb-3">Previous Results</Badge>
          <h2 className="font-display text-2xl font-bold mb-4">Saved Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((report) => (
              <Card
                key={report.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                outerClassName="hover:scale-[1.01] transition-transform duration-500"
              >
                <p className="font-semibold">{report.name}</p>
                <p className="text-sm text-warm-gray">{new Date(report.date).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        </motion.section>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify homepage renders**

```bash
npm run dev
```

Open http://localhost:3000 — confirm bento grid, warm editorial styling, floating navbar.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add homepage with bento grid layout"
```

---

### Task 11: Quiz Page (Card-Swipe)

**Files:**
- Create: `src/components/quiz/QuizShell.tsx`
- Create: `src/components/quiz/QuizCard.tsx`
- Create: `src/components/quiz/LikertScale.tsx`
- Create: `src/components/quiz/SectionInterstitial.tsx`
- Modify: `src/app/test/page.tsx`

This is the most animation-heavy page. All quiz components are client components.

- [ ] **Step 1: Create LikertScale**

5 numbered buttons (1-5). Selected state fills with espresso. Labels on 1 (Strongly Disagree), 3 (Neutral), 5 (Strongly Agree). Minimum 48x48 touch target (40x40 on mobile).

- [ ] **Step 2: Create QuizCard**

Double-bezel card containing:
- Question text (Playfair Display, 20px)
- LikertScale
- Keyboard hint (10px)

Framer Motion `AnimatePresence` for enter/exit:
- Enter from right: `x: 300, opacity: 0` → `x: 0, opacity: 1`
- Exit left: `x: -300, opacity: 0`
- Spring: `stiffness: 300, damping: 30`

- [ ] **Step 3: Create SectionInterstitial**

Brief card showing dimension name, accent color, "10 questions" count. Auto-advances after 1.5s with `setTimeout`.

- [ ] **Step 4: Create QuizShell orchestrator**

Manages quiz flow:
- Loads items from data files based on quizMode
- Tracks current index
- Detects section transitions → shows interstitial
- Keyboard event listeners (1-5 to answer, left arrow to go back)
- On complete: calls scoring functions, saves results to store, navigates to `/report`

- [ ] **Step 5: Wire into test/page.tsx**

```typescript
// src/app/test/page.tsx
import { QuizShell } from "@/components/quiz/QuizShell";

export default function TestPage() {
  return <QuizShell />;
}
```

- [ ] **Step 6: Test manually — complete a full quiz flow**

```bash
npm run dev
```

Navigate to http://localhost:3000 → enter name → click "Begin" → answer questions → verify card animations, section transitions, and completion redirect.

- [ ] **Step 7: Commit**

```bash
git add src/components/quiz/ src/app/test/
git commit -m "feat: add card-swipe quiz with Framer Motion animations"
```

---

### Task 12: Report Page (Scrollable Long-Form)

**Files:**
- Create: `src/components/report/ReportSection.tsx`
- Create: `src/components/report/StickyNav.tsx`
- Create: `src/components/report/FloatingTOC.tsx`
- Create: all 23 `src/components/report/Report*.tsx` components
- Modify: `src/app/report/page.tsx`

- [ ] **Step 1: Create ReportSection wrapper**

Generic section wrapper that:
- Applies scroll reveal animation (Framer Motion `whileInView`)
- Adds eyebrow badge with section number
- Renders Playfair heading
- Constrains body text to `max-w-[65ch]`
- Adds thin divider between sections

- [ ] **Step 2: Create StickyNav**

Frosted glass bar: student name, current section (updates via IntersectionObserver), PDF download button, Save button.

- [ ] **Step 3: Create FloatingTOC**

Bottom-right pill that expands to show all section titles as scroll-to-anchor links.

- [ ] **Step 4: Create personality report components (Cover, Glance, DeepDive, Learning, Drives, Study, Group, Strengths, Guide, Tutor)**

Port rendering from `src/lib/components/report/Report{Cover,Glance,DeepDive,Learning,Drives,Study,Group,Strengths,Guide,Tutor}.svelte` → React JSX. Each component receives its section data (from `generateReport()`) and renders using design system:

- Section text → paragraphs with `text-base text-espresso/80 leading-relaxed max-w-[65ch]`
- Score cards → `<Card>` component with dimension accent colors
- Strength/weakness tags → `<Badge>` pills

- [ ] **Step 5: Commit personality report components**

```bash
git add src/components/report/Report{Cover,Glance,DeepDive,Learning,Drives,Study,Group,Strengths,Guide,Tutor}.tsx
git commit -m "feat: add personality report components (Cover through Tutor)"
```

- [ ] **Step 6: Create academic report components (StudyProfile, AcademicCharacter, SubjectFit, WhatWorks, RootCause, AcademicGuide)**

Port from corresponding `.svelte` files. Same pattern as Step 4.

- [ ] **Step 7: Commit academic report components**

```bash
git add src/components/report/Report{StudyProfile,AcademicCharacter,SubjectFit,WhatWorks,RootCause,AcademicGuide}.tsx
git commit -m "feat: add academic report components"
```

- [ ] **Step 8: Create consolidated report components (ExecutiveSummary, WhoYouAre, HowYouLearn, WhatsWorking, Barriers, ActionPlan, UnifiedGuide)**

Port from corresponding `.svelte` files. Same pattern.

- [ ] **Step 9: Commit consolidated report components**

```bash
git add src/components/report/Report{ExecutiveSummary,WhoYouAre,HowYouLearn,WhatsWorking,Barriers,ActionPlan,UnifiedGuide}.tsx
git commit -m "feat: add consolidated report components (C1-C7)"
```

- [ ] **Step 10: Wire report page**

```typescript
// src/app/report/page.tsx
"use client";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { generateReport } from "@/lib/report";
import { StickyNav } from "@/components/report/StickyNav";
import { FloatingTOC } from "@/components/report/FloatingTOC";
// ... import all 23 section components

export default function ReportPage() {
  const { results, name, quizMode } = useQuizStore();
  if (!results) return <div>No results found. Take the assessment first.</div>;

  const report = generateReport(results, name);
  const sections = buildSectionList(report, quizMode);

  return (
    <div className="min-h-[100dvh] bg-cream">
      <StickyNav name={name} sections={sections} />
      <main className="pt-24 pb-32 px-4 max-w-3xl mx-auto">
        {sections.map((section, i) => (
          <ReportSection key={i} number={i + 1} {...section} />
        ))}
      </main>
      <FloatingTOC sections={sections} />
    </div>
  );
}
```

- [ ] **Step 11: Test with sample profile**

Load a sample profile from the homepage → verify all sections render → scroll through entire report → check scroll reveals animate.

- [ ] **Step 12: Commit report page wiring**

```bash
git add src/app/report/ src/components/report/ReportSection.tsx src/components/report/StickyNav.tsx src/components/report/FloatingTOC.tsx
git commit -m "feat: wire report page with scroll reveals and navigation"
```

---

### Task 13: Saved Reports Page

**Files:**
- Modify: `src/app/reports/page.tsx`

- [ ] **Step 1: Build saved reports gallery**

- Page title with Badge eyebrow
- Grid of report cards (double-bezel): student name, date, quiz mode, mini score preview
- Click → `loadReport()` → navigate to `/report`
- Delete button with confirmation dialog
- Empty state: "No saved reports yet. Take the assessment to get started."

- [ ] **Step 2: Verify end-to-end flow**

```bash
npm run dev
```

Complete quiz → save report → navigate to /reports → see saved report card → click to reload → verify.

- [ ] **Step 3: Commit**

```bash
git add src/app/reports/
git commit -m "feat: add saved reports gallery page"
```

---

## Phase 4: Polish

### Task 14: PDF Export

**Files:**
- Create: `src/components/pdf/ReportPDF.tsx`
- Modify: `src/components/report/StickyNav.tsx` (add download trigger)

- [ ] **Step 1: Create PDF layout component**

Using `@react-pdf/renderer`, create a PDF document that mirrors the on-screen report:
- Cover page: student name, date, dimension scores
- Sections with proper page breaks
- Minimum 12px font size (PDF print standard)
- Playfair Display + body font embedded

- [ ] **Step 2: Wire PDF download button**

In StickyNav, add click handler that:
- Renders `<ReportPDF>` component
- Generates blob via `pdf().toBlob()`
- Triggers browser download

- [ ] **Step 3: Test PDF generation**

Complete quiz → view report → click "Download PDF" → verify PDF opens correctly with all sections.

- [ ] **Step 4: Commit**

```bash
git add src/components/pdf/ src/components/report/StickyNav.tsx
git commit -m "feat: add PDF export for reports"
```

---

### Task 15: Animation Polish & Responsive Pass

**Files:**
- Modify: Multiple component files for responsive + animation tweaks

- [ ] **Step 1: Mobile responsive pass**

Test all pages at 375px width:
- Homepage: single column, full-width cards, `px-4 py-8`
- Quiz: card fills width, Likert buttons 40x40
- Report: full-width sections, simplified sticky nav, TOC at bottom-center
- Reports: single column card grid

- [ ] **Step 2: Animation consistency pass**

Verify all transitions use custom `cubic-bezier(0.32, 0.72, 0, 1)` — no `linear` or `ease-in-out`. Check:
- Page transitions
- Card hover states
- Scroll reveals
- Quiz card swipes
- Mobile menu stagger

- [ ] **Step 3: Performance check**

- No `backdrop-blur` on scrolling elements
- All animations use only `transform` + `opacity`
- No `h-screen` (use `min-h-[100dvh]`)
- Run Lighthouse on each page — target 90+ performance

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: responsive and animation polish pass"
```

---

### Task 16: Cleanup & Deploy

**Files:**
- Modify: `vercel.json`, `package.json`
- Delete: old SvelteKit files (after verification)

- [ ] **Step 1: Update Vercel config**

```json
{
  "framework": "nextjs"
}
```

Remove SvelteKit-specific rewrites.

- [ ] **Step 2: Remove old SvelteKit files**

After confirming everything works in Next.js:

```bash
rm -rf src/routes/ src/lib/components/ src/lib/stores/test.js src/lib/stores/reports.js
rm svelte.config.js vite.config.js postcss.config.js
# Keep src/lib/scoring/*.js and src/lib/report/*.js as reference until tests all pass
```

- [ ] **Step 3: Run full test suite**

```bash
npm test
```

Expected: ALL PASS

- [ ] **Step 4: Build and verify**

```bash
npm run build
npm run start
```

Verify production build works locally.

- [ ] **Step 5: Final commit and push**

```bash
git add -A
git commit -m "chore: remove SvelteKit files, finalize Next.js migration"
git push
```

- [ ] **Step 6: Verify Vercel deployment**

Check Vercel dashboard — confirm build succeeds and site is live.

---

## Task Dependencies

```
Task 1 (Init)
  → Task 2 (Design System)
    → Task 3 (UI Components)
      → Task 4 (Layout)
        → Task 10 (Homepage)
        → Task 11 (Quiz) ← also depends on Task 8
        → Task 12 (Report) ← also depends on Task 7, 8
        → Task 13 (Reports) ← also depends on Task 8

Task 5 (Data Files)
  → Task 6 (Scoring) → Task 9 (API Routes)
  → Task 7 (Report Logic)
  → Task 8 (Stores) ← also depends on Task 5

Task 14 (PDF) ← depends on Task 12
Task 15 (Polish) ← depends on Tasks 10-14
Task 16 (Deploy) ← depends on Task 15
```

**Parallelizable groups:**
- Tasks 5-8 (data layer) can run in parallel with Tasks 3-4 (components)
- Tasks 10-13 (pages) can partially overlap once dependencies are met
- Task 14 (PDF) can start as soon as Task 12 is done
