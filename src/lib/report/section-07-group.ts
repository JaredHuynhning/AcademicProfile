/**
 * Section 8: Working With Others
 * Driven by X+A role, E+A conflict, X+H communication
 */
import { isHigh, isLow, DimensionsMap } from './helpers';
import { analyzeCX, analyzeEA, analyzeHA } from './combinations';

interface Results {
	dimensions: DimensionsMap;
	[key: string]: unknown;
}

export function generateGroup(results: Results) {
	const dims = results.dimensions;

	return {
		groupRole: buildGroupRole(dims),
		communicationStyle: buildCommunicationStyle(dims),
		conflictHandling: buildConflictHandling(dims),
		bestPartners: buildBestPartners(dims),
		teamTips: buildTeamTips(dims)
	};
}

function buildGroupRole(dims: DimensionsMap) {
	const xHigh = isHigh(dims.X.score);
	const xLow = isLow(dims.X.score);
	const cHigh = isHigh(dims.C.score);
	const aHigh = isHigh(dims.A.score);
	const oHigh = isHigh(dims.O.score);

	if (xHigh && cHigh) {
		return {
			role: 'Project Leader',
			icon: '👑',
			description: 'You naturally organise the team and keep everyone on track. Your combination of social confidence and discipline means you set clear goals and follow through.',
			strengths: ['Delegates effectively', 'Keeps the team focused', 'Balances social and task needs'],
			watchOut: 'Be careful not to dominate, make sure quieter members have a voice.'
		};
	}
	if (xHigh && oHigh) {
		return {
			role: 'Creative Catalyst',
			icon: '💡',
			description: 'You spark ideas and get the group excited about possibilities. Your energy and curiosity drive brainstorming sessions and keep things interesting.',
			strengths: ['Generates innovative ideas', 'Keeps energy high', 'Makes connections others miss'],
			watchOut: 'Remember to follow through on ideas, generate, then execute.'
		};
	}
	if (cHigh && aHigh) {
		return {
			role: 'Reliable Executor',
			icon: '⚙️',
			description: 'You are the person who ensures the work gets done to a high standard. Teams trust you with critical tasks because you are both thorough and cooperative.',
			strengths: ['Consistently delivers quality', 'Easy to work with', 'Picks up slack without complaint'],
			watchOut: 'Don\'t take on more than your share, speak up when the load is unbalanced.'
		};
	}
	if (xLow && oHigh) {
		return {
			role: 'Thoughtful Innovator',
			icon: '🔬',
			description: 'You contribute deep, original thinking to the group. While you may not be the loudest voice, your ideas are often the most insightful.',
			strengths: ['Quality over quantity in contributions', 'Spots problems others miss', 'Brings unique perspectives'],
			watchOut: 'Make sure your ideas are heard, consider writing them down or sharing via chat.'
		};
	}
	if (aHigh && isHigh(dims.E.score)) {
		return {
			role: 'Team Harmoniser',
			icon: '🕊️',
			description: 'You keep the group together emotionally. You sense tension early and smooth things over, creating a safe environment for everyone.',
			strengths: ['Resolves conflicts naturally', 'Makes everyone feel included', 'Emotional barometer for the group'],
			watchOut: 'Your own needs matter too, don\'t sacrifice your contribution for group harmony.'
		};
	}
	if (isLow(dims.A.score) && xHigh) {
		return {
			role: 'Challenger',
			icon: '🔥',
			description: 'You push the group to higher standards by questioning assumptions and challenging weak ideas. Your directness keeps the team honest.',
			strengths: ['Prevents groupthink', 'Drives quality', 'Not afraid to have difficult conversations'],
			watchOut: 'Deliver challenges constructively: the goal is improvement, not conflict.'
		};
	}
	return {
		role: 'Flexible Contributor',
		icon: '🔄',
		description: 'You adapt your role based on what the team needs. You can lead, follow, create, or execute depending on the situation.',
		strengths: ['Adaptable to different group needs', 'Can fill gaps in the team', 'Balanced approach to collaboration'],
		watchOut: 'Having a clear go-to role can increase your impact, identify what you do best and offer it.'
	};
}

