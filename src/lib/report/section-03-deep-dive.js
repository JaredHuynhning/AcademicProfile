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
				facets: Object.entries(dim.facets).map(([fKey, facet]) => ({
					key: fKey,
					name: facet.name,
					score: formatScore(facet.score),
					rawScore: facet.score,
					percent: scorePercent(facet.score),
					level: classifyLevel(facet.score)
				})),
				learningCallout: getLearningCallout(key, dim.score, dim.facets)
			};
		})
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
