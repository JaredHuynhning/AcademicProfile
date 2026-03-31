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

export function renderInteractionCallout(interaction: InteractionInsight): string {
  return `**${interaction.label}:** ${interaction.insight}`;
}

export function renderInteractionAction(interaction: InteractionInsight): string {
  return `What to do: ${interaction.action}`;
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
