/**
 * Section 6: What Drives You
 * Motivators, demotivators, flow state, disengagement
 */
import { isHigh, isLow, DimensionsMap } from './helpers';
import { analyzeXE } from './combinations';

interface Results {
	dimensions: DimensionsMap;
	[key: string]: unknown;
}

export function generateDrives(results: Results) {
	const dims = results.dimensions;
	const xe = analyzeXE(dims.X.score, dims.E.score);

	return {
		motivators: buildMotivators(dims),
		demotivators: buildDemotivators(dims),
		flowState: {
			description: (xe as { flow?: string }).flow || 'Engaged and focused, participates appropriately in the learning activity.',
			triggers: buildFlowTriggers(dims)
		},
		disengagement: {
			description: (xe as { disengage?: string }).disengage || 'Becomes passive and does the minimum required.',
			signs: buildDisengagementSigns(dims),
			interventions: buildInterventions(dims)
		}
	};
}

function buildMotivators(dims: DimensionsMap) {
	const motivators: { text: string; dim: string; icon: string }[] = [];

	if (isHigh(dims.O.score)) {
		motivators.push({ text: 'Discovering something new or surprising', dim: 'O', icon: '🔍' });
		motivators.push({ text: 'Creative freedom and open-ended projects', dim: 'O', icon: '🎨' });
	}
	if (isHigh(dims.C.score)) {
		motivators.push({ text: 'Achieving goals and ticking off milestones', dim: 'C', icon: '🎯' });
		motivators.push({ text: 'Seeing measurable progress and improvement', dim: 'C', icon: '📈' });
	}
	if (isHigh(dims.X.score)) {
		motivators.push({ text: 'Working with others and being part of a team', dim: 'X', icon: '👥' });
		motivators.push({ text: 'Recognition and positive feedback', dim: 'X', icon: '⭐' });
	}
	if (isHigh(dims.E.score)) {
		motivators.push({ text: 'Feeling supported and emotionally safe', dim: 'E', icon: '🤗' });
		motivators.push({ text: 'Meaningful connections with teachers and peers', dim: 'E', icon: '💬' });
	}
	if (isHigh(dims.H.score)) {
		motivators.push({ text: 'Doing the right thing and being fair', dim: 'H', icon: '⚖️' });
		motivators.push({ text: 'Contributing to something meaningful', dim: 'H', icon: '🌟' });
	}
	if (isHigh(dims.A.score)) {
		motivators.push({ text: 'Harmonious group environments', dim: 'A', icon: '🕊️' });
		motivators.push({ text: 'Collaborative success and shared achievements', dim: 'A', icon: '🤝' });
	}

	// Low-score motivators
	if (isLow(dims.C.score)) {
		motivators.push({ text: 'Variety and freedom from rigid routines', dim: 'C', icon: '🦋' });
	}
	if (isLow(dims.A.score)) {
		motivators.push({ text: 'Competition and being the best', dim: 'A', icon: '🏆' });
	}
	if (isLow(dims.H.score)) {
		motivators.push({ text: 'Status, rewards, and tangible recognition', dim: 'H', icon: '💎' });
	}

	// Ensure minimum motivators
	if (motivators.length < 4) {
		motivators.push({ text: 'Personal growth and self-improvement', dim: '-', icon: '🌱' });
		motivators.push({ text: 'Interesting and relevant material', dim: '-', icon: '📚' });
	}

	return motivators.slice(0, 8);
}

