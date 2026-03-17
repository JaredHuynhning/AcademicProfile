/**
 * Frontend scorer for the 30 study/motivation/self-regulation items (IDs 61-90).
 * No backend involved — all scoring happens client-side.
 *
 * Based on: ASSIST (Entwistle), AMS (Vallerand), MSLQ (Pintrich), MES (Martin)
 */

import { studyItems } from '$lib/data/study-items.js';

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
 * Handles reverse scoring and returns { score, level, items }.
 * @param {object} answers - { [itemId]: 1-5 }
 * @param {string} domain - domain name
 * @param {string} subscale - subscale name
 * @returns {{ score: number, level: string, items: number }}
 */
function scoreSubscale(answers, domain, subscale) {
	const items = studyItems.filter((i) => i.domain === domain && i.subscale === subscale);
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
 * Compute the Self-Determination Index (SDI).
 * Formula: 2×intrinsic + identified - external - 2×amotivation
 * Range: roughly -12 to +15
 *   > 3  → self-determined
 *   0-3  → moderate
 *  -3-0  → controlled
 *   <-3  → amotivated
 */
function computeSDI(intrinsicScore, identifiedScore, externalScore, amotivationScore) {
	return Math.round((2 * intrinsicScore + identifiedScore - externalScore - 2 * amotivationScore) * 10) / 10;
}

/**
 * Classify SDI into a motivation profile label.
 */
function classifyMotivationProfile(sdi) {
	if (sdi > 3) return 'self-determined';
	if (sdi >= 0) return 'moderate';
	if (sdi >= -3) return 'controlled';
	return 'amotivated';
}

/**
 * Classify overall regulation strength from mean of efficacy + planning + effort.
 */
function classifyRegulationStrength(efficacy, planning, effort) {
	const mean = Math.round(((efficacy + planning + effort) / 3) * 10) / 10;
	return classifyLevel(mean);
}

/**
 * Score all 30 study items and produce the full studyProfile object.
 * @param {object} answers - { [itemId]: 1-5 } — only IDs 61-90 needed
 * @returns {object} studyProfile
 */
export function scoreStudyProfile(answers) {
	// Domain 1: Study Approaches
	const deep = scoreSubscale(answers, 'studyApproaches', 'deep');
	const strategic = scoreSubscale(answers, 'studyApproaches', 'strategic');
	const surface = scoreSubscale(answers, 'studyApproaches', 'surface');

	// Domain 2: Motivation
	const intrinsic = scoreSubscale(answers, 'motivation', 'intrinsic');
	const identified = scoreSubscale(answers, 'motivation', 'identified');
	const external = scoreSubscale(answers, 'motivation', 'external');
	const amotivation = scoreSubscale(answers, 'motivation', 'amotivation');

	const sdi = computeSDI(intrinsic.score, identified.score, external.score, amotivation.score);

	// Domain 3: Self-Regulation
	const selfEfficacy = scoreSubscale(answers, 'selfRegulation', 'selfEfficacy');
	const planning = scoreSubscale(answers, 'selfRegulation', 'planning');
	const effortRegulation = scoreSubscale(answers, 'selfRegulation', 'effortRegulation');
	const testAnxiety = scoreSubscale(answers, 'selfRegulation', 'testAnxiety');
	const helpSeeking = scoreSubscale(answers, 'selfRegulation', 'helpSeeking');

	// Derived
	const approaches = { deep, strategic, surface };
	const dominantApproach = Object.entries(approaches)
		.sort(([, a], [, b]) => b.score - a.score)[0][0];

	const motivationProfile = classifyMotivationProfile(sdi);
	const regulationStrength = classifyRegulationStrength(
		selfEfficacy.score,
		planning.score,
		effortRegulation.score
	);

	return {
		studyApproaches: { deep, strategic, surface },
		motivation: { intrinsic, identified, external, amotivation, sdi },
		selfRegulation: { selfEfficacy, planning, effortRegulation, testAnxiety, helpSeeking },
		dominantApproach,
		motivationProfile,
		regulationStrength
	};
}
