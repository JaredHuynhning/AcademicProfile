/**
 * Section 12: Academic Character
 * Generates narrative analysis of grit, focus, procrastination, and energy.
 * Cross-references with HEXACO Conscientiousness and effort regulation where available.
 */

import { dimScore, isHigh, isLow, DimensionsMap } from './helpers';

interface Metric {
	score: number;
	level: string;
	[key: string]: unknown;
}

interface GritProfile {
	overall: Metric;
	perseverance: Metric;
	consistency: Metric;
}

interface FocusProfile {
	concentration: Metric;
	procrastination: Metric;
}

interface EnergyProfile {
	vitality: Metric;
	netEnergy: Metric;
	depletion: Metric;
}

interface LearnerProfile {
	grit: GritProfile;
	focus: FocusProfile;
	energy: EnergyProfile;
	[key: string]: unknown;
}

interface Results {
	dimensions?: DimensionsMap;
	learnerProfile?: LearnerProfile;
	[key: string]: unknown;
}

const TIPS: Record<string, { strength: string; weakness: string }> = {
	perseverance: {
		strength: 'Your persistence is a real asset. Challenge yourself with harder problems to keep growing.',
		weakness: 'Break big tasks into smaller milestones. Celebrate completing each one to build your follow-through muscle.'
	},
	consistency: {
		strength: 'Your ability to stick with goals is rare. Use this strength to build long-term projects.',
		weakness: 'Try committing to just one key goal per term. Track your progress visually to stay motivated.'
	},
	overall: {
		strength: 'Your overall grit is strong. This is one of the best predictors of academic success.',
		weakness: 'Building grit takes time. Focus on finishing what you start, even small things.'
	},
	concentration: {
		strength: 'Your focus is a strength. Protect it by keeping your phone out of your study space.',
		weakness: 'Try the Pomodoro technique: 25 minutes focused, then a 5-minute break. A phone-free study zone helps.'
	},
	procrastination: {
		strength: 'You start tasks without needing a push. Keep using this self-starter habit.',
		weakness: 'Use the 2-minute rule: commit to just 2 minutes of starting. Momentum usually carries you further.'
	},
	vitality: {
		strength: 'Your energy is a real advantage. Channel it into your most challenging subjects early in the day.',
		weakness: 'Protect your sleep above all else. Short, focused study blocks (20\u201325 mins) work better than long sessions.'
	},
	netEnergy: {
		strength: 'You generally feel energised for learning. Make the most of this by tackling hard topics when fresh.',
		weakness: 'Your energy runs low. Check sleep, screen time, and physical activity. Schedule demanding study for your best hours.'
	}
};

function withClassification(metric: Metric, tipKey: string): Metric & { classification: string; tip: string } {
	const cls = metric.score >= 3.0 ? 'strength' : 'weakness';
	return { ...metric, classification: cls, tip: TIPS[tipKey][cls] };
}

const GRIT_NARRATIVES: Record<string, { perseverance: string; consistency: string; combined: string }> = {
	high: {
		perseverance: 'You show strong perseverance: when you start something, you see it through to the end, even when it gets tough. This is one of the most important predictors of long-term academic success.',
		consistency: 'You maintain consistent focus on your goals. You don\'t flit from interest to interest: when you commit, you stay the course.',
		combined: 'Your overall grit is impressive. You combine the ability to push through difficulty with long-term goal commitment. Research by Angela Duckworth shows this combination is more predictive of achievement than IQ.'
	},
	moderate: {
		perseverance: 'You show reasonable perseverance: you can push through challenges, though very difficult or prolonged tasks may test your resolve. Building stamina through gradually increasing challenges will strengthen this.',
		consistency: 'Your goal consistency is developing. You sometimes shift between interests, which is natural at your age. Try committing to one key goal per term and tracking your progress.',
		combined: 'Your grit is at a developing level. The foundation is there: you can push through when motivated and sometimes maintain long-term focus. With deliberate practice, this will grow.'
	},
	low: {
		perseverance: 'Perseverance is a growth area for you. When tasks become difficult or tedious, you tend to disengage. This is very common but can be trained. Start with small "push through" challenges and build up gradually.',
		consistency: 'You tend to shift between goals and interests frequently. While exploring is valuable, academic success requires some sustained commitment. Try the "100-day challenge" approach: pick one small habit and stick with it.',
		combined: 'Grit is an area that needs attention. The good news is that grit is not fixed: it\'s built through practice. Start small: finish one thing you\'re tempted to abandon, and notice how it feels.'
	}
};

