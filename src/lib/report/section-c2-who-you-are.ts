// @ts-nocheck
/**
 * Section C2: Who You Are
 * Personality DNA (top 3 + bottom 3) and cross-reference personality↔academic table.
 */
import { rankDimensions, DIM_ICONS, DIM_COLORS, DIM_NAMES, formatScore } from './helpers';

const ACADEMIC_METRIC_LABELS = {
	perseverance: 'Perseverance of Effort',
	consistency: 'Consistency of Interest',
	deep: 'Deep Learning Approach',
	strategic: 'Strategic Approach',
	surface: 'Surface Approach',
	intrinsic: 'Intrinsic Motivation',
	external: 'External Motivation',
	identified: 'Identified Motivation',
	amotivation: 'Amotivation',
	planning: 'Planning & Organisation',
	selfEfficacy: 'Self-Efficacy',
	helpSeeking: 'Help-Seeking',
	testAnxiety: 'Test Anxiety',
	procrastination: 'Procrastination Resistance',
	concentration: 'Concentration',
	netEnergy: 'Net Energy',
	vitality: 'Vitality',
	warmth: 'Warmth Preference'
};

function humanMetric(metric) {
	return ACADEMIC_METRIC_LABELS[metric] || metric.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateWhoYouAre(results, crossRefResult) {
	const ranked = rankDimensions(results.dimensions);

	const top3 = ranked.slice(0, 3).map((d, i) => ({
		key: d.key,
		name: DIM_NAMES[d.key],
		score: formatScore(d.score),
		level: d.level,
		rank: i + 1,
		icon: DIM_ICONS[d.key],
		color: DIM_COLORS[d.key],
		role: 'strength'
	}));

	const bottom3 = ranked.slice(-3).map((d, i) => ({
		key: d.key,
		name: DIM_NAMES[d.key],
		score: formatScore(d.score),
		level: d.level,
		rank: ranked.length - 2 + i,
		icon: DIM_ICONS[d.key],
		color: DIM_COLORS[d.key],
		role: 'growth'
	}));

	const personalityDNA = [...top3, ...bottom3];

	const tableInsights = [
		...(crossRefResult.byType.root_cause || []),
		...(crossRefResult.byType.confirmation || [])
	]
		.sort((a, b) => b.impact - a.impact)
		.slice(0, 6)
		.map((insight) => ({
			trait: insight.personality.facet
				? `${insight.personality.facet} (${DIM_NAMES[insight.personality.dim]})`
				: DIM_NAMES[insight.personality.dim],
			traitScore: formatScore(insight.personality.score),
			behaviour: humanMetric(insight.academic.metric),
			behaviourScore: formatScore(insight.academic.score),
			evidence: insight.insight,
			type: insight.type
		}));

	return {
		personalityDNA,
		crossRefTable: tableInsights
	};
}
