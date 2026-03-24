"use client";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { TestResults } from "@/lib/types";

const CREAM = "#fdfbf7";
const ESPRESSO = "#2c2417";
const WARM_GRAY = "#8b7355";
const BORDER = "#e8e0d4";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: ESPRESSO,
    backgroundColor: CREAM,
  },
  // Cover
  coverPage: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: CREAM,
    justifyContent: "center",
    alignItems: "center",
  },
  coverEyebrow: {
    fontSize: 9,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 12,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 12,
    color: WARM_GRAY,
    marginBottom: 40,
  },
  coverScores: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  coverScoreCard: {
    padding: 12,
    borderRadius: 8,
    border: `1 solid ${BORDER}`,
    backgroundColor: "#fff",
    minWidth: 75,
    alignItems: "center",
  },
  coverScoreName: {
    fontSize: 7,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  coverScoreValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  // Section headers
  sectionHeader: {
    marginTop: 16,
    marginBottom: 10,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: ESPRESSO,
  },
  // Content
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#4a3f2f",
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginVertical: 12,
  },
  // Cards
  card: {
    border: `1 solid ${BORDER}`,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 7,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  // Lists
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 10,
    color: WARM_GRAY,
    marginRight: 6,
    marginTop: 1,
  },
  listText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#4a3f2f",
    flex: 1,
  },
  // Two-column layout for strengths/weaknesses
  twoCol: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  colHalf: {
    flex: 1,
  },
  // Page footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: WARM_GRAY,
  },
});

const DIM_COLORS: Record<string, string> = {
  "Honesty-Humility": "#14b8a6",
  Emotionality: "#f43f5e",
  Extraversion: "#f97316",
  Agreeableness: "#22c55e",
  Conscientiousness: "#3b82f6",
  "Openness to Experience": "#8b5cf6",
  Openness: "#8b5cf6",
};

// Keys to skip when rendering
const SKIP_KEYS = new Set([
  "key", "icon", "color", "rawScore", "classification", "rank", "role",
  "shortName", "radarData", "passionClassification", "confidenceClassification",
  "matchPercent", "match_score", "dualFire", "type", "impact", "profile",
  "percentile", "structureScore", "warmthScore", "carrotScore", "stickScore",
  "barrier", "sdi", "item_count", "dim", "name", "date", "scores",
  "dominantApproach", "motivationProfile", "regulationStrength",
  "approaches", "motivationScores", "quizMode",
  "personalityRoot", "personalityScore", "academicSymptom", "academicScore",
  "visibleBehaviour", "id", "looksLike", "actuallyIs", "urgency",
  "alignment", "passion", "confidence", "weight", "evidence",
  "dimKey", "facetKey", "source", "audience", "dualFireNote",
  "personality", "academic", "misdiagnosis", "fit",
]);

// Keys suppressed when narrative exists (covered by narrative prose)
const NARRATIVE_KEYS = new Set([
  "narrative", "archetype", "keyInsight", "fallbackMessage",
  "learningStyle", "attentionProfile", "studyApproach", "timeManagement",
  "selfReflection", "growthMindset", "oneMinuteBrief", "tutorMatch",
  "priorityRanking", "weeklyRhythm", "studyPrescription",
  "topStrength", "topBarrier", "topAction",
  "cycles", "misdiagnoses",
]);

const TITLE_KEYS = new Set(["name", "title", "label", "style", "preferred", "metric", "format", "category", "tip"]);

const TEXT_KEYS = new Set([
  "text", "description", "desc", "narrative", "details", "summary", "explanation",
  "message", "keyPrinciple", "actionStep", "approach", "idealFor", "bestWhen",
  "notIdeal", "tutorTip", "strategy", "challenge", "analysis",
  "leverageTip", "actionTip", "whatToDo", "understandingProfile",
  "alignmentLabel", "passionTip", "confidenceTip", "fallbackMessage",
  "oneMinuteBrief", "insight", "question", "misconception", "realCause",
  "cycle", "method", "rationale", "action",
]);

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function extractDisplayText(obj: Record<string, unknown> | null): string | null {
  if (!obj) return null;
  for (const key of TEXT_KEYS) {
    if (typeof obj[key] === "string" && (obj[key] as string).length > 0) {
      return obj[key] as string;
    }
  }
  return null;
}

