/**
 * Report helper utilities for HEXACO student profile reports.
 * Pure functions: scores in, structured data out.
 */

export const DIM_ORDER = ['H', 'E', 'X', 'A', 'C', 'O'] as const;

export type DimKey = (typeof DIM_ORDER)[number];

export const DIM_NAMES: Record<DimKey, string> = {
	H: 'Honesty-Humility',
	E: 'Emotionality',
	X: 'Extraversion',
	A: 'Agreeableness',
	C: 'Conscientiousness',
	O: 'Openness to Experience'
};

export const DIM_SHORT: Record<DimKey, string> = {
	H: 'Honesty',
	E: 'Emotionality',
	X: 'Extraversion',
	A: 'Agreeableness',
	C: 'Conscientiousness',
	O: 'Openness'
};

export const DIM_COLORS: Record<DimKey, string> = {
	H: '#14b8a6',
	E: '#f43f5e',
	X: '#f97316',
	A: '#22c55e',
	C: '#3b82f6',
	O: '#8b5cf6'
};

export const DIM_ICONS: Record<DimKey, string> = {
	H: '🤝',
	E: '💭',
	X: '⚡',
	A: '🕊️',
	C: '📋',
	O: '🔭'
};

export type Level = 'high' | 'moderate' | 'low';
export type FacetDirection = 'strength' | 'weakness' | 'neutral' | 'preference';

/**
 * Three-tier classification used across all report templates.
 */
export function classifyLevel(score: number): Level {
	if (score >= 3.5) return 'high';
	if (score >= 2.5) return 'moderate';
	return 'low';
}

export function isHigh(score: number): boolean {
	return score >= 3.5;
}

export function isLow(score: number): boolean {
	return score < 2.5;
}

export function isModerate(score: number): boolean {
	return score >= 2.5 && score < 3.5;
}

/**
 * Convert 0-5 score to percentage (0-100).
 */
export function scorePercent(score: number): number {
	return Math.round((score / 5) * 100);
}

/**
 * Approximate percentile rank using a normal distribution.
 * Based on HEXACO-PI-R population norms (mean ~3.0, SD ~0.7 on 1-5 scale).
 * Returns 1-99 (clamped — never 0% or 100%).
 */
export function scorePercentile(score: number, mean = 3.0, sd = 0.7): number {
	const z = (score - mean) / sd;
	// Rational approximation of the standard normal CDF
	const t = 1 / (1 + 0.2316419 * Math.abs(z));
	const d = 0.3989422804014327; // 1/sqrt(2*PI)
	const p = d * Math.exp(-z * z / 2) * (t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))));
	const cdf = z > 0 ? 1 - p : p;
	return Math.min(99, Math.max(1, Math.round(cdf * 100)));
}

/**
 * Format score to one decimal place.
 */
export function formatScore(score: number): string {
	return score.toFixed(1);
}

/**
 * Level label for display.
 */
export function levelLabel(level: string): string {
	const labels: Record<string, string> = {
		very_low: 'Very Low',
		low: 'Low',
		moderate: 'Moderate',
		high: 'High',
		very_high: 'Very High'
	};
	return labels[level] || level;
}

export interface DimEntry {
	key: DimKey;
	name: string;
	score: number;
	level: string;
}

export interface FacetEntry {
	key: string;
	name: string;
	score: number;
	dimKey: DimKey;
	dimName: string;
}

export interface FacetItem {
	name: string;
	score: number;
	level?: string;
	[key: string]: unknown;
}

export interface DimData {
	name: string;
	score: number;
	level: string;
	facets: Record<string, FacetItem>;
}

export type DimensionsMap = Record<string, DimData>;

/**
 * Convert scorer's DimensionScore[] array into the DimensionsMap expected by report templates.
 */
export function toDimensionsMap(dims: { name: string; score: number; facets: { name: string; score: number }[] }[]): DimensionsMap {
	const map: DimensionsMap = {} as DimensionsMap;
	for (const dim of dims) {
		const key = dim.name as DimKey;
		const facets: Record<string, FacetItem> = {};
		for (const f of dim.facets) {
			facets[f.name] = { name: f.name, score: f.score };
		}
		map[key] = {
			name: DIM_NAMES[key] || dim.name,
			score: dim.score,
			level: classifyLevel(dim.score),
			facets,
		};
	}
	return map;
}

/**
 * Rank dimensions by score descending.
 * Returns [{ key, name, score, level }]
 */
export function rankDimensions(dimensions: DimensionsMap): DimEntry[] {
	return DIM_ORDER.map((key) => ({
		key,
		name: dimensions[key].name,
		score: dimensions[key].score,
		level: dimensions[key].level
	})).sort((a, b) => b.score - a.score);
}

/**
 * Rank ALL facets across ALL dimensions by score.
 * Returns [{ key, name, score, dimKey, dimName }]
 */
