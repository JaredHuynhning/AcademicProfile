"use client";

import React from "react";
import Link from "next/link";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useReportsStore } from "@/lib/stores/reports-store";
import { generateReport, generateMegaReport } from "@/lib/report";
import type { MegaReport, MegaSection, DimensionDetail, SubjectAlignment } from "@/lib/report";
import { SubjectFitMatrix } from "@/components/report/SubjectFitMatrix";
import { ReportSection } from "@/components/report/ReportSection";
import { StickyNav } from "@/components/report/StickyNav";
import { FloatingTOC } from "@/components/report/FloatingTOC";
import { downloadReportPDF } from "@/components/pdf/ReportPDF";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HexacoRadarChart } from "@/components/report/HexacoRadarChart";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { DimensionScoreCard } from "@/components/report/DimensionScoreCard";
import { BellCurveChart } from "@/components/report/BellCurveChart";
import { ProfileAtAGlance } from "@/components/report/ProfileAtAGlance";
import { StrengthBarrierSummary } from "@/components/report/StrengthBarrierSummary";
import { ReadingProgressBar } from "@/components/report/ReadingProgressBar";
import { Callout } from "@/components/ui/Callout";
import { 
  SectionContent, 
} from "@/components/report/ReportFieldRenderers";
import {
  clean,
  getDimensionInterpretation
} from "@/lib/report/render-helpers";

// ─── Cover Section ───────────────────────────────────────────────────────────

