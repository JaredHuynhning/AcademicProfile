// ─── Field classification helpers ────────────────────────────────────────────

// Keys that are internal metadata — never render
export const SKIP_KEYS = new Set([
  "key", "icon", "color", "rawScore", "classification", "rank", "role", "interpretLabel",
  "shortName", "radarData", "personalityArchetype", "passionClassification", "confidenceClassification",
  "matchPercent", "match_score", "dualFire", "type", "impact", "profile",
  "percentile", "structureScore", "warmthScore", "carrotScore", "stickScore",
  "barrier", "sdi", "item_count", "dim", "name", "date",
  // Section-structural keys (lookup keys whose content is in companion objects)
  "dominantApproach", "motivationProfile", "regulationStrength",
  "approaches", "motivationScores", "scores", "quizMode",
  // Cross-reference internal fields
  "personalityRoot", "personalityScore", "academicSymptom", "academicScore",
  "visibleBehaviour", "id", "looksLike", "actuallyIs", "urgency",
  "alignment", "passion", "confidence", "weight", "evidence",
  "dimKey", "facetKey", "source", "audience", "dualFireNote",
  "personality", "academic", "misdiagnosis", "fit",
]);

// Keys whose values are titles/names to display prominently
export const TITLE_KEYS = new Set(["name", "title", "label", "style", "preferred", "metric", "format", "category", "tip"]);

// Keys whose values are short text to display as body content
export const TEXT_KEYS = new Set([
  "text", "description", "desc", "narrative", "details", "summary", "explanation",
  "message", "keyPrinciple", "actionStep", "approach", "idealFor", "bestWhen",
  "notIdeal", "tutorTip", "strategy", "challenge", "analysis",
  "leverageTip", "actionTip", "whatToDo", "understandingProfile",
  "alignmentLabel", "passionTip", "confidenceTip", "fallbackMessage",
  "oneMinuteBrief", "insight", "question", "misconception", "realCause",
  "cycle", "fallbackMessage", "method", "rationale", "action",
]);

