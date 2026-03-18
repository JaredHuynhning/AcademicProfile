/**
 * Report helper utilities for HEXACO student profile reports.
 * Pure functions: scores in, structured data out.
 */

export const DIM_ORDER = ['H', 'E', 'X', 'A', 'C', 'O'];

export const DIM_NAMES = {
	H: 'Honesty-Humility',
	E: 'Emotionality',
	X: 'Extraversion',
	A: 'Agreeableness',
	C: 'Conscientiousness',
	O: 'Openness to Experience'
};

export const DIM_SHORT = {
	H: 'Honesty',
	E: 'Emotionality',
	X: 'Extraversion',
	A: 'Agreeableness',
	C: 'Conscientiousness',
	O: 'Openness'
};

export const DIM_COLORS = {
	H: '#14b8a6',
	E: '#f43f5e',
	X: '#f97316',
	A: '#22c55e',
	C: '#3b82f6',
	O: '#8b5cf6'
};

export const DIM_ICONS = {
	H: '🤝',
	E: '💭',
	X: '⚡',
	A: '🕊️',
	C: '📋',
	O: '🔭'
};

/**
 * Three-tier classification used across all report templates.
 */
export function classifyLevel(score) {
	if (score >= 3.5) return 'high';
	if (score >= 2.5) return 'moderate';
	return 'low';
}

export function isHigh(score) {
	return score >= 3.5;
}

export function isLow(score) {
	return score < 2.5;
}

export function isModerate(score) {
	return score >= 2.5 && score < 3.5;
}

/**
 * Convert 0-5 score to percentage (0-100).
 */
export function scorePercent(score) {
	return Math.round((score / 5) * 100);
}

/**
 * Format score to one decimal place.
 */
export function formatScore(score) {
	return score.toFixed(1);
}

/**
 * Level label for display.
 */
export function levelLabel(level) {
	const labels = {
		very_low: 'Very Low',
		low: 'Low',
		moderate: 'Moderate',
		high: 'High',
		very_high: 'Very High'
	};
	return labels[level] || level;
}

/**
 * Rank dimensions by score descending.
 * Returns [{ key, name, score, level }]
 */
export function rankDimensions(dimensions) {
	return DIM_ORDER
		.map((key) => ({
			key,
			name: dimensions[key].name,
			score: dimensions[key].score,
			level: dimensions[key].level
		}))
		.sort((a, b) => b.score - a.score);
}

/**
 * Rank ALL facets across ALL dimensions by score.
 * Returns [{ key, name, score, dimKey, dimName }]
 */
export function rankAllFacets(dimensions) {
	const facets = [];
	for (const dimKey of DIM_ORDER) {
		const dim = dimensions[dimKey];
		for (const [facetKey, facet] of Object.entries(dim.facets)) {
			facets.push({
				key: facetKey,
				name: facet.name,
				score: facet.score,
				dimKey,
				dimName: dim.name
			});
		}
	}
	return facets.sort((a, b) => b.score - a.score);
}

/**
 * Get top N facets (strengths).
 */
export function topFacets(dimensions, n = 5) {
	return rankAllFacets(dimensions).slice(0, n);
}

/**
 * Get bottom N facets (growth areas).
 */
export function bottomFacets(dimensions, n = 5) {
	return rankAllFacets(dimensions).slice(-n).reverse();
}

/**
 * Get dimension score by key.
 */
export function dimScore(dimensions, key) {
	return dimensions[key]?.score ?? 0;
}

/**
 * Pick items from an array based on score level.
 */
export function pickByLevel(score, { high = [], moderate = [], low = [] }) {
	if (isHigh(score)) return high;
	if (isLow(score)) return low;
	return moderate;
}

/**
 * Inverse facets: high score = challenge, low score = strength.
 * These are facets where scoring high is NOT desirable in an educational context.
 */
const INVERSE_FACETS = new Set(['anxiety', 'fearfulness', 'dependence']);

/**
 * Preference facets: low scores are valid preferences, not weaknesses.
 * All Extraversion facets — introversion is a style, not a deficit.
 */
