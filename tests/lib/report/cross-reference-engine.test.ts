/**
 * Tests for cross-reference-engine.ts
 */

import { describe, it, expect } from 'vitest';
import { runCrossReferenceEngine } from '@/lib/report/cross-reference-engine';
import { sampleProfiles } from '@/lib/data/sample-profiles';

// --- Profile helpers ---

function getProfile(id: string) {
	const p = (sampleProfiles as Array<{ id: string; results: unknown }>).find((p) => p.id === id);
	if (!p) throw new Error(`Profile not found: ${id}`);
	return p.results as {
		dimensions: Record<string, unknown>;
		studyProfile: Record<string, unknown>;
		learnerProfile: Record<string, unknown>;
	};
}

/**
 * Build a high-anxiety profile that will trigger rc-01 (anxiety>=3.5, procrastination>=3.0).
 * Based on Amira but with procrastination bumped to 3.5 and selfEfficacy lowered to 2.0
 * so that rc-11 also fires.
 */
function makeHighAnxietyProfile() {
	const liam = getProfile('sample-liam-torres');
	return {
		dimensions: liam.dimensions,
		studyProfile: {
			...(liam.studyProfile as Record<string, unknown>),
			selfRegulation: {
				...((liam.studyProfile as Record<string, Record<string, unknown>>).selfRegulation),
				selfEfficacy: { score: 2.0, level: 'low', items: 2 } // < 2.5 → fires rc-11
			}
		},
		learnerProfile: {
			...(liam.learnerProfile as Record<string, unknown>),
			focus: {
				...((liam.learnerProfile as Record<string, Record<string, unknown>>).focus),
				procrastination: { score: 3.5, level: 'high', items: 3 } // >= 3.0 → fires rc-01
			},
			energy: {
				...((liam.learnerProfile as Record<string, Record<string, unknown>>).energy),
				netEnergy: { score: 2.3, level: 'low' } // < 2.5 → fires rc-06
			}
		}
	};
}

// Balanced profile: all scores ~3.0
function makeBalancedProfile() {
	const makeFacets = (keys: string[]) =>
		Object.fromEntries(
			keys.map((k) => [k, { name: k, score: 3.0, level: 'moderate', item_count: 2 }])
		);

	const dimensions = {
		H: {
			name: 'Honesty-Humility',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['sincerity', 'fairness', 'greed_avoidance', 'modesty'])
		},
		E: {
			name: 'Emotionality',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['fearfulness', 'anxiety', 'dependence', 'sentimentality'])
		},
		X: {
			name: 'Extraversion',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['social_self_esteem', 'social_boldness', 'sociability', 'liveliness'])
		},
		A: {
			name: 'Agreeableness',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['forgiveness', 'gentleness', 'flexibility', 'patience'])
		},
		C: {
			name: 'Conscientiousness',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['organisation', 'diligence', 'perfectionism', 'prudence'])
		},
		O: {
			name: 'Openness to Experience',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets([
				'aesthetic_appreciation',
				'inquisitiveness',
				'creativity',
				'unconventionality'
			])
		}
	};

	const studyProfile = {
		studyApproaches: {
			deep: { score: 3.0, level: 'moderate', items: 4 },
			strategic: { score: 3.0, level: 'moderate', items: 3 },
			surface: { score: 3.0, level: 'moderate', items: 3 }
		},
		motivation: {
			intrinsic: { score: 3.0, level: 'moderate', items: 3 },
			identified: { score: 3.0, level: 'moderate', items: 2 },
			external: { score: 3.0, level: 'moderate', items: 2 },
			amotivation: { score: 3.0, level: 'moderate', items: 3 }
		},
		selfRegulation: {
			selfEfficacy: { score: 3.0, level: 'moderate', items: 2 },
			planning: { score: 3.0, level: 'moderate', items: 2 },
			effortRegulation: { score: 3.0, level: 'moderate', items: 2 },
			testAnxiety: { score: 3.0, level: 'moderate', items: 2 },
			helpSeeking: { score: 3.0, level: 'moderate', items: 2 }
		}
	};

	const learnerProfile = {
		grit: {
			perseverance: { score: 3.0, level: 'moderate', items: 3 },
			consistency: { score: 3.0, level: 'moderate', items: 3 }
		},
		focus: {
			concentration: { score: 3.0, level: 'moderate', items: 3 },
			procrastination: { score: 3.0, level: 'moderate', items: 3 }
		},
		energy: {
			vitality: { score: 3.0, level: 'moderate', items: 2 },
			depletion: { score: 3.0, level: 'moderate', items: 2 },
			netEnergy: { score: 3.0, level: 'moderate' }
		},
		teacherPreference: {
			structure: 3.0,
			warmth: 3.0,
			carrot: 3.0,
			stick: 3.0
		},
		examBarriers: {
			preparation: 3.0,
			external: 3.0,
			anxiety: 3.0,
			timeManagement: 3.0
		}
	};

	return { dimensions, studyProfile, learnerProfile };
}

