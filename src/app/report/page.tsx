"use client";

import Link from "next/link";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useReportsStore } from "@/lib/stores/reports-store";
import { generateReport } from "@/lib/report";
import { ReportSection } from "@/components/report/ReportSection";
import { StickyNav } from "@/components/report/StickyNav";
import { FloatingTOC } from "@/components/report/FloatingTOC";
import { downloadReportPDF } from "@/components/pdf/ReportPDF";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// ─── Field classification helpers ────────────────────────────────────────────

// Keys that are internal metadata — never render
const SKIP_KEYS = new Set([
  "key", "icon", "color", "rawScore", "classification", "rank", "role",
  "shortName", "radarData", "passionClassification", "confidenceClassification",
  "matchPercent", "match_score", "dualFire", "type", "impact", "profile",
  "percentile", "structureScore", "warmthScore", "carrotScore", "stickScore",
  "barrier", "sdi", "item_count", "dim", "name", "date",
  // Section-structural keys (lookup keys whose content is in companion objects)
  "dominantApproach", "motivationProfile", "regulationStrength",
  "approaches", "motivationScores", "scores", "quizMode",
]);

// Keys whose values are titles/names to display prominently
const TITLE_KEYS = new Set(["name", "title", "label", "style", "preferred", "metric"]);

// Keys whose values are short text to display as body content
const TEXT_KEYS = new Set([
  "text", "description", "desc", "narrative", "details", "summary", "explanation",
  "message", "keyPrinciple", "actionStep", "approach", "idealFor", "bestWhen",
  "notIdeal", "tip", "tutorTip", "strategy", "challenge", "analysis",
  "leverageTip", "actionTip", "whatToDo", "understandingProfile",
  "alignmentLabel", "passionTip", "confidenceTip", "fallbackMessage",
  "oneMinuteBrief", "insight", "question", "misconception", "realCause",
  "cycle", "fallbackMessage", "method", "rationale",
]);

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/** Title-case only short enum-like values (e.g. "very_high" → "Very High"). Leave sentences alone. */
function formatLevel(val: string): string {
  if (val.length > 30 || val.includes(".") || val.includes(",")) return val;
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Extract the best displayable text from an object */
function extractDisplayText(obj: Record<string, unknown> | null | undefined): string | null {
  if (!obj) return null;
  for (const key of TEXT_KEYS) {
    if (typeof obj[key] === "string" && (obj[key] as string).length > 0) {
      return obj[key] as string;
    }
  }
  return null;
}

/** Extract the title from an object */
function extractTitle(obj: Record<string, unknown> | null | undefined): string | null {
  if (!obj) return null;
  for (const key of TITLE_KEYS) {
    if (typeof obj[key] === "string" && (obj[key] as string).length > 0) {
      return obj[key] as string;
    }
  }
  return null;
}

// ─── Generic field renderers ──────────────────────────────────────────────────

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-espresso/80 leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warm-gray/40 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function StrengthsWeaknessesField({
  strengths,
  weaknesses,
}: {
  strengths: unknown[];
  weaknesses: unknown[];
}) {
  const getText = (item: unknown): string => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      return (obj.name as string) || (obj.text as string) || (obj.description as string) || JSON.stringify(item);
    }
    return String(item);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {strengths.length > 0 && (
        <Card className="!p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
            Strengths
          </p>
          <BulletList items={strengths.map(getText)} />
        </Card>
      )}
      {weaknesses.length > 0 && (
        <Card className="!p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
            Growth Areas
          </p>
          <BulletList items={weaknesses.map(getText)} />
        </Card>
      )}
    </div>
  );
}

