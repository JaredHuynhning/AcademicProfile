// @ts-nocheck
/**
 * Section 7: Study Strategies & Exam Prep
 * Driven by O+C methods, subject approaches, E+C exam prep
 */
import { isHigh, isLow, classifyLevel, DimensionsMap } from './helpers';
import { analyzeOC } from './combinations';

interface Results {
	dimensions: DimensionsMap;
	[key: string]: unknown;
}

export function generateStudy(results: Results) {
	const dims = results.dimensions;
	const oc = analyzeOC(dims.O.score, dims.C.score);
	const tm = buildTimeManagement(dims);
	const methods = buildMethods(dims);

	const topMethods = methods.slice(0, 3).map(m => m.name).join(', ');

	const narrative = [
		`Your study approach is best described as "${oc.label}". ${oc.description}`,
		`As a "${tm.style}" type, ${tm.description}`,
		`The study methods that best suit your personality are: ${topMethods}. These leverage your natural tendencies rather than fighting against them. ${methods[0]?.description || ''}`,
		tm.warning
	].join('\n\n');

	return {
		narrative,
		studyApproach: oc,
		methods,
		subjectStrategies: buildSubjectStrategies(dims),
		examPrep: buildExamPrep(dims),
		timeManagement: tm,
		weeklyPlan: buildWeeklyPlan(dims)
	};
}

function buildMethods(dims: DimensionsMap) {
	const methods: { name: string; description: string; fit: string; icon: string }[] = [];

	// Core methods based on O+C
	if (isHigh(dims.O.score)) {
		methods.push({
			name: 'Mind Mapping',
			description: 'Create visual maps of concepts and connections. Your creative mind naturally sees relationships between ideas.',
			fit: 'Excellent',
			icon: '🗺️'
		});
		methods.push({
			name: 'Cross-Subject Connections',
			description: 'Link new topics to other subjects or real-world examples. You learn best when ideas interconnect.',
			fit: 'Excellent',
			icon: '🔗'
		});
	}
	if (isHigh(dims.C.score)) {
		methods.push({
			name: 'Spaced Repetition',
			description: 'Use flashcard systems (like Anki) with scheduled review sessions. Your discipline makes this systematic approach highly effective.',
			fit: 'Excellent',
			icon: '🔁'
		});
		methods.push({
			name: 'Cornell Notes',
			description: 'Structured note-taking with questions, notes, and summaries. Matches your organised approach perfectly.',
			fit: 'Excellent',
			icon: '📝'
		});
	}
	if (isHigh(dims.X.score)) {
		methods.push({
			name: 'Teach-Back Method',
			description: 'Explain concepts to a study partner or even an imaginary audience. Teaching forces deep understanding.',
			fit: 'Excellent',
			icon: '🎤'
		});
		methods.push({
			name: 'Group Study Sessions',
			description: 'Structured group revision with assigned topics. Your social energy makes this productive rather than distracting.',
			fit: 'Good',
			icon: '👥'
		});
	}
	if (isLow(dims.X.score)) {
		methods.push({
			name: 'Deep Reading',
			description: 'Focused solo reading with annotation. Your preference for quiet focus makes this highly productive.',
			fit: 'Excellent',
			icon: '📖'
		});
	}
	if (isLow(dims.C.score)) {
		methods.push({
			name: 'Pomodoro Technique',
			description: '25 minutes focused work, 5-minute break. Provides the external structure you need without feeling oppressive.',
			fit: 'Excellent',
			icon: '🍅'
		});
	}

	// Universal good methods
	methods.push({
		name: 'Active Recall',
		description: 'Close your notes and try to recall key points from memory. The effort of retrieval strengthens learning more than re-reading.',
		fit: 'Good',
		icon: '🧠'
	});

	return methods.slice(0, 6);
}

