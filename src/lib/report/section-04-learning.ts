// @ts-nocheck
/**
 * Section 5: How You Learn Best
 * Driven by C+X, O+C, O+X combinations
 */
import { isHigh, isLow, pickByLevel, classifyLevel, DimensionsMap } from './helpers';
import { analyzeCX, analyzeOC, analyzeOX } from './combinations';

interface Results {
	dimensions: DimensionsMap;
	[key: string]: unknown;
}

export function generateLearning(results: Results) {
	const dims = results.dimensions;
	const cx = analyzeCX(dims.C.score, dims.X.score);
	const oc = analyzeOC(dims.O.score, dims.C.score);
	const ox = analyzeOX(dims.O.score, dims.X.score);

	return {
		learningStyle: {
			primary: cx,
			secondary: oc,
			curiosity: ox,
			summary: buildLearningSummary(cx, oc, ox)
		},
		idealEnvironment: buildEnvironment(dims),
		attentionProfile: buildAttentionProfile(dims),
		preferredFormats: buildPreferredFormats(dims),
		keyInsight: buildKeyInsight(dims)
	};
}

function buildLearningSummary(
	cx: { label: string; description: string },
	oc: { label: string; description: string },
	ox: { label: string; description: string }
): string {
	return `As a "${cx.label}" with a "${oc.label}" approach to learning, you ${cx.description.split('.')[0].toLowerCase()}. Your curiosity style is best described as "${ox.label}": ${ox.description.split('.')[0].toLowerCase()}.`;
}

function buildEnvironment(dims: DimensionsMap) {
	const items: { category: string; icon: string; recommendation: string[] }[] = [];

	// Social setting (X)
	items.push({
		category: 'Social Setting',
		icon: '👥',
		recommendation: pickByLevel(dims.X.score, {
			high: ['Collaborative spaces like study groups, libraries with group rooms, or cafes', 'You thrive with background social energy and peer interaction'],
			moderate: ['Flexible spaces where you can choose solo or group work', 'A quiet library with an option to move to a group area works well'],
			low: ['Quiet, private spaces with minimal interruption', 'Individual study rooms, home desks, or noise-cancelling headphones in the library']
		})
	});

	// Structure level (C)
	items.push({
		category: 'Structure Level',
		icon: '📋',
		recommendation: pickByLevel(dims.C.score, {
			high: ['Clear schedules, organised notes, and well-defined study plans', 'Use planners, colour-coded systems, and structured revision timetables'],
			moderate: ['A loose framework with room for adjustment', 'A weekly plan with daily flexibility works best for you'],
			low: ['Light structure with variety and frequent breaks', 'Short study sprints (25 min) with changes of activity between sessions']
		})
	});

	// Stimulation (O)
	items.push({
		category: 'Stimulation',
		icon: '💡',
		recommendation: pickByLevel(dims.O.score, {
			high: ['Varied, multi-sensory learning materials: videos, discussions, hands-on projects', 'You need intellectual stimulation and novelty to stay engaged'],
			moderate: ['A mix of traditional and creative learning methods', 'Alternate between textbook study and more engaging formats'],
			low: ['Consistent, familiar methods with clear practical applications', 'Stick with what works: textbooks, practice problems, and direct instruction']
		})
	});

	// Emotional safety (E)
	items.push({
		category: 'Emotional Climate',
		icon: '💭',
		recommendation: pickByLevel(dims.E.score, {
			high: ['Supportive, low-pressure environments with patient teachers', 'You perform best when you feel emotionally safe and connected'],
			moderate: ['A balanced environment with reasonable expectations and some support', 'Regular check-ins help without feeling overbearing'],
			low: ['A results-focused environment with direct feedback', 'You handle pressure well and prefer efficiency over emotional processing']
		})
	});

	return items;
}

function buildAttentionProfile(dims: DimensionsMap) {
	const cLevel = classifyLevel(dims.C.score);
	const oLevel = classifyLevel(dims.O.score);
	const xLevel = classifyLevel(dims.X.score);

	const focus = cLevel === 'high'
		? 'Your focus is strong. You can concentrate for extended periods (45-60 minute blocks with short breaks work best).'
		: cLevel === 'low'
			? 'Your focus works best in short bursts. Try 20-25 minute sprints (Pomodoro style) with breaks between sessions.'
			: 'Your focus is moderate. 30-40 minute study blocks with 10-minute breaks will keep you productive without burnout.';

	const distraction = xLevel === 'high'
		? 'Your main distraction risk is social: you may chat or help others instead of focusing. A quiet space or noise-cancelling headphones during deep work can help.'
		: xLevel === 'low'
			? 'Your main distraction risk is internal: you may overthink or drift into thought. Writing down stray thoughts to deal with later keeps you on track.'
			: 'Your distraction risk is moderate and manageable with basic awareness. Remove your phone from your study space.';

	const engagement = oLevel === 'high'
		? 'You are driven by novelty and intellectual challenge. Varied, stimulating material keeps you engaged. Routine or repetitive tasks will bore you quickly.'
		: oLevel === 'low'
			? 'You are driven by clear purpose and practical relevance. You engage best when you understand exactly why something matters.'
			: 'You are driven by a mix of intellectual challenge and practical payoff. Balance variety with clear goals.';

	return {
		description: `${focus} ${distraction} ${engagement}`
	};
}

