/**
 * Test datasets for learner-scorer.js validation.
 * Run with: node tests/learner-scorer.test.js
 *
 * Tests scoring calculations against hand-computed expected values.
 */

// Inline items for Node.js (no SvelteKit imports)
const learnerItems = [
	{ id: 91, domain: 'grit', subscale: 'perseverance', reverse: false },
	{ id: 92, domain: 'grit', subscale: 'perseverance', reverse: false },
	{ id: 93, domain: 'grit', subscale: 'perseverance', reverse: false },
	{ id: 94, domain: 'grit', subscale: 'consistency', reverse: true },
	{ id: 95, domain: 'grit', subscale: 'consistency', reverse: true },
	{ id: 96, domain: 'grit', subscale: 'consistency', reverse: true },
	{ id: 97, domain: 'focus', subscale: 'concentration', reverse: true },
	{ id: 98, domain: 'focus', subscale: 'concentration', reverse: false },
	{ id: 99, domain: 'focus', subscale: 'concentration', reverse: true },
	{ id: 100, domain: 'focus', subscale: 'procrastination', reverse: true },
	{ id: 101, domain: 'focus', subscale: 'procrastination', reverse: true },
	{ id: 102, domain: 'focus', subscale: 'procrastination', reverse: true },
	{ id: 103, domain: 'energy', subscale: 'vitality', reverse: false },
	{ id: 104, domain: 'energy', subscale: 'vitality', reverse: false },
	{ id: 105, domain: 'energy', subscale: 'depletion', reverse: true },
	{ id: 106, domain: 'energy', subscale: 'depletion', reverse: true },
	{ id: 107, domain: 'subjectFit', subscale: 'mathsPassion', reverse: false },
	{ id: 108, domain: 'subjectFit', subscale: 'mathsConfidence', reverse: false },
	{ id: 109, domain: 'subjectFit', subscale: 'englishPassion', reverse: false },
	{ id: 110, domain: 'subjectFit', subscale: 'englishConfidence', reverse: false },
	{ id: 111, domain: 'subjectFit', subscale: 'sciencePassion', reverse: false },
	{ id: 112, domain: 'subjectFit', subscale: 'scienceConfidence', reverse: false },
	{ id: 113, domain: 'teacherPreference', subscale: 'structure', reverse: false },
	{ id: 114, domain: 'teacherPreference', subscale: 'warmth', reverse: false },
	{ id: 115, domain: 'teacherPreference', subscale: 'carrot', reverse: false },
	{ id: 116, domain: 'teacherPreference', subscale: 'stick', reverse: false },
	{ id: 117, domain: 'examBarriers', subscale: 'preparation', reverse: false },
	{ id: 118, domain: 'examBarriers', subscale: 'external', reverse: false },
	{ id: 119, domain: 'examBarriers', subscale: 'anxiety', reverse: false },
	{ id: 120, domain: 'examBarriers', subscale: 'timeManagement', reverse: false },
];

// --- Inline scoring logic (mirrors learner-scorer.js) ---

function classifyLevel(score) {
	if (score >= 3.5) return 'high';
	if (score >= 2.5) return 'moderate';
	return 'low';
}

