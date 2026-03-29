"use client";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import type { TestResults } from "@/lib/types";
import { PDFRadarChart } from "./PDFRadarChart";
import { PDFActionSheet } from "./PDFActionSheet";
import { PDFTableOfContents } from "./PDFTableOfContents";
import { scorePercentile, interpretiveLabel, POPULATION_MEAN } from "@/lib/report/helpers";
import { generateMegaReport, type MegaReport, type MegaSection } from "@/lib/report";

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
    paddingTop: 80,
    fontFamily: "Helvetica",
    backgroundColor: CREAM,
    alignItems: "center",
  },
  coverEyebrow: {
    fontSize: 8,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 14,
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 6,
  },
  coverDate: {
    fontSize: 9,
    color: WARM_GRAY,
    marginBottom: 6,
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
    marginBottom: 24,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: WARM_GRAY,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ESPRESSO,
    marginBottom: 8,
  },
  sectionRule: {
    width: 40,
    height: 3,
    backgroundColor: ESPRESSO,
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
  },
  footerRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#e8e0d4",
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 8,
    color: "#8b7355",
  },
  footerCenter: {
    fontSize: 8,
    color: "#8b7355",
    fontStyle: "italic",
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
  "key", "icon", "color", "rawScore", "classification", "rank", "role", "interpretLabel",
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

function PDFScoreBar({ score, maxScore = 5, color = ESPRESSO, showBenchmark = false, label }: {
  score: number; maxScore?: number; color?: string; showBenchmark?: boolean; label?: string;
}) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const benchPct = (POPULATION_MEAN / maxScore) * 100;
  return (
    <View style={{ marginTop: 4, marginBottom: label ? 2 : 0 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: "#e8e0d4", position: "relative" as const }}>
          <View style={{ position: "absolute" as const, left: 0, top: 0, bottom: 0, borderRadius: 2, width: `${pct}%`, backgroundColor: color }} />
          {showBenchmark && (
            <View style={{ position: "absolute" as const, left: `${benchPct}%`, top: -1, width: 0.5, height: 6, backgroundColor: WARM_GRAY }} />
          )}
        </View>
        <Text style={{ fontSize: 7, fontWeight: "bold", color: ESPRESSO, minWidth: 16, textAlign: "right" as const }}>{score.toFixed(1)}</Text>
      </View>
      {label && <Text style={{ fontSize: 6, color: WARM_GRAY, marginTop: 1 }}>{label}</Text>}
    </View>
  );
}

// ─── PDF Polish Helpers ───────────────────────────────────────────────────────

function PDFCallout({ text, color = WARM_GRAY, title }: { text: string; color?: string; title?: string }) {
  return (
    <View style={{ flexDirection: "row" as const, marginBottom: 8 }}>
      <View style={{ width: 3, backgroundColor: color, borderRadius: 1, marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        {title && <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO, marginBottom: 2 }}>{title}</Text>}
        <Text style={{ fontSize: 9, lineHeight: 1.4, color: "#4a3f2f" }}>{text}</Text>
      </View>
    </View>
  );
}

function PDFTwoColumn({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row" as const, gap: 10, marginBottom: 8 }}>
      <View style={{ flex: 1, minWidth: 0 }}>{left}</View>
      <View style={{ flex: 1, minWidth: 0 }}>{right}</View>
    </View>
  );
}

function PDFSubheading({ text }: { text: string }) {
  return (
    <View style={{ marginTop: 14, marginBottom: 10 }}>
      <Text style={{ fontSize: 12, fontWeight: "bold", color: ESPRESSO }}>{text}</Text>
      <View style={{ width: 24, height: 2, backgroundColor: ESPRESSO, marginTop: 3 }} />
    </View>
  );
}

// ─── Section-Specific Renderers ──────────────────────────────────────────────