export function rankAllFacets(dimensions: DimensionsMap): FacetEntry[] {
	const facets: FacetEntry[] = [];
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
export function topFacets(dimensions: DimensionsMap, n = 5): FacetEntry[] {
	return rankAllFacets(dimensions).slice(0, n);
}

/**
 * Get bottom N facets (growth areas).
 */
export function bottomFacets(dimensions: DimensionsMap, n = 5): FacetEntry[] {
	return rankAllFacets(dimensions).slice(-n).reverse();
}

/**
 * Get dimension score by key.
 */
export function dimScore(dimensions: DimensionsMap, key: string): number {
	return dimensions[key]?.score ?? 0;
}

/**
 * Pick items from an array based on score level.
 */
export function pickByLevel(
	score: number,
	{ high = [] as any[], moderate = [] as any[], low = [] as any[] }: { high?: any[]; moderate?: any[]; low?: any[] }
): any[] {
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
const PREFERENCE_FACETS = new Set([
	'social_self_esteem',
	'social_boldness',
	'sociability',
	'liveliness'
]);

export function isInverseFacet(facetKey: string): boolean {
	return INVERSE_FACETS.has(facetKey);
}

export function isPreferenceFacet(facetKey: string): boolean {
	return PREFERENCE_FACETS.has(facetKey);
}

/**
 * Classify a single facet as strength/weakness/neutral/preference.
 * - Standard facets: high (>=3.5) = strength, low (<2.5) = weakness
 * - Inverse facets: high (>=3.5) = weakness, low (<2.5) = strength
 * - Preference facets: high (>=3.5) = strength, low (<2.5) = preference (NOT weakness)
 * - Moderate (2.5-3.4) = neutral for all
 */
export function classifyFacetDirection(facetKey: string, score: number): FacetDirection {
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

export interface ClassifiedFacetEntry {
	key: string;
	name: string;
	score: number;
	dimKey: string;
}

export interface ClassifiedFacets {
	strengths: ClassifiedFacetEntry[];
	weaknesses: ClassifiedFacetEntry[];
	neutral: ClassifiedFacetEntry[];
	preferences: ClassifiedFacetEntry[];
}

/**
 * Classify all facets within a dimension into strengths/weaknesses/neutral/preferences.
 * Returns { strengths: [...], weaknesses: [...], neutral: [...], preferences: [...] }
 */
export function classifyDimensionFacets(dimKey: string, dimension: DimData): ClassifiedFacets {
	const strengths: ClassifiedFacetEntry[] = [];
	const weaknesses: ClassifiedFacetEntry[] = [];
	const neutral: ClassifiedFacetEntry[] = [];
	const preferences: ClassifiedFacetEntry[] = [];

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
		return aInv === bInv ? b.score - a.score : aInv ? a.score - b.score : b.score - a.score;
	});
	weaknesses.sort((a, b) => {
		const aInv = isInverseFacet(a.key);
		const bInv = isInverseFacet(b.key);
		return aInv === bInv
			? aInv
				? b.score - a.score
				: a.score - b.score
			: aInv
				? -1
				: 1;
	});

	// Ensure every dimension has at least one growth area
	// If no weaknesses, promote lowest-scoring neutral facet
	if (weaknesses.length === 0 && neutral.length > 0) {
		neutral.sort((a, b) => a.score - b.score);
		weaknesses.push(neutral.shift()!);
	}

	return { strengths, weaknesses, neutral, preferences };
}

/**
 * Learning Archetype — 3×3 matrix of conscientiousness level × dominant study approach,
 * with personality modifiers from Emotionality, Extraversion, and Openness.
 * Used by consolidated report sections C1 and C3.
 */
const ARCHETYPE_MATRIX: Record<Level, Record<string, string>> = {
	high: { deep: 'Disciplined Scholar', strategic: 'Organised Achiever', surface: 'Dutiful Worker' },
	moderate: {
		deep: 'Curious Explorer',
		strategic: 'Adaptable Learner',
		surface: 'Passive Absorber'
	},
	low: {
		deep: 'Passionate Drifter',
		strategic: 'Tactical Crammer',
		surface: 'Disengaged Scanner'
	}
};

export function getLearningArchetype(
	dimensions: DimensionsMap,
	studyProfile: Record<string, unknown>
): string {
	const cLevel = classifyLevel(dimensions.C.score);
	const approach = (studyProfile.dominantApproach as string) || 'strategic';
	let label = ARCHETYPE_MATRIX[cLevel]?.[approach] || 'Balanced Learner';

	const modifiers: string[] = [];
	const anxiety = (dimensions.E.facets.anxiety as FacetItem)?.score || 0;
	if (anxiety >= 4.0) modifiers.push('with anxiety overlay');
	if (dimensions.X.score < 2.5) modifiers.push('solo preference');
	else if (dimensions.X.score >= 4.0) modifiers.push('social energiser');
	if (dimensions.O.score >= 4.0) modifiers.push('creative thinker');

	if (modifiers.length > 0) {
		label += ' — ' + modifiers.join(', ');
	}
	return label;
}
