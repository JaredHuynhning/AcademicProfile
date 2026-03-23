/**
 * Section 11: Study & Motivation Profile
 * Generates report data from studyProfile + HEXACO cross-system insights.
 */

import { classifyLevel, isHigh, isLow, dimScore, DimensionsMap } from './helpers';

interface Results {
	dimensions: DimensionsMap;
	studyProfile?: StudyProfile;
	[key: string]: unknown;
}

interface StudyApproach {
	score: number;
	level: string;
	[key: string]: unknown;
}

interface MotivationItem {
	score: number;
	level: string;
	[key: string]: unknown;
}

interface SelfRegItem {
	score: number;
	level: string;
	[key: string]: unknown;
}

interface Motivation {
	intrinsic: MotivationItem;
	identified: MotivationItem;
	external: MotivationItem;
	amotivation: MotivationItem;
	sdi: number;
}

interface SelfRegulation {
	selfEfficacy: SelfRegItem;
	planning: SelfRegItem;
	effortRegulation: SelfRegItem;
	testAnxiety: SelfRegItem;
	helpSeeking: SelfRegItem;
}

interface StudyProfile {
	dominantApproach: string;
	motivationProfile: string;
	regulationStrength: string;
	studyApproaches: {
		deep: StudyApproach;
		strategic: StudyApproach;
		surface: StudyApproach;
	};
	motivation: Motivation;
	selfRegulation: SelfRegulation;
}

const REG_TIPS: Record<string, { strength: string; weakness: string }> = {
	selfEfficacy: {
		strength: 'Your self-belief is solid. Use it to tackle challenges slightly beyond your comfort zone.',
		weakness: 'Build confidence through small wins. Focus on what you CAN do, then stretch gradually.'
	},
	planning: {
		strength: 'You plan well. Keep using study schedules and goal-setting to stay ahead.',
		weakness: 'Try planning just one week at a time. Even 5 minutes of planning on Sunday evening makes a big difference.'
	},
	effortRegulation: {
		strength: 'You push through tough work. This persistence is one of the strongest predictors of success.',
		weakness: 'When work feels boring or hard, try the 15-minute challenge: commit to just 15 minutes, then decide if you continue.'
	},
	testAnxiety: {
		strength: 'You stay relatively calm during exams. This gives you a real advantage in showing what you know.',
		weakness: 'Exam nerves are holding you back. Practice tests under timed conditions build familiarity and reduce anxiety.'
	},
	helpSeeking: {
		strength: 'Asking for help is a sign of maturity. Keep using teachers and classmates as resources.',
		weakness: 'Asking for help is not a weakness. Try asking one question per class this week to build the habit.'
	}
};

const MOTIVATION_TIPS: Record<string, Record<string, string>> = {
	intrinsic: {
		strength: 'Your genuine curiosity is your most powerful learning tool. Feed it with questions and exploration.',
		weakness: 'Try finding one interesting angle in each subject. Curiosity can be sparked, not just born.'
	},
	identified: {
		strength: 'You see the value in education for your future. This keeps you going even when content is boring.',
		weakness: 'Try connecting what you learn to your personal goals. Even boring subjects build skills you will use.'
	},
	external: {
		strength: 'Rewards and grades motivate you. Use this by setting up personal reward systems for study milestones.',
		high: 'You rely heavily on external rewards. Try finding one reason YOU care about a topic, beyond grades.'
	},
	amotivation: {
		strength: 'You see purpose in your learning. This is a real strength that many students lack.',
		weakness: 'You are questioning the point of school. Talk to someone about what matters to you. Purpose makes everything easier.'
	}
};