function extractTitle(obj: Record<string, unknown> | null): string | null {
  if (!obj) return null;
  for (const key of TITLE_KEYS) {
    if (typeof obj[key] === "string" && (obj[key] as string).length > 0) {
      return obj[key] as string;
    }
  }
  return null;
}

// ─── PDF Content Renderers ───────────────────────────────────────────────────

function PDFBulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function PDFCard({ title, label, children }: { title?: string | null; label?: string | null; children: React.ReactNode }) {
  return (
    <View style={styles.card} wrap={false}>
      {label && <Text style={styles.cardLabel}>{label}</Text>}
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function PDFStrengthsWeaknesses({ strengths, weaknesses }: { strengths: unknown[]; weaknesses: unknown[] }) {
  const getText = (item: unknown): string => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      return (obj.name as string) || (obj.text as string) || (obj.description as string) || String(item);
    }
    return String(item);
  };

  return (
    <View style={styles.twoCol}>
      {strengths.length > 0 && (
        <View style={styles.colHalf}>
          <PDFCard label="Strengths">
            <PDFBulletList items={strengths.map(getText)} />
          </PDFCard>
        </View>
      )}
      {weaknesses.length > 0 && (
        <View style={styles.colHalf}>
          <PDFCard label="Growth Areas">
            <PDFBulletList items={weaknesses.map(getText)} />
          </PDFCard>
        </View>
      )}
    </View>
  );
}

function renderValue(value: unknown, label?: string): React.ReactElement | null {
  if (value === null || value === undefined || typeof value === "boolean") return null;

  if (typeof value === "string") {
    if (value.length === 0) return null;
    return <Text style={styles.body}>{value}</Text>;
  }

  if (typeof value === "number") {
    if (value > 5 || value < 0) return null;
    return <Text style={styles.body}>{String(value)}</Text>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // String array
    if (value.every((v) => typeof v === "string")) {
      return (
        <PDFCard label={label}>
          <PDFBulletList items={value as string[]} />
        </PDFCard>
      );
    }

    // Object array — check if they have extractable text
    if (value.every((v) => typeof v === "object" && v !== null)) {
      const objs = value as Record<string, unknown>[];

      // Text objects (like motivators: {text, dim, icon})
      const texts = objs.map(extractDisplayText);
      if (texts.every((t) => t !== null)) {
        return (
          <PDFCard label={label}>
            <PDFBulletList items={texts as string[]} />
          </PDFCard>
        );
      }

      // Complex objects — render each
      return (
        <View>
          {objs.map((obj, i) => renderObject(obj, i))}
        </View>
      );
    }

    return null;
  }

  if (typeof value === "object") {
    return renderObject(value as Record<string, unknown>);
  }

  return null;
}

