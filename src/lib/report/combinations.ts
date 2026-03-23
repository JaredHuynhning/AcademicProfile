/**
 * Dimension combination analyzers for HEXACO report.
 * Each function takes two dimension scores and returns a learning trait profile.
 */

import { isHigh, isLow } from './helpers';

export interface CombinationResult {
	type: string;
	label: string;
	description: string;
	strengths: string[];
	risks: string[];
	tips: string[];
	flow?: string;
	disengage?: string;
}

/**
 * C + X → Study social preference
 */
export function analyzeCX(cScore: number, xScore: number): CombinationResult {
	if (isHigh(cScore) && isHigh(xScore)) {
		return {
			type: 'structured_social',
			label: 'Organised Team Player',
			description:
				'You thrive in structured group settings. You bring order to team projects and enjoy collaborative planning sessions where everyone has a clear role.',
			strengths: [
				'Natural project coordinator',
				'Keeps groups on track',
				'Balances social energy with discipline'
			],
			risks: [
				'May over-plan and frustrate spontaneous teammates',
				'Could take on too much responsibility in groups'
			],
			tips: [
				'Volunteer to lead study groups, your planning skills shine here',
				'Allow some flexibility in group plans for creative input from others'
			]
		};
	}
	if (isHigh(cScore) && isLow(xScore)) {
		return {
			type: 'independent_systematic',
			label: 'Independent Systematic Learner',
			description:
				'You do your best work alone with a clear plan. You prefer quiet study environments and detailed personal schedules over group activities.',
			strengths: ['Deep focused work', 'Consistent self-study habits', 'Thorough preparation'],
			risks: [
				'May miss out on peer learning benefits',
				'Could struggle in mandatory group projects'
			],
			tips: [
				'Schedule brief study sessions with one trusted friend to build collaborative skills',
				'Use online forums for peer discussion if face-to-face feels draining'
			]
		};
	}
	if (isLow(cScore) && isHigh(xScore)) {
		return {
			type: 'social_spontaneous',
			label: 'Social Spontaneous Learner',
			description:
				'You learn best through lively discussions and group activities. Structure feels restrictive: you prefer going with the flow and learning through interaction.',
			strengths: [
				'Energises group discussions',
				'Learns well through teaching others',
				'Adaptable to different study contexts'
			],
			risks: ['May struggle with independent revision', 'Deadlines can creep up without structure'],
			tips: [
				'Find a study buddy who keeps you accountable',
				'Use social study methods like group quizzes and teach-backs'
			]
		};
	}
	// Low C + Low X
	if (isLow(cScore) && isLow(xScore)) {
		return {
			type: 'relaxed_independent',
			label: 'Relaxed Independent',
			description:
				'You prefer a low-pressure, self-directed approach to learning. You work at your own pace and resist both rigid schedules and group demands.',
			strengths: [
				'Self-directed when interested',
				'Low stress baseline',
				'Creative problem-solving when engaged'
			],
			risks: ['May procrastinate without external motivation', 'Can disengage from challenging material'],
			tips: [
				'Connect study material to personal interests',
				'Use short, timed study sprints rather than long sessions'
			]
		};
	}
	// Moderate combinations
	return {
		type: 'balanced_flexible',
		label: 'Balanced Flexible Learner',
		description:
			'You adapt comfortably between solo study and group work, and between structured plans and spontaneous exploration.',
		strengths: [
			'Versatile study approach',
			'Comfortable in many settings',
			'Good at reading what each situation requires'
		],
		risks: [
			'May not fully commit to one approach',
			'Could benefit from identifying your peak study mode'
		],
		tips: [
			'Experiment with different study environments to find your sweet spot',
			'Track which approaches work best for different subjects'
		]
	};
}

/**
 * O + C → Creative vs systematic balance
 */
