// @ts-nocheck
/**
 * Mega Section 3: How Your Mind Works — Learning Profile
 * Generates ~6 pages: learning style, attention, motivation, curiosity, environment, cross-ref.
 */
import { classifyLevel, scorePercentile, interpretiveLabel, type DimensionsMap } from '../helpers';
import type { MegaSectionContent, Finding, ResearchNote } from '../mega-sections';

export function generateLearningProfileMega(
	dimensions: DimensionsMap,
	studyProfile: any | null,
	learnerProfile: any | null,
	studentName: string,
): MegaSectionContent {
	const narrative: string[] = [];
	const keyFindings: Finding[] = [];
	const researchNotes: ResearchNote[] = [];

	const O = dimensions.O;
	const C = dimensions.C;
	const E = dimensions.E;
	const X = dimensions.X;

	narrative.push(
		`Understanding how ${studentName} learns — not just what they know — is the key to unlocking their academic potential. This section maps their learning style, attention patterns, motivation drivers, and ideal study environment, all derived from the intersection of their personality profile and academic learning data.`
	);

	narrative.push(
		`Every student has a unique learning fingerprint shaped by the interaction between personality traits, cognitive preferences, and environmental factors. Two students with identical intelligence can achieve vastly different outcomes simply because their learning approach matches — or mismatches — the demands of their educational environment. Research consistently shows that alignment between learning style and teaching format can improve retention by 25-40% (Pashler et al., 2008). The goal of this section is to identify ${studentName}'s optimal learning conditions so that parents, teachers, and ${studentName} themselves can engineer more of those conditions into their daily academic life.`
	);

	// ─── Learning Style ──────────────────────────────────────────────────────────
	narrative.push('\n### Learning Style');

	const oScore = O?.score || 3.0;
	const cScore = C?.score || 3.0;
	const xScore = X?.score || 3.0;

	// Primary learning style from personality
	if (oScore >= 3.5 && cScore >= 3.5) {
		narrative.push(
			`${studentName} is a **structured explorer** — someone who loves learning new things but does so in an organised, systematic way. They combine intellectual curiosity (Openness ${oScore.toFixed(1)}/5) with disciplined study habits (Conscientiousness ${cScore.toFixed(1)}/5). This is an exceptionally effective learning combination: the curiosity drives engagement while the discipline ensures thorough coverage of material.`
		);
		narrative.push(
			`Research on learning approaches shows that students who combine deep learning strategies with strategic organisation consistently outperform those who rely on either approach alone (Biggs & Tang, 2011). ${studentName}'s personality naturally predisposes them to this combined approach.`
		);
	} else if (oScore >= 3.5 && cScore < 2.5) {
		narrative.push(
			`${studentName} is an **enthusiastic diverger** — deeply curious and creative (Openness ${oScore.toFixed(1)}/5) but less naturally inclined toward structured study (Conscientiousness ${cScore.toFixed(1)}/5). They learn voraciously when interested but may struggle to maintain consistent effort across all subjects. The key challenge is channelling their intellectual enthusiasm into the discipline needed for exam preparation and assignment completion.`
		);
		narrative.push(
			`This profile is common among highly creative students. Research suggests that providing external structure — clear milestones, regular check-ins, and visual progress tracking — allows curious but undisciplined learners to achieve results that match their intellectual capacity (Duckworth & Seligman, 2005).`
		);
	} else if (oScore < 2.5 && cScore >= 3.5) {
		narrative.push(
			`${studentName} is a **disciplined practitioner** — methodical, reliable, and thorough (Conscientiousness ${cScore.toFixed(1)}/5) but less drawn to abstract or novel learning (Openness ${oScore.toFixed(1)}/5). They excel in structured subjects with clear right/wrong answers and predictable assessment formats. Their strength lies in execution and consistency rather than creative exploration.`
		);
		narrative.push(
			`Research on academic achievement shows that conscientiousness predicts GPA more strongly than intelligence in many contexts (Poropat, 2009). ${studentName}'s disciplined approach means they will often outperform more "naturally talented" peers who lack their work ethic.`
		);
	} else if (oScore < 2.5 && cScore < 2.5) {
		narrative.push(
			`${studentName} currently faces a dual challenge: lower natural curiosity (Openness ${oScore.toFixed(1)}/5) combined with lower natural discipline (Conscientiousness ${cScore.toFixed(1)}/5). This doesn't mean they can't succeed academically — it means they need more support finding both motivation AND structure. The good news: both traits develop significantly through adolescence, and the right environment can accelerate this growth.`
		);
		narrative.push(
			`The most effective strategy for this profile is connecting academic material to ${studentName}'s personal interests and goals. When they see *why* something matters to them, engagement follows. Pair this with external structure (accountability partners, study schedules, small daily goals) to build habits incrementally.`
		);
	} else {
		narrative.push(
			`${studentName} shows a balanced learning profile with moderate curiosity (Openness ${oScore.toFixed(1)}/5) and moderate discipline (Conscientiousness ${cScore.toFixed(1)}/5). They can engage with both creative and structured tasks, adapting their approach to what the situation demands. This flexibility is a genuine strength, allowing them to perform competently across a wide range of subjects and assessment types.`
		);
	}

	researchNotes.push({
		text: 'The interaction between Openness (curiosity, creativity) and Conscientiousness (discipline, organisation) is the strongest personality predictor of academic success, stronger than either dimension alone.',
		topic: 'Learning style',
	});

	// ─── Attention & Focus ───────────────────────────────────────────────────────
	narrative.push('\n### Attention & Focus');

	const eScore = E?.score || 3.0;
	const focusData = learnerProfile?.focus;

	if (cScore >= 3.5 && eScore < 3.0) {
		narrative.push(
			`${studentName} has a strong attention profile. Their high conscientiousness provides natural self-discipline for sustained focus, while their lower emotionality means they are less susceptible to anxiety-driven distraction. Research on adolescent attention shows the average sustained focus period is 20-25 minutes; ${studentName}'s profile suggests they can maintain productive focus for approximately 35-45 minutes before needing a break.`
		);
	} else if (cScore < 2.5 || eScore >= 3.5) {
		narrative.push(
			`${studentName}'s attention profile has some vulnerabilities. ${cScore < 2.5 ? 'Lower conscientiousness means sustained focus requires more deliberate effort. ' : ''}${eScore >= 3.5 ? 'Higher emotionality means they may be more susceptible to worry-driven distraction, particularly before exams or when facing uncertain outcomes. ' : ''}The recommended session length is 20-25 minutes with structured breaks — shorter, more frequent study blocks will outperform long marathon sessions.`
		);
	} else {
		narrative.push(
			`${studentName} has a typical attention profile for their age group. They can sustain focus for the standard 25-30 minute period before needing a break. The Pomodoro technique (25 minutes focused work, 5 minutes break) is well-matched to their attention capacity.`
		);
	}

	if (focusData) {
		if (focusData.concentration?.level === 'high') {
			narrative.push(`Their self-reported concentration is strong (${focusData.concentration.score.toFixed(1)}/5), confirming the personality-based prediction of good sustained attention.`);
		}
		if (focusData.procrastination?.level === 'high') {
			narrative.push(`However, ${studentName} reports significant procrastination tendencies (${focusData.procrastination.score.toFixed(1)}/5). This suggests the challenge isn't maintaining focus once started, but initiating focused work in the first place. "Starting rituals" — a specific sequence of actions that signals "study time has begun" — can help bridge this gap.`);
			keyFindings.push({ title: 'Procrastination Risk', text: `${studentName} reports strong procrastination tendencies despite adequate concentration ability. The barrier is starting, not sustaining.`, type: 'barrier', color: '#f59e0b' });
		}
	}

	// ─── Motivation Drivers ──────────────────────────────────────────────────────
	narrative.push('\n### Motivation Drivers');

	const motivData = studyProfile?.motivation;
	if (motivData) {
		const sdi = motivData.sdi;
		const intrinsic = motivData.intrinsic;
		const external = motivData.external;
		const amotivation = motivData.amotivation;

		if (sdi > 1.5) {
			narrative.push(
				`${studentName} is predominantly self-determined in their motivation (SDI: ${sdi.toFixed(1)}). They learn primarily because they find it interesting and valuable, not because someone is forcing them. This intrinsic motivation is the most powerful and sustainable form of academic drive — students who learn for genuine interest retain information longer, think more creatively, and persist through difficulty more effectively (Ryan & Deci, 2000).`
			);
			keyFindings.push({ title: 'Strong Intrinsic Motivation', text: `Self-Determination Index of ${sdi.toFixed(1)} indicates ${studentName} is driven by genuine interest and personal value, the most sustainable form of academic motivation.`, type: 'strength', color: '#22c55e' });
		} else if (sdi < -0.5) {
			narrative.push(
				`${studentName}'s motivation is currently more externally controlled (SDI: ${sdi.toFixed(1)}). They are primarily driven by rewards, grades, and expectations from others rather than genuine interest. While external motivation can produce results in the short term, it is less sustainable and more vulnerable to burnout. The key strategy is helping ${studentName} find personal relevance in academic material — connecting lessons to their interests, goals, and identity.`
			);
			keyFindings.push({ title: 'External Motivation Dominant', text: `SDI of ${sdi.toFixed(1)} suggests ${studentName} is primarily motivated by external rewards and expectations. Building intrinsic interest is a priority.`, type: 'barrier', color: '#f59e0b' });
		} else {
			narrative.push(
				`${studentName}'s motivation profile is balanced (SDI: ${sdi.toFixed(1)}), drawing on both intrinsic interest and external expectations. This is a common and workable pattern — they can be engaged by both the material itself and the outcomes it leads to. The goal is to gradually shift the balance toward intrinsic motivation over time.`
			);
		}

		if (amotivation?.level === 'high') {
			narrative.push(
				`An important flag: ${studentName} reports elevated amotivation (${amotivation.score.toFixed(1)}/5), indicating they sometimes feel that academic effort is pointless. This is NOT laziness — it typically signals a disconnect between what they're studying and what they value. Addressing amotivation requires understanding what ${studentName} actually cares about and building explicit bridges between their interests and the curriculum.`
			);
			keyFindings.push({ title: 'Amotivation Warning', text: `${studentName} sometimes feels academic effort is pointless. This signals a disconnect between the curriculum and their personal values — not laziness.`, type: 'warning', color: '#ef4444' });
		}
	} else {
		// Infer from personality
		const hScore = dimensions.H?.score || 3.0;
		if (hScore < 2.5) {
			narrative.push(
				`Based on ${studentName}'s personality profile, they are likely motivated by tangible rewards, recognition, and competitive success (lower Honesty-Humility indicates stronger extrinsic motivation). Leaderboards, grade targets, and visible progress tracking will fuel their engagement.`
			);
		} else if (oScore >= 3.5) {
			narrative.push(
				`Based on ${studentName}'s personality profile, they are likely driven by intellectual curiosity and the intrinsic pleasure of understanding (high Openness). Giving them permission to explore tangents and go deeper in areas of interest will sustain their engagement across all subjects.`
			);
		} else {
			narrative.push(
				`${studentName}'s motivation pattern is likely a mix of intrinsic and extrinsic factors. They respond to both genuine interest and external rewards, depending on the subject and context.`
			);
		}
	}

	researchNotes.push({
		text: 'Self-Determination Theory (Ryan & Deci, 2000) identifies three psychological needs that drive intrinsic motivation: autonomy (choice), competence (mastery), and relatedness (connection). Meeting these needs in academic settings transforms obligation into engagement.',
		topic: 'Motivation',
	});

	// ─── Ideal Environment ───────────────────────────────────────────────────────
	narrative.push('\n### Ideal Learning Environment');

	const envParts: string[] = [];
	if (xScore < 2.5) {
		envParts.push('a quiet, low-stimulation space with minimal social interruption');
	} else if (xScore >= 3.5) {
		envParts.push('a lively environment with options for collaborative study nearby');
	} else {
		envParts.push('a flexible space that supports both focused solo work and occasional collaboration');
	}

	if (cScore >= 3.5) {
		envParts.push('a well-organised desk with all materials readily accessible');
	} else {
		envParts.push('a clutter-free zone with only current materials visible (reducing distraction)');
	}

	if (oScore >= 3.5) {
		envParts.push('access to supplementary resources, books, and creative materials');
	} else {
		envParts.push('streamlined materials focused on the syllabus and assessment requirements');
	}

	narrative.push(
		`Based on ${studentName}'s personality profile, their ideal study environment includes: ${envParts.join('; ')}. Research on environmental psychology shows that matching study environments to personality type can improve focus duration by 20-30% (Mehta & Zhu, 2012).`
	);

	// Time of day
	if (eScore >= 3.5) {
		narrative.push(
			`For ${studentName}, morning study sessions may be more productive — cortisol levels are highest in the morning, providing natural alertness, and the lower evening energy associated with higher Emotionality means academic work becomes harder as the day progresses. Heavy cognitive tasks (maths, new material) are best tackled before noon.`
		);
	} else {
		narrative.push(
			`${studentName} likely has a flexible energy pattern across the day. The key is consistency — studying at the same time each day builds automatic habits that require less willpower to maintain.`
		);
	}

	return {
		narrative,
		keyFindings,
		researchNotes,
		scenarios: [],
		crossReferences: [
			{ targetSection: 'study-playbook', text: 'See Section 5 for specific study techniques matched to this learning profile.' },
			{ targetSection: 'barriers', text: 'See Section 7 for barriers that may interfere with learning.' },
		],
		actions: [],
	};
}
