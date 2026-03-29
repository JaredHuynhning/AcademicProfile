// @ts-nocheck
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
