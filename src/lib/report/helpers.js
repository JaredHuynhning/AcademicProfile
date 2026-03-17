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