function scoreSubscale(answers, domain, subscale) {
	const items = learnerItems.filter((i) => i.domain === domain && i.subscale === subscale);
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

function singleItemScore(answers, domain, subscale) {
	const items = learnerItems.filter((i) => i.domain === domain && i.subscale === subscale);
	if (items.length === 0) return 0;
	const raw = answers[items[0].id];
	if (raw === undefined) return 0;
	return items[0].reverse ? 6 - raw : raw;
}

function classifyAlignment(passion, confidence) {
	const highPassion = passion >= 3.5;
	const highConfidence = confidence >= 3.5;
	if (highPassion && highConfidence) return 'aligned';
	if (!highPassion && highConfidence) return 'passion-gap';
	if (highPassion && !highConfidence) return 'confidence-gap';
	return 'disengaged';
}

function classifyTeacherProfile(structure, warmth) {
	const highStructure = structure >= 3.5;
	const highWarmth = warmth >= 3.5;
	if (highWarmth && highStructure) return 'warm-structured';
	if (highWarmth && !highStructure) return 'warm-flexible';
	if (!highWarmth && highStructure) return 'firm-structured';
	return 'firm-flexible';
}

function classifyResponseType(carrot, stick) {
	const diff = carrot - stick;
	if (diff >= 1) return 'encouragement';
	if (diff <= -1) return 'accountability';
	return 'balanced';
}

function classifyPrimaryBarrier(preparation, external, anxiety, timeManagement) {
	const barriers = [
		{ key: 'anxiety', score: anxiety },
		{ key: 'time-management', score: timeManagement },
		{ key: 'external-blame', score: external }
	];
	const topBarrier = barriers.sort((a, b) => b.score - a.score)[0];
	if (topBarrier.score < 3) {
		if (preparation < 2.5) return 'preparation';
		return 'none';
	}
	return topBarrier.key;
}

function scoreLearnerProfile(answers) {
	const perseverance = scoreSubscale(answers, 'grit', 'perseverance');
	const consistency = scoreSubscale(answers, 'grit', 'consistency');
	const gritOverall = {
		score: Math.round(((perseverance.score + consistency.score) / 2) * 10) / 10,
		level: classifyLevel((perseverance.score + consistency.score) / 2)
	};
	const concentration = scoreSubscale(answers, 'focus', 'concentration');
	const procrastination = scoreSubscale(answers, 'focus', 'procrastination');
	const vitality = scoreSubscale(answers, 'energy', 'vitality');
	const depletion = scoreSubscale(answers, 'energy', 'depletion');
	const netEnergy = {
		score: Math.round(((vitality.score + depletion.score) / 2) * 10) / 10,
		level: classifyLevel((vitality.score + depletion.score) / 2)
	};
	const mathsPassion = singleItemScore(answers, 'subjectFit', 'mathsPassion');
	const mathsConfidence = singleItemScore(answers, 'subjectFit', 'mathsConfidence');
	const englishPassion = singleItemScore(answers, 'subjectFit', 'englishPassion');
	const englishConfidence = singleItemScore(answers, 'subjectFit', 'englishConfidence');
	const sciencePassion = singleItemScore(answers, 'subjectFit', 'sciencePassion');
	const scienceConfidence = singleItemScore(answers, 'subjectFit', 'scienceConfidence');
	const structureScore = singleItemScore(answers, 'teacherPreference', 'structure');
	const warmthScore = singleItemScore(answers, 'teacherPreference', 'warmth');
	const carrotScore = singleItemScore(answers, 'teacherPreference', 'carrot');
	const stickScore = singleItemScore(answers, 'teacherPreference', 'stick');
	const preparationScore = singleItemScore(answers, 'examBarriers', 'preparation');
	const externalScore = singleItemScore(answers, 'examBarriers', 'external');
	const anxietyScore = singleItemScore(answers, 'examBarriers', 'anxiety');
	const timeMgmtScore = singleItemScore(answers, 'examBarriers', 'timeManagement');

	return {
		grit: { perseverance, consistency, overall: gritOverall },
		focus: { concentration, procrastination },
		energy: { vitality, depletion, netEnergy },
		subjectFit: {
			maths: { passion: mathsPassion, confidence: mathsConfidence, alignment: classifyAlignment(mathsPassion, mathsConfidence) },
			english: { passion: englishPassion, confidence: englishConfidence, alignment: classifyAlignment(englishPassion, englishConfidence) },
			science: { passion: sciencePassion, confidence: scienceConfidence, alignment: classifyAlignment(sciencePassion, scienceConfidence) }
		},
		teacherPreference: {
			structure: structureScore, warmth: warmthScore,
			profile: classifyTeacherProfile(structureScore, warmthScore),
			carrot: carrotScore, stick: stickScore,
			responseType: classifyResponseType(carrotScore, stickScore)
		},
		examBarriers: {
			preparation: preparationScore, external: externalScore,
			anxiety: anxietyScore, timeManagement: timeMgmtScore,
			primaryBarrier: classifyPrimaryBarrier(preparationScore, externalScore, anxietyScore, timeMgmtScore)
		}
	};
}

// --- Test framework ---
let passed = 0;
let failed = 0;

function assert(condition, message) {
	if (condition) {
		passed++;
	} else {
		failed++;
		console.error(`  FAIL: ${message}`);
	}
}

function assertEq(actual, expected, label) {
	const match = typeof expected === 'number'
		? Math.abs(actual - expected) < 0.05
		: actual === expected;
	assert(match, `${label}: expected ${expected}, got ${actual}`);
}

// --- Datasets ---

function makeAnswers(defaultValue) {
	const answers = {};
	for (let id = 91; id <= 120; id++) {
		answers[id] = defaultValue;
	}
	return answers;
}

console.log('\n--- Dataset 1: All 5s (ceiling) ---');
{
	const result = scoreLearnerProfile(makeAnswers(5));

	// Grit: perseverance items are forward (5→5), consistency items are reverse (5→1)
	assertEq(result.grit.perseverance.score, 5.0, 'perseverance ceiling');
	assertEq(result.grit.consistency.score, 1.0, 'consistency ceiling (reversed)');
	assertEq(result.grit.overall.score, 3.0, 'grit overall ceiling');

	// Focus: concentration has 2 reverse + 1 forward → (1+5+1)/3 = 2.3
	assertEq(result.focus.concentration.score, 2.3, 'concentration ceiling');
	assertEq(result.focus.procrastination.score, 1.0, 'procrastination ceiling (all reverse)');

	// Energy: vitality forward (5), depletion reverse (1)
	assertEq(result.energy.vitality.score, 5.0, 'vitality ceiling');
	assertEq(result.energy.depletion.score, 1.0, 'depletion ceiling (reversed)');
	assertEq(result.energy.netEnergy.score, 3.0, 'net energy ceiling');

	// Subject fit: all 5
	assertEq(result.subjectFit.maths.passion, 5, 'maths passion ceiling');
	assertEq(result.subjectFit.maths.alignment, 'aligned', 'maths alignment ceiling');

	// Teacher: all 5
	assertEq(result.teacherPreference.profile, 'warm-structured', 'teacher profile ceiling');
	assertEq(result.teacherPreference.responseType, 'balanced', 'response type ceiling');

	// Exam barriers: all 5
	assertEq(result.examBarriers.primaryBarrier, 'anxiety', 'barrier ceiling (anxiety highest alphabetically tied)');

	console.log('  Dataset 1 complete');
}

console.log('\n--- Dataset 2: All 1s (floor) ---');
{
	const result = scoreLearnerProfile(makeAnswers(1));

	assertEq(result.grit.perseverance.score, 1.0, 'perseverance floor');
	assertEq(result.grit.consistency.score, 5.0, 'consistency floor (reversed)');
	assertEq(result.grit.overall.score, 3.0, 'grit overall floor');

	// Concentration: 2 reverse (6-1=5) + 1 forward (1) = (5+1+5)/3 = 3.7
	assertEq(result.focus.concentration.score, 3.7, 'concentration floor');
	assertEq(result.focus.procrastination.score, 5.0, 'procrastination floor (reversed)');

	assertEq(result.energy.vitality.score, 1.0, 'vitality floor');
	assertEq(result.energy.depletion.score, 5.0, 'depletion floor (reversed)');

	assertEq(result.subjectFit.maths.alignment, 'disengaged', 'maths alignment floor');
	assertEq(result.teacherPreference.profile, 'firm-flexible', 'teacher profile floor');

	console.log('  Dataset 2 complete');
}

console.log('\n--- Dataset 3: Gritty focused student ---');
{
	const answers = makeAnswers(3);
	// High grit
	answers[91] = 5; answers[92] = 5; answers[93] = 5; // perseverance: 5.0
	answers[94] = 1; answers[95] = 1; answers[96] = 1; // consistency reverse: 6-1=5 → 5.0
	// High focus
	answers[97] = 1; answers[98] = 5; answers[99] = 1; // concentration: (5+5+5)/3=5.0
	answers[100] = 1; answers[101] = 1; answers[102] = 1; // procrastination reverse: 5.0

	const result = scoreLearnerProfile(answers);
	assertEq(result.grit.perseverance.score, 5.0, 'gritty perseverance');
	assertEq(result.grit.consistency.score, 5.0, 'gritty consistency');
	assertEq(result.grit.overall.score, 5.0, 'gritty overall');
	assertEq(result.grit.overall.level, 'high', 'gritty level');

	assertEq(result.focus.concentration.score, 5.0, 'gritty concentration');
	assertEq(result.focus.procrastination.score, 5.0, 'gritty no-procrastination');

	console.log('  Dataset 3 complete');
}

console.log('\n--- Dataset 4: Subject fit alignments ---');
{
	const answers = makeAnswers(3);
	// Maths: high passion (4) + high confidence (5) → aligned
	answers[107] = 4; answers[108] = 5;
	// English: low passion (2) + high confidence (4) → passion-gap
	answers[109] = 2; answers[110] = 4;
	// Science: high passion (5) + low confidence (2) → confidence-gap
	answers[111] = 5; answers[112] = 2;

	const result = scoreLearnerProfile(answers);
	assertEq(result.subjectFit.maths.alignment, 'aligned', 'maths aligned');
	assertEq(result.subjectFit.english.alignment, 'passion-gap', 'english passion-gap');
	assertEq(result.subjectFit.science.alignment, 'confidence-gap', 'science confidence-gap');

	console.log('  Dataset 4 complete');
}

console.log('\n--- Dataset 5: Teacher preference profiles ---');
{
	// warm-structured: structure=4, warmth=4
	const a1 = makeAnswers(3);
	a1[113] = 4; a1[114] = 4;
	assertEq(scoreLearnerProfile(a1).teacherPreference.profile, 'warm-structured', 'warm-structured');

	// warm-flexible: structure=2, warmth=5
	const a2 = makeAnswers(3);
	a2[113] = 2; a2[114] = 5;
	assertEq(scoreLearnerProfile(a2).teacherPreference.profile, 'warm-flexible', 'warm-flexible');

	// firm-structured: structure=5, warmth=2
	const a3 = makeAnswers(3);
	a3[113] = 5; a3[114] = 2;
	assertEq(scoreLearnerProfile(a3).teacherPreference.profile, 'firm-structured', 'firm-structured');

	// firm-flexible: structure=2, warmth=2
	const a4 = makeAnswers(3);
	a4[113] = 2; a4[114] = 2;
	assertEq(scoreLearnerProfile(a4).teacherPreference.profile, 'firm-flexible', 'firm-flexible');

	console.log('  Dataset 5 complete');
}

console.log('\n--- Dataset 6: Response types ---');
{
	// encouragement: carrot=5, stick=2
	const a1 = makeAnswers(3);
	a1[115] = 5; a1[116] = 2;
	assertEq(scoreLearnerProfile(a1).teacherPreference.responseType, 'encouragement', 'encouragement');

	// accountability: carrot=2, stick=5
	const a2 = makeAnswers(3);
	a2[115] = 2; a2[116] = 5;
	assertEq(scoreLearnerProfile(a2).teacherPreference.responseType, 'accountability', 'accountability');

	// balanced: carrot=3, stick=3
	const a3 = makeAnswers(3);
	a3[115] = 3; a3[116] = 3;
	assertEq(scoreLearnerProfile(a3).teacherPreference.responseType, 'balanced', 'balanced');

	console.log('  Dataset 6 complete');
}

console.log('\n--- Dataset 7: Exam barrier primary ---');
{
	// Anxiety dominant
	const a1 = makeAnswers(3);
	a1[117] = 4; a1[118] = 2; a1[119] = 5; a1[120] = 2;
	assertEq(scoreLearnerProfile(a1).examBarriers.primaryBarrier, 'anxiety', 'anxiety barrier');

	// Time management dominant
	const a2 = makeAnswers(3);
	a2[117] = 3; a2[118] = 2; a2[119] = 2; a2[120] = 4;
	assertEq(scoreLearnerProfile(a2).examBarriers.primaryBarrier, 'time-management', 'time-management barrier');

	// External blame dominant
	const a3 = makeAnswers(3);
	a3[117] = 3; a3[118] = 4; a3[119] = 2; a3[120] = 2;
	assertEq(scoreLearnerProfile(a3).examBarriers.primaryBarrier, 'external-blame', 'external-blame barrier');

	// No barriers (all below 3)
	const a4 = makeAnswers(3);
	a4[117] = 4; a4[118] = 2; a4[119] = 2; a4[120] = 2;
	assertEq(scoreLearnerProfile(a4).examBarriers.primaryBarrier, 'none', 'no barrier');

	console.log('  Dataset 7 complete');
}

console.log('\n--- Dataset 8: Partial answers ---');
{
	const answers = { 91: 4, 92: 4, 107: 5, 108: 5 };
	const result = scoreLearnerProfile(answers);
	assertEq(result.grit.perseverance.score, 4.0, 'partial perseverance');
	assertEq(result.grit.perseverance.items, 3, 'partial perseverance item count');
	assertEq(result.subjectFit.maths.passion, 5, 'partial maths passion');
	assertEq(result.subjectFit.english.passion, 0, 'missing english passion');

	console.log('  Dataset 8 complete');
}

console.log('\n--- Dataset 9: Energy net score ---');
{
	const answers = makeAnswers(3);
	answers[103] = 5; answers[104] = 5; // vitality: 5.0
	answers[105] = 1; answers[106] = 1; // depletion reverse: 5.0
	const result = scoreLearnerProfile(answers);
	assertEq(result.energy.vitality.score, 5.0, 'high vitality');
	assertEq(result.energy.depletion.score, 5.0, 'high depletion recovery');
	assertEq(result.energy.netEnergy.score, 5.0, 'max net energy');
	assertEq(result.energy.netEnergy.level, 'high', 'high energy level');

	console.log('  Dataset 9 complete');
}

console.log('\n══════════════════════════════════════════════════');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('══════════════════════════════════════════════════\n');

if (failed > 0) process.exit(1);
