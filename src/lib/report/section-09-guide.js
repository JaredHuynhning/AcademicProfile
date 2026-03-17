/**
 * Section 10: Guide for Teachers & Parents
 * Dual-audience tips, motivation strategies, warning signs
 */
import { isHigh, isLow, DIM_SHORT, rankDimensions } from './helpers.js';

export function generateGuide(results) {
	const dims = results.dimensions;
	const ranked = rankDimensions(dims);

	return {
		teacher: buildTeacherGuide(dims, ranked),
		parent: buildParentGuide(dims, ranked),
		sharedInsights: buildSharedInsights(dims)
	};
}

function buildTeacherGuide(dims, ranked) {
	return {
		quickProfile: buildTeacherQuickProfile(dims),
		motivationStrategies: buildTeacherMotivation(dims),
		feedbackStyle: buildFeedbackStyle(dims),
		classroomTips: buildClassroomTips(dims),
		warningSignals: buildTeacherWarnings(dims)
	};
}

function buildTeacherQuickProfile(dims) {
	const traits = [];
	if (isHigh(dims.C.score)) traits.push('Highly organised and self-motivated — comes prepared and meets deadlines');
	if (isLow(dims.C.score)) traits.push('Needs external structure — benefits from clear deadlines and check-ins');
	if (isHigh(dims.X.score)) traits.push('Socially confident — participates actively and enjoys group activities');
	if (isLow(dims.X.score)) traits.push('Reserved — may not speak up without direct invitation; do not mistake silence for disengagement');
	if (isHigh(dims.O.score)) traits.push('Intellectually curious — thrives with open-ended questions and creative tasks');
	if (isLow(dims.O.score)) traits.push('Prefers concrete instructions — provide clear guidelines and practical examples');
	if (isHigh(dims.E.score)) traits.push('Emotionally sensitive — responds well to encouragement, poorly to public criticism');
	if (isLow(dims.E.score)) traits.push('Emotionally steady — handles criticism well but may not show when struggling');
	if (isHigh(dims.A.score)) traits.push('Cooperative and easy to work with — may need encouragement to assert own ideas');
	if (isLow(dims.A.score)) traits.push('Direct and assertive — values honest feedback; frame challenges constructively');
	if (isHigh(dims.H.score)) traits.push('High integrity — trustworthy in group work and examinations');
	if (isLow(dims.H.score)) traits.push('Competitive — motivated by rewards and recognition; channel this positively');
	return traits;
}

function buildTeacherMotivation(dims) {
	const strategies = [];
	if (isHigh(dims.O.score)) {
		strategies.push({
			approach: 'Offer choice and autonomy',
			details: 'When possible, let them choose their project topic, format, or approach. Their engagement skyrockets with creative freedom.'
		});
	}
	if (isHigh(dims.C.score)) {
		strategies.push({
			approach: 'Set stretch goals',
			details: 'They respond to challenges that push them beyond the standard curriculum. Extension tasks and competitions are motivating.'
		});
	}
	if (isLow(dims.C.score)) {
		strategies.push({
			approach: 'Break tasks into milestones',
			details: 'Large assignments are overwhelming. Provide intermediate deadlines and celebrate progress at each checkpoint.'
		});
	}
	if (isHigh(dims.X.score)) {
		strategies.push({
			approach: 'Use collaborative learning',
			details: 'Group discussions, peer teaching, and team projects keep them engaged. They learn best when they can talk through ideas.'
		});
	}
	if (isLow(dims.X.score)) {
		strategies.push({
			approach: 'Provide written alternatives',
			details: 'Offer written submission options alongside oral presentations. Use think-pair-share to ease into group discussion.'
		});
	}
	if (isHigh(dims.E.score)) {
		strategies.push({
			approach: 'Build rapport first',
			details: 'Investment in the personal relationship pays dividends. Regular brief check-ins show you care about them, not just their grades.'
		});
	}
	if (strategies.length < 3) {
		strategies.push({
			approach: 'Connect to relevance',
			details: 'Explain why the material matters in real life. "You will use this when..." is more motivating than "This will be on the test."'
		});
	}
	return strategies.slice(0, 4);
}

