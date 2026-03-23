// @ts-nocheck
/**
 * Section 15: Root Cause Analysis
 * Synthesizes across learnerProfile, studyProfile, and HEXACO dimensions
 * to identify WHY patterns exist, not just what the symptoms are.
 *
 * 8 root cause archetypes with weighted signal matching.
 * Pattern fires only when accumulated weight >= 2.5.
 */

const THRESHOLD = 2.5;

const EXCLUSION_PAIRS = [
	['energy-without-direction', 'burnout-risk'],
	['confidence-deficit', 'capable-but-checked-out'],
	['energy-without-direction', 'capable-but-checked-out'],
	['confidence-deficit', 'burnout-risk']
];

const PATTERNS = [
	{
		id: 'energy-without-direction',
		title: 'Energy Without Direction',
		icon: '🚀',
		diagnosis:
			"You have plenty of energy and enthusiasm, but it scatters in too many directions. Without a clear target and consistent follow-through, your natural vitality dissipates before it can produce results.",
		oneThing: {
			action: 'Set one 30-day goal and track it daily',
			why: "Your energy is your superpower: it just needs a channel. One clear goal gives your vitality something to push against, and daily tracking builds the consistency muscle you're missing."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			if (lp?.energy?.vitality?.score >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Learner Profile', metric: 'Vitality', value: lp.energy.vitality.score, direction: 'high' });
			}
			if (lp?.grit?.consistency?.score < 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Learner Profile', metric: 'Consistency of Interest', value: lp.grit.consistency.score, direction: 'low' });
			}
			if (sp?.selfRegulation?.planning?.score < 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Planning & Organisation', value: sp.selfRegulation.planning.score, direction: 'low' });
			}
			if (lp?.focus?.procrastination?.score < 2.5) {
				weight += 0.5;
				evidence.push({ source: 'Learner Profile', metric: 'Procrastination Resistance', value: lp.focus.procrastination.score, direction: 'low' });
			}
			if (lp?.focus?.concentration?.score < 2.5) {
				weight += 0.5;
				evidence.push({ source: 'Learner Profile', metric: 'Concentration', value: lp.focus.concentration.score, direction: 'low' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'perfectionism-paralysis',
		title: 'Perfectionism Paralysis',
		icon: '🪞',
		diagnosis:
			"Your high standards are working against you. You care deeply about quality, but the gap between \"perfect\" and \"good enough\" creates anxiety that leads to procrastination and avoidance. You'd rather not start than risk falling short.",
		oneThing: {
			action: 'Submit one "good enough" draft this week without editing it',
			why: "Perfectionism disguises itself as quality, but it's actually fear. Deliberately submitting imperfect work teaches your brain that \"done\" beats \"perfect\", and the world doesn't end when you let go."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			// Procrastination is the gating signal — without it, this isn't paralysis
			if (lp?.focus?.procrastination?.score < 2.5) {
				weight += 1.5;
				evidence.push({ source: 'Learner Profile', metric: 'Procrastination Resistance', value: lp.focus.procrastination.score, direction: 'low' });
			}
			const eAnxiety = dims?.E?.facets?.anxiety?.score;
			const testAnxiety = sp?.selfRegulation?.testAnxiety?.score;
			if ((eAnxiety && eAnxiety >= 3.5) || (testAnxiety && testAnxiety >= 3.5)) {
				weight += 1.0;
				if (eAnxiety >= 3.5) evidence.push({ source: 'Personality', metric: 'Anxiety', value: eAnxiety, direction: 'high' });
				if (testAnxiety >= 3.5) evidence.push({ source: 'Study Profile', metric: 'Test Anxiety', value: testAnxiety, direction: 'high' });
			}
			const cScore = dims?.C?.score;
			if (cScore && cScore >= 3.5) {
				weight += 0.75;
				evidence.push({ source: 'Personality', metric: 'Conscientiousness', value: cScore, direction: 'high' });
			}
			if (sp?.studyApproaches?.deep?.score >= 3.0) {
				weight += 0.25;
				evidence.push({ source: 'Study Profile', metric: 'Deep Approach', value: sp.studyApproaches.deep.score, direction: 'high' });
			}
			if (sp?.selfRegulation?.selfEfficacy?.score >= 3.0) {
				weight += 0.25;
				evidence.push({ source: 'Study Profile', metric: 'Self-Efficacy', value: sp.selfRegulation.selfEfficacy.score, direction: 'high' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'engagement-dependent',
		title: 'Engagement-Dependent Learner',
		icon: '🎯',
		diagnosis:
			"You're capable of brilliant focus and deep learning, but only when the topic genuinely interests you. When it doesn't, you disengage almost completely. This isn't laziness; your brain is wired to chase curiosity, and it struggles to manufacture interest artificially.",
		oneThing: {
			action: 'Find one genuinely puzzling question about your most boring subject',
			why: "Engagement isn't about the subject: it's about the question. Even the driest topic has unsolved puzzles. One good question can unlock the same focus you bring to subjects you love."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			if (lp?.subjectFit) {
				const alignments = Object.values(lp.subjectFit).map((s) => s.alignment);
				const hasAligned = alignments.includes('aligned');
				const hasProblematic = alignments.some((a) => a === 'disengaged' || a === 'confidence-gap');
				if (hasAligned && hasProblematic) {
					weight += 1.0;
					evidence.push({ source: 'Learner Profile', metric: 'Subject Fit Variance', value: 'Mixed', direction: 'varies' });
				}
			}
			const oScore = dims?.O?.score;
			if (oScore && oScore >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Personality', metric: 'Openness to Experience', value: oScore, direction: 'high' });
			}
			if (sp?.studyApproaches?.deep?.score >= 3.5) {
				weight += 0.5;
				evidence.push({ source: 'Study Profile', metric: 'Deep Approach', value: sp.studyApproaches.deep.score, direction: 'high' });
			}
			if (sp?.motivation?.intrinsic?.score >= 3.0) {
				weight += 0.25;
				evidence.push({ source: 'Study Profile', metric: 'Intrinsic Motivation', value: sp.motivation.intrinsic.score, direction: 'high' });
			}
			if (lp?.focus?.concentration?.score >= 3.0) {
				weight += 0.5;
				evidence.push({ source: 'Learner Profile', metric: 'Concentration', value: lp.focus.concentration.score, direction: 'high' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'confidence-deficit',
		title: 'Confidence Deficit',
		icon: '🛡️',
		diagnosis:
			"You consistently underestimate your own abilities. Multiple subjects show confidence gaps: you can probably do more than you think, but self-doubt holds you back. This creates a vicious cycle: anxiety reduces performance, which \"confirms\" your low self-belief.",
		oneThing: {
			action: "Keep a 'proof journal', write down one competence win per day",
			why: "Your brain has a negativity bias that ignores evidence of competence. A proof journal forces you to notice what you're actually good at, slowly rewiring the self-doubt reflex."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			if (lp?.subjectFit) {
				const nonAligned = Object.entries(lp.subjectFit).filter(
					([, s]) => s.alignment === 'confidence-gap' || s.alignment === 'disengaged'
				);
				if (nonAligned.length >= 3) {
					weight += 1.25;
					evidence.push({ source: 'Learner Profile', metric: 'Subjects with Confidence Issues', value: nonAligned.length, direction: 'high' });
				} else if (nonAligned.length >= 2) {
					weight += 1.0;
					evidence.push({ source: 'Learner Profile', metric: 'Subjects with Confidence Issues', value: nonAligned.length, direction: 'high' });
				} else if (nonAligned.length === 1) {
					weight += 0.5;
					evidence.push({ source: 'Learner Profile', metric: 'Subjects with Confidence Issues', value: nonAligned.length, direction: 'moderate' });
				}
			}
			if (sp?.selfRegulation?.selfEfficacy?.score < 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Self-Efficacy', value: sp.selfRegulation.selfEfficacy.score, direction: 'low' });
			}
			const eAnxiety = dims?.E?.facets?.anxiety?.score;
			if (eAnxiety && eAnxiety >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Personality', metric: 'Anxiety', value: eAnxiety, direction: 'high' });
			}
			if (sp?.selfRegulation?.testAnxiety?.score >= 3.5) {
				weight += 0.75;
				evidence.push({ source: 'Study Profile', metric: 'Test Anxiety', value: sp.selfRegulation.testAnxiety.score, direction: 'high' });
			}
			if (sp?.selfRegulation?.helpSeeking?.score < 2.5) {
				weight += 0.5;
				evidence.push({ source: 'Study Profile', metric: 'Help-Seeking', value: sp.selfRegulation.helpSeeking.score, direction: 'low' });
			}
			if (lp?.energy?.netEnergy?.score < 2.5 || lp?.energy?.vitality?.score < 2.5) {
				weight += 0.5;
				const val = lp.energy.netEnergy?.score ?? lp.energy.vitality?.score;
				evidence.push({ source: 'Learner Profile', metric: 'Energy', value: val, direction: 'low' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'motivation-mismatch',
		title: 'Motivation Mismatch',
		icon: '🔄',
		diagnosis:
			"Your current motivation is almost entirely external, grades, rewards, avoiding trouble. You haven't found a personal connection to what you're studying. This makes learning feel like a chore rather than something meaningful, and external motivation burns out fast.",
		oneThing: {
			action: 'Have a real conversation with someone about what actually matters to you',
			why: "External motivation is borrowed fuel: it runs out. You need to discover YOUR reason for learning, even if it's unconventional. That starts with honest self-reflection, not more study tips."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			if (sp?.motivation?.intrinsic?.score < 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Intrinsic Motivation', value: sp.motivation.intrinsic.score, direction: 'low' });
			}
			if (sp?.motivation?.external?.score >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'External Motivation', value: sp.motivation.external.score, direction: 'high' });
			}
			if (lp?.subjectFit) {
				const disengaged = Object.entries(lp.subjectFit).filter(([, s]) => s.alignment === 'disengaged');
				if (disengaged.length >= 2) {
					weight += 1.0;
					evidence.push({ source: 'Learner Profile', metric: 'Disengaged Subjects', value: disengaged.length, direction: 'high' });
				} else if (disengaged.length === 1) {
					weight += 0.5;
					evidence.push({ source: 'Learner Profile', metric: 'Disengaged Subjects', value: disengaged.length, direction: 'moderate' });
				}
			}
			if (sp?.studyApproaches?.surface?.score >= 3.5) {
				weight += 0.75;
				evidence.push({ source: 'Study Profile', metric: 'Surface Approach', value: sp.studyApproaches.surface.score, direction: 'high' });
			}
			if (sp?.motivationProfile === 'controlled') {
				weight += 0.75;
				evidence.push({ source: 'Study Profile', metric: 'Motivation Profile', value: 'Controlled', direction: 'external' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'burnout-risk',
		title: 'Burnout Risk',
		icon: '🔥',
		diagnosis:
			"You're running on fumes but won't stop. Your grit and perseverance are impressive, but they're masking a dangerous energy deficit. High anxiety compounds the drain. If you keep pushing without recovery, your performance will eventually collapse, and it won't come back quickly.",
		oneThing: {
			action: 'Take one full day off this week, as medicine, not as laziness',
			why: "Your biggest risk isn't falling behind: it's breaking down. Rest isn't the opposite of productivity; it's the foundation. One deliberate rest day now prevents weeks of forced rest later."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			if (lp?.grit?.overall?.score >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Learner Profile', metric: 'Grit', value: lp.grit.overall.score, direction: 'high' });
			}
			if (lp?.energy?.netEnergy?.score < 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Learner Profile', metric: 'Net Energy', value: lp.energy.netEnergy.score, direction: 'low' });
			}
			const eAnxiety = dims?.E?.facets?.anxiety?.score;
			if (eAnxiety && eAnxiety >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Personality', metric: 'Anxiety', value: eAnxiety, direction: 'high' });
			}
			if (sp?.selfRegulation?.testAnxiety?.score >= 3.5) {
				weight += 0.5;
				evidence.push({ source: 'Study Profile', metric: 'Test Anxiety', value: sp.selfRegulation.testAnxiety.score, direction: 'high' });
			}
			if (lp?.grit?.perseverance?.score >= 3.5) {
				weight += 0.5;
				evidence.push({ source: 'Learner Profile', metric: 'Perseverance of Effort', value: lp.grit.perseverance.score, direction: 'high' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'social-learner-stuck-solo',
		title: 'Social Learner Stuck Solo',
		icon: '👥',
		diagnosis:
			"You're a naturally social person who learns best through discussion and collaboration, but you're not using those strengths. Whether it's shyness about asking for help or lack of study partners, you're trying to learn alone when your brain is wired for learning together.",
		oneThing: {
			action: 'Join or start one study group this week',
			why: "You process information by talking through it. Studying alone forces you to work against your natural wiring. One study group session will accomplish more than three hours of solo revision."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			const xScore = dims?.X?.score;
			if (xScore && xScore >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Personality', metric: 'Extraversion', value: xScore, direction: 'high' });
			}
			if (sp?.selfRegulation?.helpSeeking?.score < 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Help-Seeking', value: sp.selfRegulation.helpSeeking.score, direction: 'low' });
			}
			if (lp?.teacherPreference?.warmth >= 3.5) {
				weight += 0.75;
				evidence.push({ source: 'Learner Profile', metric: 'Warmth Preference', value: lp.teacherPreference.warmth, direction: 'high' });
			}
			const sociability = dims?.X?.facets?.sociability?.score;
			if (sociability && sociability >= 3.5) {
				weight += 0.5;
				evidence.push({ source: 'Personality', metric: 'Sociability', value: sociability, direction: 'high' });
			}
			if (lp?.focus?.concentration?.score < 3.0) {
				weight += 0.5;
				evidence.push({ source: 'Learner Profile', metric: 'Concentration', value: lp.focus.concentration.score, direction: 'low' });
			}
			return { weight, evidence };
		}
	},
	{
		id: 'capable-but-checked-out',
		title: 'Capable But Checked Out',
		icon: '😴',
		diagnosis:
			"You have the ability to succeed: your self-efficacy is adequate and you're not lacking in intelligence. But you've mentally checked out. You go through the motions with surface-level engagement while feeling fundamentally disconnected from the purpose of learning.",
		oneThing: {
			action: 'Go deep on one topic this week, not for marks, but purely for yourself',
			why: "You're not lazy: you're disengaged. The antidote isn't discipline; it's rekindling genuine curiosity. Pick something you're even slightly curious about and explore it without any academic pressure."
		},
		score(lp, sp, dims) {
			const evidence = [];
			let weight = 0;
			if (sp?.studyApproaches?.surface?.score >= 3.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Surface Approach', value: sp.studyApproaches.surface.score, direction: 'high' });
			}
			if (sp?.motivation?.amotivation?.score >= 2.5) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Amotivation', value: sp.motivation.amotivation.score, direction: 'high' });
			}
			if (sp?.selfRegulation?.selfEfficacy?.score >= 3.0) {
				weight += 1.0;
				evidence.push({ source: 'Study Profile', metric: 'Self-Efficacy', value: sp.selfRegulation.selfEfficacy.score, direction: 'adequate' });
			}
			if (sp?.selfRegulation?.planning?.score < 2.5) {
				weight += 0.5;
				evidence.push({ source: 'Study Profile', metric: 'Planning & Organisation', value: sp.selfRegulation.planning.score, direction: 'low' });
			}
			if (lp?.grit?.consistency?.score < 2.5) {
				weight += 0.5;
				evidence.push({ source: 'Learner Profile', metric: 'Consistency of Interest', value: lp.grit.consistency.score, direction: 'low' });
			}
			return { weight, evidence };
		}
	}
];

const SYNTHESIS_TEMPLATES = {
	'energy-without-direction+engagement-dependent':
		"You have genuine energy and curiosity, but both are scattered. When a subject catches your interest, you light up; when it doesn't, you bounce to something else. The core challenge isn't motivation; it's directing your natural enthusiasm into sustained effort, especially on topics that don't immediately excite you.",
	'burnout-risk':
		"You're pushing yourself hard, perhaps too hard. Your determination is admirable, but without adequate recovery, even the strongest engine overheats. The priority right now isn't working harder; it's building in genuine rest before your body forces it.",
	'motivation-mismatch+energy-without-direction':
		"You have the energy to succeed but lack a personal connection to your studies. You're being driven by external pressures rather than internal purpose, and without that anchor, your natural vitality scatters rather than builds momentum.",
	'capable-but-checked-out+engagement-dependent':
		"You have real intellectual firepower that only activates when you're genuinely curious. Right now, most of your studying is surface-level autopilot. The fix isn't more discipline: it's finding ways to make learning feel meaningful again, starting with the subjects where you already have a spark.",
	'confidence-deficit+motivation-mismatch':
		"Low confidence and external motivation are feeding each other in a negative cycle. You don't believe you can succeed, so you rely on external pressure to keep going, but external motivation without self-belief is exhausting and fragile. Building genuine confidence is the key that unlocks everything else.",
	'perfectionism-paralysis':
		"Your standards are sky-high but your output is stuck. The perfectionism-anxiety cycle has you trapped: the more you care about quality, the harder it becomes to start. Breaking this pattern requires deliberately practicing \"good enough\", not as a compromise, but as a skill.",
	'social-learner-stuck-solo':
		"You're wired for collaborative learning but studying in isolation. Your social strengths are going unused, and solitary study is working against your natural grain. The solution isn't studying harder alone: it's studying smarter together.",
	'engagement-dependent':
		"Your engagement is highly selective, brilliant when curious, absent when not. This isn't a discipline problem; it's a curiosity problem. The goal isn't to force yourself to care about everything, but to find the interesting angle in every subject.",
	'energy-without-direction':
		"You have fuel but no map. Your energy levels are strong, but without planning and consistency, that energy dissipates across too many directions. One clear goal with daily tracking would transform your scattered effort into focused progress.",
	'confidence-deficit':
		"Self-doubt is the thread running through your academic experience. Despite evidence of ability, you consistently underestimate what you can do. The anxiety this creates undermines your performance, creating a self-fulfilling prophecy that needs to be deliberately broken.",
	'motivation-mismatch':
		"You're going through the motions because someone told you to, not because you want to. External motivation alone is unsustainable. You need to find a personal connection to your learning before burnout sets in.",
	'capable-but-checked-out':
		"You have the ability but not the engagement. Your self-efficacy is intact, which means this isn't about capability: it's about meaning. Something has disconnected you from the purpose of learning, and surface-level studying is the symptom, not the cause."
};

const ACTION_PLANS = {
	'energy-without-direction': [
		{ priority: 1, action: 'Set one specific 30-day goal with daily tracking', impact: 'Channels scattered energy into measurable progress', timeframe: 'This week' },
		{ priority: 2, action: 'Use a weekly planner, block study time for specific subjects', impact: 'Builds the planning habit your profile is missing', timeframe: 'This month' },
		{ priority: 3, action: 'Review and adjust goals monthly, celebrate what stuck', impact: 'Develops long-term consistency through reflection', timeframe: 'This term' }
	],
	'perfectionism-paralysis': [
		{ priority: 1, action: 'Submit one assignment without a final editing pass', impact: 'Breaks the perfectionism-procrastination cycle', timeframe: 'This week' },
		{ priority: 2, action: 'Set time limits on tasks, when the timer ends, move on', impact: 'Teaches "good enough" as a skill, not a failure', timeframe: 'This month' },
		{ priority: 3, action: 'Track effort vs outcome, perfectionism rarely improves grades', impact: 'Evidence-based reality check on diminishing returns', timeframe: 'This term' }
	],
	'engagement-dependent': [
		{ priority: 1, action: 'Find one intriguing question per boring subject', impact: 'Leverages your natural curiosity as an engagement tool', timeframe: 'This week' },
		{ priority: 2, action: 'Connect uninteresting subjects to topics you love', impact: 'Cross-pollination makes dry subjects personally relevant', timeframe: 'This month' },
		{ priority: 3, action: "Build a 'curiosity portfolio', track questions and discoveries across all subjects", impact: 'Trains engagement as a transferable skill', timeframe: 'This term' }
	],
	'confidence-deficit': [
		{ priority: 1, action: "Start a daily 'proof journal', one thing you did well today", impact: 'Counteracts negativity bias with concrete evidence', timeframe: 'This week' },
		{ priority: 2, action: 'Attempt one challenge slightly above your comfort zone, with support', impact: 'Controlled success experiences rebuild self-belief', timeframe: 'This month' },
		{ priority: 3, action: 'Ask teachers for specific, targeted feedback (not just grades)', impact: 'Replaces vague self-doubt with actionable information', timeframe: 'This term' }
	],
	'motivation-mismatch': [
		{ priority: 1, action: 'Have an honest conversation about what you actually care about', impact: "Surfaces intrinsic values that external rewards can't replace", timeframe: 'This week' },
		{ priority: 2, action: 'Connect one study topic to a personal goal or interest', impact: 'Bridges the gap between external requirements and internal purpose', timeframe: 'This month' },
		{ priority: 3, action: 'Explore one new subject or skill purely for fun, no grades involved', impact: 'Rebuilds the experience of learning for its own sake', timeframe: 'This term' }
	],
	'burnout-risk': [
		{ priority: 1, action: 'Schedule one full rest day this week, no study, no guilt', impact: "Prevents the crash that's building from chronic depletion", timeframe: 'This week' },
		{ priority: 2, action: 'Reduce study hours by 20% and track whether grades actually drop', impact: 'Tests the assumption that more hours = better results', timeframe: 'This month' },
		{ priority: 3, action: 'Build a sustainable study rhythm with regular breaks and recovery', impact: 'Replaces the grind-crash cycle with steady, maintainable effort', timeframe: 'This term' }
	],
	'social-learner-stuck-solo': [
		{ priority: 1, action: 'Join one study group or find one study partner this week', impact: 'Activates your social learning strengths immediately', timeframe: 'This week' },
		{ priority: 2, action: 'Ask a teacher or classmate one question per day in your weakest subject', impact: 'Normalises help-seeking as a strength, not a weakness', timeframe: 'This month' },
		{ priority: 3, action: 'Build a regular collaborative study routine for exam preparation', impact: 'Leverages your social nature for sustained academic benefit', timeframe: 'This term' }
	],
	'capable-but-checked-out': [
		{ priority: 1, action: 'Pick one topic and go genuinely deep, not for marks, just for you', impact: 'Rekindling curiosity is the antidote to disengagement', timeframe: 'This week' },
		{ priority: 2, action: 'Replace one hour of surface studying with active recall or teaching others', impact: 'Shifts from autopilot to genuine engagement with material', timeframe: 'This month' },
		{ priority: 3, action: 'Explore what "success" means to you, beyond grades and credentials', impact: 'Reconnects learning to personal purpose and meaning', timeframe: 'This term' }
	]
};

function generateSynthesis(primary, secondary) {
	if (!secondary) {
		return SYNTHESIS_TEMPLATES[primary.id] || `The evidence converges on one central pattern: ${primary.title.toLowerCase()}. ${primary.diagnosis.split('.')[0]}.`;
	}
	const key1 = `${primary.id}+${secondary.id}`;
	const key2 = `${secondary.id}+${primary.id}`;
	if (SYNTHESIS_TEMPLATES[key1]) return SYNTHESIS_TEMPLATES[key1];
	if (SYNTHESIS_TEMPLATES[key2]) return SYNTHESIS_TEMPLATES[key2];
	return `Two patterns are working together: ${primary.title.toLowerCase()} is the primary driver, with ${secondary.title.toLowerCase()} as a contributing factor. Addressing the primary pattern first will likely improve the secondary one as well.`;
}

/**
 * @param {object} results - Full results with learnerProfile, studyProfile, dimensions
 * @returns {object|null}
 */
export function generateRootCause(results) {
	const lp = results.learnerProfile;
	const sp = results.studyProfile;
	const dims = results.dimensions;

	if (!lp) return null;

	// Score all patterns
	const scored = PATTERNS.map((pattern) => {
		const { weight, evidence } = pattern.score(lp, sp, dims);
		return {
			id: pattern.id,
			title: pattern.title,
			icon: pattern.icon,
			confidence: weight,
			diagnosis: pattern.diagnosis,
			oneThing: pattern.oneThing,
			evidence
		};
	}).filter((p) => p.confidence >= THRESHOLD);

	if (scored.length === 0) return null;

	// Sort by confidence descending
	scored.sort((a, b) => b.confidence - a.confidence);

	// Apply exclusion pairs — lower-scoring one in each pair is removed
	const excluded = new Set();
	for (const [a, b] of EXCLUSION_PAIRS) {
		const idxA = scored.findIndex((p) => p.id === a);
		const idxB = scored.findIndex((p) => p.id === b);
		if (idxA !== -1 && idxB !== -1) {
			// Already sorted by confidence, so higher index = lower score
			if (idxA < idxB) {
				excluded.add(b);
			} else {
				excluded.add(a);
			}
		}
	}

	const filtered = scored.filter((p) => !excluded.has(p.id));
	if (filtered.length === 0) return null;

	const primary = filtered[0];
	const secondary = filtered.length > 1 ? filtered[1] : null;
	const synthesis = generateSynthesis(primary, secondary);
	const actionPlan = ACTION_PLANS[primary.id] || [];

	return {
		primaryPattern: {
			id: primary.id,
			title: primary.title,
			icon: primary.icon,
			confidence: primary.confidence,
			diagnosis: primary.diagnosis,
			evidence: primary.evidence,
			oneThing: primary.oneThing
		},
		secondaryPattern: secondary
			? {
					id: secondary.id,
					title: secondary.title,
					icon: secondary.icon,
					confidence: secondary.confidence,
					diagnosis: secondary.diagnosis,
					evidence: secondary.evidence,
					oneThing: secondary.oneThing
				}
			: null,
		synthesis,
		actionPlan
	};
}
