import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { PullQuote } from "@/components/ui/PullQuote";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { 
  clean, 
  formatLabel, 
  formatLevel, 
  extractDisplayText, 
  extractTitle, 
  isSentence, 
  isInternalLabel, 
  SKIP_KEYS, 
  TEXT_KEYS, 
  TITLE_KEYS 
} from "@/lib/report/render-helpers";

// ─── Generic field renderers ──────────────────────────────────────────────────

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-espresso/80 leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-warm-gray/40 shrink-0" />
          {clean(item)}
        </li>
      ))}
    </ul>
  );
}

export function getRichText(item: unknown): { title: string; detail?: string } {
  if (typeof item === "string") return { title: item };
  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>;
    const name = (obj.name as string) || (obj.text as string) || "";
    // For strengths: use analysis or leverageTip
    const detail = (obj.analysis as string) || (obj.leverageTip as string) ||
      (obj.challenge as string) || (obj.actionTip as string) ||
      (obj.description as string) || (obj.tip as string) || "";
    return { title: name, detail: detail.length > 5 ? detail : undefined };
  }
  return { title: String(item) };
}

export function RichBulletList({ items }: { items: { title: string; detail?: string }[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i}>
          {item.detail ? (
            <>
              <p className="font-medium text-espresso">{clean(item.title)}</p>
              <p className="text-espresso/70 leading-relaxed mt-1">{clean(item.detail)}</p>
            </>
          ) : (
            <p className="text-espresso/80 leading-relaxed">{clean(item.title)}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function StrengthsWeaknessesField({
  strengths,
  weaknesses,
}: {
  strengths: unknown[];
  weaknesses: unknown[];
}) {
  const bothSides = strengths.length > 0 && weaknesses.length > 0;
  return (
    <div className={`grid grid-cols-1 ${bothSides ? "sm:grid-cols-2" : ""} gap-4 mb-4`}>
      {strengths.length > 0 && (
        <Card className="!p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-3">
            Strengths
          </p>
          <RichBulletList items={strengths.map(getRichText)} />
        </Card>
      )}
      {weaknesses.length > 0 && (
        <Card className="!p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-3">
            Growth Areas
          </p>
          <RichBulletList items={weaknesses.map(getRichText)} />
        </Card>
      )}
    </div>
  );
}

/** Render an array — string[] as bullet list in a card, object[] smartly */
export function ArrayField({ value, label }: { value: unknown[]; label?: string }) {
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
    const hasDimensionStructure = objs.some(
      (o) => Array.isArray(o.strengths) && Array.isArray(o.weaknesses)
    );
    if (hasDimensionStructure) {
      return (
        <div className="space-y-3 mb-3">
          {objs.map((item, i) => (
            <ObjectCard key={i} data={item} />
          ))}
        </div>
      );
    }

    // Rich titled objects (title + long description) — render individually
    const hasRichTitledContent = objs.some(
      (o) => {
        const t = extractTitle(o);
        const d = extractDisplayText(o);
        return t && d && d.length > 50;
      }
    );
    if (hasRichTitledContent) {
      return (
        <div className="space-y-3 mb-3">
          {objs.map((item, i) => (
            <ObjectCard key={i} data={item} />
          ))}
        </div>
      );
    }

    // Objects with same sub-array keys (e.g. all have "recommendation") — merge into one card
    const subArrayKeys = new Set<string>();
    for (const obj of objs) {
      for (const [k, v] of Object.entries(obj)) {
        if (Array.isArray(v) && v.length > 0) subArrayKeys.add(k);
      }
    }
    if (subArrayKeys.size > 0) {
      const merged: Record<string, string[]> = {};
      for (const key of subArrayKeys) {
        merged[key] = [];
        for (const obj of objs) {
          const arr = obj[key];
          if (Array.isArray(arr)) {
            for (const item of arr) {
              if (typeof item === "string" && isSentence(item)) merged[key].push(item);
            }
          }
        }
      }
      const cards = Object.entries(merged).filter(([, items]) => items.length > 0);
      if (cards.length > 0) {
        return (
          <div className="space-y-3 mb-3">
            {cards.map(([key, items]) => (
              <Card key={key} className="!p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
                  {formatLabel(key)}
                </p>
                <BulletList items={items} />
              </Card>
            ))}
          </div>
        );
      }
    }

    // Simple/small objects — consolidate all sentence-length strings into one bullet list
    const allTexts: string[] = [];
    for (const obj of objs) {
      // Try TEXT_KEYS first
      const displayText = extractDisplayText(obj);
      if (displayText && isSentence(displayText)) {
        allTexts.push(displayText);
        continue;
      }
      // Fallback: grab any sentence-length string from the object
      for (const [k, v] of Object.entries(obj)) {
        if (SKIP_KEYS.has(k) || k === "score" || k === "level" || k === "color") continue;
        if (typeof v === "string" && isSentence(v) && !isInternalLabel(v)) {
          allTexts.push(v);
          break; // one string per object
        }
      }
    }
    if (allTexts.length > 0) {
      return (
        <Card className="!p-4 mb-3">
          {label && (
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-2">
              {label}
            </p>
          )}
          <BulletList items={allTexts} />
        </Card>
      );
    }

    // Fallback — render each object as a card (only if they produce content)
    const rendered = objs.map((item, i) => <ObjectCard key={i} data={item} />).filter(Boolean);
    if (rendered.length > 0) {
      return <div className="space-y-3 mb-3">{rendered}</div>;
    }
  }

  return null;
}

export function ObjectCard({ data }: { data: Record<string, unknown> }) {
  if (!data) return null;

  // Strengths/weaknesses pattern
  if (Array.isArray(data.strengths) && Array.isArray(data.weaknesses)) {
    const cardName = extractTitle(data);
    const color = typeof data.color === "string" ? data.color : undefined;
    const rawScore = typeof data.rawScore === "number" ? data.rawScore : null;
    const dimInterpretLabel = typeof data.interpretLabel === "string" ? data.interpretLabel : undefined;
    const whatToDo = typeof data.whatToDo === "string" ? data.whatToDo : null;
    return (
      <div className="mb-4">
        {cardName && (
          <p className="font-semibold text-espresso mb-1" style={color ? { color } : undefined}>
            {cardName}
          </p>
        )}
        {rawScore != null && color && (
          <div className="mb-3 max-w-xs">
            <ScoreBar score={rawScore} color={color} showBenchmark interpretLabel={dimInterpretLabel} />
          </div>
        )}
        <StrengthsWeaknessesField
          strengths={data.strengths as unknown[]}
          weaknesses={data.weaknesses as unknown[]}
        />
        {whatToDo && (
          <Callout icon="💡" color={color} title="What to focus on">
            {clean(whatToDo)}
          </Callout>
        )}
      </div>
    );
  }

  // Callout pattern: learningCallout or growthMindset
  if (data.learningCallout && typeof data.learningCallout === "object") {
    const lc = data.learningCallout as Record<string, unknown>;
    const lcTitle = typeof lc.title === "string" ? lc.title : undefined;
    const lcText = typeof lc.text === "string" ? lc.text : undefined;
    const lcIcon = typeof lc.icon === "string" ? lc.icon : undefined;
    if (lcText) {
      return <Callout icon={lcIcon} title={lcTitle}>{clean(lcText)}</Callout>;
    }
  }
  if (data.growthMindset && typeof data.growthMindset === "object") {
    const gm = data.growthMindset as Record<string, unknown>;
    const msg = typeof gm.message === "string" ? gm.message : "";
    const principle = typeof gm.keyPrinciple === "string" ? gm.keyPrinciple : "";
    const step = typeof gm.actionStep === "string" ? gm.actionStep : "";
    const combined = [msg, principle, step].filter(Boolean).join(" ");
    if (combined) {
      return <Callout icon="🌱" title="Growth Mindset">{clean(combined)}</Callout>;
    }
  }

  // Collect renderable content
  const title = extractTitle(data);
  const color = typeof data.color === "string" ? data.color : undefined;
  const rawScore = typeof data.rawScore === "number" ? data.rawScore : null;
  const objInterpretLabel = typeof data.interpretLabel === "string" ? data.interpretLabel : undefined;
  const score = typeof data.score === "string" || typeof data.score === "number" ? data.score : null;
  const level = typeof data.level === "string" ? formatLevel(data.level) : null;

  // Gather text content (descriptions, tips, etc.) — skip if same as title
  const texts: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (TEXT_KEYS.has(k) && typeof v === "string" && v.length > 5) {
      // Skip if this text is an exact duplicate of the title
      if (title && v === title) continue;
      texts.push(v);
    }
  }

  // Gather non-skipped string fields — only sentences, not technical labels
  const extraFields: { key: string; value: string }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (SKIP_KEYS.has(k) || TITLE_KEYS.has(k) || TEXT_KEYS.has(k)) continue;
    if (k === "score" || k === "level" || k === "color") continue;
    if (typeof v === "string" && v.length > 2) {
      const cleaned = formatLevel(v);
      if (!isInternalLabel(cleaned) && isSentence(cleaned)) {
        extraFields.push({ key: k, value: cleaned });
      }
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
      {rawScore != null && color && (
        <div className="mb-2 max-w-xs">
          <ScoreBar score={rawScore} color={color} showBenchmark interpretLabel={objInterpretLabel} />
        </div>
      )}
      {!title && score != null && (
        <Badge className="mb-2" color={color}>{String(score)}</Badge>
      )}
      {texts.map((t, i) => (
        <p key={i} className="text-espresso/70 leading-relaxed mb-2">{clean(t)}</p>
      ))}
      {extraFields.map(({ key, value }) => (
        <p key={key} className="text-espresso/70 leading-relaxed mb-1">{value}</p>
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
          <p className="text-espresso/70 leading-relaxed">{text}</p>
        </div>
      ))}
    </Card>
  );
}

const PULLQUOTE_KEYS = new Set(["insight", "keyInsight", "oneMinuteBrief"]);

export function SectionField({ label, value, fieldKey }: { label: string; value: unknown; fieldKey?: string }) {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return null;
  if (typeof value === "string") {
    if (value.length === 0 || isInternalLabel(value)) return null;
    if (fieldKey && PULLQUOTE_KEYS.has(fieldKey) && value.length > 40) {
      return <PullQuote>{clean(value)}</PullQuote>;
    }
    return <p className="text-espresso/80 leading-relaxed mb-3">{clean(value)}</p>;
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

// Keys that are rendered as part of the narrative — skip in structured rendering
export const NARRATIVE_KEYS = new Set([
  "narrative", "archetype", "keyInsight", "fallbackMessage",
  "learningStyle", "attentionProfile", "studyApproach", "timeManagement",
  "selfReflection", "growthMindset", "oneMinuteBrief", "tutorMatch",
  "priorityRanking", "weeklyRhythm", "studyPrescription",
  // Executive summary — narrative already covers these
  "topStrength", "topBarrier", "topAction",
  // Barriers — narrative already covers these
  "cycles", "misdiagnoses",
]);

export function NarrativeParagraphs({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  return (
    <div className="space-y-4 mb-6">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-espresso/80 leading-relaxed text-[15px]">{clean(p)}</p>
      ))}
    </div>
  );
}

export function SectionContent({ data }: { data: Record<string, unknown> }) {
  const narrative = typeof data.narrative === "string" ? data.narrative : null;

  // When narrative exists, show it prominently then only structured elements
  if (narrative) {
    const structuredEntries = Object.entries(data).filter(
      ([k]) => !SKIP_KEYS.has(k) && !NARRATIVE_KEYS.has(k)
    );

    return (
      <div className="space-y-4">
        <NarrativeParagraphs text={narrative} />
        {structuredEntries.map(([key, value]) => {
          const label = formatLabel(key);
          return <SectionField key={key} label={label} value={value} fieldKey={key} />;
        })}
      </div>
    );
  }

  // No narrative — render all fields generically
  const entries = Object.entries(data).filter(([k]) => !SKIP_KEYS.has(k));
  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => {
        const label = formatLabel(key);
        return <SectionField key={key} label={label} value={value} fieldKey={key} />;
      })}
    </div>
  );
}