function buildPreferredFormats(dims: DimensionsMap) {
	const formats: { format: string; fit: string; reason: string }[] = [];

	if (isHigh(dims.O.score)) {
		formats.push({ format: 'Creative Projects', fit: 'Excellent', reason: 'Channels your creativity and love of exploration. You thrive when you can approach problems in original ways and make unexpected connections between ideas.' });
		formats.push({ format: 'Discussion-Based Learning', fit: 'Excellent', reason: 'Stimulates your intellectual curiosity. You learn best when you can ask questions, debate ideas, and hear multiple perspectives.' });
	}
	if (isHigh(dims.C.score)) {
		formats.push({ format: 'Structured Lectures', fit: 'Excellent', reason: 'Aligns with your preference for organised content. You absorb information efficiently when it is presented in a clear, logical sequence with defined learning outcomes.' });
		formats.push({ format: 'Practice Problems', fit: 'Excellent', reason: 'Satisfies your need for systematic skill-building. Repetitive practice with increasing difficulty builds the mastery you value.' });
	}
	if (isHigh(dims.X.score)) {
		formats.push({ format: 'Group Work', fit: 'Excellent', reason: 'Energises you through social interaction. You perform better when you can bounce ideas off others and explain concepts to peers.' });
		formats.push({ format: 'Presentations', fit: 'Good', reason: 'Leverages your social confidence. You are comfortable speaking in front of others and this format lets you demonstrate understanding actively.' });
	}
	if (isLow(dims.X.score)) {
		formats.push({ format: 'Independent Reading', fit: 'Excellent', reason: 'Matches your preference for quiet, solo work. You process information deeply when you have space to think without social interruption.' });
		formats.push({ format: 'Written Assessments', fit: 'Good', reason: 'Allows you to express ideas without social pressure. You often think more clearly in writing than in verbal discussions.' });
	}
	if (isLow(dims.C.score)) {
		formats.push({ format: 'Project-Based Learning', fit: 'Good', reason: 'More engaging than routine homework. Hands-on projects with real outcomes hold your attention better than abstract exercises.' });
	}
	if (isHigh(dims.E.score)) {
		formats.push({ format: 'Supportive Tutorials', fit: 'Good', reason: 'Provides emotional safety to ask questions. You learn best in low-pressure environments where mistakes are treated as learning opportunities.' });
	}

	// Ensure at least 4 formats
	if (formats.length < 4) {
		formats.push({ format: 'Mixed Methods', fit: 'Good', reason: 'Your balanced profile suits varied approaches' });
	}

	return formats.slice(0, 6);
}

function buildKeyInsight(dims: DimensionsMap): string {
	if (isHigh(dims.C.score) && isHigh(dims.O.score)) {
		return 'You have the rare combination of creativity AND discipline. You can generate ideas and follow through on them. This is a powerful learning advantage, use it by choosing projects that challenge you creatively.';
	}
	if (isHigh(dims.O.score) && isLow(dims.C.score)) {
		return 'Your biggest learning challenge is the gap between your ideas and your execution. You have fantastic creative potential, the key is building small habits of follow-through. Start with 10-minute daily study commitments and build up.';
	}
	if (isHigh(dims.C.score) && isLow(dims.O.score)) {
		return 'You are extremely reliable and thorough, which will serve you well in any academic pursuit. To unlock your full potential, occasionally push yourself to try unfamiliar approaches, your discipline will ensure you execute them well.';
	}
	if (isHigh(dims.X.score) && isLow(dims.C.score)) {
		return 'You learn best through social interaction but may struggle with solitary revision. Build study groups, find accountability partners, and use social commitment to drive your preparation.';
	}
	return 'Your balanced profile gives you flexibility across many learning situations. The key is identifying which specific approaches work best for YOU and deliberately choosing them, rather than defaulting to whatever is easiest.';
}