/** Render an array — string[] as bullet list in a card, object[] smartly */
function ArrayField({ value, label }: { value: unknown[]; label?: string }) {
  if (value.length === 0) return null;

  // All strings → bullet list inside a card
  const allStrings = value.every((v) => typeof v === "string");
  if (allStrings) {
    return (
      <Card className="!p-4 mb-3">
        {label && (
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
            {label}
          </p>
        )}
        <BulletList items={value as string[]} />
      </Card>
    );
  }

  // Object array
  const allObjects = value.every((v) => typeof v === "object" && v !== null && !Array.isArray(v));
  if (allObjects) {
    const objs = value as Record<string, unknown>[];

    // Check if objects have strengths/weaknesses (dimension cards) — render each as its own card
    const hasRichStructure = objs.some(
      (o) => (Array.isArray(o.strengths) && Array.isArray(o.weaknesses)) ||
        (extractTitle(o) && extractDisplayText(o))
    );
    if (hasRichStructure) {
      return (
        <div className="space-y-3 mb-3">
          {objs.map((item, i) => (
            <ObjectCard key={i} data={item} />
          ))}
        </div>
      );
    }

    // Simple text objects (like motivators: { text, dim, icon }) → bullet list
    const texts = objs.map(extractDisplayText);
    const allHaveText = texts.every((t) => t !== null);
    if (allHaveText) {
      return (
        <Card className="!p-4 mb-3">
          {label && (
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
              {label}
            </p>
          )}
          <BulletList items={texts as string[]} />
        </Card>
      );
    }

    // Fallback — render each object as a card
    return (
      <div className="space-y-3 mb-3">
        {objs.map((item, i) => (
          <ObjectCard key={i} data={item} />
        ))}
      </div>
    );
  }

  return null;
}

function ObjectCard({ data }: { data: Record<string, unknown> }) {
  if (!data) return null;

  // Strengths/weaknesses pattern
  if (Array.isArray(data.strengths) && Array.isArray(data.weaknesses)) {
    const cardName = extractTitle(data);
    const color = typeof data.color === "string" ? data.color : undefined;
    const whatToDo = typeof data.whatToDo === "string" ? data.whatToDo : null;
    return (
      <div className="mb-4">
        {cardName && (
          <p className="font-semibold text-espresso mb-1" style={color ? { color } : undefined}>
            {cardName}
          </p>
        )}
        <StrengthsWeaknessesField
          strengths={data.strengths as unknown[]}
          weaknesses={data.weaknesses as unknown[]}
        />
        {whatToDo && (
          <p className="text-sm text-espresso/70 mt-2 italic">{whatToDo}</p>
        )}
      </div>
    );
  }

  // Collect renderable content
  const title = extractTitle(data);
  const color = typeof data.color === "string" ? data.color : undefined;
  const score = typeof data.score === "string" || typeof data.score === "number" ? data.score : null;
  const level = typeof data.level === "string" ? formatLevel(data.level) : null;

  // Gather text content (descriptions, tips, etc.)
  const texts: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (TEXT_KEYS.has(k) && typeof v === "string" && v.length > 5) {
      texts.push(v);
    }
  }

  // Gather non-skipped string/number fields that aren't title, text, or score
  const extraFields: { key: string; value: string }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (SKIP_KEYS.has(k) || TITLE_KEYS.has(k) || TEXT_KEYS.has(k)) continue;
    if (k === "score" || k === "level" || k === "color") continue;
    if (typeof v === "string" && v.length > 2) {
      extraFields.push({ key: k, value: formatLevel(v) });
    }
  }

  // Gather arrays
  const arrays: { key: string; value: unknown[] }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (SKIP_KEYS.has(k)) continue;
    if (Array.isArray(v) && v.length > 0) {
      arrays.push({ key: k, value: v });
    }
  }

  // Sub-objects (only keep ones with extractable text)
  const subObjects: { key: string; value: Record<string, unknown>; text: string }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (SKIP_KEYS.has(k)) continue;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      const subText = extractDisplayText(v as Record<string, unknown>);
      if (subText) {
        subObjects.push({ key: k, value: v as Record<string, unknown>, text: subText });
      }
    }
  }

  // If nothing to show, return null
  const hasContent = title || score || texts.length > 0 || extraFields.length > 0 || arrays.length > 0 || subObjects.length > 0;
  if (!hasContent) return null;

  return (
    <Card className="!p-4">
      {title && (
        <p className="font-semibold text-espresso mb-1" style={color ? { color } : undefined}>
          {title}
          {score != null && <Badge className="ml-2">{String(score)}</Badge>}
          {level && <span className="text-sm text-warm-gray ml-2">{level}</span>}
        </p>
      )}
      {!title && score != null && (
        <Badge className="mb-2" color={color}>{String(score)}</Badge>
      )}
      {texts.map((t, i) => (
        <p key={i} className="text-sm text-espresso/70 leading-relaxed mb-2">{t}</p>
      ))}
      {extraFields.map(({ key, value }) => (
        <p key={key} className="text-sm text-espresso/70 leading-relaxed mb-1">{value}</p>
      ))}
      {arrays.map(({ key, value }) => {
        const allStr = value.every((v) => typeof v === "string");
        if (allStr) {
          return (
            <div key={key} className="mt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-1">
                {formatLabel(key)}
              </p>
              <BulletList items={value as string[]} />
            </div>
          );
        }
        const texts = (value as Record<string, unknown>[]).map(extractDisplayText).filter(Boolean);
        if (texts.length === value.length) {
          return (
            <div key={key} className="mt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-1">
                {formatLabel(key)}
              </p>
              <BulletList items={texts as string[]} />
            </div>
          );
        }
        return null;
      })}
      {subObjects.map(({ key, text }) => (
        <div key={key} className="mt-2">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-1">
            {formatLabel(key)}
          </p>
          <p className="text-sm text-espresso/70 leading-relaxed">{text}</p>
        </div>
      ))}
    </Card>
  );
}

