/**
 * Section 5: How You Learn Best
 * Driven by C+X, O+C, O+X combinations
 */
import { isHigh, isLow, pickByLevel, classifyLevel } from './helpers.js';
import { analyzeCX, analyzeOC, analyzeOX } from './combinations.js';

export function generateLearning(results) {
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

function buildLearningSummary(cx, oc, ox) {
	return `As a "${cx.label}" with a "${oc.label}" approach to learning, you ${cx.description.split('.')[0].toLowerCase()}. Your curiosity style is best described as "${ox.label}" — ${ox.description.split('.')[0].toLowerCase()}.`;
}

function buildEnvironment(dims) {
	const items = [];

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
			high: ['Varied, multi-sensory learning materials — videos, discussions, hands-on projects', 'You need intellectual stimulation and novelty to stay engaged'],
			moderate: ['A mix of traditional and creative learning methods', 'Alternate between textbook study and more engaging formats'],
			low: ['Consistent, familiar methods with clear practical applications', 'Stick with what works — textbooks, practice problems, and direct instruction']
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

function buildAttentionProfile(dims) {
	const cLevel = classifyLevel(dims.C.score);
	const oLevel = classifyLevel(dims.O.score);
	const xLevel = classifyLevel(dims.X.score);

	const profile = {
		sustainedFocus: cLevel === 'high' ? 'Strong — can focus for extended periods' : cLevel === 'low' ? 'Variable — works best in short bursts' : 'Moderate — can focus well with occasional breaks',
		bestTimeBlocks: cLevel === 'high' ? '45-60 minute blocks with short breaks' : cLevel === 'low' ? '20-25 minute sprints (Pomodoro style)' : '30-40 minute blocks with 10-minute breaks',
		distractionRisk: xLevel === 'high' ? 'Social distractions — may chat or help others instead of focusing' : xLevel === 'low' ? 'Internal — may overthink or drift into thought' : 'Moderate — manageable with awareness',
		engagementDriver: oLevel === 'high' ? 'Novelty and intellectual challenge' : oLevel === 'low' ? 'Clear purpose and practical relevance' : 'A mix of challenge and practical payoff'
	};

	return profile;
}

function buildPreferredFormats(dims) {
	const formats = [];

	if (isHigh(dims.O.score)) {
		formats.push({ format: 'Creative Projects', fit: 'Excellent', reason: 'Channels your creativity and love of exploration' });
		formats.push({ format: 'Discussion-Based Learning', fit: 'Excellent', reason: 'Stimulates your intellectual curiosity' });
	}
	if (isHigh(dims.C.score)) {
		formats.push({ format: 'Structured Lectures', fit: 'Excellent', reason: 'Aligns with your preference for organised content' });
		formats.push({ format: 'Practice Problems', fit: 'Excellent', reason: 'Satisfies your need for systematic skill-building' });
	}
	if (isHigh(dims.X.score)) {
		formats.push({ format: 'Group Work', fit: 'Excellent', reason: 'Energises you through social interaction' });
		formats.push({ format: 'Presentations', fit: 'Good', reason: 'Leverages your social confidence' });
	}
	if (isLow(dims.X.score)) {
		formats.push({ format: 'Independent Reading', fit: 'Excellent', reason: 'Matches your preference for quiet, solo work' });
		formats.push({ format: 'Written Assessments', fit: 'Good', reason: 'Allows you to express ideas without social pressure' });
	}
	if (isLow(dims.C.score)) {
		formats.push({ format: 'Project-Based Learning', fit: 'Good', reason: 'More engaging than routine homework' });
	}
	if (isHigh(dims.E.score)) {
		formats.push({ format: 'Supportive Tutorials', fit: 'Good', reason: 'Provides emotional safety to ask questions' });
	}

	// Ensure at least 4 formats
	if (formats.length < 4) {
		formats.push({ format: 'Mixed Methods', fit: 'Good', reason: 'Your balanced profile suits varied approaches' });
	}

	return formats.slice(0, 6);
}

function buildKeyInsight(dims) {
	if (isHigh(dims.C.score) && isHigh(dims.O.score)) {
		return 'You have the rare combination of creativity AND discipline. You can generate ideas and follow through on them. This is a powerful learning advantage — use it by choosing projects that challenge you creatively.';
	}
	if (isHigh(dims.O.score) && isLow(dims.C.score)) {
		return 'Your biggest learning challenge is the gap between your ideas and your execution. You have fantastic creative potential — the key is building small habits of follow-through. Start with 10-minute daily study commitments and build up.';
	}
	if (isHigh(dims.C.score) && isLow(dims.O.score)) {
		return 'You are extremely reliable and thorough, which will serve you well in any academic pursuit. To unlock your full potential, occasionally push yourself to try unfamiliar approaches — your discipline will ensure you execute them well.';
	}
	if (isHigh(dims.X.score) && isLow(dims.C.score)) {
		return 'You learn best through social interaction but may struggle with solitary revision. Build study groups, find accountability partners, and use social commitment to drive your preparation.';
	}
	return 'Your balanced profile gives you flexibility across many learning situations. The key is identifying which specific approaches work best for YOU and deliberately choosing them, rather than defaulting to whatever is easiest.';
}
