/**
 * Section 8: Strengths, Challenges & Growth
 * Per-dimension breakdown with inverse-aware facet classification.
 * Inverse facets (anxiety, fearfulness, dependence): high = weakness, low = strength.
 */
import {
	DIM_ORDER, DIM_COLORS, DIM_SHORT, DIM_ICONS, DIM_NAMES,
	formatScore, classifyDimensionFacets, isInverseFacet
} from './helpers.js';

export function generateStrengths(results) {
	const allStrengths = [];
	const allWeaknesses = [];

	const dimensions = DIM_ORDER.map((key) => {
		const dim = results.dimensions[key];
		const classified = classifyDimensionFacets(key, dim);

		const strengths = classified.strengths.map((f) => ({
			...f,
			score: formatScore(f.score),
			rawScore: f.score,
			analysis: getStrengthAnalysis(f.key, f.score),
			leverageTip: getLeverageTip(f.key)
		}));

		const weaknesses = classified.weaknesses.map((f) => ({
			...f,
			score: formatScore(f.score),
			rawScore: f.score,
			challenge: getWeaknessAnalysis(f.key, f.score),
			actionTip: getActionTip(f.key)
		}));

		allStrengths.push(...strengths);
		allWeaknesses.push(...weaknesses);

		return {
			key,
			name: DIM_NAMES[key],
			shortName: DIM_SHORT[key],
			icon: DIM_ICONS[key],
			score: formatScore(dim.score),
			color: DIM_COLORS[key],
			level: dim.level,
			strengths,
			weaknesses,
			whatToDo: buildWhatToDo(key, strengths, weaknesses, dim)
		};
	});

	return {
		dimensions,
		selfReflection: buildSelfReflection(),
		growthMindset: buildGrowthMindset(allStrengths, allWeaknesses)
	};
}

function getStrengthAnalysis(facetKey, score) {
	const analyses = {
		organization: 'Your natural sense of order means you rarely lose track of assignments. Notes are findable, deadlines met.',
		diligence: 'You put consistent effort into your work, even when the subject is not your favourite. This builds deep knowledge over time.',
		perfectionism: 'You hold yourself to high standards and double-check your work. Your assignments are thorough and polished.',
		prudence: 'You think before you act and consider consequences. You rarely make impulsive decisions.',
		fairness: 'You play by the rules and ensure equal contribution in group work. Others trust your integrity.',
		sincerity: 'You are genuine in your interactions. This honesty accelerates your learning.',
		social_self_esteem: 'You believe in your own worth and abilities, which translates to confidence in tackling challenging tasks.',
		social_boldness: 'You are comfortable speaking up in class, asking questions, and presenting work.',
		sociability: 'You build connections easily, making it natural to form study groups and collaborative partnerships.',
		liveliness: 'You bring energy and enthusiasm to learning, which is contagious and motivating for those around you.',
		inquisitiveness: 'You naturally ask "why?" and "what if?", deepening understanding beyond surface-level memorisation.',
		creativity: 'You think outside the box and find novel approaches to problems.',
		unconventionality: 'You are willing to challenge established thinking and try unusual approaches.',
		aesthetic_appreciation: 'You notice beauty and design in the world, enriching your experience across subjects.',
		forgiveness: 'You do not hold grudges after group conflicts, maintaining productive partnerships.',
		gentleness: 'You give feedback kindly and support others\' learning without being harsh.',
		flexibility: 'You adapt easily to changes in plans, assignments, and group dynamics.',
		patience: 'You can work steadily on challenging material without frustration.',
		greed_avoidance: 'You value genuine understanding over surface achievements and share resources freely.',
		modesty: 'You do not boast about achievements, making you approachable and genuine.',
		sentimentality: 'You connect emotionally with material, creating stronger and more personal memories.',
		// Inverse facets — low score = strength
		fearfulness: 'You face challenges without being paralysed by risk. This courage leads to growth experiences.',
		anxiety: 'You stay calm under pressure, allowing clear thinking during exams and deadlines.',
		dependence: 'You are emotionally self-sufficient and solve problems independently.'
	};
	return analyses[facetKey] || 'This trait contributes positively to your academic profile.';
}

