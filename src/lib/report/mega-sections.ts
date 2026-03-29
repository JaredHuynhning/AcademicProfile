// @ts-nocheck
/**
 * Mega-section types and consolidation for the 50-page report.
 * Consolidates 23 thin section generators → 12 mega-sections.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, DIM_SHORT, scorePercentile, interpretiveLabel, toDimensionsMap } from './helpers';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Finding {
	title: string;
	text: string;
	type: 'strength' | 'barrier' | 'insight' | 'warning' | 'action';
	color?: string;
}

export interface CrossRef {
	targetSection: string;
	text: string;
}

export interface Action {
	title: string;
	description: string;
	priority: number;
}

export interface ResearchNote {
	text: string;
	topic: string;
}

export interface MegaSectionContent {
	narrative: string[];
	keyFindings: Finding[];
	researchNotes: ResearchNote[];
	scenarios: string[];
	crossReferences: CrossRef[];
	actions: Action[];
}

export interface MegaSection {
	id: string;
	title: string;
	subtitle?: string;
	icon?: string;
	content: MegaSectionContent;
	subsections?: { title: string; content: MegaSectionContent }[];
	rawData?: Record<string, unknown>;
}

export interface MegaReport {
	studentName: string;
	date: string;
	archetype: string;
	sections: MegaSection[];
	radarData: { dim: string; score: number; color: string }[];
	scoreSummary: { dim: string; score: number; percentile: number; level: string; label: string; color: string }[];
	raw: Record<string, unknown>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractNarratives(data: unknown): string[] {
	if (!data || typeof data !== 'object') return [];
	const obj = data as Record<string, unknown>;
	if (typeof obj.narrative === 'string' && obj.narrative.length > 0) {
		return obj.narrative.split(/\n\n/).filter(Boolean).map(p => p.trim());
	}
	return [];
}

function emptyContent(): MegaSectionContent {
	return { narrative: [], keyFindings: [], researchNotes: [], scenarios: [], crossReferences: [], actions: [] };
}

function pickNarratives(...sources: unknown[]): string[] {
	for (const src of sources) {
		const n = extractNarratives(src);
		if (n.length > 0) return n;
	}
	return [];
}

// ─── Consolidation ───────────────────────────────────────────────────────────

export function consolidateToMegaReport(
	rawReport: Record<string, unknown>,
	results: any,
	studentName: string,
): MegaReport {
	const sections: MegaSection[] = [];

	const radarData: MegaReport['radarData'] = [];
	const scoreSummary: MegaReport['scoreSummary'] = [];
	const hasDims = Array.isArray(results.dimensions) && results.dimensions.length > 0;
	if (hasDims) {
		const dims = toDimensionsMap(results.dimensions);
		for (const key of DIM_ORDER) {
			const d = dims[key];
			if (!d) continue;
			radarData.push({ dim: DIM_SHORT[key], score: d.score, color: DIM_COLORS[key] });
			scoreSummary.push({
				dim: DIM_NAMES[key], score: d.score,
				percentile: scorePercentile(d.score), level: d.level,
				label: interpretiveLabel(d.score), color: DIM_COLORS[key],
			});
		}
	}

	const r = rawReport;
	const exec = r.executiveSummary as Record<string, unknown> | null;
	const cover = r.cover as Record<string, unknown> | null;

	// 1. Cover + Executive Summary
	sections.push({
		id: 'cover-summary', title: 'Executive Summary', icon: '📊',
		content: {
			...emptyContent(),
			narrative: exec?.narrative ? [exec.narrative as string] : [],
			keyFindings: [
				...(exec?.topStrength ? [{ title: 'Top Strength', text: (exec.topStrength as any)?.insight || '', type: 'strength' as const, color: '#22c55e' }] : []),
				...(exec?.topBarrier ? [{ title: 'Top Barrier', text: (exec.topBarrier as any)?.insight || '', type: 'barrier' as const, color: '#f59e0b' }] : []),
			],
			actions: exec?.topAction ? [{ title: 'Priority Action', description: exec.topAction as string, priority: 1 }] : [],
		},
		rawData: { executiveSummary: exec, cover, glance: r.glance },
	});

	// 2. Who You Are
	sections.push({
		id: 'personality-deep-dive', title: 'Who You Are', subtitle: 'Personality Deep Dive', icon: '🧠',
		content: { ...emptyContent(), narrative: pickNarratives(r.deepDive, r.whoYouAre) },
		rawData: { deepDive: r.deepDive, whoYouAre: r.whoYouAre },
	});

	// 3. How Your Mind Works
	sections.push({
		id: 'learning-profile', title: 'How Your Mind Works', subtitle: 'Learning Profile', icon: '💡',
		content: { ...emptyContent(), narrative: pickNarratives(r.learning, r.howYouLearn) },
		rawData: { learning: r.learning, howYouLearn: r.howYouLearn, studyProfile: r.studyProfile },
	});

	// 4. Academic Character & Drive
	sections.push({
		id: 'academic-character', title: 'Academic Character & Drive', icon: '🔥',
		content: { ...emptyContent(), narrative: pickNarratives(r.academicCharacter, r.drives) },
		rawData: { academicCharacter: r.academicCharacter, drives: r.drives },
	});

	// 5. Study Strategy Playbook
	sections.push({
		id: 'study-playbook', title: 'Study Strategy Playbook', icon: '📚',
		content: { ...emptyContent(), narrative: pickNarratives(r.study, r.whatWorks) },
		rawData: { study: r.study, whatWorks: r.whatWorks },
	});

	// 6. Strengths & Superpowers
	sections.push({
		id: 'strengths', title: 'Strengths & Superpowers', icon: '💪',
		content: { ...emptyContent(), narrative: pickNarratives(r.strengths, r.whatsWorking) },
		rawData: { strengths: r.strengths, whatsWorking: r.whatsWorking },
	});

	// 7. Barriers & Root Causes
	sections.push({
		id: 'barriers', title: 'Barriers & Root Causes', icon: '🚧',
		content: { ...emptyContent(), narrative: pickNarratives(r.barriers, r.rootCause) },
		rawData: { barriers: r.barriers, rootCause: r.rootCause },
	});

	// 8. Social & Group Dynamics
	sections.push({
		id: 'social-dynamics', title: 'Social & Group Dynamics', icon: '👥',
		content: { ...emptyContent(), narrative: extractNarratives(r.group) },
		rawData: { group: r.group },
	});

	// 9. Subject Fit & Career Signals
	sections.push({
		id: 'subject-fit', title: 'Subject Fit & Career Signals', icon: '🎯',
		content: { ...emptyContent(), narrative: extractNarratives(r.subjectFit) },
		rawData: { subjectFit: r.subjectFit },
	});

	// 10. Teacher & Parent Guide
	sections.push({
		id: 'guide', title: 'Teacher & Parent Guide', icon: '📋',
		content: { ...emptyContent(), narrative: pickNarratives(r.unifiedGuide, r.guide) },
		rawData: { guide: r.guide, unifiedGuide: r.unifiedGuide, tutor: r.tutor, academicGuide: r.academicGuide },
	});

	// 11. Action Plan
	sections.push({
		id: 'action-plan', title: 'What To Do Monday', subtitle: 'Action Plan', icon: '✅',
		content: { ...emptyContent(), narrative: extractNarratives(r.actionPlan) },
		rawData: { actionPlan: r.actionPlan },
	});

	// 12. Appendix
	const dateStr = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
	sections.push({
		id: 'appendix', title: 'Appendix', icon: '📎',
		content: {
			...emptyContent(),
			narrative: [
				`This report was generated on ${dateStr} based on ${studentName}'s responses to 120 self-report questions covering personality (HEXACO-PI-R) and academic learning patterns.`,
				'The HEXACO model measures six broad dimensions: Honesty-Humility, Emotionality, Extraversion, Agreeableness, Conscientiousness, and Openness to Experience. Each dimension contains four facets, measured on a 1-5 scale.',
			],
		},
		rawData: {},
	});

	const archetype = (exec?.archetype as string) || (cover as any)?.personalityArchetype || 'The Balanced Generalist';

	return {
		studentName, date: dateStr, archetype, sections, radarData, scoreSummary, raw: rawReport,
	};
}
