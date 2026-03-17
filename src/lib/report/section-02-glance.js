/**
 * Section 2: Personality at a Glance
 */
import { DIM_ORDER, DIM_COLORS, DIM_SHORT, DIM_ICONS, formatScore, levelLabel, scorePercent } from './helpers.js';

export function generateGlance(results) {
	return {
		rows: DIM_ORDER.map((key) => {
			const dim = results.dimensions[key];
			return {
				key,
				icon: DIM_ICONS[key],
				name: dim.name,
				shortName: DIM_SHORT[key],
				score: formatScore(dim.score),
				rawScore: dim.score,
				percent: scorePercent(dim.score),
				level: levelLabel(dim.level),
				color: DIM_COLORS[key],
				oneLiner: getOneLiner(key, dim.level)
			};
		})
	};
}

function getOneLiner(key, level) {
	const lines = {
		H: {
			very_low: 'Pragmatic and status-conscious, motivated by recognition and material rewards.',
			low: 'Competitive and results-driven, values achievement and personal advancement.',
			moderate: 'Balanced between principle and pragmatism. Fair but also practical.',
			high: 'Honest and fair, values integrity over personal gain.',
			very_high: 'Deeply principled. Always puts fairness and ethics first, even at personal cost.'
		},
		E: {
			very_low: 'Emotionally tough. Rarely rattled and handles stress independently.',
			low: 'Composed under pressure, processes emotions internally without much outward display.',
			moderate: 'Balanced emotional awareness. Feels things but keeps perspective.',
			high: 'Emotionally attuned, sensitive to feelings and seeks connection when stressed.',
			very_high: 'Deeply feeling. Experiences emotions intensely and needs emotional support to thrive.'
		},
		X: {
			very_low: 'Very reserved. Prefers solitude and needs minimal social interaction to feel energised.',
			low: 'Quiet and reflective. Works best independently and speaks when it matters.',
			moderate: 'Socially flexible, can work in groups or alone, depending on the task.',
			high: 'Outgoing and sociable, energised by people and comfortable speaking up.',
			very_high: 'Highly extraverted. Thrives on social interaction, leads naturally, and radiates energy.'
		},
		A: {
			very_low: 'Direct and uncompromising, values honesty over diplomacy.',
			low: 'Assertive and independent-minded. Not afraid to push back on ideas.',
			moderate: 'Reasonably cooperative. Works well with others while maintaining own views.',
			high: 'Gentle and accommodating, prioritises harmony and is easy to work with.',
			very_high: 'Extremely cooperative. Always willing to compromise and puts others\' needs first.'
		},
		C: {
			very_low: 'Free-spirited. Resists routine and prefers spontaneity over planning.',
			low: 'Flexible with structure, works in bursts and prefers low-pressure deadlines.',
			moderate: 'Reasonably organised. Plans when needed but also adapts on the fly.',
			high: 'Well-organised. Plans ahead, meets deadlines, and maintains consistent effort.',
			very_high: 'Exceptionally disciplined: meticulous planning, thorough preparation, and high standards.'
		},
		O: {
			very_low: 'Practical and concrete. Prefers tried-and-tested methods over novelty.',
			low: 'Straightforward thinker, focuses on practical applications rather than theory.',
			moderate: 'Open but grounded, curious within practical boundaries.',
			high: 'Intellectually curious. Enjoys exploring new ideas and creative approaches.',
			very_high: 'Highly creative and unconventional. Loves abstract thinking and novel experiences.'
		}
	};
	return lines[key]?.[level] || '';
}
