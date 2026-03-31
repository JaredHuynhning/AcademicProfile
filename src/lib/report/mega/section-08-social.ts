
/**
 * Mega Section 8: Social & Group Dynamics
 * Generates ~3 pages: collaboration style, conflict patterns, friendship, leadership, team role.
 */
import { DIM_NAMES, classifyLevel, scorePercentile, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';

export function generateSocialDynamicsMega(
	dimensions: DimensionsMap,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	const X = dimensions.X;
	const A = dimensions.A;
	const C = dimensions.C;
	const E = dimensions.E;
	const H = dimensions.H;
	const O = dimensions.O;

	const xScore = X?.score || 3.0;
	const aScore = A?.score || 3.0;
	const cScore = C?.score || 3.0;
	const oScore = O?.score || 3.0;
	const eScore = E?.score || 3.0;
	const hScore = H?.score || 3.0;

	narrative.push(
		`Academic success doesn't happen in isolation. How ${studentName} interacts with classmates, collaborates on projects, handles conflict, and builds relationships all affect their learning outcomes. This section maps their social patterns based on the personality traits that drive interpersonal behaviour.`
	);

	narrative.push(
		`Research on social learning shows that peer interaction accounts for approximately 20% of academic learning in secondary school (Hattie, 2009). Students who collaborate effectively don't just learn from teachers — they learn from each other through discussion, debate, explanation, and shared problem-solving. Understanding ${studentName}'s social style is essential for optimising this peer learning channel.`
	);

	// ─── Collaboration Style ─────────────────────────────────────────────────────
	narrative.push('\n### Collaboration Style');

	if (xScore >= 3.5 && aScore >= 3.5) {
		narrative.push(
			`${studentName} is a natural collaborator — socially energised (Extraversion ${xScore.toFixed(1)}/5) and cooperative (Agreeableness ${aScore.toFixed(1)}/5). They thrive in group settings, contribute actively, and maintain positive relationships with team members. This combination makes them one of the most sought-after group project partners.`
		);
		narrative.push(
			`In practice, ${studentName} likely takes on the "glue" role in groups — the person who keeps communication flowing, ensures everyone feels heard, and smooths over minor conflicts. Their social energy means they actively seek out collaboration rather than avoiding it.`
		);
	} else if (xScore < 2.5 && aScore < 2.5) {
		narrative.push(
			`${studentName} is an independent worker by nature — introverted (Extraversion ${xScore.toFixed(1)}/5) and direct (Agreeableness ${aScore.toFixed(1)}/5). They prefer solo work and may find group projects draining. When they do collaborate, they tend to be task-focused rather than relationship-focused.`
		);
		narrative.push(
			`This isn't a weakness — it's a style. ${studentName}'s strength in group work lies in individual contribution quality, not in social facilitation. The key is assigning them clearly defined tasks they can execute independently, then bringing work together. They contribute best when given space to think and produce on their own terms.`
		);
	} else if (xScore >= 3.5 && aScore < 2.5) {
		narrative.push(
			`${studentName} is socially confident but assertive — comfortable in groups (Extraversion ${xScore.toFixed(1)}/5) but not naturally accommodating (Agreeableness ${aScore.toFixed(1)}/5). They may dominate group discussions, push their ideas forcefully, and become impatient with less decisive teammates.`
		);
		narrative.push(
			`This profile can be highly effective in leadership roles where decision-making speed matters. The risk is steamrolling quieter group members. Coaching ${studentName} to actively invite input from others ("What does everyone else think?") before stating their position can transform this from a liability into leadership.`
		);
	} else if (xScore < 2.5 && aScore >= 3.5) {
		narrative.push(
			`${studentName} is quiet but cooperative — introverted (Extraversion ${xScore.toFixed(1)}/5) but genuinely caring about group harmony (Agreeableness ${aScore.toFixed(1)}/5). They contribute thoughtfully when given space, and their cooperative nature means they're easy to work with even though they're not loud about it.`
		);
		narrative.push(
			`The risk is being overlooked or having their contributions credited to more vocal team members. ${studentName} should practice explicitly claiming their work ("I researched the section on...") and ensuring their name is visibly attached to their contributions.`
		);
	} else {
		narrative.push(
			`${studentName} shows a balanced social style with moderate extraversion (${xScore.toFixed(1)}/5) and agreeableness (${aScore.toFixed(1)}/5). They can adapt to different group dynamics — contributing actively when needed, stepping back when appropriate. This flexibility is a genuine strength in varied team compositions.`
		);
	}

	researchNotes.push({
		text: 'Research on collaborative learning shows that personality composition matters as much as individual ability. Groups with a mix of high-extraversion (participation) and high-conscientiousness (task completion) members consistently produce better outcomes (Barrick et al., 1998).',
		topic: 'Collaboration',
	});

	// ─── Group Project Strategies ────────────────────────────────────────────────
	narrative.push('\n### Group Project Success Strategies');

	narrative.push(
		`Group projects are where personality differences create the most friction — and the most learning. Understanding ${studentName}'s collaborative tendencies allows parents and teachers to set up group work for success rather than hoping it works out. Here are specific strategies:`
	);

	if (xScore < 2.5) {
		narrative.push(
			`**For ${studentName} (introverted):** Request or negotiate defined individual roles within the group. ${studentName} contributes best when given a specific piece to own and execute independently, then bringing their finished work to the group. Avoid open-ended "let's brainstorm together" sessions — send an agenda in advance so ${studentName} can prepare their contributions. The ideal group size is 2-3 people, not 5-6.`
		);
	} else if (xScore >= 3.5 && aScore < 2.5) {
		narrative.push(
			`**For ${studentName} (assertive extrovert):** The main risk is dominating the group. ${studentName} should practice the "last to speak" technique: in discussions, let every other member share their view before stating their own. This prevents them from anchoring the group to their first idea and ensures they hear alternatives. Their natural leadership is an asset — but only when it includes listening.`
		);
	} else {
		narrative.push(
			`**For ${studentName}:** Take a proactive approach to role selection at the start of each project. Before the group starts working, spend 5 minutes clarifying: who does what, when it's due, and how we'll communicate. This simple structure prevents the chaos that derails most group projects.`
		);
	}

	// ─── Conflict Patterns ───────────────────────────────────────────────────────
	narrative.push('\n### Conflict Patterns');

	if (aScore >= 3.5 && A?.facets?.patience?.score >= 3.5) {
		narrative.push(
			`${studentName} handles conflict with patience and diplomacy. They prefer resolution over escalation and will often absorb frustration rather than express it. While this keeps situations calm, it can also mean legitimate concerns go unvoiced. Encourage ${studentName} to express disagreement early and respectfully — small conflicts resolved quickly prevent large resentments.`
		);
	} else if (aScore < 2.5 || (A?.facets?.patience?.score || 3.0) < 2.5) {
		narrative.push(
			`Conflict can escalate quickly with ${studentName}. Their directness (low Agreeableness) ${(A?.facets?.patience?.score || 3.0) < 2.5 ? 'combined with a short fuse (low patience) ' : ''}means disagreements may become heated before a resolution is found. This isn't malicious — ${studentName} genuinely cares about quality and correctness.`
		);
		narrative.push(
			`The intervention: teach a "pause protocol." When feeling frustrated in a group: (1) take a breath, (2) state the problem without blaming ("I think we have different approaches"), (3) propose a solution. This small delay between feeling and speaking transforms conflict from destructive to productive.`
		);
	} else {
		narrative.push(
			`${studentName} manages conflict reasonably well, neither avoiding it entirely nor escalating unnecessarily. They can express disagreement when it matters and compromise when it doesn't. This balanced approach serves them well in most group settings.`
		);
	}

	// ─── Friendship & Social Dynamics ────────────────────────────────────────────
	narrative.push('\n### Friendship & Social Energy');

	if (xScore >= 3.5 && eScore >= 3.0) {
		narrative.push(
			`${studentName} invests heavily in friendships and draws significant energy from social connection. They likely have a wide social circle and feel energised after spending time with friends. Academically, this social nature means they learn well through discussion, debate, and collaborative study — as long as social time doesn't crowd out focused study time.`
		);
	} else if (xScore < 2.5) {
		narrative.push(
			`${studentName} prefers fewer, deeper friendships over a wide social network. They recharge through solitude and may feel drained by extended social interaction. This is not social anxiety — it's an energy management preference. Academically, they need protected solo study time and should not be forced into constant group work.`
		);
		narrative.push(
			`Research on introversion in education (Cain, 2012) shows that introverted students produce higher-quality work when given choice over their collaboration format. Allowing ${studentName} to contribute through written channels, paired work, or asynchronous collaboration respects their natural style while maintaining social learning benefits.`
		);
	} else {
		narrative.push(
			`${studentName} has a moderate social energy profile — they enjoy social interaction but also value alone time. This balance allows them to participate in group activities without feeling drained, and to study alone without feeling isolated.`
		);
	}

	// ─── Leadership Profile ──────────────────────────────────────────────────────
	narrative.push('\n### Leadership Profile');

	if (xScore >= 3.5 && cScore >= 3.5) {
		narrative.push(
			`${studentName} has strong natural leadership potential. Their social confidence (Extraversion ${xScore.toFixed(1)}/5) means they're comfortable directing others, while their organisation (Conscientiousness ${cScore.toFixed(1)}/5) ensures they can actually manage projects effectively. This combination produces the most effective student leaders — people who both inspire and organise.`
		);
		keyFindings.push({ title: 'Leadership Potential', text: `${studentName}'s combination of social confidence and organisation makes them a natural project leader.`, type: 'strength', color: '#3b82f6' });
	} else if (xScore < 2.5 && cScore >= 3.5) {
		narrative.push(
			`${studentName} leads through quiet competence rather than charisma. They may not volunteer for leadership roles, but when given them, they manage projects reliably. Their leadership style is "lead by example" — they set the standard through their own work quality and let that inspire others.`
		);
	} else if (xScore >= 3.5 && cScore < 2.5) {
		narrative.push(
			`${studentName} has social leadership energy but may struggle with the organisational demands of project management. They're great at rallying a team and generating enthusiasm, but may need a "second in command" who handles the details. Pair them with a highly organised teammate for best results.`
		);
	} else {
		narrative.push(
			`${studentName} is more of an individual contributor than a natural leader. This isn't a limitation — most successful teams need strong contributors who execute reliably. ${studentName}'s leadership can develop through small, low-stakes opportunities (leading a study group, organising a small project) that build confidence gradually.`
		);
	}

	// ─── Team Role ───────────────────────────────────────────────────────────────
	narrative.push('\n### Recommended Team Role');

	let teamRole = '';
	if (cScore >= 3.5 && xScore >= 3.5) {
		teamRole = 'Coordinator';
		narrative.push(`**${teamRole}:** The person who organises the project, assigns tasks, and keeps the team on track. ${studentName}'s combination of social skills and organisation makes this their natural role.`);
	} else if (oScore >= 3.5 && cScore < 3.5) {
		teamRole = 'Ideas Generator';
		narrative.push(`**${teamRole}:** The creative thinker who brainstorms solutions and sees connections others miss. ${studentName}'s curiosity and openness drive innovation. Pair them with an implementer who turns ideas into action.`);
	} else if (cScore >= 3.5 && xScore < 3.0) {
		teamRole = 'Quality Controller';
		narrative.push(`**${teamRole}:** The person who ensures the final product meets standards. ${studentName}'s diligence and attention to detail catch errors others miss. They're most valuable in the later stages of a project.`);
	} else if (aScore >= 3.5 && eScore >= 3.0) {
		teamRole = 'Team Supporter';
		narrative.push(`**${teamRole}:** The person who maintains group cohesion and ensures everyone feels included. ${studentName}'s empathy and cooperativeness keep the team functioning smoothly, especially during stressful phases.`);
	} else if (aScore < 2.5 && oScore >= 3.0) {
		teamRole = 'Critical Analyst';
		narrative.push(`**${teamRole}:** The person who challenges assumptions and pushes for quality. ${studentName}'s willingness to disagree and think critically prevents groupthink and drives better outcomes.`);
	} else {
		teamRole = 'Versatile Contributor';
		narrative.push(`**${teamRole}:** ${studentName}'s balanced profile means they can fill multiple roles depending on what the team needs. This flexibility is valuable in any group composition.`);
	}

	keyFindings.push({ title: `Team Role: ${teamRole}`, text: `${studentName} is best suited as a ${teamRole} in group projects.`, type: 'insight', color: '#3b82f6' });

	// ─── Peer Learning Recommendations ───────────────────────────────────────────
	narrative.push('\n### Peer Learning Recommendations');

	if (xScore >= 3.5 && aScore >= 3.0) {
		narrative.push(
			`${studentName} is an ideal candidate for peer tutoring — both as tutor and tutee. As a tutor, explaining concepts to others deepens their own understanding (the "protégé effect"). As a tutee, their social comfort means they're willing to admit confusion and ask follow-up questions. Research shows peer tutoring improves achievement for BOTH the tutor and the tutee by an average of 0.4 standard deviations — equivalent to moving from the 50th to the 66th percentile (Roscoe & Chi, 2007).`
		);
	} else if (xScore < 2.5) {
		narrative.push(
			`${studentName} benefits most from one-on-one peer interactions rather than group study. A single study partner who is patient and non-judgemental creates the safest learning environment. Online study partnerships (voice chat while working on shared documents) can provide the collaboration benefit while maintaining the physical space ${studentName} needs to feel comfortable.`
		);
	} else {
		narrative.push(
			`${studentName} can benefit from peer learning in small groups (2-3 people). The key is curating the right group: peers who are at a similar level, take the same subjects, and have complementary strengths. Avoid groups where one person dominates or where social chat overwhelms study time. A simple structure (10 minutes of individual work, 5 minutes of discussion, repeat) keeps the balance.`
		);
	}

	// ─── Digital Social Learning ─────────────────────────────────────────────────
	narrative.push('\n### Digital Social Learning');

	narrative.push(
		`Modern students have access to social learning tools that didn't exist a decade ago. ${studentName}'s personality shapes how effectively they can use these tools:`
	);

	if (xScore >= 3.0) {
		narrative.push(
			`${studentName} will engage well with collaborative digital platforms: shared note-taking (Google Docs, Notion), study Discord servers, video call study sessions, and peer-teaching through screen sharing. These channels combine social interaction with productive academic work. Set ground rules to prevent sessions from devolving into social chat: start with 5 minutes of social warm-up, then study mode with social breaks scheduled every 25 minutes.`
		);
	} else {
		narrative.push(
			`${studentName} may prefer asynchronous digital collaboration — shared documents where they can contribute at their own pace, forum-style Q&A platforms, or video recordings of peer explanations they can watch alone. This provides the benefit of peer learning without the energy cost of real-time social interaction.`
		);
	}

	return {
		narrative,
		keyFindings,
		researchNotes,
		scenarios: [],
		crossReferences: [
			{ targetSection: 'personality-deep-dive', text: 'Extraversion and Agreeableness details in Section 2.' },
			{ targetSection: 'guide', text: 'Teacher strategies for group work in Section 10.' },
		],
		actions: [],
	};
}
