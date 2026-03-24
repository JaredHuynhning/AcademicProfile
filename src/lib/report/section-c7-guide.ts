// @ts-nocheck
/**
 * Section C7: Guide for Teachers & Parents
 * One-minute brief, teacher strategies, parent support, tutor match.
 */
import { getLearningArchetype, classifyLevel, DIM_NAMES } from './helpers';

export function generateUnifiedGuide(results, crossRefResult) {
	const dims = results.dimensions;
	const sp = results.studyProfile;
	const lp = results.learnerProfile;

	const archetype = getLearningArchetype(dims, sp);

	const confirmations = [...(crossRefResult.byType.confirmation || [])].sort((a, b) => b.impact - a.impact);
	const rootCauses = [...(crossRefResult.byType.root_cause || [])].sort((a, b) => b.impact - a.impact);

	const topStrength = confirmations[0]?.insight || 'A well-balanced personality profile with multiple academic strengths.';
	const topWarning = rootCauses[0]
		? `Watch for: ${rootCauses[0].visibleBehaviour || rootCauses[0].insight.split('.')[0]}. Root cause: ${rootCauses[0].insight.split('.')[0]}.`
		: 'No major risk patterns detected — continue monitoring for emerging challenges.';

	const oneMinuteBrief = { archetype, topStrength, topWarning };

	// Teacher strategies
	const xLevel = classifyLevel(dims?.X?.score ?? 3);
	const cLevel = classifyLevel(dims?.C?.score ?? 3);
	const anxietyScore = dims?.E?.facets?.anxiety?.score ?? 2;
	const highAnxiety = anxietyScore >= 3.5 || (sp?.selfRegulation?.testAnxiety?.score ?? 2) >= 3.5;
	const emotionalityLevel = classifyLevel(dims?.E?.score ?? 3);

	const strategies = [];
	if (xLevel === 'high') {
		strategies.push('Allow class discussion and peer-to-peer explanation — this student learns best by talking through ideas.');
		strategies.push('Consider peer tutoring or study group facilitation roles. Leadership in learning contexts builds confidence.');
	} else if (xLevel === 'low') {
		strategies.push('Offer written or one-on-one channels for questions — this student struggles to ask in front of the class.');
		strategies.push('Do not cold-call unexpectedly. Give advance notice before asking for verbal responses.');
	} else {
		strategies.push('Flexible participation — sometimes collaborative, sometimes independent. Check in to see which mode fits the moment.');
	}

	if (cLevel === 'high') {
		strategies.push('Provide structured rubrics and clear expectations. This student performs best when they know exactly what is required.');
	} else {
		strategies.push('Break assignments into smaller checkpoints with regular feedback — this student needs external structure to self-regulate effectively.');
	}

	if (highAnxiety) {
		strategies.push('Reduce surprise assessments where possible. Predictability reduces anxiety and allows full cognitive capacity to be applied to the task.');
	}

	const teacherPreferenceWarmth = lp?.teacherPreference?.warmth ?? 3;
	const teacherPreferenceStructure = lp?.teacherPreference?.structure ?? 3;

	const feedbackApproach =
		highAnxiety || emotionalityLevel === 'high'
			? 'Lead with what is working before addressing gaps. For this student, criticism lands harder — frame corrections as growth opportunities, not failures. Written feedback is often better received than verbal.'
			: teacherPreferenceWarmth >= 4
				? 'This student values warmth in feedback. A supportive tone is not "softness" — it is the most effective delivery method for this personality type.'
				: teacherPreferenceStructure >= 4
					? 'This student prefers direct, specific feedback with clear next steps. Avoid vague praise — tell them exactly what to improve and how.'
					: 'Balanced feedback works well. Be honest, specific, and constructive. This student can handle direct feedback delivered respectfully.';

	const warningSignalsTeacher = rootCauses.slice(0, 3).map((i) => ({
		watch: i.visibleBehaviour || 'Observable change in engagement or output',
		means: i.insight.split('.')[0],
		do: i.action.split('.')[0]
	}));

	const forTeachers = { strategies, feedbackApproach, warningSignals: warningSignalsTeacher };

	// Parent support
	const homeEnvironment =
		xLevel === 'low'
			? 'Create a quiet, dedicated study space with minimal interruptions. This student recharges through solitude and works best with low social demand at home.'
			: xLevel === 'high'
				? 'Allow some social connection alongside study — brief family check-ins or study with a sibling or friend can help maintain energy.'
				: 'A calm, organised home environment works well. Minimal noise during key study blocks is helpful but occasional social interaction is fine.';

	const dominantApproach = sp?.dominantApproach || 'strategic';
	const studySupport =
		dominantApproach === 'surface'
			? 'Ask "What did you actually understand today?" rather than "Did you do your homework?" Encourage explanation rather than recitation.'
			: dominantApproach === 'deep'
				? 'Support the process, not just the product. Ask what questions they are exploring, not just what marks they got.'
				: 'Check that planning and review habits are consistent. Ask to see their weekly schedule occasionally to ensure follow-through.';

	const emotionalSupport =
		highAnxiety
			? 'Validate anxiety without amplifying it. Avoid "You should have started earlier" — this adds shame. Instead: "What would make the next step feel manageable?" Help build a pre-exam calming routine.'
			: dims?.E?.score >= 3.5
				? 'This student feels things deeply. Provide emotional availability, especially before assessments. A brief "how are you feeling about this?" goes a long way.'
				: 'This student is relatively emotionally self-sufficient. Support looks like asking questions rather than offering advice.';

	const conversationStarters = buildConversationStarters(dims, sp, lp, archetype);

	const warningSignalsParent = rootCauses.slice(0, 3).map((i) => ({
		watch: i.visibleBehaviour || 'Change in usual study patterns',
		means: i.insight.split('.')[0],
		do: `Support tip: ${i.action.split('.')[0]}`
	}));

	const forParents = {
		homeEnvironment,
		studySupport,
		emotionalSupport,
		conversationStarters,
		warningSignals: warningSignalsParent
	};

	// Tutor match
	const tutorTraits = buildTutorTraits(dims, sp, highAnxiety);
	const tutorRationale = `This student's ${archetype} profile means they need a tutor who ${tutorTraits.slice(0, 2).join(' and ')}. Mismatched tutor styles risk reinforcing existing barriers rather than addressing them.`;

	const tutorMatch = { traits: tutorTraits, rationale: tutorRationale };

	// Build narrative prose
	const narrative = [
		`${archetype} profile. Strongest confirmed pattern: ${topStrength}. Key risk to watch: ${topWarning}`,
		`For teachers: ${feedbackApproach}`,
		`For parents: ${homeEnvironment} ${emotionalSupport}`,
		`For tutors: ${tutorRationale}`
	].join('\n\n');

	return {
		narrative,
		oneMinuteBrief,
		forTeachers,
		forParents,
		tutorMatch
	};
}

