// @ts-nocheck
/**
 * Section 1: Cover & Profile Summary
 */
import { rankDimensions, DIM_ORDER, DIM_COLORS, DIM_SHORT, formatScore, levelLabel, DimensionsMap } from './helpers';
import { getPersonalityArchetype } from './personality-archetype';

interface Results {
	dimensions: DimensionsMap;
	narrative: {
		summary: string;
		dimension_insights: Record<string, { insight?: string }>;
	};
	[key: string]: unknown;
}

export function generateCover(results: Results, name: string) {
	const ranked = rankDimensions(results.dimensions);
	const top3 = ranked.slice(0, 3);
	const bottom1 = ranked[ranked.length - 1];

	const RADAR_LABELS: Record<string, string> = {
		H: 'Honesty', E: 'Emotion', X: 'Extraversion',
		A: 'Agreeableness', C: 'Conscience', O: 'Openness',
	};
	const radarData = DIM_ORDER.map((d) => ({
		label: RADAR_LABELS[d] || DIM_SHORT[d],
		value: results.dimensions[d].score,
		color: DIM_COLORS[d]
	}));

	const summaryLines: string[] = [];
	summaryLines.push(`${name || 'This student'}'s strongest dimension is ${top3[0].name} (${formatScore(top3[0].score)}/5), indicating ${getStrengthBlurb(top3[0].key)}.`);
	if (top3[1]) {
		summaryLines.push(`This is closely followed by ${top3[1].name} (${formatScore(top3[1].score)}/5) and ${top3[2]?.name || ''} (${formatScore(top3[2]?.score || 0)}/5).`);
	}
	summaryLines.push(`The area with most room for development is ${bottom1.name} (${formatScore(bottom1.score)}/5).`);

	const personalityArchetype = getPersonalityArchetype(results.dimensions);

	return {
		name: name || 'Student',
		date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
		personalityArchetype,
		radarData,
		topTraits: top3.map((t) => ({
			key: t.key,
			name: DIM_SHORT[t.key],
			score: formatScore(t.score),
			level: levelLabel(t.level),
			color: DIM_COLORS[t.key]
		})),
		summary: summaryLines.join(' '),
		narrativeSummary: results.narrative?.summary ?? null
	};
}

function getStrengthBlurb(key: string): string {
	const blurbs: Record<string, string> = {
		H: 'a strong sense of fairness, honesty, and ethical behaviour',
		E: 'deep emotional awareness and sensitivity to both their own and others\' feelings',
		X: 'high social confidence, energy, and comfort in group settings',
		A: 'a cooperative, patient, and flexible approach to working with others',
		C: 'exceptional organisation, discipline, and commitment to quality work',
		O: 'strong intellectual curiosity, creativity, and openness to new ideas'
	};
	return blurbs[key] || '';
}