function buildCommunicationStyle(dims: DimensionsMap) {
	const xLevel = isHigh(dims.X.score) ? 'high' : isLow(dims.X.score) ? 'low' : 'moderate';
	const hLevel = isHigh(dims.H.score) ? 'high' : isLow(dims.H.score) ? 'low' : 'moderate';

	const styles: Record<string, { style: string; description: string; tip: string }> = {
		high_high: {
			style: 'Open and Honest',
			description: 'You communicate directly and authentically. You say what you mean and mean what you say, which builds trust quickly.',
			tip: 'Your openness is refreshing, just ensure your honesty is always paired with kindness.'
		},
		high_low: {
			style: 'Charismatic and Strategic',
			description: 'You are a skilled communicator who reads the room well. You know when to share and when to hold back for maximum impact.',
			tip: 'Your social intelligence is a strength, use it to lift others up, not just to advance your own ideas.'
		},
		high_moderate: {
			style: 'Confident and Balanced',
			description: 'You communicate with ease and balance transparency with tact. You are comfortable both speaking and listening.',
			tip: 'Use your confidence to create space for quieter group members to share their thoughts.'
		},
		low_high: {
			style: 'Thoughtful and Sincere',
			description: 'When you speak, people listen, because you choose your words carefully and always mean them. You communicate most effectively in writing or one-on-one.',
			tip: 'Prepare key points before meetings so you can contribute despite your reserved nature.'
		},
		low_low: {
			style: 'Reserved and Practical',
			description: 'You keep communication minimal and focused. You prefer to let your work speak for itself rather than talk about it.',
			tip: 'Sharing your thought process, even briefly, helps teammates understand and trust your contributions.'
		},
		low_moderate: {
			style: 'Quiet and Considered',
			description: 'You think carefully before communicating and prefer substance over small talk. Written communication may feel more natural.',
			tip: 'Consider sharing ideas via written notes or messages before group discussions, it plays to your strength.'
		},
		moderate_high: {
			style: 'Genuine and Measured',
			description: 'You communicate with authenticity and adjust your level of engagement based on the situation. Others find you trustworthy and approachable.',
			tip: 'Your balanced style makes you a good bridge between outspoken and reserved group members.'
		},
		moderate_low: {
			style: 'Adaptive and Pragmatic',
			description: 'You adjust your communication to fit the audience. You can be more or less direct depending on what the situation requires.',
			tip: 'Your adaptability is useful, just make sure you are consistent in what you promise to deliver.'
		},
		moderate_moderate: {
			style: 'Balanced Communicator',
			description: 'You have a flexible communication style that adapts to different contexts. You can be assertive or accommodating as needed.',
			tip: 'Identify whether you tend to over-communicate or under-communicate, and adjust accordingly.'
		}
	};

	const key = `${xLevel}_${hLevel}`;
	return styles[key] || styles.moderate_moderate;
}

function buildConflictHandling(dims: DimensionsMap) {
	const ea = analyzeEA(dims.E.score, dims.A.score);

	const strategies: string[] = [];
	if (isHigh(dims.A.score)) {
		strategies.push('Seek common ground first, find what everyone agrees on before tackling differences');
		strategies.push('Use "I" statements to express concerns without sounding accusatory');
	}
	if (isLow(dims.A.score)) {
		strategies.push('State your position clearly but listen to alternatives before pushing back');
		strategies.push('Focus on the issue, not the person, separate ideas from identity');
	}
	if (isHigh(dims.E.score)) {
		strategies.push('Take a break if emotions are running high, it is okay to pause and return');
		strategies.push('Write down your thoughts before discussing, it helps organise emotional responses');
	}
	if (isLow(dims.E.score)) {
		strategies.push('Remember that others may need more time to process emotionally, be patient');
		strategies.push('Check that you are not dismissing valid emotional concerns as "irrational"');
	}
	if (strategies.length < 2) {
		strategies.push('Aim for solutions that address everyone\'s core concerns');
		strategies.push('When in doubt, ask questions rather than making assumptions about others\' motives');
	}

	return {
		profile: ea,
		strategies: strategies.slice(0, 4)
	};
}

function buildBestPartners(dims: DimensionsMap) {
	const partners: { type: string; description: string; why: string }[] = [];

	if (isLow(dims.C.score)) {
		partners.push({
			type: 'The Organiser',
			description: 'Someone high in Conscientiousness who can provide the structure you need',
			why: 'They complement your flexibility with planning and follow-through'
		});
	}
	if (isHigh(dims.C.score)) {
		partners.push({
			type: 'The Creative',
			description: 'Someone high in Openness who brings fresh ideas and perspectives',
			why: 'They complement your discipline with innovation and variety'
		});
	}
	if (isLow(dims.X.score)) {
		partners.push({
			type: 'The Includer',
			description: 'Someone warm and patient who creates space for you to contribute',
			why: 'They help you feel comfortable sharing your thoughtful contributions'
		});
	}
	if (isHigh(dims.X.score)) {
		partners.push({
			type: 'The Grounding Force',
			description: 'Someone calm and focused who keeps discussions productive',
			why: 'They balance your social energy with quiet productivity'
		});
	}
	if (isHigh(dims.E.score)) {
		partners.push({
			type: 'The Steady Anchor',
			description: 'Someone emotionally even who provides reassurance when stress builds',
			why: 'Their calm presence helps you manage anxiety during intense study periods'
		});
	}
	if (isLow(dims.E.score)) {
		partners.push({
			type: 'The Connector',
			description: 'Someone emotionally warm who helps maintain team morale',
			why: 'They handle the emotional side of teamwork that you may overlook'
		});
	}

	if (partners.length < 2) {
		partners.push({
			type: 'The Complementary Learner',
			description: 'Someone whose strengths cover your growth areas',
			why: 'Complementary partnerships create stronger teams than matching ones'
		});
	}

	return partners.slice(0, 3);
}

function buildTeamTips(dims: DimensionsMap): string[] {
	const tips: string[] = [];
	tips.push('Establish clear roles and expectations at the start of any group project');
	tips.push('Schedule regular check-ins rather than relying on last-minute coordination');

	if (isHigh(dims.X.score)) tips.push('Use your social skills to keep the group connected, but ensure productive focus');
	if (isLow(dims.X.score)) tips.push('Ask to contribute via written notes or shared documents when speaking up feels difficult');
	if (isHigh(dims.C.score)) tips.push('Offer to create the project timeline, your planning skills benefit the whole team');
	if (isLow(dims.C.score)) tips.push('Commit to specific deliverables with deadlines, external accountability helps you follow through');
	if (isHigh(dims.A.score)) tips.push('Practise saying "I disagree because...", your ideas matter as much as group harmony');
	if (isLow(dims.A.score)) tips.push('Before pushing back, acknowledge what is good about the other person\'s idea first');

	return tips.slice(0, 5);
}
