/**
 * Section 14: What Works For You
 * Generates teacher preference profile, carrot-vs-stick type,
 * and exam barrier diagnosis with specific strategies.
 */

const TEACHER_PROFILES = {
	'warm-structured': {
		label: 'Warm & Structured',
		icon: '🌟',
		desc: 'You thrive with teachers who combine warmth and encouragement with clear expectations and structure. You want to feel supported AND pushed to achieve. The ideal tutor is friendly but firm: they believe in you while holding you to high standards.',
		tutorTip: 'Look for a tutor who sets clear goals each session, gives warm feedback, and follows up on commitments. Avoid overly casual or overly strict approaches.'
	},
	'warm-flexible': {
		label: 'Warm & Flexible',
		icon: '🌱',
		desc: 'You respond best to teachers who are encouraging, flexible, and relationship-focused. You need to feel safe and supported before you can take academic risks. Rigid structure or high-pressure environments shut you down.',
		tutorTip: 'Look for a tutor who builds rapport first, adapts to your pace, and creates a low-pressure learning environment. Progress comes through trust, not pressure.'
	},
	'firm-structured': {
		label: 'Firm & Structured',
		icon: '📐',
		desc: 'You prefer teachers who are direct, no-nonsense, and focused on results. You respect authority and clear expectations more than warmth and encouragement. You want to know exactly what\'s expected and how to meet those standards.',
		tutorTip: 'Look for a tutor who is efficient, sets clear targets, and measures progress objectively. You don\'t need hand-holding: you need clear direction and accountability.'
	},
	'firm-flexible': {
		label: 'Independent',
		icon: '🦅',
		desc: 'You prefer a high degree of independence in your learning. You don\'t need a lot of warmth or structure from teachers, you\'d rather figure things out your way. You respond to competence and respect, not authority or comfort.',
		tutorTip: 'Look for a tutor who treats you as an equal, gives you autonomy over learning direction, and acts more as a consultant than an instructor. Micromanagement will frustrate you.'
	}
};

const RESPONSE_TYPES = {
	encouragement: {
		label: 'Encouragement-Driven',
		icon: '💪',
		desc: 'You respond much more to positive reinforcement than to consequences. When someone believes in you and tells you you\'re doing well, you push harder. Criticism or punishment tends to demotivate rather than motivate you.',
		strategy: 'Tutors and parents should lead with praise and recognition. Frame feedback as "here\'s what you did well, and here\'s how to do even better" rather than "here\'s what went wrong."'
	},
	accountability: {
		label: 'Accountability-Driven',
		icon: '⚡',
		desc: 'You respond more to clear consequences and accountability than to encouragement alone. Knowing there are real stakes helps you focus and perform. You find pure encouragement without follow-through less motivating.',
		strategy: 'Set up accountability structures: regular check-ins, visible progress tracking, and agreed consequences for missed targets. You work best with a clear "contract" approach.'
	},
	balanced: {
		label: 'Balanced Response',
		icon: '⚖️',
		desc: 'You respond to both encouragement and accountability roughly equally. You appreciate being told you\'re doing well, but you also need some structure and consequences to stay on track.',
		strategy: 'A mix of positive reinforcement and gentle accountability works best. Regular progress reviews with both praise and constructive feedback keep you motivated.'
	}
};

const BARRIER_DIAGNOSES = {
	anxiety: {
		label: 'Exam Anxiety',
		icon: '😰',
		desc: 'Your biggest exam barrier is anxiety. Nerves are significantly holding back your performance: you likely know more than your results suggest. This is one of the most treatable barriers.',
		strategies: [
			'Practice exams under timed conditions regularly, familiarity reduces anxiety',
			'Learn box breathing (4-4-4-4) and use it before and during exams',
			'Arrive early, avoid anxious classmates before the exam, and start with questions you know',
			'Consider speaking with a school counsellor about exam anxiety support'
		]
	},
	'time-management': {
		label: 'Time Management',
		icon: '⏰',
		desc: 'Time management in exams is your primary barrier. You run out of time because you spend too long on some questions or don\'t plan your approach. This is highly fixable with practice.',
		strategies: [
			'Before starting, read through the entire exam and allocate time per section',
			'Wear a watch (if allowed) and check it after each section',
			'If stuck on a question for more than 2 minutes, mark it and move on',
			'Practice timed mock exams weekly, the skill of pacing improves rapidly with practice'
		]
	},
	'external-blame': {
		label: 'External Attribution',
		icon: '🔍',
		desc: 'You tend to attribute poor exam results to external factors (unfair tests, bad luck, hard markers). While sometimes tests are genuinely unfair, this attribution pattern can prevent you from improving what you can control.',
		strategies: [
			'After each exam, write down one thing YOU could have done differently, not what the exam could have done differently',
			'Ask your teacher to explain the marking criteria before the exam, not after',
			'Compare your answers with high-scoring classmates to see specific gaps',
			'Focus on "controllables": preparation quality, sleep, nutrition, revision strategy'
		]
	},
	preparation: {
		label: 'Preparation Quality',
		icon: '📝',
		desc: 'You recognise that your exam results largely depend on how well you prepare. This is actually the healthiest attribution pattern: it means you have an internal locus of control and believe effort matters.',
		strategies: [
			'Since you already link effort to outcomes, focus on study quality not just quantity',
			'Use active recall and spaced repetition instead of passive re-reading',
			'Create practice exams from your notes and test yourself under exam conditions',
			'Review past exams to identify your specific weak topics and target them'
		]
	},
	none: {
		label: 'No Dominant Barrier',
		icon: '✅',
		desc: 'You don\'t show a strong pattern of any single exam barrier. This is positive: you likely have a balanced approach to exams without one factor disproportionately holding you back.',
		strategies: [
			'Continue with your current approach, it\'s balanced',
			'Focus on incremental improvements: slightly better preparation, slightly calmer nerves',
			'Review your exam results honestly and address any patterns you notice',
			'Share your strategies with classmates who struggle more'
		]
	}
};

/**
 * @param {object} results - Full results with learnerProfile
 * @returns {object|null}
 */
export function generateWhatWorks(results) {
	if (!results.learnerProfile) return null;

	const lp = results.learnerProfile;
	const tp = lp.teacherPreference;
	const eb = lp.examBarriers;

	const teacherProfile = TEACHER_PROFILES[tp.profile];
	const responseType = RESPONSE_TYPES[tp.responseType];
	const barrierDiagnosis = BARRIER_DIAGNOSES[eb.primaryBarrier];

	return {
		teacher: {
			...teacherProfile,
			profile: tp.profile,
			structureScore: tp.structure,
			warmthScore: tp.warmth
		},
		response: {
			...responseType,
			carrotScore: tp.carrot,
			stickScore: tp.stick,
			type: tp.responseType
		},
		examBarrier: {
			...barrierDiagnosis,
			barrier: eb.primaryBarrier,
			scores: {
				preparation: eb.preparation,
				external: eb.external,
				anxiety: eb.anxiety,
				timeManagement: eb.timeManagement
			}
		}
	};
}