export function analyzeOC(oScore: number, cScore: number): CombinationResult {
	if (isHigh(oScore) && isHigh(cScore)) {
		return {
			type: 'creative_disciplined',
			label: 'Creative Strategist',
			description:
				'A powerful combination: you generate innovative ideas AND have the discipline to execute them. You plan your creative projects and follow through.',
			strengths: [
				'Turns creative ideas into finished work',
				'Systematic approach to exploration',
				'Strong in both STEM and humanities'
			],
			risks: ['Perfectionism may slow creative flow', 'May overthink before starting'],
			tips: [
				'Set "creative time" with no structure, then "execution time" with full structure',
				'Use mind maps to capture ideas before organising them'
			]
		};
	}
	if (isHigh(oScore) && isLow(cScore)) {
		return {
			type: 'visionary_starter',
			label: 'Visionary Starter',
			description:
				'You are full of ideas and love exploring new concepts, but finishing projects is harder. You start strong but may lose interest before completion.',
			strengths: [
				'Exceptional idea generation',
				'Cross-disciplinary thinking',
				'Sees connections others miss'
			],
			risks: [
				'Many unfinished projects',
				'Struggles with routine revision',
				'May underperform relative to ability'
			],
			tips: [
				'Break projects into tiny milestones with rewards',
				'Partner with an organised friend for accountability',
				'Use the Pomodoro technique to maintain focus'
			]
		};
	}
	if (isLow(oScore) && isHigh(cScore)) {
		return {
			type: 'methodical_executor',
			label: 'Methodical Executor',
			description:
				'You excel at following established methods and completing work to a high standard. You prefer clear instructions and proven approaches.',
			strengths: ['Reliable and thorough', 'Excellent at following procedures', 'Consistent quality output'],
			risks: ['May resist unfamiliar approaches', 'Could struggle with open-ended assignments'],
			tips: [
				'Challenge yourself with one creative task per week',
				'Ask "what if?" before settling on the first solution'
			]
		};
	}
	if (isLow(oScore) && isLow(cScore)) {
		return {
			type: 'practical_minimalist',
			label: 'Practical Minimalist',
			description:
				'You prefer straightforward, no-nonsense learning. You do what is needed without over-complicating things, focusing on practical outcomes.',
			strengths: [
				'Efficient, no wasted effort',
				'Pragmatic decision-making',
				'Good at identifying what really matters'
			],
			risks: ['May do the bare minimum', 'Could miss deeper learning opportunities'],
			tips: [
				'Set personal challenges to go beyond requirements in one subject you enjoy',
				'Find practical applications for abstract concepts'
			]
		};
	}
	return {
		type: 'balanced_approach',
		label: 'Balanced Learner',
		description:
			'You blend structure with exploration in a balanced way. You can follow a plan and also adapt when needed.',
		strengths: [
			'Adaptable study style',
			'Can handle both creative and structured tasks',
			'Well-rounded approach'
		],
		risks: [
			'May not fully develop either strength',
			'Could benefit from leaning into your stronger tendency'
		],
		tips: [
			'Notice which mode you are most productive in, lean into it for important work',
			'Use structured approaches for weak subjects, creative for strong ones'
		]
	};
}

/**
 * E + A → Emotional regulation in groups
 */
export function analyzeEA(eScore: number, aScore: number): CombinationResult {
	if (isHigh(eScore) && isHigh(aScore)) {
		return {
			type: 'empathetic_peacemaker',
			label: 'Empathetic Peacemaker',
			description:
				"You are deeply attuned to others' feelings and go out of your way to maintain harmony. You sense tension before others notice it.",
			strengths: [
				'Excellent emotional intelligence',
				'Creates safe group environments',
				'Natural mediator in conflicts'
			],
			risks: [
				"May suppress own needs for group harmony",
				"Can absorb others' stress",
				'Avoids necessary confrontation'
			],
			tips: [
				'Practice expressing your own opinion even when it differs from the group',
				"Set emotional boundaries, others' stress is not yours to carry"
			]
		};
	}
	if (isHigh(eScore) && isLow(aScore)) {
		return {
			type: 'passionate_challenger',
			label: 'Passionate Challenger',
			description:
				'You feel things deeply and are not afraid to express disagreement. You bring intensity and honesty to group discussions.',
			strengths: [
				'Authentic emotional expression',
				'Challenges groupthink',
				'Passionate advocate for ideas'
			],
			risks: [
				'May come across as confrontational',
				'Strong reactions can derail discussions',
				'Struggles to let go of disagreements'
			],
			tips: [
				'Pause before responding in heated discussions, count to 5',
				'Channel passion into written arguments where you can edit your tone'
			]
		};
	}
	if (isLow(eScore) && isHigh(aScore)) {
		return {
			type: 'calm_diplomat',
			label: 'Calm Diplomat',
			description:
				'You stay composed under pressure and prioritise smooth group dynamics. You are the person others turn to when tensions rise.',
			strengths: ['Level-headed in crisis', 'Smooths over conflicts naturally', 'Trustworthy and reliable'],
			risks: ['May seem detached or unemotional', 'Could agree too readily to avoid friction'],
			tips: [
				'Share your genuine reactions sometimes, it builds deeper connections',
				'Use your calm nature as an asset in presentations and debates'
			]
		};
	}
	if (isLow(eScore) && isLow(aScore)) {
		return {
			type: 'tough_independent',
			label: 'Tough-Minded Independent',
			description:
				'You are emotionally resilient and unafraid of conflict. You focus on getting the job done rather than managing feelings.',
			strengths: ['Handles criticism well', 'Makes tough decisions', 'Does not get distracted by drama'],
			risks: [
				'May seem insensitive to others',
				'Can create tension in group work',
				'May dismiss emotional concerns as unimportant'
			],
			tips: [
				'Actively check in with group members about how they are feeling',
				'Remember that emotional intelligence is a skill worth developing'
			]
		};
	}
	return {
		type: 'balanced_social',
		label: 'Socially Balanced',
		description:
			'You have a healthy balance of emotional awareness and assertiveness. You can empathise with others while still standing your ground.',
		strengths: [
			'Flexible in social situations',
			'Can both support and challenge others',
			'Good emotional regulation'
		],
		risks: ['May need to be more deliberate about which mode to use when'],
		tips: [
			'In group projects, consciously decide when to support and when to challenge',
			'Use your balance as a strength in leadership roles'
		]
	};
}

