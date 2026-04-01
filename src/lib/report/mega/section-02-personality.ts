/**
 * Mega Section 2: Who You Are — Personality Deep Dive
 * Generates ~8 pages of flowing, research-backed narrative for all 6 HEXACO dimensions.
 * Each dimension gets: overview narrative, 4 facet paragraphs, learning connection, developmental context.
 */
import { DIM_ORDER, DIM_NAMES, DIM_COLORS, DIM_SHORT, DIM_ICONS, classifyLevel, scorePercentile, interpretiveLabel, type DimKey, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote, CrossRef } from '../mega-sections';
import type { CrossRefResult } from '../cross-reference-engine';
import { pickOpener, renderInteractionCallout, renderInteractionAction, pickInteractionsForSection, detectFacetSurprises } from '../prose-variety';

interface DimData {
	score: number;
	level: string;
	name: string;
	facets: Record<string, { score: number; name?: string }>;
}

// ─── Research bank ──────────────────────────────────────────────────────────

const RESEARCH: Record<DimKey, { high: string; low: string; general: string }> = {
	H: {
		high: 'Research on Honesty-Humility shows that students scoring in the upper quartile are significantly less likely to engage in academic dishonesty and are rated as more trustworthy by peers and teachers (Ashton & Lee, 2007). They tend to form deeper, more authentic friendships.',
		low: 'Students with lower Honesty-Humility scores tend to be more competitive and status-oriented, which can drive strong academic performance when channelled constructively. Research suggests they may be drawn to leadership roles and entrepreneurial thinking (de Vries, 2012).',
		general: 'Honesty-Humility is the dimension that most distinguishes the HEXACO model from the traditional Big Five. It captures sincerity, fairness, greed avoidance, and modesty — traits that shape how a student interacts ethically with peers, teachers, and academic work.',
	},
	E: {
		high: 'Higher Emotionality is associated with greater empathy and emotional awareness, which benefits collaborative learning and social bonds. However, research shows it also correlates with higher test anxiety, meaning emotionally sensitive students may underperform on timed exams relative to their actual knowledge (Chamorro-Premuzic et al., 2008).',
		low: 'Students with lower Emotionality tend to remain calm under exam pressure, giving them an advantage in high-stakes testing situations. Research indicates they may be less likely to seek help when struggling, as they are less attuned to their own distress signals (Lee & Ashton, 2004).',
		general: 'Emotionality captures fearfulness, anxiety, dependence, and sentimentality. In academic contexts, it most directly affects how a student handles stress, exams, and social-emotional challenges.',
	},
	X: {
		high: 'Extraverted students participate more in class discussions and are more likely to form study groups. Research shows they tend to have larger social networks and report higher satisfaction with school, though they may struggle with sustained solo study (Poropat, 2009).',
		low: 'Introverted students often excel in deep, focused study and produce more thoughtful written work. Research on introversion in education suggests these students benefit from written participation options and smaller group sizes (Cain, 2012).',
		general: 'Extraversion in the HEXACO model encompasses social self-esteem, social boldness, sociability, and liveliness. It shapes how a student participates in class, forms study groups, and manages their social energy alongside academic demands.',
	},
	A: {
		high: 'Students high in Agreeableness create positive group dynamics and are rated as more likeable by peers. Research shows they tend to receive more social support, which buffers against academic stress (Jensen-Campbell & Graziano, 2001). However, they may avoid necessary conflict and defer too readily to others\' ideas.',
		low: 'Students lower in Agreeableness bring valuable critical thinking to group work. Research indicates they are more likely to challenge weak arguments and push for higher-quality outcomes, though they may need coaching on delivery to maintain productive working relationships (Graziano et al., 1996).',
		general: 'Agreeableness covers forgiveness, gentleness, flexibility, and patience. In schools, it most directly affects group work dynamics, teacher relationships, and how a student handles interpersonal conflict.',
	},
	C: {
		high: 'Conscientiousness is consistently the strongest personality predictor of academic achievement across all meta-analyses (Poropat, 2009). Students scoring high complete homework more reliably, plan study schedules, and persist through difficult material. Research shows a 0.2-0.3 correlation with GPA — equivalent to about one grade band difference.',
		low: 'Students with lower Conscientiousness often have untapped potential that is masked by inconsistent effort. Research shows that external structure (clear deadlines, accountability partners, structured routines) can substantially close the gap, effectively "borrowing" conscientiousness from the environment (Duckworth & Seligman, 2005).',
		general: 'Conscientiousness encompasses organisation, diligence, perfectionism, and prudence. It is the single most important personality dimension for academic success, influencing homework completion, study habits, time management, and long-term goal pursuit.',
	},
	O: {
		high: 'Students high in Openness tend to excel in creative and analytical subjects. Research shows they seek deeper understanding, read beyond the syllabus, and produce more original work. They may struggle with rote memorisation and highly structured, repetitive tasks (Chamorro-Premuzic & Furnham, 2008).',
		low: 'Students with lower Openness prefer clear instructions and proven methods. Research suggests they perform well in structured, applied subjects and vocational learning where practical skills are valued over abstract theorising (Furnham & Chamorro-Premuzic, 2004).',
		general: 'Openness to Experience covers aesthetic appreciation, inquisitiveness, creativity, and unconventionality. It shapes how a student approaches learning: whether they seek novelty and depth, or prefer clarity and practical application.',
	},
};

