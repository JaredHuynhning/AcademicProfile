/**
 * Mega-section types and consolidation for the 50-page report.
 * Consolidates 23 thin section generators → 12 mega-sections.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, DIM_SHORT, scorePercentile, interpretiveLabel, toDimensionsMap } from './helpers';
import { detectDimensionInteractions, type InteractionInsight } from './interaction-rules';
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
import { TestResults } from '../types';

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
	style: string;
	superpower: string;
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
	interactions: InteractionInsight[];
	radarData: { dim: string; score: number; color: string }[];
	scoreSummary: { dim: string; score: number; percentile: number; level: string; label: string; color: string }[];
	dimensionDetails: DimensionDetail[];
	subjectAlignment: SubjectAlignment[];
	introLetter: {
		salutation: string;
		body: string;
		closing: string;
	};
	onePageSummary: {
		topStrengths: Finding[];
		topBarriers: Finding[];
		primaryAction: Action;
		mantra: string;
	};
	studentHack: {
		title: string;
		hack: string;
		why: string;
	};
	quickWins: { id: string; text: string; completed: boolean }[];
	teacherBrief: {
		learningStyle: string;
		topRecommendation: string;
		whatToWatchFor: string;
		howToMotivate: string;
	};
	raw: Record<string, unknown>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

import { traitReframe, type DimKey } from './helpers';

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

function generateKeyTakeaway(sectionId: string, dims: Record<string, { score: number }> | null, studentName: string): string | undefined {
	if (!dims) return undefined;
	const n = studentName.split(' ')[0] || 'your child';
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
			return `${n}'s stand-out strength is ${strongest.k} (${strongest.s.toFixed(1)}/5). This is like a "default setting" that helps ${n} handle schoolwork and relate to others in a unique way.`;
		},
		'personality-deep-dive': () => {
			const high = [cScore, oScore, xScore, aScore, eScore, hScore].filter(s => s >= 3.5).length;
			const low = [cScore, oScore, xScore, aScore, eScore, hScore].filter(s => s < 2.5).length;
			if (high >= 4) return `${n}'s profile is high-energy and multi-talented. The key is to pick which "superpower" to use for each challenge without burning out.`;
			if (low >= 3) return `${n}'s profile is unique and focused. It means ${n} works best when things are done a specific way, using the targeted "brain hacks" found in this report.`;
			return `${n}'s personality is a balanced mix of different traits. This means ${n} is adaptable and can handle many different types of school and social situations.`;
		},
		'learning-profile': () => {
			if (oScore >= 3.5 && cScore >= 3.5) return `${n} has the "Curious Creator" combo: high curiosity plus the discipline to actually finish things. It's a powerful mix for deep learning.`;
			if (oScore >= 3.5 && cScore < 2.5) return `${n} is a "Big Idea Thinker." The goal is to capture those great ideas before they fly away and build small systems to help finish them.`;
			if (oScore < 2.5 && cScore >= 3.5) return `${n} is "The Reliable Pro"—the person who gets the job done. The trick is to find an interesting "hook" in every subject to make the work feel more exciting.`;
			return `${n}'s learning style is all about balance. By understanding how curiosity and discipline work together, ${n} can work smarter, not harder.`;
		},
		'academic-character': () => {
			if (cScore >= 4.0) return `${n}'s self-discipline is a massive advantage. Most students have to work hard just to get started—for ${n}, starting is the easy part. The focus is on quality over quantity.`;
			if (cScore < 2.5) return `${n} works best when there's an external "system" in place. Many high achievers actually score low here, but they succeed by using planners and timers to close the gap.`;
			return `${n} has a solid foundation of study habits. Small, consistent tweaks to the daily routine will lead to big improvements over the school year.`;
		},
		'study-playbook': () => {
			if (xScore >= 3.5) return `${n} is a social learner. Talking through ideas and working with others is the fastest way for ${n} to master new material.`;
			if (xScore < 2.5) return `${n} is a "Solo Specialist." Deep focus happens in quiet spaces without distractions. Solitary study is ${n}'s secret weapon.`;
			return `${n} works well both alone and in groups. The strategy is to choose the right mode for the right task—solo for memorising, social for brainstorming.`;
		},
		'strengths': () => {
			const top = [
				{ k: 'discipline', s: cScore }, { k: 'curiosity', s: oScore },
				{ k: 'social skills', s: xScore }, { k: 'teamwork', s: aScore },
				{ k: 'emotional awareness', s: eScore }, { k: 'integrity', s: hScore },
			].sort((a, b) => b.s - a.s).slice(0, 2);
			return `${n}'s top strengths—${top[0].k} and ${top[1].k}—are more than just traits. They are strategic advantages that ${n} can use to win in any subject.`;
		},
		'barriers': () => {
			const weak = [
				{ k: 'organisation', s: cScore }, { k: 'engagement', s: oScore },
				{ k: 'participation', s: xScore }, { k: 'collaboration', s: aScore },
				{ k: 'stress management', s: eScore },
			].sort((a, b) => a.s - b.s)[0];
			return `${n}'s biggest challenge is likely related to ${weak.k}. By fixing this one "bottleneck," everything else at school will start to feel easier.`;
		},
		'social-dynamics': () => {
			if (xScore >= 3.5 && aScore >= 3.5) return `${n} is a natural team player who brings people together. Leading group projects or mentoring others is a great way to grow.`;
			if (xScore < 2.5 && aScore >= 3.5) return `${n} is a "Supportive Specialist"—someone who works best in small teams with a clear role and time to prepare.`;
			if (xScore >= 3.5 && aScore < 2.5) return `${n} is a "Confident Driver." In groups, ${n} takes charge. The key is using that energy to help the whole team move forward.`;
			return `${n} balances independence with teamwork. This means ${n} can lead when needed, but also work well as a reliable contributor.`;
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
	results: TestResults,
	studentName: string,
): MegaReport {
	const sections: MegaSection[] = [];

	const radarData: MegaReport['radarData'] = [];
	const scoreSummary: MegaReport['scoreSummary'] = [];
	const dimensionDetails: DimensionDetail[] = [];
	const hasDims = Array.isArray(results.dimensions) && results.dimensions.length > 0;
	const dims = hasDims ? toDimensionsMap(results.dimensions!) : null;
	if (dims) {
		for (const key of DIM_ORDER) {
			const d = dims[key];
			if (!d) continue;
			const reframe = traitReframe(key as DimKey, d.score);
			radarData.push({ dim: DIM_SHORT[key], score: d.score, color: DIM_COLORS[key] });
			scoreSummary.push({
				dim: DIM_NAMES[key], score: d.score,
				percentile: scorePercentile(d.score), level: d.level,
				label: interpretiveLabel(d.score), color: DIM_COLORS[key],
				style: reframe.style, superpower: reframe.superpower,
			} as any);
			dimensionDetails.push({
				key,
				name: DIM_NAMES[key],
				score: d.score,
				percentile: scorePercentile(d.score),
				level: d.level,
				label: interpretiveLabel(d.score),
				color: DIM_COLORS[key],
				facets: Object.entries(d.facets).map(([k, f]) => ({ name: f.name, score: f.score })),
				style: reframe.style, superpower: reframe.superpower,
			} as any);
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
			const sfData = (lp?.subjectFit as Record<string, any>)?.[subjLower] || (lp?.subjectFit as Record<string, any>)?.[subj.toLowerCase()] || null;
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
	let crossRefResult = (r._crossRefResult as any) || null;

	// Detect dimension interactions and attach to crossRefResult
	const interactions = dims ? detectDimensionInteractions(dims, studentName) : [];
	if (crossRefResult) {
		crossRefResult.interactions = interactions;
	} else if (interactions.length > 0) {
		crossRefResult = {
			insights: [],
			byType: { root_cause: [], confirmation: [], contradiction: [], untapped: [] },
			interactions,
		};
	}

	// ─── Extract Summary Data ────────────────────────────────────────────────
	const topStrengths: Finding[] = [];
	const topBarriers: Finding[] = [];
	let primaryAction: Action = { title: 'Focus on Consistency', description: 'Establish a small, repeatable daily habit.', priority: 1 };

	// ─── Mantra Generator ───────────────────────────────────────────────────
	const C = dims?.C?.score || 3;
	const O = dims?.O?.score || 3;
	const E = dims?.E?.score || 3;
	const X = dims?.X?.score || 3;

	let mantra = 'Progress over perfection.';
	if (C >= 4 && O >= 4) mantra = 'Channel curiosity into disciplined creation.';
	else if (C < 3 && O >= 4) mantra = 'Structure the sparks — systems for your ideas.';
	else if (C >= 4 && E >= 4) mantra = 'Diligence is your shield against anxiety.';
	else if (X < 3 && C >= 4) mantra = 'Quiet focus is your ultimate academic weapon.';
	else if (X >= 4 && C < 3) mantra = 'Leverage the group to stay accountable.';

	// ─── Teacher Brief ──────────────────────────────────────────────────────
	const teacherBrief = {
		learningStyle: archetype,
		topRecommendation: 'Provide clear, structured deadlines and rubrics.',
		whatToWatchFor: 'Avoidance of difficult tasks due to fear of failure.',
		howToMotivate: 'Connect learning to their personal interests and curiosities.',
	};

	if (C >= 4) {
		teacherBrief.topRecommendation = 'Give autonomy on "how" — they already have the "when" handled.';
		teacherBrief.whatToWatchFor = 'Burnout and over-commitment to minor details.';
		teacherBrief.howToMotivate = 'Acknowledge the quality and reliability of their work.';
	} else if (C < 3) {
		teacherBrief.topRecommendation = 'Scaffold large projects with frequent, small milestones.';
		teacherBrief.whatToWatchFor = 'Last-minute rushing and missed organisational steps.';
		teacherBrief.howToMotivate = 'Gamify tasks and use short-term rewards.';
	}

	if (X >= 4) {
		teacherBrief.howToMotivate += ' Use peer-teaching and group discussion roles.';
	} else if (X < 3) {
		teacherBrief.howToMotivate += ' Allow for independent processing time before group work.';
	}

	// ─── Student Hack ───────────────────────────────────────────────────────
	const studentHack = {
		title: 'The Brain Hack',
		hack: 'Use the "10-Minute Dash": set a timer for 10 minutes and work only on one task. When it rings, you have permission to stop.',
		why: 'This bypasses your brain\'s resistance to starting large tasks by making the "entry cost" very low.',
	};

	if (C < 3 && O >= 4) {
		studentHack.title = 'The Idea Capture Hack';
		studentHack.hack = 'Keep a "Parking Lot" notebook. When a cool but unrelated idea hits you during study, write it down immediately then return to your work.';
		studentHack.why = 'Your high curiosity means you get distracted by your own great ideas. Writing them down tells your brain "I won\'t forget this," allowing you to refocus.';
	} else if (E >= 4 && C >= 4) {
		studentHack.title = 'The Perfectionist Reset';
		studentHack.hack = 'Purposefully do a "Draft 0" where you aren\'t allowed to use the backspace key. Just get the words out, no matter how bad they are.';
		studentHack.why = 'Your high standards can paralyse you. Draft 0 separates "creating" from "editing," which reduces the anxiety of the blank page.';
	} else if (X < 3) {
		studentHack.title = 'The Solo-Sprint Hack';
		studentHack.hack = 'Use "Body Doubling" — study in a library or cafe where others are working, but you don\'t have to talk to them.';
		studentHack.why = 'You work best alone, but the presence of other productive people provides a subtle "accountability field" that keeps you off your phone.';
	} else if (X >= 4 && C < 3) {
		studentHack.title = 'The Social Pressure Hack';
		studentHack.hack = 'Tell a friend what you\'re going to finish by 8 PM. Ask them to text you at 8:01 to ask for a photo of the work.';
		studentHack.why = 'You are motivated by social connection. Using that "positive peer pressure" provides the discipline your personality doesn\'t always naturally have.';
	}

	// ─── Intro Letter ───────────────────────────────────────────────────────
	const firstName = studentName.split(' ')[0] || 'Student';
	const introLetter = {
		salutation: `Hi ${firstName},`,
		body: `This report is all about how you tick. We've looked at your personality and your study habits to create a map of your "default settings." Being ${archetype.toLowerCase()} means you have a unique way of processing ideas and getting things done. Some of this will feel like your secret superpower, and some of it might explain why certain things at school feel like a struggle. Remember: this isn't a list of things you "can't" do—it's a guide to how you can do things your own way.`,
		closing: `Let's dive in.`,
	};

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
		? generatePersonalityDeepDive(dims, studentName, crossRefResult)
		: { ...emptyContent(), narrative: pickNarratives(r.deepDive, r.whoYouAre) };
	sections.push({
		id: 'personality-deep-dive', title: 'Who You Are', subtitle: 'Personality Deep Dive', icon: '🧠',
		keyTakeaway: generateKeyTakeaway('personality-deep-dive', dims, studentName),
		content: personalityContent,
		rawData: { deepDive: r.deepDive, whoYouAre: r.whoYouAre },
	});

	// 3. How Your Mind Works
	const learningContent = dims
		? generateLearningProfileMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName, crossRefResult)
		: { ...emptyContent(), narrative: pickNarratives(r.learning, r.howYouLearn) };
	sections.push({
		id: 'learning-profile', title: 'How Your Mind Works', subtitle: 'Learning Profile', icon: '💡',
		keyTakeaway: generateKeyTakeaway('learning-profile', dims, studentName),
		content: learningContent,
		rawData: { learning: r.learning, howYouLearn: r.howYouLearn, studyProfile: r.studyProfile },
	});

	// 4. Academic Character & Drive
	const charContent = dims
		? generateAcademicCharacterMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName, crossRefResult)
		: { ...emptyContent(), narrative: pickNarratives(r.academicCharacter, r.drives) };
	sections.push({
		id: 'academic-character', title: 'Academic Character & Drive', icon: '🔥',
		keyTakeaway: generateKeyTakeaway('academic-character', dims, studentName),
		content: charContent,
		rawData: { academicCharacter: r.academicCharacter, drives: r.drives },
	});

	// 5. Study Strategy Playbook
	const studyContent = dims
		? generateStudyPlaybookMega(dims, results.studyProfile || null, results.learnerProfile || null, studentName, crossRefResult)
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
		? generateSocialDynamicsMega(dims, studentName, crossRefResult)
		: { ...emptyContent(), narrative: extractNarratives(r.group) };
	sections.push({
		id: 'social-dynamics', title: 'Social & Group Dynamics', icon: '👥',
		keyTakeaway: generateKeyTakeaway('social-dynamics', dims, studentName),
		content: socialContent,
		rawData: { group: r.group },
	});

	// 9. Subject Fit & Career Signals
	const subjectContent = dims
		? generateSubjectFitMega(dims, results.learnerProfile || null, studentName, crossRefResult)
		: { ...emptyContent(), narrative: extractNarratives(r.subjectFit) };
	sections.push({
		id: 'subject-fit', title: 'Subject Fit & Career Signals', icon: '🎯',
		keyTakeaway: generateKeyTakeaway('subject-fit', dims, studentName),
		content: subjectContent,
		rawData: { subjectFit: r.subjectFit },
	});

	// 10. Teacher & Parent Guide
	const guideContent = dims
		? generateGuideMega(dims, studentName, crossRefResult)
		: { ...emptyContent(), narrative: pickNarratives(r.unifiedGuide, r.guide) };
	sections.push({
		id: 'guide', title: 'Teacher & Parent Guide', icon: '📋',
		keyTakeaway: generateKeyTakeaway('guide', dims, studentName),
		content: guideContent,
		rawData: { guide: r.guide, unifiedGuide: r.unifiedGuide, tutor: r.tutor, academicGuide: r.academicGuide },
	});

	// 11. Action Plan
	const actionContent = dims
		? generateActionPlanMega(dims, studentName, crossRefResult)
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
				'\n### Growth Mindset & Neuroplasticity',
				'It is essential to remember that the personality traits and learning patterns described in this report are "default settings," not fixed destinies. The teenage brain is highly plastic — meaning it is still physically restructuring itself. Habits of conscientiousness, emotional regulation, and social confidence can be built through deliberate practice, just like a muscle. This report is a map of your starting point, but you choose the destination.',
				'\n### Methodology',
				'All personality scores are self-reported. Self-report measures are the gold standard for personality assessment because personality traits are internal states that the individual has the most direct access to. However, self-report can be influenced by social desirability (answering how you think you "should" rather than how you actually are) and self-knowledge (some teenagers are still developing self-awareness). For this reason, the report emphasises patterns and trends rather than treating any single score as definitive.',
				'The cross-reference engine in this report maps personality traits to academic outcomes using evidence-based rules derived from published research on personality and academic achievement. These are correlational patterns, not causal certainties — personality predicts tendencies, not guarantees.',
				'\n### Recommended Reading',
				'For parents who want to understand more about personality and academic achievement: "Quiet" by Susan Cain (introversion in education), "Grit" by Angela Duckworth (persistence and long-term goals), "Mindset" by Carol Dweck (growth vs fixed mindset), and "Why We Sleep" by Matthew Walker (the critical role of sleep in learning).',
			],
		},
		rawData: {},
	});

	// ─── Post-processing: Extract Top Findings ──────────────────────────────
	const mainFindings = sections[0]?.content.keyFindings || [];
	mainFindings.forEach(f => {
		if (f.type === 'strength' && topStrengths.length < 3) topStrengths.push(f);
		if (f.type === 'barrier' && topBarriers.length < 3) topBarriers.push(f);
	});
	// Fallback to searching other sections if executive is empty
	if (topStrengths.length < 2) {
		sections.forEach(s => s.content.keyFindings.forEach(f => {
			if (f.type === 'strength' && topStrengths.length < 3 && !topStrengths.find(x => x.text === f.text)) topStrengths.push(f);
		}));
	}
	if (topBarriers.length < 2) {
		sections.forEach(s => s.content.keyFindings.forEach(f => {
			if (f.type === 'barrier' && topBarriers.length < 3 && !topBarriers.find(x => x.text === f.text)) topBarriers.push(f);
		}));
	}

	const allActions = sections.flatMap(s => s.content.actions);
	if (allActions.length > 0) {
		primaryAction = allActions.sort((a, b) => a.priority - b.priority)[0];
	}

	return {
		studentName,
		date: dateStr,
		archetype,
		sections,
		interactions,
		radarData,
		scoreSummary,
		dimensionDetails,
		subjectAlignment,
		introLetter,
		onePageSummary: {
			topStrengths,
			topBarriers,
			primaryAction,
			mantra,
		},
		studentHack,
		quickWins: [],
		teacherBrief,
		raw: rawReport,
	};
}