function buildSubjectStrategies(dims: DimensionsMap) {
	return {
		stem: {
			label: 'STEM Subjects',
			icon: '🔬',
			strategies: buildSTEM(dims)
		},
		humanities: {
			label: 'Humanities & Languages',
			icon: '📚',
			strategies: buildHumanities(dims)
		},
		creative: {
			label: 'Creative & Practical',
			icon: '🎨',
			strategies: buildCreative(dims)
		}
	};
}

function buildSTEM(dims: DimensionsMap): string[] {
	const strategies: string[] = [];
	if (isHigh(dims.C.score)) {
		strategies.push('Work through practice problems systematically, build from easy to hard');
		strategies.push('Create formula sheets and procedure checklists for each topic');
	} else {
		strategies.push('Start with practice problems to identify gaps, then study targeted theory');
		strategies.push('Use video tutorials to make abstract concepts more tangible');
	}
	if (isHigh(dims.O.score)) {
		strategies.push('Explore the "why" behind formulas, understanding derivations aids memory');
	} else {
		strategies.push('Focus on mastering procedures first, then build conceptual understanding');
	}
	if (isHigh(dims.X.score)) {
		strategies.push('Form a study group to work through problem sets together');
	} else {
		strategies.push('Work through problems independently, then check answers against a solution guide');
	}
	return strategies;
}

function buildHumanities(dims: DimensionsMap): string[] {
	const strategies: string[] = [];
	if (isHigh(dims.O.score)) {
		strategies.push('Explore multiple perspectives and interpretations, your curiosity is an asset here');
		strategies.push('Write comparative essays that connect different ideas and time periods');
	} else {
		strategies.push('Focus on key themes and arguments, use structured essay templates');
		strategies.push('Create timelines and fact sheets to organise information clearly');
	}
	if (isHigh(dims.E.score)) {
		strategies.push('Connect with the human stories behind historical events and literature');
	}
	if (isHigh(dims.C.score)) {
		strategies.push('Build a vocabulary notebook with structured definitions and usage examples');
	} else {
		strategies.push('Use flashcard apps for vocabulary, they provide structure without feeling rigid');
	}
	return strategies;
}

function buildCreative(dims: DimensionsMap): string[] {
	const strategies: string[] = [];
	if (isHigh(dims.O.score)) {
		strategies.push('Let yourself experiment freely first, then refine and edit');
		strategies.push('Keep an inspiration journal, collect ideas from everywhere');
	} else {
		strategies.push('Start with clear guidelines and templates, then personalise');
		strategies.push('Study examples of excellent work to understand standards');
	}
	if (isHigh(dims.C.score)) {
		strategies.push('Plan creative projects with milestones and deadlines for each stage');
	} else {
		strategies.push('Set a deadline for the "exploration" phase, then commit to one direction');
	}
	return strategies;
}

function buildExamPrep(dims: DimensionsMap) {
	const plan: {
		timeline: { week: string; action: string }[];
		dayBefore: string[];
		dayOf: string[];
	} = {
		timeline: [],
		dayBefore: [],
		dayOf: []
	};

	// Timeline (4 weeks out)
	if (isHigh(dims.C.score)) {
		plan.timeline = [
			{ week: '4 weeks before', action: 'Create a detailed revision timetable covering all topics' },
			{ week: '3 weeks before', action: 'First pass through all material, identify weak areas' },
			{ week: '2 weeks before', action: 'Deep dive into weak areas with practice questions' },
			{ week: '1 week before', action: 'Full practice papers under timed conditions' },
			{ week: 'Final days', action: 'Light review of key summaries, no new material' }
		];
	} else {
		plan.timeline = [
			{ week: '4 weeks before', action: 'List all topics to cover, honest audit of what you know' },
			{ week: '3 weeks before', action: 'Focus on understanding (not memorising) the hardest topics' },
			{ week: '2 weeks before', action: 'Start practice questions, learn by doing' },
			{ week: '1 week before', action: 'Create one-page summaries for each topic' },
			{ week: 'Final days', action: 'Review summaries and get a good night\'s sleep' }
		];
	}

	// Day before
	if (isHigh(dims.E.score)) {
		plan.dayBefore = [
			'Light review only, no new material',
			'Prepare everything you need (pens, ID, water)',
			'Do something relaxing in the evening',
			'Practice deep breathing or a calming routine',
			'Go to bed at your normal time, avoid late cramming'
		];
	} else {
		plan.dayBefore = [
			'Quick review of key summaries',
			'Prepare all materials and logistics',
			'Light exercise to reduce tension',
			'Early night, sleep is more valuable than last-minute study'
		];
	}

	// Day of
	if (isHigh(dims.E.score)) {
		plan.dayOf = [
			'Arrive early to settle nerves',
			'Use a calming technique before entering the room',
			'Read through the entire paper before starting',
			'Start with questions you feel confident about to build momentum',
			'If anxiety spikes, pause for 3 deep breaths, you are prepared'
		];
	} else {
		plan.dayOf = [
			'Arrive with time to spare',
			'Scan the full paper and allocate time per section',
			'Start with your strongest section to build confidence',
			'Keep track of time and move on if stuck'
		];
	}

	return plan;
}

