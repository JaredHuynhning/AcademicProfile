/**
 * Section 3-4: Deep Dive into Six Dimensions
 */
import { DIM_ORDER, DIM_COLORS, DIM_SHORT, DIM_ICONS, formatScore, scorePercent, classifyLevel } from './helpers.js';

export function generateDeepDive(results) {
	return {
		dimensions: DIM_ORDER.map((key) => {
			const dim = results.dimensions[key];
			const insight = results.narrative.dimension_insights[key]?.insight || '';
			return {
				key,
				name: dim.name,
				shortName: DIM_SHORT[key],
				icon: DIM_ICONS[key],
				score: formatScore(dim.score),
				rawScore: dim.score,
				percent: scorePercent(dim.score),
				level: dim.level,
				color: DIM_COLORS[key],
				insight,
				facetInsights: getFacetInsights(key, dim.facets),
				learningCallout: getLearningCallout(key, dim.score, dim.facets)
			};
		})
	};
}

/**
 * Generate plain-language insight for each facet, explaining what the score means
 * for this student in practical terms.
 */
function getFacetInsights(dimKey, facets) {
	const generators = {
		H: (f) => [
			facetInsight(f.sincerity, 'Sincerity',
				'You say what you mean and avoid flattery or manipulation. People trust your word.',
				'You are diplomatically honest — you tell the truth but also know when tact is important.',
				'You are socially strategic — you may use charm or flattery to get what you want. This can be effective, but be careful that it does not undermine trust.'
			),
			facetInsight(f.fairness, 'Fairness',
				'You have a strong moral compass. Cheating, bending rules, or taking advantage of others feels deeply wrong to you.',
				'You are generally fair but pragmatic — you play by the rules when they make sense and question them when they don\'t.',
				'You are willing to bend rules or exploit situations when it benefits you. This competitive edge can be useful, but be mindful of how others perceive it.'
			),
			facetInsight(f.greed_avoidance, 'Greed Avoidance',
				'Material rewards and status don\'t drive you. You are motivated by purpose and meaning rather than prizes.',
				'You have a healthy relationship with rewards — motivated by them but not consumed by them.',
				'You are drawn to rewards, recognition, and status. Use this as fuel for achievement, but don\'t let it override your values.'
			),
			facetInsight(f.modesty, 'Modesty',
				'You don\'t seek attention or claim to be special. You let your work speak for itself.',
				'You are confident without being showy — you know your strengths but don\'t need to advertise them.',
				'You believe you are special and want others to know it. This confidence can be motivating, but true leadership also requires humility.'
			)
		],
		E: (f) => [
			facetInsight(f.fearfulness, 'Fearfulness',
				'You tend to avoid situations that feel risky or physically dangerous. New or unpredictable environments can feel stressful.',
				'You have a healthy level of caution — aware of risks but not paralysed by them.',
				'You are brave and unbothered by risk. This is great for trying new things, but make sure you are not ignoring genuine dangers.'
			),
			facetInsight(f.anxiety, 'Anxiety',
				'You worry more than most, especially about things going wrong. Exam periods and deadlines can feel overwhelming. Building a calming toolkit (breathing, planning, self-talk) will help enormously.',
				'You experience normal levels of worry. You can feel pre-exam nerves but they don\'t control you.',
				'You rarely worry. This keeps you calm under pressure, but make sure you are not being complacent about preparation.'
			),
			facetInsight(f.dependence, 'Dependence',
				'You value emotional connection and support from others. You feel safest when you know people have your back.',
				'You are comfortable both giving and receiving support, without being overly dependent.',
				'You are emotionally self-sufficient. You rarely lean on others for support — a strength in independence, but don\'t be afraid to ask for help.'
			),
			facetInsight(f.sentimentality, 'Sentimentality',
				'You form deep emotional bonds and are empathetic to others\' feelings. You may be the person friends come to for support.',
				'You balance empathy with emotional steadiness. You care about others without being overwhelmed.',
				'You are emotionally detached and pragmatic. This helps you stay objective, but practice connecting with others\' feelings — it builds stronger relationships.'
			)
		],
		X: (f) => [
			facetInsight(f.social_self_esteem, 'Social Self-Esteem',
				'You feel confident and valued in social situations. You believe you are likeable and worthy of respect.',
				'You have reasonable social confidence — comfortable in most situations but occasionally self-conscious.',
				'You doubt your social worth. This is not a reflection of reality — others likely see more value in you than you see in yourself. Building small social wins helps.'
			),
			facetInsight(f.social_boldness, 'Social Boldness',
				'You are comfortable being the centre of attention. You volunteer answers, lead discussions, and don\'t mind being watched.',
				'You can speak up when needed but don\'t crave the spotlight. You adapt to the social demands of the situation.',
				'You find it hard to speak up in groups. Start with low-stakes contributions — one comment per class — and build from there. Your ideas are worth hearing.'
			),
			facetInsight(f.sociability, 'Sociability',
				'You love being around people and draw energy from social interaction. Solo study may feel isolating — build in regular social study time.',
				'You enjoy social time but also value alone time. This balance is healthy and flexible.',
				'You prefer solitude or small groups. Honour this preference by studying alone when you need focus, but don\'t completely isolate — some collaboration strengthens learning.'
			),
			facetInsight(f.liveliness, 'Liveliness',
				'You are naturally upbeat and enthusiastic. Your energy lifts group morale and makes learning feel fun.',
				'You have a steady, balanced energy. Not the loudest in the room, but reliably engaged.',
				'You are more reserved and low-key. This quiet intensity can be a deep-thinking strength — you process carefully before responding.'
			)
		],
		A: (f) => [
			facetInsight(f.forgiveness, 'Forgiveness',
				'You let things go quickly and don\'t hold grudges. This keeps relationships smooth and prevents group conflict from festering.',
				'You can forgive but don\'t forget. You give second chances but track patterns.',
				'You hold grudges and find it hard to let go of perceived wrongs. This can create lasting tension in groups — practice separating the person from the problem.'
			),
			facetInsight(f.gentleness, 'Gentleness',
				'You are kind and considerate in how you communicate. You soften feedback and avoid being harsh, even when someone is wrong.',
				'You balance kindness with directness. You can give honest feedback without being cruel.',
				'You are blunt and direct. While your honesty is valuable, consider how your delivery lands — a gentle correction teaches better than a harsh one.'
			),
			facetInsight(f.flexibility, 'Flexibility',
				'You are willing to compromise and adapt to others\' needs. This makes you easy to work with but be careful not to sacrifice your own ideas too readily.',
				'You compromise when it makes sense and stand your ground when it matters.',
				'You are stubborn and hold firmly to your positions. This conviction can drive quality, but collaboration requires some give and take.'
			),
			facetInsight(f.patience, 'Patience',
				'You stay calm even when things are frustrating. You can wait out difficulties without losing your temper, which is a rare and valuable trait.',
				'You have normal patience — you can wait when needed but get frustrated by prolonged obstacles.',
				'You have a short fuse. You get irritated quickly when things don\'t go your way. Developing patience strategies (counting, stepping away, reframing) will improve both your work and your relationships.'
			)
		],
		C: (f) => [
			facetInsight(f.organization, 'Organisation',
				'You keep things tidy, plan ahead, and have systems for tracking your work. Your notes and files are probably well-structured.',
				'You are organised enough to function well but don\'t stress about perfect systems.',
				'Organisation is a challenge. Materials get lost, plans are vague, and spaces are messy. Start with one small system — a single folder for current work — and build from there.'
			),
			facetInsight(f.diligence, 'Diligence',
				'You work hard and consistently. You are the person who finishes what they start, even when it gets boring.',
				'You can push through most tasks but may drift on things that don\'t interest you.',
				'You find it hard to sustain effort, especially on tasks that feel pointless. External structure (timers, accountability partners, breaking work into tiny chunks) compensates for this.'
			),
			facetInsight(f.perfectionism, 'Perfectionism',
				'You set very high standards and check your work carefully. This produces quality output but can also slow you down — learn when "good enough" truly is good enough.',
				'You aim for quality without obsessing over perfection. A healthy balance.',
				'You don\'t sweat the details. This speed is useful for getting things done, but review important work one extra time before submitting.'
			),
			facetInsight(f.prudence, 'Prudence',
				'You think before you act and consider consequences. You rarely make impulsive decisions, which protects you from avoidable mistakes.',
				'You balance thoughtfulness with reasonable spontaneity.',
				'You act on impulse. This spontaneity can be exciting and creative, but important decisions (exam strategy, project planning) benefit from a pause-and-think approach.'
			)
		],
		O: (f) => [
			facetInsight(f.aesthetic_appreciation, 'Aesthetic Appreciation',
				'You notice beauty in art, nature, and design. Visual and creative learning methods (mind maps, colour coding, graphic organisers) will resonate with you.',
				'You appreciate aesthetics when prompted but don\'t seek them out. Visual study aids can still be helpful.',
				'You are practical rather than aesthetic. Straightforward, no-frills study materials work best for you — don\'t bother with decorating notes unless it actually helps recall.'
			),
			facetInsight(f.inquisitiveness, 'Inquisitiveness',
				'You love learning for its own sake. You read beyond the syllabus, ask "why?" constantly, and get excited by new ideas. This is your academic superpower.',
				'You are curious about things that interest you but don\'t seek out knowledge for fun across all areas.',
				'You are not naturally curious about academic topics. Learning feels like a means to an end. Finding personal relevance in each topic ("why does this matter to ME?") can help.'
			),
			facetInsight(f.creativity, 'Creativity',
				'You think in original, unconventional ways. You generate ideas that others miss and see connections between unrelated concepts. Open-ended projects showcase your talent.',
				'You can be creative when the situation calls for it but also work well within established frameworks.',
				'You prefer proven methods and established approaches. This reliability is valuable — not every task needs innovation. You excel at execution and implementation.'
			),
			facetInsight(f.unconventionality, 'Unconventionality',
				'You question norms and enjoy exploring unusual ideas. You are comfortable with ambiguity and may challenge conventional thinking in productive ways.',
				'You balance conventional and unconventional thinking. You know when to follow the rules and when to question them.',
				'You prefer traditional, well-established approaches. You find comfort in proven methods and clear expectations. This is a strength in structured subjects.'
			)
		]
	};
	return generators[dimKey]?.(facets) || [];
}

