/**
 * Tests for cross-reference-engine.js
 * Run with: node tests/cross-reference-engine.test.js
 */

import assert from 'node:assert/strict';
import { runCrossReferenceEngine } from '../src/lib/report/cross-reference-engine.js';
import { sampleProfiles } from '../src/lib/data/sample-profiles.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// --- Profile helpers ---

function getProfile(id) {
  const p = sampleProfiles.find((p) => p.id === id);
  if (!p) throw new Error(`Profile not found: ${id}`);
  return p.results;
}

/**
 * Build a high-anxiety profile that will trigger rc-01 (anxiety>=3.5, procrastination>=3.0).
 * Based on Amira but with procrastination bumped to 3.5 and selfEfficacy lowered to 2.0
 * so that rc-11 also fires.
 */
function makeHighAnxietyProfile() {
  const amira = getProfile('sample-amira-hassan');
  // Deep clone the relevant parts we'll modify
  return {
    dimensions: amira.dimensions,
    studyProfile: {
      ...amira.studyProfile,
      selfRegulation: {
        ...amira.studyProfile.selfRegulation,
        selfEfficacy: { score: 2.0, level: 'low', items: 2 }  // < 2.5 → fires rc-11
      }
    },
    learnerProfile: {
      ...amira.learnerProfile,
      focus: {
        ...amira.learnerProfile.focus,
        procrastination: { score: 3.5, level: 'high', items: 3 }  // >= 3.0 → fires rc-01
      },
      energy: {
        ...amira.learnerProfile.energy,
        netEnergy: { score: 2.3, level: 'low' }  // < 2.5 → fires rc-06
      }
    }
  };
}

