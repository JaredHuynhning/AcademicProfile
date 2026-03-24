// @ts-nocheck
/**
 * Section C6: Action Plan
 * Top 3 actions, quick wins, study prescription, stop-doing list, weekly rhythm.
 */
import { classifyLevel, DIM_NAMES } from './helpers';

export function generateActionPlan(results, crossRefResult) {
	const dims = results.dimensions;
	const sp = results.studyProfile;

	const rootCauses = [...(crossRefResult.byType.root_cause || [])].sort(
		(a, b) => b.impact - a.impact
	);
	const confirmations = [...(crossRefResult.byType.confirmation || [])].sort(
		(a, b) => b.impact - a.impact
	);
	const contradictions = [...(crossRefResult.byType.contradiction || [])];

	const topActions = rootCauses.slice(0, 3).map((insight, i) => ({
		rank: i + 1,
		description: `Priority ${i + 1}: ${insight.action}. Why: ${insight.insight}. This connects your ${
			insight.personality.facet
				? `${insight.personality.facet} (${DIM_NAMES[insight.personality.dim]})`
				: DIM_NAMES[insight.personality.dim]
		} personality trait to your ${insight.academic.metric} study pattern. Addressing this first will have the biggest impact on your academic performance.`
	}));

	const quickWins = confirmations.slice(0, 4).map((insight) => ({
		description: `${insight.action}. This builds on a confirmed strength: ${insight.insight}`
	}));

	// Study prescription
	const cLevel = classifyLevel(dims?.C?.score ?? 3);
	const dominantApproach = sp?.dominantApproach || 'strategic';
	const anxietyScore = dims?.E?.facets?.anxiety?.score ?? 2;
	const testAnxiety = sp?.selfRegulation?.testAnxiety?.score ?? 2;
	const highAnxiety = anxietyScore >= 3.5 || testAnxiety >= 3.5;

	let method, rationale;

	if (cLevel === 'high' && dominantApproach === 'deep') {
		method = 'Cornell Notes + Spaced Repetition';
		rationale = 'Your conscientiousness and deep learning approach are perfectly matched to a structured note system combined with spaced review intervals. This maximises retention without adding effort.';
	} else if (cLevel === 'high' && dominantApproach === 'strategic') {
		method = 'Pomodoro + Weekly Review Cycles';
		rationale = 'Your organised, strategic mindset works best with timed, focused blocks and regular reviews. Pomodoro gives you sprint structure; weekly reviews keep the big picture on track.';
	} else if (dominantApproach === 'surface') {
		method = 'Active Recall — close notes and test yourself';
		rationale = 'Surface-level studying means reading and re-reading without retrieval practice. Close your notes and force yourself to recall the material — the effort of retrieval is exactly what builds long-term memory.';
	} else if (cLevel === 'low') {
		method = 'Body Doubling — study with someone present for accountability';
		rationale = 'Low conscientiousness makes it hard to self-regulate. Having another person present (even quietly on a video call) provides the external structure your brain is missing.';
	} else {
		method = 'Interleaved Practice';
		rationale = 'Mix different subjects or problem types in a single session rather than blocking one topic. This feels harder but produces far better long-term retention.';
	}

	if (highAnxiety) {
		method += ' + Pre-study calming routine (box breathing 4-4-4-4)';
		rationale += ' Anxiety is a real factor in your profile — a short calming routine before studying prevents anxiety from hijacking your focus before you even start.';
	}

	const studyPrescription = { method, rationale };

	// Stop doing — from contradictions and counterproductive root causes
	const stopDoing = [
		...contradictions.map((i) => ({
			description: `Stop: ${i.insight.split('.')[0]}. Instead: ${i.action}. This change addresses the root cause rather than just the symptom.`
		})),
		...rootCauses.slice(0, 2).map((i) => ({
			description: `Watch for: ${i.visibleBehaviour || i.insight.split('.')[0]}. Root cause: ${i.insight}. ${i.action || ''}`
		}))
	].slice(0, 4);

	// Weekly rhythm
	const xLevel = classifyLevel(dims?.X?.score ?? 3);
	const energyScore = results.learnerProfile?.energy?.netEnergy?.score ?? 3;

	const weekday =
		xLevel === 'high'
			? 'After school: 30-45 min study with a peer or group. Evening: 45-60 min independent focused review.'
			: energyScore < 2.5
				? 'After school: short 20-min review to capture key points while fresh. Evening: 30-40 min focused study with breaks.'
				: 'After school: 30-45 min review + planner update. Evening: 45-60 min focused study.';

	const weekend =
		dominantApproach === 'deep'
			? 'Saturday: deep-dive one topic — read beyond the notes, ask questions. Sunday: light review + plan the coming week.'
			: 'Saturday: practice problems and revision. Sunday: light review + plan next week.';

	const weeklyRhythm = {
		description: `${weekday} ${weekend} Consistency matters more than duration. Three 30-minute sessions beat one 3-hour cramming session every time.`
	};

	// Build narrative prose
	const narrativeParts = [];

	if (topActions.length > 0) {
		narrativeParts.push(`Based on the cross-analysis of your personality and academic data, the single most impactful change you can make is: ${topActions[0].description}`);
	}

	narrativeParts.push(`Your recommended study method is ${studyPrescription.method}. ${studyPrescription.rationale}`);

	if (quickWins.length > 0) {
		const qwText = quickWins.slice(0, 2).map(q => q.description).join(' Additionally, ');
		narrativeParts.push(`For quick momentum: ${qwText}`);
	}

	narrativeParts.push(weeklyRhythm.description);

	const narrative = narrativeParts.join('\n\n');

	return {
		narrative,
		topActions,
		quickWins,
		studyPrescription,
		stopDoing,
		weeklyRhythm
	};
}
