"use client";

import Link from "next/link";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useReportsStore } from "@/lib/stores/reports-store";
import { generateReport } from "@/lib/report";
import { ReportSection } from "@/components/report/ReportSection";
import { StickyNav } from "@/components/report/StickyNav";
import { FloatingTOC } from "@/components/report/FloatingTOC";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// ─── Generic field renderers ──────────────────────────────────────────────────

function StringField({ value }: { value: string }) {
  return <p className="text-espresso/80 leading-relaxed mb-3">{value}</p>;
}

function ArrayField({ value }: { value: unknown[] }) {
  const allStrings = value.every((v) => typeof v === "string");
  if (allStrings) {
    return (
      <ul className="space-y-1.5 mb-3">
        {(value as string[]).map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-espresso/80 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warm-gray/40 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  // Array of objects — render each as a card
  return (
    <div className="space-y-3 mb-3">
      {value.map((item, i) => (
        <ObjectCard key={i} data={item as Record<string, unknown>} />
      ))}
    </div>
  );
}

function StrengthsWeaknessesField({
  strengths,
  weaknesses,
}: {
  strengths: unknown[];
  weaknesses: unknown[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {strengths.length > 0 && (
        <Card className="!p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
            Strengths
          </p>
          <ul className="space-y-1">
            {(strengths as Record<string, unknown>[]).map((s, i) => (
              <li key={i} className="text-sm text-espresso/80">
                {typeof s === "string" ? s : (s.name as string) || JSON.stringify(s)}
              </li>
            ))}
          </ul>
        </Card>
      )}
      {weaknesses.length > 0 && (
        <Card className="!p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
            Growth Areas
          </p>
          <ul className="space-y-1">
            {(weaknesses as Record<string, unknown>[]).map((w, i) => (
              <li key={i} className="text-sm text-espresso/80">
                {typeof w === "string" ? w : (w.name as string) || JSON.stringify(w)}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function ObjectCard({ data }: { data: Record<string, unknown> }) {
  const hasStrengthsWeaknesses =
    Array.isArray(data.strengths) && Array.isArray(data.weaknesses);

  if (hasStrengthsWeaknesses) {
    const cardName = typeof data.name === "string" ? data.name : null;
    return (
      <div className="mb-2">
        {cardName && (
          <p className="font-medium text-espresso mb-2">{cardName}</p>
        )}
        <StrengthsWeaknessesField
          strengths={data.strengths as unknown[]}
          weaknesses={data.weaknesses as unknown[]}
        />
      </div>
    );
  }

  const primitiveEntries = Object.entries(data).filter(
    ([, v]) => typeof v === "string" || typeof v === "number"
  );
  const arrayEntries = Object.entries(data).filter(([, v]) => Array.isArray(v));

  return (
    <Card className="!p-4">
      {primitiveEntries.map(([key, value]) => {
        if (key === "color") return null;
        if (key === "name" || key === "title" || key === "label") {
          return (
            <p key={key} className="font-medium text-espresso mb-1">
              {String(value)}
            </p>
          );
        }
        if (key === "score" || key === "rawScore") {
          return (
            <Badge key={key} className="mb-2">
              {String(value)}
            </Badge>
          );
        }
        return (
          <p key={key} className="text-sm text-espresso/70 leading-relaxed mb-1">
            {String(value)}
          </p>
        );
      })}
      {arrayEntries.map(([key, value]) => (
        <div key={key} className="mt-2">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-1">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </p>
          <ArrayField value={value as unknown[]} />
        </div>
      ))}
    </Card>
  );
}

function SectionField({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return <StringField value={value} />;
  if (typeof value === "number") {
    return (
      <div className="mb-3">
        <Badge>{String(value)}</Badge>
      </div>
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return <ArrayField value={value} />;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const hasStrengthsWeaknesses =
      Array.isArray(obj.strengths) && Array.isArray(obj.weaknesses);
    if (hasStrengthsWeaknesses) {
      return (
        <StrengthsWeaknessesField
          strengths={obj.strengths as unknown[]}
          weaknesses={obj.weaknesses as unknown[]}
        />
      );
    }
    return <ObjectCard data={obj} />;
  }
  return null;
}

function SectionContent({ data }: { data: Record<string, unknown> }) {
  const SKIP_KEYS = new Set(["name", "date", "radarData"]);

  const entries = Object.entries(data).filter(([k]) => !SKIP_KEYS.has(k));

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())
          .trim();
        return <SectionField key={key} label={label} value={value} />;
      })}
    </div>
  );
}

// ─── Cover Section ───────────────────────────────────────────────────────────

function CoverSection({ data }: { data: Record<string, unknown> }) {
  const topTraits = data.topTraits as {
    key: string;
    name: string;
    score: string;
    level: string;
    color: string;
  }[];

  const narrativeSummary = typeof data.narrativeSummary === "string" ? data.narrativeSummary : null;
  const summary = typeof data.summary === "string" ? data.summary : null;

  return (
    <div className="space-y-8">
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

// ─── Section registry ─────────────────────────────────────────────────────────

interface SectionDefinition {
  key: string;
  title: string;
  isCover?: boolean;
}

const PERSONALITY_SECTIONS: SectionDefinition[] = [
  { key: "cover", title: "Profile Summary", isCover: true },
  { key: "glance", title: "Personality at a Glance" },
  { key: "deepDive", title: "Deep Dive" },
  { key: "learning", title: "Learning Style" },
  { key: "drives", title: "Drives & Motivation" },
  { key: "study", title: "Study Approach" },
  { key: "group", title: "Group Work & Collaboration" },
  { key: "strengths", title: "Strengths & Growth" },
  { key: "guide", title: "Tutor's Guide" },
  { key: "tutor", title: "Parent & Tutor Tips" },
];

const LEARNING_SECTIONS: SectionDefinition[] = [
  { key: "studyProfile", title: "Study Profile" },
  { key: "academicCharacter", title: "Academic Character" },
  { key: "subjectFit", title: "Subject Fit" },
  { key: "whatWorks", title: "What Works" },
  { key: "rootCause", title: "Root Cause Analysis" },
  { key: "academicGuide", title: "Academic Guide" },
];

const COMPLETE_SECTIONS: SectionDefinition[] = [
  { key: "executiveSummary", title: "Executive Summary" },
  { key: "whoYouAre", title: "Who You Are" },
  { key: "howYouLearn", title: "How You Learn" },
  { key: "whatsWorking", title: "What's Working" },
  { key: "barriers", title: "Barriers to Learning" },
  { key: "actionPlan", title: "Action Plan" },
  { key: "unifiedGuide", title: "Complete Guide" },
];

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

  const report = generateReport(results, name);

  // Build the ordered list of sections to render
  const orderedSections: SectionDefinition[] = [];
  if (report.hasPersonality) orderedSections.push(...PERSONALITY_SECTIONS);
  if (report.hasLearning) orderedSections.push(...LEARNING_SECTIONS);
  if (report.hasComplete) orderedSections.push(...COMPLETE_SECTIONS);

  const activeSections = orderedSections.filter(
    (s) => report[s.key as keyof typeof report] !== null
  );

  const tocItems = activeSections.map((s) => ({
    id: `section-${s.key}`,
    title: s.title,
  }));

  function handleSave() {
    saveReport(name || "Student", results!);
  }

  return (
    <>
      <StickyNav studentName={name || "Student Report"} onSave={handleSave} />
      <FloatingTOC items={tocItems} />

      <main className="bg-cream min-h-screen pt-20 pb-24">
        {/* Page header */}
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-4">
          <Badge className="mb-4">Academic Profile Report</Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-espresso">
            {name || "Student"}
          </h1>
          {report.cover && (
            <p className="text-warm-gray mt-2">
              {(report.cover as Record<string, unknown>).date as string}
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto px-6">
          {activeSections.map((sectionDef, index) => {
            const data = report[sectionDef.key as keyof typeof report] as Record<
              string,
              unknown
            > | null;
            if (!data) return null;

            return (
              <ReportSection
                key={sectionDef.key}
                id={`section-${sectionDef.key}`}
                sectionNumber={index + 1}
                title={sectionDef.title}
                isFirst={index === 0}
              >
                {sectionDef.isCover ? (
                  <CoverSection data={data} />
                ) : (
                  <SectionContent data={data} />
                )}
              </ReportSection>
            );
          })}
        </div>
      </main>
    </>
  );
}
