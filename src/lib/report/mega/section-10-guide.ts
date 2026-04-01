
/**
 * Mega Section 10: Teacher & Parent Guide
 * Generates ~5 pages: teacher strategies, parent strategies, tutor matching.
 */
import { DIM_NAMES, classifyLevel, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding } from '../mega-sections';
import type { CrossRefResult } from '../cross-reference-engine';
import { pickOpener, pickBridge, renderInteractionCallout, renderInteractionAction, pickInteractionsForSection } from '../prose-variety';

export function generateGuideMega(
	dimensions: DimensionsMap,
	studentName: string,
	crossRefResult: CrossRefResult | null,
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
		`${pickOpener(studentName, 10)} — this section provides tailored strategies for the three groups of adults who most influence ${studentName}'s academic journey: teachers, parents, and tutors. Each set of recommendations is calibrated to ${studentName}'s specific personality profile — not generic advice, but strategies that work for a student with exactly these traits.`
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
	narrative.push(pickBridge(studentName, 10, 1, 'what parents can do at home'));
	narrative.push('\n### For Parents');

	narrative.push(`${pickOpener(studentName, 17)} what follows are parent strategies calibrated specifically to ${studentName}'s profile — not generic parenting advice, but tactics that work for a student with this exact combination of traits.`);

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
	narrative.push('\n#### Conversation Scripts');
	narrative.push(
		`How you talk to ${studentName} about school matters as much as the advice you give. Use these scripts to navigate common challenges based on their specific personality profile.`
	);

	if (eScore >= 3.5) {
		narrative.push('\n**When they are overwhelmed by a big task:**');
		narrative.push(`*Parent:* "I can see you're feeling really stressed about this assignment. It looks like a lot to handle at once."`);
		narrative.push(`*Student:* "It's impossible. I'll never finish it."`);
		narrative.push(`*Parent:* "I hear that. Let's just look at the first page together. We don't have to do it, let's just see what the first step is."`);
		narrative.push(`**Why it works:** You validated the emotion (High Emotionality) before moving to the solution.`);
	}

	if (cScore < 2.5) {
		narrative.push('\n**When they are procrastinating:**');
		narrative.push(`*Parent:* "${studentName.split(' ')[0]}, I noticed the science project is due Friday and you haven't started. What's the plan for getting the research done?"`);
		narrative.push(`*Student:* "I'll do it later. I've got time."`);
		narrative.push(`*Parent:* "I'm worried 'later' will turn into a late night on Thursday. Let's set a timer for 15 minutes now just to get the tabs open. If you want to stop after 15 minutes, you can."`);
		narrative.push(`**Why it works:** You provided external structure (Low Conscientiousness) and a "low friction" entry point.`);
	}

	if (oScore >= 3.5 && cScore < 3.0) {
		narrative.push('\n**When they have a "great idea" but no follow-through:**');
		narrative.push(`*Parent:* "That's a fascinating angle for your history essay! How are you going to make sure you have time to actually write the conclusion?"`);
		narrative.push(`*Student:* "I'm still researching the first part, it's so interesting."`);
		narrative.push(`*Parent:* "It's clearly a great topic. To make sure the teacher sees how much you know, let's set a 'pencils down' time for research so you have at least two days for the writing."`);
		narrative.push(`**Why it works:** You praised the curiosity (High Openness) while enforcing the necessary discipline (Low Conscientiousness).`);
	}

	if (cScore >= 4.0) {
		narrative.push('\n**When they are being too hard on themselves:**');
		narrative.push(`*Parent:* "I'm impressed by how much effort you've put into this. But I'm worried you're spending too much time on the details and not enough time resting."`);
		narrative.push(`*Student:* "It has to be perfect or it's not worth doing."`);
		narrative.push(`*Parent:* "High standards are a strength, but burnout is a real risk. Let's decide together what 'good enough' looks like for this specific task so you can get to bed by 10."`);
		narrative.push(`**Why it works:** You acknowledged their drive (High Conscientiousness) while setting a boundary for their wellbeing.`);
	}

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

	// ─── Conversation Scripts ─────────────────────────────────────────────────────
	narrative.push(pickBridge(studentName, 10, 2, 'navigating difficult conversations'));
	narrative.push('\n### Conversation Scripts for Difficult Moments');

	narrative.push(
		`Some of the most impactful moments in ${studentName}'s academic journey will come from conversations — not lessons. Here are scripts for common challenging situations, calibrated to ${studentName}'s personality:`
	);

	// After a bad grade
	if (eScore >= 3.5) {
		narrative.push(
			`**After a disappointing result:** "I can see you're upset about this grade, and that's okay — it means you care. Let's look at what happened together. Can you show me the paper?" Then: identify 2 things they did well before discussing what to improve. End with: "What's one thing you'd do differently next time?" This gives ${studentName} emotional validation first, then structures the learning without dwelling on the failure. Avoid: "You should have studied harder" — they already feel bad enough, and shame reduces future effort.`
		);
	} else {
		narrative.push(
			`**After a disappointing result:** "This wasn't the result you wanted. Let's figure out why. Was it preparation, understanding, or exam technique?" Be direct and problem-solving oriented. ${studentName} doesn't need emotional cushioning — they want to understand what went wrong and fix it. End with a concrete action: "For the next test, we'll try [specific strategy] and see if it helps."`
		);
	}

	// About effort
	if (cScore < 2.5) {
		narrative.push(
			`**About effort and consistency:** Avoid "You're so smart, you just don't try." This frames effort as a character flaw and creates a fixed mindset ("I'm the kind of person who doesn't try"). Instead: "I notice you do your best work when [specific condition: you study at the desk, you start early, you work with Sam]. How can we create more of those conditions?" This shifts the conversation from willpower (internal, unchangeable) to environment (external, changeable).`
		);
	} else if (cScore >= 3.5 && (C?.facets?.perfectionism?.score || 0) >= 4.0) {
		narrative.push(
			`**About perfectionism:** "I notice you spent 4 hours on that 30-minute assignment. Your work is excellent — but what did you not do during those 4 hours? Let's talk about how to match your effort to the task's importance. A 5% assignment doesn't need 95% of your effort." Help ${studentName} build a calibration system: before starting any task, decide how much time it deserves based on its weight.`
		);
	}

	// About subject choices
	narrative.push(
		`**About subject or career choices:** "What subjects make you lose track of time? What would you do if grades didn't matter?" These questions bypass the "should" thinking that parents and students often get trapped in and reveal genuine interests. Personality data shows ${studentName}'s strongest alignment is with subjects that require ${oScore >= 3.5 ? 'creative thinking and exploration' : cScore >= 3.5 ? 'methodical, structured approaches' : xScore >= 3.5 ? 'social interaction and verbal expression' : 'practical, applied problem-solving'}. Use this as a starting point for discussion, not a prescription.`
	);

	// ─── NEW CONVERSATION SCRIPTS ────────────────────────────────────────────────

	// Script 1: After a bad grade (always fires, framed by E score)
	narrative.push('\n**After a bad grade:**');
	if (eScore >= 3.5) {
		narrative.push(`*Parent:* "I can see you're upset — this clearly matters to you, and that's worth acknowledging."`);
		narrative.push(`*Student:* "I studied so hard. I don't understand what went wrong."`);
		narrative.push(`*Parent:* "Let's look at the paper together. First, show me two things you got right. Then let's find one thing to improve for next time."`);
		narrative.push(`**Why it works:** Validating the emotion (High Emotionality) before moving to analysis means ${studentName} is receptive rather than defensive. Finding two positives before one negative respects their emotional sensitivity and sustains motivation.`);
	} else {
		narrative.push(`*Parent:* "Okay — let's figure out why. Was it preparation, understanding of the material, or exam technique?"`);
		narrative.push(`*Student:* "I don't know. I thought I knew it."`);
		narrative.push(`*Parent:* "Let's go through the paper section by section. We'll find the pattern."`);
		narrative.push(`**Why it works:** ${studentName} doesn't need emotional cushioning — they respond to direct problem-solving. Framing as a diagnostic (preparation vs. understanding vs. technique) gives them a concrete framework for improvement.`);
	}

	// Script 2: About effort & consistency (fires when C < 2.5 OR perfectionism >= 4.0)
	const perfScore = C?.facets?.perfectionism?.score ?? 0;
	if (cScore < 2.5 || (cScore >= 4.0 && perfScore >= 4.0)) {
		narrative.push('\n**About effort and consistency:**');
		if (cScore < 2.5) {
			narrative.push(`*Parent:* "I notice you do your best work when you're at the kitchen table with your phone in the other room. That's not a fluke — that's your brain working with better conditions."`);
			narrative.push(`*Student:* "I just can't get started when I'm in my room."`);
			narrative.push(`*Parent:* "That makes sense. What would make it easier to get started tonight? Do you want me to sit nearby while you do the first 10 minutes?"`);
			narrative.push(`**Why it works:** This reframes effort as an environmental problem — not a character flaw. ${studentName}'s challenge with consistency (Low Conscientiousness) responds to structural support, not willpower pep talks.`);
		} else {
			narrative.push(`*Parent:* "I'm proud of how seriously you take your work. But I noticed you spent four hours on a 30-minute assignment last night."`);
			narrative.push(`*Student:* "I wanted it to be perfect."`);
			narrative.push(`*Parent:* "High standards are a genuine strength. Let's build a system: before you start, we'll decide together how much time this assignment deserves based on what it's worth. Does that help?"`);
			narrative.push(`**Why it works:** Acknowledges ${studentName}'s drive (High Conscientiousness, High Perfectionism) as a strength while introducing a calibration tool — effort proportional to task weight — that prevents the burnout that overwork creates.`);
		}
	}

	// Script 3: About subject choices (always fires, framed by O score)
	narrative.push('\n**About subject or career direction:**');
	narrative.push(`*Parent:* "What subjects make you completely lose track of time? And — if grades didn't matter at all — what would you actually want to study?"`);
	narrative.push(`*Student:* "${oScore >= 3.5 ? '"I love when we get to go off-script and explore something unusual."' : '"Honestly, I want something that leads to a clear job."'}"`);
	if (oScore >= 3.5) {
		narrative.push(`*Parent:* "That curiosity is a real asset. Let's look at what careers let you keep exploring — research, design, writing, strategy. What's interesting about those?"`);
		narrative.push(`**Why it works:** ${studentName}'s high Openness means abstract and creative fields are genuinely energising. Framing the conversation as exploration (not decision-making) keeps the dialogue open and honest.`);
	} else {
		narrative.push(`*Parent:* "That's completely valid. Knowing what you want from a career is actually really useful information. What kinds of problems do you enjoy solving?"`);
		narrative.push(`**Why it works:** ${studentName}'s more practical orientation is a strength, not a limitation. Validating their preference for clear outcomes makes them more willing to explore options rather than shutting down.`);
	}

	// Script 4: When they want to quit an activity (fires when O >= 3.5 OR X >= 3.5)
	if (oScore >= 3.5 || xScore >= 3.5) {
		narrative.push('\n**When they want to quit an activity:**');
		if (oScore >= 3.5) {
			narrative.push(`*Parent:* "I hear that you're bored with debating right now. Can you tell me more about what's lost its spark?"`);
			narrative.push(`*Student:* "It feels like we do the same things over and over. There's nothing new."`);
			narrative.push(`*Parent:* "I understand that. Here's a thought: let's set a checkpoint — stick with it until the regional finals, and then we'll reassess together. If it still feels the same, we'll make a change. Deal?"`);
			narrative.push(`**Why it works:** ${studentName}'s high Openness means boredom is a real signal, not laziness. Acknowledging it as valid while introducing a checkpoint prevents impulsive quitting while still respecting their need for novelty.`);
		} else {
			narrative.push(`*Parent:* "It sounds like the social side of this has changed. What's shifted?"`);
			narrative.push(`*Student:* "My friends aren't doing it anymore. I don't really know anyone there now."`);
			narrative.push(`*Parent:* "The social connection was a big part of what made it work for you. That makes sense. Is there a version of this — or something else — that you could do with people you like?"`);
			narrative.push(`**Why it works:** ${studentName}'s high Extraversion means social motivation is a genuine driver of commitment. Rather than pushing through alone, finding a social alternative preserves the habit while honouring how ${studentName} actually works.`);
		}
	}

	// Script 5: About social struggles (fires when X < 2.5 OR A < 2.5)
	if (xScore < 2.5 || aScore < 2.5) {
		narrative.push('\n**About social struggles:**');
		if (xScore < 2.5) {
			narrative.push(`*Parent:* "I notice you come home from big social events looking drained. That's not unusual — some people genuinely recharge alone."`);
			narrative.push(`*Student:* "Everyone else seems to love those things. I feel weird for not wanting to go."`);
			narrative.push(`*Parent:* "It's actually a well-studied personality trait — not a flaw. The question isn't 'how do I become more social?' It's 'do I have enough of the right connections?' Do you feel like you do?"`);
			narrative.push(`**Why it works:** Normalising introversion as a trait rather than a problem reduces shame and helps ${studentName} focus on quality of connection rather than quantity — which is what actually matters for their wellbeing.`);
		} else {
			narrative.push(`*Parent:* "You mentioned there was a conflict with [friend/classmate] today. Can you tell me what happened from your side?"`);
			narrative.push(`*Student:* "I just said what I thought. Apparently that was wrong."`);
			narrative.push(`*Parent:* "You were being honest, which is actually a quality I respect. The tricky part is that different people need more softening around difficult truths. Would it help to practise some ways of saying the same thing that might land better?"`);
			narrative.push(`**Why it works:** ${studentName}'s lower Agreeableness reflects a genuine preference for intellectual honesty — not malice. Framing it as a communication skill (not a personality defect) keeps the relationship strong while building practical tools.`);
		}
	}

	// ─── TEACHER-REALITY TABLE ────────────────────────────────────────────────────

	narrative.push('\n### What Teachers See vs What\'s Really Happening');
	narrative.push(`This table translates ${studentName}'s visible classroom behaviour into the personality drivers behind it. Share it with teachers before or during a parent-teacher meeting.`);
	narrative.push('| What Teachers See | What\'s Actually Happening | Personality Driver |');
	narrative.push('|---|---|---|');

	if (xScore < 2.5) {
		if (eScore >= 3.5) {
			narrative.push(`| Doesn't participate in class discussion | Introverted and anxious about public errors — they are listening intently but need processing time | Low Extraversion + High Emotionality |`);
		} else {
			narrative.push(`| Doesn't participate in class discussion | Introverted — prefers to process internally and contribute in writing or small groups | Low Extraversion |`);
		}
	}

	if (cScore < 2.5) {
		narrative.push(`| Lazy, doesn't try, forgets assignments | Executive function gap — initiation and working memory are genuinely harder; it's not a motivation problem | Low Conscientiousness |`);
	}

	if (oScore >= 3.5 && cScore < 2.5) {
		narrative.push(`| Distracted, off-task, drifting | High curiosity constantly pulling attention to tangents — needs novelty and challenge to stay anchored | High Openness + Low Conscientiousness |`);
	}

	if (cScore >= 4.0 && eScore >= 3.5) {
		narrative.push(`| Perfect student — no concerns | May be burning out internally; high standards + emotional sensitivity = stress carried silently and invisibly | High Conscientiousness + High Emotionality |`);
	}

	if (aScore < 2.5) {
		narrative.push(`| Argumentative, difficult, challenging | Values intellectual honesty and can't comfortably agree with things they believe are wrong — not personal | Low Agreeableness |`);
	}

	if (xScore >= 4.0 && cScore < 2.5) {
		narrative.push(`| Class clown, disruptive, seeking attention | High social energy with no structured outlet — needs a role (discussion leader, group organiser) not a reprimand | High Extraversion + Low Conscientiousness |`);
	}

	if (eScore < 2.5 && cScore < 2.5) {
		narrative.push(`| Doesn't seem to care about grades | Unmoved by external validation — needs intrinsic connection to the work, not motivational speeches about results | Low Emotionality + Low Conscientiousness |`);
	}

	if (xScore < 2.5 && aScore < 2.5) {
		narrative.push(`| Anti-social, unfriendly, loner | Strongly prefers depth over breadth — has genuine connections but doesn't perform social warmth for its own sake | Low Extraversion + Low Agreeableness |`);
	}

	// ─── INTERACTION CALLOUTS ─────────────────────────────────────────────────────

	const guideInteractions = pickInteractionsForSection(
		crossRefResult?.interactions ?? [], 10, 2
	);
	guideInteractions.forEach((i, idx) => {
		narrative.push(renderInteractionCallout(i, 10 + idx));
		narrative.push(renderInteractionAction(i, idx));
	});

	// Parent-teacher meeting guide
	narrative.push(pickBridge(studentName, 10, 4, 'parent-teacher meetings'));
	narrative.push('\n### Parent-Teacher Meeting Guide');

	narrative.push(
		`When meeting with ${studentName}'s teachers, bring a copy of this report's Executive Summary and Teacher section. Share ${studentName}'s personality profile and ask these questions:`
	);
	narrative.push(`- "How does ${studentName} participate in your class? Is it consistent with the personality profile described here?"`);
	narrative.push(`- "What classroom strategies have you found work well with ${studentName}?"`);
	narrative.push(`- "Are there specific situations where ${studentName} struggles that we haven't identified?"`);
	narrative.push(`- "How can we better coordinate between home and school to support ${studentName}'s learning?"`);
	narrative.push(
		`The goal is not to hand the report to teachers as a set of demands, but to open a dialogue about how ${studentName}'s personality shapes their classroom experience. Teachers who understand a student's personality can adapt their approach — seating, participation format, feedback style — in ways that dramatically improve engagement and performance.`
	);

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
