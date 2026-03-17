/**
 * Section 12: Academic Character
 * Generates narrative analysis of grit, focus, procrastination, and energy.
 * Cross-references with HEXACO Conscientiousness and effort regulation where available.
 */

import { dimScore, isHigh, isLow } from './helpers.js';

const GRIT_NARRATIVES = {
	high: {
		perseverance: 'You show strong perseverance — when you start something, you see it through to the end, even when it gets tough. This is one of the most important predictors of long-term academic success.',
		consistency: 'You maintain consistent focus on your goals. You don\'t flit from interest to interest — when you commit, you stay the course.',
		combined: 'Your overall grit is impressive. You combine the ability to push through difficulty with long-term goal commitment. Research by Angela Duckworth shows this combination is more predictive of achievement than IQ.'
	},
	moderate: {
		perseverance: 'You show reasonable perseverance — you can push through challenges, though very difficult or prolonged tasks may test your resolve. Building stamina through gradually increasing challenges will strengthen this.',
		consistency: 'Your goal consistency is developing. You sometimes shift between interests, which is natural at your age. Try committing to one key goal per term and tracking your progress.',
		combined: 'Your grit is at a developing level. The foundation is there — you can push through when motivated and sometimes maintain long-term focus. With deliberate practice, this will grow.'
	},
	low: {
		perseverance: 'Perseverance is a growth area for you. When tasks become difficult or tedious, you tend to disengage. This is very common but can be trained — start with small "push through" challenges and build up gradually.',
		consistency: 'You tend to shift between goals and interests frequently. While exploring is valuable, academic success requires some sustained commitment. Try the "100-day challenge" approach: pick one small habit and stick with it.',
		combined: 'Grit is an area that needs attention. The good news is that grit is not fixed — it\'s built through practice. Start small: finish one thing you\'re tempted to abandon, and notice how it feels.'
	}
};

const FOCUS_NARRATIVES = {
	concentration: {
		high: 'You have strong concentration skills — you can tune out distractions and maintain focus on your work for extended periods. This is a genuine academic superpower.',
		moderate: 'Your concentration is average — you can focus when conditions are right, but distractions (especially digital ones) can pull you away. Creating a distraction-free study zone will help.',
		low: 'Concentration is a significant challenge for you. You find it hard to sustain attention, especially when studying. This may not be a willpower issue — consider whether your study environment, sleep, or screen habits might be factors.'
	},
	procrastination: {
		high: 'You manage your time well and start tasks promptly — you don\'t leave things until the last minute. This puts you ahead of most students.',
		moderate: 'You sometimes procrastinate, especially with tasks that feel boring or overwhelming. Try the "2-minute start" rule: commit to just 2 minutes of work, and momentum often takes over.',
		low: 'Procrastination is a serious issue for you. You consistently put off work, even when you know it\'s important. This often stems from perfectionism, overwhelm, or task aversion rather than laziness. Breaking tasks into tiny steps can help break the cycle.'
	}
};

const ENERGY_NARRATIVES = {
	high: 'You generally feel energised and vital during the school day. This is a tremendous advantage — you have the raw fuel for sustained academic effort. Protect this energy with good sleep, nutrition, and breaks.',
	moderate: 'Your energy levels are mixed — sometimes you feel alert and engaged, other times you feel drained. Pay attention to your energy patterns: when do you feel most alive? Schedule demanding work for those windows.',
	low: 'You frequently feel tired, drained, or depleted. This significantly impacts your ability to study and learn. Before addressing study strategies, it\'s important to look at fundamentals: sleep quality, physical activity, nutrition, and screen time before bed.'
};

function generateCrossRef(dimensions, learnerProfile) {
	if (!dimensions) return null;

	const insights = [];
	const C = dimScore(dimensions, 'C');
	const lp = learnerProfile;

	// High C but low grit = surprising
	if (isHigh(C) && lp.grit.overall.level === 'low') {
		insights.push({
			icon: '🔄',
			text: 'Interesting: you score high on Conscientiousness (organised, thorough) but low on grit. You may have the discipline for routine tasks but struggle with long-term, uncertain challenges. Try setting clearer milestones for big projects.'
		});
	}

	// Low C but high grit = compensating
	if (isLow(C) && lp.grit.overall.level === 'high') {
		insights.push({
			icon: '✨',
			text: 'Despite lower natural organisation, your grit is strong. You compensate for less structured habits with sheer determination. Pairing your persistence with better planning tools could make you unstoppable.'
		});
	}

	// High C + high procrastination = perfectionism signal
	if (isHigh(C) && lp.focus.procrastination.level === 'low') {
		insights.push({
			icon: '🎯',
			text: 'You\'re highly conscientious but also procrastinate. This pattern often signals perfectionism — you delay starting because you want to do it perfectly. Try "good enough" drafts and iterate from there.'
		});
	}

	return insights.length > 0 ? insights : null;
}

/**
 * @param {object} results - Full results with optional dimensions and learnerProfile
 * @returns {object|null}
 */
export function generateAcademicCharacter(results) {
	if (!results.learnerProfile) return null;

	const lp = results.learnerProfile;
	const gritLevel = lp.grit.overall.level;
	const concLevel = lp.focus.concentration.level;
	const procLevel = lp.focus.procrastination.level;
	const energyLevel = lp.energy.netEnergy.level;

	return {
		grit: {
			overall: lp.grit.overall,
			perseverance: lp.grit.perseverance,
			consistency: lp.grit.consistency,
			perseveranceNarrative: GRIT_NARRATIVES[gritLevel].perseverance,
			consistencyNarrative: GRIT_NARRATIVES[gritLevel].consistency,
			overallNarrative: GRIT_NARRATIVES[gritLevel].combined
		},
		focus: {
			concentration: lp.focus.concentration,
			procrastination: lp.focus.procrastination,
			concentrationNarrative: FOCUS_NARRATIVES.concentration[concLevel],
			procrastinationNarrative: FOCUS_NARRATIVES.procrastination[procLevel]
		},
		energy: {
			netEnergy: lp.energy.netEnergy,
			vitality: lp.energy.vitality,
			depletion: lp.energy.depletion,
			narrative: ENERGY_NARRATIVES[energyLevel]
		},
		crossRef: generateCrossRef(results.dimensions, lp)
	};
}