const DEVELOPMENTAL: Record<DimKey, string> = {
	H: 'Honesty-Humility tends to be relatively stable through adolescence, with modest increases as students develop stronger moral reasoning. Scores below 2.5 in teenagers do not indicate a character flaw — they often reflect a developmentally normal focus on self-interest that typically moderates with maturity and positive social experiences.',
	E: 'Emotionality often peaks during early-to-mid adolescence (ages 12-15), particularly anxiety and fearfulness. A currently high Emotionality score may naturally moderate as the student develops coping skills and gains life experience. Girls tend to score higher than boys on this dimension, reflecting both biological and socialisation factors.',
	X: 'Extraversion is one of the more stable personality dimensions, but classroom participation can be improved regardless of natural introversion. Research shows that structured participation formats (think-pair-share, written responses, small groups) allow introverted students to contribute at the same quality level as extraverts.',
	A: 'Agreeableness typically increases through the teenage years as social skills and empathy develop. A currently low score may reflect adolescent assertiveness rather than a fixed trait. Students often become more agreeable as they learn that collaboration and compromise are effective strategies — not signs of weakness.',
	C: 'Conscientiousness shows the largest developmental change of any personality dimension, typically increasing substantially between ages 15 and 25. A student who seems disorganised now may develop strong conscientiousness as their prefrontal cortex matures and they take on more responsibility. Early scaffolding (planners, routines, accountability) accelerates this natural development.',
	O: 'Openness tends to peak in late adolescence and early adulthood as students encounter diverse ideas and experiences. A currently moderate score may increase as the student is exposed to more varied subjects and learning approaches. Very high Openness in younger students sometimes manifests as distractibility — they follow every interesting tangent.',
};

// ─── Narrative generation ────────────────────────────────────────────────────

function dimNarrative(key: DimKey, dim: DimData, studentName: string): string[] {
	const score = dim.score;
	const pct = scorePercentile(score);
	const label = interpretiveLabel(score);
	const level = classifyLevel(score);
	const research = RESEARCH[key];
	const paras: string[] = [];

	// Para 1: Score context
	paras.push(
		`${studentName} scored ${score.toFixed(1)} out of 5.0 on ${DIM_NAMES[key]}, placing them at the ${pct}th percentile — ${label.toLowerCase()} compared to the general population. ${research.general}`
	);

	// Para 2: What this means (score-specific)
	if (level === 'high') {
		paras.push(research.high);
	} else if (level === 'low') {
		paras.push(research.low);
	} else {
		paras.push(
			`With a moderate score on ${DIM_NAMES[key]}, ${studentName} shows a balanced profile on this dimension. They can draw on both ends of the spectrum depending on the situation — adapting their approach to what the context demands. ${level === 'moderate' && score >= 3.0 ? research.high.split('. ').slice(0, 1).join('. ') + '.' : research.low.split('. ').slice(0, 1).join('. ') + '.'}`
		);
	}

	return paras;
}