/**
 * H + A → Ethical and collaborative stance
 */
export function analyzeHA(hScore: number, aScore: number): CombinationResult {
	if (isHigh(hScore) && isHigh(aScore)) {
		return {
			type: 'principled_collaborator',
			label: 'Principled Collaborator',
			description:
				'You combine strong ethics with genuine cooperation. You play fair, share credit, and work to include everyone in the team.',
			strengths: [
				'Highly trustworthy team member',
				'Promotes fairness in groups',
				'Excellent role model for peers'
			],
			risks: [
				'May be taken advantage of by less scrupulous peers',
				'Could struggle in competitive environments'
			],
			tips: [
				'Your integrity is a superpower, use it to build lasting study partnerships',
				'Learn to recognise when others are not playing fair and set boundaries'
			]
		};
	}
	if (isHigh(hScore) && isLow(aScore)) {
		return {
			type: 'honest_critic',
			label: 'Honest Critic',
			description:
				'You value truth and fairness but are not afraid to challenge ideas you disagree with. You would rather be honest than liked.',
			strengths: [
				'Gives genuine, useful feedback',
				'Will not let group quality slide',
				'Strong moral compass'
			],
			risks: ['Directness can feel abrasive', 'May struggle with diplomatically phrased feedback'],
			tips: [
				'Practice the "feedback sandwich", positive, constructive, positive',
				'Your honesty is valuable; wrapping it in kindness makes it more effective'
			]
		};
	}
	if (isLow(hScore) && isHigh(aScore)) {
		return {
			type: 'strategic_harmoniser',
			label: 'Strategic Harmoniser',
			description:
				'You are socially skilled and cooperative, with a pragmatic streak. You navigate group dynamics smoothly and understand social leverage.',
			strengths: ['Skilled at group dynamics', 'Persuasive and likeable', 'Builds alliances effectively'],
			risks: [
				'May prioritise popularity over principle',
				'Could take shortcuts when pressure mounts'
			],
			tips: [
				'Reflect on whether your choices align with your long-term values',
				'Use your social skills for good, help quieter group members be heard'
			]
		};
	}
	if (isLow(hScore) && isLow(aScore)) {
		return {
			type: 'competitive_individualist',
			label: 'Competitive Individualist',
			description:
				'You are driven, competitive, and focused on personal achievement. You thrive in environments where individual performance is rewarded.',
			strengths: ['Strong self-advocacy', 'High drive and ambition', 'Performs well under competitive pressure'],
			risks: [
				'May damage group relationships',
				'Could cut corners under pressure',
				'Others may find it hard to trust you in group work'
			],
			tips: [
				'Build your reputation for reliability, it pays off long term',
				'Remember that collaborative success often leads to bigger individual opportunities'
			]
		};
	}
	return {
		type: 'pragmatic_cooperator',
		label: 'Pragmatic Cooperator',
		description:
			'You balance self-interest with cooperation, adapting your approach based on the situation. You are fair when fairness is reciprocated.',
		strengths: [
			'Adaptable to different group norms',
			'Balances personal and group goals',
			'Good at reading social situations'
		],
		risks: ['May be inconsistent in collaborative behaviour'],
		tips: [
			'Default to generosity in group settings, it builds social capital',
			'Set personal standards for integrity that do not depend on what others do'
		]
	};
}

