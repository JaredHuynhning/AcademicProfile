/**
 * Test datasets for study-scorer.js validation.
 * Run with: node tests/study-scorer.test.js
 *
 * Tests scoring calculations against hand-computed expected values.
 */

// Inline the scoring logic for Node.js (no SvelteKit imports)
const studyItems = [
	{ id: 61, domain: 'studyApproaches', subscale: 'deep', reverse: false },
	{ id: 62, domain: 'studyApproaches', subscale: 'deep', reverse: false },
	{ id: 63, domain: 'studyApproaches', subscale: 'deep', reverse: false },
	{ id: 64, domain: 'studyApproaches', subscale: 'deep', reverse: false },
	{ id: 65, domain: 'studyApproaches', subscale: 'strategic', reverse: false },
	{ id: 66, domain: 'studyApproaches', subscale: 'strategic', reverse: false },
	{ id: 67, domain: 'studyApproaches', subscale: 'strategic', reverse: false },
	{ id: 68, domain: 'studyApproaches', subscale: 'surface', reverse: false },
	{ id: 69, domain: 'studyApproaches', subscale: 'surface', reverse: false },
	{ id: 70, domain: 'studyApproaches', subscale: 'surface', reverse: false },
	{ id: 71, domain: 'motivation', subscale: 'intrinsic', reverse: false },
	{ id: 72, domain: 'motivation', subscale: 'intrinsic', reverse: false },
	{ id: 73, domain: 'motivation', subscale: 'intrinsic', reverse: false },
	{ id: 74, domain: 'motivation', subscale: 'identified', reverse: false },
	{ id: 75, domain: 'motivation', subscale: 'identified', reverse: false },
	{ id: 76, domain: 'motivation', subscale: 'external', reverse: false },
	{ id: 77, domain: 'motivation', subscale: 'external', reverse: false },
	{ id: 78, domain: 'motivation', subscale: 'amotivation', reverse: false },
	{ id: 79, domain: 'motivation', subscale: 'amotivation', reverse: false },
	{ id: 80, domain: 'motivation', subscale: 'amotivation', reverse: false },
	{ id: 81, domain: 'selfRegulation', subscale: 'selfEfficacy', reverse: false },
	{ id: 82, domain: 'selfRegulation', subscale: 'selfEfficacy', reverse: false },
	{ id: 83, domain: 'selfRegulation', subscale: 'planning', reverse: false },
	{ id: 84, domain: 'selfRegulation', subscale: 'planning', reverse: false },
	{ id: 85, domain: 'selfRegulation', subscale: 'effortRegulation', reverse: false },
	{ id: 86, domain: 'selfRegulation', subscale: 'effortRegulation', reverse: false },
	{ id: 87, domain: 'selfRegulation', subscale: 'testAnxiety', reverse: true },
	{ id: 88, domain: 'selfRegulation', subscale: 'testAnxiety', reverse: true },
	{ id: 89, domain: 'selfRegulation', subscale: 'helpSeeking', reverse: false },
	{ id: 90, domain: 'selfRegulation', subscale: 'helpSeeking', reverse: false },
];

function classifyLevel(score) {
	if (score >= 3.5) return 'high';
	if (score >= 2.5) return 'moderate';
	return 'low';
}

function scoreSubscale(answers, domain, subscale) {
	const items = studyItems.filter((i) => i.domain === domain && i.subscale === subscale);
	if (items.length === 0) return { score: 0, level: 'low', items: 0 };
	let total = 0, count = 0;
	for (const item of items) {
		const raw = answers[item.id];
		if (raw === undefined) continue;
		total += item.reverse ? 6 - raw : raw;
		count++;
	}
	if (count === 0) return { score: 0, level: 'low', items: items.length };
	const score = Math.round((total / count) * 10) / 10;
	return { score, level: classifyLevel(score), items: items.length };
}

function computeSDI(intrinsic, identified, external, amotivation) {
	return Math.round((2 * intrinsic + identified - external - 2 * amotivation) * 10) / 10;
}

function classifyMotivationProfile(sdi) {
	if (sdi > 3) return 'self-determined';
	if (sdi >= 0) return 'moderate';
	if (sdi >= -3) return 'controlled';
	return 'amotivated';
}

function classifyRegulationStrength(efficacy, planning, effort) {
	const mean = Math.round(((efficacy + planning + effort) / 3) * 10) / 10;
	return classifyLevel(mean);
}