function renderObject(data: Record<string, unknown>, keyIndex?: number): React.ReactElement | null {
  if (!data) return null;

  // Strengths/weaknesses pattern
  if (Array.isArray(data.strengths) && Array.isArray(data.weaknesses)) {
    const title = extractTitle(data);
    return (
      <View key={keyIndex}>
        {title && <Text style={[styles.cardTitle, { marginBottom: 6 }]}>{title}</Text>}
        <PDFStrengthsWeaknesses
          strengths={data.strengths as unknown[]}
          weaknesses={data.weaknesses as unknown[]}
        />
        {typeof data.whatToDo === "string" && (
          <Text style={[styles.body, { fontStyle: "italic" }]}>{(data.whatToDo as string).replace(/ — /g, ': ').replace(/—/g, ': ')}</Text>
        )}
      </View>
    );
  }

  const title = extractTitle(data);
  const text = extractDisplayText(data);
  const score = typeof data.score === "number" || typeof data.score === "string" ? data.score : null;

  // Collect text fields
  const texts: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (TEXT_KEYS.has(k) && typeof v === "string" && v.length > 5) {
      texts.push(v);
    }
  }

  // Collect arrays
  const arrays: { key: string; value: unknown[] }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (SKIP_KEYS.has(k)) continue;
    if (Array.isArray(v) && v.length > 0) {
      arrays.push({ key: k, value: v });
    }
  }

  // Sub-objects (keep all — we'll try rendering each)
  const subObjects: { key: string; value: Record<string, unknown> }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (SKIP_KEYS.has(k)) continue;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      // Only include if it has some non-skip content
      const hasSubContent = Object.entries(v as Record<string, unknown>).some(
        ([sk, sv]) => !SKIP_KEYS.has(sk) && sv !== null && sv !== undefined &&
          (typeof sv === "string" ? sv.length > 2 : true)
      );
      if (hasSubContent) subObjects.push({ key: k, value: v as Record<string, unknown> });
    }
  }

  const hasContent = title || score || texts.length > 0 || arrays.length > 0 || subObjects.length > 0;
  if (!hasContent) return null;

  return (
    <PDFCard key={keyIndex} title={title ? `${title}${score != null ? ` — ${score}` : ""}` : null}>
      {!title && score != null && <Text style={styles.body}>{String(score)}</Text>}
      {texts.map((t, i) => (
        <Text key={i} style={styles.body}>{t}</Text>
      ))}
      {arrays.map(({ key, value }) => {
        const allStr = value.every((v) => typeof v === "string");
        if (allStr) {
          return (
            <View key={key} style={{ marginTop: 4 }}>
              <Text style={styles.cardLabel}>{formatLabel(key)}</Text>
              <PDFBulletList items={value as string[]} />
            </View>
          );
        }
        const extractedTexts = (value as Record<string, unknown>[]).map(extractDisplayText).filter(Boolean);
        if (extractedTexts.length === value.length) {
          return (
            <View key={key} style={{ marginTop: 4 }}>
              <Text style={styles.cardLabel}>{formatLabel(key)}</Text>
              <PDFBulletList items={extractedTexts as string[]} />
            </View>
          );
        }
        return null;
      })}
      {subObjects.map(({ key, value }) => {
        const subText = extractDisplayText(value);
        if (subText) {
          return (
            <View key={key} style={{ marginTop: 4 }}>
              <Text style={styles.cardLabel}>{formatLabel(key)}</Text>
              <Text style={styles.body}>{subText}</Text>
            </View>
          );
        }
        // Try rendering the sub-object recursively
        const subRendered = renderObject(value);
        if (subRendered) {
          return (
            <View key={key} style={{ marginTop: 4 }}>
              <Text style={styles.cardLabel}>{formatLabel(key)}</Text>
              {subRendered}
            </View>
          );
        }
        return null;
      })}
    </PDFCard>
  );
}

