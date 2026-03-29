// @ts-nocheck
/**
 * Mega Section 11: Action Plan — What To Do Monday
 * Generates ~3 pages: priority actions, 30/60/90 day plan, weekly rhythm, stop doing.
 */
import { DIM_NAMES, classifyLevel, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, Action } from '../mega-sections';

export function generateActionPlanMega(
	dimensions: DimensionsMap,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const actions: Action[] = [];

	const C = dimensions.C;
	const E = dimensions.E;
	const X = dimensions.X;
	const A = dimensions.A;
	const O = dimensions.O;

	const cScore = C?.score || 3.0;
	const eScore = E?.score || 3.0;
	const xScore = X?.score || 3.0;
	const oScore = O?.score || 3.0;

	narrative.push(
		`Everything in the preceding 10 sections leads to this: specific, actionable steps ${studentName} can take starting this week. These aren't aspirational goals — they're concrete changes calibrated to ${studentName}'s personality profile. Start with Action 1. Don't try to implement everything at once.`
	);

	// ─── Priority Actions ────────────────────────────────────────────────────────
	narrative.push('\n### Priority Actions');
	let priority = 1;

	// Conscientiousness-driven actions
	if (cScore < 2.5) {
		const action = `Create a study station: a specific desk or table that is ONLY used for studying. Remove all distractions from this space. Put a simple daily task list on the wall next to it. Start with 15 minutes of focused work per day and add 5 minutes each week.`;
		actions.push({ title: 'Build a Study Station', description: action, priority });
		narrative.push(`**Action ${priority}: Build a Study Station.** ${action}`);
		priority++;

		const action2 = `Get a physical planner (not digital — physical works better for building habits). Every Sunday evening, write down the week's due dates and daily study tasks. Check items off as you complete them. The visual progress is the reward.`;
		actions.push({ title: 'Start a Weekly Planner', description: action2, priority });
		narrative.push(`**Action ${priority}: Start a Weekly Planner.** ${action2}`);
		priority++;
	} else if (cScore >= 3.5 && C?.facets?.perfectionism?.score >= 4.0) {
		const action = `Practice "good enough" submissions. For the next assignment, set a time limit (e.g., 2 hours for a 2-hour assignment). When time is up, submit what you have. Notice that the grade is usually fine — perfection doesn't equal extra marks.`;
		actions.push({ title: 'Practice Good Enough', description: action, priority });
		narrative.push(`**Action ${priority}: Practice "Good Enough."** ${action}`);
		priority++;
	}

	// Emotionality-driven actions
	if (eScore >= 3.5 && E?.facets?.anxiety?.score >= 3.5) {
		const action = `Build an exam anxiety toolkit: (1) Deep breathing — 4 counts in, 7 counts hold, 8 counts out. Practice daily, not just before exams. (2) Positive self-talk script: write 3 true statements about your ability and read them before each exam. (3) Structured preparation plan that converts uncertainty into a concrete checklist.`;
		actions.push({ title: 'Build Anxiety Toolkit', description: action, priority });
		narrative.push(`**Action ${priority}: Build an Anxiety Toolkit.** ${action}`);
		priority++;
	}

	// Extraversion-driven actions
	if (xScore < 2.5) {
		const action = `Set a "one contribution per class" goal. Before each lesson, prepare one question or comment related to the topic. Deliver it in the first 10 minutes when anxiety is lower. Track your contributions for a week — you'll find it gets easier.`;
		actions.push({ title: 'One Contribution Per Class', description: action, priority });
		narrative.push(`**Action ${priority}: One Contribution Per Class.** ${action}`);
		priority++;
	} else if (xScore >= 3.5) {
		const action = `Form a study group (2-3 people maximum). Meet weekly to teach each other material. Use the "Feynman technique": explain a concept simply enough that someone else understands it. If you can't explain it, you don't understand it.`;
		actions.push({ title: 'Form a Study Group', description: action, priority });
		narrative.push(`**Action ${priority}: Form a Study Group.** ${action}`);
		priority++;
	}

	// Openness-driven actions
	if (oScore >= 3.5) {
		const action = `Create an "explore later" notebook. When you encounter an interesting tangent during study, jot it down and return to the syllabus. Spend 30 minutes each weekend exploring your collected tangents. This satisfies curiosity without derailing revision.`;
		actions.push({ title: 'Explore Later Notebook', description: action, priority });
		narrative.push(`**Action ${priority}: Start an "Explore Later" Notebook.** ${action}`);
		priority++;
	} else if (oScore < 2.5) {
		const action = `For each new topic, answer one question before starting: "When would I actually use this?" If you can't find an answer, ask the teacher. Connecting academic material to real-world applications dramatically improves engagement and retention.`;
		actions.push({ title: 'Find Personal Relevance', description: action, priority });
		narrative.push(`**Action ${priority}: Find Personal Relevance.** ${action}`);
		priority++;
	}

	// Universal high-impact action
	const universalAction = `Start each study session with active recall: close your notes, write everything you remember about the topic, then check. This 5-minute exercise is the single most effective learning technique available — more powerful than re-reading, highlighting, or summarising combined.`;
	actions.push({ title: 'Active Recall First', description: universalAction, priority });
	narrative.push(`**Action ${priority}: Active Recall First.** ${universalAction}`);

	// ─── 30/60/90 Day Plan ───────────────────────────────────────────────────────
	narrative.push('\n### 30/60/90 Day Plan');

	narrative.push('\n#### Days 1-30: Quick Wins');
	narrative.push(
		`Focus on Actions 1 and 2 only. The goal is establishing one new habit. Don't add more until these feel automatic. ${cScore < 2.5 ? 'The study station and planner are the foundation — everything else builds on top.' : eScore >= 3.5 ? 'The anxiety toolkit should be practised daily, not just before exams — it takes 3 weeks to become effective.' : 'Pick whichever action feels most impactful and commit to it for 30 consecutive days.'}`
	);

	narrative.push('\n#### Days 31-60: Build Momentum');
	narrative.push(
		`Add Actions 3 and 4. By now, the first habits should be established. Extend study sessions by 10-15 minutes. Start using active recall for every study session. ${cScore < 2.5 ? 'If the planner habit has stuck, upgrade to a weekly review: every Sunday, assess what worked and what didn\'t.' : 'Begin tracking which study methods produce the best retention and double down on those.'}`
	);

	narrative.push('\n#### Days 61-90: Consolidate');
	narrative.push(
		`Implement remaining actions. Review progress on the first actions — are they still happening? If any habits have slipped, restart them before adding new ones. By day 90, ${studentName} should have: ${cScore < 2.5 ? 'a consistent study routine, a functional planner, and at least one active recall technique.' : eScore >= 3.5 ? 'a reliable anxiety management routine, a structured exam preparation process, and measurably reduced stress.' : 'a refined study system that plays to their personality strengths and compensates for their challenges.'}`
	);

	// ─── Weekly Rhythm ───────────────────────────────────────────────────────────
	narrative.push('\n### Weekly Rhythm');

	narrative.push(`**Monday-Thursday:** Core study block after school. ${cScore < 2.5 ? '15-30 minutes initially, building to 45-60.' : '45-60 minutes.'} Focus on the day's most challenging subject.`);
	narrative.push(`**Friday:** Light review only. ${xScore >= 3.5 ? 'Social study session with study group if available.' : 'Quick active recall across all subjects — 5 minutes per subject.'}`);
	narrative.push(`**Saturday:** ${cScore >= 3.5 ? 'Deep work block (1.5-2 hours). Projects, essays, or catching up on challenging material.' : 'One 60-minute focused session. No more — quality over quantity.'}`);
	narrative.push(`**Sunday:** Plan the week ahead. ${eScore >= 3.5 ? 'Also: relaxation and anxiety prevention — the goal is to start Monday feeling prepared, not panicked.' : 'Organise materials, review planner, set 3 priorities for the week.'}`);

	// ─── Stop Doing ──────────────────────────────────────────────────────────────
	narrative.push('\n### Stop Doing');

	const stopDoing: string[] = [];
	stopDoing.push(`**Stop re-reading.** It feels productive but produces minimal retention. Replace every re-reading session with active recall.`);

	if (cScore < 2.5) {
		stopDoing.push(`**Stop cramming.** Last-minute marathon sessions produce worse results than short daily sessions. ${studentName}'s personality makes cramming especially ineffective.`);
	}
	if (eScore >= 3.5) {
		stopDoing.push(`**Stop studying before bed.** Late-night revision increases anxiety and disrupts sleep. Set a "study curfew" 1 hour before bedtime.`);
	}
	if (xScore >= 3.5) {
		stopDoing.push(`**Stop confusing socialising with studying.** Group study is valuable ONLY when it includes active recall, practice questions, or teaching. Social chat during "study" time doesn't count.`);
	}
	if (oScore >= 3.5) {
		stopDoing.push(`**Stop going down rabbit holes during revision.** Curiosity is a strength — but not during exam preparation. Jot tangents in your "explore later" notebook and stay on syllabus.`);
	}
	if (C?.facets?.perfectionism?.score >= 4.0) {
		stopDoing.push(`**Stop perfecting non-critical tasks.** A 5% improvement in a low-weight assignment is not worth 3 extra hours. Save your polish for what matters.`);
	}

	stopDoing.forEach(s => narrative.push(s));

	return {
		narrative,
		keyFindings,
		researchNotes: [],
		scenarios: [],
		crossReferences: [
			{ targetSection: 'barriers', text: 'These actions address the barriers identified in Section 7.' },
			{ targetSection: 'study-playbook', text: 'Study method details in Section 5.' },
		],
		actions,
	};
}
