// @ts-nocheck
/**
 * Mega Section 1: Cover + Executive Summary
 * Generates ~3 pages: expanded narrative summary + key metrics + headline findings.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, classifyLevel, scorePercentile, interpretiveLabel, toDimensionsMap, type DimKey, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding } from '../mega-sections';

const DIM_ACADEMIC_IMPACT: Record<DimKey, { high: string; low: string }> = {
	H: {
		high: 'strong academic integrity and trustworthiness in collaborative work',
		low: 'competitive drive that can fuel achievement when channelled constructively',
	},
	E: {
		high: 'deep empathy and emotional awareness that enriches humanities and social learning, though may intensify exam anxiety',
		low: 'remarkable calm under pressure that provides an advantage in high-stakes assessments',
	},
	X: {
		high: 'natural classroom participation and social learning energy',
		low: 'deep focus capability and thoughtful processing that strengthens independent study',
	},
	A: {
		high: 'positive group dynamics and strong peer relationships that support collaborative learning',
		low: 'critical thinking and willingness to challenge weak ideas, valuable for analytical subjects',
	},
	C: {
		high: 'consistent study habits, strong organisation, and reliable homework completion — the single strongest personality predictor of academic success',
		low: 'need for external structure and accountability to unlock their full potential',
	},
	O: {
		high: 'intellectual curiosity and creative thinking that excels in open-ended and analytical tasks',
		low: 'practical, methodical approach that delivers reliable results in structured subjects',
	},
};

export function generateExecutiveSummaryMega(
	dimensions: DimensionsMap,
	studentName: string,
	archetype: string,
	crossRefResult: any | null,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];

	// Find highest and lowest dimensions
	const dimScores = DIM_ORDER.map(k => ({ key: k, score: dimensions[k]?.score || 3.0 }));
	dimScores.sort((a, b) => b.score - a.score);
	const highest = dimScores[0];
	const lowest = dimScores[dimScores.length - 1];
	const highLevel = classifyLevel(highest.score);
	const lowLevel = classifyLevel(lowest.score);

	// Para 1: Who is this student?
	narrative.push(
		`${studentName} is ${archetype} — a personality profile characterised by ${DIM_NAMES[highest.key].toLowerCase()} as their strongest dimension and ${DIM_NAMES[lowest.key].toLowerCase()} as an area for development. Based on their responses to 120 self-report questions, this report provides a comprehensive analysis of how ${studentName}'s personality shapes their academic experience, learning style, study habits, and social dynamics.`
	);

	// Para 2: Academic personality signature
	const topTwoImpacts = dimScores.slice(0, 2).map(d => {
		const impact = DIM_ACADEMIC_IMPACT[d.key];
		return classifyLevel(d.score) === 'high' ? impact.high : classifyLevel(d.score) === 'low' ? impact.low : impact.high.split(',')[0];
	});
	narrative.push(
		`${studentName}'s academic personality signature combines ${topTwoImpacts[0]} with ${topTwoImpacts[1]}. This combination means ${studentName} brings a distinctive set of strengths to learning — strengths that can be leveraged strategically across different subjects and contexts.`
	);

	// Para 3: Cross-reference synthesis (if available)
	if (crossRefResult) {
		const confirmations = crossRefResult.byType?.confirmation || [];
		const rootCauses = crossRefResult.byType?.root_cause || [];
		const topConfirm = confirmations.sort((a, b) => b.impact - a.impact)[0];
		const topCause = rootCauses.sort((a, b) => b.impact - a.impact)[0];

		if (topConfirm || topCause) {
			const parts: string[] = [];
			if (topConfirm) {
				parts.push(`Their strongest cross-system pattern is: ${topConfirm.insight}`);
				keyFindings.push({ title: 'Top Strength', text: topConfirm.insight, type: 'strength', color: '#22c55e' });
			}
			if (topCause) {
				parts.push(`The most important barrier to address is: ${topCause.insight}`);
				keyFindings.push({ title: 'Top Barrier', text: topCause.insight, type: 'barrier', color: '#f59e0b' });
				if (topCause.action) {
					keyFindings.push({ title: 'Priority Action', text: topCause.action, type: 'action', color: '#3b82f6' });
				}
			}
			narrative.push(
				`The cross-reference analysis — which maps personality traits to academic outcomes — reveals important patterns. ${parts.join('. ')}. These findings are explored in detail throughout this report, with specific strategies in the Action Plan (Section 11).`
			);
		}
	}

	// Para 4: What this report covers
	narrative.push(
		`This report is structured in 12 sections covering every aspect of ${studentName}'s academic profile. Section 2 provides a deep dive into all six personality dimensions with research backing. Sections 3-5 cover learning style, academic drive, and study strategies. Section 6 identifies strengths to leverage, while Section 7 maps barriers and their root causes. Sections 8-9 cover social dynamics and subject fit. Section 10 provides tailored guidance for teachers, parents, and tutors. Section 11 is the action plan — specific steps to implement starting this week.`
	);

	// Score summary findings
	DIM_ORDER.forEach(key => {
		const dim = dimensions[key];
		if (!dim) return;
		const level = classifyLevel(dim.score);
		if (level === 'high' || level === 'low') {
			const impact = DIM_ACADEMIC_IMPACT[key];
			keyFindings.push({
				title: `${DIM_NAMES[key]}: ${interpretiveLabel(dim.score)}`,
				text: `${dim.score.toFixed(1)}/5 (${scorePercentile(dim.score)}th percentile) — ${level === 'high' ? impact.high : impact.low}.`,
				type: level === 'high' ? 'strength' : 'insight',
				color: DIM_COLORS[key],
			});
		}
	});

	return {
		narrative,
		keyFindings,
		researchNotes: [],
		scenarios: [],
		crossReferences: [
			{ targetSection: 'personality-deep-dive', text: 'See Section 2 for detailed analysis of each dimension.' },
			{ targetSection: 'action-plan', text: 'See Section 11 for specific next steps.' },
		],
		actions: [],
	};
}
