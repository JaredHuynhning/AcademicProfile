/**
 * Section 9: Strengths, Challenges & Self-Awareness
 * Deep analysis of top/bottom facets with reframing and reflection
 */
import { topFacets, bottomFacets, DIM_COLORS, DIM_SHORT, formatScore } from './helpers.js';

export function generateStrengths(results) {
	const top = topFacets(results.dimensions, 5);
	const bottom = bottomFacets(results.dimensions, 5);

	return {
		strengths: top.map((f) => ({
			...f,
			score: formatScore(f.score),
			color: DIM_COLORS[f.dimKey],
			dimShort: DIM_SHORT[f.dimKey],
			analysis: getStrengthAnalysis(f.key, f.score),
			leverageTip: getLeverageTip(f.key)
		})),
		challenges: bottom.map((f) => ({
			...f,
			score: formatScore(f.score),
			color: DIM_COLORS[f.dimKey],
			dimShort: DIM_SHORT[f.dimKey],
			reframe: getReframe(f.key, f.score),
			supportTip: getSupportTip(f.key)
		})),
		selfReflection: buildSelfReflection(results.dimensions),
		growthMindset: buildGrowthMindset(top, bottom)
	};
}

function getStrengthAnalysis(facetKey, score) {
	const analyses = {
		organization: {
			academic: 'Your natural sense of order means you rarely lose track of assignments. Notes are always findable, deadlines always met.',
			classroom: 'Teachers can rely on you to keep group projects on schedule. You set the standard for preparation.',
			leverage: 'Offer to be the project coordinator in group work — your planning skills benefit everyone.'
		},
		diligence: {
			academic: 'You put consistent effort into your work, even when the subject is not your favourite. This steady approach builds deep knowledge over time.',
			classroom: 'Teachers notice and appreciate your reliable work ethic. You complete what you start.',
			leverage: 'Use your diligence as a foundation for tackling increasingly challenging material — your effort will pay compound dividends.'
		},
		perfectionism: {
			academic: 'You hold yourself to high standards and double-check your work. Your assignments are typically thorough and polished.',
			classroom: 'Your attention to detail catches errors that others miss. Quality is your hallmark.',
			leverage: 'Channel perfectionism into fields that reward precision — science, mathematics, editing, programming.'
		},
		prudence: {
			academic: 'You think before you act, considering consequences carefully. This reduces careless mistakes and impulsive decisions.',
			classroom: 'You are a steadying influence in group work, helping the team avoid hasty decisions.',
			leverage: 'Your careful nature is an asset in research projects and long-term planning tasks.'
		},
		fairness: {
			academic: 'You play by the rules and ensure equal contribution in group work. Others trust your integrity.',
			classroom: 'You are the person others turn to when they need an honest opinion or fair arbitration.',
			leverage: 'Your fairness makes you an excellent peer tutor or study group leader.'
		},
		sincerity: {
			academic: 'You are genuine in your interactions and do not pretend to understand when you do not. This honesty accelerates your learning.',
			classroom: 'Teachers appreciate your authenticity — they know where you really stand.',
			leverage: 'Use your sincerity to build deep, trust-based study partnerships.'
		},
		social_self_esteem: {
			academic: 'You believe in your own worth and abilities, which translates to confidence in tackling challenging academic tasks.',
			classroom: 'You participate without excessive self-doubt, which allows you to focus on learning rather than worrying.',
			leverage: 'Your self-assurance helps you take on leadership roles and advocate for your ideas.'
		},
		social_boldness: {
			academic: 'You are comfortable speaking up in class, asking questions, and presenting work. This active engagement deepens understanding.',
			classroom: 'You volunteer for presentations and are not afraid to challenge ideas in discussion.',
			leverage: 'Seek out debate clubs, presentation opportunities, and roles that use your confidence.'
		},
		sociability: {
			academic: 'You build connections easily, making it natural to form study groups and collaborative partnerships.',
			classroom: 'You create a positive social atmosphere that makes group work enjoyable for everyone.',
			leverage: 'Organise study groups or peer tutoring sessions — your sociability makes learning social.'
		},
		liveliness: {
			academic: 'You bring energy and enthusiasm to learning, which is contagious and motivating for those around you.',
			classroom: 'Your positive energy lifts the mood and keeps group sessions engaging.',
			leverage: 'Channel your liveliness into dynamic study methods — teach-backs, debates, and interactive revision.'
		},
		inquisitiveness: {
			academic: 'You naturally ask "why?" and "what if?" — this deepens understanding beyond surface-level memorisation.',
			classroom: 'Your questions often lead to richer class discussions that benefit everyone.',
			leverage: 'Pursue independent research projects and extra-curricular academic exploration.'
		},
		creativity: {
			academic: 'You think outside the box and find novel approaches to problems. This is invaluable in subjects that reward original thinking.',
			classroom: 'Your creative contributions make group projects more innovative and interesting.',
			leverage: 'Seek subjects and assignments that reward creative thinking — art, design, creative writing, innovation challenges.'
		},
		unconventionality: {
			academic: 'You are willing to challenge established thinking and try unusual approaches. This drives innovation.',
			classroom: 'You bring fresh perspectives that challenge groupthink and expand everyone\'s thinking.',
			leverage: 'Use your unconventional thinking in brainstorming phases, then partner with organised peers for execution.'
		},
		aesthetic_appreciation: {
			academic: 'You notice beauty and design in the world, which enriches your experience across artistic and scientific subjects.',
			classroom: 'Your aesthetic sensibility brings quality to presentations, projects, and creative work.',
			leverage: 'Incorporate visual and aesthetic elements into your study materials — beautiful notes are more memorable.'
		},
		forgiveness: {
			academic: 'You do not hold grudges after group conflicts, allowing you to maintain productive partnerships.',
			classroom: 'Your ability to move past disagreements keeps group dynamics healthy.',
			leverage: 'Your forgiving nature makes you an excellent long-term study partner and team member.'
		},
		gentleness: {
			academic: 'You give feedback kindly and support others\' learning without being harsh or judgmental.',
			classroom: 'Peers feel safe sharing ideas around you, which creates a richer learning environment.',
			leverage: 'Your gentle approach makes you an excellent peer tutor or mentor for younger students.'
		},
		flexibility: {
			academic: 'You adapt easily to changes in plans, assignments, and group dynamics.',
			classroom: 'You handle unexpected changes (new topics, reshuffled groups) without resistance.',
			leverage: 'Your flexibility is an asset in rapidly changing environments — use it in interdisciplinary projects.'
		},
		patience: {
			academic: 'You can work steadily on challenging material without frustration, building understanding over time.',
			classroom: 'You wait for others to finish their thoughts and do not rush group decisions.',
			leverage: 'Your patience is a superpower for mastering complex, multi-step problems.'
		},
		greed_avoidance: {
			academic: 'You are not motivated by grades alone — you value genuine understanding over surface achievements.',
			classroom: 'You share resources freely and do not hoard knowledge or materials.',
			leverage: 'Your focus on intrinsic motivation leads to deeper, more lasting learning.'
		},
		modesty: {
			academic: 'You do not boast about achievements, which makes you approachable and genuine.',
			classroom: 'Peers are comfortable working with you because you do not make others feel inferior.',
			leverage: 'While modesty is admirable, ensure you also advocate for yourself when needed — your achievements deserve recognition.'
		},
		fearfulness: {
			academic: 'Your awareness of risk helps you prepare thoroughly and avoid careless mistakes.',
			classroom: 'You think carefully about consequences before acting, which prevents impulsive errors.',
			leverage: 'Channel your caution into thorough preparation — it gives you a genuine advantage in exams.'
		},
		anxiety: {
			academic: 'A moderate level of anxiety actually improves performance by driving preparation and focus.',
			classroom: 'Your concern about outcomes motivates you to study and prepare more than if you felt no pressure.',
			leverage: 'Learn to distinguish productive anxiety (drives preparation) from unproductive anxiety (causes paralysis).'
		},
		dependence: {
			academic: 'You value emotional support and connection, which can be channelled into strong study partnerships.',
			classroom: 'You work well with teachers and mentors who provide regular encouragement.',
			leverage: 'Build a support network of trusted study partners and mentors who understand your needs.'
		},
		sentimentality: {
			academic: 'You connect emotionally with material, which creates stronger and more personal memories.',
			classroom: 'Your emotional engagement makes humanities and social science topics come alive for you.',
			leverage: 'Use emotional connections to material as memory anchors — stories stick better than facts.'
		}
	};

	return analyses[facetKey] || {
		academic: 'This trait contributes positively to your academic profile.',
		classroom: 'It supports effective learning in the classroom.',
		leverage: 'Look for opportunities where this strength can make the biggest impact.'
	};
}