function buildConversationStarters(dims, sp, lp, archetype) {
	const starters = [
		'What part of school is actually working for you right now?',
		'Is there a subject where you feel genuinely curious — even a little?'
	];

	const anxietyScore = dims?.E?.facets?.anxiety?.score ?? 2;
	if (anxietyScore >= 3.5) {
		starters.push('When you feel stressed about school, what does that feel like — where do you notice it first?');
		starters.push('What would need to change for exams to feel less overwhelming?');
	}

	const xScore = dims?.X?.score ?? 3;
	if (xScore < 2.5) {
		starters.push('Do you have people at school you feel comfortable talking to — even one?');
	} else {
		starters.push('Who in your class do you work well with? What makes them a good study partner?');
	}

	const cScore = dims?.C?.score ?? 3;
	if (cScore < 2.5) {
		starters.push('If you could design your perfect study setup — when, where, and how — what would it look like?');
	}

	starters.push('What is one thing about school you wish teachers or parents understood better?');

	return starters.slice(0, 5);
}

function buildTutorTraits(dims, sp, highAnxiety) {
	const traits = [];
	const xLevel = classifyLevel(dims?.X?.score ?? 3);
	const cLevel = classifyLevel(dims?.C?.score ?? 3);
	const dominantApproach = sp?.dominantApproach || 'strategic';

	if (highAnxiety) {
		traits.push('is patient and non-judgmental — anxiety rises with time pressure and harsh correction');
		traits.push('normalises mistakes and frames them as learning data, not failures');
	}

	if (cLevel === 'low') {
		traits.push('provides external structure (session plans, checklists, review schedules) rather than expecting the student to self-direct');
	}

	if (xLevel === 'low') {
		traits.push('works well one-on-one and does not pressure participation in group settings');
	} else if (xLevel === 'high') {
		traits.push('engages in conversation and collaborative problem-solving, not just lecture-style delivery');
	}

	if (dominantApproach === 'surface') {
		traits.push('explicitly teaches active recall and retrieval practice, not just explanation and re-reading');
	} else if (dominantApproach === 'deep') {
		traits.push('can go beyond the syllabus into genuine conceptual exploration when the student is engaged');
	}

	traits.push('gives clear, specific feedback with actionable next steps rather than vague encouragement');

	return traits.slice(0, 5);
}