function renderExecSummary(data: Record<string, unknown>): React.ReactElement[] {
  const archetype = typeof data.archetype === "string" ? data.archetype : null;
  const narrative = typeof data.narrative === "string" ? data.narrative : null;
  const topStrength = data.topStrength as { insight?: string; personality?: string; academic?: string } | null;
  const topBarrier = data.topBarrier as { insight?: string; personality?: string; academic?: string; action?: string } | null;
  const topAction = typeof data.topAction === "string" ? data.topAction : null;

  const elements: React.ReactElement[] = [];

  if (archetype) {
    elements.push(
      <Text key="arch" style={{ fontSize: 12, color: WARM_GRAY, fontStyle: "italic", textAlign: "center" as const, marginBottom: 12 }}>
        {archetype}
      </Text>
    );
  }

  if (narrative) {
    narrative.split(/\n\n|\.\s+(?=[A-Z])/).filter(Boolean).forEach((para, i) => {
      const text = para.trim().endsWith(".") ? para.trim() : para.trim() + ".";
      elements.push(<Text key={`n${i}`} style={styles.body}>{text}</Text>);
    });
  }

  if (topStrength || topBarrier) {
    elements.push(
      <PDFTwoColumn
        key="cols"
        left={topStrength ? (
          <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#22c55e" }]}>
            <Text style={{ fontSize: 8, color: "#22c55e", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 4 }}>Top Strength</Text>
            <Text style={{ fontSize: 9, color: ESPRESSO, marginBottom: 3 }}>{topStrength.insight}</Text>
            {topStrength.personality && <Text style={{ fontSize: 7, color: WARM_GRAY }}>{topStrength.personality} + {topStrength.academic}</Text>}
          </View>
        ) : <View />}
        right={topBarrier ? (
          <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#f59e0b" }]}>
            <Text style={{ fontSize: 8, color: "#f59e0b", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 4 }}>Top Barrier</Text>
            <Text style={{ fontSize: 9, color: ESPRESSO, marginBottom: 3 }}>{topBarrier.insight}</Text>
            {topBarrier.action && <Text style={{ fontSize: 8, color: "#4a3f2f", fontStyle: "italic" }}>{topBarrier.action}</Text>}
          </View>
        ) : <View />}
      />
    );
  }

  if (topAction) {
    elements.push(<PDFCallout key="action" text={topAction} color="#3b82f6" title="Priority Action" />);
  }

  return elements;
}