function getLeverageTip(facetKey) {
	const tips = {
		organization: 'Create a "study command centre" with all your notes, schedules, and materials in one organised system.',
		diligence: 'Set stretch goals in your favourite subject — your work ethic can take you further than you think.',
		perfectionism: 'Use your high standards selectively — perfection on key assignments, "good enough" on daily tasks.',
		prudence: 'Before group decisions, offer to create a quick pros/cons analysis — teams value this.',
		fairness: 'Volunteer to resolve disputes or mediate — your sense of fairness is a leadership quality.',
		sincerity: 'Be the person who asks "I don\'t understand this" in class — others will thank you.',
		social_self_esteem: 'Take on challenges that stretch your abilities — your confidence will carry you through.',
		social_boldness: 'Present at assemblies, lead discussions, or mentor younger students.',
		sociability: 'Organise study events that combine social time with productive learning.',
		liveliness: 'Design engaging revision activities for your study group — games, quizzes, competitions.',
		inquisitiveness: 'Keep an "interesting questions" notebook — revisit them when you need study motivation.',
		creativity: 'Submit creative alternatives to standard assignments where teachers allow it.',
		unconventionality: 'Propose innovative approaches in group projects — back them up with evidence.',
		aesthetic_appreciation: 'Make your notes and presentations visually beautiful — it aids your recall.',
		forgiveness: 'Be the first to reconnect after group disagreements — it restores productivity quickly.',
		gentleness: 'Offer to explain difficult concepts to struggling classmates — gentle teaching is effective teaching.',
		flexibility: 'When plans change, help others adapt — your calm flexibility is reassuring.',
		patience: 'Tackle the subjects others give up on too quickly — your persistence reveals hidden understanding.',
		greed_avoidance: 'Focus on learning for understanding rather than grades — this produces deeper, more transferable knowledge.',
		modesty: 'When you achieve something significant, practise saying "thank you" instead of "it was nothing."',
		fearfulness: 'Use your caution to prepare thoroughly, but set a limit on preparation to avoid over-studying.',
		anxiety: 'Develop a pre-exam routine that channels anxiety into focused preparation.',
		dependence: 'Choose study partners who are reliable and supportive — your best work comes with encouragement.',
		sentimentality: 'Connect dry topics to human stories — every subject has a narrative that can engage your emotions.'
	};
	return tips[facetKey] || 'Look for opportunities to apply this strength in your daily academic life.';
}

