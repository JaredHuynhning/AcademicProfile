/**
 * Section 10 (bottom): Tutor Match & Archetype Deep Dive
 */
import { isHigh, isLow, DIM_SHORT } from './helpers.js';

export function generateTutor(results) {
	const archetypes = results.archetypes || [];
	const top3 = archetypes.slice(0, 3);

	return {
		archetypes: top3.map((arch, i) => ({
			rank: i + 1,
			...arch,
			matchPercent: Math.round((arch.match_score || 0) * 100),
			expanded: expandArchetype(arch, results.dimensions),
			lookFor: whatToLookFor(arch),
			redFlags: getRedFlags(arch, results.dimensions)
		})),
		evaluationTips: buildEvaluationTips(results.dimensions),
		generalAdvice: buildGeneralAdvice(results.dimensions)
	};
}

function expandArchetype(archetype, dims) {
	const name = archetype.name?.toLowerCase() || '';

	if (name.includes('structured') || name.includes('coach')) {
		return {
			idealFor: 'Students who benefit from clear plans, consistent routines, and systematic progress tracking.',
			approach: 'This tutor will create lesson plans, set milestones, and hold the student accountable to a schedule. Sessions are well-organised with clear objectives.',
			bestWhen: 'The student needs help building study habits, preparing for structured exams, or tackling subjects that require systematic practice (maths, sciences, languages).',
			notIdeal: 'If the student is already highly structured and needs more creativity and inspiration instead.'
		};
	}
	if (name.includes('creative') || name.includes('explorer')) {
		return {
			idealFor: 'Students who need intellectual stimulation and creative approaches to stay engaged.',
			approach: 'This tutor uses varied methods, discussions, projects, real-world connections, multimedia, to make learning dynamic and exciting.',
			bestWhen: 'The student is creative and curious but struggles with traditional teaching methods or finds textbook learning boring.',
			notIdeal: 'If the student primarily needs help with exam technique and structured revision, creativity alone does not pass exams.'
		};
	}
	if (name.includes('motivator') || name.includes('dynamic')) {
		return {
			idealFor: 'Students who need energy, variety, and enthusiasm to stay engaged with their studies.',
			approach: 'This tutor keeps sessions lively with varied activities, gamification, and energetic delivery. They make learning feel fun rather than like a chore.',
			bestWhen: 'The student loses focus easily, is demotivated, or finds traditional tutoring sessions boring.',
			notIdeal: 'If the student needs deep, focused work on specific weaknesses, high energy can sometimes replace substance.'
		};
	}
	if (name.includes('mentor') || name.includes('academic')) {
		return {
			idealFor: 'Students who want to develop deep understanding and critical thinking skills.',
			approach: 'This tutor focuses on the "why" behind concepts, encourages questioning, and develops analytical frameworks that transfer across subjects.',
			bestWhen: 'The student is diligent and capable but needs help moving from memorisation to genuine understanding.',
			notIdeal: 'If the student primarily needs help with motivation and engagement, intellectual depth requires baseline engagement first.'
		};
	}
	if (name.includes('accountability') || name.includes('partner')) {
		return {
			idealFor: 'Students who know what to do but struggle with follow-through and consistency.',
			approach: 'This tutor sets clear expectations, checks progress regularly, and provides the external accountability that keeps the student on track.',
			bestWhen: 'The student is capable but under-performs due to inconsistency, procrastination, or lack of structure.',
			notIdeal: 'If the student is already highly self-disciplined, they may find the accountability structure unnecessarily controlling.'
		};
	}
	// Generic fallback
	return {
		idealFor: 'Students whose learning style aligns with this tutor\'s approach.',
		approach: archetype.description || 'A well-matched tutor adapts their style to the student\'s needs.',
		bestWhen: 'The student responds well to the teaching style described.',
		notIdeal: 'When the student needs a fundamentally different approach.'
	};
}

