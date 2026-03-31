/**
 * Mega Section 5: Study Strategy Playbook
 * Generates ~6 pages: optimal methods, subject strategies, exam prep, weekly schedule, environment.
 */
import { classifyLevel, scorePercentile, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';
import { StudyProfile, LearnerProfile } from '../../types';
import type { CrossRefResult } from '../cross-reference-engine';
import { pickOpener, renderInteractionCallout, renderInteractionAction, filterByAudience, detectFacetSurprises } from '../prose-variety';

export function generateStudyPlaybookMega(
	dimensions: DimensionsMap,
	studyProfile: StudyProfile | null,
	learnerProfile: LearnerProfile | null,
	studentName: string,
	crossRefResult: CrossRefResult | null,
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
		`${pickOpener(studentName, 5)} a study profile that calls for specific, actionable strategies. This section translates their personality and learning data into recommendations calibrated to their unique combination of traits — not generic advice, but strategies that work for someone with exactly ${studentName}'s profile.`
	);

	// Inject relevant interactions
	const relevantInteractions = filterByAudience(
		crossRefResult?.interactions ?? [], ['parent', 'student']
	).slice(0, 2);
	relevantInteractions.forEach(interaction => {
		narrative.push(renderInteractionCallout(interaction));
		narrative.push(renderInteractionAction(interaction));
	});

	narrative.push(
		`The science of effective studying has advanced dramatically in the last two decades. Research from cognitive psychology has identified which techniques actually work (active recall, spaced repetition, interleaving) and which are popular but ineffective (re-reading, highlighting, summarising). What's less well-known is that personality type moderates which effective techniques are most sustainable for a given student. A technique that works brilliantly for a highly conscientious introvert may be abandoned within a week by an extraverted student with lower natural discipline. This section matches the right technique to the right personality.`
	);

	narrative.push(
		`The strategies below are ordered by expected fit for ${studentName}'s specific profile. Start with the highest-ranked methods and add others gradually. Trying to implement every technique at once is a common trap — it overwhelms the student and leads to abandoning everything. One well-implemented technique beats five poorly-implemented ones every time.`
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

	// Interleaving
	if (oScore >= 3.0) {
		methods.push({ name: 'Interleaving (mixed practice)', fit: 'Good', why: `${studentName}'s openness makes them comfortable switching between topics. Interleaving — practising different concepts in the same session rather than blocking by topic — improves long-term retention by 20-40% (Rohrer & Taylor, 2007). It feels harder in the moment but produces significantly better results.` });
	}

	// Elaborative interrogation
	methods.push({ name: 'Elaborative Interrogation ("Why?")', fit: 'Good', why: `For every fact or concept, ask "Why is this true?" and "How does this connect to what I already know?" This simple technique forces deeper processing and creates memory anchors that make recall easier. Research shows it's particularly effective for factual material in science and history (Dunlosky et al., 2013).` });

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

	// ─── Memory & Retention ──────────────────────────────────────────────────────
	narrative.push('\n### Memory & Retention Science');

	narrative.push(
		`${pickOpener(studentName, 15)} a memory profile shaped by both personality and study technique. Understanding the science of memory helps explain why some methods work and others don't, and why different personality types benefit from different approaches.`
	);

	narrative.push(
		`**The Forgetting Curve:** Without review, students forget approximately 70% of new information within 24 hours and 90% within a week (Ebbinghaus, 1885). The only effective countermeasure is spaced retrieval — actively recalling information at increasing intervals (1 day, 3 days, 7 days, 14 days, 30 days). ${cScore >= 3.5 ? `${studentName}'s high conscientiousness makes them an excellent candidate for spaced repetition systems like Anki — they'll actually maintain the daily review habit.` : `${studentName} will need external reminders to maintain a review schedule. Set phone alarms or tie review sessions to existing habits (review flashcards right after breakfast, right before bed).`}`
	);

	narrative.push(
		`**Encoding Depth:** Information encoded deeply (connected to existing knowledge, emotionally meaningful, actively processed) lasts longer than information encoded superficially (re-read, highlighted, copied). ${oScore >= 3.5 ? `${studentName}'s natural curiosity drives deep encoding — they ask "why?" and "how does this connect?" automatically. This is their biggest retention advantage.` : `${studentName} may default to surface encoding (re-reading, highlighting). Actively converting surface study into deep study — by asking "why is this true?" and "how does this connect to what I already know?" for each concept — dramatically improves retention.`}`
	);

	narrative.push(
		`**Sleep & Memory:** Sleep is not rest — it's active memory consolidation. During deep sleep, the brain replays the day's learning and transfers it from short-term to long-term storage. Research shows that students who study and then sleep retain 20-40% more than students who study the same material and stay awake (Walker, 2017). ${eScore >= 3.5 ? `For ${studentName}, who may experience pre-exam sleep disruption from anxiety, protecting sleep is doubly important. A consistent sleep routine, no screens 30 minutes before bed, and calming activities (reading fiction, light stretching) help ensure the brain gets the consolidation time it needs.` : `${studentName}'s steady emotions mean sleep is unlikely to be disrupted by academic anxiety. Focus on maintaining a consistent 8-9 hour sleep schedule and avoiding the temptation to sacrifice sleep for last-minute cramming — it's counterproductive.`}`
	);

	narrative.push(
		`**The Testing Effect:** Perhaps the most powerful memory finding in cognitive psychology: the act of retrieving information from memory strengthens that memory more than additional study of the same information (Roediger & Butler, 2011). Every time ${studentName} closes their notes and tries to recall what they learned, they're not just checking their memory — they're building it. A failed recall attempt (forgetting, then looking up the answer) strengthens memory MORE than a successful one. Struggling to remember is the brain's signal to prioritise that information for long-term storage.`
	);

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

	// ─── Study Environment Design ───────────────────────────────────────────────
	narrative.push('\n### Study Environment Design');

	narrative.push(
		`The physical environment where ${studentName} studies has a measurable impact on focus, retention, and productivity. Research on environmental psychology shows that mismatched study environments can reduce effective study time by 30-50% (Mehta & Zhu, 2012). Here is the optimal setup for ${studentName}'s personality:`
	);

	narrative.push(
		`**Physical space:** ${xScore < 2.5 ? `A private, enclosed space with the door closed. Background noise should be minimal — if others are home, noise-cancelling headphones with ambient sounds (rain, white noise) create an auditory boundary that signals "study mode." Avoid shared spaces like the kitchen table where interruptions are frequent.` : xScore >= 3.5 ? `A semi-public space like a dining table or library where ${studentName} can see others studying nearby. Complete isolation may feel depressing rather than focusing. A coffee shop or library with moderate ambient noise often works better than a silent bedroom. Study groups in the same space (each working on their own material, but together) combines social energy with individual focus.` : `A flexible space that can be either quiet or social depending on the task. Deep thinking (essay writing, complex maths) benefits from quiet isolation; review and recall benefit from low-level social presence.`}`
	);

	narrative.push(
		`**Digital environment:** ${cScore < 2.5 ? `Phone should be physically outside the room during study — not on silent, not face-down, but GONE. Research shows that the mere presence of a smartphone reduces cognitive capacity by ~10%, even when it's turned off (Ward et al., 2017). Use a dedicated tablet or laptop with social media blocked for study tasks. Consider an app blocker like Forest or Cold Turkey that makes breaking focus deliberately difficult.` : `${studentName}'s natural discipline allows them to manage digital distractions with reasonable guardrails. A "study mode" that silences non-essential notifications is sufficient. Allow access to learning apps and research tools while blocking social media during study sessions.`}`
	);

	narrative.push(
		`**Timing:** The optimal study session length for ${studentName} is ${cScore >= 3.5 && eScore < 3.0 ? '45-60 minutes with 10-minute breaks. Their high focus capacity and steady emotions allow longer sessions before fatigue sets in.' : eScore >= 3.5 ? '20-25 minutes with 5-minute breaks (Pomodoro technique). Shorter sessions prevent emotional fatigue and the anxiety build-up that comes from feeling "trapped" in study mode.' : '25-35 minutes with 5-minute breaks. This matches the average adolescent attention span while allowing enough time for meaningful engagement with material.'} After 3-4 sessions, take a longer break (20-30 minutes) that includes movement — a walk, stretching, or light exercise resets the brain for another focus cycle.`
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

	// ─── Facet Surprises ────────────────────────────────────────────────────────
	const surprises = detectFacetSurprises(dimensions, studentName);
	if (surprises.length > 0) {
		narrative.push('\n#### Hidden Details in the Data');
		surprises.slice(0, 2).forEach(s => narrative.push(s));
	}

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