/**
 * X + E → Social confidence vs sensitivity
 */
export function analyzeXE(xScore: number, eScore: number): CombinationResult {
	if (isHigh(xScore) && isHigh(eScore)) {
		return {
			type: 'confident_feeler',
			label: 'Confident Performer',
			description:
				'You are socially outgoing and emotionally expressive. You bring energy to group settings and feel things deeply, which can be both a strength and a challenge.',
			strengths: [
				'Charismatic and engaging',
				'Creates emotional connections quickly',
				'Energises group activities'
			],
			risks: [
				'Emotional highs and lows can be visible to everyone',
				'May seek too much external validation',
				'Performance anxiety before presentations'
			],
			tips: [
				'Use your energy as a strength in oral presentations and debates',
				'Develop pre-exam calming routines to manage anxiety'
			],
			flow: 'Engaged, animated, asking questions, gesturing, clearly "in the zone" with visible enthusiasm',
			disengage:
				'Gets restless, seeks distraction, becomes visibly anxious or dramatic about being bored'
		};
	}
	if (isHigh(xScore) && isLow(eScore)) {
		return {
			type: 'resilient_leader',
			label: 'Resilient Leader',
			description:
				'You are socially confident and emotionally steady. You naturally take charge and handle pressure without getting flustered.',
			strengths: [
				'Natural leadership presence',
				'Calm under pressure',
				'Confident public speaker'
			],
			risks: [
				'May seem emotionally distant',
				"Could overlook others' emotional needs",
				'Might take excessive risks'
			],
			tips: [
				'Use your steady confidence to mentor peers who are more anxious',
				'Check in with quieter group members, your calm presence is reassuring'
			],
			flow: 'Actively leading, volunteering answers, helping others, confident and visibly engaged',
			disengage: 'Becomes restless and chatty, disrupts class, seeks stimulation elsewhere'
		};
	}
	if (isLow(xScore) && isHigh(eScore)) {
		return {
			type: 'quiet_worrier',
			label: 'Quiet Worrier',
			description:
				'You feel things deeply but keep much of it inside. You may experience significant anxiety that is not visible to teachers.',
			strengths: ['Deep emotional processing', 'Thoughtful and reflective', 'Empathetic listener'],
			risks: [
				'Anxiety may silently undermine performance',
				'Reluctant to ask for help',
				'May be overlooked because quiet'
			],
			tips: [
				'Find one trusted person to share concerns with',
				'Write down worries before exams to reduce their power',
				'Ask for written rather than oral assessments when possible'
			],
			flow: 'Quietly focused, writing steadily, occasionally nodding, engaged but not visibly animated',
			disengage: 'Withdraws, stops asking questions, appears worried or stares blankly at work'
		};
	}
	if (isLow(xScore) && isLow(eScore)) {
		return {
			type: 'steady_observer',
			label: 'Steady Observer',
			description:
				'You are quiet and emotionally even-keeled. You observe before acting and prefer to work independently with minimal drama.',
			strengths: ['Consistent and reliable', 'Not swayed by peer pressure', 'Calm in stressful situations'],
			risks: [
				'May appear disengaged when actually processing',
				'Can be overlooked in group settings',
				'Teachers may misread quietness as disinterest'
			],
			tips: [
				'Signal engagement deliberately, nod, take notes, ask one question per class',
				'Use written communication to show your understanding'
			],
			flow: 'Quietly productive, appears calm and focused, steady output',
			disengage:
				'Goes quiet, does minimum, appears indifferent, hard to distinguish from engaged mode'
		};
	}
	return {
		type: 'moderate_presence',
		label: 'Moderate Presence',
		description:
			'You have a balanced social-emotional profile. You can be expressive when needed and reserved when appropriate.',
		strengths: [
			'Adaptable social presence',
			'Moderate stress response',
			'Reads the room well'
		],
		risks: ['May not fully develop either social confidence or emotional depth'],
		tips: [
			'Experiment with being more expressive in safe settings',
			'Use your balance to support both extraverted and introverted classmates'
		],
		flow: 'Engaged but not dominant, participates when called on, follows along attentively',
		disengage: 'Becomes passive, does the minimum, waits for the session to end'
	};
}