const PREFERENCE_FACETS = new Set(['social_self_esteem', 'social_boldness', 'sociability', 'liveliness']);

export function isInverseFacet(facetKey) {
	return INVERSE_FACETS.has(facetKey);
}

export function isPreferenceFacet(facetKey) {
	return PREFERENCE_FACETS.has(facetKey);
}

/**
 * Classify a single facet as strength/weakness/neutral/preference.
 * - Standard facets: high (>=3.5) = strength, low (<2.5) = weakness
 * - Inverse facets: high (>=3.5) = weakness, low (<2.5) = strength
 * - Preference facets: high (>=3.5) = strength, low (<2.5) = preference (NOT weakness)
 * - Moderate (2.5-3.4) = neutral for all
 */
export function classifyFacetDirection(facetKey, score) {
	const inverse = isInverseFacet(facetKey);
	const preference = isPreferenceFacet(facetKey);
	if (score >= 3.5) return inverse ? 'weakness' : 'strength';
	if (score < 2.5) {
		if (inverse) return 'strength';
		if (preference) return 'preference';
		return 'weakness';
	}
	return 'neutral';
}

/**
 * Classify all facets within a dimension into strengths/weaknesses/neutral/preferences.
 * Returns { strengths: [...], weaknesses: [...], neutral: [...], preferences: [...] }
 */
export function classifyDimensionFacets(dimKey, dimension) {
	const strengths = [];
	const weaknesses = [];
	const neutral = [];
	const preferences = [];

	for (const [facetKey, facet] of Object.entries(dimension.facets)) {
		const direction = classifyFacetDirection(facetKey, facet.score);
		const entry = { key: facetKey, name: facet.name, score: facet.score, dimKey };
		if (direction === 'strength') strengths.push(entry);
		else if (direction === 'weakness') weaknesses.push(entry);
		else if (direction === 'preference') preferences.push(entry);
		else neutral.push(entry);
	}

	strengths.sort((a, b) => {
		const aInv = isInverseFacet(a.key);
		const bInv = isInverseFacet(b.key);
		return aInv === bInv ? b.score - a.score : (aInv ? a.score - b.score : b.score - a.score);
	});
	weaknesses.sort((a, b) => {
		const aInv = isInverseFacet(a.key);
		const bInv = isInverseFacet(b.key);
		return aInv === bInv ? (aInv ? b.score - a.score : a.score - b.score) : (aInv ? -1 : 1);
	});

	return { strengths, weaknesses, neutral, preferences };
}

/**
 * Learning Archetype — 3×3 matrix of conscientiousness level × dominant study approach,
 * with personality modifiers from Emotionality, Extraversion, and Openness.
 * Used by consolidated report sections C1 and C3.
 */
const ARCHETYPE_MATRIX = {
	high: { deep: 'Disciplined Scholar', strategic: 'Organised Achiever', surface: 'Dutiful Worker' },
	moderate: { deep: 'Curious Explorer', strategic: 'Adaptable Learner', surface: 'Passive Absorber' },
	low: { deep: 'Passionate Drifter', strategic: 'Tactical Crammer', surface: 'Disengaged Scanner' }
};

export function getLearningArchetype(dimensions, studyProfile) {
	const cLevel = classifyLevel(dimensions.C.score);
	const approach = studyProfile.dominantApproach || 'strategic';
	let label = ARCHETYPE_MATRIX[cLevel]?.[approach] || 'Balanced Learner';

	const modifiers = [];
	const anxiety = dimensions.E.facets.anxiety?.score || 0;
	if (anxiety >= 4.0) modifiers.push('with anxiety overlay');
	if (dimensions.X.score < 2.5) modifiers.push('solo preference');
	else if (dimensions.X.score >= 4.0) modifiers.push('social energiser');
	if (dimensions.O.score >= 4.0) modifiers.push('creative thinker');

	if (modifiers.length > 0) {
		label += ' — ' + modifiers.join(', ');
	}
	return label;
}