function scoreStudyProfile(answers) {
	const deep = scoreSubscale(answers, 'studyApproaches', 'deep');
	const strategic = scoreSubscale(answers, 'studyApproaches', 'strategic');
	const surface = scoreSubscale(answers, 'studyApproaches', 'surface');
	const intrinsic = scoreSubscale(answers, 'motivation', 'intrinsic');
	const identified = scoreSubscale(answers, 'motivation', 'identified');
	const external = scoreSubscale(answers, 'motivation', 'external');
	const amotivation = scoreSubscale(answers, 'motivation', 'amotivation');
	const sdi = computeSDI(intrinsic.score, identified.score, external.score, amotivation.score);
	const selfEfficacy = scoreSubscale(answers, 'selfRegulation', 'selfEfficacy');
	const planning = scoreSubscale(answers, 'selfRegulation', 'planning');
	const effortRegulation = scoreSubscale(answers, 'selfRegulation', 'effortRegulation');
	const testAnxiety = scoreSubscale(answers, 'selfRegulation', 'testAnxiety');
	const helpSeeking = scoreSubscale(answers, 'selfRegulation', 'helpSeeking');

	const approaches = { deep, strategic, surface };
	const dominantApproach = Object.entries(approaches).sort(([, a], [, b]) => b.score - a.score)[0][0];
	const motivationProfile = classifyMotivationProfile(sdi);
	const regulationStrength = classifyRegulationStrength(selfEfficacy.score, planning.score, effortRegulation.score);

	return {
		studyApproaches: { deep, strategic, surface },
		motivation: { intrinsic, identified, external, amotivation, sdi },
		selfRegulation: { selfEfficacy, planning, effortRegulation, testAnxiety, helpSeeking },
		dominantApproach,
		motivationProfile,
		regulationStrength
	};
}

// ═══════════════════════════════════════════════════════════════
// TEST DATASETS
// ═══════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;

function assert(condition, msg) {
	if (condition) {
		passed++;
	} else {
		failed++;
		console.error(`  FAIL: ${msg}`);
	}
}

function assertClose(actual, expected, msg, tolerance = 0.01) {
	assert(Math.abs(actual - expected) < tolerance, `${msg}: expected ${expected}, got ${actual}`);
}

// ─── Dataset 1: All 5s (maximum scores) ─────────────────────────
console.log('\n--- Dataset 1: All 5s (ceiling test) ---');
{
	const answers = {};
	for (let id = 61; id <= 90; id++) answers[id] = 5;
	const r = scoreStudyProfile(answers);

	assertClose(r.studyApproaches.deep.score, 5.0, 'deep');
	assertClose(r.studyApproaches.strategic.score, 5.0, 'strategic');
	assertClose(r.studyApproaches.surface.score, 5.0, 'surface');
	assert(r.studyApproaches.deep.level === 'high', 'deep level=high');

	assertClose(r.motivation.intrinsic.score, 5.0, 'intrinsic');
	assertClose(r.motivation.amotivation.score, 5.0, 'amotivation');

	// testAnxiety is reverse-scored: raw 5 → 6-5=1
	assertClose(r.selfRegulation.testAnxiety.score, 1.0, 'testAnxiety (reverse: raw 5 → 1)');
	assert(r.selfRegulation.testAnxiety.level === 'low', 'testAnxiety level=low (high anxiety)');

	// SDI: 2*5 + 5 - 5 - 2*5 = 10+5-5-10 = 0
	assertClose(r.motivation.sdi, 0, 'SDI at all-5s');
	assert(r.motivationProfile === 'moderate', 'motivation profile at all-5s = moderate');

	// Regulation: mean(5,5,5) = 5
	assert(r.regulationStrength === 'high', 'regulation strength = high');

	console.log('  Dataset 1 complete');
}

// ─── Dataset 2: All 1s (floor test) ─────────────────────────────
console.log('\n--- Dataset 2: All 1s (floor test) ---');
{
	const answers = {};
	for (let id = 61; id <= 90; id++) answers[id] = 1;
	const r = scoreStudyProfile(answers);

	assertClose(r.studyApproaches.deep.score, 1.0, 'deep');
	assertClose(r.studyApproaches.surface.score, 1.0, 'surface');

	// testAnxiety reverse: raw 1 → 6-1=5
	assertClose(r.selfRegulation.testAnxiety.score, 5.0, 'testAnxiety (reverse: raw 1 → 5)');
	assert(r.selfRegulation.testAnxiety.level === 'high', 'testAnxiety level=high (calm)');

	// SDI: 2*1 + 1 - 1 - 2*1 = 2+1-1-2 = 0
	assertClose(r.motivation.sdi, 0, 'SDI at all-1s');

	// Regulation: mean(1,1,1) = 1
	assert(r.regulationStrength === 'low', 'regulation strength = low');

	console.log('  Dataset 2 complete');
}