const APPROACH_DESC: Record<string, { label: string; icon: string; desc: string; strengths: string[]; weaknesses: string[]; actions: string[] }> = {
	deep: {
		label: 'Deep Learner',
		icon: '🔬',
		desc: 'You seek genuine understanding, connect ideas across subjects, and look for evidence before accepting claims. You learn because the ideas genuinely interest you.',
		strengths: [
			'Strong conceptual understanding that transfers across subjects',
			'Natural critical thinking and evidence-based reasoning',
			'Intrinsic interest makes learning feel less like "work"'
		],
		weaknesses: [
			'May overthink problems and get stuck in analysis paralysis',
			'Can be slow to complete work when seeking perfect understanding',
			'May neglect exam technique in favour of deeper exploration'
		],
		actions: [
			'Set time limits for research and analysis to avoid overthinking',
			'Practice past exam papers under timed conditions to sharpen technique',
			'Use concept maps to visualise connections between ideas without getting lost in detail'
		]
	},
	strategic: {
		label: 'Strategic Learner',
		icon: '🎯',
		desc: 'You are organised and intentional about your study. You plan your time, monitor your progress, and focus on what matters most for success.',
		strengths: [
			'Efficient use of study time with clear priorities',
			'Self-monitoring ensures consistent progress',
			"Adaptable, changes methods when something isn't working"
		],
		weaknesses: [
			'May focus too much on grades over genuine understanding',
			'Can miss creative connections by sticking rigidly to the syllabus',
			'Risk of burnout from constant optimisation and self-monitoring'
		],
		actions: [
			"Pair your planning skills with deeper questioning — ask \"why?\" not just \"what's on the test?\"",
			'Allow yourself unstructured exploration time in subjects you enjoy',
			'Share your organisational strategies with classmates who struggle'
		]
	},
	surface: {
		label: 'Surface Learner',
		icon: '📝',
		desc: 'You tend to focus on memorising facts and meeting minimum requirements rather than seeking deep understanding. This often happens when subjects feel irrelevant or overwhelming.',
		strengths: [
			'Can recall factual information quickly for tests',
			'Gets through required work efficiently',
			'May excel in subjects requiring rote knowledge'
		],
		weaknesses: [
			'Memorising without understanding limits long-term retention',
			'Struggles with unfamiliar question formats that require application',
			"Knowledge doesn't transfer well between subjects or to real life"
		],
		actions: [
			'Try asking "why?" and "how?" about what you memorise, even one question per topic',
			'Connect study topics to things you actually care about',
			'Work with a study partner who can discuss ideas, not just review notes',
			'Start with practice problems before memorising — understanding comes from doing'
		]
	}
};

const MOTIVATION_DESC: Record<string, { label: string; icon: string; desc: string; insight: string }> = {
	'self-determined': {
		label: 'Self-Determined',
		icon: '🌟',
		desc: 'You are primarily driven by curiosity, interest, and personal values. You study because you want to, not because you have to.',
		insight: 'This is the most sustainable and effective motivation pattern. You are likely to persist through challenges and enjoy the learning process.'
	},
	moderate: {
		label: 'Moderate Motivation',
		icon: '⚖️',
		desc: 'You have a mix of internal and external motivations. Some subjects engage you genuinely, while others feel like obligations.',
		insight: 'This is normal for most students. The key is building more intrinsic interest in subjects that currently feel like chores.'
	},
	controlled: {
		label: 'Externally Driven',
		icon: '🔔',
		desc: 'You are mainly motivated by external pressures, grades, rewards, or avoiding trouble. Internal interest plays a smaller role.',
		insight: 'External motivation works in the short term but can lead to burnout. Try finding personal meaning in what you study.'
	},
	amotivated: {
		label: 'Disengaged',
		icon: '⚠️',
		desc: "You are struggling to find reasons to engage with school. This isn't laziness, it often signals a mismatch between your needs and your current learning environment.",
		insight: 'This is a flag for intervention. A supportive tutor, counsellor, or mentor who can help reconnect you with purpose is important.'
	}
};

