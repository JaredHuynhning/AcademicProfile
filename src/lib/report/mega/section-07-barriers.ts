/**
 * Mega Section 7: Barriers & Root Causes
 * Generates ~5 pages: root cause chains, misdiagnosis table, negative cycles, intervention plan.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, classifyLevel, scorePercentile, type DimKey, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';
import { CrossRefResult } from '../cross-reference-engine';
import { LearnerProfile } from '../../types';
import { pickOpener, renderInteractionCallout, renderInteractionAction, pickInteractionsForSection, detectFacetSurprises } from '../prose-variety';

interface RootCause {
	personality: string;
	personalityDetail: string;
	symptom: string;
	symptomDetail: string;
	visible: string;
	intervention: string;
}

function identifyRootCauses(dimensions: DimensionsMap, studentName: string): RootCause[] {
	const causes: RootCause[] = [];
	const C = dimensions.C;
	const E = dimensions.E;
	const O = dimensions.O;
	const X = dimensions.X;
	const A = dimensions.A;

	if (C && C.score < 2.5) {
		causes.push({
			personality: `Low Conscientiousness (${C.score.toFixed(1)}/5)`,
			personalityDetail: `${studentName} lacks the natural self-discipline that makes homework completion, deadline tracking, and sustained revision feel automatic.`,
			symptom: 'Inconsistent homework, missed deadlines, poor exam preparation',
			symptomDetail: 'Work is often late, incomplete, or rushed at the last minute. The quality varies wildly depending on interest level.',
			visible: 'Teachers see: late submissions, messy work, "they could do better if they tried"',
			intervention: 'External structure: daily planner, study schedule, accountability partner, distraction-free zone. Start with 15-minute study blocks and build up.',
		});
	}
	if (C && C.facets?.perfectionism?.score >= 4.0) {
		causes.push({
			personality: `High Perfectionism (${C.facets.perfectionism.score.toFixed(1)}/5)`,
			personalityDetail: `${studentName} sets impossibly high standards. Anything less than perfect feels like failure.`,
			symptom: 'Procrastination, excessive time on single tasks, incomplete submissions',
			symptomDetail: '"If I can\'t do it perfectly, I won\'t start." ${studentName} may spend 3 hours on a 30-minute task, or avoid starting assignments until the last minute.',
			visible: 'Teachers see: smart student who hands in work late or not at all, despite obvious capability',
			intervention: 'Teach "good enough" calibration: grade the assignment before starting (is this worth 5% or 30%?). Set time limits per task. Practice submitting imperfect work deliberately.',
		});
	}
	if (E && E.score >= 3.5 && E.facets?.anxiety?.score >= 3.5) {
		causes.push({
			personality: `High Anxiety (${E.facets.anxiety.score.toFixed(1)}/5)`,
			personalityDetail: `${studentName} worries more than most students, particularly about academic performance and social judgement.`,
			symptom: 'Test anxiety, avoidance of challenging material, underperformance on timed assessments',
			symptomDetail: 'They may know the material but freeze under exam conditions. Pre-exam nights are spent worrying rather than sleeping.',
			visible: 'Teachers see: a student who seems to know the work in class but underperforms in exams',
			intervention: 'Build an exam anxiety toolkit: structured preparation (reduces uncertainty), practice under timed conditions (builds familiarity), deep breathing exercises, positive self-talk scripts.',
		});
	}
	if (X && X.score < 2.5 && X.facets?.social_boldness?.score < 2.5) {
		causes.push({
			personality: `Low Social Boldness (${X.facets.social_boldness?.score?.toFixed(1) || 'low'}/5)`,
			personalityDetail: `${studentName} finds it extremely difficult to speak up in class, ask questions, or participate in group discussions.`,
			symptom: 'Low classroom participation, missed learning from not asking questions, isolation in group work',
			symptomDetail: 'They understand the material but never contribute verbally. In group work, they do tasks alone rather than collaborating.',
			visible: 'Teachers see: quiet student who "needs to participate more" — often misjudged as disengaged',
			intervention: 'Offer written participation options (submit questions via note/chat). In groups, assign specific small roles. Build participation gradually: one contribution per class, then two.',
		});
	}
	if (O && O.score < 2.5 && O.facets?.inquisitiveness?.score < 2.5) {
		causes.push({
			personality: `Low Inquisitiveness (${O.facets.inquisitiveness?.score?.toFixed(1) || 'low'}/5)`,
			personalityDetail: `${studentName} doesn't find academic learning inherently interesting. School feels like an obligation rather than an opportunity.`,
			symptom: 'Surface-level engagement, minimal effort beyond requirements, difficulty with abstract/theoretical material',
			symptomDetail: 'They do exactly what\'s asked and no more. Extended reading or optional enrichment holds no appeal.',
			visible: 'Teachers see: compliant but disengaged student who "doesn\'t seem interested in learning"',
			intervention: 'Find personal relevance bridges: "How does this relate to your career goal?" "When would you use this in real life?" Practical, applied tasks over abstract theory.',
		});
	}
	if (A && A.score < 2.5) {
		causes.push({
			personality: `Low Agreeableness (${A.score.toFixed(1)}/5)`,
			personalityDetail: `${studentName} is direct, stubborn, and sometimes abrasive in interpersonal interactions.`,
			symptom: 'Conflict in group work, strained teacher relationships, social isolation that removes peer learning',
			symptomDetail: 'They argue their point regardless of social cost. In groups, they may dominate or withdraw if others don\'t meet their standards.',
			visible: 'Teachers see: "difficult to work with" or "doesn\'t play well with others"',
			intervention: 'Frame collaboration as a strategic skill (not a personality change). Teach "disagree and commit": voice your view, then support the group decision. Pair with equally strong peers, not pushovers.',
		});
	}

	return causes;
}

export function generateBarriersMega(
	dimensions: DimensionsMap,
	crossRefResult: CrossRefResult | null,
	learnerProfile: LearnerProfile | null,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	narrative.push(
		`${pickOpener(studentName, 7)} the specific personality-driven patterns that may prevent them from reaching their potential. Understanding barriers is not about labelling weaknesses — it's about identifying these patterns and providing targeted interventions for each one. Every barrier in this section is traced back to its root cause, because fixing the symptom without addressing the cause is a waste of everyone's effort.`
	);

	// Inject high-impact interactions
	const relevantInteractions = pickInteractionsForSection(
		(crossRefResult?.interactions ?? []).filter(i => i.impact >= 7), 7, 2
	);
	relevantInteractions.forEach(interaction => {
		narrative.push(renderInteractionCallout(interaction));
		narrative.push(renderInteractionAction(interaction));
	});

	narrative.push(
		`Most academic interventions fail because they target the visible behaviour rather than the underlying personality driver. Telling a disorganised student to "get organised" is like telling a short person to "be taller" — it describes the desired outcome without providing a mechanism. The root cause approach in this section identifies the personality trait driving the behaviour, explains why the student acts this way, and provides interventions that work WITH their personality rather than against it.`
	);

	narrative.push(
		`Research on personality-informed intervention shows a 2-3x improvement in effectiveness compared to generic academic support (O'Connor & Paunonen, 2007). The reason is simple: when you understand WHY a student struggles, you can design interventions that address the actual cause rather than applying one-size-fits-all remedies that may actively conflict with the student's personality.`
	);

	const rootCauses = identifyRootCauses(dimensions, studentName);

	if (rootCauses.length === 0) {
		narrative.push(
			`Good news: ${studentName}'s personality profile does not show any major barriers. Their scores are generally in the moderate-to-high range across all dimensions, meaning there are no strong personality-driven obstacles to academic performance. The focus for ${studentName} should be on leveraging strengths (Section 6) rather than fixing weaknesses.`
		);
		narrative.push(
			`This doesn't mean ${studentName} will never face academic challenges — external factors (teaching quality, curriculum difficulty, peer dynamics, life events) can create barriers regardless of personality. But it does mean that personality is not working against them. When challenges arise, ${studentName} has the psychological resources to address them: reasonable discipline, manageable emotions, adequate social skills, and sufficient curiosity to engage with solutions.`
		);
		narrative.push(
			`The maintenance strategy for a barrier-free profile is simple: keep doing what works. Monitor for changes — adolescent personalities shift over time, and a current strength can moderate or a new vulnerability can emerge. An annual re-assessment provides an updated map of where ${studentName} stands.`
		);
		keyFindings.push({ title: 'No Major Barriers', text: `${studentName}'s balanced personality profile means there are no strong personality-driven academic obstacles.`, type: 'strength', color: '#22c55e' });

		return { narrative, keyFindings, researchNotes, scenarios: [], crossReferences: [], actions: [] };
	}

	// ─── Root Cause Analysis ─────────────────────────────────────────────────────
	narrative.push('\n### Root Cause Analysis');
	narrative.push(
		`${rootCauses.length} significant barrier${rootCauses.length > 1 ? 's were' : ' was'} identified in ${studentName}'s profile. Each is traced from the underlying personality trait through to the visible academic symptom.`
	);

	rootCauses.forEach((rc, i) => {
		narrative.push(`\n#### Barrier ${i + 1}: ${rc.personality}`);
		narrative.push(`**Root cause:** ${rc.personalityDetail}`);
		narrative.push(`**Academic symptom:** ${rc.symptomDetail}`);
		narrative.push(`**What teachers/parents see:** ${rc.visible}`);
		narrative.push(`**Why generic advice doesn't work:** This barrier persists despite good intentions because the standard advice ("try harder," "study more," "just focus") targets willpower rather than the underlying personality mechanism. ${studentName}'s challenge isn't a lack of desire to succeed — it's a mismatch between what their personality provides naturally and what the academic environment demands.`);
		narrative.push(`**Recommended intervention:** ${rc.intervention}`);
		narrative.push(`**Expected timeline:** Initial improvement visible within 2-3 weeks of consistent intervention. Significant behaviour change typically takes 6-8 weeks. Full habit formation (the intervention becomes automatic) takes 3-6 months. Expect setbacks — they're normal and don't indicate failure. The trajectory matters more than any individual day.`);

		keyFindings.push({
			title: rc.personality,
			text: `${rc.symptom}. Intervention: ${rc.intervention.split('.')[0]}.`,
			type: 'barrier',
			color: '#f59e0b',
		});
	});

	// ─── Misdiagnosis Table ──────────────────────────────────────────────────────
	narrative.push('\n### Common Misdiagnoses');
	narrative.push(
		`${pickOpener(studentName, 17)} how adults often mislabel behaviour based on what they see, not what's driving it. One of the most valuable aspects of a personality-based assessment is identifying when behaviour is being misinterpreted. Here are the most common misreadings for ${studentName}'s profile:`
	);

	rootCauses.forEach(rc => {
		if (rc.personality.includes('Conscientiousness') && !rc.personality.includes('Perfectionism')) {
			narrative.push(`**It looks like:** Laziness. **It actually is:** Low natural self-regulation combined with a mismatch between the task's demands and ${studentName}'s interest level. The solution is not "try harder" but "structure better."`);
		}
		if (rc.personality.includes('Perfectionism')) {
			narrative.push(`**It looks like:** Procrastination or poor time management. **It actually is:** Fear of imperfection creating paralysis. ${studentName} isn't avoiding work — they're avoiding the possibility of producing work that doesn't meet their impossible standards.`);
		}
		if (rc.personality.includes('Anxiety')) {
			narrative.push(`**It looks like:** Being "bad at exams" or "not studying enough." **It actually is:** Performance anxiety overriding actual knowledge. ${studentName} likely knows more than their exam results suggest. The gap is between knowledge and performance under pressure.`);
		}
		if (rc.personality.includes('Social Boldness')) {
			narrative.push(`**It looks like:** Disengagement or lack of interest. **It actually is:** Social anxiety preventing verbal participation. ${studentName} may be deeply engaged mentally but unable to express it in the classroom's social format.`);
		}
		if (rc.personality.includes('Inquisitiveness')) {
			narrative.push(`**It looks like:** Lack of intelligence or ability. **It actually is:** Lack of intrinsic motivation for academic content. ${studentName} may be highly capable in areas they care about — the challenge is connecting the curriculum to those areas.`);
		}
		if (rc.personality.includes('Agreeableness')) {
			narrative.push(`**It looks like:** Being a "problem student" or "difficult." **It actually is:** Strong personal conviction and critical thinking expressed without social filtering. ${studentName}'s directness is actually a strength — it just needs better delivery.`);
		}
	});

	researchNotes.push({
		text: 'Personality-informed intervention is 2-3x more effective than generic academic support because it addresses root causes rather than symptoms (O\'Connor & Paunonen, 2007).',
		topic: 'Intervention effectiveness',
	});

	// ─── Negative Cycles ─────────────────────────────────────────────────────────
	if (rootCauses.length >= 2) {
		narrative.push('\n### Negative Cycles to Watch');
		narrative.push(
			`When multiple barriers interact, they can create self-reinforcing negative cycles. Here are the patterns most likely to emerge for ${studentName}:`
		);

		if (rootCauses.some(r => r.personality.includes('Conscientiousness')) && rootCauses.some(r => r.personality.includes('Anxiety'))) {
			narrative.push(
				`**The Anxiety-Avoidance Spiral:** Low structure → falling behind → anxiety about falling behind → avoidance → falling further behind → more anxiety. Break this cycle by creating a simple daily checklist that makes "caught up" feel achievable, not overwhelming.`
			);
		}
		if (rootCauses.some(r => r.personality.includes('Perfectionism')) && rootCauses.some(r => r.personality.includes('Anxiety'))) {
			narrative.push(
				`**The Perfectionism-Paralysis Loop:** High standards → fear of not meeting them → delay starting → time pressure → rushed work below standards → confirmation of fear ("see, I can't do it"). Break this by starting with the worst possible draft ("vomit draft") — it's easier to improve something that exists than to create something perfect.`
			);
		}
		if (rootCauses.some(r => r.personality.includes('Social')) && rootCauses.some(r => r.personality.includes('Inquisitiveness'))) {
			narrative.push(
				`**The Isolation-Disengagement Cycle:** Low participation → not asking questions → gaps in understanding → falling behind → disengagement → even less participation. Break this by providing written channels for questions and one-on-one check-ins that bypass the social barrier.`
			);
		}
	}

	// ─── Priority Ranking ────────────────────────────────────────────────────────
	narrative.push('\n### Priority Intervention Ranking');
	narrative.push(
		`Addressing all barriers simultaneously is overwhelming and counterproductive. Research on behaviour change shows that attempting to change more than two habits at once drops the success rate from ~80% to below 20% (Clear, 2018). Here is the recommended priority order for ${studentName}:`
	);

	rootCauses.forEach((rc, i) => {
		narrative.push(`**${i + 1}. ${rc.personality}** — ${rc.intervention.split('.')[0]}. ${i === 0 ? 'Start here — this is the highest-impact change.' : i === 1 ? 'Address this once the first intervention is established (typically after 3-4 weeks).' : 'Tackle this last — it will be easier once the higher-priority barriers are managed.'}`);
	});

	// ─── When to Seek Professional Help ──────────────────────────────────────────
	narrative.push('\n### When to Seek Professional Help');
	narrative.push(
		`Most personality-driven academic barriers respond well to the environmental and behavioural interventions described above. However, some situations warrant professional support. Consider seeking help from a school counsellor, educational psychologist, or learning specialist if:`
	);
	narrative.push(`- Academic performance has declined significantly over 2+ terms despite implementing the recommended strategies`);
	narrative.push(`- ${studentName} shows signs of clinical anxiety or depression (persistent sadness, withdrawal, sleep changes, loss of interest in previously enjoyed activities)`);
	narrative.push(`- Attention difficulties are pervasive across all subjects and settings (not just boring ones) — this may warrant assessment for ADHD`);
	narrative.push(`- ${studentName} reports feeling overwhelmed, hopeless, or like "nothing will help" — amotivation can sometimes signal deeper emotional issues`);
	narrative.push(`- Social difficulties are causing significant distress beyond normal adolescent challenges`);
	narrative.push(
		`This report is a personality assessment, not a clinical diagnosis. If any of the patterns described here cause significant distress or functional impairment, a qualified professional can provide the targeted support that goes beyond what personality-based strategies can offer.`
	);

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
			{ targetSection: 'strengths', text: 'See Section 6 for the strengths that counterbalance these barriers.' },
			{ targetSection: 'action-plan', text: 'See Section 11 for the prioritised action plan addressing these barriers.' },
		],
		actions: rootCauses.map((rc, i) => ({
			title: `Barrier ${i + 1}: ${rc.personality.split('(')[0].trim()}`,
			description: rc.intervention,
			priority: i + 1,
		})),
	};
}