function renderLearning(data: Record<string, unknown>): React.ReactElement[] {
  const narrative = typeof data.narrative === "string" ? data.narrative : null;
  const learningStyle = data.learningStyle as { primary?: { label?: string; description?: string }; secondary?: { label?: string; description?: string }; curiosity?: { label?: string; description?: string }; summary?: string } | null;
  const idealEnvironment = data.idealEnvironment as { category?: string; recommendation?: string[] }[] | null;
  const preferredFormats = data.preferredFormats as { format?: string; fit?: string; reason?: string }[] | null;
  const keyInsight = typeof data.keyInsight === "string" ? data.keyInsight : null;

  const elements: React.ReactElement[] = [];

  if (narrative) {
    narrative.split(/\n\n/).filter(Boolean).forEach((para, i) => {
      elements.push(<Text key={`n${i}`} style={styles.body}>{para.trim()}</Text>);
    });
  }

  if (learningStyle) {
    elements.push(
      <View key="ls" style={[styles.card, { marginTop: 4 }]}>
        <Text style={styles.cardTitle}>Learning Style</Text>
        {learningStyle.primary && (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 8, color: WARM_GRAY, textTransform: "uppercase" as const, letterSpacing: 1 }}>Primary</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO }}>{learningStyle.primary.label}</Text>
            {learningStyle.primary.description && <Text style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4 }}>{learningStyle.primary.description}</Text>}
          </View>
        )}
        {learningStyle.secondary && (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 8, color: WARM_GRAY, textTransform: "uppercase" as const, letterSpacing: 1 }}>Secondary</Text>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO }}>{learningStyle.secondary.label}</Text>
          </View>
        )}
        {learningStyle.summary && <Text style={{ fontSize: 8, color: "#4a3f2f", fontStyle: "italic", marginTop: 2 }}>{learningStyle.summary}</Text>}
      </View>
    );
  }

  if (Array.isArray(idealEnvironment) && idealEnvironment.length > 0) {
    elements.push(
      <View key="env">
        <PDFSubheading text="Ideal Environment" />
        <View style={{ flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 }}>
          {idealEnvironment.map((env, i) => (
            <View key={i} style={[styles.card, { width: "48%" }]}>
              <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO, marginBottom: 2 }}>{env.category}</Text>
              {Array.isArray(env.recommendation) && env.recommendation.map((r, j) => (
                <Text key={j} style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4 }}>{r}</Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (Array.isArray(preferredFormats) && preferredFormats.length > 0) {
    elements.push(
      <View key="formats" style={{ marginTop: 8 }}>
        <PDFSubheading text="Preferred Formats" />
        {preferredFormats.map((f, i) => (
          <View key={i} style={{ flexDirection: "row" as const, alignItems: "center" as const, marginBottom: 4, paddingBottom: 4, borderBottomWidth: i < preferredFormats.length - 1 ? 0.5 : 0, borderBottomColor: BORDER }}>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO, width: 80 }}>{f.format}</Text>
            <Text style={{ fontSize: 8, color: f.fit === "Excellent" ? "#22c55e" : "#3b82f6", width: 55 }}>{f.fit}</Text>
            <Text style={{ fontSize: 8, color: "#4a3f2f", flex: 1 }}>{f.reason}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (keyInsight) {
    elements.push(<PDFCallout key="insight" text={keyInsight} color="#8b5cf6" title="Key Insight" />);
  }

  return elements;
}

function renderStudy(data: Record<string, unknown>): React.ReactElement[] {
  const narrative = typeof data.narrative === "string" ? data.narrative : null;
  const studyApproach = data.studyApproach as { label?: string; description?: string } | null;
  const methods = data.methods as { name?: string; description?: string; fit?: string }[] | null;
  const subjectStrategies = data.subjectStrategies as Record<string, { label?: string; strategies?: string[] }> | null;
  const examPrep = data.examPrep as { timeline?: { week?: string; action?: string }[]; dayBefore?: string[]; dayOf?: string[] } | null;
  const timeManagement = data.timeManagement as { style?: string; description?: string; tools?: string[]; warning?: string } | null;
  const weeklyPlan = data.weeklyPlan as { weekdays?: { afterSchool?: string; evening?: string }; weekend?: { saturday?: string; sunday?: string } } | null;

  const elements: React.ReactElement[] = [];

  if (narrative) {
    narrative.split(/\n\n/).filter(Boolean).forEach((para, i) => {
      elements.push(<Text key={`n${i}`} style={styles.body}>{para.trim()}</Text>);
    });
  }

  if (studyApproach) {
    elements.push(
      <View key="approach" style={[styles.card, { marginTop: 4 }]}>
        <Text style={styles.cardTitle}>{studyApproach.label || "Study Approach"}</Text>
        {studyApproach.description && <Text style={{ fontSize: 9, color: "#4a3f2f", lineHeight: 1.5 }}>{studyApproach.description}</Text>}
      </View>
    );
  }

  if (Array.isArray(methods) && methods.length > 0) {
    elements.push(
      <View key="methods">
        <PDFSubheading text="Recommended Methods" />
        {methods.map((m, i) => (
          <View key={i} style={{ flexDirection: "row" as const, marginBottom: 4, paddingBottom: 4, borderBottomWidth: i < methods.length - 1 ? 0.5 : 0, borderBottomColor: BORDER }}>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO, width: 100 }}>{m.name}</Text>
            <Text style={{ fontSize: 8, color: m.fit === "Excellent" ? "#22c55e" : "#3b82f6", width: 50 }}>{m.fit}</Text>
            <Text style={{ fontSize: 8, color: "#4a3f2f", flex: 1 }}>{m.description}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (subjectStrategies && typeof subjectStrategies === "object") {
    const cats = Object.values(subjectStrategies).filter((v): v is { label?: string; strategies?: string[] } => !!v && typeof v === "object");
    if (cats.length > 0) {
      elements.push(
        <View key="subjects">
          <PDFSubheading text="Subject Strategies" />
          <View style={{ flexDirection: "row" as const, gap: 8 }}>
            {cats.map((cat, i) => (
              <View key={i} style={[styles.card, { flex: 1 }]}>
                <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO, marginBottom: 3 }}>{cat.label}</Text>
                {Array.isArray(cat.strategies) && cat.strategies.map((s, j) => (
                  <Text key={j} style={{ fontSize: 7, color: "#4a3f2f", lineHeight: 1.4, marginBottom: 1 }}>{s}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      );
    }
  }

  if (examPrep?.timeline && Array.isArray(examPrep.timeline)) {
    elements.push(
      <View key="timeline">
        <PDFSubheading text="Exam Preparation Timeline" />
        {examPrep.timeline.map((t, i) => (
          <View key={i} style={{ flexDirection: "row" as const, marginBottom: 3 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO, width: 55 }}>{t.week}</Text>
            <Text style={{ fontSize: 8, color: "#4a3f2f", flex: 1 }}>{t.action}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (timeManagement) {
    elements.push(
      <View key="tm" style={[styles.card, { marginTop: 8 }]}>
        <Text style={styles.cardTitle}>{timeManagement.style || "Time Management"}</Text>
        {timeManagement.description && <Text style={{ fontSize: 9, color: "#4a3f2f", lineHeight: 1.5, marginBottom: 4 }}>{timeManagement.description}</Text>}
        {timeManagement.warning && <PDFCallout text={timeManagement.warning} color="#f59e0b" title="Watch Out" />}
      </View>
    );
  }

  if (weeklyPlan) {
    elements.push(
      <View key="weekly" style={{ marginTop: 8 }}>
        <PDFSubheading text="Weekly Plan" />
        <PDFTwoColumn
          left={
            <View style={styles.card}>
              <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO, marginBottom: 3 }}>Weekdays</Text>
              {weeklyPlan.weekdays?.afterSchool && <Text style={{ fontSize: 8, color: "#4a3f2f", marginBottom: 2 }}>After school: {weeklyPlan.weekdays.afterSchool}</Text>}
              {weeklyPlan.weekdays?.evening && <Text style={{ fontSize: 8, color: "#4a3f2f" }}>Evening: {weeklyPlan.weekdays.evening}</Text>}
            </View>
          }
          right={
            <View style={styles.card}>
              <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO, marginBottom: 3 }}>Weekend</Text>
              {weeklyPlan.weekend?.saturday && <Text style={{ fontSize: 8, color: "#4a3f2f", marginBottom: 2 }}>Saturday: {weeklyPlan.weekend.saturday}</Text>}
              {weeklyPlan.weekend?.sunday && <Text style={{ fontSize: 8, color: "#4a3f2f" }}>Sunday: {weeklyPlan.weekend.sunday}</Text>}
            </View>
          }
        />
      </View>
    );
  }

  return elements;
}

function renderGuide(data: Record<string, unknown>): React.ReactElement[] {
  const teacher = data.teacher as Record<string, unknown> | null;
  const parent = data.parent as Record<string, unknown> | null;
  const sharedInsights = data.sharedInsights as { keyMessage?: string; alignmentTip?: string; reminderNote?: string } | null;

  const elements: React.ReactElement[] = [];

  if (teacher) {
    elements.push(<PDFSubheading key="th" text="For Teachers" />);

    const quickProfile = teacher.quickProfile as string[] | null;
    if (Array.isArray(quickProfile)) {
      elements.push(<PDFBulletList key="tp" items={quickProfile} />);
    }

    const feedbackStyle = teacher.feedbackStyle as { preferred?: string; description?: string; avoid?: string } | null;
    if (feedbackStyle) {
      elements.push(
        <View key="fb" style={[styles.card, { marginTop: 4 }]}>
          <Text style={styles.cardTitle}>Feedback Style</Text>
          {feedbackStyle.preferred && <Text style={{ fontSize: 9, color: "#22c55e", marginBottom: 2 }}>Preferred: {feedbackStyle.preferred}</Text>}
          {feedbackStyle.description && <Text style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4, marginBottom: 3 }}>{feedbackStyle.description}</Text>}
          {feedbackStyle.avoid && <Text style={{ fontSize: 8, color: "#ef4444" }}>Avoid: {feedbackStyle.avoid}</Text>}
        </View>
      );
    }

    const classroomTips = teacher.classroomTips as string[] | null;
    if (Array.isArray(classroomTips)) {
      elements.push(
        <View key="ct" style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO, marginBottom: 3 }}>Classroom Tips</Text>
          <PDFBulletList items={classroomTips} />
        </View>
      );
    }

    const warningSignals = teacher.warningSignals as { signal?: string; meaning?: string; action?: string }[] | null;
    if (Array.isArray(warningSignals)) {
      warningSignals.forEach((w, i) => {
        elements.push(
          <PDFCallout key={`tw${i}`} text={`${w.meaning || ""} ${w.action || ""}`} color="#f59e0b" title={w.signal} />
        );
      });
    }
  }

  if (parent) {
    elements.push(<PDFSubheading key="ph" text="For Parents" />);

    const understandingProfile = typeof parent.understandingProfile === "string" ? parent.understandingProfile : null;
    if (understandingProfile) {
      elements.push(<Text key="up" style={styles.body}>{understandingProfile}</Text>);
    }

    const homeEnvironment = parent.homeEnvironment as { area?: string; tip?: string }[] | null;
    if (Array.isArray(homeEnvironment)) {
      elements.push(
        <View key="he" style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO, marginBottom: 3 }}>Home Environment</Text>
          <PDFBulletList items={homeEnvironment.map(h => `${h.area}: ${h.tip}`)} />
        </View>
      );
    }

    const supportStrategies = parent.supportStrategies as { area?: string; dos?: string[]; donts?: string[] }[] | null;
    if (Array.isArray(supportStrategies)) {
      supportStrategies.forEach((s, i) => {
        elements.push(
          <View key={`ss${i}`} style={[styles.card, { marginTop: 4 }]}>
            <Text style={styles.cardTitle}>{s.area}</Text>
            <PDFTwoColumn
              left={
                <View>
                  <Text style={{ fontSize: 8, color: "#22c55e", fontWeight: "bold", marginBottom: 2 }}>Do</Text>
                  {Array.isArray(s.dos) && s.dos.map((d, j) => <Text key={j} style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4, marginBottom: 1 }}>{d}</Text>)}
                </View>
              }
              right={
                <View>
                  <Text style={{ fontSize: 8, color: "#ef4444", fontWeight: "bold", marginBottom: 2 }}>Don&apos;t</Text>
                  {Array.isArray(s.donts) && s.donts.map((d, j) => <Text key={j} style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4, marginBottom: 1 }}>{d}</Text>)}
                </View>
              }
            />
          </View>
        );
      });
    }

    const warningSignals = parent.warningSignals as { signal?: string; action?: string }[] | null;
    if (Array.isArray(warningSignals)) {
      warningSignals.forEach((w, i) => {
        elements.push(
          <PDFCallout key={`pw${i}`} text={w.action || ""} color="#f59e0b" title={w.signal} />
        );
      });
    }
  }

  if (sharedInsights) {
    elements.push(<PDFSubheading key="sh" text="Shared Insights" />);
    if (sharedInsights.keyMessage) elements.push(<PDFCallout key="km" text={sharedInsights.keyMessage} color="#3b82f6" title="Key Message" />);
    if (sharedInsights.alignmentTip) elements.push(<PDFCallout key="at" text={sharedInsights.alignmentTip} color={WARM_GRAY} title="Alignment" />);
    if (sharedInsights.reminderNote) elements.push(<Text key="rn" style={[styles.body, { fontStyle: "italic" }]}>{sharedInsights.reminderNote}</Text>);
  }

  return elements;
}

// ─── End Section-Specific Renderers ──────────────────────────────────────────

function renderDeepDive(data: Record<string, unknown>): React.ReactElement[] {
  const narrative = typeof data.narrative === "string" ? data.narrative : null;
  const dimensions = data.dimensions as {
    key?: string; name?: string; shortName?: string; score?: string; rawScore?: number;
    level?: string; interpretLabel?: string; color?: string; insight?: string;
    facetInsights?: ({ name?: string; level?: string; text?: string } | null)[];
    learningCallout?: { title?: string; text?: string };
  }[] | null;

  const elements: React.ReactElement[] = [];

  if (narrative) {
    narrative.split(/\n\n/).filter(Boolean).forEach((para, i) => {
      elements.push(<Text key={`n${i}`} style={styles.body}>{para.trim()}</Text>);
    });
  }

  if (Array.isArray(dimensions)) {
    dimensions.forEach((dim, i) => {
      elements.push(
        <View key={`d${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: dim.color || ESPRESSO }]}>
          <View style={{ flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const, marginBottom: 4 }}>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: dim.color || ESPRESSO }}>{dim.name}</Text>
            <Text style={{ fontSize: 9, color: WARM_GRAY }}>{dim.score}/5 — {dim.level}</Text>
          </View>
          {dim.rawScore != null && dim.color && (
            <PDFScoreBar score={dim.rawScore} color={dim.color} showBenchmark label={dim.interpretLabel} />
          )}
          {dim.insight && <Text style={[styles.body, { marginTop: 4 }]}>{dim.insight}</Text>}
          {Array.isArray(dim.facetInsights) && dim.facetInsights.filter(Boolean).length > 0 && (
            <View style={{ marginTop: 4 }}>
              {dim.facetInsights.filter(Boolean).map((f, j) => f && (
                <View key={j} style={{ marginBottom: 3 }}>
                  <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO }}>{f.name} ({f.level})</Text>
                  {f.text && <Text style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4 }}>{f.text}</Text>}
                </View>
              ))}
            </View>
          )}
          {dim.learningCallout?.text && (
            <PDFCallout text={dim.learningCallout.text} color={dim.color || WARM_GRAY} title={dim.learningCallout.title} />
          )}
        </View>
      );
    });
  }

  return elements;
}

function renderStrengths(data: Record<string, unknown>): React.ReactElement[] {
  const narrative = typeof data.narrative === "string" ? data.narrative : null;
  const dimensions = data.dimensions as {
    key?: string; name?: string; shortName?: string; color?: string; score?: string;
    strengths?: { name?: string; score?: string; rawScore?: number; interpretLabel?: string; analysis?: string; leverageTip?: string }[];
    weaknesses?: { name?: string; score?: string; rawScore?: number; interpretLabel?: string; challenge?: string; actionTip?: string }[];
    whatToDo?: string;
  }[] | null;
  const growthMindset = data.growthMindset as { message?: string; keyPrinciple?: string; actionStep?: string } | null;

  const elements: React.ReactElement[] = [];

  if (narrative) {
    narrative.split(/\n\n/).filter(Boolean).forEach((para, i) => {
      elements.push(<Text key={`n${i}`} style={styles.body}>{para.trim()}</Text>);
    });
  }

  if (Array.isArray(dimensions)) {
    dimensions.forEach((dim, i) => {
      const hasContent = (dim.strengths && dim.strengths.length > 0) || (dim.weaknesses && dim.weaknesses.length > 0);
      if (!hasContent) return;

      elements.push(
        <View key={`d${i}`} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: dim.color || ESPRESSO, marginBottom: 4 }}>{dim.name}</Text>
          <PDFTwoColumn
            left={
              <View>
                <Text style={{ fontSize: 8, color: "#22c55e", fontWeight: "bold", marginBottom: 3 }}>Strengths</Text>
                {(dim.strengths || []).map((s, j) => (
                  <View key={j} style={{ marginBottom: 3 }}>
                    <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO }}>{s.name} ({s.score})</Text>
                    {s.analysis && <Text style={{ fontSize: 7, color: "#4a3f2f", lineHeight: 1.4 }}>{s.analysis}</Text>}
                  </View>
                ))}
              </View>
            }
            right={
              <View>
                <Text style={{ fontSize: 8, color: "#f59e0b", fontWeight: "bold", marginBottom: 3 }}>Growth Areas</Text>
                {(dim.weaknesses || []).map((w, j) => (
                  <View key={j} style={{ marginBottom: 3 }}>
                    <Text style={{ fontSize: 8, fontWeight: "bold", color: ESPRESSO }}>{w.name} ({w.score})</Text>
                    {w.challenge && <Text style={{ fontSize: 7, color: "#4a3f2f", lineHeight: 1.4 }}>{w.challenge}</Text>}
                  </View>
                ))}
              </View>
            }
          />
          {dim.whatToDo && <PDFCallout text={dim.whatToDo} color={dim.color || WARM_GRAY} title="What to focus on" />}
        </View>
      );
    });
  }

  if (growthMindset) {
    const gmText = [growthMindset.message, growthMindset.keyPrinciple, growthMindset.actionStep].filter(Boolean).join(" ");
    if (gmText) elements.push(<PDFCallout key="gm" text={gmText} color="#22c55e" title="Growth Mindset" />);
  }

  return elements;
}

function renderBarriers(data: Record<string, unknown>): React.ReactElement[] {
  const narrative = typeof data.narrative === "string" ? data.narrative : null;
  const rootCauseChains = data.rootCauseChains as { personalityRoot?: string; academicSymptom?: string; visibleBehaviour?: string; description?: string; impact?: number }[] | null;
  const cycles = data.cycles as { title?: string; narrative?: string }[] | null;
  const misdiagnoses = data.misdiagnoses as { misconception?: string; realCause?: string; description?: string }[] | null;
  const priorityRanking = data.priorityRanking as { rank?: number; barrier?: string }[] | null;
  const fallbackMessage = typeof data.fallbackMessage === "string" ? data.fallbackMessage : null;

  const elements: React.ReactElement[] = [];

  if (narrative) {
    narrative.split(/\n\n/).filter(Boolean).forEach((para, i) => {
      elements.push(<Text key={`n${i}`} style={styles.body}>{para.trim()}</Text>);
    });
  }

  if (fallbackMessage && (!rootCauseChains || rootCauseChains.length === 0)) {
    elements.push(<PDFCallout key="fb" text={fallbackMessage} color="#22c55e" title="Good News" />);
    return elements;
  }

  if (Array.isArray(rootCauseChains) && rootCauseChains.length > 0) {
    elements.push(<PDFSubheading key="rch" text="Root Cause Analysis" />);
    rootCauseChains.forEach((rc, i) => {
      elements.push(
        <View key={`rc${i}`} style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#f59e0b" }]}>
          <View style={{ marginBottom: 3 }}>
            <Text style={{ fontSize: 8, color: "#f59e0b", fontWeight: "bold" }}>Personality: {rc.personalityRoot}</Text>
            <Text style={{ fontSize: 7, color: WARM_GRAY, marginVertical: 1 }}>  ↓</Text>
            <Text style={{ fontSize: 8, color: "#ef4444", fontWeight: "bold" }}>Symptom: {rc.academicSymptom}</Text>
          </View>
          {rc.visibleBehaviour && <Text style={{ fontSize: 8, color: WARM_GRAY, marginBottom: 2 }}>Visible: {rc.visibleBehaviour}</Text>}
          {rc.description && <Text style={{ fontSize: 8, color: "#4a3f2f", lineHeight: 1.4 }}>{rc.description}</Text>}
        </View>
      );
    });
  }

  if (Array.isArray(misdiagnoses) && misdiagnoses.length > 0) {
    elements.push(<PDFSubheading key="mh" text="Common Misdiagnoses" />);
    misdiagnoses.forEach((m, i) => {
      elements.push(
        <PDFTwoColumn key={`m${i}`}
          left={
            <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#ef4444" }]}>
              <Text style={{ fontSize: 8, color: "#ef4444", fontWeight: "bold", marginBottom: 2 }}>Looks Like</Text>
              <Text style={{ fontSize: 9, color: ESPRESSO }}>{m.misconception}</Text>
            </View>
          }
          right={
            <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: "#22c55e" }]}>
              <Text style={{ fontSize: 8, color: "#22c55e", fontWeight: "bold", marginBottom: 2 }}>Actually Is</Text>
              <Text style={{ fontSize: 9, color: ESPRESSO }}>{m.realCause}</Text>
            </View>
          }
        />
      );
    });
  }

  if (Array.isArray(cycles) && cycles.length > 0) {
    elements.push(<PDFSubheading key="cyh" text="Patterns to Watch" />);
    cycles.forEach((c, i) => {
      elements.push(<PDFCallout key={`cy${i}`} text={c.narrative || ""} color="#f59e0b" title={c.title} />);
    });
  }

  if (Array.isArray(priorityRanking) && priorityRanking.length > 0) {
    elements.push(<PDFSubheading key="prh" text="Priority Order" />);
    priorityRanking.forEach((p, i) => {
      elements.push(
        <View key={`pr${i}`} style={{ flexDirection: "row" as const, marginBottom: 3 }}>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: ESPRESSO, width: 20 }}>#{p.rank}</Text>
          <Text style={{ fontSize: 9, color: "#4a3f2f", flex: 1 }}>{p.barrier}</Text>
        </View>
      );
    });
  }

  return elements;
}

const CUSTOM_SECTION_RENDERERS: Record<string, (data: Record<string, unknown>) => React.ReactElement[]> = {
  executiveSummary: renderExecSummary,
  learning: renderLearning,
  study: renderStudy,
  guide: renderGuide,
  unifiedGuide: renderGuide,
  deepDive: renderDeepDive,
  strengths: renderStrengths,
  barriers: renderBarriers,
};

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
  const rawScore = typeof data.rawScore === "number" ? data.rawScore : null;
  const objColor = typeof data.color === "string" ? data.color : undefined;
  const objInterpLabel = typeof data.interpretLabel === "string" ? data.interpretLabel : undefined;

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
      {rawScore != null && objColor && (
        <PDFScoreBar score={rawScore} color={objColor} showBenchmark label={objInterpLabel} />
      )}
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

function MegaSectionContent({ section }: { section: MegaSection }) {
  const elements: React.ReactElement[] = [];

  // Try custom renderers for rawData keys
  if (section.rawData) {
    for (const [key, data] of Object.entries(section.rawData)) {
      if (data && typeof data === 'object' && CUSTOM_SECTION_RENDERERS[key]) {
        elements.push(...CUSTOM_SECTION_RENDERERS[key](data as Record<string, unknown>));
      }
    }
  }

  // If custom renderers produced content, use that
  if (elements.length > 0) return <>{elements}</>;

  // Fallback: render mega-section structured content + rawData via generic renderer
  const fallback: React.ReactElement[] = [];

  // Narratives
  section.content.narrative.forEach((para, i) => {
    fallback.push(<Text key={`n${i}`} style={[styles.body, { marginBottom: 6 }]}>{para}</Text>);
  });

  // Findings as callouts
  section.content.keyFindings.forEach((f, i) => {
    fallback.push(<PDFCallout key={`f${i}`} text={f.text} title={f.title} color={f.color || WARM_GRAY} />);
  });

  // Actions as callouts
  section.content.actions.forEach((a, i) => {
    fallback.push(<PDFCallout key={`a${i}`} text={a.description} title={a.title} color="#3b82f6" />);
  });

  // Generic rawData rendering for sections without custom renderers
  if (section.rawData) {
    for (const [key, data] of Object.entries(section.rawData)) {
      if (!data || typeof data !== 'object' || CUSTOM_SECTION_RENDERERS[key]) continue;
      const rendered = renderSectionContent(data as Record<string, unknown>);
      fallback.push(...rendered.map((el, i) => <View key={`${key}-${i}`}>{el}</View>));
    }
  }

  return <>{fallback}</>;
}

function ReportPDFDocument({ name, results, report }: ReportPDFProps) {
  const mega = generateMegaReport(results, name);
  const date = mega.date;
  const coverData = report.cover as Record<string, unknown> | null;

  // Filter to sections with content (skip appendix if empty)
  const contentSections = mega.sections.filter(s => s.id !== 'cover-summary');

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverEyebrow}>Your Learning Profile</Text>
        <Text style={styles.coverTitle}>{name || "Student"}</Text>
        <Text style={styles.coverDate}>{date}</Text>
        <View style={{ width: 60, height: 2, backgroundColor: ESPRESSO, marginBottom: 20, marginTop: 4 }} />

        {mega.archetype ? (
          <Text style={{ fontSize: 13, color: WARM_GRAY, fontStyle: 'italic', letterSpacing: 0.8, textAlign: 'center' as const, marginBottom: 12 }}>
            {mega.archetype}
          </Text>
        ) : null}

        {Array.isArray(coverData?.radarData) ? (
          <View style={{ alignItems: 'center' as const, marginBottom: 16 }}>
            <PDFRadarChart data={coverData.radarData as { label: string; value: number; color: string }[]} size={160} />
          </View>
        ) : null}

        {mega.scoreSummary.length > 0 && (
          <View style={styles.coverScores}>
            {mega.scoreSummary.map((s) => (
              <View key={s.dim} style={[styles.coverScoreCard, { minWidth: 90 }]}>
                <Text style={styles.coverScoreName}>
                  {s.dim.replace(" to Experience", "").split("-")[0]}
                </Text>
                <Text style={[styles.coverScoreValue, { color: s.color }]}>
                  {s.score.toFixed(1)}
                </Text>
                <PDFScoreBar score={s.score} color={s.color} showBenchmark label={s.label} />
                <Text style={{ fontSize: 6, color: WARM_GRAY, marginTop: 2 }}>
                  Top {100 - s.percentile}%
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.footerRule} />
          <View style={styles.footerRow}>
            <Text>AcademicProfile</Text>
            <Text style={styles.footerCenter}>HEXACO-PI-R Assessment</Text>
            <Text>{date}</Text>
          </View>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <PDFTableOfContents
          sections={contentSections.map((s, i) => ({
            number: String(i + 1).padStart(2, "0"),
            title: s.subtitle ? `${s.title}: ${s.subtitle}` : s.title,
          }))}
        />
        <View style={styles.footer} fixed>
          <View style={styles.footerRule} />
          <View style={styles.footerRow}>
            <Text>{name}</Text>
            <Text style={styles.footerCenter}>Contents</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </View>
      </Page>

      {/* Content: each mega-section gets its own page */}
      {contentSections.map((section, sectionIndex) => {
        // Action plan gets special treatment
        if (section.id === 'action-plan' && section.rawData?.actionPlan) {
          return (
            <Page key={section.id} size="A4" style={styles.page} wrap={false}>
              <PDFActionSheet data={section.rawData.actionPlan as any} studentName={name || "Student"} />
              <View style={styles.footer} fixed>
                <Text>{name} — Academic Profile</Text>
                <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
              </View>
            </Page>
          );
        }

        return (
          <Page key={section.id} size="A4" style={styles.page} wrap>
            <View style={styles.sectionHeader} wrap={false} minPresenceAhead={80}>
              <Text style={styles.sectionEyebrow}>Section {String(sectionIndex + 1).padStart(2, "0")}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.subtitle && <Text style={{ fontSize: 11, color: WARM_GRAY, marginBottom: 8 }}>{section.subtitle}</Text>}
              <View style={styles.sectionRule} />
            </View>

            <MegaSectionContent section={section} />

            <View style={styles.footer} fixed>
              <View style={styles.footerRule} />
              <View style={styles.footerRow}>
                <Text>{name}</Text>
                <Text style={styles.footerCenter}>{section.title}</Text>
                <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              </View>
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