// ─── Dataset 3: Ideal Deep Learner ──────────────────────────────
console.log('\n--- Dataset 3: Ideal deep learner (hand-computed) ---');
{
	const answers = {
		// Deep: all 5 → mean 5.0
		61: 5, 62: 5, 63: 5, 64: 5,
		// Strategic: 4,4,3 → mean 3.67
		65: 4, 66: 4, 67: 3,
		// Surface: 1,1,2 → mean 1.33
		68: 1, 69: 1, 70: 2,
		// Intrinsic: 5,5,4 → mean 4.67
		71: 5, 72: 5, 73: 4,
		// Identified: 4,4 → mean 4.0
		74: 4, 75: 4,
		// External: 2,1 → mean 1.5
		76: 2, 77: 1,
		// Amotivation: 1,1,1 → mean 1.0
		78: 1, 79: 1, 80: 1,
		// Self-efficacy: 5,4 → mean 4.5
		81: 5, 82: 4,
		// Planning: 4,4 → mean 4.0
		83: 4, 84: 4,
		// Effort: 4,5 → mean 4.5
		85: 4, 86: 5,
		// Test anxiety (reverse): 2,2 → 6-2=4,4 → mean 4.0
		87: 2, 88: 2,
		// Help-seeking: 3,4 → mean 3.5
		89: 3, 90: 4,
	};
	const r = scoreStudyProfile(answers);

	assertClose(r.studyApproaches.deep.score, 5.0, 'deep = 5.0');
	assertClose(r.studyApproaches.strategic.score, 3.7, 'strategic = 3.7');
	assertClose(r.studyApproaches.surface.score, 1.3, 'surface = 1.3');
	assert(r.dominantApproach === 'deep', 'dominant = deep');

	assertClose(r.motivation.intrinsic.score, 4.7, 'intrinsic = 4.7');
	assertClose(r.motivation.identified.score, 4.0, 'identified = 4.0');
	assertClose(r.motivation.external.score, 1.5, 'external = 1.5');
	assertClose(r.motivation.amotivation.score, 1.0, 'amotivation = 1.0');

	// SDI: 2*4.7 + 4.0 - 1.5 - 2*1.0 = 9.4 + 4.0 - 1.5 - 2.0 = 9.9
	assertClose(r.motivation.sdi, 9.9, 'SDI = 9.9');
	assert(r.motivationProfile === 'self-determined', 'profile = self-determined');

	assertClose(r.selfRegulation.testAnxiety.score, 4.0, 'testAnxiety (reverse from 2,2) = 4.0');

	// Regulation: mean(4.5, 4.0, 4.5) = 4.33 → high
	assert(r.regulationStrength === 'high', 'regulation = high');

	console.log('  Dataset 3 complete');
}

// ─── Dataset 4: Disengaged Student ──────────────────────────────
console.log('\n--- Dataset 4: Disengaged student ---');
{
	const answers = {
		// Deep: 1,2,1,1 → mean 1.25
		61: 1, 62: 2, 63: 1, 64: 1,
		// Strategic: 1,1,2 → mean 1.33
		65: 1, 66: 1, 67: 2,
		// Surface: 5,5,4 → mean 4.67
		68: 5, 69: 5, 70: 4,
		// Intrinsic: 1,2,1 → mean 1.33
		71: 1, 72: 2, 73: 1,
		// Identified: 1,2 → mean 1.5
		74: 1, 75: 2,
		// External: 4,5 → mean 4.5
		76: 4, 77: 5,
		// Amotivation: 5,5,4 → mean 4.67
		78: 5, 79: 5, 80: 4,
		// Self-efficacy: 1,2 → mean 1.5
		81: 1, 82: 2,
		// Planning: 1,1 → mean 1.0
		83: 1, 84: 1,
		// Effort: 1,2 → mean 1.5
		85: 1, 86: 2,
		// Test anxiety (reverse): 5,5 → 1,1 → mean 1.0
		87: 5, 88: 5,
		// Help-seeking: 1,1 → mean 1.0
		89: 1, 90: 1,
	};
	const r = scoreStudyProfile(answers);

	assert(r.dominantApproach === 'surface', 'dominant = surface');
	assertClose(r.studyApproaches.surface.score, 4.7, 'surface = 4.7');

	assertClose(r.motivation.amotivation.score, 4.7, 'amotivation = 4.7');

	// SDI: 2*1.3 + 1.5 - 4.5 - 2*4.7 = 2.6 + 1.5 - 4.5 - 9.4 = -9.8
	assertClose(r.motivation.sdi, -9.8, 'SDI = -9.8');
	assert(r.motivationProfile === 'amotivated', 'profile = amotivated');

	assertClose(r.selfRegulation.testAnxiety.score, 1.0, 'testAnxiety high anxiety = 1.0');

	// Regulation: mean(1.5, 1.0, 1.5) = 1.33 → low
	assert(r.regulationStrength === 'low', 'regulation = low');

	console.log('  Dataset 4 complete');
}