function getLeverageTip(facetKey) {
	const tips = {
		organization: 'Create a "study command centre" with all your notes, schedules, and materials in one system.',
		diligence: 'Set stretch goals in your favourite subject — your work ethic can take you further than you think.',
		perfectionism: 'Use your high standards selectively: perfection on key assignments, "good enough" on daily tasks.',
		prudence: 'Before group decisions, offer to create a quick pros/cons analysis.',
		fairness: 'Volunteer to resolve disputes or mediate — your fairness is a leadership quality.',
		sincerity: 'Be the person who asks "I don\'t understand this" in class — others will thank you.',
		social_self_esteem: 'Take on challenges that stretch your abilities — your confidence will carry you through.',
		social_boldness: 'Present at assemblies, lead discussions, or mentor younger students.',
		sociability: 'Organise study events that combine social time with productive learning.',
		liveliness: 'Design engaging revision activities for your study group: games, quizzes, competitions.',
		inquisitiveness: 'Keep an "interesting questions" notebook — revisit them when you need motivation.',
		creativity: 'Submit creative alternatives to standard assignments where teachers allow it.',
		unconventionality: 'Propose innovative approaches in group projects, back them up with evidence.',
		aesthetic_appreciation: 'Make your notes and presentations visually beautiful — it aids recall.',
		forgiveness: 'Be the first to reconnect after group disagreements — it restores productivity quickly.',
		gentleness: 'Offer to explain difficult concepts to struggling classmates.',
		flexibility: 'When plans change, help others adapt — your calm flexibility is reassuring.',
		patience: 'Tackle the subjects others give up on too quickly — your persistence reveals hidden understanding.',
		greed_avoidance: 'Focus on learning for understanding rather than grades.',
		modesty: 'When you achieve something significant, practise saying "thank you" instead of "it was nothing."',
		sentimentality: 'Connect dry topics to human stories — every subject has a narrative that can engage your emotions.',
		fearfulness: 'Your courage is an asset — use it to try new extracurriculars and stretch experiences.',
		anxiety: 'Your calm demeanour is an asset in group work — others look to you for stability under pressure.',
		dependence: 'Your independence lets you thrive in self-directed learning — pursue independent study projects.'
	};
	return tips[facetKey] || 'Look for opportunities to apply this strength in your daily academic life.';
}

function getWeaknessAnalysis(facetKey, score) {
	const analyses = {
		// Standard facets — low score = weakness
		organization: 'Organisation is a challenge. Materials get lost, plans are vague. Start with one small system and build from there.',
		diligence: 'You find it hard to sustain effort, especially on tasks that feel pointless. External structure helps.',
		perfectionism: 'You tend to rush through without checking details. Important work benefits from one extra review.',
		prudence: 'You act on impulse, which can lead to avoidable mistakes. Pause before important decisions.',
		fairness: 'You may bend rules when it benefits you. Consider how this affects trust with others.',
		sincerity: 'You may use charm or diplomacy to avoid difficult truths. Practise authentic communication.',
		social_self_esteem: 'You doubt your social worth. Others likely see more value in you than you see in yourself.',
		social_boldness: 'You find it hard to speak up in groups. Start with one comment per class and build from there.',
		sociability: 'You prefer solitude, which is valid, but some collaboration strengthens learning. Don\'t completely isolate.',
		liveliness: 'Your energy is low-key. Adding one energising element to your routine can help engagement.',
		inquisitiveness: 'You learn what you need but don\'t explore further. Finding personal relevance in topics can help.',
		creativity: 'You prefer proven methods. Try "what if?" thinking occasionally to build creative confidence.',
		unconventionality: 'You stick to conventional approaches. Reading outside your comfort zone can broaden your perspective.',
		aesthetic_appreciation: 'You are practical rather than aesthetic. Try colour-coding notes to see if visual aids help.',
		forgiveness: 'You hold grudges, which creates tension in groups. Practise separating the person from the problem.',
		gentleness: 'You are blunt and direct. Consider how your delivery lands — a gentle correction teaches better.',
		flexibility: 'You resist change. Practise saying "What is the best way forward?" when plans shift.',
		patience: 'You get frustrated quickly. Take 3 deep breaths before reacting — patience improves with practice.',
		greed_avoidance: 'You are driven by rewards and recognition. Channel this ambition productively, but don\'t let it override your values.',
		modesty: 'You believe you are special and want others to know it. True leadership also requires humility.',
		sentimentality: 'You are emotionally detached. Connecting with the human side of what you study can aid memory.',
		// Inverse facets — high score = weakness
		fearfulness: 'You tend to avoid situations that feel risky or unfamiliar. New environments can feel overwhelming.',
		anxiety: 'You worry more than most, especially about things going wrong. Exam periods and deadlines can feel overwhelming.',
		dependence: 'You rely heavily on others for emotional support. Building some independence will serve you well.'
	};
	return analyses[facetKey] || 'This is an area where small improvements can create big results.';
}

