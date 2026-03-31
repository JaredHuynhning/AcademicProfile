/**
 * Mega Section 4: Academic Character & Drive
 * Generates ~4 pages: work ethic, persistence, goal orientation, motivation deep dive.
 */
import { classifyLevel, scorePercentile, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';
import { StudyProfile, LearnerProfile } from '../../types';

export function generateAcademicCharacterMega(
	dimensions: DimensionsMap,
	studyProfile: StudyProfile | null,
	learnerProfile: LearnerProfile | null,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	const C = dimensions.C;
	const H = dimensions.H;
	const E = dimensions.E;
	const A = dimensions.A;
	const O = dimensions.O;

	const cScore = C?.score || 3.0;
	const hScore = H?.score || 3.0;
	const eScore = E?.score || 3.0;
	const aScore = A?.score || 3.0;
	const oScore = O?.score || 3.0;

	const cFacets = C?.facets || {};
	const diligence = cFacets.diligence?.score || 3.0;
	const org = cFacets.organization?.score || 3.0;
	const perfectionism = cFacets.perfectionism?.score || 3.0;
	const prudence = cFacets.prudence?.score || 3.0;

	narrative.push(
		`Academic character is the set of personality-driven behaviours that determine how ${studentName} approaches their schoolwork day after day. It's not about intelligence — it's about what they do with their intelligence. Research consistently shows that character traits like persistence, organisation, and self-regulation account for more of the variance in academic achievement than cognitive ability alone (Duckworth et al., 2007).`
	);

	narrative.push(
		`The concept of "academic character" encompasses four interrelated components: work ethic (how hard and consistently a student works), persistence (how they handle difficulty and setbacks), goal orientation (what success means to them), and self-regulation (how well they manage their own learning process). Each component is measurable through personality data, and each is developable through targeted intervention. This section analyses all four for ${studentName}, providing both a diagnostic understanding and actionable recommendations.`
	);

	narrative.push(
		`Crucially, academic character is not fixed. Unlike IQ, which is relatively stable, character traits develop substantially through adolescence and early adulthood. A student who appears "lazy" at 14 may develop exceptional discipline by 18 — with the right environment, scaffolding, and motivation. The goal is not to label ${studentName}, but to understand their current starting point and accelerate the natural development of productive academic habits.`
	);

	// ─── Work Ethic ──────────────────────────────────────────────────────────────
	narrative.push('\n### Work Ethic');

	if (cScore >= 3.5) {
		narrative.push(
			`${studentName}'s work ethic is a genuine competitive advantage. With a Conscientiousness score of ${cScore.toFixed(1)}/5 (${scorePercentile(cScore)}th percentile), they are naturally inclined to put in consistent effort, meet deadlines, and finish what they start. ${diligence >= 3.5 ? `Their diligence score of ${diligence.toFixed(1)}/5 confirms they push through even when work becomes tedious — a critical trait for exam revision and long-term projects.` : ''}`
		);
		narrative.push(
			`Research shows that conscientiousness has a 0.2-0.3 correlation with GPA across meta-analyses — equivalent to roughly one grade band difference between a highly conscientious student and a less conscientious peer of equal intelligence (Poropat, 2009). ${studentName}'s high score places them firmly in the group of students who consistently convert potential into achievement.`
		);
		if (perfectionism >= 4.0) {
			narrative.push(
				`One caution: ${studentName}'s perfectionism score of ${perfectionism.toFixed(1)}/5 is notably high. While this drives quality work, it can also cause procrastination ("if I can't do it perfectly, I won't start"), excessive time spent on individual assignments, and difficulty prioritising across subjects. Teaching ${studentName} to distinguish between high-stakes work (worth polishing) and routine tasks (worth completing efficiently) is an important skill.`
			);
			keyFindings.push({ title: 'Perfectionism Risk', text: `${studentName}'s perfectionism (${perfectionism.toFixed(1)}/5) may cause procrastination and over-investment in individual tasks. Learning to calibrate effort to importance is a priority.`, type: 'warning', color: '#f59e0b' });
		}
	} else if (cScore < 2.5) {
		narrative.push(
			`${studentName}'s natural work ethic is an area for development. With a Conscientiousness score of ${cScore.toFixed(1)}/5 (${scorePercentile(cScore)}th percentile), sustained effort, organisation, and follow-through do not come naturally. This does NOT mean ${studentName} is lazy — it means they need more external support to translate their abilities into consistent academic output.`
		);
		narrative.push(
			`The most effective intervention for lower conscientiousness is environmental design: creating structures that make productive behaviour the path of least resistance. This means designated study spaces (not the bedroom), visible daily task lists, accountability check-ins, and removing digital distractions during study blocks. Research shows that external structure can close up to 80% of the productivity gap between low and high conscientiousness students (Zimmerman, 2002).`
		);
		keyFindings.push({ title: 'Structure Is Key', text: `${studentName}'s lower conscientiousness (${cScore.toFixed(1)}/5) means external structure — planners, check-ins, distraction-free zones — is essential for unlocking their potential.`, type: 'barrier', color: '#f59e0b' });
	} else {
		narrative.push(
			`${studentName}'s work ethic is in the moderate range (Conscientiousness ${cScore.toFixed(1)}/5), meaning they can sustain effort when motivated but may drift on tasks that feel unimportant or boring. The key is not increasing effort across the board, but strategically directing effort where it matters most. Help ${studentName} identify their "high-leverage" subjects and tasks, then build routines around those.`
		);
	}

	researchNotes.push({
		text: 'Conscientiousness is a better predictor of academic achievement than intelligence for most students. The effect is strongest in secondary school, where self-regulation matters more than raw ability (Poropat, 2009).',
		topic: 'Work ethic',
	});

	// ─── Persistence & Grit ──────────────────────────────────────────────────────
	narrative.push('\n### Persistence & Grit');

	const gritData = learnerProfile?.grit;
	if (gritData) {
		const overall = gritData.overall?.score || 3.0;
		const perseverance = gritData.perseverance?.score || 3.0;
		const consistency = gritData.consistency?.score || 3.0;

		narrative.push(
			`Grit — the combination of passion and perseverance for long-term goals — is one of the strongest predictors of who achieves their potential (Duckworth, 2016). ${studentName}'s overall grit score is ${overall.toFixed(1)}/5, with perseverance at ${perseverance.toFixed(1)}/5 and consistency of interest at ${consistency.toFixed(1)}/5.`
		);

		if (perseverance >= 3.5 && consistency < 2.5) {
			narrative.push(
				`An interesting split: ${studentName} can push through difficulty (high perseverance) but frequently changes direction (low consistency). This pattern suggests they have the stamina for hard work but struggle to commit to a single path. They may start many projects without finishing them, or cycle through interests rapidly. Helping them choose fewer commitments and see them through to completion builds the consistency muscle.`
			);
		} else if (perseverance < 2.5 && consistency >= 3.5) {
			narrative.push(
				`Another interesting pattern: ${studentName} is consistent in their interests (they know what they like) but gives up too easily when work becomes difficult. The challenge here is building tolerance for frustration. Teaching ${studentName} that struggle is a normal part of learning — not a sign they should quit — is the most valuable mindset shift.`
			);
		} else if (overall >= 3.5) {
			narrative.push(
				`${studentName}'s grit profile is strong across both components. They stick with goals over time AND push through difficulty when it arises. This combination predicts success not just in school but in virtually every domain of adult life.`
			);
			keyFindings.push({ title: 'Strong Grit', text: `${studentName}'s grit score of ${overall.toFixed(1)}/5 combines perseverance with consistency — a powerful predictor of long-term achievement.`, type: 'strength', color: '#22c55e' });
		} else if (overall < 2.5) {
			narrative.push(
				`${studentName}'s grit score suggests they need support in both sustaining effort and maintaining consistent interests. This is not a fixed trait — grit develops through experience, especially when students encounter challenges they care about enough to push through. Finding that "thing they care about" is the first step.`
			);
		}
	} else {
		// Infer from personality
		if (cScore >= 3.5 && eScore < 3.0) {
			narrative.push(
				`Based on ${studentName}'s personality, they likely demonstrate good persistence. High Conscientiousness provides discipline for sustained effort, while lower Emotionality means setbacks are taken in stride rather than felt as crushing defeats. This combination predicts a student who bounces back from poor results and maintains steady effort.`
			);
		} else if (cScore < 2.5 && eScore >= 3.5) {
			narrative.push(
				`${studentName}'s personality suggests vulnerability in persistence. Lower Conscientiousness reduces natural staying power, while higher Emotionality means setbacks feel more painful and discouraging. They may need extra encouragement after poor results and help reframing failure as learning rather than evidence of inadequacy.`
			);
		} else {
			narrative.push(
				`${studentName} likely shows moderate persistence — able to push through most challenges but vulnerable to giving up on tasks that combine difficulty with low interest. The key intervention is breaking daunting tasks into smaller, achievable steps that build momentum.`
			);
		}
	}

	// ─── Goal Orientation ────────────────────────────────────────────────────────
	narrative.push('\n### Goal Orientation');

	if (hScore < 2.5 && cScore >= 3.0) {
		narrative.push(
			`${studentName}'s profile suggests a **performance-oriented** approach to goals. They are motivated by outcomes — grades, rankings, recognition — and measure success by external markers. This drive can produce strong results but may also create anxiety about failure and reluctance to take academic risks (trying harder courses, asking "dumb" questions, experimenting with new approaches).`
		);
		narrative.push(
			`The research on goal orientation (Dweck, 2006) suggests that blending performance goals with mastery goals produces the best outcomes. Encourage ${studentName} to set process goals alongside outcome goals: not just "get an A" but "understand every practice problem well enough to explain it to someone else."`
		);
	} else if (oScore >= 3.5 && hScore >= 3.0) {
		narrative.push(
			`${studentName} appears to be **mastery-oriented** — they care about understanding deeply rather than just getting good grades. They are more interested in whether they truly "get it" than in how they rank against peers. Research shows mastery-oriented students develop deeper knowledge, are more resilient to setbacks, and maintain motivation longer (Dweck, 2006).`
		);
		narrative.push(
			`The potential downside is that mastery-oriented students may neglect strategic exam preparation in favour of genuine understanding. Help ${studentName} balance depth with breadth — deep understanding in their strongest subjects, strategic coverage in others.`
		);
	} else {
		narrative.push(
			`${studentName} shows a balanced goal orientation — they care about both understanding and outcomes. This flexibility means they can adapt their approach to different contexts: pursuing deep mastery in subjects they love, and strategic achievement in subjects they need to pass. This pragmatic balance serves most students well.`
		);
	}

	// ─── Self-Assessment Accuracy ────────────────────────────────────────────────
	narrative.push('\n### Self-Assessment & Self-Regulation');

	const selfReg = studyProfile?.selfRegulation;
	if (selfReg) {
		const efficacy = selfReg.selfEfficacy?.score || 3.0;
		const planning = selfReg.planning?.score || 3.0;
		const effort = selfReg.effortRegulation?.score || 3.0;

		narrative.push(
			`${studentName}'s self-regulation profile reveals how well they manage their own learning process. Self-efficacy (belief in their ability to succeed) is at ${efficacy.toFixed(1)}/5, planning at ${planning.toFixed(1)}/5, and effort regulation at ${effort.toFixed(1)}/5.`
		);

		if (efficacy >= 3.5) {
			narrative.push(
				`${studentName}'s strong self-efficacy means they believe they can succeed, which is one of the most powerful predictors of actual achievement (Bandura, 1997). Students who believe they can master material are more likely to persist through difficulty, use effective strategies, and recover from setbacks.`
			);
		} else if (efficacy < 2.5) {
			narrative.push(
				`${studentName}'s lower self-efficacy is a concern — they may not believe they can succeed, even when they objectively can. Low self-efficacy creates a self-fulfilling prophecy: "I can't do this" → reduced effort → poor results → "See, I told you I couldn't do it." Breaking this cycle requires small, undeniable wins — start with tasks just slightly above their current level, celebrate success, then incrementally increase difficulty.`
			);
			keyFindings.push({ title: 'Low Self-Efficacy', text: `${studentName} doubts their ability to succeed academically (${efficacy.toFixed(1)}/5). Building confidence through structured small wins is a priority.`, type: 'barrier', color: '#ef4444' });
		}
	} else {
		narrative.push(
			`Self-regulation — the ability to plan, monitor, and adjust one's own learning — is a skill that develops through adolescence. ${studentName}'s Conscientiousness score of ${cScore.toFixed(1)}/5 provides a reasonable proxy: ${cScore >= 3.5 ? 'they likely self-regulate well, planning ahead and monitoring their own progress.' : cScore < 2.5 ? 'they likely need support developing self-regulation strategies, such as weekly planning sessions and progress check-ins.' : 'they have moderate self-regulation that can be strengthened with targeted practice.'}`
		);
	}

	researchNotes.push({
		text: 'Self-efficacy is a stronger predictor of academic achievement than actual ability in many studies. Students who believe they can learn, do learn — regardless of starting point (Bandura, 1997).',
		topic: 'Self-regulation',
	});

	// ─── Intrinsic vs Extrinsic Motivation ───────────────────────────────────────
	narrative.push('\n### What Truly Drives This Student');

	narrative.push(
		`Understanding what genuinely motivates ${studentName} — not what adults think should motivate them — is the key to sustainable academic effort. Motivation research identifies four sources of drive: autonomy (choice and control), competence (getting better at things), relatedness (connection to people), and purpose (feeling that the work matters). ${studentName}'s personality profile suggests which of these sources is most powerful for them.`
	);

	if (hScore < 2.5 && cScore >= 3.0) {
		narrative.push(
			`${studentName} is driven by **achievement and recognition**. They want to be seen as successful, score highly, and receive tangible rewards. This is not shallow — it's a legitimate motivational profile that can produce exceptional results when channelled constructively. The strategy: make achievement visible. Grade trackers, personal bests, leaderboards, and explicit recognition for improvement all feed this drive. The risk: over-focus on grades at the expense of genuine learning. Balance achievement motivation with occasional "no grade" learning experiences that build intrinsic interest.`
		);
	} else if (oScore >= 3.5) {
		narrative.push(
			`${studentName} is driven by **curiosity and mastery**. They want to understand deeply, explore ideas, and feel intellectually stimulated. Grades are less motivating than the feeling of "getting it." The strategy: give them permission to go deep in subjects they love, connect boring material to interesting questions, and frame challenges as puzzles rather than obligations. The risk: neglecting subjects that don't spark curiosity. Help them see that mastery of even uninteresting material is a skill worth developing.`
		);
	} else if (cScore >= 3.5 && eScore < 3.0) {
		narrative.push(
			`${studentName} is driven by **competence and routine**. They find satisfaction in doing things well, consistently, and efficiently. Their motivation comes from the process itself — the daily rhythm of study, the steady accumulation of knowledge, the quiet pride of consistent effort. The strategy: build and maintain routines, set process goals ("study maths for 30 minutes daily") rather than outcome goals ("get an A in maths"), and celebrate consistency. The risk: rigidity. Help them adapt when routines need to change (new subjects, new teachers, exam periods).`
		);
	} else if (eScore >= 3.5 && hScore >= 3.0) {
		narrative.push(
			`${studentName} is driven by **relatedness and purpose**. They want to feel connected to others and believe their work matters beyond just grades. They study harder for teachers they respect, subjects they see as meaningful, and goals that align with their values. The strategy: build strong relationships with teachers, connect academic material to real-world impact, and frame studying as preparation for helping others. The risk: disengagement when relationships are weak or purposes unclear.`
		);
	} else {
		narrative.push(
			`${studentName}'s motivation profile is multifaceted — no single driver dominates. They respond to a mix of achievement, curiosity, routine, and connection depending on the context. This flexibility means they can be engaged by different approaches in different subjects: competition in maths, exploration in science, social connection in group projects, practical application in vocational subjects. The strategy: vary the motivational approach by subject and context rather than relying on a single technique.`
		);
	}

	narrative.push(
		`Whatever ${studentName}'s primary drive, one principle applies universally: motivation follows action, not the other way around. Waiting to "feel motivated" before starting is a trap that leads to chronic procrastination. Instead, commit to starting — even for just 5 minutes. Research consistently shows that motivation increases after beginning a task, not before (Baumeister & Tierney, 2011). The hardest part is the first minute.`
	);

	return {
		narrative,
		keyFindings,
		researchNotes,
		scenarios: [],
		crossReferences: [
			{ targetSection: 'study-playbook', text: 'These character traits directly shape the study strategies recommended in Section 5.' },
			{ targetSection: 'barriers', text: 'Character-based barriers are explored in detail in Section 7.' },
		],
		actions: [],
	};
}