// Dual-fire synthetic profile: dim C >= 3.5 AND perfectionism >= 4.0
// Also needs procrastination >= 3.0 to fire both cf-03 (strategic >= 3.5) and rc-04 (perfectionism >= 4.0)
function makeDualFireProfile() {
	const makeFacets = (keys: string[]) =>
		Object.fromEntries(
			keys.map((k) => [k, { name: k, score: 3.0, level: 'moderate', item_count: 2 }])
		);

	const dimensions = {
		H: {
			name: 'Honesty-Humility',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['sincerity', 'fairness', 'greed_avoidance', 'modesty'])
		},
		E: {
			name: 'Emotionality',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['fearfulness', 'anxiety', 'dependence', 'sentimentality'])
		},
		X: {
			name: 'Extraversion',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['social_self_esteem', 'social_boldness', 'sociability', 'liveliness'])
		},
		A: {
			name: 'Agreeableness',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets(['forgiveness', 'gentleness', 'flexibility', 'patience'])
		},
		C: {
			name: 'Conscientiousness',
			score: 4.0, // >= 3.5 — fires cf-03 dimension-level condition
			level: 'high',
			facets: {
				organisation: { name: 'Organisation', score: 3.0, level: 'moderate', item_count: 2 },
				diligence: { name: 'Diligence', score: 3.0, level: 'moderate', item_count: 2 },
				perfectionism: { name: 'Perfectionism', score: 4.5, level: 'high', item_count: 3 }, // >= 4.0 — fires rc-04
				prudence: { name: 'Prudence', score: 3.0, level: 'moderate', item_count: 3 }
			}
		},
		O: {
			name: 'Openness to Experience',
			score: 3.0,
			level: 'moderate',
			facets: makeFacets([
				'aesthetic_appreciation',
				'inquisitiveness',
				'creativity',
				'unconventionality'
			])
		}
	};

	const studyProfile = {
		studyApproaches: {
			deep: { score: 3.0, level: 'moderate', items: 4 },
			strategic: { score: 4.0, level: 'high', items: 3 }, // >= 3.5 — cf-03 academic condition
			surface: { score: 2.0, level: 'low', items: 3 }
		},
		motivation: {
			intrinsic: { score: 3.0, level: 'moderate', items: 3 },
			identified: { score: 3.0, level: 'moderate', items: 2 },
			external: { score: 3.0, level: 'moderate', items: 2 },
			amotivation: { score: 2.0, level: 'low', items: 3 }
		},
		selfRegulation: {
			selfEfficacy: { score: 3.0, level: 'moderate', items: 2 },
			planning: { score: 3.0, level: 'moderate', items: 2 },
			effortRegulation: { score: 3.0, level: 'moderate', items: 2 },
			testAnxiety: { score: 3.0, level: 'moderate', items: 2 },
			helpSeeking: { score: 3.0, level: 'moderate', items: 2 }
		}
	};

	const learnerProfile = {
		grit: {
			perseverance: { score: 3.0, level: 'moderate', items: 3 },
			consistency: { score: 3.0, level: 'moderate', items: 3 }
		},
		focus: {
			concentration: { score: 3.0, level: 'moderate', items: 3 },
			procrastination: { score: 3.5, level: 'high', items: 3 } // >= 3.0 — fires rc-04 academic condition
		},
		energy: {
			vitality: { score: 3.0, level: 'moderate', items: 2 },
			depletion: { score: 3.0, level: 'moderate', items: 2 },
			netEnergy: { score: 3.0, level: 'moderate' }
		},
		teacherPreference: {
			structure: 3.0,
			warmth: 3.0,
			carrot: 3.0,
			stick: 3.0
		},
		examBarriers: {
			preparation: 3.0,
			external: 3.0,
			anxiety: 3.0,
			timeManagement: 3.0
		}
	};

	return { dimensions, studyProfile, learnerProfile };
}