function getReframe(facetKey, score) {
	const reframes = {
		organization: 'Not disorganised — you think flexibly and adapt to changing circumstances. Your mind works in creative patterns rather than rigid structures.',
		diligence: 'Not lazy — you conserve energy for what truly matters to you. When you find your passion, your dedication is remarkable.',
		perfectionism: 'Not careless — you focus on the big picture rather than getting lost in details. This efficiency is valuable in many careers.',
		prudence: 'Not reckless — you are spontaneous and action-oriented. While this means occasional mistakes, it also means you seize opportunities others miss.',
		fairness: 'Not unfair — you are pragmatic and results-oriented. You understand that real-world success often requires strategic thinking.',
		sincerity: 'Not insincere — you are socially skilled and diplomatic. You read situations carefully and adapt your communication.',
		social_self_esteem: 'Not insecure — you are self-aware and realistic about your abilities. This humility drives genuine improvement.',
		social_boldness: 'Not timid — you are thoughtful and deliberate. When you do speak up, your contributions are well-considered and valuable.',
		sociability: 'Not antisocial — you are selective about your social energy. You form deep, meaningful connections rather than many surface-level ones.',
		liveliness: 'Not dull — you are calm and steady. Your consistent energy is an anchor for those around you, especially in stressful times.',
		inquisitiveness: 'Not incurious — you are focused and practical. You learn what you need efficiently without getting lost in tangents.',
		creativity: 'Not uncreative — you excel at implementation and refinement. You take existing ideas and make them work reliably.',
		unconventionality: 'Not boring — you are grounded and reliable. People trust your judgement because it is based on proven approaches.',
		aesthetic_appreciation: 'Not insensitive — you are pragmatic and results-focused. You value function over form, which is efficient.',
		forgiveness: 'Not vindictive — you have strong boundaries and remember lessons from past experiences. This protects you from repeat harm.',
		gentleness: 'Not harsh — you are direct and honest. People know where they stand with you, which some find refreshing.',
		flexibility: 'Not rigid — you have strong principles and preferences. Your consistency makes you predictable and reliable.',
		patience: 'Not impatient — you are action-oriented and efficient. You drive progress and do not tolerate unnecessary delays.',
		greed_avoidance: 'Not greedy — you are ambitious and goal-oriented. This drive pushes you to achieve things others only dream about.',
		modesty: 'Not arrogant — you know your worth and are not afraid to show it. Self-advocacy is an important life skill.',
		fearfulness: 'Not fearless — you embrace challenges without overthinking risks. This courage leads to growth experiences.',
		anxiety: 'Not anxious — you stay calm under pressure. While this is an advantage, remember to prepare adequately rather than relying on composure alone.',
		dependence: 'Not clingy — you are independent and self-sufficient. You solve problems on your own, which is a valuable life skill.',
		sentimentality: 'Not cold — you are analytical and objective. You make decisions based on logic, which serves you well in many academic and professional contexts.'
	};
	return reframes[facetKey] || 'This is not a weakness — it is a different strength that you have not fully explored yet.';
}