function buildDemotivators(dims: DimensionsMap) {
	const demotivators: { text: string; dim: string; icon: string }[] = [];

	if (isHigh(dims.O.score)) {
		demotivators.push({ text: 'Repetitive, rote learning with no room for creativity', dim: 'O', icon: '😫' });
	}
	if (isLow(dims.O.score)) {
		demotivators.push({ text: 'Abstract theory with no practical application', dim: 'O', icon: '😫' });
	}
	if (isHigh(dims.C.score)) {
		demotivators.push({ text: 'Disorganised classrooms and unclear expectations', dim: 'C', icon: '😤' });
	}
	if (isLow(dims.C.score)) {
		demotivators.push({ text: 'Rigid schedules and excessive structure', dim: 'C', icon: '😤' });
	}
	if (isHigh(dims.X.score)) {
		demotivators.push({ text: 'Working alone for long periods with no interaction', dim: 'X', icon: '😔' });
	}
	if (isLow(dims.X.score)) {
		demotivators.push({ text: 'Forced group participation and public speaking', dim: 'X', icon: '😰' });
	}
	if (isHigh(dims.E.score)) {
		demotivators.push({ text: 'Harsh criticism and unsupportive environments', dim: 'E', icon: '😢' });
		demotivators.push({ text: 'High-stakes tests with no preparation support', dim: 'E', icon: '😥' });
	}
	if (isLow(dims.E.score)) {
		demotivators.push({ text: 'Excessive emotional processing and "feelings talks"', dim: 'E', icon: '🙄' });
	}
	if (isHigh(dims.A.score)) {
		demotivators.push({ text: 'Conflict-heavy environments and hostile competition', dim: 'A', icon: '😟' });
	}
	if (isLow(dims.A.score)) {
		demotivators.push({ text: 'Having to constantly accommodate others\' needs', dim: 'A', icon: '😑' });
	}

	if (demotivators.length < 3) {
		demotivators.push({ text: 'Material that feels irrelevant or disconnected from real life', dim: '-', icon: '🥱' });
	}

	return demotivators.slice(0, 6);
}

function buildFlowTriggers(dims: DimensionsMap): string[] {
	const triggers: string[] = [];
	if (isHigh(dims.O.score)) triggers.push('Intellectually stimulating material that challenges current understanding');
	if (isHigh(dims.C.score)) triggers.push('Clear goals with measurable progress toward mastery');
	if (isHigh(dims.X.score)) triggers.push('Dynamic group activities with active participation');
	if (isLow(dims.X.score)) triggers.push('Quiet, uninterrupted deep-work sessions');
	if (isHigh(dims.E.score)) triggers.push('Feeling connected to the subject matter emotionally');
	if (isLow(dims.E.score)) triggers.push('Direct, efficient instruction without emotional overhead');
	if (triggers.length < 2) triggers.push('Material matched to the right difficulty level: challenging but achievable');
	return triggers.slice(0, 4);
}

function buildDisengagementSigns(dims: DimensionsMap): string[] {
	const signs: string[] = [];
	if (isHigh(dims.X.score)) signs.push('Becomes chatty or restless. Seeks social distraction');
	if (isLow(dims.X.score)) signs.push('Withdraws and becomes very quiet. Stops contributing');
	if (isHigh(dims.E.score)) signs.push('Shows visible anxiety or frustration. May become tearful');
	if (isLow(dims.E.score)) signs.push('Appears flat and indifferent. Hard to read emotionally');
	if (isLow(dims.C.score)) signs.push('Starts procrastinating or switching to unrelated tasks');
	if (isHigh(dims.C.score)) signs.push('Becomes rigidly perfectionist. Gets stuck on details');
	if (signs.length < 2) signs.push('Output quality drops. Doing the minimum to get by');
	return signs.slice(0, 4);
}

function buildInterventions(dims: DimensionsMap): string[] {
	const interventions: string[] = [];
	if (isHigh(dims.X.score)) interventions.push('Introduce a group activity or discussion to re-energise');
	if (isLow(dims.X.score)) interventions.push('Give space and check in privately. Avoid putting on the spot');
	if (isHigh(dims.E.score)) interventions.push('Offer reassurance and break the task into smaller, less overwhelming steps');
	if (isHigh(dims.O.score)) interventions.push('Introduce a new angle or challenge to reignite curiosity');
	if (isLow(dims.C.score)) interventions.push('Provide an immediate, achievable micro-goal to rebuild momentum');
	if (isHigh(dims.C.score)) interventions.push('Remind them that "good enough" is acceptable. Reduce perfectionism pressure');
	if (interventions.length < 2) interventions.push('Change the activity type: switch from passive to active learning');
	return interventions.slice(0, 4);
}