function getActionTip(facetKey) {
	const tips = {
		// Standard facets — low score
		organization: 'Try a simple "top 3 tasks" daily list — minimal structure that still provides direction.',
		diligence: 'Start with the smallest possible task to build momentum. Action creates motivation.',
		perfectionism: 'For important work, set a timer for "quality review" — when it rings, submit what you have.',
		prudence: 'Before acting, ask yourself "Will I be glad I did this tomorrow?"',
		fairness: 'Reflect on a time when you wished someone treated you more fairly — use that empathy to guide your actions.',
		sincerity: 'Practise saying what you really think in low-stakes situations to build authenticity.',
		social_self_esteem: 'Keep a "wins" journal — write down one thing you did well each day.',
		social_boldness: 'Set a micro-challenge: ask one question in class this week, or share one idea in a group.',
		sociability: 'Schedule one social study session per week — keep it short and structured.',
		liveliness: 'Add one energising element to your study routine: music, a walk, or a fun warm-up activity.',
		inquisitiveness: 'Before each class, write one question about the topic to prime your brain.',
		creativity: 'Try "what if?" thinking once a week — brainstorm three unusual solutions to a problem.',
		unconventionality: 'Read one article outside your comfort zone each week.',
		aesthetic_appreciation: 'Try colour-coding your notes — you might discover visual aids help.',
		forgiveness: 'When someone frustrates you, pause and consider what pressures they might be under.',
		gentleness: 'Before giving feedback, ask yourself "How would I want to hear this?"',
		flexibility: 'When plans change, practise saying "Okay, what is the best way forward?"',
		patience: 'When frustrated, take 3 deep breaths before reacting.',
		greed_avoidance: 'Set goals about learning, not just results: "understand chapter 5" not just "get an A."',
		modesty: 'Practise accepting compliments with a simple "Thank you."',
		sentimentality: 'Watch a short documentary about the human side of what you are studying.',
		// Inverse facets — high score
		fearfulness: 'Face one small fear each week — the more you practise courage, the more natural it becomes.',
		anxiety: 'Learn box breathing (4-4-4-4) and practise daily, not just when anxious. Build a calming toolkit.',
		dependence: 'Try solving one problem completely on your own before asking for help — build your independence muscle.'
	};
	return tips[facetKey] || 'Set one small, specific goal related to this area and practise it weekly.';
}

function buildWhatToDo(dimKey, strengths, weaknesses, dim) {
	if (strengths.length === 0 && weaknesses.length === 0) {
		return 'Your scores in this area are balanced. Continue developing steadily across all facets.';
	}

	const parts = [];

	if (strengths.length > 0) {
		const names = strengths.map(s => s.name).join(' and ');
		parts.push(`Lean into your ${names} — ${strengths.length === 1 ? 'this is a' : 'these are'} genuine asset${strengths.length === 1 ? '' : 's'}.`);
	}

	if (weaknesses.length > 0) {
		parts.push(...weaknesses.map(w => w.actionTip));
	}

	return parts.join(' ');
}

function buildSelfReflection() {
	return [
		{
			question: 'What kind of learning environment makes you feel most alive and engaged?',
			purpose: 'Identifying your optimal conditions helps you seek them out deliberately.'
		},
		{
			question: 'When was the last time you surprised yourself with what you could do?',
			purpose: 'Recognising past growth builds confidence for future challenges.'
		},
		{
			question: 'What is one thing you avoid in school that might actually help you grow?',
			purpose: 'Our biggest growth opportunities often hide behind our resistances.'
		},
		{
			question: 'Who brings out the best in you as a learner, and why?',
			purpose: 'Understanding what works helps you build the right support network.'
		},
		{
			question: 'If you could change one study habit starting tomorrow, what would it be?',
			purpose: 'Small, specific changes are more sustainable than big overhauls.'
		}
	];
}

function buildGrowthMindset(allStrengths, allWeaknesses) {
	const topStrength = allStrengths.sort((a, b) => {
		if (isInverseFacet(a.key) && !isInverseFacet(b.key)) return 1;
		if (!isInverseFacet(a.key) && isInverseFacet(b.key)) return -1;
		return isInverseFacet(a.key) ? a.rawScore - b.rawScore : b.rawScore - a.rawScore;
	})[0];

	const topWeakness = allWeaknesses.sort((a, b) => {
		if (isInverseFacet(a.key) && !isInverseFacet(b.key)) return -1;
		if (!isInverseFacet(a.key) && isInverseFacet(b.key)) return 1;
		return isInverseFacet(a.key) ? b.rawScore - a.rawScore : a.rawScore - b.rawScore;
	})[0];

	return {
		message: 'Your personality traits are tendencies, not limits. The brain is remarkably adaptable: every time you practise a behaviour, you strengthen the neural pathways that support it.',
		keyPrinciple: 'Your top strengths are your foundation. Your growth areas are your opportunities. Neither defines your ceiling: effort and strategy do.',
		actionStep: `This week, use your strongest trait (${topStrength?.name || 'your top strength'}) to support your biggest growth area (${topWeakness?.name || 'your growth edge'}). For example, if you are high in Diligence but low in Sociability, commit to attending one study group session and staying for the full time.`
	};
}
