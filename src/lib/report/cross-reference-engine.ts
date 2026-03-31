/**
 * Cross-Reference Engine
 * Matches HEXACO personality data against academic study/learner profiles
 * to produce typed insights: root_cause, confirmation, contradiction, untapped.
 *
 * Export: runCrossReferenceEngine(dimensions, studyProfile, learnerProfile)
 */

import { classifyFacetDirection } from './helpers';
import { ALL_RULES, UNTAPPED_MAPPING, CONFIRMATION_RULES, CrossRefRule, UntappedEntry } from './cross-reference-rules';
import type { InteractionInsight } from './interaction-rules';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsightPersonality {
	facet: string | null;
	dim: string;
	score: number;
	direction: string;
}

export interface InsightAcademic {
	metric: string;
	source: string;
	path: string;
	score: number;
}

export interface Insight {
	id: string;
	personality: InsightPersonality;
	academic: InsightAcademic;
	type: string;
	insight: string;
	action: string;
	audience: string;
	impact: number;
	dualFire: boolean;
	dualFireNote: string | null;
	visibleBehaviour?: string;
	misdiagnosis?: string;
}

export interface CrossRefResult {
	insights: Insight[];
	byType: {
		root_cause: Insight[];
		confirmation: Insight[];
		contradiction: Insight[];
		untapped: Insight[];
	};
	interactions: InteractionInsight[];
}

// ─── Dot-path resolver ────────────────────────────────────────────────────────

/**
 * Resolve a dot-path value from studyProfile or learnerProfile.
 * Handles nested objects (e.g. 'focus.procrastination.score') and
 * bare numbers at the leaf (e.g. 'teacherPreference.warmth').
 */
function resolveAcademicValue(
	studyProfile: Record<string, unknown>,
	learnerProfile: Record<string, unknown>,
	source: string,
	path: string
): number | undefined {
	const root: Record<string, unknown> = source === 'studyProfile' ? studyProfile : learnerProfile;
	const parts = path.split('.');
	let cur: unknown = root;
	for (const part of parts) {
		if (cur === null || cur === undefined) return undefined;
		cur = (cur as Record<string, unknown>)[part];
	}
	// Leaf may be a plain number (e.g. warmth: 4) or an object with .score
	if (typeof cur === 'number') return cur;
	if (cur !== null && typeof cur === 'object' && 'score' in (cur as object)) {
		return (cur as { score: number }).score;
	}
	return undefined;
}

// ─── Condition evaluator ──────────────────────────────────────────────────────

function evaluateCondition(value: number | undefined, op: string, threshold: number): boolean {
	if (value === undefined || value === null) return false;
	if (op === '>=') return value >= threshold;
	if (op === '<') return value < threshold;
	if (op === '=') return value === threshold;
	return false;
}

// ─── Rule matcher ─────────────────────────────────────────────────────────────

/**
 * Attempt to match a rule against the provided profile data.
 * Returns an Insight object on match, null on miss.
 */
function matchRule(
	rule: CrossRefRule,
	dimensions: Record<string, { score: number; facets?: Record<string, { score: number }> }>,
	studyProfile: Record<string, unknown>,
	learnerProfile: Record<string, unknown>
): Insight | null {
	const pc = rule.personalityCondition;
	const ac = rule.academicCondition;

	// Resolve personality value
	let personalityScore: number | undefined;
	let facetKey: string | null = null;

	if (pc.facet) {
		// Facet-level condition
		facetKey = pc.facet;
		personalityScore = dimensions[pc.dim]?.facets?.[pc.facet]?.score;
	} else {
		// Dimension-level condition
		personalityScore = dimensions[pc.dim]?.score;
	}

	if (!evaluateCondition(personalityScore, pc.op, pc.threshold)) return null;

	// Resolve academic value
	const academicScore = resolveAcademicValue(studyProfile, learnerProfile, ac.source, ac.path);
	if (!evaluateCondition(academicScore, ac.op, ac.threshold)) return null;

	// Derive direction
	let direction: string;
	if (facetKey) {
		direction = classifyFacetDirection(facetKey, personalityScore as number);
	} else {
		// Dimension-level: use simple high/moderate/low mapping
		if ((personalityScore as number) >= 3.5) direction = 'strength';
		else if ((personalityScore as number) < 2.5) direction = 'weakness';
		else direction = 'neutral';
	}

	// Extract the last segment of the path as a human-readable metric name
	const pathParts = ac.path.split('.');
	const metric =
		pathParts[pathParts.length - 1] === 'score'
			? pathParts[pathParts.length - 2]
			: pathParts[pathParts.length - 1];

	const insight: Insight = {
		id: rule.id,
		personality: {
			facet: facetKey,
			dim: pc.dim,
			score: personalityScore as number,
			direction
		},
		academic: {
			metric,
			source: ac.source,
			path: ac.path,
			score: academicScore as number
		},
		type: rule.type,
		insight: rule.insight,
		action: rule.action,
		audience: rule.audience,
		impact: 0,      // computed later
		dualFire: false,
		dualFireNote: null
	};

	// Include root_cause-only fields
	if (rule.type === 'root_cause') {
		insight.visibleBehaviour = rule.visibleBehaviour;
		insight.misdiagnosis = rule.misdiagnosis;
	}

	return insight;
}

