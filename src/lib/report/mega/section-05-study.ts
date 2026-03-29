// @ts-nocheck
/**
 * Mega Section 5: Study Strategy Playbook
 * Generates ~6 pages: optimal methods, subject strategies, exam prep, weekly schedule, environment.
 */
import { classifyLevel, scorePercentile, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';

export function generateStudyPlaybookMega(
	dimensions: DimensionsMap,
	studyProfile: any | null,
	learnerProfile: any | null,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	const C = dimensions.C;
	const O = dimensions.O;
	const E = dimensions.E;
	const X = dimensions.X;
	const cScore = C?.score || 3.0;
	const oScore = O?.score || 3.0;
	const eScore = E?.score || 3.0;
	const xScore = X?.score || 3.0;

	narrative.push(
		`This section translates ${studentName}'s personality and learning profile into specific, actionable study strategies. Every recommendation is calibrated to their unique combination of traits — not generic advice, but strategies that work for someone with exactly ${studentName}'s profile.`
	);

	// ─── Optimal Study Methods ───────────────────────────────────────────────────
	narrative.push('\n### Optimal Study Methods');

	const methods: { name: string; fit: string; why: string }[] = [];

	// Spaced repetition
	if (cScore >= 3.0) {
		methods.push({ name: 'Spaced Repetition (Anki/flashcards)', fit: 'Excellent', why: `${studentName}'s conscientiousness means they'll actually maintain the review schedule. Set intervals at 1-3-7-14-30 days for maximum retention.` });
	} else {
		methods.push({ name: 'Spaced Repetition (Anki/flashcards)', fit: 'Good with support', why: `Effective for retention, but ${studentName} will need accountability to maintain the daily review habit. Pair with a study partner or app reminders.` });
	}

	// Active recall
	methods.push({ name: 'Active Recall (practice questions)', fit: 'Excellent', why: `Works for every personality type. ${studentName} should close the textbook and write everything they can remember, then check. Research shows this is 3x more effective than re-reading (Roediger & Butler, 2011).` });

	// Mind mapping
	if (oScore >= 3.5) {
		methods.push({ name: 'Mind Mapping', fit: 'Excellent', why: `${studentName}'s high Openness means they naturally see connections between ideas. Mind maps externalise this thinking style and make it visible for revision.` });
	} else {
		methods.push({ name: 'Mind Mapping', fit: 'Moderate', why: `${studentName} may prefer more linear note-taking, but mind maps are worth trying for complex topics where relationships between concepts matter.` });
	}

	// Teaching method
	if (xScore >= 3.0) {
		methods.push({ name: 'Teach-Back Method', fit: 'Excellent', why: `${studentName}'s social comfort means they'll enjoy explaining concepts to others. Teaching material forces deep understanding — if you can't explain it simply, you don't truly understand it (Feynman technique).` });
	} else {
		methods.push({ name: 'Teach-Back Method (solo version)', fit: 'Good', why: `${studentName} may prefer explaining concepts to an imaginary audience or writing explanations rather than teaching a real person. The cognitive benefits are identical.` });
	}

	// Pomodoro
	if (eScore >= 3.5 || cScore < 3.0) {
		methods.push({ name: 'Pomodoro Technique (25min/5min)', fit: 'Excellent', why: `${eScore >= 3.5 ? `${studentName}'s higher emotionality means sustained focus drains faster — structured breaks prevent burnout.` : `Shorter blocks suit ${studentName}'s natural attention pattern and make getting started feel less daunting.`}` });
	} else {
		methods.push({ name: 'Extended Focus Blocks (45-60min)', fit: 'Good', why: `${studentName}'s profile supports longer focus sessions. Use 45-60 minute blocks with 10-minute breaks for deep work, Pomodoro for revision.` });
	}

	narrative.push(
		`Based on ${studentName}'s personality profile, the following study methods are ranked by fit:\n`
	);
	methods.forEach((m, i) => {
		narrative.push(`**${i + 1}. ${m.name}** (Fit: ${m.fit}): ${m.why}`);
	});

	researchNotes.push({
		text: 'The three most evidence-backed study techniques are: active recall, spaced repetition, and interleaving (mixing different topics in one session). All other techniques are supplementary (Dunlosky et al., 2013).',
		topic: 'Study methods',
	});

	// ─── Subject Strategies ──────────────────────────────────────────────────────
	narrative.push('\n### Subject-Specific Strategies');

	// STEM
	if (cScore >= 3.5 && oScore < 3.0) {
		narrative.push(
			`**Mathematics & Science:** ${studentName}'s methodical, disciplined approach is ideal for STEM subjects. Focus on: worked examples first (understand the method), then practice problems in increasing difficulty. Don't skip steps — show all working. For science, focus on understanding experimental procedures and data interpretation, which reward systematic thinking.`
		);
	} else if (oScore >= 3.5) {
		narrative.push(
			`**Mathematics & Science:** ${studentName}'s curiosity and creativity are assets in STEM — they naturally ask "why?" which leads to deeper understanding. However, they may resist drill-and-practice, which is necessary for maths fluency. Strategy: start each topic with a real-world problem that sparks curiosity, THEN do the practice problems. Frame practice as "building tools to solve interesting problems," not as busy work.`
		);
	} else {
		narrative.push(
			`**Mathematics & Science:** A balanced approach works best. Alternate between understanding concepts (worked examples, video explanations) and building fluency (practice problems). For ${studentName}, the key is maintaining consistent practice even when the material feels manageable — gaps in foundational skills compound quickly in STEM.`
		);
	}

	// Humanities
	if (oScore >= 3.5 && eScore >= 3.0) {
		narrative.push(
			`**English & Humanities:** ${studentName}'s openness to ideas and emotional sensitivity are superpowers in humanities subjects. They naturally empathise with literary characters, see multiple perspectives in history, and generate original arguments. Strategy: lean into essay-based assessment by practising argument structure (claim + evidence + analysis). Read widely around topics of interest — breadth of reading is the single best predictor of humanities achievement.`
		);
	} else if (oScore < 2.5) {
		narrative.push(
			`**English & Humanities:** These subjects may feel less intuitive for ${studentName}, who prefers concrete, practical material. Strategy: use structured essay templates (PEEL paragraphs, argument maps) to provide the scaffolding that makes abstract analysis feel manageable. Focus on understanding the assessment criteria — knowing exactly what markers look for removes ambiguity.`
		);
	} else {
		narrative.push(
			`**English & Humanities:** ${studentName} can perform well with a structured approach. For essays: plan before writing (5 minutes of dot points prevents 30 minutes of rambling). For literature: keep a character/theme tracker while reading. For history: focus on cause-and-effect chains rather than memorising dates.`
		);
	}

	// Languages
	if (xScore >= 3.5) {
		narrative.push(
			`**Languages:** ${studentName}'s social confidence is an advantage — they'll be more willing to practise speaking, which is the fastest path to fluency. Strategy: find a conversation partner, use language apps with speaking components, and volunteer to read aloud in class. Don't fear mistakes — every error is a learning opportunity.`
		);
	} else {
		narrative.push(
			`**Languages:** Written and listening components may come more naturally than speaking for ${studentName}. Strategy: build speaking confidence gradually — practise pronunciation alone first, then with a trusted friend, then in small groups. Written vocabulary revision (flashcards, writing sentences) builds the foundation that makes speaking easier.`
		);
	}

	// ─── Exam Preparation ────────────────────────────────────────────────────────
	narrative.push('\n### Exam Preparation Timeline');

	if (eScore >= 3.5) {
		narrative.push(
			`${studentName}'s higher emotionality means exam periods can feel overwhelming. A structured preparation timeline reduces anxiety by converting uncertainty into a concrete plan. Here is a personalised approach:`
		);
		narrative.push(
			`**4 weeks out:** Create a revision timetable covering all subjects. Prioritise topics by difficulty × exam weight. Start with the hardest material while energy and time are abundant.`
		);
		narrative.push(
			`**2 weeks out:** Switch to active recall — practice papers under timed conditions. After each paper, analyse mistakes by category (knowledge gap? careless error? time pressure?). Focus revision on knowledge gaps.`
		);
		narrative.push(
			`**1 week out:** Review only. No new material. Focus on areas flagged in practice papers. Begin relaxation routines: 10 minutes of deep breathing or meditation before bed.`
		);
		narrative.push(
			`**Day before:** Light review of key formulas/quotes only. No cramming — it increases anxiety without improving recall. Prepare all materials (pens, calculator, water). Early bedtime.`
		);
		narrative.push(
			`**Day of:** Wake early. Eat breakfast. Review one confidence-boosting page of notes. Arrive 15 minutes early. Deep breathing before the exam starts. Read the whole paper before writing. Start with the question you feel most confident about.`
		);
	} else {
		narrative.push(
			`${studentName}'s steady emotional profile means they handle exam pressure well. The risk is complacency — feeling calm can mask under-preparation. Here is a preparation approach that maintains productive urgency:`
		);
		narrative.push(
			`**4 weeks out:** Create a revision timetable. Be honest about which subjects need the most work — calm students sometimes avoid facing their weak areas.`
		);
		narrative.push(
			`**2 weeks out:** Practice papers under exam conditions (timed, no notes). Score yourself honestly. The gap between what you know and what you can produce under pressure is often larger than expected.`
		);
		narrative.push(
			`**1 week out:** Targeted revision based on practice paper results. Focus on converting "I sort of know this" into "I can definitely write about this under pressure."`
		);
		narrative.push(
			`**Day before:** Review key material, prepare all equipment, get adequate sleep. No need for special anxiety management — just ensure preparation is genuinely complete.`
		);
	}

	researchNotes.push({
		text: 'Practice testing under exam conditions is the single most effective revision strategy, outperforming re-reading, highlighting, and note-taking by a factor of 2-3x (Roediger & Karpicke, 2006).',
		topic: 'Exam preparation',
	});

	// ─── Weekly Schedule ─────────────────────────────────────────────────────────
	narrative.push('\n### Weekly Schedule Template');

	if (cScore >= 3.5) {
		narrative.push(
			`${studentName}'s high conscientiousness means they'll actually follow a schedule. Build on this strength with a detailed weekly plan:`
		);
	} else {
		narrative.push(
			`A consistent weekly rhythm is especially important for ${studentName}, as it provides the external structure that compensates for lower natural discipline. Start simple and build up:`
		);
	}

	narrative.push(
		`**Monday-Friday after school:** ${eScore >= 3.5 ? '30-minute break (emotional recovery), then 1-hour focused study block. No devices during study.' : '15-minute break, then 1-1.5 hour focused study block. Tackle the hardest subject first while energy is highest.'}`
	);
	narrative.push(
		`**Evenings:** ${cScore >= 3.5 ? 'Optional 30-minute review of the day\'s notes. This "same-day review" dramatically improves retention.' : 'Light review only — 15 minutes maximum. The goal is maintaining contact with material, not marathon sessions.'}`
	);
	narrative.push(
		`**Weekend:** ${oScore >= 3.5 ? 'Saturday morning: 2-hour deep work block for creative/project work. Sunday: review week\'s material + plan next week.' : 'Saturday: 1.5-hour study block on the week\'s weakest subject. Sunday: organise materials, plan the week ahead, light review.'}`
	);

	// ─── What NOT To Do ──────────────────────────────────────────────────────────
	narrative.push('\n### What NOT To Do');

	const antiPatterns: string[] = [];
	if (xScore < 2.5) {
		antiPatterns.push(`**Don't force group study.** ${studentName}'s introversion means collaborative sessions drain energy faster than solo work. Limit group sessions to once per week, maximum 90 minutes.`);
	}
	if (cScore < 2.5) {
		antiPatterns.push(`**Don't rely on motivation.** Motivation is unreliable. Build habits instead — same time, same place, same subject. Make starting easy and stopping hard.`);
	}
	if (eScore >= 3.5) {
		antiPatterns.push(`**Don't study immediately before bed.** Late-night revision increases anxiety and disrupts sleep. Set a "study curfew" — all academic work stops 1 hour before bedtime.`);
	}
	if (oScore >= 3.5) {
		antiPatterns.push(`**Don't follow every tangent.** ${studentName}'s curiosity is a strength, but going down rabbit holes during revision wastes time. Jot interesting tangents in a "explore later" notebook and return to the syllabus.`);
	}
	if (cScore >= 4.0) {
		antiPatterns.push(`**Don't over-prepare.** ${studentName}'s perfectionism may drive excessive revision. Practice recognising "good enough" — the last 5% of polish rarely changes the grade.`);
	}

	if (antiPatterns.length === 0) {
		antiPatterns.push(`**Don't re-read passively.** It feels productive but produces minimal retention. Active recall is 3x more effective.`);
		antiPatterns.push(`**Don't study in bed.** Beds should mean sleep. Study at a desk or table to create a mental separation between work and rest.`);
	}

	antiPatterns.forEach(p => narrative.push(p));

	return {
		narrative,
		keyFindings,
		researchNotes,
		scenarios: [],
		crossReferences: [
			{ targetSection: 'learning-profile', text: 'Based on the learning style analysis in Section 3.' },
			{ targetSection: 'action-plan', text: 'See Section 11 for the prioritised action plan.' },
		],
		actions: [],
	};
}