// Balanced profile: all scores ~3.0
function makeBalancedProfile() {
  const makeFacets = (keys) =>
    Object.fromEntries(keys.map((k) => [k, { name: k, score: 3.0, level: 'moderate', item_count: 2 }]));

  const dimensions = {
    H: { name: 'Honesty-Humility', score: 3.0, level: 'moderate', facets: makeFacets(['sincerity', 'fairness', 'greed_avoidance', 'modesty']) },
    E: { name: 'Emotionality', score: 3.0, level: 'moderate', facets: makeFacets(['fearfulness', 'anxiety', 'dependence', 'sentimentality']) },
    X: { name: 'Extraversion', score: 3.0, level: 'moderate', facets: makeFacets(['social_self_esteem', 'social_boldness', 'sociability', 'liveliness']) },
    A: { name: 'Agreeableness', score: 3.0, level: 'moderate', facets: makeFacets(['forgiveness', 'gentleness', 'flexibility', 'patience']) },
    C: { name: 'Conscientiousness', score: 3.0, level: 'moderate', facets: makeFacets(['organisation', 'diligence', 'perfectionism', 'prudence']) },
    O: { name: 'Openness to Experience', score: 3.0, level: 'moderate', facets: makeFacets(['aesthetic_appreciation', 'inquisitiveness', 'creativity', 'unconventionality']) }
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
  const makeFacets = (keys) =>
    Object.fromEntries(keys.map((k) => [k, { name: k, score: 3.0, level: 'moderate', item_count: 2 }]));

  const dimensions = {
    H: { name: 'Honesty-Humility', score: 3.0, level: 'moderate', facets: makeFacets(['sincerity', 'fairness', 'greed_avoidance', 'modesty']) },
    E: { name: 'Emotionality', score: 3.0, level: 'moderate', facets: makeFacets(['fearfulness', 'anxiety', 'dependence', 'sentimentality']) },
    X: { name: 'Extraversion', score: 3.0, level: 'moderate', facets: makeFacets(['social_self_esteem', 'social_boldness', 'sociability', 'liveliness']) },
    A: { name: 'Agreeableness', score: 3.0, level: 'moderate', facets: makeFacets(['forgiveness', 'gentleness', 'flexibility', 'patience']) },
    C: {
      name: 'Conscientiousness',
      score: 4.0,  // >= 3.5 — fires cf-03 dimension-level condition
      level: 'high',
      facets: {
        organisation: { name: 'Organisation', score: 3.0, level: 'moderate', item_count: 2 },
        diligence: { name: 'Diligence', score: 3.0, level: 'moderate', item_count: 2 },
        perfectionism: { name: 'Perfectionism', score: 4.5, level: 'high', item_count: 3 }, // >= 4.0 — fires rc-04
        prudence: { name: 'Prudence', score: 3.0, level: 'moderate', item_count: 3 }
      }
    },
    O: { name: 'Openness to Experience', score: 3.0, level: 'moderate', facets: makeFacets(['aesthetic_appreciation', 'inquisitiveness', 'creativity', 'unconventionality']) }
  };

  const studyProfile = {
    studyApproaches: {
      deep: { score: 3.0, level: 'moderate', items: 4 },
      strategic: { score: 4.0, level: 'high', items: 3 },  // >= 3.5 — cf-03 academic condition
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
      procrastination: { score: 3.5, level: 'high', items: 3 }  // >= 3.0 — fires rc-04 academic condition
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
console.log('\nTest 1: Engine returns expected shape');
test('result has insights array and byType object', () => {
  const { dimensions, studyProfile, learnerProfile } = getProfile('sample-sophie-turner');
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  assert.ok(Array.isArray(result.insights), 'insights must be an array');
  assert.ok(typeof result.byType === 'object' && result.byType !== null, 'byType must be an object');
  assert.ok(Array.isArray(result.byType.root_cause), 'byType.root_cause must be an array');
  assert.ok(Array.isArray(result.byType.confirmation), 'byType.confirmation must be an array');
  assert.ok(Array.isArray(result.byType.contradiction), 'byType.contradiction must be an array');
  assert.ok(Array.isArray(result.byType.untapped), 'byType.untapped must be an array');
});

// ─── Test 2: High anxiety (5.0) triggers root_cause ────────────────────────
console.log('\nTest 2: High anxiety (5.0) triggers root_cause');
test('high anxiety profile (anxiety=5.0, procrastination=3.5) triggers at least one root_cause rule', () => {
  const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  const anxietyRootCauses = result.byType.root_cause.filter(
    (i) => i.personality.facet === 'anxiety'
  );
  assert.ok(anxietyRootCauses.length >= 1, `Expected at least 1 anxiety root_cause, got ${anxietyRootCauses.length}`);
});

// ─── Test 3: Anxiety NOT in confirmation rules ──────────────────────────────
console.log('\nTest 3: Anxiety NOT in confirmation rules');
test('anxiety facet does not appear in confirmation insights (no confirmation rule has anxiety >= threshold)', () => {
  const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  // The only anxiety confirmation rule (cf-10) requires anxiety < 2.5 (calm),
  // so a high-anxiety profile (5.0) should not trigger it.
  const anxietyConfirmations = result.byType.confirmation.filter(
    (i) => i.personality.facet === 'anxiety'
  );
  assert.strictEqual(
    anxietyConfirmations.length,
    0,
    `Expected 0 anxiety confirmations, got ${anxietyConfirmations.length}`
  );
});

// ─── Test 4: All insights have numeric impact >= 0 ─────────────────────────
console.log('\nTest 4: All insights have numeric impact scores >= 0');
test('every insight has a numeric impact field >= 0', () => {
  const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  assert.ok(result.insights.length > 0, 'Expected at least one insight from high-anxiety profile');
  for (const insight of result.insights) {
    assert.ok(
      typeof insight.impact === 'number',
      `insight ${insight.id} impact is not a number: ${insight.impact}`
    );
    assert.ok(
      insight.impact >= 0,
      `insight ${insight.id} impact is negative: ${insight.impact}`
    );
  }
});

// ─── Test 5: Direction auto-derived for anxiety ─────────────────────────────
console.log('\nTest 5: Direction auto-derived from score');
test('high anxiety (5.0) → direction = weakness', () => {
  const { dimensions, studyProfile, learnerProfile } = makeHighAnxietyProfile();
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  const anxietyInsights = result.insights.filter((i) => i.personality.facet === 'anxiety');
  assert.ok(anxietyInsights.length >= 1, 'No anxiety insights found');

  for (const i of anxietyInsights) {
    assert.strictEqual(
      i.personality.direction,
      'weakness',
      `Expected direction=weakness for anxiety score 5.0, got ${i.personality.direction}`
    );
  }
});

// ─── Test 6: Dual-fire detection ───────────────────────────────────────────
console.log('\nTest 6: Dual-fire detection');
test('synthetic profile fires cf-03 (dim C confirmation) AND rc-04 (perfectionism root_cause), at least one has dualFire=true', () => {
  const { dimensions, studyProfile, learnerProfile } = makeDualFireProfile();
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  const hasCf03 = result.insights.some((i) => i.id === 'cf-03');
  const hasRc04 = result.insights.some((i) => i.id === 'rc-04');

  assert.ok(hasCf03, 'Expected cf-03 to fire (dim C >= 3.5, strategic >= 3.5)');
  assert.ok(hasRc04, 'Expected rc-04 to fire (perfectionism >= 4.0, procrastination >= 3.0)');

  const dualFired = result.insights.filter((i) => i.dualFire === true);
  assert.ok(dualFired.length >= 1, `Expected at least 1 insight with dualFire=true, got ${dualFired.length}`);
});

// ─── Test 7: Sophie moderate anxiety does NOT trigger anxiety root_cause ─────
console.log('\nTest 7: Sophie moderate anxiety (3.0) does not trigger anxiety root_cause');
test('Sophie (anxiety=3.0) does not trigger anxiety root_cause rules (threshold is 3.5)', () => {
  const { dimensions, studyProfile, learnerProfile } = getProfile('sample-sophie-turner');
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  // rc-01 and rc-06/rc-11 require anxiety >= 3.5 — Sophie's is 3.0
  const anxietyRootCauses = result.byType.root_cause.filter(
    (i) => i.personality.facet === 'anxiety'
  );
  assert.strictEqual(
    anxietyRootCauses.length,
    0,
    `Expected 0 anxiety root_cause insights for Sophie (anxiety=3.0), got ${anxietyRootCauses.length}`
  );
});

// ─── Test 8: Balanced profile returns valid insights array ──────────────────
console.log('\nTest 8: Balanced profile (all ~3.0) returns valid insights array');
test('balanced profile returns insights array (possibly empty, always valid)', () => {
  const { dimensions, studyProfile, learnerProfile } = makeBalancedProfile();
  const result = runCrossReferenceEngine(dimensions, studyProfile, learnerProfile);

  assert.ok(Array.isArray(result.insights), 'insights must be an array');
  assert.ok(typeof result.byType === 'object', 'byType must be an object');

  // All insights should still have valid shape
  for (const insight of result.insights) {
    assert.ok(typeof insight.id === 'string', `insight id must be string, got ${typeof insight.id}`);
    assert.ok(typeof insight.type === 'string', `insight type must be string`);
    assert.ok(typeof insight.impact === 'number', `impact must be number`);
    assert.ok(insight.impact >= 0, `impact must be >= 0`);
  }
});

// ─── Summary ────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