function getSupportTip(facetKey) {
	const tips = {
		organization: 'Try a simple "top 3 tasks" daily list — minimal structure that still provides direction.',
		diligence: 'Start with the smallest possible task to build momentum. Action creates motivation, not the other way around.',
		perfectionism: 'For important work, set a timer for "quality review" — when it rings, submit what you have.',
		prudence: 'Before acting impulsively, ask yourself "Will I be glad I did this tomorrow?"',
		fairness: 'Reflect on a time when you wished someone treated you more fairly — use that empathy to guide your actions.',
		sincerity: 'Practice saying what you really think in low-stakes situations to build the habit of authenticity.',
		social_self_esteem: 'Keep a "wins" journal — write down one thing you did well each day to build genuine confidence.',
		social_boldness: 'Set a micro-challenge: ask one question in class this week, or share one idea in a group.',
		sociability: 'Schedule one social study session per week — keep it short and structured to ease in.',
		liveliness: 'Add one energising element to your study routine — music, a walk between sessions, or a fun warm-up activity.',
		inquisitiveness: 'Before each class, write one question about the topic — this primes your brain for engagement.',
		creativity: 'Try "what if?" thinking once a week — take a problem and brainstorm three unusual solutions.',
		unconventionality: 'Read one article outside your comfort zone each week — broaden your perspective gradually.',
		aesthetic_appreciation: 'Try colour-coding your notes or creating visual summaries — you might discover a hidden appreciation.',
		forgiveness: 'When someone frustrates you in a group, pause and consider what pressures they might be under.',
		gentleness: 'Before giving feedback, ask yourself "How would I want to hear this?"',
		flexibility: 'When plans change, practice saying "Okay, what is the best way forward?" instead of resisting.',
		patience: 'When frustrated, take 3 deep breaths before reacting. Patience is a skill that improves with practice.',
		greed_avoidance: 'Set goals that are about learning, not just results — "understand chapter 5" not just "get an A."',
		modesty: 'Practice accepting compliments with a simple "Thank you" — you deserve recognition for your efforts.',
		fearfulness: 'Face one small fear each week — the more you practice courage, the more natural it becomes.',
		anxiety: 'Learn a calming technique (box breathing: 4-4-4-4) and practice it daily, not just when anxious.',
		dependence: 'Build a support network of 2-3 trusted people you can turn to when you need encouragement.',
		sentimentality: 'Watch a short documentary about the human side of what you are studying — emotional connection aids memory.'
	};
	return tips[facetKey] || 'Set one small, specific goal related to this area and practice it weekly.';
}

function buildSelfReflection(dimensions) {
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

function buildGrowthMindset(top, bottom) {
	return {
		message: 'Your personality traits are tendencies, not limits. The brain is remarkably adaptable — every time you practice a behaviour, you strengthen the neural pathways that support it.',
		keyPrinciple: 'Your top strengths are your foundation. Your growth areas are your opportunities. Neither defines your ceiling — effort and strategy do.',
		actionStep: `This week, use your strongest trait (${top[0]?.name || 'your top strength'}) to support your biggest growth area (${bottom[0]?.name || 'your growth edge'}). For example, if you are high in Diligence but low in Sociability, commit to attending one study group session and staying for the full time.`
	};
}
