/**
 * Section C1: Executive Summary
 * Cross-system synthesis: archetype, top strength, top barrier, top action.
 */
import { getLearningArchetype, DIM_NAMES } from './helpers.js';

export function generateExecutiveSummary(results, crossRefResult) {
	const archetype = getLearningArchetype(results.dimensions, results.studyProfile);
	const name = results.narrative?.name || 'This student';

	const confirmations = [...(crossRefResult.byType.confirmation || [])].sort(
		(a, b) => b.impact - a.impact
	);
	const rootCauses = [...(crossRefResult.byType.root_cause || [])].sort(
		(a, b) => b.impact - a.impact
	);

	const topStrengthInsight = confirmations[0] || null;
	const topBarrierInsight = rootCauses[0] || null;

	const topStrength = topStrengthInsight
		? {
				insight: topStrengthInsight.insight,
				personality: topStrengthInsight.personality.facet
					? `${topStrengthInsight.personality.facet} (${DIM_NAMES[topStrengthInsight.personality.dim]})`
					: DIM_NAMES[topStrengthInsight.personality.dim],
				academic: topStrengthInsight.academic.metric
			}
		: null;

	const topBarrier = topBarrierInsight
		? {
				insight: topBarrierInsight.insight,
				personality: topBarrierInsight.personality.facet
					? `${topBarrierInsight.personality.facet} (${DIM_NAMES[topBarrierInsight.personality.dim]})`
					: DIM_NAMES[topBarrierInsight.personality.dim],
				academic: topBarrierInsight.academic.metric,
				action: topBarrierInsight.action
			}
		: null;

	const topAction = topBarrier?.action || null;

	const strengthText = topStrength?.insight || 'a well-balanced profile';
	const barrierText = topBarrier?.insight || 'no major barriers detected';
	const actionText = topAction || 'continue building on existing strengths';

	const topTraitDim = topStrengthInsight?.personality?.dim
		? DIM_NAMES[topStrengthInsight.personality.dim]
		: null;
	const traitDesc = topTraitDim
		? `shows strong ${topTraitDim.toLowerCase()} traits`
		: 'brings a balanced personality to learning';

	const narrative = `${name} is a ${archetype} who ${traitDesc}. Their strongest cross-system pattern is: ${strengthText}. The biggest area to address is: ${barrierText}. The most impactful change they can make: ${actionText}.`;

	return {
		archetype,
		narrative,
		topStrength,
		topBarrier,
		topAction
	};
}