function generateCrossInsights(dimensions: DimensionsMap, studyProfile: StudyProfile) {
	const insights: { icon: string; title: string; text: string }[] = [];
	const O = dimScore(dimensions, 'O');
	const C = dimScore(dimensions, 'C');
	const E = dimScore(dimensions, 'E');
	const X = dimScore(dimensions, 'X');
	const sp = studyProfile;

	if (isHigh(O) && sp.studyApproaches.surface.level === 'high') {
		insights.push({
			icon: '💡',
			title: 'Curiosity Not Translating',
			text: "Your high intellectual curiosity (Openness) isn't showing up in your study approach yet. You have the capacity for deep learning, try connecting schoolwork to topics that genuinely fascinate you."
		});
	}

	if (isHigh(C) && sp.studyApproaches.surface.level === 'high') {
		insights.push({
			icon: '🔄',
			title: 'Organised but Shallow',
			text: "You're highly organised and disciplined (Conscientiousness), but your study is focused on surface-level memorisation. Try redirecting your excellent habits toward understanding, not just completion."
		});
	}

	if (isLow(C) && sp.studyApproaches.strategic.level === 'high') {
		insights.push({
			icon: '✨',
			title: 'Smart Compensation',
			text: "Despite lower natural organisation (Conscientiousness), you've developed strong strategic study skills. This shows real self-awareness and adaptability."
		});
	}

	if (isHigh(E) && sp.selfRegulation.testAnxiety.level === 'low') {
		insights.push({
			icon: '🫧',
			title: 'Anxiety Compounds',
			text: 'Your naturally sensitive temperament (Emotionality) combined with test anxiety creates a double pressure. Relaxation techniques and practice under timed conditions can help build resilience.'
		});
	}

	if (isHigh(X) && sp.selfRegulation.helpSeeking.level === 'low') {
		insights.push({
			icon: '🤔',
			title: 'Social but Silent',
			text: "You're socially confident (Extraversion) but reluctant to ask for academic help. Your social skills are an asset, use them to build study partnerships and ask questions in class."
		});
	}

	if (isHigh(O) && sp.studyApproaches.deep.level === 'high') {
		insights.push({
			icon: '🎯',
			title: 'Natural Deep Learner',
			text: "Your intellectual curiosity (Openness) aligns beautifully with your deep study approach. You're wired to understand, not just memorise. Lean into research and creative projects."
		});
	}

	if (isLow(C) && sp.motivation.amotivation.level === 'high') {
		insights.push({
			icon: '🚨',
			title: 'Disengagement Risk',
			text: 'Low natural organisation combined with feelings of pointlessness creates a risk of academic disengagement. A structured, supportive tutor who can rebuild purpose and habits is essential.'
		});
	}

	if (isHigh(C) && sp.motivationProfile === 'self-determined') {
		insights.push({
			icon: '🏆',
			title: 'Excellence Pattern',
			text: 'High discipline (Conscientiousness) paired with genuine self-motivation is the strongest predictor of academic success. You have the engine and the fuel, just make sure you also rest.'
		});
	}

	return insights.slice(0, 4);
}

function generateRegulationAssessment(selfReg: SelfRegulation) {
	const items: { key: string; label: string; icon: string; desc: string }[] = [
		{ key: 'selfEfficacy', label: 'Self-Efficacy', icon: '💪', desc: 'Belief in your ability to succeed' },
		{ key: 'planning', label: 'Planning', icon: '📅', desc: 'Setting goals and organising study time' },
		{ key: 'effortRegulation', label: 'Effort Regulation', icon: '🏋️', desc: "Pushing through when it's hard or boring" },
		{ key: 'testAnxiety', label: 'Test Calm', icon: '🧘', desc: 'Managing exam nerves (higher = calmer)' },
		{ key: 'helpSeeking', label: 'Help-Seeking', icon: '🤝', desc: 'Willingness to ask for support when stuck' }
	];

	return items.map((item) => {
		const regItem = selfReg[item.key as keyof SelfRegulation];
		const score = regItem.score;
		const classification = score >= 3.0 ? 'strength' : 'weakness';
		return {
			...item,
			score,
			level: regItem.level,
			classification,
			tip: REG_TIPS[item.key][classification]
		};
	});
}