// ─── Untapped insights ────────────────────────────────────────────────────────

/**
 * Generates untapped insights for entries where:
 * 1. The personality condition fires
 * 2. The academic value is below 3.0 (underperformance)
 * 3. There is no existing confirmation rule for the same personality facet/dim
 */
function generateUntappedInsights(
	dimensions: Record<string, { score: number; facets?: Record<string, { score: number }> }>,
	studyProfile: Record<string, unknown>,
	learnerProfile: Record<string, unknown>,
	firedRules: Insight[]
): Insight[] {
	// Build a set of personality facets/dims already covered by confirmation insights
	const confirmedPersonalityKeys = new Set(
		firedRules
			.filter((i) => i.type === 'confirmation')
			.map((i) => i.personality.facet ?? `dim:${i.personality.dim}`)
	);

	// Also check which confirmation rules COULD fire for the same personality facet/dim
	// (skip untapped if there's a confirmation rule covering that personality signal)
	const confirmationFacetKeys = new Set(
		CONFIRMATION_RULES.map((r: CrossRefRule) =>
			r.personalityCondition.facet
				? r.personalityCondition.facet
				: `dim:${r.personalityCondition.dim}`
		)
	);

	// Suppress unused variable warning — confirmationFacetKeys is kept for symmetry with JS source
	void confirmationFacetKeys;

	const untapped: Insight[] = [];

	for (const entry of UNTAPPED_MAPPING as UntappedEntry[]) {
		const pc = entry.personalityCondition;
		const ac = entry.academicCondition;

		// Personality condition must fire
		let personalityScore: number | undefined;
		let facetKey: string | null = null;
		if (pc.facet) {
			facetKey = pc.facet;
			personalityScore = dimensions[pc.dim]?.facets?.[pc.facet]?.score;
		} else {
			personalityScore = dimensions[pc.dim]?.score;
		}
		if (!evaluateCondition(personalityScore, pc.op, pc.threshold)) continue;

		// Academic condition: value must be < 3.0
		const academicScore = resolveAcademicValue(studyProfile, learnerProfile, ac.source, ac.path);
		if (academicScore === undefined || academicScore >= 3.0) continue;

		// Skip if a confirmation insight already fired for this personality signal
		const personalityKey = facetKey ?? `dim:${pc.dim}`;
		if (confirmedPersonalityKeys.has(personalityKey)) continue;

		const pathParts = ac.path.split('.');
		const metric =
			pathParts[pathParts.length - 1] === 'score'
				? pathParts[pathParts.length - 2]
				: pathParts[pathParts.length - 1];

		let direction: string;
		if (facetKey) {
			direction = classifyFacetDirection(facetKey, personalityScore as number);
		} else {
			if ((personalityScore as number) >= 3.5) direction = 'strength';
			else if ((personalityScore as number) < 2.5) direction = 'weakness';
			else direction = 'neutral';
		}

		untapped.push({
			id: `untapped-${facetKey ?? pc.dim}`,
			personality: { facet: facetKey, dim: pc.dim, score: personalityScore as number, direction },
			academic: { metric, source: ac.source, path: ac.path, score: academicScore },
			type: 'untapped',
			insight: entry.untappedInsight,
			action: entry.untappedAction,
			audience: 'all',
			impact: 0,
			dualFire: false,
			dualFireNote: null
		});
	}

	return untapped;
}

// ─── Impact scoring ───────────────────────────────────────────────────────────