/** Recursively extract all displayable content from any value */
function deepRenderValue(value: unknown, label?: string, depth?: number): React.ReactElement | null {
  if (value === null || value === undefined || typeof value === "boolean") return null;
  const d = depth || 0;

  if (typeof value === "string") {
    if (value.length < 3) return null;
    return <Text style={styles.body}>{value}</Text>;
  }

  if (typeof value === "number") {
    return null; // Skip raw numbers — they show in titles
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // String array → bullet list in card
    if (value.every((v) => typeof v === "string")) {
      return (
        <PDFCard label={label}>
          <PDFBulletList items={value.filter((s) => (s as string).length > 2) as string[]} />
        </PDFCard>
      );
    }

    // Object array
    if (value.every((v) => typeof v === "object" && v !== null)) {
      const objs = value as Record<string, unknown>[];

      // Check for strengths/weaknesses pattern in items
      const hasStrWeak = objs.some(
        (o) => Array.isArray(o.strengths) && Array.isArray(o.weaknesses)
      );
      if (hasStrWeak) {
        return (
          <View>
            {objs.map((obj, i) => {
              const rendered = deepRenderValue(obj, undefined, d + 1);
              return rendered ? <View key={i}>{rendered}</View> : null;
            })}
          </View>
        );
      }

      // Try extracting text from each
      const texts = objs.map(extractDisplayText);
      if (texts.every((t) => t !== null)) {
        return (
          <PDFCard label={label}>
            <PDFBulletList items={texts as string[]} />
          </PDFCard>
        );
      }

      // Extract titles + text for rich objects
      const richItems: React.ReactElement[] = [];
      for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        const title = extractTitle(obj);
        const text = extractDisplayText(obj);
        const score = typeof obj.score === "number" ? obj.score : null;

        if (title || text) {
          richItems.push(
            <PDFCard key={i} title={title ? `${title}${score != null ? ` — ${score}` : ""}` : null}>
              {text && <Text style={styles.body}>{text}</Text>}
              {/* Render nested arrays/objects */}
              {Object.entries(obj).map(([k, v]) => {
                if (SKIP_KEYS.has(k) || TITLE_KEYS.has(k) || TEXT_KEYS.has(k)) return null;
                if (k === "score" || k === "level" || k === "color") return null;
                const sub = deepRenderValue(v, formatLabel(k), d + 1);
                return sub ? <View key={k} style={{ marginTop: 4 }}>{sub}</View> : null;
              })}
            </PDFCard>
          );
        } else {
          // Fallback: recurse into the object
          const sub = deepRenderValue(obj, undefined, d + 1);
          if (sub) richItems.push(<View key={i}>{sub}</View>);
        }
      }
      return richItems.length > 0 ? <View>{richItems}</View> : null;
    }

    return null;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (Object.keys(obj).length === 0) return null;

    // Strengths/weaknesses
    if (Array.isArray(obj.strengths) && Array.isArray(obj.weaknesses)) {
      const title = extractTitle(obj);
      return (
        <View>
          {title && <Text style={[styles.cardTitle, { marginBottom: 4 }]}>{title}</Text>}
          <PDFStrengthsWeaknesses
            strengths={obj.strengths as unknown[]}
            weaknesses={obj.weaknesses as unknown[]}
          />
          {typeof obj.whatToDo === "string" && (
            <Text style={[styles.body, { fontStyle: "italic" }]}>{(obj.whatToDo as string).replace(/ — /g, ': ').replace(/—/g, ': ')}</Text>
          )}
        </View>
      );
    }

    // General object: extract title, texts, then recurse into children
    const title = extractTitle(obj);
    const score = typeof obj.score === "number" || typeof obj.score === "string" ? obj.score : null;
    const texts: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      if (TEXT_KEYS.has(k) && typeof v === "string" && v.length > 5) texts.push(v);
    }

    const children: React.ReactElement[] = [];
    for (const [k, v] of Object.entries(obj)) {
      if (SKIP_KEYS.has(k) || TITLE_KEYS.has(k) || TEXT_KEYS.has(k)) continue;
      if (k === "score" || k === "level" || k === "color") continue;
      const sub = deepRenderValue(v, formatLabel(k), d + 1);
      if (sub) children.push(<View key={k} style={{ marginTop: 4 }}>{sub}</View>);
    }

    const hasContent = title || texts.length > 0 || children.length > 0;
    if (!hasContent) return null;

    // At top level (d=0), render as a card; deeper, render inline
    if (d < 2 && (title || texts.length > 0)) {
      return (
        <PDFCard title={title ? `${title}${score != null ? ` — ${score}` : ""}` : null} label={!title ? label : null}>
          {texts.map((t, i) => (
            <Text key={i} style={styles.body}>{t}</Text>
          ))}
          {children}
        </PDFCard>
      );
    }

    return (
      <View>
        {label && <Text style={styles.cardLabel}>{label}</Text>}
        {title && <Text style={[styles.cardTitle, { marginBottom: 2 }]}>{title}{score != null ? ` — ${score}` : ""}</Text>}
        {texts.map((t, i) => (
          <Text key={i} style={styles.body}>{t}</Text>
        ))}
        {children}
      </View>
    );
  }

  return null;
}

function renderSectionContent(data: Record<string, unknown>): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  const hasNarrative = typeof data.narrative === "string" && data.narrative.length > 0;

  // Narrative first — render as flowing paragraphs
  if (hasNarrative) {
    const paragraphs = (data.narrative as string).split('\n\n').filter(p => p.trim().length > 0);
    for (let i = 0; i < paragraphs.length; i++) {
      elements.push(
        <Text key={`narrative-${i}`} style={[styles.body, { marginBottom: 6 }]}>
          {paragraphs[i].replace(/ — /g, ': ').replace(/—/g, ': ')}
        </Text>
      );
    }
    if (paragraphs.length > 0) {
      elements.push(<View key="narrative-divider" style={{ marginBottom: 6 }} />);
    }
  }

  // Then structured content — skip narrative keys and SKIP_KEYS
  for (const [key, value] of Object.entries(data)) {
    if (SKIP_KEYS.has(key)) continue;
    if (hasNarrative && NARRATIVE_KEYS.has(key)) continue;

    const rendered = deepRenderValue(value, formatLabel(key), 0);
    if (rendered) {
      elements.push(<View key={key}>{rendered}</View>);
    }
  }

  return elements;
}