function generateMotivationSW(motivation: Motivation) {
	const strengths: string[] = [];
	const weaknesses: string[] = [];
	const actions: string[] = [];

	if (motivation.intrinsic.score >= 3.0) {
		strengths.push('Genuine curiosity drives your learning. This is the most sustainable form of motivation.');
	} else {
		weaknesses.push('Low intrinsic motivation means subjects feel like obligations, not interests.');
		actions.push('Find one personally interesting angle in each subject. Even a single question that puzzles you can shift how you feel about a topic.');
	}

	if (motivation.identified.score >= 3.0) {
		strengths.push('You see the value in education for your future goals.');
	} else {
		weaknesses.push("You haven't connected school to your personal goals yet.");
		actions.push("Talk to someone about what you want to do after school. Then find one link between that goal and what you're studying now.");
	}

	if (motivation.external.score >= 4.0) {
		weaknesses.push('You rely heavily on external rewards and pressure. This works short-term but burns out.');
		actions.push('Before each study session, find one reason YOU want to learn this, beyond grades.');
	}

	if (motivation.amotivation.score >= 2.5) {
		weaknesses.push('Signs of disconnection from learning are emerging.');
		actions.push('Have an honest conversation with someone you trust about what would make school feel worthwhile.');
	} else if (motivation.amotivation.score < 2.0) {
		strengths.push('You see clear purpose in your learning.');
	}

	return { strengths, weaknesses, actions };
}

function generateRegulationSW(regulationItems: ReturnType<typeof generateRegulationAssessment>) {
	const strengths: string[] = [];
	const weaknesses: string[] = [];
	const actions: string[] = [];

	for (const r of regulationItems) {
		if (r.classification === 'strength') {
			strengths.push(`${r.label}: ${r.score}/5. ${r.tip}`);
		} else {
			weaknesses.push(`${r.label}: ${r.score}/5. ${r.desc}`);
			actions.push(r.tip);
		}
	}

	return { strengths, weaknesses, actions };
}

export function generateStudyProfile(results: Results) {
	if (!results.studyProfile) return null;

	const sp = results.studyProfile;
	const approach = APPROACH_DESC[sp.dominantApproach];
	const motivation = MOTIVATION_DESC[sp.motivationProfile];
	const regulation = generateRegulationAssessment(sp.selfRegulation);

	return {
		dominantApproach: sp.dominantApproach,
		approach,
		approaches: {
			deep: { ...sp.studyApproaches.deep, label: 'Deep', color: '#6366f1' },
			strategic: { ...sp.studyApproaches.strategic, label: 'Strategic', color: '#f59e0b' },
			surface: { ...sp.studyApproaches.surface, label: 'Surface', color: '#ef4444' }
		},

		motivationProfile: sp.motivationProfile,
		motivation,
		motivationScores: {
			intrinsic: {
				...sp.motivation.intrinsic, label: 'Intrinsic', color: '#22c55e',
				classification: sp.motivation.intrinsic.score >= 3.0 ? 'strength' : 'weakness',
				tip: MOTIVATION_TIPS.intrinsic[sp.motivation.intrinsic.score >= 3.0 ? 'strength' : 'weakness']
			},
			identified: {
				...sp.motivation.identified, label: 'Identified', color: '#3b82f6',
				classification: sp.motivation.identified.score >= 3.0 ? 'strength' : 'weakness',
				tip: MOTIVATION_TIPS.identified[sp.motivation.identified.score >= 3.0 ? 'strength' : 'weakness']
			},
			external: {
				...sp.motivation.external, label: 'External', color: '#f97316',
				classification: sp.motivation.external.score >= 4.0 ? 'weakness' : 'strength',
				tip: sp.motivation.external.score >= 4.0 ? MOTIVATION_TIPS.external.high : MOTIVATION_TIPS.external.strength
			},
			amotivation: {
				...sp.motivation.amotivation, label: 'Amotivation', color: '#ef4444',
				classification: sp.motivation.amotivation.score < 2.5 ? 'strength' : 'weakness',
				tip: sp.motivation.amotivation.score < 2.5 ? MOTIVATION_TIPS.amotivation.strength : MOTIVATION_TIPS.amotivation.weakness
			}
		},
		sdi: sp.motivation.sdi,
		motivationStrengthsWeaknesses: generateMotivationSW(sp.motivation),

		regulationStrength: sp.regulationStrength,
		regulation,
		regulationStrengthsWeaknesses: generateRegulationSW(regulation),

		crossInsights: results.dimensions ? generateCrossInsights(results.dimensions, sp) : []
	};
}