/**
 * For each insight, count other insights that share:
 * - the same personality facet/dim (personality overlap)
 * - the same academic path (academic overlap)
 * Sum of those two counts = impact score.
 */
function computeImpactScores(insights: Insight[]): Insight[] {
	for (const insight of insights) {
		const personalityKey = insight.personality.facet ?? `dim:${insight.personality.dim}`;
		const academicPath = insight.academic.path;

		let personalityOverlap = 0;
		let academicOverlap = 0;

		for (const other of insights) {
			if (other.id === insight.id) continue;
			const otherPersonalityKey = other.personality.facet ?? `dim:${other.personality.dim}`;
			if (otherPersonalityKey === personalityKey) personalityOverlap++;
			if (other.academic.path === academicPath) academicOverlap++;
		}

		insight.impact = personalityOverlap + academicOverlap;
	}
	return insights;
}

// ─── Dual-fire annotation ─────────────────────────────────────────────────────

/**
 * Find personality facets/dims that appear in BOTH root_cause AND confirmation types.
 * Matching logic:
 *  - Two insights match if they share the same facet key, OR
 *  - One is dimension-level (no facet) and the other is a facet-level insight
 *    belonging to the same dimension (facet-level and dim-level on the same dim overlap).
 *
 * Mark matched insights with dualFire: true and dualFireNote.
 */
function annotateDualFires(insights: Insight[]): Insight[] {
	const rcInsights = insights.filter((i) => i.type === 'root_cause');
	const cfInsights = insights.filter((i) => i.type === 'confirmation');

	/**
	 * Two personality descriptors "overlap" if:
	 * - They have the same non-null facet, OR
	 * - One has a facet, the other does not, but they share the same dim.
	 */
	function personalitiesOverlap(a: Insight, b: Insight): boolean {
		if (a.personality.facet && b.personality.facet) {
			return a.personality.facet === b.personality.facet;
		}
		// At least one is dimension-level — overlap if same dim
		return a.personality.dim === b.personality.dim;
	}

	const dualFireGroups: { rc: Insight; cf: Insight }[] = [];

	for (const rc of rcInsights) {
		for (const cf of cfInsights) {
			if (personalitiesOverlap(rc, cf)) {
				dualFireGroups.push({ rc, cf });
			}
		}
	}

	for (const { rc, cf } of dualFireGroups) {
		const traitLabel = rc.personality.facet ?? `dimension ${rc.personality.dim}`;
		const note = `This trait (${traitLabel}) appears in both root cause and confirmation insights — it is both a strength and a risk depending on context.`;
		for (const i of [rc, cf]) {
			i.dualFire = true;
			i.dualFireNote = note;
		}
	}

	return insights;
}

// ─── Main engine ──────────────────────────────────────────────────────────────

/**
 * Run the full cross-reference engine.
 *
 * @param dimensions - HEXACO dimensions from profile results
 * @param studyProfile - Study profile section
 * @param learnerProfile - Learner profile section
 * @returns {{ insights: Insight[], byType: { root_cause, confirmation, contradiction, untapped } }}
 */
export function runCrossReferenceEngine(
	dimensions: Record<string, { score: number; facets?: Record<string, { score: number }> }>,
	studyProfile: Record<string, unknown>,
	learnerProfile: Record<string, unknown>
): CrossRefResult {
	// 1. Match all standard rules
	const matchedInsights: Insight[] = [];
	for (const rule of ALL_RULES) {
		const insight = matchRule(rule, dimensions, studyProfile, learnerProfile);
		if (insight) matchedInsights.push(insight);
	}

	// 2. Generate untapped insights (after standard rules so we know what confirmed)
	const untappedInsights = generateUntappedInsights(
		dimensions,
		studyProfile,
		learnerProfile,
		matchedInsights
	);

	const allInsights = [...matchedInsights, ...untappedInsights];

	// 3. Compute impact scores
	computeImpactScores(allInsights);

	// 4. Annotate dual fires
	annotateDualFires(allInsights);

	// 5. Group by type
	const byType = {
		root_cause: allInsights.filter((i) => i.type === 'root_cause'),
		confirmation: allInsights.filter((i) => i.type === 'confirmation'),
		contradiction: allInsights.filter((i) => i.type === 'contradiction'),
		untapped: allInsights.filter((i) => i.type === 'untapped')
	};

	return { insights: allInsights, byType, interactions: [] };
}