function buildFeedbackStyle(dims) {
	if (isHigh(dims.E.score) && isLow(dims.X.score)) {
		return {
			preferred: 'Private, gentle, specific',
			description: 'Give feedback one-on-one, not publicly. Start with what is going well. Be specific about what to improve and how.',
			avoid: 'Public correction, vague criticism ("try harder"), comparing to other students'
		};
	}
	if (isLow(dims.E.score) && isHigh(dims.X.score)) {
		return {
			preferred: 'Direct, specific, challenge-oriented',
			description: 'Be straightforward — they prefer honesty to sugar-coating. Frame improvements as challenges to rise to.',
			avoid: 'Over-cushioning feedback, being vague, withholding constructive criticism'
		};
	}
	if (isHigh(dims.E.score)) {
		return {
			preferred: 'Encouraging, specific, private',
			description: 'Lead with positive observations, then gently introduce areas for growth. They take criticism to heart, so precision matters.',
			avoid: 'Harsh or abrupt feedback, public correction, global criticism ("this whole essay needs work")'
		};
	}
	if (isLow(dims.E.score)) {
		return {
			preferred: 'Direct and actionable',
			description: 'Get to the point — they prefer efficiency over emotional cushioning. Focus on specific, actionable improvements.',
			avoid: 'Over-praising, excessive emotional framing, being indirect about problems'
		};
	}
	return {
		preferred: 'Balanced and specific',
		description: 'A mix of recognition and constructive feedback works well. Be specific about both strengths and areas for improvement.',
		avoid: 'Exclusively positive or exclusively critical feedback — balance is key'
	};
}

function buildClassroomTips(dims) {
	const tips = [];
	if (isHigh(dims.X.score) && isLow(dims.C.score)) {
		tips.push('Seat near focused students — social energy can become distraction without anchoring influence');
	}
	if (isLow(dims.X.score)) {
		tips.push('Do not cold-call in class — use think-pair-share or warning before questions to reduce anxiety');
	}
	if (isHigh(dims.O.score)) {
		tips.push('Provide extension questions that allow deeper exploration beyond the standard curriculum');
	}
	if (isLow(dims.C.score)) {
		tips.push('Check in on long-term project progress at regular intervals — do not assume they are on track');
	}
	if (isHigh(dims.E.score)) {
		tips.push('Create a safe environment for mistakes — normalise errors as part of learning');
	}
	if (isHigh(dims.H.score)) {
		tips.push('Acknowledge their integrity publicly — it reinforces positive behaviour');
	}
	if (tips.length < 3) {
		tips.push('Vary activity types within each lesson to maintain engagement across different personalities');
	}
	return tips.slice(0, 5);
}

function buildTeacherWarnings(dims) {
	const warnings = [];
	if (isHigh(dims.E.score)) {
		warnings.push({
			signal: 'Withdrawal or unusual quietness',
			meaning: 'May be experiencing anxiety or emotional distress — check in privately',
			action: 'A brief, private "How are you going?" can make a significant difference'
		});
	}
	if (isLow(dims.E.score) && isLow(dims.X.score)) {
		warnings.push({
			signal: 'Consistent under-performance without visible distress',
			meaning: 'They may be struggling but not showing it — their composure can mask problems',
			action: 'Review work quality trends and ask direct questions about understanding'
		});
	}
	if (isHigh(dims.C.score)) {
		warnings.push({
			signal: 'Increased irritability or obsessive revision',
			meaning: 'Perfectionism under pressure can become anxiety — they may be overwhelmed',
			action: 'Help them prioritise and give explicit permission to submit "good enough" work'
		});
	}
	if (isLow(dims.C.score)) {
		warnings.push({
			signal: 'Missing deadlines or incomplete work',
			meaning: 'Not necessarily laziness — may be overwhelmed by the scope of tasks',
			action: 'Break work into smaller, immediately actionable steps with clear deadlines'
		});
	}
	if (isHigh(dims.X.score)) {
		warnings.push({
			signal: 'Excessive socialising and distraction in class',
			meaning: 'May indicate disengagement from the material or insufficient challenge',
			action: 'Redirect energy with leadership roles or peer teaching opportunities'
		});
	}
	if (warnings.length < 2) {
		warnings.push({
			signal: 'Sudden change in behaviour or work quality',
			meaning: 'Any significant shift from baseline may indicate personal difficulties',
			action: 'Have a private, non-judgemental conversation about what might be going on'
		});
	}
	return warnings.slice(0, 4);
}