// ─── Test 1: Return shape ───────────────────────────────────────────────────
describe('runCrossReferenceEngine — return shape', () => {
	it('result has insights array and byType object', () => {
		const { dimensions, studyProfile, learnerProfile } = getProfile('sample-ethan-bridges');
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		expect(Array.isArray(result.insights)).toBe(true);
		expect(typeof result.byType === 'object' && result.byType !== null).toBe(true);
		expect(Array.isArray(result.byType.root_cause)).toBe(true);
		expect(Array.isArray(result.byType.confirmation)).toBe(true);
		expect(Array.isArray(result.byType.contradiction)).toBe(true);
		expect(Array.isArray(result.byType.untapped)).toBe(true);
	});
});

// ─── Test 2: High anxiety (5.0) triggers root_cause ────────────────────────
describe('runCrossReferenceEngine — high anxiety triggers root_cause', () => {
	it('high anxiety profile (anxiety=5.0, procrastination=3.5) triggers at least one root_cause rule', () => {
		const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		const anxietyRootCauses = result.byType.root_cause.filter(
			(i) => i.personality.facet === 'anxiety'
		);
		expect(anxietyRootCauses.length).toBeGreaterThanOrEqual(1);
	});
});

// ─── Test 3: Anxiety NOT in confirmation rules ──────────────────────────────
describe('runCrossReferenceEngine — anxiety not in confirmations for high-anxiety profile', () => {
	it('anxiety facet does not appear in confirmation insights (cf-10 requires anxiety < 2.5)', () => {
		const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		const anxietyConfirmations = result.byType.confirmation.filter(
			(i) => i.personality.facet === 'anxiety'
		);
		expect(anxietyConfirmations.length).toBe(0);
	});
});

// ─── Test 4: All insights have numeric impact >= 0 ─────────────────────────
describe('runCrossReferenceEngine — all insights have numeric impact >= 0', () => {
	it('every insight has a numeric impact field >= 0', () => {
		const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		expect(result.insights.length).toBeGreaterThan(0);
		for (const insight of result.insights) {
			expect(typeof insight.impact).toBe('number');
			expect(insight.impact).toBeGreaterThanOrEqual(0);
		}
	});
});

// ─── Test 5: Direction auto-derived for anxiety ─────────────────────────────
describe('runCrossReferenceEngine — direction auto-derived from score', () => {
	it('high anxiety (5.0) → direction = weakness', () => {
		const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		const anxietyInsights = result.insights.filter((i) => i.personality.facet === 'anxiety');
		expect(anxietyInsights.length).toBeGreaterThanOrEqual(1);

		for (const i of anxietyInsights) {
			expect(i.personality.direction).toBe('weakness');
		}
	});
});

// ─── Test 6: Dual-fire detection ───────────────────────────────────────────
describe('runCrossReferenceEngine — dual-fire detection', () => {
	it('synthetic profile fires cf-03 AND rc-04, at least one has dualFire=true', () => {
		const { dimensions, studyProfile, learnerProfile } = makeDualFireProfile();
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		const hasCf03 = result.insights.some((i) => i.id === 'cf-03');
		const hasRc04 = result.insights.some((i) => i.id === 'rc-04');

		expect(hasCf03).toBe(true);
		expect(hasRc04).toBe(true);

		const dualFired = result.insights.filter((i) => i.dualFire === true);
		expect(dualFired.length).toBeGreaterThanOrEqual(1);
	});
});

// ─── Test 7: Sophie moderate anxiety does NOT trigger anxiety root_cause ─────
describe('runCrossReferenceEngine — Ethan low anxiety', () => {
	it('Ethan (anxiety=2.0) does not trigger anxiety root_cause rules (threshold is 3.5)', () => {
		const { dimensions, studyProfile, learnerProfile } = getProfile('sample-ethan-bridges');
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		const anxietyRootCauses = result.byType.root_cause.filter(
			(i) => i.personality.facet === 'anxiety'
		);
		expect(anxietyRootCauses.length).toBe(0);
	});
});

// ─── Test 8: Balanced profile returns valid insights array ──────────────────
describe('runCrossReferenceEngine — balanced profile', () => {
	it('balanced profile returns insights array (possibly empty, always valid)', () => {
		const { dimensions, studyProfile, learnerProfile } = makeBalancedProfile();
		const result = runCrossReferenceEngine(
			dimensions as Parameters<typeof runCrossReferenceEngine>[0],
			studyProfile as Parameters<typeof runCrossReferenceEngine>[1],
			learnerProfile as Parameters<typeof runCrossReferenceEngine>[2]
		);

		expect(Array.isArray(result.insights)).toBe(true);
		expect(typeof result.byType).toBe('object');

		for (const insight of result.insights) {
			expect(typeof insight.id).toBe('string');
			expect(typeof insight.type).toBe('string');
			expect(typeof insight.impact).toBe('number');
			expect(insight.impact).toBeGreaterThanOrEqual(0);
		}
	});
});