const FOCUS_NARRATIVES: Record<string, Record<string, string>> = {
	concentration: {
		high: 'You have strong concentration skills: you can tune out distractions and maintain focus on your work for extended periods. This is a genuine academic superpower.',
		moderate: 'Your concentration is average: you can focus when conditions are right, but distractions (especially digital ones) can pull you away. Creating a distraction-free study zone will help.',
		low: 'Concentration is a significant challenge for you. You find it hard to sustain attention, especially when studying. This may not be a willpower issue. Consider whether your study environment, sleep, or screen habits might be factors.'
	},
	procrastination: {
		high: 'You manage your time well and start tasks promptly, you don\'t leave things until the last minute. This puts you ahead of most students.',
		moderate: 'You sometimes procrastinate, especially with tasks that feel boring or overwhelming. Try the "2-minute start" rule: commit to just 2 minutes of work, and momentum often takes over.',
		low: 'Procrastination is a serious issue for you. You consistently put off work, even when you know it\'s important. This often stems from perfectionism, overwhelm, or task aversion rather than laziness. Breaking tasks into tiny steps can help break the cycle.'
	}
};

const ENERGY_NARRATIVES: Record<string, string> = {
	high: 'You generally feel energised and vital during the school day. This is a tremendous advantage: you have the raw fuel for sustained academic effort. Protect this energy with good sleep, nutrition, and breaks.',
	moderate: 'Your energy levels are mixed: sometimes you feel alert and engaged, other times you feel drained. Pay attention to your energy patterns: when do you feel most alive? Schedule demanding work for those windows.',
	low: 'You frequently feel tired, drained, or depleted. This significantly impacts your ability to study and learn. Before addressing study strategies, it\'s important to look at fundamentals: sleep quality, physical activity, nutrition, and screen time before bed.'
};

function generateCrossRef(dimensions: DimensionsMap | undefined, learnerProfile: LearnerProfile): { icon: string; text: string }[] | null {
	if (!dimensions) return null;

	const insights: { icon: string; text: string }[] = [];
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
			text: 'You\'re highly conscientious but also procrastinate. This pattern often signals perfectionism: you delay starting because you want to do it perfectly. Try "good enough" drafts and iterate from there.'
		});
	}

	return insights.length > 0 ? insights : null;
}

/**
 * @param results - Full results with optional dimensions and learnerProfile
 */