function buildParentGuide(dims, ranked) {
	return {
		understandingProfile: buildParentProfile(dims, ranked),
		homeEnvironment: buildHomeEnvironment(dims),
		conversationStarters: buildConversationStarters(dims),
		supportStrategies: buildParentSupport(dims),
		warningSignals: buildParentWarnings(dims)
	};
}

function buildParentProfile(dims, ranked) {
	const strongest = ranked[0];
	const growth = ranked[ranked.length - 1];
	return `Your child's personality profile shows their greatest strength in ${strongest.name}, which means ${getParentExplanation(strongest.key, 'high')}. Their biggest growth opportunity is in ${growth.name}, which means ${getParentExplanation(growth.key, 'low')}. Understanding these tendencies helps you support them more effectively.`;
}

function getParentExplanation(key, level) {
	const explanations = {
		H: { high: 'they have a strong moral compass and value fairness', low: 'they are competitive and motivated by achievement — help them channel this positively' },
		E: { high: 'they feel things deeply and need emotional support during stressful periods', low: 'they handle stress quietly — check in regularly because they may not ask for help' },
		X: { high: 'they are sociable and energised by people — they need social interaction', low: 'they prefer quiet time and may need help building social confidence gradually' },
		A: { high: 'they are cooperative and easy-going — encourage them to also express their own needs', low: 'they are assertive and direct — help them develop diplomatic communication skills' },
		C: { high: 'they are naturally organised and disciplined — watch for perfectionism under pressure', low: 'they need help with structure and organisation — external routines are important' },
		O: { high: 'they are creative and curious — provide outlets for exploration', low: 'they prefer practical, concrete activities — connect learning to real-world applications' }
	};
	return explanations[key]?.[level] || 'this is an important part of who they are';
}

function buildHomeEnvironment(dims) {
	const tips = [];
	if (isHigh(dims.C.score)) {
		tips.push({ area: 'Study Space', tip: 'Provide an organised, dedicated study area — they thrive with a consistent workspace' });
	} else {
		tips.push({ area: 'Study Space', tip: 'Help set up an organised study area and gently encourage its use — external structure compensates for internal flexibility' });
	}
	if (isHigh(dims.X.score)) {
		tips.push({ area: 'Social Learning', tip: 'Allow study sessions with friends — they genuinely learn better in social settings. Just ensure there is a balance between socialising and studying' });
	} else {
		tips.push({ area: 'Quiet Time', tip: 'Respect their need for quiet, solo study time. Do not push them to study with friends if they prefer working alone' });
	}
	if (isHigh(dims.E.score)) {
		tips.push({ area: 'Emotional Support', tip: 'Be available to talk before exams and during stressful periods. Your calm presence helps them manage anxiety' });
	}
	if (isHigh(dims.O.score)) {
		tips.push({ area: 'Exploration', tip: 'Keep books, documentaries, and creative materials accessible. Encourage questions and do not shut down unusual interests' });
	}
	tips.push({ area: 'Routine', tip: isHigh(dims.C.score)
		? 'Support their natural routine — do not disrupt their study schedule unnecessarily'
		: 'Help establish a consistent daily routine — dinner time, homework time, bed time — without being rigid' });
	return tips.slice(0, 4);
}

