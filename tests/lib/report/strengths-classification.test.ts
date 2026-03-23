/**
 * Test: Strengths classification logic — inverse facets handled correctly.
 *
 * Core rule: Some HEXACO facets are "inverse" — high scores are challenges, not strengths.
 * - anxiety, fearfulness, dependence: high = weakness, low = strength
 * - All other facets: high = strength, low = weakness
 */
import { describe, it, expect } from 'vitest';
import { classifyFacetDirection, classifyDimensionFacets } from '@/lib/report/helpers';

// ---- Test 1: Inverse facets correctly identified ----
describe('classifyFacetDirection — inverse facets', () => {
	it('Anxiety 5.0 should be classified as weakness, not strength', () => {
		expect(classifyFacetDirection('anxiety', 5.0)).toBe('weakness');
	});

	it('Anxiety 1.5 should be classified as strength (low anxiety = good)', () => {
		expect(classifyFacetDirection('anxiety', 1.5)).toBe('strength');
	});

	it('Fearfulness 4.5 should be weakness', () => {
		expect(classifyFacetDirection('fearfulness', 4.5)).toBe('weakness');
	});

	it('Dependence 5.0 should be weakness', () => {
		expect(classifyFacetDirection('dependence', 5.0)).toBe('weakness');
	});
});

// ---- Test 2: Standard facets still work normally ----
describe('classifyFacetDirection — standard facets', () => {
	it('Diligence 5.0 should be strength', () => {
		expect(classifyFacetDirection('diligence', 5.0)).toBe('strength');
	});

	it('Social Boldness 1.3 should be preference (not weakness)', () => {
		expect(classifyFacetDirection('social_boldness', 1.3)).toBe('preference');
	});

	it('Moderate anxiety (3.0) is neutral', () => {
		expect(classifyFacetDirection('anxiety', 3.0)).toBe('neutral');
	});

	it('Moderate diligence (3.0) is neutral', () => {
		expect(classifyFacetDirection('diligence', 3.0)).toBe('neutral');
	});
});

// ---- Test 3: Per-dimension classification ----
describe('classifyDimensionFacets — Emotionality with high inverse facets', () => {
	const emotionalityDim = {
		name: 'Emotionality',
		score: 4.9,
		level: 'very_high',
		facets: {
			fearfulness: { name: 'Fearfulness', score: 4.5, level: 'very_high' },
			anxiety: { name: 'Anxiety', score: 5.0, level: 'very_high' },
			dependence: { name: 'Dependence', score: 5.0, level: 'very_high' },
			sentimentality: { name: 'Sentimentality', score: 5.0, level: 'very_high' }
		}
	};

	const result = classifyDimensionFacets('E', emotionalityDim);

	it('Sentimentality 5.0 should be a strength', () => {
		expect(result.strengths.some((f: { key: string }) => f.key === 'sentimentality')).toBe(true);
	});

	it('Anxiety 5.0 should be a weakness', () => {
		expect(result.weaknesses.some((f: { key: string }) => f.key === 'anxiety')).toBe(true);
	});

	it('Fearfulness 4.5 should be a weakness', () => {
		expect(result.weaknesses.some((f: { key: string }) => f.key === 'fearfulness')).toBe(true);
	});

	it('Dependence 5.0 should be a weakness', () => {
		expect(result.weaknesses.some((f: { key: string }) => f.key === 'dependence')).toBe(true);
	});
});

// ---- Test 4: Conscientiousness all-high should all be strengths ----
describe('classifyDimensionFacets — Conscientiousness all high scores', () => {
	const conscientiousnessDim = {
		name: 'Conscientiousness',
		score: 4.5,
		level: 'high',
		facets: {
			organization: { name: 'Organisation', score: 4.0, level: 'high' },
			diligence: { name: 'Diligence', score: 5.0, level: 'very_high' },
			perfectionism: { name: 'Perfectionism', score: 5.0, level: 'very_high' },
			prudence: { name: 'Prudence', score: 4.0, level: 'high' }
		}
	};

	const cResult = classifyDimensionFacets('C', conscientiousnessDim);

	it('All 4 conscientiousness facets should be strengths', () => {
		expect(cResult.strengths.length).toBe(4);
	});

	it('No weaknesses in high-conscientiousness', () => {
		expect(cResult.weaknesses.length).toBe(0);
	});
});

// ---- Test 5: Extraversion with low scores = preferences, NOT weaknesses ----
describe('classifyDimensionFacets — Low extraversion facets are preferences', () => {
	const extraversionDim = {
		name: 'Extraversion',
		score: 2.1,
		level: 'low',
		facets: {
			social_self_esteem: { name: 'Social Self-Esteem', score: 2.7, level: 'moderate' },
			social_boldness: { name: 'Social Boldness', score: 1.3, level: 'very_low' },
			sociability: { name: 'Sociability', score: 2.0, level: 'low' },
			liveliness: { name: 'Liveliness', score: 2.5, level: 'moderate' }
		}
	};

	const xResult = classifyDimensionFacets('X', extraversionDim);

	it('Social Boldness 1.3 should be a preference (not weakness)', () => {
		expect(xResult.preferences.some((f: { key: string }) => f.key === 'social_boldness')).toBe(true);
	});

	it('Sociability 2.0 should be a preference (not weakness)', () => {
		expect(xResult.preferences.some((f: { key: string }) => f.key === 'sociability')).toBe(true);
	});

	it('No extraversion facets should be weaknesses', () => {
		expect(xResult.weaknesses.length).toBe(0);
	});

	it('Social Self-Esteem 2.7 should be neutral (not in strengths or weaknesses)', () => {
		expect(
			!xResult.strengths.some((f: { key: string }) => f.key === 'social_self_esteem') &&
				!xResult.weaknesses.some((f: { key: string }) => f.key === 'social_self_esteem')
		).toBe(true);
	});
});
