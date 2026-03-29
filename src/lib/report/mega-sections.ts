// @ts-nocheck
/**
 * Mega-section types and consolidation for the 50-page report.
 * Consolidates 23 thin section generators → 12 mega-sections.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, DIM_SHORT, scorePercentile, interpretiveLabel, toDimensionsMap } from './helpers';
import { generatePersonalityDeepDive } from './mega/section-02-personality';
import { generateExecutiveSummaryMega } from './mega/section-01-executive';
import { generateLearningProfileMega } from './mega/section-03-learning';
import { generateAcademicCharacterMega } from './mega/section-04-character';
import { generateStudyPlaybookMega } from './mega/section-05-study';
import { generateStrengthsMega } from './mega/section-06-strengths';
import { generateBarriersMega } from './mega/section-07-barriers';
import { generateSocialDynamicsMega } from './mega/section-08-social';
import { generateSubjectFitMega } from './mega/section-09-subject-fit';
import { generateGuideMega } from './mega/section-10-guide';
import { generateActionPlanMega } from './mega/section-11-action';

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
	const dims = hasDims ? toDimensionsMap(results.dimensions) : null;
	if (dims) {
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
	const archetype = (exec?.archetype as string) || (cover as any)?.personalityArchetype || 'The Balanced Generalist';
	const crossRefResult = r._crossRefResult || null;
	const execContent = dims
		? generateExecutiveSummaryMega(dims, studentName, archetype, crossRefResult)
		: {
			...emptyContent(),
			narrative: exec?.narrative ? [exec.narrative as string] : [],
			keyFindings: [
				...(exec?.topStrength ? [{ title: 'Top Strength', text: (exec.topStrength as any)?.insight || '', type: 'strength' as const, color: '#22c55e' }] : []),
				...(exec?.topBarrier ? [{ title: 'Top Barrier', text: (exec.topBarrier as any)?.insight || '', type: 'barrier' as const, color: '#f59e0b' }] : []),
			],
			actions: exec?.topAction ? [{ title: 'Priority Action', description: exec.topAction as string, priority: 1 }] : [],
		};
	sections.push({
		id: 'cover-summary', title: 'Executive Summary', icon: '📊',
		content: execContent,
		rawData: { executiveSummary: exec, cover, glance: r.glance },
	});

	// 2. Who You Are — use deep narrative generator if dimensions available
	const personalityContent = dims
		? generatePersonalityDeepDive(dims, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.deepDive, r.whoYouAre) };
	sections.push({
		id: 'personality-deep-dive', title: 'Who You Are', subtitle: 'Personality Deep Dive', icon: '🧠',
		content: personalityContent,
		rawData: { deepDive: r.deepDive, whoYouAre: r.whoYouAre },
	});

	// 3. How Your Mind Works
	const learningContent = dims
		? generateLearningProfileMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.learning, r.howYouLearn) };
	sections.push({
		id: 'learning-profile', title: 'How Your Mind Works', subtitle: 'Learning Profile', icon: '💡',
		content: learningContent,
		rawData: { learning: r.learning, howYouLearn: r.howYouLearn, studyProfile: r.studyProfile },
	});

	// 4. Academic Character & Drive
	const charContent = dims
		? generateAcademicCharacterMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.academicCharacter, r.drives) };
	sections.push({
		id: 'academic-character', title: 'Academic Character & Drive', icon: '🔥',
		content: charContent,
		rawData: { academicCharacter: r.academicCharacter, drives: r.drives },
	});

	// 5. Study Strategy Playbook
	const studyContent = dims
		? generateStudyPlaybookMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.study, r.whatWorks) };
	sections.push({
		id: 'study-playbook', title: 'Study Strategy Playbook', icon: '📚',
		content: studyContent,
		rawData: { study: r.study, whatWorks: r.whatWorks },
	});

	// 6. Strengths & Superpowers
	const strengthsContent = dims
		? generateStrengthsMega(dims, crossRefResult, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.strengths, r.whatsWorking) };
	sections.push({
		id: 'strengths', title: 'Strengths & Superpowers', icon: '💪',
		content: strengthsContent,
		rawData: { strengths: r.strengths, whatsWorking: r.whatsWorking },
	});

	// 7. Barriers & Root Causes
	const barriersContent = dims
		? generateBarriersMega(dims, crossRefResult, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.barriers, r.rootCause) };
	sections.push({
		id: 'barriers', title: 'Barriers & Root Causes', icon: '🚧',
		content: barriersContent,
		rawData: { barriers: r.barriers, rootCause: r.rootCause },
	});

	// 8. Social & Group Dynamics
	const socialContent = dims
		? generateSocialDynamicsMega(dims, studentName)
		: { ...emptyContent(), narrative: extractNarratives(r.group) };
	sections.push({
		id: 'social-dynamics', title: 'Social & Group Dynamics', icon: '👥',
		content: socialContent,
		rawData: { group: r.group },
	});

	// 9. Subject Fit & Career Signals
	const subjectContent = dims
		? generateSubjectFitMega(dims, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: extractNarratives(r.subjectFit) };
	sections.push({
		id: 'subject-fit', title: 'Subject Fit & Career Signals', icon: '🎯',
		content: subjectContent,
		rawData: { subjectFit: r.subjectFit },
	});

	// 10. Teacher & Parent Guide
	const guideContent = dims
		? generateGuideMega(dims, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.unifiedGuide, r.guide) };
	sections.push({
		id: 'guide', title: 'Teacher & Parent Guide', icon: '📋',
		content: guideContent,
		rawData: { guide: r.guide, unifiedGuide: r.unifiedGuide, tutor: r.tutor, academicGuide: r.academicGuide },
	});

	// 11. Action Plan
	const actionContent = dims
		? generateActionPlanMega(dims, studentName)
		: { ...emptyContent(), narrative: extractNarratives(r.actionPlan) };
	sections.push({
		id: 'action-plan', title: 'What To Do Monday', subtitle: 'Action Plan', icon: '✅',
		content: actionContent,
		rawData: { actionPlan: r.actionPlan },
	});

	// 12. Appendix
	const dateStr = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
	const scoreTable = scoreSummary.map(s => `${s.dim}: ${s.score.toFixed(1)}/5 (${s.percentile}th percentile, ${s.label})`).join('. ');
	sections.push({
		id: 'appendix', title: 'Appendix', icon: '📎',
		content: {
			...emptyContent(),
			narrative: [
				'\n### About This Report',
				`This report was generated on ${dateStr} based on ${studentName}'s responses to 120 self-report questions. The assessment covers two domains: personality (60 questions using the HEXACO-PI-R framework) and academic learning patterns (60 questions covering study approaches, motivation, self-regulation, grit, focus, subject fit, teacher preference, and exam barriers).`,
				'\n### The HEXACO Model',
				'The HEXACO model of personality is a research-validated framework developed by Ashton and Lee (2004, 2007) that measures six broad dimensions of personality. It extends the well-known Big Five model by adding the Honesty-Humility dimension, which captures sincerity, fairness, greed avoidance, and modesty. Each dimension contains four facets, measured on a 1-5 scale where 3.0 represents the population average.',
				'The HEXACO model has been validated across 12+ languages and cultures, with population norms established through large-scale studies. The percentile rankings in this report are based on these norms, meaning a score at the 75th percentile indicates the student scores higher than approximately 75% of the general population on that dimension.',
				'\n### Score Summary',
				scoreTable || 'Scores not available.',
				'\n### Methodology',
				'All personality scores are self-reported. Self-report measures are the gold standard for personality assessment because personality traits are internal states that the individual has the most direct access to. However, self-report can be influenced by social desirability (answering how you think you "should" rather than how you actually are) and self-knowledge (some teenagers are still developing self-awareness). For this reason, the report emphasises patterns and trends rather than treating any single score as definitive.',
				'The cross-reference engine in this report maps personality traits to academic outcomes using evidence-based rules derived from published research on personality and academic achievement. These are correlational patterns, not causal certainties — personality predicts tendencies, not guarantees.',
				'\n### Recommended Reading',
				'For parents who want to understand more about personality and academic achievement: "Quiet" by Susan Cain (introversion in education), "Grit" by Angela Duckworth (persistence and long-term goals), "Mindset" by Carol Dweck (growth vs fixed mindset), and "Why We Sleep" by Matthew Walker (the critical role of sleep in learning).',
			],
		},
		rawData: {},
	});

	return {
		studentName, date: dateStr, archetype, sections, radarData, scoreSummary, raw: rawReport,
	};
}
