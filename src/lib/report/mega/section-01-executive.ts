/**
 * Mega Section 1: Cover + Executive Summary
 * Generates ~3 pages: expanded narrative summary + key metrics + headline findings.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, classifyLevel, scorePercentile, interpretiveLabel, toDimensionsMap, type DimKey, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding } from '../mega-sections';
import { CrossRefResult } from '../cross-reference-engine';
import { pickOpener, renderInteractionCallout, filterByAudience } from '../prose-variety';

const DIM_ACADEMIC_IMPACT: Record<DimKey, { high: string; low: string }> = {
	H: {
		high: 'strong academic integrity and trustworthiness in collaborative work',
		low: 'competitive drive that can fuel achievement when channelled constructively',
	},
	E: {
		high: 'deep empathy and emotional awareness that enriches humanities and social learning, though may intensify exam anxiety',
		low: 'remarkable calm under pressure that provides an advantage in high-stakes assessments',
	},
	X: {
		high: 'natural classroom participation and social learning energy',
		low: 'deep focus capability and thoughtful processing that strengthens independent study',
	},
	A: {
		high: 'positive group dynamics and strong peer relationships that support collaborative learning',
		low: 'critical thinking and willingness to challenge weak ideas, valuable for analytical subjects',
	},
	C: {
		high: 'consistent study habits, strong organisation, and reliable homework completion — the single strongest personality predictor of academic success',
		low: 'need for external structure and accountability to unlock their full potential',
	},
	O: {
		high: 'intellectual curiosity and creative thinking that excels in open-ended and analytical tasks',
		low: 'practical, methodical approach that delivers reliable results in structured subjects',
	},
};

export function generateExecutiveSummaryMega(
	dimensions: DimensionsMap,
	studentName: string,
	archetype: string,
	crossRefResult: CrossRefResult | null,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];

	// Find highest and lowest dimensions
	const dimScores = DIM_ORDER.map(k => ({ key: k, score: dimensions[k]?.score || 3.0 }));
	dimScores.sort((a, b) => b.score - a.score);
	const highest = dimScores[0];
	const lowest = dimScores[dimScores.length - 1];
	const highLevel = classifyLevel(highest.score);
	const lowLevel = classifyLevel(lowest.score);

	// Para 1: Who is this student?
	narrative.push(
		`${pickOpener(studentName, 0)} ${archetype} — a personality profile characterised by ${DIM_NAMES[highest.key].toLowerCase()} as their strongest dimension and ${DIM_NAMES[lowest.key].toLowerCase()} as an area for development. Based on their responses to 120 self-report questions, this report provides a comprehensive analysis of how ${studentName}'s personality shapes their academic experience, learning style, study habits, and social dynamics.`
	);

	// Para 2: Academic personality signature
	const topTwoImpacts = dimScores.slice(0, 2).map(d => {
		const impact = DIM_ACADEMIC_IMPACT[d.key];
		return classifyLevel(d.score) === 'high' ? impact.high : classifyLevel(d.score) === 'low' ? impact.low : impact.high.split(',')[0];
	});
	narrative.push(
		`${pickOpener(studentName, 1)} an academic personality signature that combines ${topTwoImpacts[0]} with ${topTwoImpacts[1]}. This combination means ${studentName} brings a distinctive set of strengths to learning — strengths that can be leveraged strategically across different subjects and contexts.`
	);

	// Para 3: Cross-reference synthesis (if available)
	if (crossRefResult) {
		const confirmations = crossRefResult.byType?.confirmation || [];
		const rootCauses = crossRefResult.byType?.root_cause || [];
		const topConfirm = confirmations.sort((a, b) => b.impact - a.impact)[0];
		const topCause = rootCauses.sort((a, b) => b.impact - a.impact)[0];

		if (topConfirm || topCause) {
			const parts: string[] = [];
			if (topConfirm) {
				parts.push(`Their strongest cross-system pattern is: ${topConfirm.insight}`);
				keyFindings.push({ title: 'Top Strength', text: topConfirm.insight, type: 'strength', color: '#22c55e' });
			}
			if (topCause) {
				parts.push(`The most important barrier to address is: ${topCause.insight}`);
				keyFindings.push({ title: 'Top Barrier', text: topCause.insight, type: 'barrier', color: '#f59e0b' });
				if (topCause.action) {
					keyFindings.push({ title: 'Priority Action', text: topCause.action, type: 'action', color: '#3b82f6' });
				}
			}
			narrative.push(
				`The cross-reference analysis — which maps personality traits to academic outcomes — reveals important patterns. ${parts.join('. ')}. These findings are explored in detail throughout this report, with specific strategies in the Action Plan (Section 11).`
			);
		}
	}

	// Para 4: Score overview
	const aboveAvg = dimScores.filter(d => d.score >= 3.5).map(d => DIM_NAMES[d.key]);
	const belowAvg = dimScores.filter(d => d.score < 2.5).map(d => DIM_NAMES[d.key]);
	if (aboveAvg.length > 0 || belowAvg.length > 0) {
		const parts: string[] = [];
		if (aboveAvg.length > 0) parts.push(`scoring above average on ${aboveAvg.join(', ')}`);
		if (belowAvg.length > 0) parts.push(`with development areas in ${belowAvg.join(', ')}`);
		narrative.push(
			`${pickOpener(studentName, 2)} a profile that is distinctive across the six HEXACO dimensions — ${parts.join(', ')}. These aren't labels or limitations. They are starting points for understanding how ${studentName} naturally approaches learning, relationships, and challenge. The strategies throughout this report are designed to leverage what's strong and support what's developing.`
		);
	}

	// Para 5: How to use this report
	narrative.push(
		`This report is structured in 12 sections covering every aspect of ${studentName}'s academic profile. Section 2 provides a deep dive into all six personality dimensions with research backing. Sections 3-5 cover learning style, academic drive, and study strategies. Section 6 identifies strengths to leverage, while Section 7 maps barriers and their root causes. Sections 8-9 cover social dynamics and subject fit. Section 10 provides tailored guidance for teachers, parents, and tutors. Section 11 is the action plan — specific steps to implement starting this week.`
	);

	// Para 6: How to read
	narrative.push(
		`For parents reading this report: you don't need to read every section cover-to-cover. Start with this Executive Summary for the big picture, then jump to Section 10 (Teacher & Parent Guide) for specific strategies you can implement at home. Section 11 (Action Plan) gives you the priority order. The deep analysis in Sections 2-9 provides the evidence behind each recommendation — read these when you want to understand the "why" behind a strategy.`
	);

	// Para 7: What this report is NOT
	narrative.push(
		`A note on what this report is and is not. This is a personality-based academic profile — it identifies how ${studentName}'s natural tendencies shape their learning, and provides strategies that work WITH those tendencies rather than against them. It is NOT a measure of intelligence, a clinical diagnosis, or a prediction of future success. Personality is one piece of the academic puzzle, alongside intelligence, opportunity, teaching quality, and effort. What makes personality uniquely valuable is that it's actionable: while IQ is relatively fixed, the way personality interacts with the learning environment can be optimised through the strategies in this report.`
	);

	// ─── "Aha Moment" Dimension Interactions ────────────────────────────────────
	// These are the insights that make parents say "that's EXACTLY my child"
	narrative.push('\n### What Makes This Profile Unique');

	const interactionInsights: string[] = [];
	const cScore = dimensions.C?.score || 3;
	const oScore = dimensions.O?.score || 3;
	const eScore = dimensions.E?.score || 3;
	const xScore = dimensions.X?.score || 3;
	const aScore = dimensions.A?.score || 3;
	const hScore = dimensions.H?.score || 3;

	// C × E interactions
	if (cScore >= 3.5 && eScore >= 3.5) {
		interactionInsights.push(`**The Anxious Achiever:** ${studentName}'s high conscientiousness means they always prepare thoroughly, but their high emotionality means they still feel anxious despite being well-prepared. You may notice ${studentName} studying extensively and then saying "I'm going to fail" — this isn't laziness or lack of preparation. The preparation is real; the anxiety is separate. The strategy is to trust the preparation process and recognise that anxiety is not evidence of under-preparation.`);
	}
	if (cScore < 2.5 && eScore < 2.5) {
		interactionInsights.push(`**The Relaxed Risk-Taker:** ${studentName} combines low urgency with emotional calm — meaning they rarely feel the productive anxiety that motivates most students to start studying. They're genuinely unworried, not just pretending. This makes deadline-based motivation ineffective. Instead, focus on intrinsic interest: "What about this topic is actually cool?" and external accountability: "Show me your progress at 4pm."`);
	}

	// C × O interactions
	if (cScore >= 3.5 && oScore < 2.5) {
		interactionInsights.push(`**The Reliable Executor:** ${studentName} is the student who always hands work in on time and follows instructions precisely — but may not go beyond what's asked. They're not being lazy; they're being efficient. To unlock deeper learning, frame extensions as part of the task: "The assignment is to answer this question AND explain why the answer matters."`);
	}
	if (cScore < 2.5 && oScore >= 3.5) {
		interactionInsights.push(`**The Brilliant Starter:** ${studentName} has no shortage of ideas and genuine intellectual curiosity — but finishing projects is the challenge. You may notice half-finished books, abandoned hobbies, and creative projects that fizzle out. This isn't lack of ability; it's the friction between curiosity (which moves to the next interesting thing) and discipline (which stays on the current thing). The fix: shorter projects, visible progress tracking, and celebrating completion, not just starting.`);
	}

	// X × A interactions
	if (xScore >= 3.5 && aScore < 2.5) {
		interactionInsights.push(`**The Dominant Leader:** ${studentName} is confident in groups AND willing to push back on others — which makes them a natural leader but sometimes a difficult group member. Other parents may describe their child's group project experiences with ${studentName} differently than ${studentName} does. Coaching them on inclusive leadership ("great leaders make others feel heard") channels this energy productively.`);
	}
	if (xScore < 2.5 && aScore >= 3.5) {
		interactionInsights.push(`**The Quiet Accommodator:** ${studentName} is reserved AND deeply cooperative — which means they may consistently defer to louder group members even when they have better ideas. You may notice they do more than their share of group work without complaint. This isn't strength; it's a pattern that builds resentment over time. Teaching them to express preferences early ("I'd like to do the research section") prevents the buildup.`);
	}

	// E × X interactions
	if (eScore >= 3.5 && xScore < 2.5) {
		interactionInsights.push(`**The Internal Storm:** ${studentName} feels emotions deeply but processes them privately. You may not see the anxiety, frustration, or excitement — but it's there. Check-ins need to be private and non-pressured: "How are you feeling about the exam?" over dinner, not "Are you worried?" in front of siblings. They won't volunteer emotional information but will share if asked gently in the right setting.`);
	}
	if (eScore < 2.5 && xScore >= 3.5) {
		interactionInsights.push(`**The Social Rock:** ${studentName} is emotionally unflappable AND highly social — which makes them the person others lean on during stressful times. This is a genuine strength, but watch for emotional caretaking fatigue: they may absorb others' stress while appearing fine themselves. Regularly ask "How are YOU doing?" — not just "How are your friends doing?"`);
	}

	// H × C interactions
	if (hScore >= 3.5 && cScore >= 3.5) {
		interactionInsights.push(`**The Principled Worker:** ${studentName} combines strong ethics with strong discipline — they do the right thing AND they do it consistently. This is the student who would never cheat on a test, even if they could get away with it. Recognise this integrity; it's genuinely rare and should be celebrated, not taken for granted.`);
	}
	if (hScore < 2.5 && cScore < 2.5) {
		interactionInsights.push(`**The Corner-Cutter:** ${studentName} is pragmatic about rules AND about effort — meaning they may seek shortcuts that are technically allowed but not in the spirit of the assignment. This isn't malice; it's efficiency-seeking. Channel it constructively: "What's the smartest way to get an A?" rather than "Just work harder." Their strategic thinking is a genuine asset when directed at legitimate challenges.`);
	}

	if (interactionInsights.length > 0) {
		interactionInsights.forEach(insight => narrative.push(insight));
	} else {
		narrative.push(`${studentName}'s moderate profile across most dimensions means they don't show the dramatic trait interactions that produce easily recognisable patterns. This is actually an advantage: they're flexible enough to adapt their approach to different situations rather than being locked into one mode. The strategies in this report help ${studentName} consciously choose which mode to activate in each context.`);
	}

	// ─── Interaction Callouts from cross-reference engine ──────────────────
	if (crossRefResult?.interactions) {
		const parentInteractions = filterByAudience(
			crossRefResult.interactions ?? [], ['parent', 'student']
		).slice(0, 2);
		parentInteractions.forEach(i => {
			narrative.push(renderInteractionCallout(i));
		});
	}

	// ─── "What Teachers See vs What's Really Happening" ──────────────────────
	narrative.push('\n### What Teachers See vs What\'s Really Happening');

	const teacherTableRows: { visible: string; underlying: string; driver: string }[] = [];

	// Low X + High E → anxiety-driven non-participation
	if (xScore < 2.5 && eScore >= 3.5) {
		teacherTableRows.push({
			visible: 'Doesn\'t participate — seems disengaged',
			underlying: 'Anxiety about being wrong + introversion. Excellent ideas processed privately, never shared.',
			driver: 'Low Extraversion + High Emotionality',
		});
	} else if (xScore < 2.5) {
		teacherTableRows.push({
			visible: 'Doesn\'t participate in class discussions',
			underlying: `${studentName} is processing deeply and may have excellent answers — they just don't feel comfortable sharing unprepared thoughts publicly. Give them questions in advance.`,
			driver: 'Low Extraversion',
		});
	}

	// Low C → misread as lazy
	if (cScore < 2.5) {
		teacherTableRows.push({
			visible: 'Lazy, doesn\'t try — homework late or incomplete',
			underlying: 'Executive function gap, not motivation. Lacks the organisational systems other students have naturally.',
			driver: 'Low Conscientiousness',
		});
	}

	// High O + Low C → distracted
	if (oScore >= 3.5 && cScore < 2.5) {
		teacherTableRows.push({
			visible: 'Distracted, off-task — follows tangents',
			underlying: 'Needs novelty, bored by repetition. Intellectual curiosity is real engagement, not defiance.',
			driver: 'High Openness + Low Conscientiousness',
		});
	} else if (oScore >= 3.5 && cScore < 3.0) {
		teacherTableRows.push({
			visible: 'Gets distracted easily, goes off-topic',
			underlying: `${studentName}'s curiosity is genuine intellectual engagement. An "explore later" notebook channels this without disrupting class.`,
			driver: 'High Openness',
		});
	}

	// High C + High E → appearing fine while burning out
	if (cScore >= 3.5 && eScore >= 3.5) {
		teacherTableRows.push({
			visible: 'Perfect student — no visible concerns',
			underlying: 'Burning out internally. High standards + high anxiety creates a student who always delivers but at significant personal cost.',
			driver: 'High Conscientiousness + High Emotionality',
		});
	}

	// Remaining conditional rows
	if (eScore >= 3.5 && !(cScore >= 3.5)) {
		teacherTableRows.push({
			visible: 'Seems overly anxious before tests',
			underlying: `${studentName}'s anxiety is genuine, not attention-seeking. Stress response can block retrieval even when material is known. Practice tests under realistic conditions reduce this.`,
			driver: 'High Emotionality',
		});
	}
	if (aScore < 2.5) {
		teacherTableRows.push({
			visible: 'Argues with group members, seems difficult',
			underlying: `${studentName} challenges weak ideas because they care about the outcome — this is quality drive, not aggression. Coaching on constructive framing channels it productively.`,
			driver: 'Low Agreeableness',
		});
	}
	if (hScore < 2.5 && xScore >= 3.5) {
		teacherTableRows.push({
			visible: 'Seems to be "playing the system"',
			underlying: `${studentName} is strategically social — a leadership skill when directed constructively. Give them legitimate roles that reward their social intelligence.`,
			driver: 'Low Honesty-Humility + High Extraversion',
		});
	}
	if (eScore < 2.5 && cScore < 2.5) {
		teacherTableRows.push({
			visible: 'Doesn\'t seem to care about grades',
			underlying: `${studentName} genuinely doesn't feel academic anxiety — meaning they lack the urgency that drives most students. External stakes (rewards, consequences) are required.`,
			driver: 'Low Emotionality + Low Conscientiousness',
		});
	}

	if (teacherTableRows.length > 0) {
		narrative.push('| What Teachers See | What\'s Actually Happening | Personality Driver |');
		narrative.push('|---|---|---|');
		teacherTableRows.forEach(row => {
			narrative.push(`| ${row.visible} | ${row.underlying} | ${row.driver} |`);
		});
	}

	// Score summary findings
	DIM_ORDER.forEach(key => {
		const dim = dimensions[key];
		if (!dim) return;
		const level = classifyLevel(dim.score);
		if (level === 'high' || level === 'low') {
			const impact = DIM_ACADEMIC_IMPACT[key];
			keyFindings.push({
				title: `${DIM_NAMES[key]}: ${interpretiveLabel(dim.score)}`,
				text: `${dim.score.toFixed(1)}/5 (${scorePercentile(dim.score)}th percentile) — ${level === 'high' ? impact.high : impact.low}.`,
				type: level === 'high' ? 'strength' : 'insight',
				color: DIM_COLORS[key],
			});
		}
	});

	return {
		narrative,
		keyFindings,
		researchNotes: [],
		scenarios: [],
		crossReferences: [
			{ targetSection: 'personality-deep-dive', text: 'See Section 2 for detailed analysis of each dimension.' },
			{ targetSection: 'action-plan', text: 'See Section 11 for specific next steps.' },
		],
		actions: [],
	};
}