function SectionField({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return null;
  if (typeof value === "string") {
    if (value.length === 0) return null;
    return <p className="text-espresso/80 leading-relaxed mb-3">{value}</p>;
  }
  if (typeof value === "number") {
    if (value > 5 || value < 0) return null;
    return (
      <div className="mb-3">
        <Badge>{String(value)}</Badge>
      </div>
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return <ArrayField value={value} label={label} />;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (!obj || Object.keys(obj).length === 0) return null;
    if (Array.isArray(obj.strengths) && Array.isArray(obj.weaknesses)) {
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
  const entries = Object.entries(data).filter(([k]) => !SKIP_KEYS.has(k));

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => {
        const label = formatLabel(key);
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
  // When complete mode is active, skip individual personality/learning sections
  // to avoid redundancy — the complete sections cross-reference both
  const orderedSections: SectionDefinition[] = [];
  if (report.hasComplete) {
    // Complete mode: cover + executive summary + rich personality sections
    // + learning/working/barriers/action/guide
    // Replaces bare "Who You Are" (just scores) with detailed personality sections
    orderedSections.push(
      { key: "cover", title: "Profile Summary", isCover: true },
      { key: "executiveSummary", title: "Executive Summary" },
      // Rich personality detail (replaces "Who You Are")
      { key: "deepDive", title: "Deep Dive — Your Personality" },
      { key: "drives", title: "Drives & Motivation" },
      { key: "strengths", title: "Strengths & Growth" },
      // Cross-referenced learning + action
      { key: "howYouLearn", title: "How You Learn" },
      { key: "whatsWorking", title: "What's Working" },
      { key: "barriers", title: "Barriers to Learning" },
      { key: "actionPlan", title: "Action Plan" },
      { key: "unifiedGuide", title: "Complete Guide" },
    );
  } else {
    if (report.hasPersonality) orderedSections.push(...PERSONALITY_SECTIONS);
    if (report.hasLearning) orderedSections.push(...LEARNING_SECTIONS);
  }

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

  async function handleDownloadPDF() {
    await downloadReportPDF(name || "Student", results!, report as Record<string, unknown>);
  }

  return (
    <>
      <StickyNav studentName={name || "Student Report"} onSave={handleSave} onDownloadPDF={handleDownloadPDF} />
      <FloatingTOC items={tocItems} />

      <main className="bg-cream min-h-screen pt-20 pb-24">
        {/* Page header */}
        <div className="max-w-4xl mx-auto px-6 pt-4 pb-4">
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