function whatToLookFor(archetype) {
	const name = archetype.name?.toLowerCase() || '';

	if (name.includes('structured') || name.includes('coach')) {
		return [
			'Arrives with a lesson plan and clear session objectives',
			'Tracks progress across sessions with records or a portfolio',
			'Sets homework and follows up on completion',
			'Can show examples of how they have helped similar students improve'
		];
	}
	if (name.includes('creative') || name.includes('explorer')) {
		return [
			'Uses varied teaching methods: not just textbook and questions',
			'Connects topics to real-world examples and other subjects',
			'Asks thought-provoking questions rather than just providing answers',
			'Shows genuine enthusiasm for the subject matter'
		];
	}
	if (name.includes('motivator') || name.includes('dynamic')) {
		return [
			'Makes sessions feel engaging and fast-paced',
			'Uses gamification, challenges, or interactive elements',
			'Adapts energy level to the student\'s mood and needs',
			'Can demonstrate tangible results despite the fun approach'
		];
	}
	if (name.includes('mentor') || name.includes('academic')) {
		return [
			'Explains concepts deeply rather than just providing answers',
			'Asks the student to explain their reasoning',
			'Challenges assumptions and develops critical thinking',
			'Has strong subject knowledge and academic credentials'
		];
	}
	if (name.includes('accountability') || name.includes('partner')) {
		return [
			'Sets clear expectations and deadlines for between sessions',
			'Follows up consistently on commitments made',
			'Balances firmness with encouragement',
			'Has experience with students who struggle with consistency'
		];
	}
	return [
		'Shows genuine interest in the student\'s learning',
		'Adapts their approach based on the student\'s response',
		'Communicates clearly about goals and progress',
		'Has relevant experience and qualifications'
	];
}

function getRedFlags(archetype, dims) {
	const flags = [];
	flags.push('Talks more than the student. Good tutoring is mostly listening and questioning');
	flags.push('Cannot explain concepts in multiple ways. If one explanation does not work, they should have alternatives');
	flags.push('Focuses only on getting through material rather than checking understanding');

	if (isHigh(dims.E.score)) {
		flags.push('Dismisses the student\'s emotions or anxiety. "Just relax" is not helpful guidance');
	}
	if (isLow(dims.C.score)) {
		flags.push('Does not provide structure or follow-up between sessions: this student needs accountability');
	}
	if (isHigh(dims.O.score)) {
		flags.push('Only uses textbook methods: this student needs creative and varied approaches');
	}

	return flags.slice(0, 4);
}

function buildEvaluationTips(dims) {
	return [
		{
			tip: 'Trial session',
			details: 'Book a single trial session before committing. Observe whether the student seems engaged and comfortable.'
		},
		{
			tip: 'Ask the student',
			details: 'After the trial, ask: "Did you feel you learned something? Would you want to go back?" Their gut feeling is reliable.'
		},
		{
			tip: 'Check for adaptability',
			details: 'A good tutor adjusts their approach when something is not working. Rigidity is a red flag.'
		},
		{
			tip: 'Look for rapport',
			details: isHigh(dims.E.score)
				? 'Emotional connection is especially important for this student. The tutor should be warm and patient.'
				: isHigh(dims.X.score)
					? 'Social connection matters, the tutor should be engaging and conversational.'
					: 'Professional rapport is key, the tutor should be competent and reliable.'
		}
	];
}

function buildGeneralAdvice(dims) {
	const advice = [];
	advice.push('The best tutor-student relationship is built on trust and mutual respect. Give it at least 3-4 sessions before judging fit.');
	advice.push('Share this personality profile with potential tutors, it helps them tailor their approach from session one.');

	if (isLow(dims.C.score)) {
		advice.push('Consistency is key, commit to regular weekly sessions at the same time. The routine itself is part of the benefit.');
	}
	if (isHigh(dims.O.score)) {
		advice.push('Look for tutors who welcome questions and tangents, a tutor who shuts down curiosity is the wrong fit.');
	}
	if (isHigh(dims.E.score)) {
		advice.push('The emotional safety of the tutoring relationship matters as much as the academic content. A brilliant tutor who makes your child anxious is not the right choice.');
	}

	return advice.slice(0, 4);
}
