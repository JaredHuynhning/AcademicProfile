/**
 * Mega Section 9: Subject Fit & Career Signals
 * Generates ~3 pages: subject alignment, passion/confidence, career signals.
 */
import { DIM_NAMES, classifyLevel, scorePercentile, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';
import { LearnerProfile } from '../../types';
import type { CrossRefResult } from '../cross-reference-engine';
import { pickOpener, renderInteractionCallout, renderInteractionAction, pickInteractionsForSection, detectFacetSurprises } from '../prose-variety';

const SUBJECT_PERSONALITY_FIT: Record<string, { dims: string[]; high: string; low: string }> = {
	Mathematics: {
		dims: ['C', 'O'],
		high: 'Conscientiousness drives the consistent practice needed for maths fluency. Openness supports abstract reasoning and creative problem-solving.',
		low: 'Lower Conscientiousness may cause gaps in foundational skills (maths is cumulative). Lower Openness may cause difficulty with abstract proofs and theoretical concepts.',
	},
	English: {
		dims: ['O', 'E'],
		high: 'High Openness fuels creative writing and literary analysis. Higher Emotionality adds depth to character understanding and empathetic reading.',
		low: 'Lower Openness may make essay-writing and creative tasks feel unnatural. Lower Emotionality may reduce engagement with character-driven literature.',
	},
	Science: {
		dims: ['O', 'C'],
		high: 'Curiosity (Openness) drives scientific inquiry. Conscientiousness ensures rigorous experimental method and systematic data recording.',
		low: 'Lower Openness may reduce interest in theoretical science. Lower Conscientiousness may cause careless experimental procedures.',
	},
	History: {
		dims: ['O', 'A'],
		high: 'Openness supports engaging with diverse perspectives and complex causes. Agreeableness aids in understanding multiple viewpoints in historical debate.',
		low: 'Students with lower Openness may prefer straightforward chronological narratives over analytical essays. Lower Agreeableness may actually help with critical evaluation of sources.',
	},
	Languages: {
		dims: ['X', 'O'],
		high: 'Extraversion drives willingness to practise speaking. Openness supports learning new grammar systems and cultural perspectives.',
		low: 'Introversion may inhibit speaking practice. Lower Openness may reduce tolerance for the ambiguity inherent in language learning.',
	},
	'Creative Arts': {
		dims: ['O', 'E'],
		high: 'High Openness is the strongest predictor of creative achievement. Higher Emotionality provides the emotional depth that enriches artistic expression.',
		low: 'Lower Openness may limit creative risk-taking. The arts may feel uncomfortable for students who prefer clear right/wrong answers.',
	},
	'Physical Education': {
		dims: ['X', 'C'],
		high: 'Extraversion supports team sports and social competition. Conscientiousness drives training discipline and fitness routines.',
		low: 'Introversion may make team sports uncomfortable. Lower Conscientiousness may reduce training consistency.',
	},
	'Technology/Computing': {
		dims: ['C', 'O'],
		high: 'Conscientiousness provides the precision needed for programming. Openness drives creative problem-solving and interest in how systems work.',
		low: 'Lower Conscientiousness may lead to buggy, untested code. Lower Openness may limit interest in theoretical CS concepts.',
	},
};

export function generateSubjectFitMega(
	dimensions: DimensionsMap,
	learnerProfile: LearnerProfile | null,
	studentName: string,
	crossRefResult: CrossRefResult | null,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	narrative.push(
		`${pickOpener(studentName, 9)} how personality aligns with different subjects. Which subjects naturally fit ${studentName}'s profile — and which will require more effort? This section maps the fit between their personality traits and major subject areas, helping parents and teachers understand why some subjects feel easy and others feel like pushing uphill.`
	);

	// Inject interactions involving O or C dimensions
	const relevantInteractions = pickInteractionsForSection(
		(crossRefResult?.interactions ?? []).filter(i => i.dims.some(d => d === 'O' || d === 'C')), 9, 2
	);
	relevantInteractions.forEach((interaction, idx) => {
		narrative.push(renderInteractionCallout(interaction, 9 + idx));
		narrative.push(renderInteractionAction(interaction, idx));
	});

	narrative.push(
		`Research on personality-subject fit explains approximately 10-15% of the variance in subject grades beyond general ability (Vedel, 2014). This means two students of equal intelligence may receive different grades in the same subject simply because their personality is more or less aligned with the subject's demands. Understanding this alignment helps set realistic expectations, choose appropriate support strategies, and make informed decisions about subject selection.`
	);

	narrative.push(
		`A mismatched personality-subject fit does NOT mean ${studentName} cannot succeed in that subject. It means they will need different strategies — and possibly more effort — than a student whose personality naturally aligns. Many of the world's best scientists were not "naturally scientific" in personality; they developed strategies to compensate for their natural tendencies. The same is true for any student in any subject.`
	);

	// ─── Subject Alignment ───────────────────────────────────────────────────────
	narrative.push('\n### Subject Alignment Matrix');

	const subjectScores: { subject: string; fit: 'Excellent' | 'Good' | 'Challenging'; explanation: string }[] = [];

	for (const [subject, config] of Object.entries(SUBJECT_PERSONALITY_FIT)) {
		const relevantScores = config.dims.map(d => dimensions[d]?.score || 3.0);
		const avgScore = relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length;
		const fit = avgScore >= 3.5 ? 'Excellent' : avgScore >= 2.5 ? 'Good' : 'Challenging';
		const explanation = fit === 'Excellent' || (fit === 'Good' && avgScore >= 3.0) ? config.high : config.low;

		subjectScores.push({ subject, fit, explanation });
	}

	// Sort: Excellent first, then Good, then Challenging
	subjectScores.sort((a, b) => {
		const order = { Excellent: 0, Good: 1, Challenging: 2 };
		return order[a.fit] - order[b.fit];
	});

	// Top 3 best fits
	const topFits = subjectScores.filter(s => s.fit === 'Excellent').slice(0, 3);
	if (topFits.length > 0) {
		narrative.push(`\n#### Best Personality-Subject Fit`);
		topFits.forEach(s => {
			narrative.push(`**${s.subject}** (${s.fit}): ${s.explanation}`);
		});
		keyFindings.push({
			title: 'Best Subject Fits',
			text: `${studentName}'s personality is best aligned with ${topFits.map(s => s.subject).join(', ')}.`,
			type: 'strength',
			color: '#22c55e',
		});
	}

	// Bottom 3 challenging fits
	const hardFits = subjectScores.filter(s => s.fit === 'Challenging');
	if (hardFits.length > 0) {
		narrative.push(`\n#### Subjects Requiring Extra Strategy`);
		hardFits.forEach(s => {
			narrative.push(`**${s.subject}** (${s.fit}): ${s.explanation}`);
		});
		keyFindings.push({
			title: 'Challenging Fits',
			text: `${studentName} may need additional support or different strategies for ${hardFits.map(s => s.subject).join(', ')}.`,
			type: 'insight',
			color: '#f59e0b',
		});
	}

	// Everything else
	const midFits = subjectScores.filter(s => s.fit === 'Good');
	if (midFits.length > 0) {
		narrative.push(`\n#### Good Fit (standard approach works)`);
		midFits.forEach(s => {
			narrative.push(`**${s.subject}** (${s.fit}): ${s.explanation}`);
		});
	}

	researchNotes.push({
		text: 'Personality-subject fit explains approximately 10-15% of the variance in subject grades beyond general ability (Vedel, 2014). A mismatch doesn\'t mean failure — it means the student needs different strategies for that subject.',
		topic: 'Subject fit',
	});

	// ─── Passion & Confidence ────────────────────────────────────────────────────
	narrative.push('\n### Passion & Confidence Analysis');

	const subjectFit = learnerProfile?.subjectFit as Record<string, any> | undefined;
	if (subjectFit) {
		const subjects = ['maths', 'english', 'science'].filter(s => (subjectFit as Record<string, any>)[s]);

		subjects.forEach(s => {
			const data = (subjectFit as Record<string, any>)[s];
			const passion = data.passion;
			const confidence = data.confidence;
			const alignment = data.alignment;
			const subjectName = s.charAt(0).toUpperCase() + s.slice(1);

			if (passion >= 3.5 && confidence >= 3.5) {
				narrative.push(`**${subjectName}:** ${studentName} shows both high passion and high confidence — this is the **flow zone** where engagement and belief in success drive peak performance. Lean into this subject.`);
			} else if (passion >= 3.5 && confidence < 2.5) {
				narrative.push(`**${subjectName}:** High passion but low confidence — ${studentName} loves this subject but doubts their ability. This is the **growth zone**: the motivation is there, they just need confidence-building through small successes and clear skill progression.`);
			} else if (passion < 2.5 && confidence >= 3.5) {
				narrative.push(`**${subjectName}:** Low passion but high confidence — ${studentName} knows they CAN do well but doesn't care. This is the **efficiency zone**: the goal is meeting requirements with minimal wasted effort, freeing time for subjects they actually enjoy.`);
			} else if (passion < 2.5 && confidence < 2.5) {
				narrative.push(`**${subjectName}:** Low passion AND low confidence — the **danger zone**. ${studentName} neither likes this subject nor believes they can succeed. The priority is finding one small win that breaks the cycle of disengagement.`);
			} else {
				narrative.push(`**${subjectName}:** ${studentName} shows moderate engagement (passion ${passion.toFixed(1)}/5, confidence ${confidence.toFixed(1)}/5). A workable foundation that responds well to targeted encouragement and clear connections to real-world applications.`);
			}
		});
	} else {
		narrative.push(
			`Passion and confidence data was not available for specific subjects. The personality-based subject fit analysis above provides the best available guide to where ${studentName} is likely to thrive and where they'll need additional support.`
		);
	}

	// ─── Career Signals ──────────────────────────────────────────────────────────
	narrative.push('\n### Early Career Signals');

	narrative.push(
		`${pickOpener(studentName, 19)} early career signals that personality research reveals — interesting patterns between HEXACO profiles and career satisfaction. These are not predictions — they're data points worth exploring as ${studentName} discovers their interests over time. The strongest career signal at this age is not what personality data says, but what makes ${studentName} lose track of time — whatever that is, it's worth exploring further.`
	);

	narrative.push(
		`Research by Holland (1997) and McKay & Tokar (2012) shows meaningful connections between personality dimensions and career satisfaction. These connections don't determine career choice — they indicate where ${studentName} is most likely to find sustained engagement and fulfilment. People who work in fields that align with their personality report 30-40% higher job satisfaction and are significantly less likely to burn out.`
	);

	const oScore = dimensions.O?.score || 3.0;
	const cScore = dimensions.C?.score || 3.0;
	const xScore = dimensions.X?.score || 3.0;
	const aScore = dimensions.A?.score || 3.0;

	if (oScore >= 3.5 && cScore >= 3.5) {
		narrative.push(`${studentName}'s combination of curiosity and discipline correlates with satisfaction in **research, engineering, medicine, and strategic consulting** — fields that reward both deep thinking and systematic execution.`);
	}
	if (xScore >= 3.5 && aScore >= 3.5) {
		narrative.push(`${studentName}'s social warmth and energy align with satisfaction in **teaching, counselling, healthcare, and community leadership** — fields centred on positive human interaction.`);
	}
	if (oScore >= 3.5 && xScore < 2.5) {
		narrative.push(`${studentName}'s creative introversion correlates with satisfaction in **writing, design, software development, and research** — fields that reward deep independent thought.`);
	}
	if (cScore >= 3.5 && aScore < 2.5) {
		narrative.push(`${studentName}'s discipline and directness correlate with satisfaction in **law, finance, surgery, and entrepreneurship** — fields that reward precision and decisive action.`);
	}
	if (oScore < 2.5 && cScore >= 3.5) {
		narrative.push(`${studentName}'s practical reliability correlates with satisfaction in **accounting, project management, logistics, and trades** — fields that reward consistency and execution over novelty.`);
	}

	narrative.push(
		`These are patterns, not prescriptions. The most important career signal at this age is not what personality says, but what makes ${studentName} lose track of time. Whatever that is — pursue it.`
	);

	researchNotes.push({
		text: 'Holland\'s career typology and HEXACO personality dimensions show meaningful overlap: Openness predicts Artistic/Investigative careers, Extraversion predicts Social/Enterprising careers, and Conscientiousness predicts Conventional careers (McKay & Tokar, 2012).',
		topic: 'Career signals',
	});

	// ─── Facet Surprises ────────────────────────────────────────────────────────
	const surprises = detectFacetSurprises(dimensions, studentName);
	if (surprises.length > 0) {
		narrative.push('\n#### Hidden Details in the Data');
		surprises.slice(0, 2).forEach(s => narrative.push(s));
	}

	return {
		narrative,
		keyFindings,
		researchNotes,
		scenarios: [],
		crossReferences: [
			{ targetSection: 'study-playbook', text: 'Subject-specific study strategies in Section 5.' },
		],
		actions: [],
	};
}