function facetNarrative(key: DimKey, facetKey: string, facetName: string, score: number, studentName: string): string {
	const pct = scorePercentile(score);
	const level = classifyLevel(score);
	const descriptor = level === 'high' ? 'strong' : level === 'low' ? 'developing' : 'moderate';

	const scenarios: Record<string, Record<string, { high: string; low: string; mod: string }>> = {
		H: {
			sincerity: {
				high: `In group projects, ${studentName} is the person who gives honest feedback even when it's uncomfortable. Classmates learn to trust their assessments because they know ${studentName} won't sugarcoat or flatter.`,
				low: `${studentName} is socially strategic and may use charm to navigate group dynamics. While this can be effective, teachers should watch for whether genuine collaboration is happening beneath the surface.`,
				mod: `${studentName} balances honesty with social awareness, knowing when directness is helpful and when tact is needed.`,
			},
			fairness: {
				high: `When rules are unclear in group work, ${studentName} defaults to what's fair. They won't take credit for others' work and actively resist shortcuts that feel ethically questionable.`,
				low: `${studentName} is pragmatic about rules — they see them as guidelines rather than absolutes. This can drive creative problem-solving but may need channelling to ensure academic integrity.`,
				mod: `${studentName} follows rules when they make sense and questions them when they don't, showing a healthy balance of compliance and critical thinking.`,
			},
			greed_avoidance: {
				high: `Grades and prizes aren't ${studentName}'s primary motivation — they're more driven by genuine interest and understanding. This intrinsic motivation is a strong predictor of long-term academic success.`,
				low: `${studentName} is motivated by tangible rewards and recognition. Parents and teachers can leverage this by creating clear reward systems tied to academic milestones.`,
				mod: `${studentName} appreciates rewards but isn't consumed by them, maintaining a healthy balance between extrinsic motivation and genuine learning interest.`,
			},
			modesty: {
				high: `${studentName} doesn't need to be the smartest person in the room. They contribute quietly and let their work speak for itself — a trait that earns genuine respect from perceptive teachers.`,
				low: `${studentName} is confident about their abilities and wants recognition. This self-assurance can be channelled into leadership roles, presentations, and mentoring younger students.`,
				mod: `${studentName} knows their strengths without being showy about them — confident enough to contribute, modest enough to listen and learn from others.`,
			},
		},
		E: {
			fearfulness: {
				high: `New or unpredictable situations — a surprise test, a substitute teacher, a change in routine — can spike ${studentName}'s anxiety. Advance notice of changes and clear expectations reduce this stress significantly.`,
				low: `${studentName} is unfazed by new situations and takes risks readily. While this adaptability is a strength, ensure they're not dismissing genuine risks in areas like safety or exam preparation.`,
				mod: `${studentName} manages uncertainty reasonably well, feeling some healthy caution without being paralysed by it.`,
			},
			anxiety: {
				high: `Before exams, ${studentName} likely experiences significant worry that may affect sleep and concentration. A structured pre-exam routine — reviewing notes, planning answers, and practising relaxation techniques — can reduce anxiety to a productive level.`,
				low: `${studentName} stays remarkably calm before exams. This composure is an advantage, but it may also mean they don't feel the urgency to prepare thoroughly. Check that calm isn't masking complacency.`,
				mod: `${studentName} feels a healthy level of pre-exam nervousness that motivates preparation without becoming overwhelming — this is actually the optimal zone for academic performance.`,
			},
			dependence: {
				high: `${studentName} performs best when they know support is available. A check-in system with a teacher or parent — even brief — can provide the emotional safety net that lets them take academic risks.`,
				low: `${studentName} is emotionally self-sufficient and rarely asks for help. While this independence is admirable, encourage them to seek support when stuck — asking for help is a skill, not a weakness.`,
				mod: `${studentName} is comfortable both working independently and seeking support when needed — a healthy balance of self-reliance and help-seeking.`,
			},
			sentimentality: {
				high: `${studentName} forms deep emotional connections and is highly empathetic. They may be the person classmates confide in. This emotional depth enriches their understanding of literature, history, and social sciences.`,
				low: `${studentName} is emotionally pragmatic and doesn't get caught up in feelings. This objectivity is a strength in analytical subjects, though they may benefit from consciously practising empathy in collaborative settings.`,
				mod: `${studentName} balances empathy with emotional steadiness — caring about others without being overwhelmed by their emotions.`,
			},
		},
		X: {
			social_self_esteem: {
				high: `${studentName} feels confident and valued in social situations. This self-assurance translates to willingness to take academic risks — asking questions, presenting ideas, and participating in discussions.`,
				low: `${studentName} may doubt their social value, which can suppress classroom participation. Building small social wins (positive peer feedback, successful group contributions) gradually rebuilds this confidence.`,
				mod: `${studentName} has reasonable social confidence — comfortable in most situations but occasionally self-conscious in high-stakes social moments.`,
			},
			social_boldness: {
				high: `${studentName} is comfortable being the centre of attention. They volunteer answers, lead discussions, and thrive in presentation settings. Channel this boldness into class leadership roles.`,
				low: `Speaking up in large groups feels daunting for ${studentName}. Start with one contribution per class, then build gradually. Written participation (chat, forums, shared documents) can bridge the gap.`,
				mod: `${studentName} can speak up when needed but doesn't seek the spotlight. They adapt their participation level to the social demands of each situation.`,
			},
			sociability: {
				high: `${studentName} draws energy from being around people. Solo study may feel isolating — they'll perform better with scheduled social study sessions balanced with focused individual time.`,
				low: `${studentName} prefers solitude or very small groups. They recharge alone and do their best thinking in quiet environments. Honour this preference while ensuring they don't completely isolate from collaborative learning.`,
				mod: `${studentName} enjoys social time but also values solitude — a flexible balance that works well across different learning settings.`,
			},
			liveliness: {
				high: `${studentName} brings natural energy and enthusiasm to group work. Their positive mood is contagious and lifts the productivity of teams they join.`,
				low: `${studentName} has a quieter, more reflective energy. This isn't a lack of engagement — it's a different processing style that often produces deeper, more considered contributions.`,
				mod: `${studentName} has a steady, balanced energy — reliably engaged without being the loudest person in the room.`,
			},
		},
		A: {
			forgiveness: {
				high: `${studentName} lets things go quickly, which keeps group dynamics smooth. They don't hold grudges from past project conflicts, allowing each collaboration to start fresh.`,
				low: `${studentName} remembers perceived wrongs, which can create lasting tension in group settings. Coaching them to separate the person from the problem can help maintain productive relationships.`,
				mod: `${studentName} can forgive but doesn't forget — they give second chances while keeping track of patterns.`,
			},
			gentleness: {
				high: `${studentName} communicates kindly and considers others' feelings. They give constructive feedback that people can actually hear and act on.`,
				low: `${studentName}'s directness can sting. While their honesty is valuable, coaching them to frame feedback constructively helps their good ideas actually land.`,
				mod: `${studentName} balances kindness with directness — honest enough to say what needs saying, gentle enough that people listen.`,
			},
			flexibility: {
				high: `${studentName} adapts easily to others' ideas and preferences. This flexibility makes them easy to work with but may mean their own ideas don't get enough airtime. Encourage them to advocate for their perspectives.`,
				low: `${studentName} holds firmly to their positions. This conviction can drive quality, but they need to learn that compromise is sometimes the faster path to a good outcome.`,
				mod: `${studentName} compromises when it makes sense and stands firm when it matters — a healthy balance of flexibility and conviction.`,
			},
			patience: {
				high: `${studentName} stays calm even when projects derail or group members underperform. This patience is a rare strength that makes them an anchor in stressful group situations.`,
				low: `${studentName} gets frustrated quickly when things don't go as planned. Developing patience strategies — counting to five, taking a walk, reframing the delay — will improve both their work quality and their relationships.`,
				mod: `${studentName} has normal patience — they can wait out most difficulties but get frustrated by prolonged, seemingly unnecessary obstacles.`,
			},
		},
		C: {
			organization: {
				high: `${studentName}'s notes, files, and workspace are likely well-structured. They probably have systems for tracking deadlines and organising materials — this is a powerful academic advantage that many students lack.`,
				low: `Organisation is a significant challenge for ${studentName}. Materials get lost, plans are vague, and physical spaces are cluttered. Start with one small system — a single folder for current work, a simple to-do list — and build from there.`,
				mod: `${studentName} is organised enough to function well without stressing about perfect systems — a practical approach that serves most academic demands.`,
			},
			diligence: {
				high: `${studentName} is the person who finishes what they start, even when the work becomes tedious. This persistence through boring-but-necessary tasks is what separates consistent achievers from talented underperformers.`,
				low: `Sustained effort is a challenge, especially on tasks that feel pointless. External structure — timers, accountability partners, breaking work into 15-minute chunks — effectively compensates for lower natural diligence.`,
				mod: `${studentName} can push through most tasks but may drift on work that doesn't interest them — a common pattern that targeted motivation strategies can address.`,
			},
			perfectionism: {
				high: `${studentName} sets very high standards and checks their work carefully. This produces quality output but can also cause procrastination ("if I can't do it perfectly, I won't start") and excessive time on individual assignments. Teaching them when "good enough" truly is good enough is a valuable skill.`,
				low: `${studentName} prioritises getting things done over getting them perfect. This speed is an asset for volume and deadlines, but encourage an extra review pass on important submissions.`,
				mod: `${studentName} aims for quality without obsessing — a healthy balance between standards and efficiency.`,
			},
			prudence: {
				high: `${studentName} thinks before acting and considers consequences. They rarely make impulsive academic decisions, which protects them from avoidable mistakes on exams and assignments.`,
				low: `${studentName} tends to act on impulse, which can lead to careless errors on exams and rushed assignment submissions. Teaching a "pause and think" habit before submitting work can make a significant difference.`,
				mod: `${studentName} balances thoughtfulness with reasonable spontaneity — careful when it matters, decisive when speed is needed.`,
			},
		},
		O: {
			aesthetic_appreciation: {
				high: `${studentName} notices beauty in art, design, and the world around them. Visual learning methods — mind maps, colour-coded notes, graphic organisers, illustrated summaries — will resonate strongly.`,
				low: `${studentName} is practical rather than aesthetic. Straightforward, no-frills study materials work best. Decorating notes doesn't help recall unless the visual encoding genuinely aids memory.`,
				mod: `${studentName} appreciates aesthetics when prompted but doesn't need visual stimulation to learn effectively.`,
			},
			inquisitiveness: {
				high: `${studentName} loves learning for its own sake — they read beyond the syllabus, ask "why?" constantly, and get genuinely excited by new ideas. This intellectual curiosity is an academic superpower that predicts lifelong learning.`,
				low: `${studentName} views learning as a means to an end rather than an inherently rewarding activity. Finding personal relevance ("why does this matter to ME?") and connecting material to real-world applications dramatically improves engagement.`,
				mod: `${studentName} is curious about topics that interest them but doesn't seek out knowledge for fun across all areas — a common and perfectly healthy pattern.`,
			},
			creativity: {
				high: `${studentName} thinks in original, unconventional ways — seeing connections others miss and generating ideas that stand out. Open-ended projects, creative writing, and design-thinking exercises showcase this strength.`,
				low: `${studentName} excels with proven methods and established approaches. Their reliability in execution and implementation is genuinely valuable — not every situation needs innovation.`,
				mod: `${studentName} can be creative when the situation calls for it but also works comfortably within established frameworks — a versatile approach.`,
			},
			unconventionality: {
				high: `${studentName} questions norms and explores unusual ideas. They're comfortable with ambiguity and may challenge conventional thinking in ways that are productive — if sometimes disruptive to traditional classroom structures.`,
				low: `${studentName} prefers traditional, well-established approaches and clear expectations. They find comfort in proven methods, which is a genuine strength in structured subjects and standardised assessments.`,
				mod: `${studentName} balances conventional and unconventional thinking — knowing when to follow established methods and when creative approaches add value.`,
			},
		},
	};

	const dimScenarios = scenarios[key];
	if (!dimScenarios || !dimScenarios[facetKey]) {
		return `**${facetName}** (${score.toFixed(1)}/5, ${pct}th percentile): ${studentName} shows a ${descriptor} level of ${facetName}. This facet influences how they approach academic tasks and social interactions in the classroom.`;
	}

	const s = dimScenarios[facetKey];
	const scenario = level === 'high' ? s.high : level === 'low' ? s.low : s.mod;

	// Add academic implication paragraph for each facet
	const implications = getAcademicImplication(key, facetKey, score, studentName);

	return `**${facetName}** (${score.toFixed(1)}/5, ${pct}th percentile): ${scenario}${implications ? ' ' + implications : ''}`;
}

