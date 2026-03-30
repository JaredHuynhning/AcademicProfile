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
	keyTakeaway?: string;
	content: MegaSectionContent;
	subsections?: { title: string; content: MegaSectionContent }[];
	rawData?: Record<string, unknown>;
}

export interface DimensionDetail {
	key: string;
	name: string;
	score: number;
	percentile: number;
	level: string;
	label: string;
	color: string;
	facets: { name: string; score: number }[];
}

export interface SubjectAlignment {
	subject: string;
	alignment: number;
	category: 'Excellent' | 'Good' | 'Challenging';
	passion?: number;
	confidence?: number;
}

export interface MegaReport {
	studentName: string;
	date: string;
	archetype: string;
	sections: MegaSection[];
	radarData: { dim: string; score: number; color: string }[];
	scoreSummary: { dim: string; score: number; percentile: number; level: string; label: string; color: string }[];
	dimensionDetails: DimensionDetail[];
	subjectAlignment: SubjectAlignment[];
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

// ─── Key Takeaway Generator ──────────────────────────────────────────────────

function generateKeyTakeaway(sectionId: string, dims: Record<string, any> | null, studentName: string): string | undefined {
	if (!dims) return undefined;
	const n = studentName.split(' ')[0] || 'This student';
	const C = dims.C; const O = dims.O; const E = dims.E; const X = dims.X; const A = dims.A; const H = dims.H;
	const cScore = C?.score || 3; const oScore = O?.score || 3; const eScore = E?.score || 3;
	const xScore = X?.score || 3; const aScore = A?.score || 3; const hScore = H?.score || 3;

	const takeaways: Record<string, () => string> = {
		'cover-summary': () => {
			const strongest = [
				{ k: 'Conscientiousness', s: cScore }, { k: 'Openness', s: oScore },
				{ k: 'Extraversion', s: xScore }, { k: 'Agreeableness', s: aScore },
				{ k: 'Emotionality', s: eScore }, { k: 'Honesty-Humility', s: hScore },
			].sort((a, b) => b.s - a.s)[0];
			return `${n}'s strongest dimension is ${strongest.k} (${strongest.s.toFixed(1)}/5). This shapes how they approach learning, relate to peers, and handle academic challenges.`;
		},
		'personality-deep-dive': () => {
			const high = [cScore, oScore, xScore, aScore, eScore, hScore].filter(s => s >= 3.5).length;
			const low = [cScore, oScore, xScore, aScore, eScore, hScore].filter(s => s < 2.5).length;
			if (high >= 4) return `${n} shows elevated scores across multiple dimensions, indicating a well-developed personality profile. Focus on leveraging strengths while watching for perfectionism or overcommitment.`;
			if (low >= 3) return `${n} has several areas below average, which isn't a weakness — it's a distinctive profile. The strategies in this report are specifically designed for this combination of traits.`;
			return `${n}'s personality profile is distinctive — not "average" on everything, but a unique combination that creates both natural advantages and areas needing targeted strategies.`;
		},
		'learning-profile': () => {
			if (oScore >= 3.5 && cScore >= 3.5) return `${n} has the ideal learning combination: curiosity (Openness ${oScore.toFixed(1)}) plus discipline (Conscientiousness ${cScore.toFixed(1)}). They explore deeply AND follow through.`;
			if (oScore >= 3.5 && cScore < 2.5) return `${n} is highly curious but struggles with follow-through. The key is channelling their intellectual excitement into structured output before interest fades.`;
			if (oScore < 2.5 && cScore >= 3.5) return `${n} is disciplined but may lack curiosity. They'll do the work reliably, but finding personal relevance in each topic will transform compliance into genuine engagement.`;
			return `${n}'s learning style is shaped by the interaction between their curiosity and discipline. The strategies below are tailored to this specific balance.`;
		},
		'academic-character': () => {
			if (cScore >= 4.0) return `${n}'s exceptional conscientiousness (${cScore.toFixed(1)}/5) is their academic superpower. They have the self-discipline most students lack — the key is ensuring it doesn't tip into unhealthy perfectionism.`;
			if (cScore < 2.5) return `${n}'s conscientiousness (${cScore.toFixed(1)}/5) is below average, which means external systems are essential. The right structure can close this gap entirely — many high achievers have low natural conscientiousness but excellent systems.`;
			return `${n} has moderate self-discipline — enough to function but with room to build better habits. Small, consistent improvements compound dramatically over a school year.`;
		},
		'study-playbook': () => {
			if (xScore >= 3.5) return `${n} learns best through discussion and collaboration. Every strategy below leverages their social energy — study groups, peer teaching, and verbal processing are their most effective tools.`;
			if (xScore < 2.5) return `${n} does their deepest thinking alone. The strategies below prioritise focused solo methods — active recall, written summaries, and quiet deep-work sessions.`;
			return `${n}'s study strategies should blend solo focus with selective collaboration. The methods below are ranked by fit for their specific personality combination.`;
		},
		'strengths': () => {
			const top = [
				{ k: 'discipline', s: cScore }, { k: 'curiosity', s: oScore },
				{ k: 'social skills', s: xScore }, { k: 'teamwork', s: aScore },
				{ k: 'emotional awareness', s: eScore }, { k: 'integrity', s: hScore },
			].sort((a, b) => b.s - a.s).slice(0, 2);
			return `${n}'s top strengths are ${top[0].k} and ${top[1].k}. These aren't just nice traits — they're competitive academic advantages that should be actively leveraged.`;
		},
		'barriers': () => {
			const weak = [
				{ k: 'organisation', s: cScore }, { k: 'engagement', s: oScore },
				{ k: 'participation', s: xScore }, { k: 'collaboration', s: aScore },
				{ k: 'stress management', s: eScore },
			].sort((a, b) => a.s - b.s)[0];
			return `${n}'s primary barrier is likely related to ${weak.k} (${weak.s.toFixed(1)}/5). Addressing this single area will have the biggest impact on overall academic performance.`;
		},
		'social-dynamics': () => {
			if (xScore >= 3.5 && aScore >= 3.5) return `${n} is a natural collaborator — socially confident and cooperative. They thrive in group settings and should seek leadership roles in team projects.`;
			if (xScore < 2.5 && aScore >= 3.5) return `${n} is cooperative but reserved. They contribute best when given defined roles in small groups, with time to prepare before meetings.`;
			if (xScore >= 3.5 && aScore < 2.5) return `${n} is socially confident but assertive. They'll take charge in groups — coaching them on inclusive leadership will multiply their impact.`;
			return `${n}'s social style blends independence with collaboration. The group strategies below are designed for this balanced approach.`;
		},
		'subject-fit': () => `The subject alignment below is based on ${n}'s personality profile — not their grades. A subject marked "Excellent" means ${n}'s natural traits align with what that subject demands, even if current grades don't yet reflect it.`,
		'guide': () => `Every recommendation in this guide is specific to ${n}'s profile. Generic advice like "study harder" or "be more organised" doesn't work — these strategies are designed for someone with exactly this personality combination.`,
		'action-plan': () => `Start with ONE action from the priority list below. Research shows that implementing a single strategy well beats attempting five poorly. Add the next action only after the first becomes automatic (usually 2-3 weeks).`,
	};

	return takeaways[sectionId]?.();
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
	const dimensionDetails: DimensionDetail[] = [];
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
			dimensionDetails.push({
				key,
				name: DIM_NAMES[key],
				score: d.score,
				percentile: scorePercentile(d.score),
				level: d.level,
				label: interpretiveLabel(d.score),
				color: DIM_COLORS[key],
				facets: Object.entries(d.facets).map(([k, f]) => ({ name: f.name, score: f.score })),
			});
		}
	}

	// Calculate subject alignment from dimension scores
	const subjectAlignment: SubjectAlignment[] = [];
	if (dims) {
		const subjDims: Record<string, string[]> = {
			Mathematics: ['C', 'O'], English: ['O', 'E'], Science: ['O', 'C'],
			History: ['O', 'A'], Languages: ['X', 'O'], 'Creative Arts': ['O', 'E'],
			'Physical Education': ['X', 'C'], 'Technology/Computing': ['C', 'O'],
		};
		const lp = results.learnerProfile || null;
		for (const [subj, dimKeys] of Object.entries(subjDims)) {
			const avg = dimKeys.reduce((sum, k) => sum + (dims[k]?.score || 3), 0) / dimKeys.length;
			const cat = avg >= 3.5 ? 'Excellent' : avg >= 2.5 ? 'Good' : 'Challenging';
			const subjLower = subj.toLowerCase().replace(/\s+/g, '_');
			const sfData = lp?.subjectFit?.[subjLower] || lp?.subjectFit?.[subj.toLowerCase()] || null;
			subjectAlignment.push({
				subject: subj, alignment: avg,
				category: cat as 'Excellent' | 'Good' | 'Challenging',
				passion: sfData?.passion, confidence: sfData?.confidence,
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
		keyTakeaway: generateKeyTakeaway('cover-summary', dims, studentName),
		content: execContent,
		rawData: { executiveSummary: exec, cover, glance: r.glance },
	});

	// 2. Who You Are — use deep narrative generator if dimensions available
	const personalityContent = dims
		? generatePersonalityDeepDive(dims, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.deepDive, r.whoYouAre) };
	sections.push({
		id: 'personality-deep-dive', title: 'Who You Are', subtitle: 'Personality Deep Dive', icon: '🧠',
		keyTakeaway: generateKeyTakeaway('personality-deep-dive', dims, studentName),
		content: personalityContent,
		rawData: { deepDive: r.deepDive, whoYouAre: r.whoYouAre },
	});

	// 3. How Your Mind Works
	const learningContent = dims
		? generateLearningProfileMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.learning, r.howYouLearn) };
	sections.push({
		id: 'learning-profile', title: 'How Your Mind Works', subtitle: 'Learning Profile', icon: '💡',
		keyTakeaway: generateKeyTakeaway('learning-profile', dims, studentName),
		content: learningContent,
		rawData: { learning: r.learning, howYouLearn: r.howYouLearn, studyProfile: r.studyProfile },
	});

	// 4. Academic Character & Drive
	const charContent = dims
		? generateAcademicCharacterMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.academicCharacter, r.drives) };
	sections.push({
		id: 'academic-character', title: 'Academic Character & Drive', icon: '🔥',
		keyTakeaway: generateKeyTakeaway('academic-character', dims, studentName),
		content: charContent,
		rawData: { academicCharacter: r.academicCharacter, drives: r.drives },
	});

	// 5. Study Strategy Playbook
	const studyContent = dims
		? generateStudyPlaybookMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.study, r.whatWorks) };
	sections.push({
		id: 'study-playbook', title: 'Study Strategy Playbook', icon: '📚',
		keyTakeaway: generateKeyTakeaway('study-playbook', dims, studentName),
		content: studyContent,
		rawData: { study: r.study, whatWorks: r.whatWorks },
	});

	// 6. Strengths & Superpowers
	const strengthsContent = dims
		? generateStrengthsMega(dims, crossRefResult, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.strengths, r.whatsWorking) };
	sections.push({
		id: 'strengths', title: 'Strengths & Superpowers', icon: '💪',
		keyTakeaway: generateKeyTakeaway('strengths', dims, studentName),
		content: strengthsContent,
		rawData: { strengths: r.strengths, whatsWorking: r.whatsWorking },
	});

	// 7. Barriers & Root Causes
	const barriersContent = dims
		? generateBarriersMega(dims, crossRefResult, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.barriers, r.rootCause) };
	sections.push({
		id: 'barriers', title: 'Barriers & Root Causes', icon: '🚧',
		keyTakeaway: generateKeyTakeaway('barriers', dims, studentName),
		content: barriersContent,
		rawData: { barriers: r.barriers, rootCause: r.rootCause },
	});

	// 8. Social & Group Dynamics
	const socialContent = dims
		? generateSocialDynamicsMega(dims, studentName)
		: { ...emptyContent(), narrative: extractNarratives(r.group) };
	sections.push({
		id: 'social-dynamics', title: 'Social & Group Dynamics', icon: '👥',
		keyTakeaway: generateKeyTakeaway('social-dynamics', dims, studentName),
		content: socialContent,
		rawData: { group: r.group },
	});

	// 9. Subject Fit & Career Signals
	const subjectContent = dims
		? generateSubjectFitMega(dims, results.learnerProfile || null, studentName)
		: { ...emptyContent(), narrative: extractNarratives(r.subjectFit) };
	sections.push({
		id: 'subject-fit', title: 'Subject Fit & Career Signals', icon: '🎯',
		keyTakeaway: generateKeyTakeaway('subject-fit', dims, studentName),
		content: subjectContent,
		rawData: { subjectFit: r.subjectFit },
	});

	// 10. Teacher & Parent Guide
	const guideContent = dims
		? generateGuideMega(dims, studentName)
		: { ...emptyContent(), narrative: pickNarratives(r.unifiedGuide, r.guide) };
	sections.push({
		id: 'guide', title: 'Teacher & Parent Guide', icon: '📋',
		keyTakeaway: generateKeyTakeaway('guide', dims, studentName),
		content: guideContent,
		rawData: { guide: r.guide, unifiedGuide: r.unifiedGuide, tutor: r.tutor, academicGuide: r.academicGuide },
	});

	// 11. Action Plan
	const actionContent = dims
		? generateActionPlanMega(dims, studentName)
		: { ...emptyContent(), narrative: extractNarratives(r.actionPlan) };
	sections.push({
		id: 'action-plan', title: 'What To Do Monday', subtitle: 'Action Plan', icon: '✅',
		keyTakeaway: generateKeyTakeaway('action-plan', dims, studentName),
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
		studentName, date: dateStr, archetype, sections, radarData, scoreSummary, dimensionDetails, subjectAlignment, raw: rawReport,
	};
}
