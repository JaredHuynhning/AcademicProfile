// @ts-nocheck
/**
 * Section C3: How You Learn Best
 * Ideal conditions (4 cards) + personality↔academic alignments/conflicts.
 */
import { getLearningArchetype, classifyLevel, DIM_NAMES } from './helpers';

export function generateHowYouLearn(results, crossRefResult) {
	const dims = results.dimensions;
	const sp = results.studyProfile;
	const archetype = getLearningArchetype(dims, sp);

	const xScore = dims.X?.score ?? 3;
	const cScore = dims.C?.score ?? 3;
	const oScore = dims.O?.score ?? 3;
	const eAnxiety = dims.E?.facets?.anxiety?.score ?? 2;
	const dominantApproach = sp?.dominantApproach || 'strategic';
	const testAnxiety = sp?.selfRegulation?.testAnxiety?.score ?? 2;

	const xLevel = classifyLevel(xScore);
	const cLevel = classifyLevel(cScore);
	const oLevel = classifyLevel(oScore);

	const socialSetting =
		xLevel === 'high'
			? { icon: '👥', category: 'Social Setting', description: 'Collaborative — you thrive with study partners, group discussions, and explaining concepts to others.' }
			: xLevel === 'low'
				? { icon: '🔇', category: 'Social Setting', description: 'Quiet and independent — you focus best alone or in very small, low-distraction environments.' }
				: { icon: '🔄', category: 'Social Setting', description: 'Flexible — you can work alone or in small groups. Mix both to keep energy balanced.' };

	const structureMap = {
		high: {
			deep: 'High structure with deep dives — you need a clear plan AND time to explore concepts in depth.',
			strategic: 'High structure with clear milestones — timed blocks, checklists, and systematic review cycles.',
			surface: 'High structure with routine tasks — daily habits and short, predictable study sessions work best.'
		},
		moderate: {
			deep: 'Moderate structure — loosely planned but with room for exploration when a topic sparks interest.',
			strategic: 'Moderate structure — some planning helps, but flexibility prevents boredom.',
			surface: 'Light structure — a basic routine is better than none, even if it is simple.'
		},
		low: {
			deep: 'Minimal structure — follow curiosity but add a weekly check-in to avoid losing track of deadlines.',
			strategic: 'Flexible with occasional review — a simple weekly list can prevent important tasks from slipping.',
			surface: 'Very light structure — any system you actually use is better than a perfect one you ignore.'
		}
	};

	const structureLevel = {
		icon: '📋',
		category: 'Structure Level',
		description: structureMap[cLevel]?.[dominantApproach] || 'A moderate level of structure with flexibility to adapt.'
	};

	const stimulation =
		oLevel === 'high'
			? { icon: '🎨', category: 'Stimulation', description: 'Varied and creative — you need novelty, interesting questions, and opportunities to make connections across topics.' }
			: oLevel === 'low'
				? { icon: '📌', category: 'Stimulation', description: 'Straightforward and practical — clear goals, predictable methods, and direct application to real situations.' }
				: { icon: '⚖️', category: 'Stimulation', description: 'Mix of familiar and creative — some variety keeps engagement up, but not so much that it distracts.' };

	const highAnxiety = eAnxiety >= 3.5 || testAnxiety >= 3.5;
	const emotionalClimate = highAnxiety
		? { icon: '🌿', category: 'Emotional Climate', description: 'Calm, low-pressure environment — anxiety is a real factor. Short pre-study calming routines (box breathing, 5-min journaling) help unlock focus.' }
		: eAnxiety < 2.5
			? { icon: '🔥', category: 'Emotional Climate', description: 'Energising and challenging — you stay composed under pressure and perform best when you push yourself.' }
			: { icon: '😊', category: 'Emotional Climate', description: 'Supportive and encouraging — you do your best when there is positive feedback and a sense of progress.' };

	const idealConditions = [socialSetting, structureLevel, stimulation, emotionalClimate];

	const alignments = [];

	for (const insight of crossRefResult.byType.confirmation || []) {
		alignments.push({
			type: 'aligned',
			description: insight.insight
		});
	}

	for (const insight of crossRefResult.byType.contradiction || []) {
		alignments.push({
			type: 'conflict',
			description: insight.insight
		});
	}

	return {
		archetype,
		idealConditions,
		alignments: alignments.slice(0, 6)
	};
}
