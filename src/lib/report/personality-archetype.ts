import { type DimensionsMap, type DimKey, rankDimensions } from './helpers';

const SINGLE_DOMINANT: Record<DimKey, string> = {
	H: 'The Principled Advocate',
	E: 'The Empathic Reflector',
	X: 'The Social Catalyst',
	A: 'The Diplomatic Harmoniser',
	C: 'The Disciplined Achiever',
	O: 'The Curious Visionary',
};

const PAIR_ARCHETYPES: Record<string, string> = {
	'A+C': 'The Reliable Team Anchor',
	'A+E': 'The Empathetic Peacemaker',
	'A+H': 'The Principled Collaborator',
	'A+O': 'The Open-Minded Diplomat',
	'A+X': 'The Warm Influencer',
	'C+E': 'The Careful Sentinel',
	'C+H': 'The Ethical Perfectionist',
	'C+O': 'The Strategic Idealist',
	'C+X': 'The Driven Organiser',
	'E+H': 'The Compassionate Idealist',
	'E+O': 'The Sensitive Philosopher',
	'E+X': 'The Passionate Connector',
	'H+O': 'The Principled Explorer',
	'H+X': 'The Charismatic Principlist',
	'O+X': 'The Enthusiastic Innovator',
};

function pairKey(a: DimKey, b: DimKey): string {
	return [a, b].sort().join('+');
}

export function getPersonalityArchetype(dimensions: DimensionsMap): string {
	const ranked = rankDimensions(dimensions);
	if (ranked.length < 2) return 'The Balanced Generalist';

	const [first, second] = ranked;
	const allWithin = ranked.every((d) => Math.abs(d.score - ranked[0].score) < 0.3);
	if (allWithin) return 'The Balanced Generalist';

	if (first.score - second.score >= 0.5) {
		return SINGLE_DOMINANT[first.key as DimKey] ?? 'The Balanced Generalist';
	}

	const key = pairKey(first.key as DimKey, second.key as DimKey);
	return PAIR_ARCHETYPES[key] ?? 'The Balanced Generalist';
}