function getAcademicImplication(dimKey: DimKey, facetKey: string, score: number, studentName: string): string {
	const level = classifyLevel(score);
	const impls: Record<string, Record<string, { high: string; low: string; mod: string }>> = {
		E: {
			fearfulness: {
				high: `In school, ${studentName} may avoid new activities, unfamiliar subjects, or unpredictable situations. Advance preparation and clear expectations for what's coming reduce this anxiety significantly.`,
				low: `${studentName}'s fearlessness is an advantage for new experiences — new schools, new subjects, new social groups. But ensure they're not dismissing real risks in exam preparation or safety.`,
				mod: `${studentName} manages uncertainty well enough to try new things without being reckless — a healthy balance for academic exploration.`,
			},
			anxiety: {
				high: `This facet most directly affects exam performance. ${studentName}'s anxiety may cause "blanking" under time pressure — they know the material but can't access it when stressed. Practice exams under realistic conditions build familiarity that reduces this effect. The 4-7-8 breathing method (4 seconds in, 7 hold, 8 out) practised daily becomes an automatic calming response.`,
				low: `${studentName}'s low anxiety is a genuine exam advantage — they stay clear-headed under pressure. However, ensure this calm isn't masking under-preparation. Students with low anxiety sometimes don't feel the productive nervousness that motivates thorough revision.`,
				mod: `${studentName} experiences healthy pre-exam anxiety that actually helps performance — enough to motivate preparation without causing impairment. This is the optimal zone.`,
			},
			dependence: {
				high: `${studentName} performs best when they know support is available — even if they don't use it. A weekly check-in provides the emotional safety net that gives them confidence to tackle challenging material independently.`,
				low: `${studentName}'s independence is a strength for self-directed learning but may prevent them from asking for help when genuinely stuck. Frame help-seeking as strategic: "Top students ask more questions, not fewer."`,
				mod: `${studentName} balances independence with willingness to seek help — a functional approach that serves most academic demands.`,
			},
			sentimentality: {
				high: `${studentName}'s emotional depth is an academic asset in humanities — literature, history, psychology, ethics. They understand characters and historical figures at a deeper level because they feel what others felt. Channel this into essay writing where emotional insight distinguishes great answers.`,
				low: `${studentName}'s emotional detachment helps in analytical subjects where objectivity is valued. In humanities, encourage perspective-taking exercises: "What would this person have felt and why?"`,
				mod: `${studentName} can engage emotionally when needed and detach when objectivity serves better. This emotional flexibility is a versatile academic tool.`,
			},
		},
		X: {
			social_self_esteem: {
				high: `This confidence translates directly into academic risk-taking: asking questions, volunteering answers, presenting to the class. ${studentName} is less inhibited by fear of looking foolish, which means they learn from public interactions that other students avoid.`,
				low: `Low social self-esteem can create a vicious cycle: not participating → not getting feedback → not improving → feeling less confident. Breaking this requires small, low-risk participation opportunities where success is likely.`,
				mod: `${studentName} has enough social confidence to participate meaningfully in class without seeking attention — a comfortable balance for most learning environments.`,
			},
			social_boldness: {
				high: `${studentName} is natural presenter material. Use this for class presentations, oral assessments, and leading study groups. Their comfort with public attention means these high-anxiety tasks are energy-neutral or even energising for them.`,
				low: `Public speaking is a significant stressor. Preparation reduces anxiety dramatically: practising in front of a mirror, then one person, then a small group builds confidence gradually. Never spring a presentation without preparation time.`,
				mod: `${studentName} can handle presentations when prepared but doesn't actively seek them out — standard classroom participation is manageable.`,
			},
			sociability: {
				high: `Build social study into the routine: study groups, peer teaching, discussion-based review. ${studentName} retains information better when they've talked about it. But set clear boundaries — "study group" must include actual studying.`,
				low: `Protect ${studentName}'s solo study time. Their best learning happens in quiet, focused solitude. Limit required group work to what's genuinely necessary and allow independent preparation before collaboration.`,
				mod: `${studentName} can switch between collaborative and solo learning as needed — a flexible approach across different classroom formats.`,
			},
			liveliness: {
				high: `${studentName}'s enthusiasm is contagious and lifts the energy of any group they join. Channel this into study groups, tutoring younger students, or leading classroom activities where positive energy enhances learning for everyone.`,
				low: `${studentName}'s quieter energy is not disengagement — it's a different processing style. They often produce more thoughtful, nuanced work because they process internally before responding.`,
				mod: `${studentName}'s balanced energy means they engage reliably without being the loudest in the room — a steady presence in varied settings.`,
			},
		},
		A: {
			forgiveness: {
				high: `In group projects, ${studentName}'s ability to move past conflicts quickly keeps teams functional. They don't carry grudges from one project to the next, allowing each collaboration to start fresh.`,
				low: `Past group work conflicts may colour future attitudes toward the same students. When assigning groups, be aware of previous negative experiences. Teaching the "clean slate" principle gradually builds this capacity.`,
				mod: `${studentName} can move past minor conflicts while learning from significant ones — a practical approach to group dynamics.`,
			},
			gentleness: {
				high: `${studentName}'s kind communication makes them effective peer tutors and study partners. People feel safe asking questions and admitting confusion, creating a positive learning environment.`,
				low: `${studentName}'s bluntness can be valuable in academic critique — they spot weak arguments and point out errors others are too polite to mention. Coach them to frame critiques constructively.`,
				mod: `${studentName} balances kindness with honesty — direct enough to give useful feedback, gentle enough that people can hear it.`,
			},
			flexibility: {
				high: `${studentName}'s willingness to compromise makes group work smoother but may mean their best ideas don't surface. Actively solicit their input before group consensus forms.`,
				low: `${studentName}'s conviction can drive higher-quality group work. But group projects require give-and-take. Frame compromise as a strategic choice, not a weakness.`,
				mod: `${studentName} knows when to compromise and when to stand firm — a balanced approach that produces good outcomes in most collaborative settings.`,
			},
			patience: {
				high: `${studentName}'s patience is a stabilising force in group work and a significant advantage for long, complex tasks that frustrate less patient students. They can sustain effort through repetitive revision and multi-week projects.`,
				low: `Frustration tolerance is a learnable skill. Teach ${studentName} to recognise the frustration signal and take a 60-second pause before reacting. Over time, this pause extends naturally.`,
				mod: `${studentName}'s patience is adequate for most academic demands — they handle reasonable delays and setbacks without significant frustration.`,
			},
		},
		O: {
			aesthetic_appreciation: {
				high: `${studentName} learns better when materials are visually appealing. Colour-coded notes, mind maps, infographics, and well-designed presentations all enhance engagement and retention. Invest in visual study tools.`,
				low: `Minimalist, no-frills study materials work best. Don't waste time decorating notes — ${studentName}'s practical approach means function trumps form every time.`,
				mod: `${studentName} appreciates visual quality when present but doesn't need it to learn effectively.`,
			},
			inquisitiveness: {
				high: `This is ${studentName}'s academic superpower. Their natural curiosity drives deeper understanding, wider reading, and genuine engagement. The challenge is directing this curiosity productively — toward exam-relevant material during revision, and toward exploration during free time.`,
				low: `The most effective strategy: relevance connection. Every lesson should answer "Why should I care?" with a specific, honest answer. Finding personal relevance transforms obligation into interest.`,
				mod: `${studentName} is curious about topics that interest them and practical about topics that don't — a common and functional pattern.`,
			},
			creativity: {
				high: `Open-ended assignments are where ${studentName} shines — projects, essays, presentations, and design tasks showcase their ability to generate original ideas. Structured formats may feel constraining but still need mastering for exams.`,
				low: `${studentName} excels with clear templates, worked examples, and step-by-step instructions. This is a preference for efficiency that produces reliable, consistent work.`,
				mod: `${studentName} can be creative when the task calls for it and systematic when it doesn't — a versatile approach across assessment types.`,
			},
			unconventionality: {
				high: `${studentName} may challenge classroom norms — sometimes productively, sometimes disruptively. Channel this into debate, creative writing, or research projects where questioning assumptions is valued.`,
				low: `${studentName} is comfortable with established methods and clear expectations. They thrive in predictable assessment formats — this reliability is a genuine strength in structured education.`,
				mod: `${studentName} follows conventions when they make sense and questions them when they don't — a balanced approach to intellectual conformity.`,
			},
		},
		H: {
			sincerity: {
				high: `For academic work, this means ${studentName}'s written and verbal contributions will be authentic and well-considered. Teachers can trust that submitted work is genuinely their own and that self-assessments are honest.`,
				low: `Academically, ${studentName} may present work strategically — focusing on what makes the best impression rather than what represents their genuine understanding. Encourage authentic engagement over performance.`,
				mod: `In academic settings, ${studentName} strikes a productive balance between presenting their best work and being genuinely reflective about their understanding.`,
			},
			fairness: {
				high: `This strong ethical compass translates directly to academic integrity. ${studentName} is unlikely to plagiarise, cheat on exams, or take unfair advantages — and they may be troubled when they see others doing so.`,
				low: `In competitive academic environments, monitor for potential shortcuts. ${studentName}'s pragmatism about rules is not inherently problematic, but explicit conversations about academic integrity boundaries are important.`,
				mod: `${studentName} navigates academic ethics with reasonable judgement — following important rules while questioning those that seem arbitrary.`,
			},
			greed_avoidance: {
				high: `This makes ${studentName} resilient against the common trap of studying "for the grade" rather than understanding. They are more likely to retain information long-term because their learning is driven by genuine interest.`,
				low: `Use this reward-orientation constructively: set up grade targets with meaningful rewards, create visible progress trackers, and frame achievement as a game to be won.`,
				mod: `${studentName} has a healthy relationship with rewards — motivated by them without being consumed. This balanced motivational profile works well across most academic contexts.`,
			},
			modesty: {
				high: `In class, ${studentName} may not volunteer answers even when they know them. Encourage them to share their knowledge — their modesty is admirable but shouldn't prevent them from participating in discussions.`,
				low: `${studentName}'s self-confidence can be channelled into leadership roles — class presentations, mentoring younger students, or leading study groups where their confidence inspires others.`,
				mod: `${studentName} contributes to discussions without dominating them — a balanced participation style that works well in most classroom settings.`,
			},
		},
		C: {
			organization: {
				high: `This organisational strength means ${studentName} rarely loses materials, forgets deadlines, or arrives unprepared. Their filing systems and note-taking are likely among the best in their year group.`,
				low: `The most impactful immediate intervention: a single dedicated folder for current work, cleared weekly. Organisation builds from small, consistent systems — not from a complete overhaul.`,
				mod: `${studentName}'s organisation is sufficient for current demands but may need strengthening as workload increases in later years.`,
			},
			diligence: {
				high: `This is the trait that separates consistent achievers from talented underperformers. ${studentName}'s diligence means they complete revision even when bored, finish long-term projects on time, and push through the difficult middle phase of any task.`,
				low: `The key compensating strategy is making tasks smaller and more frequent. Instead of "revise chapter 5" it's "do 10 practice questions from chapter 5." Smaller bites are easier to swallow.`,
				mod: `${studentName} can sustain effort on tasks that feel meaningful but may drift on work perceived as pointless. Helping them see the purpose in routine tasks bridges this gap.`,
			},
			perfectionism: {
				high: `Watch for the perfectionism trap: spending 4 hours on a task worth 30 minutes, refusing to submit "imperfect" work, or procrastinating because the standard feels unachievable. Teaching ${studentName} to calibrate effort to task importance is critical.`,
				low: `${studentName} gets things done quickly and doesn't agonise over details. This efficiency is valuable — but encourage one extra review pass on important submissions. The difference between a 70% and 80% grade is often in the polish.`,
				mod: `A healthy balance — ${studentName} aims for quality without paralysing themselves with perfectionism. They know when to polish and when to ship.`,
			},
			prudence: {
				high: `${studentName} thinks before acting, which means fewer careless mistakes on exams, fewer impulsive subject choices, and more considered long-term planning. This careful approach is a genuine academic advantage.`,
				low: `Impulsive decisions in academic contexts — rushing through exam questions, choosing subjects on a whim, starting assignments without reading the brief — can be costly. A simple "read, pause, plan" protocol before any academic task adds the deliberation that doesn't come naturally.`,
				mod: `${studentName} balances speed with thoughtfulness — careful when it matters, decisive when speed is needed.`,
			},
		},
	};

	const dimImpls = impls[dimKey];
	if (!dimImpls || !dimImpls[facetKey]) return '';
	const impl = dimImpls[facetKey];
	return level === 'high' ? impl.high : level === 'low' ? impl.low : impl.mod;
}