function buildConversationStarters(dims) {
	const starters = [
		{ text: 'What was the most interesting thing you learned this week?', type: 'Generic' }
	];
	if (isHigh(dims.O.score)) {
		starters.push({ text: 'Did anything surprise you or challenge how you think about [subject]?', type: 'Curiosity' });
	}
	if (isHigh(dims.X.score)) {
		starters.push({ text: 'Who did you work with today? How did it go?', type: 'Social' });
	}
	if (isHigh(dims.E.score)) {
		starters.push({ text: 'How are you feeling about [upcoming test/project]? What would help?', type: 'Emotional' });
	}
	if (isHigh(dims.C.score)) {
		starters.push({ text: 'What goals are you working toward this term? How is your progress?', type: 'Achievement' });
	}
	if (isLow(dims.C.score)) {
		starters.push({ text: 'What is due this week? Would it help to make a quick plan together?', type: 'Planning' });
	}
	if (isHigh(dims.H.score)) {
		starters.push({ text: 'Was there a situation today where you had to make a difficult choice?', type: 'Values' });
	}
	starters.push({ text: 'If you could change one thing about school, what would it be?', type: 'Reflection' });
	return starters.slice(0, 5);
}

function buildParentSupport(dims) {
	const strategies = [];
	strategies.push({
		area: 'Academic Support',
		dos: isHigh(dims.C.score)
			? ['Trust their study plan', 'Provide resources they request', 'Celebrate milestones']
			: ['Help create a study schedule together', 'Set regular "homework check-in" times', 'Break big assignments into daily chunks'],
		donts: isHigh(dims.C.score)
			? ['Micromanage their schedule', 'Add pressure to an already self-driven student']
			: ['Nag about homework — it creates resistance', 'Do the work for them — guide process instead']
	});
	strategies.push({
		area: 'Emotional Support',
		dos: isHigh(dims.E.score)
			? ['Validate their feelings before problem-solving', 'Be a calm anchor during stressful periods', 'Talk through worries together']
			: ['Check in regularly even if they seem fine', 'Create opportunities for them to open up', 'Respect their processing style'],
		donts: isHigh(dims.E.score)
			? ['Dismiss emotions ("just relax")', 'Compare them to calmer siblings or friends']
			: ['Push them to express emotions they are not feeling', 'Assume no distress means no problems']
	});
	strategies.push({
		area: 'Social Development',
		dos: isHigh(dims.X.score)
			? ['Encourage social study sessions', 'Support extracurricular social activities', 'Help them balance social time with focus time']
			: ['Provide low-pressure social opportunities', 'Do not force large group activities', 'Celebrate small social wins'],
		donts: isHigh(dims.X.score)
			? ['Isolate them as punishment — it is particularly painful for social learners']
			: ['Compare them to more social siblings or peers', 'Force them into social situations that cause anxiety']
	});
	return strategies;
}

function buildParentWarnings(dims) {
	const warnings = [];
	if (isHigh(dims.E.score)) {
		warnings.push({
			signal: 'Increased tearfulness, sleep problems, or avoidance of school',
			action: 'Talk to them gently, and consider contacting the school counsellor'
		});
	}
	if (isLow(dims.E.score)) {
		warnings.push({
			signal: 'Withdrawal from activities they usually enjoy',
			action: 'They may not show distress visibly — ask direct but gentle questions'
		});
	}
	if (isHigh(dims.C.score)) {
		warnings.push({
			signal: 'Obsessive studying, inability to relax, or physical symptoms (headaches, stomach aches)',
			action: 'Perfectionism may be tipping into anxiety — help them set realistic standards'
		});
	}
	if (isLow(dims.C.score)) {
		warnings.push({
			signal: 'Complete disengagement from schoolwork or hiding assignments',
			action: 'This may signal overwhelm rather than laziness — help break tasks into manageable pieces'
		});
	}
	warnings.push({
		signal: 'Sudden change in behaviour, friendships, or academic performance',
		action: 'Any significant shift from their baseline warrants a conversation and potentially professional support'
	});
	return warnings.slice(0, 4);
}

function buildSharedInsights(dims) {
	return {
		keyMessage: 'This student\'s personality is a unique combination of traits, not a label. The goal is to understand their natural tendencies so we can create conditions where they thrive.',
		alignmentTip: 'Teachers and parents working together is the most powerful support system. Share observations about what works and what does not — consistency between school and home accelerates growth.',
		reminderNote: 'Personality traits are tendencies that can be developed, not fixed limits. With the right support and encouragement, every student can grow in any area.'
	};
}