export function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/** Title-case only short enum-like values (e.g. "very_high" → "Very High"). Leave sentences alone. */
export function formatLevel(val: string): string {
  if (val.length > 30 || val.includes(".") || val.includes(",")) return val;
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Extract the best displayable text from an object */
export function extractDisplayText(obj: Record<string, unknown> | null | undefined): string | null {
  if (!obj) return null;
  for (const key of TEXT_KEYS) {
    if (typeof obj[key] === "string" && (obj[key] as string).length > 0) {
      return obj[key] as string;
    }
  }
  return null;
}

/** Extract the title from an object — only short titles, not full sentences */
export function extractTitle(obj: Record<string, unknown> | null | undefined): string | null {
  if (!obj) return null;
  for (const key of TITLE_KEYS) {
    if (typeof obj[key] === "string" && (obj[key] as string).length > 0) {
      const val = obj[key] as string;
      // Skip long sentences used as titles — they should be body text
      if (val.length > 60) return null;
      return val;
    }
  }
  return null;
}

/** Clean em dashes and tidy text for display */
export function clean(text: string): string {
  return text.replace(/ — /g, ": ").replace(/—/g, ": ").replace(/ – /g, ": ");
}

/** Check if a string is a real sentence vs a technical label */
export function isSentence(text: string): boolean {
  return text.length > 25 && text.includes(" ");
}

/** Check if a string is a technical/internal label to skip */
export function isInternalLabel(text: string): boolean {
  if (text.length > 40) return false;
  // Skip camelCase identifiers, dimension codes, bare facet names
  if (/^[a-z]+[A-Z]/.test(text)) return true; // camelCase
  if (/^[A-Z]{1,2}$/.test(text)) return true; // single/double caps like "H", "XE"
  if (/^\d+(\.\d+)?$/.test(text)) return true; // bare numbers
  // Short strings without spaces that look like field names
  if (text.length < 20 && !text.includes(" ")) return true;
  return false;
}

// ─── Dimension interpretation helper ─────────────────────────────────────────

export function getDimensionInterpretation(key: string, score: number, name: string): string {
  const first = name.split(' ')[0] || 'This student';
  const interps: Record<string, Record<string, string>> = {
    H: {
      high: `${first} demonstrates strong integrity and fairness. They tend to be genuine in interactions, avoid manipulating others, and show little interest in status or material wealth. In academic settings, this translates to honest work habits and collaborative reliability.`,
      moderate: `${first} shows a balanced approach to fairness and social positioning. They can be cooperative while also recognising when to advocate for their own interests — a pragmatic blend that serves well in competitive academic environments.`,
      low: `${first} is strategic and competitive, comfortable with self-promotion and navigating social dynamics to achieve goals. In school, they may excel at networking and positioning themselves for opportunities, though they should ensure this drive doesn't compromise relationships.`,
    },
    E: {
      high: `${first} experiences emotions deeply and may be more sensitive to stress and uncertainty. They benefit from structured environments, clear expectations, and emotional support during high-pressure periods like exams.`,
      moderate: `${first} has a balanced emotional profile — responsive to feelings without being overwhelmed by them. They can handle moderate stress while still being attuned to the emotions of those around them.`,
      low: `${first} tends to stay calm under pressure and processes emotions independently. They handle academic stress well but may need encouragement to seek support when challenges feel overwhelming.`,
    },
    X: {
      high: `${first} thrives on social interaction and draws energy from group settings. They're likely to be vocal in class discussions, enjoy collaborative projects, and seek leadership roles. They may need to develop strategies for focused solo work.`,
      moderate: `${first} is comfortable in both social and solitary settings, adapting their energy to the situation. This flexibility is an asset — they can work well in groups and independently.`,
      low: `${first} prefers quiet, focused environments and may do their best thinking alone. They bring depth of thought to their work and should be given space to process before contributing in group settings.`,
    },
    A: {
      high: `${first} is patient, flexible, and cooperative — a natural mediator in group settings. They prioritise harmony and may need encouragement to assert their own academic needs when they conflict with others'.`,
      moderate: `${first} balances cooperation with assertiveness. They can work harmoniously with others while standing firm on important issues — a healthy middle ground for academic and social success.`,
      low: `${first} is direct, independent, and willing to challenge ideas. They bring critical thinking to discussions but may need to develop diplomatic skills for collaborative projects and peer relationships.`,
    },
    C: {
      high: `${first} is highly organised, disciplined, and goal-oriented. They naturally excel at planning, meeting deadlines, and maintaining quality standards. Their perfectionist tendencies are a strength that may occasionally need moderation to prevent burnout.`,
      moderate: `${first} has adequate organisational skills with room for growth. They can maintain routines when motivated but may benefit from external structure and accountability systems for long-term projects.`,
      low: `${first} prefers flexibility and spontaneity over rigid structure. They may struggle with long-term planning and routine tasks. Building external systems (planners, reminders, study schedules) is essential for academic success.`,
    },
    O: {
      high: `${first} is intellectually curious, creative, and drawn to novel ideas. They thrive when given freedom to explore topics in depth and may resist overly structured or repetitive learning. Channelling this curiosity into academic pursuits can be transformative.`,
      moderate: `${first} shows balanced curiosity — open to new ideas while appreciating established approaches. They can engage with creative projects and traditional learning equally well.`,
      low: `${first} prefers practical, concrete learning and established methods. They excel with clear instructions and familiar formats. Exposure to creative thinking in small doses can broaden their academic toolkit without overwhelming them.`,
    },
  };

  const level = score >= 3.5 ? 'high' : score < 2.5 ? 'low' : 'moderate';
  return interps[key]?.[level] || `${first} shows a distinctive profile on this dimension that shapes their academic approach.`;
}