// ─── Dataset 5: Balanced/Neutral Student ────────────────────────
console.log('\n--- Dataset 5: All 3s (neutral) ---');
{
	const answers = {};
	for (let id = 61; id <= 90; id++) answers[id] = 3;
	const r = scoreStudyProfile(answers);

	assertClose(r.studyApproaches.deep.score, 3.0, 'deep = 3.0');
	assertClose(r.studyApproaches.strategic.score, 3.0, 'strategic = 3.0');
	assertClose(r.studyApproaches.surface.score, 3.0, 'surface = 3.0');

	// testAnxiety reverse: raw 3 → 6-3=3
	assertClose(r.selfRegulation.testAnxiety.score, 3.0, 'testAnxiety neutral = 3.0');

	// SDI: 2*3 + 3 - 3 - 2*3 = 6+3-3-6 = 0
	assertClose(r.motivation.sdi, 0, 'SDI neutral = 0');
	assert(r.motivationProfile === 'moderate', 'profile = moderate');

	// All levels should be moderate
	assert(r.studyApproaches.deep.level === 'moderate', 'deep level=moderate');
	assert(r.motivation.intrinsic.level === 'moderate', 'intrinsic level=moderate');
	assert(r.selfRegulation.selfEfficacy.level === 'moderate', 'efficacy level=moderate');

	// Regulation: mean(3,3,3) = 3 → moderate
	assert(r.regulationStrength === 'moderate', 'regulation = moderate');

	console.log('  Dataset 5 complete');
}

// ─── Dataset 6: SDI boundary cases ──────────────────────────────
console.log('\n--- Dataset 6: SDI boundary tests ---');
{
	// Test SDI = exactly 3 → should be 'moderate' (not self-determined, since > 3 is required)
	assert(classifyMotivationProfile(3) === 'moderate', 'SDI=3 → moderate');
	assert(classifyMotivationProfile(3.1) === 'self-determined', 'SDI=3.1 → self-determined');
	assert(classifyMotivationProfile(0) === 'moderate', 'SDI=0 → moderate');
	assert(classifyMotivationProfile(-0.1) === 'controlled', 'SDI=-0.1 → controlled');
	assert(classifyMotivationProfile(-3) === 'controlled', 'SDI=-3 → controlled');
	assert(classifyMotivationProfile(-3.1) === 'amotivated', 'SDI=-3.1 → amotivated');
	console.log('  Dataset 6 complete');
}

// ─── Dataset 7: Level boundary tests ────────────────────────────
console.log('\n--- Dataset 7: Level classification boundaries ---');
{
	assert(classifyLevel(3.5) === 'high', '3.5 → high');
	assert(classifyLevel(3.49) === 'moderate', '3.49 → moderate');
	assert(classifyLevel(2.5) === 'moderate', '2.5 → moderate');
	assert(classifyLevel(2.49) === 'low', '2.49 → low');
	assert(classifyLevel(5.0) === 'high', '5.0 → high');
	assert(classifyLevel(1.0) === 'low', '1.0 → low');
	console.log('  Dataset 7 complete');
}

// ─── Dataset 8: Reverse scoring validation ──────────────────────
console.log('\n--- Dataset 8: Reverse scoring (testAnxiety) ---');
{
	// Items 87 + 88 are reverse-scored
	// Raw answers: 87=1, 88=5
	// Reversed: 6-1=5, 6-5=1 → mean = 3.0
	const answers = {};
	for (let id = 61; id <= 90; id++) answers[id] = 3; // baseline
	answers[87] = 1;
	answers[88] = 5;
	const r = scoreStudyProfile(answers);
	assertClose(r.selfRegulation.testAnxiety.score, 3.0, 'reverse mixed (1,5) → mean 3.0');

	// Raw: 87=4, 88=4 → reversed: 2,2 → mean 2.0
	answers[87] = 4;
	answers[88] = 4;
	const r2 = scoreStudyProfile(answers);
	assertClose(r2.selfRegulation.testAnxiety.score, 2.0, 'reverse (4,4) → mean 2.0');

	console.log('  Dataset 8 complete');
}

// ─── Dataset 9: Partial answers (missing items) ─────────────────
console.log('\n--- Dataset 9: Partial answers ---');
{
	// Only answer 2 of 4 deep items
	const answers = { 61: 5, 62: 4 }; // mean = 4.5
	const r = scoreStudyProfile(answers);
	assertClose(r.studyApproaches.deep.score, 4.5, 'partial deep (2/4 items) = 4.5');
	assert(r.studyApproaches.deep.items === 4, 'items count still 4 (total available)');

	// No answers at all for strategic → score 0
	assertClose(r.studyApproaches.strategic.score, 0, 'no strategic answers = 0');
	console.log('  Dataset 9 complete');
}

// ═══════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'═'.repeat(50)}`);
process.exit(failed > 0 ? 1 : 0);
