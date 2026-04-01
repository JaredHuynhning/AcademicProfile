import type { InteractionInsight } from './interaction-rules';
import { DIM_NAMES, type DimensionsMap } from './helpers';

export const SECTION_OPENERS: ((name: string) => string)[] = [
  (n) => `What stands out immediately about ${n} is`,
  (n) => `The data reveals something important about ${n}:`,
  (n) => `Here's what makes ${n} different from most students:`,
  (n) => `Teachers will notice that ${n}`,
  (n) => `At home, this shows up when ${n}`,
  (n) => `Perhaps the most telling indicator for ${n} is`,
  (_n) => `The research literature points to something specific here:`,
  (n) => `This is where personality becomes academic reality for ${n}:`,
  (n) => `The pattern that emerges for ${n} is`,
  (n) => `What parents often miss is that ${n}`,
  (_n) => `Look closely at the numbers and a story emerges:`,
  (n) => `The most important thing to understand about ${n} is`,
];

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function pickOpener(studentName: string, sectionIndex: number): string {
  const hash = nameHash(studentName);
  const idx = (hash + sectionIndex * 7) % SECTION_OPENERS.length;
  return SECTION_OPENERS[idx](studentName);
}

type CalloutVariant = 'bold' | 'quote' | 'question' | 'inline';

const CALLOUT_VARIANTS: ((interaction: InteractionInsight) => string)[] = [
  (i) => `**${i.label}:** ${i.insight}`,
  (i) => `> **${i.label}** — ${i.insight}`,
  (i) => `**Why does this matter?** ${i.insight} (This is the ${i.label} effect.)`,
  (i) => `${i.insight} — a pattern researchers call *${i.label}*.`,
];

export function renderInteractionCallout(
  interaction: InteractionInsight,
  variant?: CalloutVariant | number,
): string {
  if (variant === undefined) return CALLOUT_VARIANTS[0](interaction);
  const idx = typeof variant === 'number' ? variant % CALLOUT_VARIANTS.length : ['bold', 'quote', 'question', 'inline'].indexOf(variant);
  return CALLOUT_VARIANTS[Math.max(0, idx)](interaction);
}

const ACTION_VARIANTS: ((action: string) => string)[] = [
  (a) => `What to do: ${a}`,
  (a) => `**Action step:** ${a}`,
  (a) => `The practical takeaway: ${a}`,
  (a) => `For parents and teachers: ${a}`,
];

export function renderInteractionAction(
  interaction: InteractionInsight,
  variant?: number,
): string {
  const idx = variant !== undefined ? variant % ACTION_VARIANTS.length : 0;
  return ACTION_VARIANTS[idx](interaction.action);
}

export function filterByAudience(
  interactions: InteractionInsight[],
  audiences: string[],
): InteractionInsight[] {
  return interactions.filter((i) => audiences.includes(i.audience));
}

/** Pick N interactions relevant to a section, avoiding repeats across sections */
export function pickInteractionsForSection(
  interactions: InteractionInsight[],
  sectionIndex: number,
  count: number = 2,
  audienceFilter?: string[],
): InteractionInsight[] {
  let filtered = interactions;
  if (audienceFilter) {
    filtered = filtered.filter((i) => audienceFilter.includes(i.audience));
  }
  if (filtered.length <= count) return filtered;
  const start = (sectionIndex * 2) % filtered.length;
  const result: InteractionInsight[] = [];
  for (let i = 0; i < count && i < filtered.length; i++) {
    result.push(filtered[(start + i) % filtered.length]);
  }
  return result;
}

// ─── Bridge Transitions ─────────────────────────────────────────────────────

const BRIDGE_TEMPLATES: ((name: string, topic: string) => string)[] = [
  (n, t) => `This personality pattern shows up most clearly in how ${n} approaches ${t}.`,
  (_n, t) => `Now consider how this plays out in ${t}:`,
  (n, t) => `The practical implication? Look at ${n}'s ${t}:`,
  (_n, t) => `This trait doesn't exist in isolation — it directly shapes ${t}.`,
  (n, t) => `Understanding this is essential for ${n}'s ${t}:`,
  (_n, t) => `The connection to ${t} is where theory meets classroom reality.`,
  (n, t) => `For ${n}, this translates into a specific pattern in ${t}:`,
  (_n, t) => `With that context, let's examine ${t} more closely.`,
  (n, t) => `So what does this mean for ${n}'s ${t}? The evidence is specific:`,
  (_n, t) => `This sets the stage for ${t}, which is where the real impact shows:`,
];

/**
 * Pick a bridge sentence to place before a new subsection heading.
 * Deterministic per student + section + subsection position.
 */
export function pickBridge(studentName: string, sectionIndex: number, subsectionIndex: number, topic: string): string {
  const hash = nameHash(studentName);
  const idx = (hash + sectionIndex * 5 + subsectionIndex * 3) % BRIDGE_TEMPLATES.length;
  return BRIDGE_TEMPLATES[idx](studentName, topic.toLowerCase());
}

// ─── Narrative Structure Rotation ───────────────────────────────────────────

export type NarrativeStructure = 'standard' | 'inverted' | 'question-led';

/**
 * Pick a narrative paragraph structure for a section.
 * Standard: research → implication → practice
 * Inverted: practice example → research → implication
 * Question-led: "What happens when...?" → answer → research
 */
export function pickNarrativeStructure(sectionIndex: number): NarrativeStructure {
  const structures: NarrativeStructure[] = ['standard', 'inverted', 'question-led'];
  return structures[sectionIndex % structures.length];
}

export function detectFacetSurprises(dims: DimensionsMap, studentName: string): string[] {
  const surprises: string[] = [];

  for (const [dimKey, dim] of Object.entries(dims)) {
    const dimName = DIM_NAMES[dimKey as keyof typeof DIM_NAMES] ?? dimKey;
    for (const [, facet] of Object.entries(dim.facets)) {
      const divergence = Math.abs(facet.score - dim.score);
      if (divergence >= 1.0) {
        const direction = facet.score > dim.score ? 'higher' : 'lower';
        surprises.push(
          `Hidden detail for ${studentName}: in ${dimName}, ${facet.name} scores ${facet.score.toFixed(1)} — ${divergence.toFixed(1)} points ${direction} than the dimension average of ${dim.score.toFixed(1)}.`,
        );
      }
    }
  }

  return surprises;
}
