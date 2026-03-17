/**
 * Section 11: Study & Motivation Profile
 * Generates report data from studyProfile + HEXACO cross-system insights.
 */

import { classifyLevel, isHigh, isLow, dimScore } from './helpers.js';

/**
 * Approach descriptions for the report narrative.
 */
const APPROACH_DESC = {
	deep: {
		label: 'Deep Learner',
		icon: '🔬',
		desc: 'You seek genuine understanding, connect ideas across subjects, and look for evidence before accepting claims. You learn because the ideas genuinely interest you.',
		strengths: [
			'Strong conceptual understanding that transfers across subjects',
			'Natural critical thinking and evidence-based reasoning',
			'Intrinsic interest makes learning feel less like "work"'
		],
		tips: [
			'Challenge yourself with open-ended research projects',
			'Teach concepts to others — explaining deepens your understanding',
			'Use concept maps to visualise connections between ideas'
		]
	},
	strategic: {
		label: 'Strategic Learner',
		icon: '🎯',
		desc: 'You are organised and intentional about your study. You plan your time, monitor your progress, and focus on what matters most for success.',
		strengths: [
			'Efficient use of study time with clear priorities',
			'Self-monitoring ensures consistent progress',
			'Adaptable — changes methods when something isn\'t working'
		],
		tips: [
			'Pair your planning skills with deeper questioning',
			'Avoid over-optimising for grades at the expense of genuine understanding',
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
		tips: [
			'Try asking "why?" and "how?" about what you memorise — even one question per topic',
			'Connect study topics to things you actually care about',
			'Work with a study partner who can discuss ideas, not just review notes',
			'Start with practice problems before memorising — understanding comes from doing'
		]
	}
};

const MOTIVATION_DESC = {
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
		desc: 'You are mainly motivated by external pressures — grades, rewards, or avoiding trouble. Internal interest plays a smaller role.',
		insight: 'External motivation works in the short term but can lead to burnout. Try finding personal meaning in what you study.'
	},
	amotivated: {
		label: 'Disengaged',
		icon: '⚠️',
		desc: 'You are struggling to find reasons to engage with school. This isn\'t laziness — it often signals a mismatch between your needs and your current learning environment.',
		insight: 'This is a flag for intervention. A supportive tutor, counsellor, or mentor who can help reconnect you with purpose is important.'
	}
};

/**
 * Generate cross-system insights comparing HEXACO personality with study profile.
 */
function generateCrossInsights(dimensions, studyProfile) {
	const insights = [];
	const O = dimScore(dimensions, 'O');
	const C = dimScore(dimensions, 'C');
	const E = dimScore(dimensions, 'E');
	const X = dimScore(dimensions, 'X');
	const sp = studyProfile;

	// High Openness + Surface approach = untapped potential
	if (isHigh(O) && sp.studyApproaches.surface.level === 'high') {
		insights.push({
			icon: '💡',
			title: 'Curiosity Not Translating',
			text: 'Your high intellectual curiosity (Openness) isn\'t showing up in your study approach yet. You have the capacity for deep learning — try connecting schoolwork to topics that genuinely fascinate you.'
		});
	}

	// High C + Surface approach = surprising mismatch
	if (isHigh(C) && sp.studyApproaches.surface.level === 'high') {
		insights.push({
			icon: '🔄',
			title: 'Organised but Shallow',
			text: 'You\'re highly organised and disciplined (Conscientiousness), but your study is focused on surface-level memorisation. Try redirecting your excellent habits toward understanding, not just completion.'
		});
	}

	// Low C + High strategic = effective compensation
	if (isLow(C) && sp.studyApproaches.strategic.level === 'high') {
		insights.push({
			icon: '✨',
			title: 'Smart Compensation',
			text: 'Despite lower natural organisation (Conscientiousness), you\'ve developed strong strategic study skills. This shows real self-awareness and adaptability.'
		});
	}

	// High Emotionality + High test anxiety
	if (isHigh(E) && sp.selfRegulation.testAnxiety.level === 'low') {
		insights.push({
			icon: '🫧',
			title: 'Anxiety Compounds',
			text: 'Your naturally sensitive temperament (Emotionality) combined with test anxiety creates a double pressure. Relaxation techniques and practice under timed conditions can help build resilience.'
		});
	}

	// High X + Low help-seeking = paradox
	if (isHigh(X) && sp.selfRegulation.helpSeeking.level === 'low') {
		insights.push({
			icon: '🤔',
			title: 'Social but Silent',
			text: 'You\'re socially confident (Extraversion) but reluctant to ask for academic help. Your social skills are an asset — use them to build study partnerships and ask questions in class.'
		});
	}

	// High O + Deep approach = natural alignment
	if (isHigh(O) && sp.studyApproaches.deep.level === 'high') {
		insights.push({
			icon: '🎯',
			title: 'Natural Deep Learner',
			text: 'Your intellectual curiosity (Openness) aligns beautifully with your deep study approach. You\'re wired to understand, not just memorise. Lean into research and creative projects.'
		});
	}

	// Low C + High amotivation = compounding risk
	if (isLow(C) && sp.motivation.amotivation.level === 'high') {
		insights.push({
			icon: '🚨',
			title: 'Disengagement Risk',
			text: 'Low natural organisation combined with feelings of pointlessness creates a risk of academic disengagement. A structured, supportive tutor who can rebuild purpose and habits is essential.'
		});
	}

	// High C + Self-determined = excellence pattern
	if (isHigh(C) && sp.motivationProfile === 'self-determined') {
		insights.push({
			icon: '🏆',
			title: 'Excellence Pattern',
			text: 'High discipline (Conscientiousness) paired with genuine self-motivation is the strongest predictor of academic success. You have the engine and the fuel — just make sure you also rest.'
		});
	}

	return insights.slice(0, 4); // Cap at 4 insights
}

