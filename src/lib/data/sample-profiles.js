export const sampleProfiles = [
	{
		id: 'sample-alex-chen',
		name: 'Alex Chen',
		date: '2025-11-15T10:30:00.000Z',
		results: {
			dimensions: {
				H: {
					name: 'Honesty-Humility',
					score: 4.0,
					level: 'high',
					facets: {
						sincerity: { name: 'Sincerity', score: 3.8 },
						fairness: { name: 'Fairness', score: 4.5 },
						greed_avoidance: { name: 'Greed Avoidance', score: 3.7 },
						modesty: { name: 'Modesty', score: 4.0 }
					}
				},
				E: {
					name: 'Emotionality',
					score: 2.8,
					level: 'moderate',
					facets: {
						fearfulness: { name: 'Fearfulness', score: 2.5 },
						anxiety: { name: 'Anxiety', score: 3.2 },
						dependence: { name: 'Dependence', score: 2.8 },
						sentimentality: { name: 'Sentimentality', score: 2.7 }
					}
				},
				X: {
					name: 'Extraversion',
					score: 3.0,
					level: 'moderate',
					facets: {
						social_self_esteem: { name: 'Social Self-Esteem', score: 3.4 },
						social_boldness: { name: 'Social Boldness', score: 2.5 },
						sociability: { name: 'Sociability', score: 2.8 },
						liveliness: { name: 'Liveliness', score: 3.3 }
					}
				},
				A: {
					name: 'Agreeableness',
					score: 3.5,
					level: 'moderate',
					facets: {
						forgiveness: { name: 'Forgiveness', score: 3.3 },
						gentleness: { name: 'Gentleness', score: 3.8 },
						flexibility: { name: 'Flexibility', score: 3.2 },
						patience: { name: 'Patience', score: 3.7 }
					}
				},
				C: {
					name: 'Conscientiousness',
					score: 4.5,
					level: 'very_high',
					facets: {
						organization: { name: 'Organization', score: 4.8 },
						diligence: { name: 'Diligence', score: 4.6 },
						perfectionism: { name: 'Perfectionism', score: 4.3 },
						prudence: { name: 'Prudence', score: 4.3 }
					}
				},
				O: {
					name: 'Openness to Experience',
					score: 3.2,
					level: 'moderate',
					facets: {
						aesthetic_appreciation: { name: 'Aesthetic Appreciation', score: 2.8 },
						inquisitiveness: { name: 'Inquisitiveness', score: 3.5 },
						creativity: { name: 'Creativity', score: 3.0 },
						unconventionality: { name: 'Unconventionality', score: 3.5 }
					}
				}
			},
			narrative: {
				summary:
					'Alex is a highly conscientious and principled learner who thrives with structured study plans. Their strong organisation and diligence make them dependable in group settings, while their moderate extraversion suggests they work well both independently and in small teams.',
				dimension_insights: {
					H: {
						insight:
							'Alex values fairness and integrity in academic settings. They are likely to follow rules, contribute honestly to group projects, and avoid taking shortcuts. This makes them a trustworthy study partner and team member.'
					},
					E: {
						insight:
							'With moderate emotionality, Alex keeps a level head under pressure. They may not always express stress openly, which means tutors should check in periodically. They handle exam pressure reasonably well but benefit from structured preparation.'
					},
					X: {
						insight:
							'Alex is neither strongly introverted nor extraverted. They can participate in group discussions when needed but also value focused solo study time. They may prefer smaller study groups over large lecture-style sessions.'
					},
					A: {
						insight:
							'Alex is generally cooperative and patient with others. They handle disagreements calmly and are willing to compromise, though they also stand firm on matters of principle. This balance makes them effective in collaborative learning.'
					},
					C: {
						insight:
							'This is Alex\'s standout trait. They are exceptionally organised, diligent, and thorough in their work. They likely keep detailed notes, plan study schedules in advance, and submit assignments well before deadlines. A tutor can rely on them to come prepared.'
					},
					O: {
						insight:
							'Alex has moderate openness — they are curious and willing to explore new ideas, but prefer practical applications over purely theoretical discussions. They learn best when new concepts are connected to real-world examples.'
					}
				},
				strengths: [
					'Exceptional organisation — keeps detailed notes and plans ahead',
					'Strong work ethic and diligence in completing tasks',
					'High integrity and fairness in academic collaboration',
					'Patient and cooperative in group settings',
					'Handles pressure with composure'
				],
				growth_areas: [
					'Could benefit from stepping outside comfort zone socially — try leading a study group',
					'Exploring more creative and unconventional approaches to problem-solving',
					'Being more open about stress or challenges to get support early'
				],
				study_recommendations: [
					'Use structured planners and checklists to leverage organisational strengths',
					'Try teaching concepts to others — this reinforces learning and builds social confidence',
					'Experiment with creative study methods like mind maps or visual summaries',
					'Schedule regular breaks to avoid burnout from perfectionist tendencies'
				]
			},
			archetypes: [
				{
					name: 'Structured Coach',
					description:
						'A methodical tutor who provides clear lesson plans, progress tracking, and systematic skill-building.',
					icon: '📋',
					match_score: 0.85,
					teaching_style: 'Organised and goal-oriented',
					key_insight:
						'Matches Alex\'s need for structure and clear progression milestones.',
					explanation:
						'Alex\'s high conscientiousness pairs perfectly with a tutor who values planning and systematic approaches.'
				},
				{
					name: 'Academic Mentor',
					description:
						'A knowledgeable guide who focuses on deep understanding, critical thinking, and academic rigour.',
					icon: '🎓',
					match_score: 0.78,
					teaching_style: 'Analytical and thorough',
					key_insight:
						'Supports Alex\'s diligence with deeper analytical frameworks.',
					explanation:
						'Alex\'s moderate openness and high diligence suit a mentor who challenges them intellectually while maintaining structure.'
				},
				{
					name: 'Accountability Partner',
					description:
						'A supportive tutor who sets clear expectations, tracks progress, and holds students to high standards.',
					icon: '🤝',
					match_score: 0.72,
					teaching_style: 'Supportive and consistent',
					key_insight:
						'Complements Alex\'s self-discipline with external accountability.',
					explanation:
						'While Alex is already highly disciplined, an accountability partner can help them push beyond their comfort zone.'
				}
			]
		}
	},
	{
		id: 'sample-maya-rivera',
		name: 'Maya Rivera',
		date: '2025-12-02T14:15:00.000Z',
		results: {
			dimensions: {
				H: {
					name: 'Honesty-Humility',
					score: 3.2,
					level: 'moderate',
					facets: {
						sincerity: { name: 'Sincerity', score: 3.4 },
						fairness: { name: 'Fairness', score: 3.0 },
						greed_avoidance: { name: 'Greed Avoidance', score: 3.2 },
						modesty: { name: 'Modesty', score: 3.2 }
					}
				},
				E: {
					name: 'Emotionality',
					score: 3.0,
					level: 'moderate',
					facets: {
						fearfulness: { name: 'Fearfulness', score: 2.6 },
						anxiety: { name: 'Anxiety', score: 3.0 },
						dependence: { name: 'Dependence', score: 3.2 },
						sentimentality: { name: 'Sentimentality', score: 3.2 }
					}
				},
				X: {
					name: 'Extraversion',
					score: 4.2,
					level: 'high',
					facets: {
						social_self_esteem: { name: 'Social Self-Esteem', score: 4.5 },
						social_boldness: { name: 'Social Boldness', score: 4.3 },
						sociability: { name: 'Sociability', score: 4.0 },
						liveliness: { name: 'Liveliness', score: 4.0 }
					}
				},
				A: {
					name: 'Agreeableness',
					score: 3.3,
					level: 'moderate',
					facets: {
						forgiveness: { name: 'Forgiveness', score: 3.5 },
						gentleness: { name: 'Gentleness', score: 3.0 },
						flexibility: { name: 'Flexibility', score: 3.5 },
						patience: { name: 'Patience', score: 3.2 }
					}
				},
				C: {
					name: 'Conscientiousness',
					score: 2.5,
					level: 'low',
					facets: {
						organization: { name: 'Organization', score: 2.0 },
						diligence: { name: 'Diligence', score: 2.8 },
						perfectionism: { name: 'Perfectionism', score: 2.5 },
						prudence: { name: 'Prudence', score: 2.7 }
					}
				},
				O: {
					name: 'Openness to Experience',
					score: 4.4,
					level: 'very_high',
					facets: {
						aesthetic_appreciation: { name: 'Aesthetic Appreciation', score: 4.6 },
						inquisitiveness: { name: 'Inquisitiveness', score: 4.5 },
						creativity: { name: 'Creativity', score: 4.5 },
						unconventionality: { name: 'Unconventionality', score: 4.0 }
					}
				}
			},
			narrative: {
				summary:
					'Maya is a creative and socially confident learner who thrives in dynamic, collaborative environments. Her high openness and extraversion make her an enthusiastic participant in discussions, while her lower conscientiousness suggests she benefits from external structure and deadline management.',
				dimension_insights: {
					H: {
						insight:
							'Maya has a balanced approach to integrity and social exchange. She is generally fair and sincere but also pragmatic. She works well in competitive environments and appreciates recognition for her achievements.'
					},
					E: {
						insight:
							'With moderate emotionality, Maya maintains good emotional balance. She connects with others empathetically but doesn\'t let emotions overwhelm her decision-making. She handles social pressures well thanks to her confident extraversion.'
					},
					X: {
						insight:
							'Maya is highly extraverted — she draws energy from social interaction and thrives in group settings. She is socially bold, comfortable speaking up in class, and naturally takes on leadership roles in group projects. She may find solo study less engaging.'
					},
					A: {
						insight:
							'Maya is reasonably flexible and forgiving but also assertive when needed. She can navigate group dynamics well, though she may occasionally prioritise her own ideas over consensus. This assertiveness drives innovation in group work.'
					},
					C: {
						insight:
							'Organisation and planning are growth areas for Maya. She may struggle with long-term projects, procrastinate on less exciting tasks, and work in bursts of inspiration rather than steady effort. External structure and deadlines help her stay on track.'
					},
					O: {
						insight:
							'This is Maya\'s strongest dimension. She is highly creative, intellectually curious, and appreciates aesthetics. She loves exploring unconventional ideas and connecting concepts across disciplines. She learns best through discovery and creative expression.'
					}
				},
				strengths: [
					'Exceptional creativity and ability to think outside the box',
					'Strong intellectual curiosity — loves exploring new ideas',
					'Socially confident and effective communicator',
					'Comfortable with leadership and public speaking',
					'Flexible and adaptable to new situations'
				],
				growth_areas: [
					'Developing consistent study routines and organisational habits',
					'Following through on long-term projects without losing momentum',
					'Balancing creative exploration with meeting practical deadlines',
					'Being more patient with repetitive but necessary practice'
				],
				study_recommendations: [
					'Use creative study methods — visual mind maps, colour coding, teaching through storytelling',
					'Break large projects into smaller, time-boxed sprints to maintain momentum',
					'Study with others — join study groups or find a study buddy for accountability',
					'Connect new material to personal interests and real-world applications to stay engaged',
					'Use timers and structured sessions (like Pomodoro) to build focus habits'
				]
			},
			archetypes: [
				{
					name: 'Creative Explorer',
					description:
						'An innovative tutor who uses creative teaching methods, cross-disciplinary connections, and discovery-based learning.',
					icon: '🎨',
					match_score: 0.87,
					teaching_style: 'Creative and discovery-driven',
					key_insight:
						'Matches Maya\'s love of creativity and intellectual exploration.',
					explanation:
						'Maya\'s high openness and extraversion thrive with a tutor who encourages experimentation and creative expression.'
				},
				{
					name: 'Dynamic Motivator',
					description:
						'An energetic tutor who keeps sessions lively, uses varied activities, and maintains high engagement.',
					icon: '⚡',
					match_score: 0.81,
					teaching_style: 'Energetic and varied',
					key_insight:
						'Keeps Maya engaged with varied, high-energy learning activities.',
					explanation:
						'Maya\'s high extraversion and low conscientiousness mean she needs variety and energy to stay focused.'
				},
				{
					name: 'Structured Coach',
					description:
						'A methodical tutor who provides clear lesson plans, progress tracking, and systematic skill-building.',
					icon: '📋',
					match_score: 0.69,
					teaching_style: 'Organised and goal-oriented',
					key_insight:
						'Provides the external structure Maya needs to channel her creativity productively.',
					explanation:
						'While not Maya\'s natural style, a structured coach compensates for her lower conscientiousness with planning support.'
				}
			]
		}
	}
];
