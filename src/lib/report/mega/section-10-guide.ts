// @ts-nocheck
/**
 * Mega Section 10: Teacher & Parent Guide
 * Generates ~5 pages: teacher strategies, parent strategies, tutor matching.
 */
import { DIM_NAMES, classifyLevel, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding } from '../mega-sections';

export function generateGuideMega(
	dimensions: DimensionsMap,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];

	const C = dimensions.C;
	const E = dimensions.E;
	const X = dimensions.X;
	const A = dimensions.A;
	const O = dimensions.O;
	const H = dimensions.H;

	const cScore = C?.score || 3.0;
	const eScore = E?.score || 3.0;
	const xScore = X?.score || 3.0;
	const aScore = A?.score || 3.0;
	const oScore = O?.score || 3.0;

	narrative.push(
		`This section provides tailored strategies for the three groups of adults who most influence ${studentName}'s academic journey: teachers, parents, and tutors. Each set of recommendations is calibrated to ${studentName}'s specific personality profile — not generic advice, but strategies that work for a student with exactly these traits.`
	);

	// ─── FOR TEACHERS ────────────────────────────────────────────────────────────
	narrative.push('\n### For Teachers');

	// Quick profile
	narrative.push('\n#### Quick Personality Profile');
	const profileBullets: string[] = [];
	if (cScore >= 3.5) profileBullets.push('Naturally organised and diligent — responds well to high expectations');
	if (cScore < 2.5) profileBullets.push('Needs external structure — clear deadlines, check-ins, and visible task lists');
	if (xScore >= 3.5) profileBullets.push('Socially confident — volunteers for discussions, presentations, and group leadership');
	if (xScore < 2.5) profileBullets.push('Introverted — prefers written participation and small group work over whole-class speaking');
	if (eScore >= 3.5) profileBullets.push('Emotionally sensitive — may need extra reassurance before exams and after setbacks');
	if (eScore < 2.5) profileBullets.push('Emotionally steady — handles pressure well but may not seek help when struggling');
	if (aScore >= 3.5) profileBullets.push('Cooperative and patient — works well in any group composition');
	if (aScore < 2.5) profileBullets.push('Direct and assertive — may challenge ideas forcefully but brings valuable critical thinking');
	if (oScore >= 3.5) profileBullets.push('Intellectually curious — thrives with open-ended tasks and exploration beyond the syllabus');
	if (oScore < 2.5) profileBullets.push('Practical-minded — prefers clear instructions and concrete, applied learning');

	profileBullets.forEach(b => narrative.push(`- ${b}`));

	// Feedback style
	narrative.push('\n#### Feedback Style');
	if (eScore >= 3.5) {
		narrative.push(
			`**Preferred:** Warm, encouraging feedback that acknowledges effort before identifying areas for improvement. Start with what's working, then gently guide toward what needs work. Written feedback may be processed more calmly than verbal feedback delivered in front of peers.`
		);
		narrative.push(
			`**Avoid:** Public criticism, sarcasm, or comparison to other students. ${studentName}'s emotional sensitivity means these approaches cause lasting damage to confidence and motivation.`
		);
	} else if (eScore < 2.5) {
		narrative.push(
			`**Preferred:** Direct, specific, actionable feedback. ${studentName} doesn't need emotional cushioning — they want to know exactly what to improve and how. "Your analysis in paragraph 3 was strong. Paragraph 1 needs a clearer thesis statement — here's what I mean.""`
		);
		narrative.push(
			`**Avoid:** Vague praise ("good job") without specifics. ${studentName} respects competence and will disengage from feedback that feels superficial.`
		);
	} else {
		narrative.push(
			`**Preferred:** Balanced, specific feedback. Acknowledge strengths and identify clear next steps. ${studentName} responds well to feedback that feels fair and actionable.`
		);
	}

	// Classroom strategies
	narrative.push('\n#### Classroom Accommodation Strategies');
	if (xScore < 2.5) {
		narrative.push(`- **Participation:** Offer written alternatives to verbal participation (exit tickets, online discussion boards). When calling on ${studentName}, give advance notice ("I'll ask you about this next").`);
		narrative.push(`- **Seating:** Allow choice of seat away from high-traffic areas. Avoid forcing them into the "participation" front row unless they choose it.`);
	}
	if (cScore < 2.5) {
		narrative.push(`- **Structure:** Provide clear written instructions, not just verbal. Break long assignments into milestones with intermediate deadlines. Check in weekly on progress.`);
		narrative.push(`- **Organisation:** Allow (or require) use of a planner. Provide assignment templates with clear sections to fill in.`);
	}
	if (eScore >= 3.5) {
		narrative.push(`- **Assessment:** Where possible, offer alternative assessment formats (oral exams, portfolios, projects) that reduce time-pressure anxiety. For timed exams, provide clear structure and time allocation guidance on the paper.`);
	}
	if (oScore >= 3.5) {
		narrative.push(`- **Extension:** Provide optional enrichment for fast finishers. Allow creative approaches to standard assignments where the learning objective is still met.`);
	}
	if (oScore < 2.5) {
		narrative.push(`- **Scaffolding:** Provide worked examples and step-by-step guides. Connect abstract concepts to concrete, real-world applications.`);
	}

	// Warning signals
	narrative.push('\n#### Warning Signals');
	if (cScore < 2.5) {
		narrative.push(`- **Missing work:** More than 2 consecutive missed assignments signals the structure has broken down. Don't wait — re-establish the check-in routine immediately.`);
	}
	if (eScore >= 3.5) {
		narrative.push(`- **Withdrawal:** If ${studentName} becomes noticeably quiet or stops participating, they may be overwhelmed. A private check-in ("How are you going with the workload?") often reveals the issue.`);
	}
	if (aScore < 2.5) {
		narrative.push(`- **Conflict escalation:** If group work arguments become personal, intervene early. ${studentName}'s directness can cross from productive to destructive quickly. Redirect to task-focused language.`);
	}

	// ─── FOR PARENTS ─────────────────────────────────────────────────────────────
	narrative.push('\n### For Parents');

	narrative.push('\n#### Understanding Your Child');
	if (cScore >= 3.5 && eScore < 3.0) {
		narrative.push(
			`${studentName} is a self-driven student who doesn't need much external pressure. Your role is to provide encouragement, ensure they take breaks, and watch for perfectionism-driven burnout. Trust their process — micromanaging a conscientious student breeds resentment.`
		);
	} else if (cScore < 2.5) {
		narrative.push(
			`${studentName} needs more structure at home than they'll ever ask for. This isn't a reflection of your parenting — it's a personality trait that improves with age and scaffolding. Your role is to provide the structure (study space, routine, check-ins) that their brain hasn't yet internalised.`
		);
	} else {
		narrative.push(
			`${studentName} needs a balanced approach: enough structure to stay on track, enough autonomy to develop self-regulation. Weekly check-ins ("What's due this week? What's your plan?") provide accountability without smothering.`
		);
	}

	// Home environment
	narrative.push('\n#### Home Environment');
	narrative.push(`- **Study space:** ${xScore < 2.5 ? 'Quiet, private area — bedroom with door closed is fine if distractions are managed.' : 'A dedicated study area in a semi-public space (dining table, study nook) where they can focus but aren\'t completely isolated.'}`);
	narrative.push(`- **Devices:** ${cScore < 2.5 ? 'Phone should be physically removed during study time. Not on silent — REMOVED. App blockers if the phone must be nearby.' : 'Agree on a devices policy together. Trust but verify — self-regulation improves with practice.'}`);
	narrative.push(`- **Schedule:** ${cScore >= 3.5 ? 'Let them set their own schedule and hold them to it.' : 'Co-create a weekly schedule together. Post it visibly. Review and adjust weekly.'}`);

	// Homework help
	narrative.push('\n#### How To Help With Homework');
	if (eScore >= 3.5) {
		narrative.push(
			`When ${studentName} is frustrated: validate the emotion first ("I can see this is really frustrating"), THEN offer help. Jumping straight to solutions feels dismissive of their feelings. Once they feel heard, they're much more receptive to guidance.`
		);
	}
	if (cScore < 2.5) {
		narrative.push(
			`Help ${studentName} break tasks down before they start: "What are the 3 things you need to do for this assignment?" This executive function scaffolding is the single most valuable thing you can do. Don't do the work — teach the planning.`
		);
	}
	if (oScore >= 3.5) {
		narrative.push(
			`${studentName} may want to go deeper than the assignment requires. Allow this for subjects they love, but gently redirect when it's causing them to spend 3 hours on a 30-minute task. "That's fascinating — save it for later and finish the assignment first."`
		);
	}

	// Conversation guides
	narrative.push('\n#### Talking About Grades and Effort');
	narrative.push(
		`The most important thing parents can do is separate effort feedback from outcome feedback. "I noticed you studied consistently this week — that discipline will pay off" is more powerful than "Great grade!" because it reinforces the behaviour, not the result.`
	);
	if (eScore >= 3.5) {
		narrative.push(
			`After a disappointing result: "I know this isn't what you hoped for. Let's look at what you did well and what we can change for next time." Avoid: "You should have studied harder" — ${studentName} already feels bad enough, and shame reduces future effort.`
		);
	}
	if (cScore < 2.5) {
		narrative.push(
			`Avoid the "you're so smart, you just don't try" narrative. This frames effort as a character flaw rather than a skill to develop. Instead: "What would make it easier to get started?" The answer is usually environmental (remove distractions, break tasks smaller, study at a specific time).`
		);
	}

	// ─── FOR TUTORS ──────────────────────────────────────────────────────────────
	narrative.push('\n### For Tutors');

	narrative.push('\n#### Tutor Matching Criteria');
	const tutorTraits: string[] = [];
	if (eScore >= 3.5) tutorTraits.push('Patient and warm — ${studentName} needs to feel emotionally safe before they can learn effectively');
	if (eScore < 2.5) tutorTraits.push('Competent and direct — ${studentName} respects expertise over warmth');
	if (cScore < 2.5) tutorTraits.push('Structured and organised — the tutor needs to provide the planning framework');
	if (oScore >= 3.5) tutorTraits.push('Intellectually curious — can engage with ${studentName}\'s tangential questions without losing focus');
	if (xScore < 2.5) tutorTraits.push('Calm and low-key — a high-energy tutor will drain ${studentName} rather than energise them');

	if (tutorTraits.length > 0) {
		narrative.push(`Look for a tutor who is:`);
		tutorTraits.forEach(t => narrative.push(`- ${t.replace(/\$\{studentName\}/g, studentName)}`));
	}

	// Session structure
	narrative.push('\n#### Session Structure');
	narrative.push(`- **Duration:** ${eScore >= 3.5 || cScore < 2.5 ? '45-60 minutes (shorter, more focused sessions)' : '60-90 minutes (longer sessions with a mid-point break)'}`);
	narrative.push(`- **Format:** ${xScore < 2.5 ? 'One-on-one (not small group). Quiet setting.' : xScore >= 3.5 ? 'Small group (2-3 students) can work well if the group stays on task.' : 'Either one-on-one or small group depending on the subject.'}`);
	narrative.push(`- **Pacing:** ${cScore >= 3.5 ? 'Can handle challenging material quickly — push them.' : 'Build from easy wins to harder material. Confidence before challenge.'}`);

	return {
		narrative,
		keyFindings,
		researchNotes: [],
		scenarios: [],
		crossReferences: [
			{ targetSection: 'barriers', text: 'See Section 7 for the specific barriers these strategies address.' },
			{ targetSection: 'action-plan', text: 'See Section 11 for the prioritised action plan.' },
		],
		actions: [],
	};
}
