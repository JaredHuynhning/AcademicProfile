// @ts-nocheck
/**
 * Mega Section 6: Strengths & Superpowers
 * Generates ~4 pages: cross-referenced strengths, leverage strategies, interaction map.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, classifyLevel, scorePercentile, type DimKey, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';
import { pickOpener, renderInteractionCallout, renderInteractionAction, pickInteractionsForSection, detectFacetSurprises } from '../prose-variety';

const LEVERAGE_STRATEGIES: Record<DimKey, { high: string[]; low: string[] }> = {
	H: {
		high: [
			'Volunteer for roles requiring trust (peer mediator, team treasurer, lab partner for expensive equipment).',
			'Use your ethical reputation to build stronger study partnerships — people want to work with someone they trust.',
			'In group projects, take ownership of quality control — your fairness ensures credit is distributed properly.',
		],
		low: [
			'Channel your competitive drive into academic competitions (maths olympiad, debating, science fair).',
			'Use your strategic thinking for exam preparation — you naturally optimise for what will be assessed.',
			'Your motivation by rewards means gamified study tools (streaks, leaderboards) will boost engagement.',
		],
	},
	E: {
		high: [
			'Your empathy makes you an excellent study partner — you naturally sense when someone else doesn\'t understand.',
			'Channel emotional sensitivity into writing, where it adds depth and authenticity to narratives and arguments.',
			'Use your emotional awareness in subjects like psychology, sociology, and literature where understanding feelings is an explicit skill.',
		],
		low: [
			'Your composure under pressure is ideal for timed exams and presentations — lean into these formats.',
			'Volunteer for high-stakes roles in group work (presenting to the class, leading the Q&A) where calm is an advantage.',
			'Use your emotional steadiness to mentor anxious peers — this reinforces your own understanding through teaching.',
		],
	},
	X: {
		high: [
			'Form and lead study groups — your social energy makes collaborative learning more productive for everyone.',
			'Use class participation as a learning tool: asking questions publicly forces you to articulate your thinking.',
			'Take on presentation and demonstration roles in projects — your social comfort turns these into strengths rather than stressors.',
		],
		low: [
			'Your capacity for deep, focused solo study is a genuine academic superpower — protect and schedule this time.',
			'Use written participation channels (online forums, shared documents, written questions) to contribute without social drain.',
			'Your thoughtful processing style means your contributions, while less frequent, are often more insightful — own this quality.',
		],
	},
	A: {
		high: [
			'Your positive group dynamics make you the ideal team member — actively seek collaborative projects and study groups.',
			'Use your patience and flexibility to work with diverse team compositions, including difficult group members.',
			'Build a reputation as a reliable, easy-to-work-with student — this social capital compounds over your school career.',
		],
		low: [
			'Your critical thinking is genuinely valuable — volunteer for roles that need honest evaluation (peer review, quality checking).',
			'Channel your directness into debate, mooting, or critical analysis assignments where challenging ideas is the point.',
			'Your independence means you can maintain quality standards when group pressure pushes toward mediocrity.',
		],
	},
	C: {
		high: [
			'Your organisation is your moat — keep detailed notes, maintain a planner, and track all deadlines. These systems compound over time.',
			'Offer to organise group projects (timeline, task allocation, follow-up) — your natural planning ability makes you the project manager everyone wants.',
			'Use your diligence for long-term projects and cumulative subjects (maths, languages) where consistent effort beats raw talent.',
		],
		low: [
			'Your flexibility and spontaneity can be assets in creative and improvised assessment types — brainstorming, creative writing, oral presentations.',
			'When you do find something interesting, your engagement can be intense and productive — build study time around your most engaging subjects.',
			'Use external tools aggressively: calendar reminders, accountability apps, study buddies who provide structure.',
		],
	},
	O: {
		high: [
			'Your curiosity drives you to go deeper than required — this leads to the kind of sophisticated understanding that produces top grades in analytical subjects.',
			'Use your creativity in projects, essays, and presentations — original approaches stand out in assessment.',
			'Explore connections between subjects — your ability to link history to science to literature creates a richer understanding than siloed learning.',
		],
		low: [
			'Your practical, focused approach means you don\'t waste time on irrelevant tangents — you study what\'s assessed.',
			'Your preference for clear, structured learning means you thrive with well-defined syllabuses and rubrics — use these as your roadmap.',
			'Your execution skills are undervalued: many creative thinkers can\'t follow through. You can. This reliability is a genuine strength.',
		],
	},
};

export function generateStrengthsMega(
	dimensions: DimensionsMap,
	crossRefResult: any | null,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	narrative.push(
		`${pickOpener(studentName, 6)} genuine strengths — personality traits that, when leveraged strategically, become academic superpowers. This section identifies ${studentName}'s strongest traits and provides specific strategies for amplifying them. The goal is not just to acknowledge strengths, but to actively deploy them across subjects, assessments, and learning situations.`
	);

	// Inject positive interactions with high impact
	const relevantInteractions = pickInteractionsForSection(
		(crossRefResult?.interactions ?? []).filter((i: any) => i.impact >= 6), 6, 2
	);
	relevantInteractions.forEach((interaction: any, idx: number) => {
		narrative.push(renderInteractionCallout(interaction, 6 + idx));
		narrative.push(renderInteractionAction(interaction, idx));
	});

	narrative.push(
		`Strengths-based approaches to education produce measurably better outcomes than deficit-focused interventions. Research by Park and Peterson (2009) found that students who consciously apply their personality strengths to academic challenges show 15-20% improvement in both engagement and performance. The reason is straightforward: working with your natural tendencies requires less effort than fighting against them. A conscientious student who builds on their organisational strength will always outperform the same student trying to become more creative — not because creativity doesn't matter, but because building from strength is more efficient than fixing weakness.`
	);

	narrative.push(
		`This section identifies ${studentName}'s top personality strengths, maps how they reinforce each other, reveals hidden strengths that aren't obvious from headline scores, and provides specific leverage strategies for each. The goal is to make ${studentName} aware of what they naturally do well, so they can do more of it — deliberately and strategically.`
	);

	// ─── Cross-Referenced Strengths ───────────────────────────────────────────────
	narrative.push('\n### Cross-Referenced Strengths');

	// Sort dimensions by how far above average
	const dimScores = DIM_ORDER.map(k => ({ key: k as DimKey, score: dimensions[k]?.score || 3.0 }));
	const strengths = dimScores.filter(d => d.score >= 3.0).sort((a, b) => b.score - a.score);
	const topStrengths = strengths.slice(0, 3);

	if (topStrengths.length === 0) {
		narrative.push(
			`${studentName}'s scores are mostly below the population average, which means their strengths are relative rather than absolute. The focus should be on identifying which dimensions are LEAST challenging and building from there. Even a modest score can be a leverage point when combined with the right strategies.`
		);
	}

	topStrengths.forEach((s, i) => {
		const dim = dimensions[s.key];
		const pct = scorePercentile(s.score);
		const level = classifyLevel(s.score);

		narrative.push(
			`**${i + 1}. ${DIM_NAMES[s.key]}** (${s.score.toFixed(1)}/5, ${pct}th percentile): ${studentName}'s ${level === 'high' ? 'strong' : 'moderate'} ${DIM_NAMES[s.key].toLowerCase()} is backed by personality research showing this trait ${s.key === 'C' ? 'is the strongest predictor of academic achievement' : s.key === 'O' ? 'drives creative and analytical excellence' : s.key === 'X' ? 'fuels productive classroom participation and social learning' : s.key === 'A' ? 'creates positive group dynamics that benefit everyone' : s.key === 'E' ? 'provides deep empathy that enriches humanities and social understanding' : 'builds the trust and integrity that form the foundation of strong academic relationships'}.`
		);

		keyFindings.push({
			title: `Strength: ${DIM_NAMES[s.key]}`,
			text: `${s.score.toFixed(1)}/5 (${pct}th percentile) — ${studentName}'s ${DIM_NAMES[s.key].toLowerCase()} is a genuine academic advantage.`,
			type: 'strength',
			color: DIM_COLORS[s.key],
		});
	});

	// Cross-ref confirmations
	const confirmationList = crossRefResult?.byType?.confirmation;
	if (confirmationList && confirmationList.length > 0) {
		narrative.push('\n#### Personality-Academic Confirmation Patterns');
		const confirmations = [...confirmationList].sort((a, b) => b.impact - a.impact).slice(0, 3);
		confirmations.forEach((c, i) => {
			narrative.push(
				`**Pattern ${i + 1}:** ${c.insight} (Impact: ${c.impact}/10)`
			);
		});
	}


	// ─── Leverage Strategies ─────────────────────────────────────────────────────
	narrative.push('\n### How To Leverage These Strengths');

	topStrengths.forEach(s => {
		const strategies = LEVERAGE_STRATEGIES[s.key];
		const level = classifyLevel(s.score);
		const tips = level === 'high' ? strategies.high : strategies.low;

		narrative.push(`\n#### ${DIM_NAMES[s.key]} Leverage Strategies`);
		tips.forEach(tip => {
			narrative.push(`- ${tip}`);
		});
	});

	researchNotes.push({
		text: 'Strengths-based approaches to education produce better outcomes than deficit-focused interventions. Students who consciously apply their personality strengths to academic challenges show 15-20% improvement in engagement and performance (Park & Peterson, 2009).',
		topic: 'Strengths leverage',
	});

	// ─── Strength Interaction Map ────────────────────────────────────────────────
	narrative.push('\n### How Strengths Reinforce Each Other');

	if (topStrengths.length >= 2) {
		const [s1, s2] = topStrengths;
		const combos: Record<string, string> = {
			'C+O': `${studentName}'s discipline (C) and curiosity (O) create a powerful learning engine: they explore deeply AND follow through. This combination produces consistently excellent work across subjects.`,
			'C+H': `${studentName}'s discipline (C) and integrity (H) make them the ultimate reliable student: they do high-quality work AND do it honestly. Teachers trust them implicitly.`,
			'C+X': `${studentName}'s discipline (C) and social energy (X) make them a natural study group leader: they keep things organised AND energised.`,
			'O+X': `${studentName}'s curiosity (O) and social confidence (X) make them the student who asks the great questions in class — driving discussion that benefits everyone.`,
			'O+E': `${studentName}'s curiosity (O) and emotional depth (E) give them remarkable insight into literature, psychology, and human behaviour — subjects where feeling AND thinking intersect.`,
			'A+X': `${studentName}'s cooperativeness (A) and social energy (X) make them the person everyone wants in their group project — they contribute positively and keep the team cohesive.`,
			'C+A': `${studentName}'s discipline (C) and cooperativeness (A) make them the ideal team member: reliable, organised, and easy to work with.`,
			'H+A': `${studentName}'s integrity (H) and agreeableness (A) create a combination of trustworthiness and warmth that builds deep, productive relationships with peers and teachers.`,
		};

		const comboKey = [s1.key, s2.key].sort().join('+');
		const combo = combos[comboKey];
		if (combo) {
			narrative.push(combo);
		} else {
			narrative.push(
				`${studentName}'s top two dimensions — ${DIM_NAMES[s1.key]} and ${DIM_NAMES[s2.key]} — work together to create a distinctive academic profile. Each reinforces the other: ${DIM_NAMES[s1.key].toLowerCase()} provides ${classifyLevel(s1.score) === 'high' ? 'the foundation' : 'balance'}, while ${DIM_NAMES[s2.key].toLowerCase()} adds ${classifyLevel(s2.score) === 'high' ? 'the edge' : 'versatility'}.`
			);
		}
	}

	// ─── Hidden Strengths ────────────────────────────────────────────────────────
	narrative.push('\n### Hidden Strengths');

	const hiddenStrengths: string[] = [];
	const cFacets = dimensions.C?.facets || {};
	const oFacets = dimensions.O?.facets || {};
	const eFacets = dimensions.E?.facets || {};

	if (cFacets.prudence?.score >= 3.5 && (dimensions.C?.score || 0) < 3.5) {
		hiddenStrengths.push(`${studentName}'s prudence (${cFacets.prudence.score.toFixed(1)}/5) is notably higher than their overall Conscientiousness. They think before acting even if they're not naturally organised — this careful decision-making is a hidden asset that protects against impulsive mistakes.`);
	}
	if (oFacets.inquisitiveness?.score >= 3.5 && (dimensions.O?.score || 0) < 3.5) {
		hiddenStrengths.push(`${studentName}'s inquisitiveness (${oFacets.inquisitiveness.score.toFixed(1)}/5) is higher than their overall Openness. They're genuinely curious even if they don't show it through creativity — this love of learning can be channelled into academic deep dives.`);
	}
	if (eFacets.dependence?.score < 2.5 && (dimensions.E?.score || 0) >= 3.0) {
		hiddenStrengths.push(`Despite moderate Emotionality overall, ${studentName}'s low dependence (${eFacets.dependence.score.toFixed(1)}/5) shows unusual emotional self-sufficiency — they can work independently without needing constant reassurance.`);
	}

	if (hiddenStrengths.length > 0) {
		narrative.push(`Not all strengths are visible from the headline scores. Looking deeper into ${studentName}'s facets reveals:`);
		hiddenStrengths.forEach(s => narrative.push(s));
	} else {
		narrative.push(
			`${studentName}'s facet scores align closely with their dimension scores, meaning their strengths are consistent and visible. What you see in the headline scores is genuinely reflective of their underlying traits.`
		);
	}

	// ─── Strengths in Action ─────────────────────────────────────────────────────
	const cScore = dimensions.C?.score || 3.0;
	const eScore = dimensions.E?.score || 3.0;
	const oScore = dimensions.O?.score || 3.0;
	const xScore = dimensions.X?.score || 3.0;
	const aScore = dimensions.A?.score || 3.0;

	narrative.push('\n### Putting Strengths to Work');

	narrative.push(
		`${pickOpener(studentName, 16)} that knowing your strengths is only the first step — deploying them strategically is what creates results. Here is a practical guide to apply their top personality strengths across different academic situations:`
	);

	narrative.push(
		`**During exams:** ${cScore >= 3.5 ? `${studentName}'s conscientiousness means they're likely well-prepared, but may over-check answers at the expense of time management. Strategy: allocate specific time per question based on marks available, and move on when time is up — even if the answer isn't perfect.` : eScore < 3.0 ? `${studentName}'s emotional steadiness under pressure is their exam superpower. While other students panic, they can think clearly. Strategy: use the first 5 minutes of every exam to read the full paper, plan time allocation, and start with the highest-confidence question to build momentum.` : oScore >= 3.5 ? `${studentName}'s creative thinking can produce original, insightful answers that stand out from generic responses. Strategy: for essay questions, spend 3 minutes brainstorming unusual angles or connections before writing. An unexpected perspective, backed by evidence, earns top marks.` : `${studentName} should focus on playing to whichever strength is most relevant to each question type. Multiple choice rewards steady focus. Essays reward creative thinking. Calculations reward methodical precision. Match the approach to the assessment format.`}`
	);

	narrative.push(
		`**During group projects:** ${xScore >= 3.5 && aScore >= 3.0 ? `${studentName} naturally takes the coordination role — but should consciously step into specific responsibilities rather than trying to manage everything. Strategy: volunteer for the role that matches their strongest dimension (organiser if high-C, idea generator if high-O, presenter if high-X) and let others own other roles.` : xScore < 2.5 ? `${studentName}'s strength in group work is the quality of their individual contributions, not their social leadership. Strategy: volunteer to own a specific deliverable (the research, the analysis, the written section) rather than taking coordination or presentation roles.` : `${studentName}'s balanced profile makes them versatile in groups — able to fill whatever role is missing. Strategy: identify what the group lacks and fill that gap.`}`
	);

	narrative.push(
		`**When choosing electives or activities:** ${oScore >= 3.5 ? `Choose subjects and activities that reward exploration and creativity: advanced arts, research projects, debating, creative writing, independent study units.` : cScore >= 3.5 ? `Choose subjects with clear structure and cumulative skill-building: advanced maths, sciences with practical components, music (structured practice), and sports with clear progression pathways.` : xScore >= 3.5 ? `Choose activities with social components: team sports, drama, debate club, peer mentoring, student council.` : `Choose a mix of subjects that play to different strengths — ${studentName}'s balanced profile means they can succeed across a variety of contexts.`}`
	);

	narrative.push(
		`**When motivation is low:** Return to the strengths identified in this section. Ask: "How can I use my top strength to make this task more engaging?" A highly conscientious student can turn any task into a challenge against their own best time. A highly open student can find an interesting angle on any topic. An extraverted student can turn study into a social event. Strengths are not just descriptions — they are tools.`
	);

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
			{ targetSection: 'personality-deep-dive', text: 'See Section 2 for the full dimension analysis behind these strengths.' },
			{ targetSection: 'barriers', text: 'See Section 7 for the flip side — barriers that may counterbalance these strengths.' },
		],
		actions: [],
	};
}