function CoverSection({ data }: { data: Record<string, unknown> }) {
  const topTraits = data.topTraits as {
    key: string;
    name: string;
    score: string;
    rawScore?: number;
    level: string;
    percentile?: number;
    interpretLabel?: string;
    color: string;
  }[];

  const radarData = data.radarData as { label: string; value: number; color: string }[] | undefined;
  const personalityArchetype = typeof data.personalityArchetype === "string" ? data.personalityArchetype : null;
  const narrativeSummary = typeof data.narrativeSummary === "string" ? data.narrativeSummary : null;
  const summary = typeof data.summary === "string" ? data.summary : null;

  return (
    <div className="space-y-8">
      {personalityArchetype && (
        <p className="font-display text-xl text-center text-espresso/60 tracking-wide italic">
          {personalityArchetype}
        </p>
      )}
      {radarData && radarData.length > 0 && (
        <div className="flex justify-center">
          <HexacoRadarChart data={radarData} />
        </div>
      )}
      {narrativeSummary && (
        <p className="text-espresso/80 leading-relaxed text-lg">{narrativeSummary}</p>
      )}
      {topTraits && topTraits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topTraits.map((trait) => (
            <Card key={trait.key} className="!p-4 text-center">
              <p
                className="text-xs uppercase tracking-[0.15em] font-medium mb-1"
                style={{ color: trait.color }}
              >
                {trait.name}
              </p>
              <p
                className="font-display text-3xl font-bold"
                style={{ color: trait.color }}
              >
                {trait.score}
              </p>
              <p className="text-xs text-warm-gray mt-0.5">{trait.level}</p>
              {trait.rawScore != null && (
                <div className="mt-2 px-1">
                  <ScoreBar
                    score={trait.rawScore}
                    color={trait.color}
                    showBenchmark
                    interpretLabel={trait.interpretLabel}
                  />
                </div>
              )}
              {trait.percentile != null && (
                <p className="text-[10px] text-warm-gray/60 mt-1">
                  Higher than {trait.percentile}% of students
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
      {summary && (
        <p className="text-espresso/70 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}

// ─── Narrative paragraph renderer (handles markdown tables) ─────────────────

function renderInlineFormatting(text: string) {
  if (text.includes('**')) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="text-espresso font-semibold">{part}</strong> : part
    );
  }
  return clean(text);
}

function NarrativeRenderer({ paragraphs }: { paragraphs: string[] }) {
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < paragraphs.length) {
    const para = paragraphs[i];

    // Detect table blocks: consecutive strings starting with |
    if (para.startsWith('|') && para.includes('|', 1)) {
      const tableLines: string[] = [];
      while (i < paragraphs.length && paragraphs[i].startsWith('|')) {
        tableLines.push(paragraphs[i]);
        i++;
      }
      // Filter out separator lines (|---|---|)
      const dataRows = tableLines.filter(l => !l.match(/^\|[\s\-:|]+\|$/));
      if (dataRows.length >= 2) {
        const headers = dataRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
        const rows = dataRows.slice(1).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-warm-gray/20">
                  {headers.map((h, j) => (
                    <th key={j} className="text-left py-2 px-3 font-semibold text-espresso/80 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-warm-gray/10 last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-espresso/70">{renderInlineFormatting(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Headings
    if (para.startsWith('\n### ')) {
      elements.push(<h3 key={`n${i}`} className="font-display text-xl font-bold text-espresso mt-10 mb-2">{para.replace(/^[\n#]+\s*/, '')}</h3>);
      i++;
      continue;
    }
    if (para.startsWith('\n#### ')) {
      elements.push(<h4 key={`n${i}`} className="font-display text-base font-semibold text-espresso mt-6 mb-1">{para.replace(/^[\n#]+\s*/, '')}</h4>);
      i++;
      continue;
    }

    // Bold text or regular paragraph
    if (para.includes('**')) {
      const parts = para.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={`n${i}`} className="text-espresso/80 leading-relaxed text-[15px]">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-espresso font-semibold">{part}</strong> : part)}
        </p>
      );
    } else {
      elements.push(<p key={`n${i}`} className="text-espresso/80 leading-relaxed text-[15px]">{clean(para)}</p>);
    }
    i++;
  }
  return <>{elements}</>;
}

// ─── Mega-section renderer ───────────────────────────────────────────────────

function MegaSectionBody({ section, studentName, dimensionDetails, subjectAlignment }: { section: MegaSection; studentName: string; dimensionDetails?: DimensionDetail[]; subjectAlignment?: SubjectAlignment[] }) {
  // Special renderers for specific mega-section types
  if (section.id === 'cover-summary' && section.rawData?.cover) {
    return (
      <div className="space-y-8">
        <CoverSection data={section.rawData.cover as Record<string, unknown>} />
        <NarrativeRenderer paragraphs={section.content.narrative} />
        {section.content.keyFindings.map((f, i) => (
          <Callout key={`f${i}`} icon={f.type === 'strength' ? '💪' : '⚠️'} title={f.title}>
            {f.text}
          </Callout>
        ))}
        {section.content.actions.map((a, i) => (
          <Callout key={`a${i}`} icon="🎯" title={a.title}>
            {a.description}
          </Callout>
        ))}
      </div>
    );
  }

  if (section.id === 'action-plan') {
    return (
      <div className="space-y-4">
        {section.content.narrative.length > 0 && (
          <div className="space-y-4 mb-6">
            <NarrativeRenderer paragraphs={section.content.narrative} />
          </div>
        )}
      </div>
    );
  }

  // Generic: render narratives + findings, only fall back to rawData when no mega narrative
  const hasRichNarrative = section.content.narrative.length > 2;

  // Determine which dimension cards to show inline
  const showDimensionCards = section.id === 'personality-deep-dive' && dimensionDetails && dimensionDetails.length > 0;

  return (
    <div className="space-y-4">
      {section.content.narrative.length > 0 && (
        <div className="space-y-4 mb-6">
          <NarrativeRenderer paragraphs={section.content.narrative} />
        </div>
      )}

      {/* Dimension score cards with bell curves and facet bars */}
      {showDimensionCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
          {dimensionDetails!.map((dim) => (
            <DimensionScoreCard
              key={dim.key}
              dimensionKey={dim.key}
              dimensionName={dim.name}
              score={dim.score}
              percentile={dim.percentile}
              level={dim.label}
              color={dim.color}
              facets={dim.facets}
              interpretation={getDimensionInterpretation(dim.key, dim.score, studentName)}
            />
          ))}
        </div>
      )}

      {/* Executive summary — show mini bell curves in a row */}
      {section.id === 'cover-summary' && dimensionDetails && dimensionDetails.length > 0 && (
        <div className="my-8">
          <p className="text-[10px] uppercase tracking-widest text-warm-gray/60 mb-3">Score Distribution</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dimensionDetails.map((dim) => (
              <div key={dim.key} className="bg-white/50 rounded-xl p-3 border border-warm-gray/10">
                <BellCurveChart
                  score={dim.score}
                  color={dim.color}
                  label={dim.name.split(' ')[0]}
                  percentile={dim.percentile}
                  width={280}
                  height={110}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject fit matrix for subject-fit section */}
      {section.id === 'subject-fit' && subjectAlignment && subjectAlignment.length > 0 && (
        <div className="my-8">
          <p className="text-[10px] uppercase tracking-widest text-warm-gray/60 mb-3">Subject Alignment Matrix</p>
          <SubjectFitMatrix subjects={subjectAlignment} />
        </div>
      )}

      {section.content.keyFindings.map((f, i) => (
        <Callout key={`f${i}`} icon={f.type === 'strength' ? '💪' : f.type === 'barrier' ? '⚠️' : '💡'} title={f.title}>
          {f.text}
        </Callout>
      ))}
      {section.content.actions.map((a, i) => (
        <Callout key={`a${i}`} icon="🎯" title={a.title}>
          {a.description}
        </Callout>
      ))}
      {/* Only render rawData when mega narrative is thin — avoids duplicate content */}
      {!hasRichNarrative && section.rawData && Object.entries(section.rawData).map(([key, data]) => {
        if (!data || typeof data !== 'object') return null;
        return <SectionContent key={key} data={data as Record<string, unknown>} />;
      })}
    </div>
  );
}

// ─── Summary Dashboard ────────────────────────────────────────────────────────

function SummaryDashboard({ summary, studentName }: { summary: MegaReport['onePageSummary']; studentName: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <Card className="!p-6 bg-espresso text-white border-none relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 mb-2">The Mantra</p>
          <h2 className="font-display text-2xl font-bold leading-tight mb-4">"{summary.mantra}"</h2>
          <p className="text-white/70 text-sm leading-relaxed italic">
            A guiding principle tailored for {studentName.split(' ')[0]}'s specific profile.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      </Card>

      <Card className="!p-6 border-2 border-espresso/5 bg-white">
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-3">Top Priority Action</p>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-espresso text-white flex items-center justify-center shrink-0 font-bold">1</div>
          <div>
            <h3 className="font-bold text-espresso mb-1">{summary.primaryAction.title}</h3>
            <p className="text-espresso/70 text-sm leading-relaxed">{summary.primaryAction.description}</p>
          </div>
        </div>
      </Card>

      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="!p-5 border-none bg-green-50/50">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-green-700/60 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Top Strengths
          </p>
          <ul className="space-y-3">
            {summary.topStrengths.map((s, i) => (
              <li key={i} className="text-espresso/80 text-sm flex gap-2">
                <span className="text-green-600 font-bold shrink-0">•</span>
                {s.text}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="!p-5 border-none bg-amber-50/50">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-amber-700/60 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Focus Areas
          </p>
          <ul className="space-y-3">
            {summary.topBarriers.map((b, i) => (
              <li key={i} className="text-espresso/80 text-sm flex gap-2">
                <span className="text-amber-600 font-bold shrink-0">•</span>
                {b.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function TeacherBriefCard({ brief, studentName }: { brief: MegaReport['teacherBrief']; studentName: string }) {
  const firstName = studentName.split(' ')[0];
  return (
    <Card className="!p-8 border-dashed border-2 border-warm-gray/20 bg-white/50 my-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Badge className="mb-4">Teacher Briefing</Badge>
          <h2 className="font-display text-2xl font-bold text-espresso mb-2">Concise Guide for Educators</h2>
          <p className="text-sm text-warm-gray leading-relaxed">
            A one-page summary designed to be shared with {firstName}'s teachers to ensure they understand their natural learning style.
          </p>
        </div>
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-espresso/40 mb-1">Learning Archetype</p>
            <p className="text-espresso font-medium">{brief.learningStyle}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-espresso/40 mb-1">How to Motivate</p>
            <p className="text-espresso text-sm leading-relaxed">{brief.howToMotivate}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-espresso/40 mb-1">What to Watch For</p>
            <p className="text-espresso text-sm leading-relaxed">{brief.whatToWatchFor}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-espresso/40 mb-1">Key Recommendation</p>
            <p className="text-espresso text-sm leading-relaxed">{brief.topRecommendation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StudentHackCard({ hack, studentName }: { hack: MegaReport['studentHack']; studentName: string }) {
  const firstName = studentName.split(' ')[0];
  return (
    <Card className="!p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl my-12">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
          🚀
        </div>
        <div>
          <Badge className="bg-white/20 text-white border-none mb-3">Student Hack: {hack.title}</Badge>
          <h3 className="text-xl font-bold mb-2">Hey {firstName}, try this:</h3>
          <p className="text-lg font-medium text-white mb-4 leading-relaxed">
            "{hack.hack}"
          </p>
          <div className="bg-black/10 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-white/80 leading-relaxed italic">
              <strong>Why it works:</strong> {hack.why}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function IntroLetterCard({ letter }: { letter: MegaReport['introLetter'] }) {
  return (
    <div className="max-w-3xl mx-auto my-16 relative">
      <div className="absolute -left-4 -top-4 text-6xl text-espresso/5 font-serif select-none">“</div>
      <div className="relative z-10 space-y-6">
        <p className="font-display text-2xl font-bold text-espresso">{letter.salutation}</p>
        <p className="text-lg text-espresso/70 leading-relaxed font-medium">
          {letter.body}
        </p>
        <p className="font-display text-xl font-bold text-espresso pt-4">{letter.closing}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 text-6xl text-espresso/5 font-serif select-none">”</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportPage() {
  const { results, name } = useQuizStore();
  const { saveReport } = useReportsStore();

  if (!results) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-display text-2xl text-espresso mb-4">No results yet</p>
          <p className="text-warm-gray mb-8">
            Complete the assessment to generate your personalised report.
          </p>
          <Link href="/test">
            <Button variant="primary" icon>
              Take the Assessment
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const megaReport = generateMegaReport(results, name);

  const tocItems = megaReport.sections.map((s) => ({
    id: `section-${s.id}`,
    title: s.title,
  }));

  function handleSave() {
    saveReport(name || "Student", results!);
  }

  async function handleDownloadPDF() {
    await downloadReportPDF(name || "Student", results!, megaReport.raw as Record<string, unknown>);
  }

  return (
    <>
      <ReadingProgressBar />
      <StickyNav studentName={name || "Student Report"} onSave={handleSave} onDownloadPDF={handleDownloadPDF} />
      <FloatingTOC items={tocItems} />

      <main className="bg-cream min-h-screen pt-20 pb-24">
        {/* Page header */}
        <div className="max-w-4xl mx-auto px-6 pt-4 pb-4">
          <Badge className="mb-4">Academic Profile Report</Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-espresso">
            {name || "Student"}
          </h1>
          <p className="text-warm-gray mt-2">{megaReport.date}</p>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <IntroLetterCard letter={megaReport.introLetter} />
        </div>

        {/* Profile at a Glance dashboard */}
        {megaReport.dimensionDetails.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 mb-4">
            <ProfileAtAGlance
              studentName={name || "Student"}
              archetype={megaReport.archetype}
              radarData={megaReport.radarData.map(d => ({ label: d.dim, value: d.score, color: d.color }))}
              dimensionDetails={megaReport.dimensionDetails}
              topStrength={megaReport.onePageSummary.topStrengths[0]?.text}
              topBarrier={megaReport.onePageSummary.topBarriers[0]?.text}
            />
          </div>
        )}

        {/* Strength / Barrier summary cards */}
        {megaReport.dimensionDetails.length > 0 && (
          <div className="max-w-4xl mx-auto px-6">
            <StrengthBarrierSummary
              dimensionDetails={megaReport.dimensionDetails}
              topInteraction={megaReport.interactions?.[0]}
            />
          </div>
        )}

        {/* High-Impact Summary Sections */}
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <SummaryDashboard summary={megaReport.onePageSummary} studentName={name || "Student"} />
          <StudentHackCard hack={megaReport.studentHack} studentName={name || "Student"} />
          <TeacherBriefCard brief={megaReport.teacherBrief} studentName={name || "Student"} />
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto px-6">
          {megaReport.sections.map((section, index) => (
            <ReportSection
              key={section.id}
              id={`section-${section.id}`}
              title={section.subtitle ? `${section.title}: ${section.subtitle}` : section.title}
              isFirst={index === 0}
              keyTakeaway={section.keyTakeaway}
              sectionNumber={index + 1}
            >
              <MegaSectionBody section={section} studentName={name || "Student"} dimensionDetails={megaReport.dimensionDetails} subjectAlignment={megaReport.subjectAlignment} />
            </ReportSection>
          ))}
        </div>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, nav, [data-sticky-nav], [data-floating-toc],
          [data-progress-bar], button, .fixed { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          section { break-inside: avoid; }
          details { display: block !important; }
          details > div, details > section, [data-collapsible-content] {
            display: block !important; max-height: none !important; overflow: visible !important;
          }
        }
      ` }} />
    </>
  );
}
