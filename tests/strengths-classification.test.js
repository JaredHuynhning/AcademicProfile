/**
 * Test: Strengths classification logic — inverse facets handled correctly.
 * Run with: node tests/strengths-classification.test.js
 *
 * Core rule: Some HEXACO facets are "inverse" — high scores are challenges, not strengths.
 * - anxiety, fearfulness, dependence: high = weakness, low = strength
 * - All other facets: high = strength, low = weakness
 */
import assert from 'node:assert/strict';
import { classifyFacetDirection, classifyDimensionFacets } from '../src/lib/report/helpers.js';

// ---- Test 1: Inverse facets correctly identified ----
console.log('Test 1: Anxiety 5.0 should be classified as weakness, not strength');
assert.equal(
	classifyFacetDirection('anxiety', 5.0),
	'weakness',
	'Anxiety 5.0 must be a weakness'
);

console.log('Test 2: Anxiety 1.5 should be classified as strength (low anxiety = good)');
assert.equal(
	classifyFacetDirection('anxiety', 1.5),
	'strength',
	'Low anxiety is a strength'
);

console.log('Test 3: Fearfulness 4.5 should be weakness');
assert.equal(
	classifyFacetDirection('fearfulness', 4.5),
	'weakness',
	'High fearfulness is a weakness'
);

console.log('Test 4: Dependence 5.0 should be weakness');
assert.equal(
	classifyFacetDirection('dependence', 5.0),
	'weakness',
	'High dependence is a weakness'
);

// ---- Test 2: Standard facets still work normally ----
console.log('Test 5: Diligence 5.0 should be strength');
assert.equal(
	classifyFacetDirection('diligence', 5.0),
	'strength',
	'High diligence is a strength'
);

console.log('Test 6: Social Boldness 1.3 should be preference (not weakness)');
assert.equal(
	classifyFacetDirection('social_boldness', 1.3),
	'preference',
	'Low social boldness is a preference, not a weakness'
);

console.log('Test 7: Moderate scores are neutral');
assert.equal(
	classifyFacetDirection('anxiety', 3.0),
	'neutral',
	'Moderate anxiety is neutral'
);

assert.equal(
	classifyFacetDirection('diligence', 3.0),
	'neutral',
	'Moderate diligence is neutral'
);

// ---- Test 3: Per-dimension classification ----
console.log('Test 8: Emotionality dimension with high anxiety/fearfulness produces correct groupings');
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
// Sentimentality is standard → high = strength
assert.ok(
	result.strengths.some(f => f.key === 'sentimentality'),
	'Sentimentality 5.0 should be a strength'
);
// Anxiety is inverse → high = weakness
assert.ok(
	result.weaknesses.some(f => f.key === 'anxiety'),
	'Anxiety 5.0 should be a weakness'
);
// Fearfulness is inverse → high = weakness
assert.ok(
	result.weaknesses.some(f => f.key === 'fearfulness'),
	'Fearfulness 4.5 should be a weakness'
);
// Dependence is inverse → high = weakness
assert.ok(
	result.weaknesses.some(f => f.key === 'dependence'),
	'Dependence 5.0 should be a weakness'
);

// ---- Test 4: Conscientiousness all-high should all be strengths ----
console.log('Test 9: Conscientiousness with all high scores = all strengths');
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
assert.equal(cResult.strengths.length, 4, 'All 4 conscientiousness facets should be strengths');
assert.equal(cResult.weaknesses.length, 0, 'No weaknesses in high-conscientiousness');

// ---- Test 5: Extraversion with low scores = preferences, NOT weaknesses ----
console.log('Test 10: Low extraversion facets are preferences, not weaknesses');
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
// Low extraversion facets should be preferences, NOT weaknesses
assert.ok(
	xResult.preferences.some(f => f.key === 'social_boldness'),
	'Social Boldness 1.3 should be a preference (not weakness)'
);
assert.ok(
	xResult.preferences.some(f => f.key === 'sociability'),
	'Sociability 2.0 should be a preference (not weakness)'
);
assert.equal(xResult.weaknesses.length, 0, 'No extraversion facets should be weaknesses');
// Social Self-Esteem 2.7 = moderate → neutral
assert.ok(
	!xResult.strengths.some(f => f.key === 'social_self_esteem') &&
	!xResult.weaknesses.some(f => f.key === 'social_self_esteem'),
	'Social Self-Esteem 2.7 should be neutral (not listed in strengths or weaknesses)'
);

console.log('\n✅ All strengths classification tests passed!');