export function generateAcademicCharacter(results: Results) {
	if (!results.learnerProfile) return null;

	const lp = results.learnerProfile;
	const gritLevel = lp.grit.overall.level;
	const concLevel = lp.focus.concentration.level;
	const procLevel = lp.focus.procrastination.level;
	const energyLevel = lp.energy.netEnergy.level;

	const gritPerseverance = withClassification(lp.grit.perseverance, 'perseverance');
	const gritConsistency = withClassification(lp.grit.consistency, 'consistency');
	const focusConcentration = withClassification(lp.focus.concentration, 'concentration');
	const focusProcrastination = withClassification(lp.focus.procrastination, 'procrastination');
	const energyVitality = withClassification(lp.energy.vitality, 'vitality');
	const energyNetEnergy = withClassification(lp.energy.netEnergy, 'netEnergy');

	const gritStrengths: string[] = [];
	const gritWeaknesses: string[] = [];
	const gritActions: string[] = [];
	if (gritPerseverance.classification === 'strength') {
		gritStrengths.push(`Perseverance (${gritPerseverance.score}/5): You push through challenges and keep going when things get tough.`);
	} else {
		gritWeaknesses.push(`Perseverance (${gritPerseverance.score}/5): You tend to give up when tasks get difficult or take too long.`);
		gritActions.push(gritPerseverance.tip);
	}
	if (gritConsistency.classification === 'strength') {
		gritStrengths.push(`Goal Consistency (${gritConsistency.score}/5): You stick with your commitments and see projects through.`);
	} else {
		gritWeaknesses.push(`Goal Consistency (${gritConsistency.score}/5): You shift between interests and struggle to maintain long-term focus.`);
		gritActions.push(gritConsistency.tip);
	}

	const focusStrengths: string[] = [];
	const focusWeaknesses: string[] = [];
	const focusActions: string[] = [];
	if (focusConcentration.classification === 'strength') {
		focusStrengths.push(`Concentration (${focusConcentration.score}/5): You can sustain attention on your work for extended periods.`);
	} else {
		focusWeaknesses.push(`Concentration (${focusConcentration.score}/5): You find it hard to focus, especially during study. Distractions pull you away easily.`);
		focusActions.push(focusConcentration.tip);
	}
	if (focusProcrastination.classification === 'strength') {
		focusStrengths.push(`Starting tasks (${focusProcrastination.score}/5): You get going without needing to be pushed.`);
	} else {
		focusWeaknesses.push(`Procrastination (${focusProcrastination.score}/5): You consistently put off starting work, even when you know it's important.`);
		focusActions.push(focusProcrastination.tip);
	}

	const energyStrengths: string[] = [];
	const energyWeaknesses: string[] = [];
	const energyActions: string[] = [];
	if (energyVitality.classification === 'strength') {
		energyStrengths.push(`Vitality (${energyVitality.score}/5): You generally feel energised and alert for learning.`);
	} else {
		energyWeaknesses.push(`Vitality (${energyVitality.score}/5): You often feel low energy, which limits how much you can absorb.`);
		energyActions.push(energyVitality.tip);
	}
	if (energyNetEnergy.classification === 'strength') {
		energyStrengths.push(`Overall energy (${energyNetEnergy.score}/5): Your energy levels support sustained learning.`);
	} else {
		energyWeaknesses.push(`Overall energy (${energyNetEnergy.score}/5): You feel drained, which affects your ability to study effectively.`);
		energyActions.push(energyNetEnergy.tip);
	}

	return {
		grit: {
			overall: withClassification(lp.grit.overall, 'overall'),
			perseverance: gritPerseverance,
			consistency: gritConsistency,
			perseveranceNarrative: GRIT_NARRATIVES[gritLevel].perseverance,
			consistencyNarrative: GRIT_NARRATIVES[gritLevel].consistency,
			overallNarrative: GRIT_NARRATIVES[gritLevel].combined,
			strengths: gritStrengths,
			weaknesses: gritWeaknesses,
			actions: gritActions
		},
		focus: {
			concentration: focusConcentration,
			procrastination: focusProcrastination,
			concentrationNarrative: FOCUS_NARRATIVES.concentration[concLevel],
			procrastinationNarrative: FOCUS_NARRATIVES.procrastination[procLevel],
			strengths: focusStrengths,
			weaknesses: focusWeaknesses,
			actions: focusActions
		},
		energy: {
			netEnergy: energyNetEnergy,
			vitality: energyVitality,
			depletion: lp.energy.depletion,
			narrative: ENERGY_NARRATIVES[energyLevel],
			strengths: energyStrengths,
			weaknesses: energyWeaknesses,
			actions: energyActions
		},
		crossRef: generateCrossRef(results.dimensions, lp)
	};
}