function facetInsight(facet, name, highText, modText, lowText) {
	if (!facet) return null;
	const score = facet.score;
	const level = classifyLevel(score);
	return {
		name,
		level,
		text: score >= 3.5 ? highText : score < 2.5 ? lowText : modText
	};
}

function getLearningCallout(dimKey, score, facets) {
	const callouts = {
		H: () => {
			if (score >= 3.5) return {
				title: 'In the Classroom',
				text: 'You are a trustworthy study partner and group member. Teachers can rely on you to work honestly and share credit fairly. You set a positive ethical tone in group projects.',
				icon: '🏫'
			};
			if (score < 2.5) return {
				title: 'In the Classroom',
				text: 'You are competitive and motivated by achievement. Channel this drive productively by setting personal goals that benefit both you and your team. Be mindful that group work requires trust.',
				icon: '🏫'
			};
			return {
				title: 'In the Classroom',
				text: 'You balance fairness with pragmatism. You contribute honestly to group work while also being practical about what it takes to succeed. This balance serves you well in most academic settings.',
				icon: '🏫'
			};
		},
		E: () => {
			const anxiety = facets.anxiety?.score || 0;
			if (score >= 3.5) return {
				title: 'Exam & Stress Impact',
				text: `Your emotional sensitivity means you may feel exam pressure more intensely.${anxiety >= 3.5 ? ' Your higher anxiety score suggests pre-exam preparation routines and calming techniques would be especially valuable.' : ''} Build a toolkit of calming strategies: deep breathing, progressive relaxation, and positive self-talk.`,
				icon: '📝'
			};
			if (score < 2.5) return {
				title: 'Exam & Stress Impact',
				text: 'You handle exam pressure well. Your emotional steadiness is an advantage during high-stakes assessments. Be aware that this composure may mean you do not seek help when you should — check in with yourself about how preparation is going.',
				icon: '📝'
			};
			return {
				title: 'Exam & Stress Impact',
				text: 'You have a balanced response to pressure. You feel some healthy anxiety that motivates preparation without being overwhelming. This is actually an ideal zone for academic performance.',
				icon: '📝'
			};
		},
		X: () => {
			const boldness = facets.social_boldness?.score || 0;
			if (score >= 3.5) return {
				title: 'Participation Style',
				text: `You naturally participate in class discussions and group activities.${boldness >= 3.5 ? ' Your social boldness means you are comfortable speaking up, even in large groups.' : ''} Use this strength to help facilitate study groups and peer learning.`,
				icon: '🗣️'
			};
			if (score < 2.5) return {
				title: 'Participation Style',
				text: `You prefer listening over speaking in class.${boldness < 2.5 ? ' Contributing in smaller groups or through written channels may feel more comfortable.' : ''} Remember that your thoughtful contributions are valuable — prepare one question or comment for each class to build confidence gradually.`,
				icon: '🗣️'
			};
			return {
				title: 'Participation Style',
				text: 'You can participate comfortably in both group discussions and independent work. You adjust your level of social engagement based on the situation, which is a flexible strength.',
				icon: '🗣️'
			};
		},
		A: () => {
			if (score >= 3.5) return {
				title: 'Group Dynamics',
				text: 'You are easy to work with and help create positive group environments. Your patience and flexibility make you a valued team member. Practice asserting your own ideas more — your agreeableness should not mean your voice gets lost.',
				icon: '👥'
			};
			if (score < 2.5) return {
				title: 'Group Dynamics',
				text: 'You are direct and assertive in groups, which can drive quality and innovation. Be mindful that others may perceive directness as harshness. Practise framing feedback constructively while keeping your valuable critical thinking.',
				icon: '👥'
			};
			return {
				title: 'Group Dynamics',
				text: 'You balance cooperation with assertiveness well. You can be a team player when needed and push back when you have a better idea. This makes you effective in varied group compositions.',
				icon: '👥'
			};
		},
		C: () => {
			const org = facets.organization?.score || 0;
			const diligence = facets.diligence?.score || 0;
			if (score >= 3.5) return {
				title: 'Study Habits',
				text: `Your strong conscientiousness is your academic superpower.${org >= 4.0 ? ' Your exceptional organisation means you likely keep detailed notes and never miss a deadline.' : ''}${diligence >= 4.0 ? ' Your diligence ensures consistent, high-quality output.' : ''} Watch for perfectionism — sometimes "done" is better than "perfect".`,
				icon: '📚'
			};
			if (score < 2.5) return {
				title: 'Study Habits',
				text: `Structure is your biggest growth area.${org < 2.5 ? ' Starting with a simple planner or app to track assignments would make a significant difference.' : ''} External accountability — study partners, tutors, regular check-ins — can compensate for lower natural discipline. Small, consistent habits build over time.`,
				icon: '📚'
			};
			return {
				title: 'Study Habits',
				text: 'You have reasonable study habits that can be strengthened. You plan when needed but also adapt on the fly. Building slightly more structure into your routine would boost your consistency without feeling restrictive.',
				icon: '📚'
			};
		},
		O: () => {
			const creativity = facets.creativity?.score || 0;
			const inquisitiveness = facets.inquisitiveness?.score || 0;
			if (score >= 3.5) return {
				title: 'Learning Approach',
				text: `You are a naturally curious learner.${creativity >= 3.5 ? ' Your creativity means you excel with open-ended assignments and projects.' : ''}${inquisitiveness >= 3.5 ? ' Your inquisitiveness drives you to go beyond the syllabus.' : ''} Use this curiosity strategically — explore deeply in your strongest subjects while ensuring you cover the basics in all areas.`,
				icon: '💡'
			};
			if (score < 2.5) return {
				title: 'Learning Approach',
				text: 'You prefer practical, straightforward learning with clear instructions. Abstract theory may feel disconnected — look for real-world applications to make it stick. Your practical focus is actually a strength in applied subjects and vocational learning.',
				icon: '💡'
			};
			return {
				title: 'Learning Approach',
				text: 'You are open to new ideas within practical boundaries. You balance curiosity with a grounded, pragmatic approach. This makes you effective across a wide range of subjects and learning tasks.',
				icon: '💡'
			};
		}
	};
	return callouts[dimKey]?.() || { title: '', text: '', icon: '' };
}
