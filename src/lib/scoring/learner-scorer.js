/**
 * Frontend scorer for the 30 learner profile items (IDs 91-120).
 * No backend involved — all scoring happens client-side.
 *
 * Based on: Grit-S (Duckworth), ASRS/APS-S, SVS (Ryan & Frederick),
 * TIMSS (IEA), MMCS attribution theory
 */

import { learnerItems } from '$lib/data/learner-items.js';

/**
 * Classify a 1-5 score into a three-tier level.
 */
function classifyLevel(score) {
	if (score >= 3.5) return 'high';
	if (score >= 2.5) return 'moderate';
	return 'low';
}

/**
 * Score a subscale from the answers.
 * @param {object} answers - { [itemId]: 1-5 }
 * @param {string} domain
 * @param {string} subscale
 * @returns {{ score: number, level: string, items: number }}
 */
function scoreSubscale(answers, domain, subscale) {
	const items = learnerItems.filter((i) => i.domain === domain && i.subscale === subscale);
	if (items.length === 0) return { score: 0, level: 'low', items: 0 };

	let total = 0;
	let count = 0;

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

/**
 * Get a raw single-item score (no level classification needed).
 */
function singleItemScore(answers, domain, subscale) {
	const items = learnerItems.filter((i) => i.domain === domain && i.subscale === subscale);
	if (items.length === 0) return 0;
	const raw = answers[items[0].id];
	if (raw === undefined) return 0;
	return items[0].reverse ? 6 - raw : raw;
}

/**
 * Determine subject alignment from passion + confidence scores.
 * @returns {'aligned'|'passion-gap'|'confidence-gap'|'disengaged'}
 */
function classifyAlignment(passion, confidence) {
	const highPassion = passion >= 3.5;
	const highConfidence = confidence >= 3.5;
	if (highPassion && highConfidence) return 'aligned';
	if (!highPassion && highConfidence) return 'passion-gap';
	if (highPassion && !highConfidence) return 'confidence-gap';
	return 'disengaged';
}

/**
 * Determine teacher preference profile from structure + warmth scores.
 * @returns {'warm-structured'|'warm-flexible'|'firm-structured'|'firm-flexible'}
 */
function classifyTeacherProfile(structure, warmth) {
	const highStructure = structure >= 3.5;
	const highWarmth = warmth >= 3.5;
	if (highWarmth && highStructure) return 'warm-structured';
	if (highWarmth && !highStructure) return 'warm-flexible';
	if (!highWarmth && highStructure) return 'firm-structured';
	return 'firm-flexible';
}

/**
 * Determine response type from carrot + stick scores.
 * @returns {'encouragement'|'accountability'|'balanced'}
 */
function classifyResponseType(carrot, stick) {
	const diff = carrot - stick;
	if (diff >= 1) return 'encouragement';
	if (diff <= -1) return 'accountability';
	return 'balanced';
}

/**
 * Determine primary exam barrier from the four attribution scores.
 * @returns {'preparation'|'anxiety'|'time-management'|'external-blame'|'none'}
 */
function classifyPrimaryBarrier(preparation, external, anxiety, timeManagement) {
	// "preparation" is internal locus — not really a barrier if high
	// The barriers are: anxiety, timeManagement, external-blame
	// preparation is actually healthy attribution — high = good

	const barriers = [
		{ key: 'anxiety', score: anxiety },
		{ key: 'time-management', score: timeManagement },
		{ key: 'external-blame', score: external }
	];

	const topBarrier = barriers.sort((a, b) => b.score - a.score)[0];

	// If no barrier is dominant (all below 3), check if preparation is low
	if (topBarrier.score < 3) {
		if (preparation < 2.5) return 'preparation';
		return 'none';
	}

	return topBarrier.key;
}

/**
 * Score all 30 learner items and produce the full learnerProfile object.
 * @param {object} answers - { [itemId]: 1-5 } — only IDs 91-120 needed
 * @returns {object} learnerProfile
 */
export function scoreLearnerProfile(answers) {
	// Domain 4: Grit
	const perseverance = scoreSubscale(answers, 'grit', 'perseverance');
	const consistency = scoreSubscale(answers, 'grit', 'consistency');
	const gritOverall = {
		score: Math.round(((perseverance.score + consistency.score) / 2) * 10) / 10,
		level: classifyLevel((perseverance.score + consistency.score) / 2)
	};

	// Domain 5: Focus & Procrastination
	const concentration = scoreSubscale(answers, 'focus', 'concentration');
	const procrastination = scoreSubscale(answers, 'focus', 'procrastination');

	// Domain 6: Energy
	const vitality = scoreSubscale(answers, 'energy', 'vitality');
	const depletion = scoreSubscale(answers, 'energy', 'depletion');
	const netEnergy = {
		score: Math.round(((vitality.score + depletion.score) / 2) * 10) / 10,
		level: classifyLevel((vitality.score + depletion.score) / 2)
	};

	// Domain 7: Subject Fit
	const mathsPassion = singleItemScore(answers, 'subjectFit', 'mathsPassion');
	const mathsConfidence = singleItemScore(answers, 'subjectFit', 'mathsConfidence');
	const englishPassion = singleItemScore(answers, 'subjectFit', 'englishPassion');
	const englishConfidence = singleItemScore(answers, 'subjectFit', 'englishConfidence');
	const sciencePassion = singleItemScore(answers, 'subjectFit', 'sciencePassion');
	const scienceConfidence = singleItemScore(answers, 'subjectFit', 'scienceConfidence');

	// Domain 8: Teacher Preference
	const structureScore = singleItemScore(answers, 'teacherPreference', 'structure');
	const warmthScore = singleItemScore(answers, 'teacherPreference', 'warmth');
	const carrotScore = singleItemScore(answers, 'teacherPreference', 'carrot');
	const stickScore = singleItemScore(answers, 'teacherPreference', 'stick');

	// Domain 9: Exam Barriers
	const preparationScore = singleItemScore(answers, 'examBarriers', 'preparation');
	const externalScore = singleItemScore(answers, 'examBarriers', 'external');
	const anxietyScore = singleItemScore(answers, 'examBarriers', 'anxiety');
	const timeMgmtScore = singleItemScore(answers, 'examBarriers', 'timeManagement');

	return {
		grit: {
			perseverance,
			consistency,
			overall: gritOverall
		},
		focus: {
			concentration,
			procrastination
		},
		energy: {
			vitality,
			depletion,
			netEnergy
		},
		subjectFit: {
			maths: {
				passion: mathsPassion,
				confidence: mathsConfidence,
				alignment: classifyAlignment(mathsPassion, mathsConfidence)
			},
			english: {
				passion: englishPassion,
				confidence: englishConfidence,
				alignment: classifyAlignment(englishPassion, englishConfidence)
			},
			science: {
				passion: sciencePassion,
				confidence: scienceConfidence,
				alignment: classifyAlignment(sciencePassion, scienceConfidence)
			}
		},
		teacherPreference: {
			structure: structureScore,
			warmth: warmthScore,
			profile: classifyTeacherProfile(structureScore, warmthScore),
			carrot: carrotScore,
			stick: stickScore,
			responseType: classifyResponseType(carrotScore, stickScore)
		},
		examBarriers: {
			preparation: preparationScore,
			external: externalScore,
			anxiety: anxietyScore,
			timeManagement: timeMgmtScore,
			primaryBarrier: classifyPrimaryBarrier(preparationScore, externalScore, anxietyScore, timeMgmtScore)
		}
	};
}