/**
 * Generate regulation assessment for the report.
 */
function generateRegulationAssessment(selfReg) {
	const items = [
		{ key: 'selfEfficacy', label: 'Self-Efficacy', icon: '💪', desc: 'Belief in your ability to succeed' },
		{ key: 'planning', label: 'Planning', icon: '📅', desc: 'Setting goals and organising study time' },
		{ key: 'effortRegulation', label: 'Effort Regulation', icon: '🏋️', desc: 'Pushing through when it\'s hard or boring' },
		{ key: 'testAnxiety', label: 'Test Calm', icon: '🧘', desc: 'Managing exam nerves (higher = calmer)' },
		{ key: 'helpSeeking', label: 'Help-Seeking', icon: '🤝', desc: 'Willingness to ask for support when stuck' }
	];

	return items.map((item) => ({
		...item,
		score: selfReg[item.key].score,
		level: selfReg[item.key].level
	}));
}

/**
 * Generate the full study profile report section.
 * @param {object} results - Full results with dimensions and studyProfile
 * @returns {object|null} Section data, or null if no studyProfile
 */
export function generateStudyProfile(results) {
	if (!results.studyProfile) return null;

	const sp = results.studyProfile;
	const approach = APPROACH_DESC[sp.dominantApproach];
	const motivation = MOTIVATION_DESC[sp.motivationProfile];

	return {
		// Study Approaches
		dominantApproach: sp.dominantApproach,
		approach,
		approaches: {
			deep: { ...sp.studyApproaches.deep, label: 'Deep', color: '#6366f1' },
			strategic: { ...sp.studyApproaches.strategic, label: 'Strategic', color: '#f59e0b' },
			surface: { ...sp.studyApproaches.surface, label: 'Surface', color: '#ef4444' }
		},

		// Motivation
		motivationProfile: sp.motivationProfile,
		motivation,
		motivationScores: {
			intrinsic: { ...sp.motivation.intrinsic, label: 'Intrinsic', color: '#22c55e' },
			identified: { ...sp.motivation.identified, label: 'Identified', color: '#3b82f6' },
			external: { ...sp.motivation.external, label: 'External', color: '#f97316' },
			amotivation: { ...sp.motivation.amotivation, label: 'Amotivation', color: '#ef4444' }
		},
		sdi: sp.motivation.sdi,

		// Self-Regulation
		regulationStrength: sp.regulationStrength,
		regulation: generateRegulationAssessment(sp.selfRegulation),

		// Cross-system insights
		crossInsights: generateCrossInsights(results.dimensions, sp)
	};
}