/**
 * O + X → Curiosity expression style
 */
export function analyzeOX(oScore: number, xScore: number): CombinationResult {
	if (isHigh(oScore) && isHigh(xScore)) {
		return {
			type: 'enthusiastic_explorer',
			label: 'Enthusiastic Explorer',
			description:
				'You love learning new things AND sharing them with others. You light up in discussions and bring creative energy to every group.',
			strengths: [
				'Infectious enthusiasm for learning',
				'Great at brainstorming sessions',
				'Connects ideas across subjects'
			],
			risks: ['May dominate discussions', 'Can go off on tangents', 'Enthusiasm may not always translate to depth'],
			tips: [
				'Channel your energy into study presentations or teaching others',
				'Practice going deep on one topic before moving to the next'
			]
		};
	}
	if (isHigh(oScore) && isLow(xScore)) {
		return {
			type: 'quiet_thinker',
			label: 'Quiet Thinker',
			description:
				'You are deeply curious and creative but prefer to explore ideas privately. You think before you speak and produce insightful work.',
			strengths: ['Deep, original thinking', 'Rich inner world', 'Produces high-quality written work'],
			risks: [
				'Ideas may never be shared',
				'May underperform in oral assessments',
				'Teachers may not see your true ability'
			],
			tips: [
				'Write blog posts or keep an idea journal to express your thinking',
				'Prepare discussion points in advance so you can contribute with confidence'
			]
		};
	}
	if (isLow(oScore) && isHigh(xScore)) {
		return {
			type: 'social_pragmatist',
			label: 'Social Pragmatist',
			description:
				'You are outgoing and practical. You prefer discussing real-world applications over abstract theory and learn best through conversation.',
			strengths: [
				'Great at networking and collaboration',
				'Practical problem-solver',
				'Effective communicator'
			],
			risks: [
				'May dismiss theoretical or creative approaches',
				'Could miss nuance in complex topics'
			],
			tips: [
				'Challenge yourself to find one interesting angle in subjects you find boring',
				'Use your social skills to learn from peers who think differently'
			]
		};
	}
	if (isLow(oScore) && isLow(xScore)) {
		return {
			type: 'focused_minimalist',
			label: 'Focused Minimalist',
			description:
				'You prefer straightforward, practical learning in a quiet environment. You focus on what is directly useful and avoid unnecessary complexity.',
			strengths: [
				'Efficient learner',
				'Not distracted by irrelevant information',
				'Steady, predictable work output'
			],
			risks: [
				'May miss enriching learning experiences',
				'Could struggle with interdisciplinary work'
			],
			tips: [
				'Try one creative study method per term. You might be surprised',
				'Ask a curious friend to explain why they find a subject interesting'
			]
		};
	}
	return {
		type: 'adaptable_learner',
		label: 'Adaptable Learner',
		description:
			'You adjust your curiosity and social engagement to fit the situation. You are comfortable in many different learning environments.',
		strengths: [
			'Versatile learner',
			'Comfortable in varied settings',
			'Good at reading what is expected'
		],
		risks: ['May not push yourself to explore or engage beyond what is comfortable'],
		tips: [
			'Set a weekly challenge to either explore a new topic or engage in a group discussion',
			'Notice which mode of learning energises you most'
		]
	};
}

export interface AllCombinations {
	cx: CombinationResult;
	oc: CombinationResult;
	ea: CombinationResult;
	ha: CombinationResult;
	xe: CombinationResult;
	ox: CombinationResult;
}

/**
 * Get all six combination analyses for a results object.
 */
export function getAllCombinations(dimensions: Record<string, { score: number }>): AllCombinations {
	const s = (key: string) => dimensions[key].score;
	return {
		cx: analyzeCX(s('C'), s('X')),
		oc: analyzeOC(s('O'), s('C')),
		ea: analyzeEA(s('E'), s('A')),
		ha: analyzeHA(s('H'), s('A')),
		xe: analyzeXE(s('X'), s('E')),
		ox: analyzeOX(s('O'), s('X'))
	};
}
