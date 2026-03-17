/**
 * Section 16: Academic Guide for Teachers & Parents
 * Translates academic assessment data (study approach, motivation, self-regulation,
 * grit, focus, energy, subject fit, exam barriers, root cause) into actionable
 * guidance for teachers and parents.
 *
 * Complements Section 9 (personality-based guide) — zero HEXACO data used here.
 */
import { generateRootCause } from './section-15-root-cause.js';

// --- Urgency classification ---

function classifyUrgency(sp, lp, rootCause) {
	// Urgent: severe amotivation + low energy, or extreme anxiety + low energy
	if (sp?.motivation?.amotivation?.score >= 3.0 && lp?.energy?.netEnergy?.score < 2.5) return 'urgent';
	if (sp?.selfRegulation?.testAnxiety?.score >= 4.0 && lp?.energy?.netEnergy?.score < 2.5) return 'urgent';
	if (sp?.selfRegulation?.selfEfficacy?.score < 2.0 && lp?.energy?.netEnergy?.score < 2.5) return 'urgent';

	// Intervention: severe root cause with high confidence, or multiple lows
	const SEVERE_CAUSES = ['burnout-risk', 'confidence-deficit', 'motivation-mismatch', 'capable-but-checked-out', 'perfectionism-paralysis'];
	if (rootCause?.primaryPattern && SEVERE_CAUSES.includes(rootCause.primaryPattern.id) && rootCause.primaryPattern.confidence >= 3.0) return 'intervention';
	let lowCount = 0;
	if (lp?.energy?.netEnergy?.score < 2.5) lowCount++;
	if (lp?.grit?.overall?.score < 2.5) lowCount++;
	if (sp?.selfRegulation?.selfEfficacy?.score < 2.5) lowCount++;
	if (sp?.selfRegulation?.planning?.score < 2.5) lowCount++;
	if (lowCount >= 2) return 'intervention';

	// Enrichment: thriving on all fronts
	if (
		sp?.motivation?.sdi > 3 &&
		(sp?.regulationStrength === 'high' || sp?.selfRegulation?.planning?.score >= 3.5) &&
		lp?.grit?.overall?.score >= 3.0 &&
		!rootCause
	) return 'enrichment';

	return 'support';
}

// --- Teacher guide ---

const APPROACH_LABELS = {
	deep: 'Deep learner',
	strategic: 'Strategic learner',
	surface: 'Surface learner'
};

const MOTIVATION_LABELS = {
	'self-determined': 'self-determined motivation',
	moderate: 'mixed motivation',
	controlled: 'externally driven'
};

const REGULATION_LABELS = {
	high: 'strong self-regulation',
	moderate: 'moderate self-regulation',
	low: 'weak self-regulation'
};

function buildTeacherSnapshot(sp, lp) {
	const approach = sp?.dominantApproach || 'strategic';
	const motivationType = sp?.motivationProfile || 'moderate';
	const regulationLevel = sp?.regulationStrength || 'moderate';

	let headline = APPROACH_LABELS[approach] || 'Learner';

	// Add nuance
	if (motivationType === 'self-determined') {
		headline += ', self-determined';
	} else if (motivationType === 'controlled') {
		headline += ', externally driven';
	} else {
		headline += ', mixed motivation';
	}

	// Regulation with qualifiers
	if (regulationLevel === 'high' && lp?.energy?.netEnergy?.score < 2.5) {
		headline += ', regulation strong but energy depleted';
	} else if (sp?.selfRegulation?.selfEfficacy?.score < 2.5) {
		headline += ', low self-belief';
	} else {
		headline += ', ' + (REGULATION_LABELS[regulationLevel] || 'moderate self-regulation');
	}

	return { headline, approach, motivationType, regulationLevel };
}