function buildTimeManagement(dims: DimensionsMap) {
	if (isHigh(dims.C.score)) {
		return {
			style: 'Structured Planner',
			description: 'You naturally organise your time well. Your conscientiousness means you thrive with formal planning tools and detailed schedules. You are the type of student who benefits from planners, checklists, and structured revision timetables. The risk is over-planning and perfectionism. Leave buffer time for the unexpected and remember that "done" is better than "perfect".',
			tools: ['Weekly study planner (paper or digital)', 'Subject-specific checklists', 'Colour-coded calendar blocking'],
			warning: 'Watch for over-planning. Leave some buffer time for the unexpected. If planning takes more than 10 minutes, you are procrastinating through planning.'
		};
	}
	if (isLow(dims.C.score)) {
		return {
			style: 'Sprint Worker',
			description: 'You work in bursts of energy rather than steady schedules. Traditional study planners will not work for you because you will abandon them within a week. Instead, design your system around this reality: short sprints, simple task lists, and external accountability (study partners, tutors, apps with reminders). Your key challenge is starting. Once you start, you often do good work.',
			tools: ['Pomodoro timer app (25 min on, 5 min off)', 'Simple daily "top 3 tasks" list (not a full planner)', 'Visual countdown to deadlines on your wall or phone'],
			warning: 'Start assignments the day they are set. Even just 10 minutes of planning prevents last-minute panic. The hardest part is the first 2 minutes.'
		};
	}
	return {
		style: 'Flexible Organiser',
		description: 'You plan when needed but adapt easily. A light framework keeps you on track without feeling restrictive. You do not need a colour-coded study bible, but you do need a weekly check-in with yourself: what is due, what is most important, and when will you do it? This balance of structure and flexibility is actually an advantage in real-world environments.',
		tools: ['Weekly planner with flexible daily tasks', 'Priority matrix (urgent vs important)', 'Regular weekly review of progress'],
		warning: 'Identify your most productive time of day and protect it for the hardest work. Without this, your flexibility can become avoidance.'
	};
}

function buildWeeklyPlan(dims: DimensionsMap) {
	const cHigh = isHigh(dims.C.score);
	const xHigh = isHigh(dims.X.score);
	const oHigh = isHigh(dims.O.score);

	return {
		weekdays: {
			afterSchool: cHigh
				? 'Review today\'s notes, update planner, 30-45 min focused study'
				: 'Quick 15-min review of key takeaways, then a break before study',
			evening: cHigh
				? 'Complete homework, prepare for tomorrow, organised notes review'
				: 'Tackle one assignment or study task, use a timer to maintain focus'
		},
		weekend: {
			saturday: xHigh
				? 'Study group session in the morning, free afternoon, light review evening'
				: oHigh
					? 'Creative study session (mind maps, projects), explore topics of interest'
					: 'Practice problems or revision of the week\'s hardest topic',
			sunday: 'Light review and planning for the week ahead, prepare materials and set goals'
		}
	};
}
