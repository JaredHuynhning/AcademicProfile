# AcademicProfile — Project Guide

## Project Overview
A comprehensive student assessment platform built with Next.js 15, React 19, and TypeScript. It generates a 40+ page "Mega Report" based on HEXACO personality and academic learning profiles.

## Architecture & Technology Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion for animations
- **State Management**: Zustand (with persistence)
- **Report Generation**: Pure functional logic in `src/lib/report`
- **PDF Export**: `@react-pdf/renderer` for high-quality, 40+ page PDF reports
- **Icons**: `@phosphor-icons/react`

## Core Data Flow
1. **Quiz**: `QuizShell` handles 120 questions, stored in `quiz-store.ts` (Zustand).
2. **Scoring**: `src/lib/scoring` calculates scores for HEXACO, Study Approaches, and Learner Profiles.
3. **Mega Report**: `generateMegaReport` (in `src/lib/report/index.ts`) orchestrates 12 mega-sections using cross-reference rules.
4. **Rendering**: `ReportPage` uses `MegaSectionBody` and `ReportFieldRenderers` to display dynamic content.

## Key Directories
- `src/app`: Next.js pages and API routes (`/test`, `/report`, `/landing`).
- `src/components`: UI components, specifically `src/components/report` for report-specific visuals.
- `src/lib/scoring`: Scoring logic for different assessment domains.
- `src/lib/report`: Report generation engine, templates, and cross-reference rules.
- `src/lib/report/mega`: Individual generators for the 12 mega-sections.
- `src/lib/stores`: Zustand stores for quiz state and saved reports.

## Engineering Standards
- **TypeScript**: Strict typing is required. Avoid `any`. Use `TestResults`, `MegaReport`, `DimensionsMap`, etc.
- **Components**: Functional components only. Use generic renderers in `ReportFieldRenderers.tsx` for report data.
- **Logic**: Keep business logic (scoring, report text generation) in `src/lib`, separate from React components.
- **Consistency**: Maintain the "Senior Peer Programmer" tone. No conversional filler in the UI.

## Common Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production (includes type checking)
- `npm run lint`: Run ESLint
- `npm run test`: Run Vitest unit tests

## Last Major Update
2026-03-31: Cleaned up duplicate `.js` files, converted API client to TS, refactored report rendering logic into dedicated helpers and components, and strictly typed the report generation engine.