// ─── Main generator ──────────────────────────────────────────────────────────

export function generatePersonalityDeepDive(
	dimensions: DimensionsMap,
	studentName: string,
	crossRefResult: CrossRefResult | null,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];
	const crossReferences: CrossRef[] = [];

	// Intro paragraph
	narrative.push(
		`${pickOpener(studentName, 2)} a personality profile that shapes every aspect of their academic experience. This section provides a detailed analysis across all six HEXACO dimensions — what the scores mean, how each facet manifests in daily academic life, what research tells us about students with similar profiles, and how this dimension is likely to develop over time. Understanding these patterns is the foundation for every recommendation in this report.`
	);

	// Inject relevant interactions
	const relevantInteractions = pickInteractionsForSection(
		crossRefResult?.interactions ?? [], 2, 2, ['parent', 'student']
	);
	relevantInteractions.forEach((interaction, idx) => {
		narrative.push(renderInteractionCallout(interaction, 2 + idx));
		narrative.push(renderInteractionAction(interaction, idx));
	});

	for (const key of DIM_ORDER) {
		const dim = dimensions[key];
		if (!dim) continue;

		// Dimension header + overview
		const dimParas = dimNarrative(key, dim as DimData, studentName);
		narrative.push(`\n### ${DIM_NAMES[key]}`);
		narrative.push(...dimParas);

		// Research note
		const research = RESEARCH[key];
		const level = classifyLevel(dim.score);
		researchNotes.push({
			text: level === 'high' ? research.high : level === 'low' ? research.low : research.general,
			topic: DIM_NAMES[key],
		});

		// Facet narratives
		narrative.push(`\n#### Understanding ${studentName}'s Four Facets`);
		const facets = dim.facets || {};
		for (const [fKey, fData] of Object.entries(facets)) {
			const fName = fData.name || fKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
			narrative.push(facetNarrative(key, fKey, fName, fData.score, studentName));
		}

		// Developmental context
		narrative.push(`\n#### Developmental Perspective`);
		narrative.push(DEVELOPMENTAL[key]);

		// Cross-reference
		if (key === 'C') {
			crossReferences.push({ targetSection: 'study-playbook', text: `${studentName}'s Conscientiousness score directly shapes the study strategies recommended in Section 5.` });
		}
		if (key === 'E') {
			crossReferences.push({ targetSection: 'barriers', text: `${studentName}'s Emotionality score affects exam anxiety patterns analysed in Section 7.` });
		}
		if (key === 'X') {
			crossReferences.push({ targetSection: 'social-dynamics', text: `${studentName}'s Extraversion shapes the group work strategies in Section 8.` });
		}

		// Key finding
		const topFacet = Object.entries(facets).sort((a, b) => Math.abs(b[1].score - 3.0) - Math.abs(a[1].score - 3.0))[0];
		if (topFacet) {
			const [tfKey, tfData] = topFacet;
			const tfName = tfData.name || tfKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
			const extreme = tfData.score >= 3.5 ? 'strength' : tfData.score < 2.5 ? 'barrier' : 'insight';
			keyFindings.push({
				title: `${DIM_NAMES[key]}: ${tfName}`,
				text: `${studentName}'s most distinctive facet in ${DIM_NAMES[key]} is ${tfName} (${tfData.score.toFixed(1)}/5). This is where personality most strongly shapes their academic experience.`,
				type: extreme,
				color: DIM_COLORS[key],
			});
		}
	}

	// ─── Facet Surprises ────────────────────────────────────────────────────────
	const surprises = detectFacetSurprises(dimensions, studentName);
	if (surprises.length > 0) {
		narrative.push('\n#### Hidden Details in the Data');
		surprises.slice(0, 4).forEach(s => narrative.push(s));
	}

	// ─── Dimension Interactions ──────────────────────────────────────────────────
	narrative.push('\n### How Dimensions Interact');
	narrative.push(
		`${pickOpener(studentName, 12)} that personality dimensions don't operate in isolation — they interact in ways that create unique behavioural patterns. ${studentName}'s most significant dimension interactions are:`
	);

	const cScore = dimensions.C?.score || 3.0;
	const eScore = dimensions.E?.score || 3.0;
	const oScore = dimensions.O?.score || 3.0;
	const xScore = dimensions.X?.score || 3.0;
	const aScore = dimensions.A?.score || 3.0;

	// C × O interaction
	if (cScore >= 3.5 && oScore >= 3.5) {
		narrative.push(
			`**Conscientiousness × Openness (both high):** This is the "curious scholar" combination — ${studentName} both explores ideas enthusiastically AND follows through with disciplined execution. This interaction predicts the highest academic achievement of any personality combination (Poropat, 2009). ${studentName} doesn't just have good ideas — they finish them.`
		);
	} else if (cScore < 2.5 && oScore >= 3.5) {
		narrative.push(
			`**Low Conscientiousness × High Openness:** This is the "brilliant but scattered" combination. ${studentName} has exceptional curiosity and creative thinking but struggles to channel it into consistent output. They start many projects but may finish few. The intervention: external structure (deadlines, milestones, accountability) that provides the discipline their personality doesn't. Their ideas are excellent — they just need help with execution.`
		);
	} else if (cScore >= 3.5 && oScore < 2.5) {
		narrative.push(
			`**High Conscientiousness × Low Openness:** This is the "reliable executor" combination. ${studentName} is methodical, consistent, and thorough but may lack creative spark. They excel in structured subjects with clear expectations. For creative tasks, provide templates and examples rather than open-ended prompts — they'll produce excellent work when given a framework to execute within.`
		);
	}

	// E × X interaction
	if (eScore >= 3.5 && xScore < 2.5) {
		narrative.push(
			`**High Emotionality × Low Extraversion:** ${studentName} feels deeply but expresses quietly. They may experience intense emotions about academic work (anxiety, pride, frustration) without showing them outwardly. Adults should check in regularly — their calm exterior may mask significant internal struggle. Ask directly: "How are you feeling about [subject]?" rather than relying on visible cues.`
		);
	} else if (eScore < 2.5 && xScore >= 3.5) {
		narrative.push(
			`**Low Emotionality × High Extraversion:** ${studentName} is socially confident and emotionally steady — the classic "easygoing popular kid" profile. Their social comfort may lead adults to assume everything is fine, even when academic performance is slipping. They're unlikely to show distress about poor grades. Monitor progress data (grades, completion rates) rather than relying on ${studentName}'s self-report, which will almost always be "fine."`
		);
	}

	// A × C interaction
	if (aScore >= 3.5 && cScore >= 3.5) {
		narrative.push(
			`**High Agreeableness × High Conscientiousness:** ${studentName} is the ideal group project member — cooperative, reliable, and hardworking. However, this combination can lead to taking on too much responsibility: they agree to extra work (agreeableness) and then feel compelled to deliver it perfectly (conscientiousness). Watch for overcommitment and teach them to set boundaries: "I can do A or B, but not both this week."`
		);
	}

	narrative.push(
		`These interactions are unique to ${studentName}'s specific score combination. They create behavioural patterns that wouldn't be predicted from any single dimension alone, which is why a comprehensive personality assessment is more useful than a single-trait measure.`
	);

	return {
		narrative,
		keyFindings,
		researchNotes,
		scenarios: [],
		crossReferences,
		actions: [],
	};
}