// ─── Section definitions ─────────────────────────────────────────────────────

// Complete mode: 9 focused narrative sections (matches web)
const COMPLETE_SECTION_ORDER = [
  { key: "executiveSummary", title: "Executive Summary" },
  { key: "deepDive", title: "Your Personality" },
  { key: "learning", title: "How You Learn" },
  { key: "study", title: "Study Strategies & Exam Preparation" },
  { key: "strengths", title: "Strengths & Growth Areas" },
  { key: "barriers", title: "Barriers to Learning" },
  { key: "actionPlan", title: "Your Action Plan" },
  { key: "unifiedGuide", title: "Guide for Teachers, Parents & Tutors" },
];

// Personality-only / learning-only fallback
const STANDALONE_SECTION_ORDER = [
  { key: "glance", title: "Personality at a Glance" },
  { key: "deepDive", title: "Deep Dive" },
  { key: "learning", title: "Learning Style" },
  { key: "drives", title: "Drives & Motivation" },
  { key: "study", title: "Study Approach" },
  { key: "group", title: "Group Work" },
  { key: "strengths", title: "Strengths & Growth" },
  { key: "guide", title: "Tutor's Guide" },
  { key: "tutor", title: "Parent & Tutor Tips" },
  { key: "studyProfile", title: "Study Profile" },
  { key: "academicCharacter", title: "Academic Character" },
  { key: "subjectFit", title: "Subject Fit" },
  { key: "whatWorks", title: "What Works" },
  { key: "rootCause", title: "Root Cause Analysis" },
  { key: "academicGuide", title: "Academic Guide" },
];

// ─── Main Document ───────────────────────────────────────────────────────────

interface ReportPDFProps {
  name: string;
  results: TestResults;
  report: Record<string, unknown>;
}

function ReportPDFDocument({ name, results, report }: ReportPDFProps) {
  const date = new Date().toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasComplete = report.hasComplete;
  const sectionOrder = hasComplete ? COMPLETE_SECTION_ORDER : STANDALONE_SECTION_ORDER;
  const activeSections = sectionOrder.filter(
    (s) => report[s.key] && typeof report[s.key] === "object"
  );

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverEyebrow}>Academic Profile Report</Text>
        <Text style={styles.coverTitle}>{name || "Student"}</Text>
        <Text style={styles.coverDate}>{date}</Text>

        {results.dimensions && typeof results.dimensions === "object" && (
          <View style={styles.coverScores}>
            {Object.values(results.dimensions as unknown as Record<string, { name: string; score: number }>).map((dim) => (
              <View key={dim.name} style={styles.coverScoreCard}>
                <Text style={styles.coverScoreName}>
                  {dim.name.replace(" to Experience", "").split("-")[0]}
                </Text>
                <Text style={[styles.coverScoreValue, { color: DIM_COLORS[dim.name] || ESPRESSO }]}>
                  {dim.score.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>AcademicProfile — HEXACO-PI-R Assessment</Text>
          <Text>{date}</Text>
        </View>
      </Page>

      {/* Content: each section gets its own page for clean breaks */}
      {activeSections.map((sectionDef) => {
        const data = report[sectionDef.key] as Record<string, unknown>;
        if (!data) return null;

        const contentElements = renderSectionContent(data);
        if (contentElements.length === 0) return null;

        return (
          <Page key={sectionDef.key} size="A4" style={styles.page} wrap>
            {/* Section header */}
            <View style={styles.sectionHeader} wrap={false} minPresenceAhead={80}>
              <Text style={styles.sectionTitle}>{sectionDef.title}</Text>
            </View>

            {/* Section content */}
            {contentElements}

            <View style={styles.footer} fixed>
              <Text>{name} — Academic Profile</Text>
              <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export async function downloadReportPDF(
  name: string,
  results: TestResults,
  report: Record<string, unknown>
) {
  const blob = await pdf(
    <ReportPDFDocument name={name} results={results} report={report} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "-")}-learning-profile.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { ReportPDFDocument };
