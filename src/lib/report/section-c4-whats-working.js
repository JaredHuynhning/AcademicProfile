/**
 * Section C4: What's Working
 * Confirmed strengths, untapped potential, learned skills, strength stack.
 */
import { formatScore } from './helpers.js';

const HIGH_ACADEMIC_METRICS = [
	{ key: 'studyProfile.studyApproaches.deep', label: 'Deep Learning Approach', description: 'You actively seek to understand underlying concepts rather than just memorising.' },
	{ key: 'studyProfile.studyApproaches.strategic', label: 'Strategic Study Approach', description: 'You organise your learning around achieving the best outcomes efficiently.' },
	{ key: 'studyProfile.motivation.intrinsic', label: 'Intrinsic Motivation', description: 'You genuinely enjoy learning for its own sake — not just for grades.' },
	{ key: 'studyProfile.selfRegulation.selfEfficacy', label: 'Self-Efficacy', description: 'You believe in your ability to succeed when you apply yourself.' },
	{ key: 'studyProfile.selfRegulation.planning', label: 'Planning & Organisation', description: 'You plan your study time and keep yourself on track.' },
	{ key: 'learnerProfile.grit.perseverance', label: 'Perseverance of Effort', description: 'You follow through on goals even when progress is slow.' },
	{ key: 'learnerProfile.focus.concentration', label: 'Concentration', description: 'You can sustain focus during study sessions.' }
];

function resolvePath(results, pathStr) {
	const parts = pathStr.split('.');
	let cur = results;
	for (const part of parts) {
		if (cur == null) return undefined;
		cur = cur[part];
	}
	if (typeof cur === 'number') return cur;
	if (cur != null && typeof cur === 'object' && 'score' in cur) return cur.score;
	return undefined;
}

export function generateWhatsWorking(results, crossRefResult) {
	const confirmed = [...(crossRefResult.byType.confirmation || [])].sort(
		(a, b) => b.impact - a.impact
	);
	const untapped = [...(crossRefResult.byType.untapped || [])];

	// Find "learned skills" — high academic metrics not covered by a confirmation rule
	const confirmedPaths = new Set(confirmed.map((i) => i.academic.path));

	const learnedSkills = [];
	for (const metric of HIGH_ACADEMIC_METRICS) {
		const pathParts = metric.key.split('.');
		// Build the path as it appears in insights (without the top-level source key)
		const insightPath = pathParts.slice(1).join('.');
		if (confirmedPaths.has(insightPath)) continue;

		const score = resolvePath(results, metric.key);
		if (score != null && score >= 3.5) {
			learnedSkills.push({
				metric: metric.label,
				score: formatScore(score),
				description: metric.description
			});
		}
	}

	// Strength stack: top 5 combined by impact
	const allStrengths = [
		...confirmed.map((i) => ({ rank: 0, name: i.insight.split(' — ')[0].slice(0, 60), source: 'confirmed', description: i.insight, impact: i.impact })),
		...untapped.map((i) => ({ rank: 0, name: i.insight.split(' — ')[0].slice(0, 60), source: 'untapped', description: i.insight, impact: i.impact || 0 }))
	]
		.sort((a, b) => b.impact - a.impact)
		.slice(0, 5)
		.map((s, i) => ({ ...s, rank: i + 1 }));

	const fallbackMessage =
		confirmed.length < 3
			? 'Your scores are well-balanced — you have a solid foundation across the board.'
			: null;

	return {
		confirmed,
		untapped,
		learnedSkills,
		strengthStack: allStrengths,
		fallbackMessage
	};
}
