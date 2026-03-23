/**
 * Section C5: What's Holding You Back
 * Root cause chains, anxiety cycles, misdiagnoses, priority ranking.
 */
import { DIM_NAMES } from './helpers';

const CYCLE_TEMPLATES = {
	'rc-01': 'Anxiety about doing it wrong → avoids starting → deadline gets closer → more anxiety → panic cramming → poor result → confirms fear → more anxiety next time.',
	'rc-06': 'Constant worrying drains mental energy → exhaustion makes focus impossible → more time needed → more stress → deeper exhaustion → can\'t sustain study sessions.',
	'rc-11': 'Anxiety says "something will go wrong" + low self-belief says "you can\'t handle it" → avoids challenges → no evidence of success → self-belief stays low → anxiety spikes before exams.',
	'rc-04': '"I can\'t start until it\'s perfect" → avoidance until deadline pressure → rushed or no submission → poor result → confirms "I should have done it properly" → even higher standards next time.',
	'rc-02': 'Needs reassurance → can\'t start alone → waits for help → help is delayed → anxiety rises → eventually forced to start late → poor result → needs more reassurance next time.',
	'rc-09': 'No system to track tasks → tasks accumulate unseen → suddenly multiple deadlines hit → panic → incomplete work → "I forgot" pattern repeats → confidence in managing workload drops.',
	'rc-12': 'Prefer solitude → study alone → isolation deepens fatigue → less energy → more withdrawal → complete disengagement from learning community.'
};

export function generateBarriers(results, crossRefResult) {
	const rootCauses = [...(crossRefResult.byType.root_cause || [])].sort(
		(a, b) => b.impact - a.impact
	);

	const rootCauseChains = rootCauses.map((insight) => ({
		id: insight.id,
		personalityRoot: insight.personality.facet
			? `${insight.personality.facet} (${DIM_NAMES[insight.personality.dim]})`
			: DIM_NAMES[insight.personality.dim],
		personalityScore: insight.personality.score,
		academicSymptom: insight.academic.metric,
		academicScore: insight.academic.score,
		visibleBehaviour: insight.visibleBehaviour || 'Observable impact on academic performance',
		insight: insight.insight,
		action: insight.action,
		impact: insight.impact
	}));

	const cycles = rootCauses
		.slice(0, 3)
		.filter((i) => CYCLE_TEMPLATES[i.id])
		.map((i) => ({
			title: `The ${i.personality.facet ?? i.personality.dim} Cycle`,
			narrative: CYCLE_TEMPLATES[i.id]
		}));

	const misdiagnoses = rootCauses
		.filter((i) => i.misdiagnosis)
		.map((i) => ({
			looksLike: i.misdiagnosis.split(', actually')[0].replace(/^Looks like /, ''),
			actuallyIs: i.misdiagnosis.split(', actually')[1] || i.insight.split('.')[0]
		}));

	const priorityRanking = rootCauses.map((i, idx) => ({
		rank: idx + 1,
		barrier: i.insight,
		impact: i.impact
	}));

	const fallbackMessage =
		rootCauses.length < 2
			? 'No major barriers detected — focus on optimising what you already do well.'
			: null;

	return {
		rootCauseChains,
		cycles,
		misdiagnoses,
		priorityRanking,
		fallbackMessage
	};
}