function buildInstructionTips(sp, lp) {
	const tips = [];

	// Study approach
	if (sp?.dominantApproach === 'surface') {
		tips.push({
			tip: "Use questioning techniques before giving answers — ask 'why does this work?' not just 'what is the answer?' This student defaults to memorising rather than understanding.",
			evidence: `Surface approach: ${sp.studyApproaches.surface.score.toFixed(1)}/5, Deep: ${sp.studyApproaches.deep.score.toFixed(1)}/5`,
			priority: 'high'
		});
	} else if (sp?.dominantApproach === 'deep') {
		tips.push({
			tip: 'Provide extension materials and open-ended problems — this student craves depth and will disengage with pure repetition.',
			evidence: `Deep approach: ${sp.studyApproaches.deep.score.toFixed(1)}/5`,
			priority: 'medium'
		});
	} else if (sp?.dominantApproach === 'strategic') {
		tips.push({
			tip: "Challenge beyond grade optimisation — push for genuine understanding, not just 'what's on the test.' They'll rise to it.",
			evidence: `Strategic approach: ${sp.studyApproaches.strategic.score.toFixed(1)}/5`,
			priority: 'medium'
		});
	}

	// Self-regulation gaps
	if (sp?.selfRegulation?.planning?.score < 2.5) {
		tips.push({
			tip: 'Provide explicit study plans and checkpoint deadlines — this student lacks internal planning structures and will benefit from externally imposed milestones.',
			evidence: `Planning: ${sp.selfRegulation.planning.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}
	if (sp?.selfRegulation?.selfEfficacy?.score < 2.5) {
		tips.push({
			tip: "Give specific, skill-based praise ('your analysis of X was sophisticated') rather than generic praise. This student doubts their ability and needs concrete evidence of competence.",
			evidence: `Self-efficacy: ${sp.selfRegulation.selfEfficacy.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}
	if (sp?.selfRegulation?.effortRegulation?.score < 2.5) {
		tips.push({
			tip: 'Break long tasks into 15-minute segments with visible progress markers. This student struggles to sustain effort when work is difficult or boring.',
			evidence: `Effort regulation: ${sp.selfRegulation.effortRegulation.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}
	if (sp?.selfRegulation?.testAnxiety?.score >= 3.5) {
		tips.push({
			tip: "Offer practice tests under realistic conditions — familiarity reduces anxiety more than reassurance. Never draw public attention to their nervousness.",
			evidence: `Test anxiety: ${sp.selfRegulation.testAnxiety.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}
	if (sp?.selfRegulation?.helpSeeking?.score < 2.5) {
		tips.push({
			tip: "Proactively check understanding — this student won't ask for help even when stuck. Brief private check-ins during independent work are essential.",
			evidence: `Help-seeking: ${sp.selfRegulation.helpSeeking.score.toFixed(1)}/5`,
			priority: 'medium'
		});
	}

	// Energy
	if (lp?.energy?.netEnergy?.score < 2.5) {
		tips.push({
			tip: "Schedule demanding cognitive tasks for the start of class — this student's energy depletes rapidly. Avoid placing high-stakes assessments late in the day.",
			evidence: `Net energy: ${lp.energy.netEnergy.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}

	// Procrastination
	if (lp?.focus?.procrastination?.score < 2.5) {
		tips.push({
			tip: 'Set frequent short deadlines rather than one large due date. This student procrastinates significantly and needs external structure to start tasks.',
			evidence: `Procrastination resistance: ${lp.focus.procrastination.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}

	// Combinations
	if (sp?.dominantApproach === 'surface' && sp?.motivationProfile === 'controlled') {
		tips.push({
			tip: "This student is going through the motions. Find one topic where they show even slight curiosity and use it as an entry point to deeper engagement. Force won't work — connection might.",
			evidence: `Surface approach + controlled motivation`,
			priority: 'high'
		});
	}
	if (sp?.studyApproaches?.deep?.score >= 3.5 && sp?.motivation?.amotivation?.score >= 2.5) {
		tips.push({
			tip: "Paradox: they CAN think deeply but have lost the will to. This needs a 'why' conversation, not a 'how' intervention. Ask what would make school feel meaningful.",
			evidence: `Deep approach: ${sp.studyApproaches.deep.score.toFixed(1)}/5 but amotivation: ${sp.motivation.amotivation.score.toFixed(1)}/5`,
			priority: 'high'
		});
	}

	// Sort by priority, cap at 5
	tips.sort((a, b) => (a.priority === 'high' ? 0 : 1) - (b.priority === 'high' ? 0 : 1));
	return tips.slice(0, 5);
}

const MOTIVATION_LEVERS = {
	'self-determined': {
		doMore: [
			'Give autonomy and choice — they thrive when trusted to direct their own learning',
			'Connect content to bigger questions and ideas that spark genuine curiosity'
		],
		avoid: [
			'Over-structuring or micromanaging their process',
			'Reducing feedback to grades only — they care about understanding'
		]
	},
	moderate: {
		doMore: [
			"Connect content to their interests and personal goals — show why it matters for THEIR future",
			'Use identified motivation — they value education in principle, help them see the bridge to practice'
		],
		avoid: [
			'Pure external pressure without meaning',
			"Assuming disengagement means they don't care — they're searching for relevance"
		]
	},
	controlled: {
		doMore: [
			'Find ANY intrinsic spark — one interesting angle per topic can shift everything',
			'Bridge from external to identified: help them see how subjects connect to things they actually value'
		],
		avoid: [
			"More external pressure — it's already maxed out and diminishing returns have set in",
			'Punishment for disengagement — it confirms that school is a chore, not a choice'
		]
	}
};

function buildMotivationLevers(sp) {
	const profile = sp?.motivationProfile || 'moderate';
	const levers = MOTIVATION_LEVERS[profile] || MOTIVATION_LEVERS.moderate;

	// Handle amotivated students (regardless of profile label)
	if (sp?.motivation?.amotivation?.score >= 3.0) {
		return {
			doMore: [
				"Rebuild purpose before content — one small win per lesson to reconnect them with competence",
				"Find what they ARE interested in outside school and create bridges to curriculum"
			],
			avoid: [
				"Punishment for disengagement — amotivation is often quiet despair, not laziness",
				"Assuming they're choosing not to try — they may have stopped believing effort matters"
			],
			evidence: `Amotivation: ${sp.motivation.amotivation.score.toFixed(1)}/5, Intrinsic: ${sp.motivation.intrinsic.score.toFixed(1)}/5`
		};
	}

	const parts = [];
	if (sp?.motivation?.intrinsic) parts.push(`Intrinsic: ${sp.motivation.intrinsic.score.toFixed(1)}/5`);
	if (sp?.motivation?.external) parts.push(`External: ${sp.motivation.external.score.toFixed(1)}/5`);
	if (sp?.motivation?.sdi !== undefined) parts.push(`SDI: ${sp.motivation.sdi.toFixed(1)}`);

	return { ...levers, evidence: parts.join(', ') };
}

const EXAM_STRATEGIES = {
	anxiety: {
		label: 'Exam Anxiety',
		strategies: [
			'Allow extra time or accommodations if possible — this student likely knows more than their exam results show',
			'Offer regular practice tests under timed conditions to build familiarity',
			'Never comment publicly on visible anxiety — check in privately afterwards'
		]
	},
	'time-management': {
		label: 'Time Management',
		strategies: [
			'Teach exam pacing explicitly — allocate time per section and practise with a visible clock',
			'Provide timed mock sections regularly so pacing becomes automatic',
			'Suggest starting with questions they know for momentum before tackling harder ones'
		]
	},
	'external-blame': {
		label: 'External Attribution',
		strategies: [
			"After each assessment, do a structured debrief: 'what was in your control?'",
			'Share marking criteria BEFORE the test — transparency reduces blame',
			'Frame results as feedback on specific skills, not judgement of ability'
		]
	},
	preparation: {
		label: 'Preparation-Focused',
		strategies: [
			"This student's attributions are healthy — focus on study quality (active recall, spaced repetition) not quantity",
			'Help them identify specific weak topics through diagnostic tests rather than broad revision',
			'Encourage them to create practice exams from their notes — active generation beats passive review'
		]
	},
	none: {
		label: 'No Dominant Barrier',
		strategies: [
			'No single exam barrier dominates — continue reinforcing balanced exam strategies',
			'Check in occasionally on pacing, anxiety levels, and preparation quality to catch emerging issues'
		]
	}
};

function buildExamSupport(lp) {
	const barrier = lp?.examBarriers?.primaryBarrier || 'none';
	const data = EXAM_STRATEGIES[barrier] || EXAM_STRATEGIES.none;
	const parts = [];
	if (lp?.examBarriers) {
		if (barrier !== 'none') parts.push(`Primary barrier: ${data.label}`);
		parts.push(`Anxiety: ${lp.examBarriers.anxiety}/5, Time mgmt: ${lp.examBarriers.timeManagement}/5`);
	}
	return { barrier: data.label, strategies: data.strategies, evidence: parts.join('. ') };
}

const SUBJECT_NOTES = {
	aligned: 'Strong engagement — challenge with extension work, enrichment opportunities, and deeper projects.',
	'passion-gap': "Capable but not engaged — find the hook that connects this subject to their interests. They can do the work; they need a reason to care.",
	'confidence-gap': "Interested but self-doubting — build confidence through incremental success and specific praise. They want to do well; they need to believe they can.",
	disengaged: "Neither interested nor confident — a priority area. Consider alternative formats, real-world connections, or temporary reduced expectations while rebuilding engagement."
};

function buildSubjectNotes(lp) {
	if (!lp?.subjectFit) return [];
	return Object.entries(lp.subjectFit).map(([subject, data]) => ({
		subject: subject.charAt(0).toUpperCase() + subject.slice(1),
		alignment: data.alignment,
		note: SUBJECT_NOTES[data.alignment] || SUBJECT_NOTES.aligned,
		passion: data.passion,
		confidence: data.confidence
	}));
}

function buildTeacherWarnings(lp, sp, rootCause) {
	const warnings = [];

	if (rootCause?.primaryPattern?.id === 'burnout-risk') {
		warnings.push({
			signal: 'Declining work quality despite continued long hours, physical complaints, withdrawal from peers',
			meaning: 'Energy depletion masking as reduced effort — they are trying but running on empty',
			action: 'Have a private conversation about workload. This student needs permission to rest, not pressure to perform.'
		});
	}
	if (rootCause?.primaryPattern?.id === 'capable-but-checked-out') {
		warnings.push({
			signal: "Minimum effort, copying, surface responses, 'I don't care' attitude",
			meaning: 'Disengagement masking frustration or loss of purpose — not laziness',
			action: 'One-on-one conversation: "I notice you can do this. What would make it worth your effort?"'
		});
	}
	if (sp?.selfRegulation?.testAnxiety?.score >= 4.0) {
		warnings.push({
			signal: 'Physical distress before assessments, performance far below classwork quality, avoidance',
			meaning: 'Clinical-level test anxiety — exam results significantly underrepresent ability',
			action: 'Refer for anxiety support. Consider formal accommodations. Supplement exams with alternative assessments.'
		});
	}
	if (lp?.energy?.netEnergy?.score < 2.0) {
		warnings.push({
			signal: 'Head on desk, difficulty concentrating, increased absences, disengagement from activities',
			meaning: 'Serious energy depletion affecting learning capacity',
			action: 'Check on wellbeing. Coordinate with parents about sleep, health, and workload. Consider reduced demands temporarily.'
		});
	}
	if (sp?.motivation?.amotivation?.score >= 3.5) {
		warnings.push({
			signal: 'Complete disengagement — not disruptive, just absent. Copying, minimal responses, avoidance of all effort',
			meaning: 'Has stopped believing effort leads to outcomes — this is closer to learned helplessness than defiance',
			action: 'Priority referral. Find one intrinsic connection point. Do NOT increase external pressure.'
		});
	}

	// Default for healthy profiles
	if (warnings.length === 0) {
		warnings.push({
			signal: 'Any sudden shift from their baseline behaviour — declining grades, social withdrawal, irritability, or loss of interest',
			meaning: 'Even high performers can struggle silently',
			action: 'Brief private check-in: "I noticed something seems different. Is everything okay?"'
		});
	}

	return warnings.slice(0, 4);
}

// --- Parent guide ---

function buildParentSummary(sp, lp, urgency) {
	const approach = sp?.dominantApproach || 'strategic';
	const motivation = sp?.motivationProfile || 'moderate';

	const approachDesc = { deep: 'seeks to understand deeply', strategic: 'is organised and goal-focused', surface: 'tends toward memorising rather than deep understanding' };
	const motivationDesc = { 'self-determined': 'driven by genuine interest', moderate: 'motivated by a mix of interest and external expectations', controlled: 'primarily driven by external pressures like grades and expectations' };

	let summary = `Your child ${approachDesc[approach] || 'has a developing study style'} and is ${motivationDesc[motivation] || 'developing their motivation'}.`;

	// Add key strength
	if (lp?.grit?.overall?.score >= 3.5) {
		summary += ` A notable strength is their persistence (grit: ${lp.grit.overall.score.toFixed(1)}/5) — they follow through when they commit.`;
	} else if (sp?.motivation?.intrinsic?.score >= 3.5) {
		summary += ` A notable strength is their genuine curiosity (intrinsic motivation: ${sp.motivation.intrinsic.score.toFixed(1)}/5) — they learn because they want to.`;
	} else if (sp?.selfRegulation?.selfEfficacy?.score >= 3.5) {
		summary += ` They believe in their own ability (self-efficacy: ${sp.selfRegulation.selfEfficacy.score.toFixed(1)}/5), which is a strong foundation to build on.`;
	} else if (lp?.energy?.vitality?.score >= 3.5) {
		summary += ` They have good energy and vitality (${lp.energy.vitality.score.toFixed(1)}/5) — the fuel is there, even if direction needs work.`;
	}

	// Add urgency-appropriate framing
	if (urgency === 'enrichment') {
		summary += ' Overall, they are thriving academically. Your role is enrichment, encouragement, and watching for signs of overwork.';
	} else if (urgency === 'support') {
		summary += ' They have genuine strengths alongside specific gaps. Targeted support in 1-2 areas will make a real difference.';
	} else if (urgency === 'intervention') {
		summary += ' The data points to a clear pattern that, once addressed, will help unlock their potential. Coordinated support between home and school is important.';
	} else {
		summary += ' Your child is struggling in ways that may not be fully visible. Action from both home and school is needed now.';
	}

	return summary;
}

const STRENGTH_CHECKS = [
	{ key: 'grit', get: (sp, lp) => lp?.grit?.overall?.score, threshold: 3.5, area: 'Persistence', detail: 'When they commit to something, they follow through — even when it gets hard' },
	{ key: 'deep', get: (sp) => sp?.studyApproaches?.deep?.score, threshold: 3.5, area: 'Deep understanding', detail: 'They naturally seek to understand, not just memorise' },
	{ key: 'efficacy', get: (sp) => sp?.selfRegulation?.selfEfficacy?.score, threshold: 3.5, area: 'Self-belief', detail: 'They believe they can succeed when they try' },
	{ key: 'intrinsic', get: (sp) => sp?.motivation?.intrinsic?.score, threshold: 3.5, area: 'Genuine curiosity', detail: 'They study because they find it interesting, not just for grades' },
	{ key: 'concentration', get: (sp, lp) => lp?.focus?.concentration?.score, threshold: 3.5, area: 'Focus', detail: 'They can sustain attention on their work for extended periods' },
	{ key: 'procrastination', get: (sp, lp) => lp?.focus?.procrastination?.score, threshold: 3.5, area: 'Self-starter', detail: 'They get started on tasks without needing to be pushed' },
	{ key: 'energy', get: (sp, lp) => lp?.energy?.netEnergy?.score, threshold: 3.5, area: 'Energy', detail: 'They generally feel alert and energised for learning' },
	{ key: 'planning', get: (sp) => sp?.selfRegulation?.planning?.score, threshold: 3.5, area: 'Organisation', detail: 'They plan their study time and manage deadlines effectively' },
	{ key: 'effort', get: (sp) => sp?.selfRegulation?.effortRegulation?.score, threshold: 3.5, area: 'Effort regulation', detail: 'They push through when work is difficult or boring' },
	{ key: 'strategic', get: (sp) => sp?.studyApproaches?.strategic?.score, threshold: 3.5, area: 'Strategic studying', detail: 'They are intentional about how they study — organised and goal-focused' },
	{ key: 'helpSeeking', get: (sp) => sp?.selfRegulation?.helpSeeking?.score, threshold: 3.5, area: 'Help-seeking', detail: 'They ask for help when they need it — a sign of confidence and maturity' }
];

function buildParentStrengths(sp, lp) {
	const strengths = [];
	for (const check of STRENGTH_CHECKS) {
		const val = check.get(sp, lp);
		if (val !== undefined && val >= check.threshold) {
			strengths.push({ area: check.area, detail: check.detail, score: `${val.toFixed(1)}/5` });
		}
	}
	// Ensure at least 2 — find highest scores if none hit threshold
	if (strengths.length < 2) {
		const all = STRENGTH_CHECKS
			.map(c => ({ ...c, val: c.get(sp, lp) }))
			.filter(c => c.val !== undefined && !strengths.some(s => s.area === c.area))
			.sort((a, b) => b.val - a.val);
		for (const c of all) {
			if (strengths.length >= 2) break;
			strengths.push({ area: c.area, detail: c.detail, score: `${c.val.toFixed(1)}/5` });
		}
	}
	return strengths.slice(0, 6);
}

const CONCERN_CHECKS = [
	{ get: (sp) => sp?.selfRegulation?.testAnxiety?.score, op: '>=', val: 4.0, severity: 'urgent', area: 'Severe test anxiety', detail: 'Exam results likely underrepresent their true ability significantly' },
	{ get: (sp) => sp?.selfRegulation?.testAnxiety?.score, op: '>=', val: 3.5, severity: 'act', area: 'Test anxiety', detail: 'Nervousness is affecting exam performance — practice and familiarity will help' },
	{ get: (sp, lp) => lp?.energy?.netEnergy?.score, op: '<', val: 2.0, severity: 'urgent', area: 'Very low energy', detail: 'They may be running on empty — check sleep, health, and overall demands' },
	{ get: (sp, lp) => lp?.energy?.netEnergy?.score, op: '<', val: 2.5, severity: 'act', area: 'Low energy', detail: 'They often feel drained, which limits how much they can absorb and retain' },
	{ get: (sp) => sp?.motivation?.amotivation?.score, op: '>=', val: 3.5, severity: 'urgent', area: 'Academic disengagement', detail: "They've disconnected from the purpose of learning — this needs attention" },
	{ get: (sp) => sp?.motivation?.amotivation?.score, op: '>=', val: 2.5, severity: 'act', area: 'Weakening motivation', detail: 'Signs of disconnection from learning are emerging' },
	{ get: (sp, lp) => lp?.grit?.overall?.score, op: '<', val: 2.5, severity: 'act', area: 'Low persistence', detail: 'They give up quickly when things get difficult — needs structured support to build follow-through' },
	{ get: (sp) => sp?.selfRegulation?.selfEfficacy?.score, op: '<', val: 2.5, severity: 'act', area: 'Low self-belief', detail: "They don't believe they can succeed — this undermines effort before they start" },
	{ get: (sp) => sp?.selfRegulation?.helpSeeking?.score, op: '<', val: 2.5, severity: 'watch', area: 'Reluctance to ask for help', detail: "They won't ask for help even when struggling — encourage it as a strength, not a weakness" },
	{ get: (sp) => sp?.selfRegulation?.planning?.score, op: '<', val: 2.5, severity: 'act', area: 'Weak planning', detail: 'They struggle to organise study time — external structure and visual planners help' },
	{ get: (sp, lp) => lp?.focus?.procrastination?.score, op: '<', val: 2.5, severity: 'act', area: 'Procrastination', detail: 'Starting tasks is a major barrier — the 2-minute rule and small first steps can help' }
];

function buildParentConcerns(sp, lp) {
	const concerns = [];
	const seen = new Set();
	for (const check of CONCERN_CHECKS) {
		const score = check.get(sp, lp);
		if (score === undefined) continue;
		const fires = check.op === '>=' ? score >= check.val : score < check.val;
		if (fires && !seen.has(check.area)) {
			seen.add(check.area);
			concerns.push({ area: check.area, detail: check.detail, score: `${score.toFixed(1)}/5`, severity: check.severity });
		}
	}
	// Check for disengaged subjects
	if (lp?.subjectFit) {
		const disengaged = Object.entries(lp.subjectFit).filter(([, s]) => s.alignment === 'disengaged');
		if (disengaged.length >= 2) {
			concerns.push({
				area: 'Subject disengagement',
				detail: `Disengaged from ${disengaged.length} subjects — neither interested nor confident. Explore alternative formats or connections to their interests.`,
				score: `${disengaged.length} subjects`,
				severity: 'act'
			});
		}
	}

	// Healthy profiles: add gentle watch item on weakest area
	if (concerns.length === 0) {
		let weakest = null;
		let weakestVal = 5;
		for (const check of STRENGTH_CHECKS) {
			const v = check.get(sp, lp);
			if (v !== undefined && v < weakestVal) {
				weakestVal = v;
				weakest = check;
			}
		}
		if (weakest) {
			concerns.push({
				area: weakest.area,
				detail: `This is their weakest area — even strong students benefit from support here.`,
				score: `${weakestVal.toFixed(1)}/5`,
				severity: 'watch'
			});
		}
	}

	return concerns.slice(0, 4);
}

function buildHomeStudy(sp, lp) {
	let environment, schedule;
	const tips = [];

	// Environment based on focus + concentration
	const lowConc = lp?.focus?.concentration?.score < 2.5;
	const lowProc = lp?.focus?.procrastination?.score < 2.5;
	const lowEnergy = lp?.energy?.netEnergy?.score < 2.5;

	if (lowConc || lowProc) {
		environment = 'Create a dedicated, phone-free study zone with minimal distractions. Consider sitting with them for the first few minutes of each session to help them start — getting going is the hardest part.';
	} else if (lowEnergy) {
		environment = "Protect their study environment from overstimulation. A quiet, comfortable space with good lighting matters more for them than for most students. Avoid study sessions after energy-draining activities.";
	} else {
		environment = 'They can largely manage their own study space. Ensure a consistent, comfortable area exists and trust their process — over-monitoring a capable student can backfire.';
	}

	// Schedule based on approach + energy
	if (sp?.dominantApproach === 'surface' && lowEnergy) {
		schedule = "Short, focused blocks (20-25 minutes max) with genuine breaks between them. Quality over quantity — one focused session beats three unfocused hours. Don't push evening study when they're already drained.";
	} else if (sp?.dominantApproach === 'strategic' || sp?.selfRegulation?.planning?.score >= 3.5) {
		schedule = "They likely manage their own schedule reasonably well. A weekly check-in is better than daily monitoring — ask what they're working on, not whether they've studied.";
	} else if (sp?.selfRegulation?.planning?.score < 2.5) {
		schedule = "They need externally imposed structure until they build their own. Set fixed study times visible in the household routine — consistency matters more than duration.";
	} else {
		schedule = "A regular routine helps but doesn't need to be rigid. Help them plan the week ahead on Sunday evening — even 5 minutes of planning prevents a week of scrambling.";
	}

	// Tips pool
	if (lowEnergy) tips.push('Protect sleep above all else — consistent bedtime and wake time, even on weekends');
	if (lowProc) tips.push("Use the '2-minute rule': commit to just 2 minutes of starting — momentum usually carries them further");
	if (lp?.grit?.overall?.score < 2.5) tips.push('Celebrate FINISHING things, not starting them — persistence is built through acknowledged follow-through');
	if (sp?.selfRegulation?.testAnxiety?.score >= 3.5) tips.push("Before exams, focus conversation on what they DO know, not what they don't — anchor to competence, not fear");
	if (sp?.motivation?.amotivation?.score >= 2.5) tips.push("Don't ask 'did you study?' — instead ask 'what did you find interesting today?' Reframe learning as discovery, not duty");
	if (sp?.dominantApproach === 'surface') tips.push("When they study, ask them to explain one thing they learned in their own words — this shifts from memorising to understanding");
	if (lp?.focus?.concentration?.score < 2.5) tips.push('Remove phone from study area entirely — even a visible phone reduces concentration by up to 20%');
	if (sp?.selfRegulation?.selfEfficacy?.score < 2.5) tips.push("After a setback, say 'that was hard' not 'you should have tried harder' — validate difficulty before discussing improvement");

	// Ensure at least 2 tips
	if (tips.length < 2) {
		tips.push('Regular, brief conversations about learning (not grades) build a healthy relationship with school');
		if (tips.length < 2) tips.push('Model your own learning at home — let them see you reading, problem-solving, or working through something difficult');
	}

	return { environment, schedule, tips: tips.slice(0, 4) };
}

function buildConversations(sp, lp, rootCause) {
	const convos = [];

	if (sp?.dominantApproach === 'surface') {
		convos.push({ opener: "What's one thing from school today that actually surprised you?", why: "Redirects from 'did you study' to genuine curiosity — the first step away from surface learning", category: 'Curiosity' });
	}
	if (sp?.motivation?.intrinsic?.score < 2.5) {
		convos.push({ opener: 'If you could learn anything in the world — no school rules — what would it be?', why: 'Surfaces latent interests that could bridge to school content', category: 'Purpose' });
	}
	if (sp?.selfRegulation?.testAnxiety?.score >= 3.5) {
		convos.push({ opener: "What's one topic you feel really solid on right now?", why: 'Anchors to competence rather than fear — helps them see they DO know things', category: 'Confidence' });
	}
	if (lp?.subjectFit) {
		const disengaged = Object.entries(lp.subjectFit).find(([, s]) => s.alignment === 'disengaged');
		if (disengaged) {
			convos.push({ opener: `What would make ${disengaged[0]} less boring? What's the worst part about it?`, why: 'Validates their experience while opening the door to solutions together', category: 'Subject' });
		}
	}
	if (sp?.selfRegulation?.helpSeeking?.score < 2.5) {
		convos.push({ opener: 'Who do you go to when you get stuck on something?', why: "Opens discussion about help-seeking without lecturing — discovers barriers to asking for help", category: 'Support' });
	}
	if (lp?.grit?.overall?.score >= 3.5) {
		convos.push({ opener: "What's something you almost gave up on but didn't?", why: 'Reinforces their persistence as a strength worth noticing and being proud of', category: 'Reflection' });
	}
	if (rootCause?.primaryPattern?.id === 'burnout-risk') {
		convos.push({ opener: "How are you actually feeling about school right now? Honestly.", why: 'Creates space for them to admit they are struggling before they crash', category: 'Wellbeing' });
	}

	// Enrichment / general fallbacks
	if (convos.length < 3) {
		convos.push({ opener: 'What did you learn this week that changed how you think about something?', why: 'Frames learning as intellectual growth, not task completion', category: 'Growth' });
	}
	if (convos.length < 3) {
		convos.push({ opener: "What's the hardest thing you're working on right now?", why: 'Treats them as a capable person facing challenges, not a child to monitor', category: 'Challenge' });
	}

	return convos.slice(0, 5);
}

function buildParentWarnings(lp, sp, rootCause) {
	const warnings = [];

	if (rootCause?.primaryPattern?.id === 'burnout-risk') {
		warnings.push({ signal: 'Studying more hours but grades staying flat, physical complaints (headaches, stomach aches), loss of interest in hobbies', action: 'The priority is rest, not more study. Talk to school about workload adjustments.' });
	}
	if (sp?.motivation?.amotivation?.score >= 2.5) {
		warnings.push({ signal: 'Hiding schoolwork, lying about assignments, increasing screen time to avoid study', action: "Don't punish — investigate. Ask: 'What would need to change for you to care about school?'" });
	}
	if (sp?.selfRegulation?.testAnxiety?.score >= 3.5) {
		warnings.push({ signal: 'Stomach aches before school, difficulty sleeping before tests, emotional outbursts during homework', action: 'Consider professional anxiety support — this goes beyond normal exam stress.' });
	}
	if (lp?.energy?.netEnergy?.score < 2.5) {
		warnings.push({ signal: 'Constant tiredness, inability to focus at home, withdrawal from friends and activities', action: 'Check sleep quality, screen habits, nutrition, and physical activity. If basics are covered, consult a doctor.' });
	}

	if (warnings.length === 0) {
		warnings.push({ signal: 'Any sudden change in their attitude toward school, study, or socialising', action: 'Ask direct, gentle questions. Something has shifted — early conversation prevents escalation.' });
	}

	return warnings.slice(0, 3);
}

function buildCelebrationSignals(sp, lp) {
	const signals = [];

	signals.push({ signal: 'Explaining a concept to a sibling, friend, or parent in their own words', meaning: 'Deep learning in action — they understand well enough to teach. Acknowledge this specifically.' });

	if (lp?.grit?.overall?.score < 3.0) {
		signals.push({ signal: 'Finishing something they found difficult without giving up', meaning: 'Persistence muscle is growing — celebrate the completion, not just the quality.' });
	}
	if (sp?.selfRegulation?.testAnxiety?.score >= 3.0) {
		signals.push({ signal: 'Talking about an upcoming test without visible distress', meaning: "Anxiety management is improving — don't add pressure in that moment." });
	}
	if (sp?.dominantApproach === 'surface') {
		signals.push({ signal: "Asking 'why' or 'how' instead of 'what's on the test'", meaning: 'A shift toward deeper learning — this is a breakthrough moment worth celebrating.' });
	}
	if (sp?.motivation?.amotivation?.score >= 2.5) {
		signals.push({ signal: 'Voluntarily talking about something they learned — even casually', meaning: 'Reconnection with learning is happening. Respond with genuine interest, not "see, school is important."' });
	}

	// General signals
	signals.push({ signal: 'Starting homework without being asked', meaning: 'Self-regulation in action — notice it aloud so they know you see the effort.' });
	if (signals.length < 3) {
		signals.push({ signal: 'Bouncing back after a disappointing result without shutting down', meaning: 'Resilience and grit — celebrate the recovery, not just the wins.' });
	}

	return signals.slice(0, 4);
}

// --- Shared section ---

function buildRootCauseSummary(rootCause) {
	if (!rootCause?.primaryPattern) return null;

	const p = rootCause.primaryPattern;
	const evidenceParts = p.evidence.slice(0, 3).map(e =>
		`${e.metric}: ${typeof e.value === 'number' ? e.value.toFixed(1) + '/5' : e.value}`
	);

	let summary = `The data suggests a pattern of ${p.title.toLowerCase()}. `;
	// Rewrite diagnosis for adult audience
	summary += p.diagnosis.replace(/\bYou\b/g, 'This student').replace(/\byou\b/g, 'they').replace(/\byour\b/g, 'their').replace(/You're/g, "They're").replace(/you're/g, "they're").replace(/You've/g, "They've").replace(/you've/g, "they've");
	summary += ` Key indicators: ${evidenceParts.join(', ')}.`;

	if (rootCause.secondaryPattern) {
		summary += ` A contributing factor is ${rootCause.secondaryPattern.title.toLowerCase()}.`;
	}

	return summary;
}

function buildTopThreeActions(teacher, parent, rootCause, urgency) {
	const actions = [];

	if (rootCause?.primaryPattern?.oneThing) {
		actions.push({
			action: rootCause.primaryPattern.oneThing.action,
			who: 'both',
			timeframe: 'This week',
			why: rootCause.primaryPattern.oneThing.why.replace(/\bYou\b/g, 'They').replace(/\byou\b/g, 'they').replace(/\byour\b/g, 'their').replace(/You're/g, "They're").replace(/you're/g, "they're")
		});
	}

	// Most severe parent concern
	const urgent = parent.concerns.find(c => c.severity === 'urgent') || parent.concerns.find(c => c.severity === 'act');
	if (urgent && actions.length < 3) {
		actions.push({
			action: `Address ${urgent.area.toLowerCase()} — ${urgent.detail.split('—')[0].trim().toLowerCase()}`,
			who: 'parent',
			timeframe: 'This month',
			why: urgent.detail
		});
	}

	// Highest-priority teacher tip
	const topTip = teacher.instructionTips.find(t => t.priority === 'high') || teacher.instructionTips[0];
	if (topTip && actions.length < 3) {
		actions.push({
			action: topTip.tip.split('.')[0],
			who: 'teacher',
			timeframe: 'This term',
			why: topTip.evidence
		});
	}

	// Fill remaining with defaults
	while (actions.length < 3) {
		if (actions.length === 0) {
			actions.push({ action: 'Maintain current approach — this student is doing well', who: 'both', timeframe: 'Ongoing', why: 'No significant concerns identified' });
		} else if (actions.length === 1) {
			actions.push({ action: 'Regular brief check-ins to catch emerging issues early', who: 'both', timeframe: 'Weekly', why: 'Prevention is easier than intervention' });
		} else {
			actions.push({ action: "Celebrate strengths and progress, not just results", who: 'parent', timeframe: 'Ongoing', why: 'Reinforcing what works builds confidence and motivation' });
		}
	}

	return actions.slice(0, 3);
}

const KEY_MESSAGES = {
	enrichment: 'This student is thriving academically. Your role is to enrich, encourage, and watch for signs of perfectionism or overwork.',
	support: 'This student has genuine strengths alongside specific gaps. Targeted support in 1-2 areas will unlock significant improvement.',
	intervention: 'This student needs focused support. The data points to a clear pattern that, once addressed, will release their potential.',
	urgent: 'This student is struggling in ways that may not be fully visible. Coordinated action between school and home is important now.'
};

// --- Main generator ---

/**
 * @param {object} results - Full results with studyProfile, learnerProfile
 * @returns {object|null}
 */
export function generateAcademicGuide(results) {
	const sp = results.studyProfile;
	const lp = results.learnerProfile;

	if (!sp && !lp) return null;

	const rootCause = generateRootCause(results);
	const urgency = classifyUrgency(sp, lp, rootCause);

	const teacher = {
		snapshot: buildTeacherSnapshot(sp, lp),
		instructionTips: buildInstructionTips(sp, lp),
		motivationLevers: buildMotivationLevers(sp),
		examSupport: buildExamSupport(lp),
		subjectNotes: buildSubjectNotes(lp),
		warningSignals: buildTeacherWarnings(lp, sp, rootCause)
	};

	const parent = {
		summary: buildParentSummary(sp, lp, urgency),
		strengths: buildParentStrengths(sp, lp),
		concerns: buildParentConcerns(sp, lp),
		homeStudy: buildHomeStudy(sp, lp),
		conversations: buildConversations(sp, lp, rootCause),
		warningSignals: buildParentWarnings(lp, sp, rootCause),
		celebrationSignals: buildCelebrationSignals(sp, lp)
	};

	const shared = {
		rootCauseSummary: buildRootCauseSummary(rootCause),
		topThreeActions: buildTopThreeActions(teacher, parent, rootCause, urgency),
		keyMessage: KEY_MESSAGES[urgency] || KEY_MESSAGES.support
	};

	return { urgency, teacher, parent, shared };
}
