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
			],
			// Alex: High-C strategic deep learner, self-determined, strong self-regulation
			studyProfile: {
				studyApproaches: {
					deep: { score: 3.8, level: 'high', items: 4 },
					strategic: { score: 4.2, level: 'high', items: 3 },
					surface: { score: 1.7, level: 'low', items: 3 }
				},
				motivation: {
					intrinsic: { score: 3.5, level: 'high', items: 3 },
					identified: { score: 4.5, level: 'high', items: 2 },
					external: { score: 2.5, level: 'moderate', items: 2 },
					amotivation: { score: 1.3, level: 'low', items: 3 },
					sdi: 7.7
				},
				selfRegulation: {
					selfEfficacy: { score: 4.0, level: 'high', items: 2 },
					planning: { score: 4.5, level: 'high', items: 2 },
					effortRegulation: { score: 4.0, level: 'high', items: 2 },
					testAnxiety: { score: 3.5, level: 'high', items: 2 },
					helpSeeking: { score: 2.5, level: 'moderate', items: 2 }
				},
				dominantApproach: 'strategic',
				motivationProfile: 'self-determined',
				regulationStrength: 'high'
			}
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
			],
			// Maya: High-O surface learner with moderate motivation, low self-regulation
			studyProfile: {
				studyApproaches: {
					deep: { score: 3.5, level: 'high', items: 4 },
					strategic: { score: 2.0, level: 'low', items: 3 },
					surface: { score: 3.7, level: 'high', items: 3 }
				},
				motivation: {
					intrinsic: { score: 4.0, level: 'high', items: 3 },
					identified: { score: 2.5, level: 'moderate', items: 2 },
					external: { score: 3.0, level: 'moderate', items: 2 },
					amotivation: { score: 2.3, level: 'low', items: 3 },
					sdi: 3.4
				},
				selfRegulation: {
					selfEfficacy: { score: 3.5, level: 'high', items: 2 },
					planning: { score: 1.5, level: 'low', items: 2 },
					effortRegulation: { score: 2.0, level: 'low', items: 2 },
					testAnxiety: { score: 2.5, level: 'moderate', items: 2 },
					helpSeeking: { score: 4.0, level: 'high', items: 2 }
				},
				dominantApproach: 'surface',
				motivationProfile: 'self-determined',
				regulationStrength: 'low'
			}
		}
	},
	// ─── Profile 3: Quiet Perfectionist (anxious high-achiever) ─────
	{
		id: 'sample-liam-nguyen',
		name: 'Liam Nguyen',
		date: '2026-02-10T09:00:00.000Z',
		results: {
			dimensions: {
				H: {
					name: 'Honesty-Humility',
					score: 4.2,
					level: 'high',
					facets: {
						sincerity: { name: 'Sincerity', score: 4.0 },
						fairness: { name: 'Fairness', score: 4.5 },
						greed_avoidance: { name: 'Greed Avoidance', score: 4.0 },
						modesty: { name: 'Modesty', score: 4.3 }
					}
				},
				E: {
					name: 'Emotionality',
					score: 4.0,
					level: 'high',
					facets: {
						fearfulness: { name: 'Fearfulness', score: 3.8 },
						anxiety: { name: 'Anxiety', score: 4.5 },
						dependence: { name: 'Dependence', score: 3.8 },
						sentimentality: { name: 'Sentimentality', score: 3.9 }
					}
				},
				X: {
					name: 'Extraversion',
					score: 2.0,
					level: 'low',
					facets: {
						social_self_esteem: { name: 'Social Self-Esteem', score: 2.3 },
						social_boldness: { name: 'Social Boldness', score: 1.5 },
						sociability: { name: 'Sociability', score: 2.0 },
						liveliness: { name: 'Liveliness', score: 2.2 }
					}
				},
				A: {
					name: 'Agreeableness',
					score: 4.0,
					level: 'high',
					facets: {
						forgiveness: { name: 'Forgiveness', score: 4.0 },
						gentleness: { name: 'Gentleness', score: 4.3 },
						flexibility: { name: 'Flexibility', score: 3.8 },
						patience: { name: 'Patience', score: 3.9 }
					}
				},
				C: {
					name: 'Conscientiousness',
					score: 4.3,
					level: 'high',
					facets: {
						organization: { name: 'Organization', score: 4.0 },
						diligence: { name: 'Diligence', score: 4.5 },
						perfectionism: { name: 'Perfectionism', score: 4.8 },
						prudence: { name: 'Prudence', score: 3.9 }
					}
				},
				O: {
					name: 'Openness to Experience',
					score: 3.0,
					level: 'moderate',
					facets: {
						aesthetic_appreciation: { name: 'Aesthetic Appreciation', score: 3.2 },
						inquisitiveness: { name: 'Inquisitiveness', score: 3.0 },
						creativity: { name: 'Creativity', score: 2.8 },
						unconventionality: { name: 'Unconventionality', score: 3.0 }
					}
				}
			},
			narrative: {
				summary:
					'Liam is a quiet, highly diligent student who sets exacting standards for himself. His strong conscientiousness and high emotionality mean he works extremely hard but also puts immense pressure on himself. He excels in structured, predictable environments and needs reassurance that good enough is good enough.',
				dimension_insights: {
					H: {
						insight:
							'Liam is principled and modest. He never cuts corners and holds himself to strict ethical standards. He is unlikely to seek attention or take credit he doesn\'t feel he deserves.'
					},
					E: {
						insight:
							'Liam experiences emotions deeply. He worries about exams well in advance, may catastrophise setbacks, and needs emotional support when things go wrong. His anxiety can be paralysing if not managed.'
					},
					X: {
						insight:
							'Liam is introverted and avoids the spotlight. He rarely volunteers in class, prefers one-on-one or solo study, and can seem withdrawn in group settings. He is not unfriendly — just reserved.'
					},
					A: {
						insight:
							'Liam is gentle and accommodating. He avoids conflict, goes along with group decisions even when he disagrees, and is a reliable, non-disruptive team member. He may need encouragement to voice his own ideas.'
					},
					C: {
						insight:
							'Liam is exceptionally diligent and perfectionist. He spends excessive time polishing assignments, redoes work that others would consider finished, and may procrastinate on starting tasks because he fears doing them imperfectly.'
					},
					O: {
						insight:
							'Liam is moderately open. He is comfortable with familiar formats and conventional approaches. He doesn\'t seek novelty but will engage with new ideas when guided.'
					}
				},
				strengths: [
					'Extremely thorough and detail-oriented work',
					'Reliable and trustworthy in group settings',
					'Strong moral compass and academic integrity',
					'Patient and persistent with difficult material',
					'Deeply empathetic and sensitive to others\' needs'
				],
				growth_areas: [
					'Managing perfectionist tendencies that slow output',
					'Building confidence to participate in class discussions',
					'Reducing test anxiety through preparation strategies',
					'Learning to accept "good enough" as genuinely good'
				],
				study_recommendations: [
					'Use timed study blocks to prevent over-polishing',
					'Practice answering questions in low-stakes settings to build confidence',
					'Learn relaxation techniques (breathing, mindfulness) for exam anxiety',
					'Set specific "done" criteria for each task to combat perfectionism'
				]
			},
			archetypes: [
				{
					name: 'Gentle Guide',
					description:
						'A patient, empathetic tutor who creates a safe space for learning without pressure.',
					icon: '🌱',
					match_score: 0.89,
					teaching_style: 'Patient and encouraging',
					key_insight: 'Creates the low-pressure environment Liam needs to thrive.',
					explanation: 'Liam\'s high anxiety and introversion require a tutor who prioritises safety and patience over pace.'
				},
				{
					name: 'Structured Coach',
					description: 'A methodical tutor who provides clear lesson plans, progress tracking, and systematic skill-building.',
					icon: '📋',
					match_score: 0.76,
					teaching_style: 'Organised and goal-oriented',
					key_insight: 'Provides the clear structure that reduces Liam\'s uncertainty.',
					explanation: 'Clear expectations and progress markers help Liam see he is "on track" and reduce anxiety.'
				},
				{
					name: 'Academic Mentor',
					description: 'A knowledgeable guide who focuses on deep understanding, critical thinking, and academic rigour.',
					icon: '🎓',
					match_score: 0.70,
					teaching_style: 'Analytical and thorough',
					key_insight: 'Matches Liam\'s dedication to thoroughness and accuracy.',
					explanation: 'Liam\'s perfectionism is better channelled into depth than breadth.'
				}
			],
			studyProfile: {
				studyApproaches: {
					deep: { score: 3.5, level: 'high', items: 4 },
					strategic: { score: 4.0, level: 'high', items: 3 },
					surface: { score: 2.7, level: 'moderate', items: 3 }
				},
				motivation: {
					intrinsic: { score: 3.0, level: 'moderate', items: 3 },
					identified: { score: 4.5, level: 'high', items: 2 },
					external: { score: 4.0, level: 'high', items: 2 },
					amotivation: { score: 1.5, level: 'low', items: 3 },
					// SDI: 2*3.0 + 4.5 - 4.0 - 2*1.5 = 6+4.5-4-3 = 3.5
					sdi: 3.5
				},
				selfRegulation: {
					selfEfficacy: { score: 2.5, level: 'moderate', items: 2 },
					planning: { score: 4.0, level: 'high', items: 2 },
					effortRegulation: { score: 4.5, level: 'high', items: 2 },
					testAnxiety: { score: 1.5, level: 'low', items: 2 },
					helpSeeking: { score: 2.0, level: 'low', items: 2 }
				},
				dominantApproach: 'strategic',
				motivationProfile: 'self-determined',
				regulationStrength: 'high'
			}
		}
	},
	// ─── Profile 4: Social Butterfly (externally motivated, low effort) ─
	{
		id: 'sample-jasmine-okafor',
		name: 'Jasmine Okafor',
		date: '2026-01-20T11:30:00.000Z',
		results: {
			dimensions: {
				H: {
					name: 'Honesty-Humility',
					score: 2.8,
					level: 'moderate',
					facets: {
						sincerity: { name: 'Sincerity', score: 3.0 },
						fairness: { name: 'Fairness', score: 2.5 },
						greed_avoidance: { name: 'Greed Avoidance', score: 2.8 },
						modesty: { name: 'Modesty', score: 2.9 }
					}
				},
				E: {
					name: 'Emotionality',
					score: 3.3,
					level: 'moderate',
					facets: {
						fearfulness: { name: 'Fearfulness', score: 3.0 },
						anxiety: { name: 'Anxiety', score: 3.5 },
						dependence: { name: 'Dependence', score: 3.5 },
						sentimentality: { name: 'Sentimentality', score: 3.2 }
					}
				},
				X: {
					name: 'Extraversion',
					score: 4.5,
					level: 'very_high',
					facets: {
						social_self_esteem: { name: 'Social Self-Esteem', score: 4.8 },
						social_boldness: { name: 'Social Boldness', score: 4.5 },
						sociability: { name: 'Sociability', score: 4.5 },
						liveliness: { name: 'Liveliness', score: 4.2 }
					}
				},
				A: {
					name: 'Agreeableness',
					score: 3.8,
					level: 'high',
					facets: {
						forgiveness: { name: 'Forgiveness', score: 4.0 },
						gentleness: { name: 'Gentleness', score: 3.5 },
						flexibility: { name: 'Flexibility', score: 4.0 },
						patience: { name: 'Patience', score: 3.7 }
					}
				},
				C: {
					name: 'Conscientiousness',
					score: 2.2,
					level: 'low',
					facets: {
						organization: { name: 'Organization', score: 1.8 },
						diligence: { name: 'Diligence', score: 2.5 },
						perfectionism: { name: 'Perfectionism', score: 2.2 },
						prudence: { name: 'Prudence', score: 2.3 }
					}
				},
				O: {
					name: 'Openness to Experience',
					score: 3.0,
					level: 'moderate',
					facets: {
						aesthetic_appreciation: { name: 'Aesthetic Appreciation', score: 3.5 },
						inquisitiveness: { name: 'Inquisitiveness', score: 2.5 },
						creativity: { name: 'Creativity', score: 3.0 },
						unconventionality: { name: 'Unconventionality', score: 3.0 }
					}
				}
			},
			narrative: {
				summary:
					'Jasmine is a highly social and outgoing student who thrives on connection and collaboration. Her exceptional social confidence makes her a natural group leader, but her low conscientiousness and preference for fun over focused study mean she needs significant structure and accountability to reach her academic potential.',
				dimension_insights: {
					H: {
						insight: 'Jasmine is pragmatic and socially aware. She knows how to navigate social dynamics and isn\'t above a little strategic flattery. She values recognition and status within her peer group.'
					},
					E: {
						insight: 'Jasmine has moderate emotionality — she feels things but doesn\'t dwell. She is socially dependent and values belonging, which means social exclusion or peer disapproval hits hard.'
					},
					X: {
						insight: 'This is Jasmine\'s defining trait. She is the life of the party, the first to volunteer, and the one who knows everyone\'s name. She draws energy from being around people and finds solo work draining.'
					},
					A: {
						insight: 'Jasmine is flexible and forgiving — she gets along with almost everyone. She smooths over conflicts and adapts to group norms, though she may avoid necessary confrontation.'
					},
					C: {
						insight: 'Organisation is not Jasmine\'s strength. She loses track of deadlines, starts assignments at the last minute, and her notes are chaotic. She needs external structure to stay on track.'
					},
					O: {
						insight: 'Jasmine has average openness — she engages with topics that are social or practical but finds abstract theory boring. She learns best through discussion and real-world examples.'
					}
				},
				strengths: [
					'Exceptional social skills and ability to connect with anyone',
					'Natural group leader who energises others',
					'Flexible and easy-going in collaborative settings',
					'Confident and comfortable speaking in front of groups',
					'Quick to build rapport with tutors and peers'
				],
				growth_areas: [
					'Building consistent study habits and meeting deadlines',
					'Learning to study effectively alone when group work isn\'t possible',
					'Developing deeper engagement with academic content beyond social settings',
					'Reducing reliance on last-minute cramming'
				],
				study_recommendations: [
					'Study with others — use social skills as a study tool (discussion groups, teaching peers)',
					'Use a shared calendar or accountability app with a study buddy',
					'Break study into very short, timed blocks to maintain attention',
					'Reward focused study with social activities to build positive associations',
					'Try verbal study methods — recording explanations, debating ideas out loud'
				]
			},
			archetypes: [
				{
					name: 'Dynamic Motivator',
					description: 'An energetic tutor who keeps sessions lively, uses varied activities, and maintains high engagement.',
					icon: '⚡',
					match_score: 0.90,
					teaching_style: 'Energetic and varied',
					key_insight: 'Matches Jasmine\'s need for energy and variety to stay focused.',
					explanation: 'Jasmine\'s high extraversion and low conscientiousness demand a tutor who keeps things moving and exciting.'
				},
				{
					name: 'Structured Coach',
					description: 'A methodical tutor who provides clear lesson plans, progress tracking, and systematic skill-building.',
					icon: '📋',
					match_score: 0.75,
					teaching_style: 'Organised and goal-oriented',
					key_insight: 'Provides the structure Jasmine naturally lacks.',
					explanation: 'While it may feel constraining, a structured coach gives Jasmine the guardrails she needs to succeed.'
				},
				{
					name: 'Accountability Partner',
					description: 'A supportive tutor who sets clear expectations, tracks progress, and holds students to high standards.',
					icon: '🤝',
					match_score: 0.72,
					teaching_style: 'Supportive and consistent',
					key_insight: 'Uses the social bond to drive accountability.',
					explanation: 'Jasmine responds to people, not systems — a tutor she likes and respects will get more from her than any planner.'
				}
			],
			studyProfile: {
				studyApproaches: {
					deep: { score: 2.0, level: 'low', items: 4 },
					strategic: { score: 2.3, level: 'low', items: 3 },
					surface: { score: 4.0, level: 'high', items: 3 }
				},
				motivation: {
					intrinsic: { score: 2.0, level: 'low', items: 3 },
					identified: { score: 2.5, level: 'moderate', items: 2 },
					external: { score: 4.5, level: 'high', items: 2 },
					amotivation: { score: 2.0, level: 'low', items: 3 },
					// SDI: 2*2.0 + 2.5 - 4.5 - 2*2.0 = 4+2.5-4.5-4 = -2.0
					sdi: -2.0
				},
				selfRegulation: {
					selfEfficacy: { score: 3.5, level: 'high', items: 2 },
					planning: { score: 1.5, level: 'low', items: 2 },
					effortRegulation: { score: 1.5, level: 'low', items: 2 },
					testAnxiety: { score: 3.0, level: 'moderate', items: 2 },
					helpSeeking: { score: 4.5, level: 'high', items: 2 }
				},
				dominantApproach: 'surface',
				motivationProfile: 'controlled',
				regulationStrength: 'low'
			}
		}
	},
	// ─── Profile 5: Gifted Underachiever (high potential, checked out) ──
	{
		id: 'sample-ethan-brooks',
		name: 'Ethan Brooks',
		date: '2026-03-01T08:45:00.000Z',
		results: {
			dimensions: {
				H: {
					name: 'Honesty-Humility',
					score: 3.0,
					level: 'moderate',
					facets: {
						sincerity: { name: 'Sincerity', score: 3.2 },
						fairness: { name: 'Fairness', score: 2.8 },
						greed_avoidance: { name: 'Greed Avoidance', score: 3.0 },
						modesty: { name: 'Modesty', score: 3.0 }
					}
				},
				E: {
					name: 'Emotionality',
					score: 2.0,
					level: 'low',
					facets: {
						fearfulness: { name: 'Fearfulness', score: 1.8 },
						anxiety: { name: 'Anxiety', score: 2.0 },
						dependence: { name: 'Dependence', score: 2.0 },
						sentimentality: { name: 'Sentimentality', score: 2.2 }
					}
				},
				X: {
					name: 'Extraversion',
					score: 3.2,
					level: 'moderate',
					facets: {
						social_self_esteem: { name: 'Social Self-Esteem', score: 3.5 },
						social_boldness: { name: 'Social Boldness', score: 3.0 },
						sociability: { name: 'Sociability', score: 3.0 },
						liveliness: { name: 'Liveliness', score: 3.3 }
					}
				},
				A: {
					name: 'Agreeableness',
					score: 2.5,
					level: 'moderate',
					facets: {
						forgiveness: { name: 'Forgiveness', score: 2.8 },
						gentleness: { name: 'Gentleness', score: 2.3 },
						flexibility: { name: 'Flexibility', score: 2.5 },
						patience: { name: 'Patience', score: 2.4 }
					}
				},
				C: {
					name: 'Conscientiousness',
					score: 1.8,
					level: 'low',
					facets: {
						organization: { name: 'Organization', score: 1.5 },
						diligence: { name: 'Diligence', score: 2.0 },
						perfectionism: { name: 'Perfectionism', score: 1.8 },
						prudence: { name: 'Prudence', score: 1.9 }
					}
				},
				O: {
					name: 'Openness to Experience',
					score: 4.5,
					level: 'very_high',
					facets: {
						aesthetic_appreciation: { name: 'Aesthetic Appreciation', score: 4.0 },
						inquisitiveness: { name: 'Inquisitiveness', score: 4.8 },
						creativity: { name: 'Creativity', score: 4.7 },
						unconventionality: { name: 'Unconventionality', score: 4.5 }
					}
				}
			},
			narrative: {
				summary:
					'Ethan is intellectually gifted with exceptional curiosity and creativity, but he has largely checked out of formal schooling. His very high openness shows a mind that loves to explore, but his very low conscientiousness and amotivation suggest that school isn\'t giving him what he needs. He learns voraciously — just not what\'s on the syllabus.',
				dimension_insights: {
					H: {
						insight: 'Ethan is neutral on rules — he follows them when convenient but doesn\'t feel morally bound. He is honest but pragmatic, and may question authority when he sees it as arbitrary.'
					},
					E: {
						insight: 'Ethan is emotionally detached and rarely shows vulnerability. He doesn\'t worry much about exams or social approval. This independence can be a strength, but it also means he won\'t ask for help even when he needs it.'
					},
					X: {
						insight: 'Ethan is moderately extraverted — he can socialise fine but doesn\'t need to. He has a small circle of close friends and is comfortable being alone with his thoughts and projects.'
					},
					A: {
						insight: 'Ethan can be blunt and impatient with people he perceives as less capable. He challenges teachers, questions assignments he finds pointless, and may come across as arrogant even when he doesn\'t intend to.'
					},
					C: {
						insight: 'This is Ethan\'s weakest area. He doesn\'t do homework, loses materials, submits work late (if at all), and sees most school tasks as busywork beneath his ability. He has the capacity but not the will.'
					},
					O: {
						insight: 'Ethan is brilliantly curious and creative. He reads advanced material for fun, builds elaborate personal projects, and makes connections others miss. His intellectual potential is enormous — school just hasn\'t captured it yet.'
					}
				},
				strengths: [
					'Exceptional intellectual curiosity and love of learning (on his terms)',
					'Highly creative and original thinker',
					'Independent and self-directed when engaged',
					'Emotionally resilient under pressure',
					'Naturally questions assumptions — potential for critical thinking excellence'
				],
				growth_areas: [
					'Reconnecting effort to purpose — finding reasons to engage with school',
					'Building basic organisational habits (starting small)',
					'Developing patience and respect for structured processes',
					'Channelling contrarian tendencies into constructive debate'
				],
				study_recommendations: [
					'Give Ethan autonomy — let him choose how he demonstrates understanding',
					'Connect curriculum to his personal interests and advanced reading',
					'Use project-based assessment rather than routine homework',
					'Avoid busywork — it will kill whatever engagement remains',
					'Pair with a mentor who respects his intelligence and doesn\'t talk down'
				]
			},
			archetypes: [
				{
					name: 'Intellectual Sparring Partner',
					description: 'A tutor who matches Ethan\'s intellect, debates ideas, and earns respect through knowledge rather than authority.',
					icon: '🧠',
					match_score: 0.88,
					teaching_style: 'Challenging and Socratic',
					key_insight: 'Ethan needs a tutor he respects intellectually, not one who follows a textbook.',
					explanation: 'Ethan\'s high openness and low agreeableness mean he\'ll disengage from anyone he perceives as less capable or overly rigid.'
				},
				{
					name: 'Creative Explorer',
					description: 'An innovative tutor who uses creative teaching methods, cross-disciplinary connections, and discovery-based learning.',
					icon: '🎨',
					match_score: 0.82,
					teaching_style: 'Creative and discovery-driven',
					key_insight: 'Matches Ethan\'s need for novelty and intellectual challenge.',
					explanation: 'Ethan\'s exceptional creativity needs an outlet that connects to academic goals.'
				},
				{
					name: 'Gentle Guide',
					description: 'A patient, empathetic tutor who builds trust and slowly rebuilds engagement.',
					icon: '🌱',
					match_score: 0.60,
					teaching_style: 'Patient and encouraging',
					key_insight: 'Addresses the underlying disengagement rather than just the surface symptoms.',
					explanation: 'While Ethan may resist overt emotional support, a patient guide can rebuild the school-student relationship.'
				}
			],
			studyProfile: {
				studyApproaches: {
					deep: { score: 4.5, level: 'high', items: 4 },
					strategic: { score: 1.3, level: 'low', items: 3 },
					surface: { score: 4.3, level: 'high', items: 3 }
				},
				motivation: {
					intrinsic: { score: 4.3, level: 'high', items: 3 },
					identified: { score: 1.5, level: 'low', items: 2 },
					external: { score: 1.5, level: 'low', items: 2 },
					amotivation: { score: 4.0, level: 'high', items: 3 },
					// SDI: 2*4.3 + 1.5 - 1.5 - 2*4.0 = 8.6+1.5-1.5-8.0 = 0.6
					sdi: 0.6
				},
				selfRegulation: {
					selfEfficacy: { score: 4.0, level: 'high', items: 2 },
					planning: { score: 1.0, level: 'low', items: 2 },
					effortRegulation: { score: 1.5, level: 'low', items: 2 },
					testAnxiety: { score: 4.5, level: 'high', items: 2 },
					helpSeeking: { score: 1.5, level: 'low', items: 2 }
				},
				dominantApproach: 'deep',
				motivationProfile: 'moderate',
				regulationStrength: 'low'
			}
		}
	},
	// ─── Profile 6: Struggling Learner (low confidence, high anxiety) ──
	{
		id: 'sample-priya-sharma',
		name: 'Priya Sharma',
		date: '2026-03-10T13:00:00.000Z',
		results: {
			dimensions: {
				H: {
					name: 'Honesty-Humility',
					score: 3.8,
					level: 'high',
					facets: {
						sincerity: { name: 'Sincerity', score: 3.7 },
						fairness: { name: 'Fairness', score: 4.0 },
						greed_avoidance: { name: 'Greed Avoidance', score: 3.8 },
						modesty: { name: 'Modesty', score: 3.7 }
					}
				},
				E: {
					name: 'Emotionality',
					score: 4.3,
					level: 'high',
					facets: {
						fearfulness: { name: 'Fearfulness', score: 4.5 },
						anxiety: { name: 'Anxiety', score: 4.8 },
						dependence: { name: 'Dependence', score: 4.0 },
						sentimentality: { name: 'Sentimentality', score: 3.9 }
					}
				},
				X: {
					name: 'Extraversion',
					score: 2.3,
					level: 'low',
					facets: {
						social_self_esteem: { name: 'Social Self-Esteem', score: 1.8 },
						social_boldness: { name: 'Social Boldness', score: 2.0 },
						sociability: { name: 'Sociability', score: 2.5 },
						liveliness: { name: 'Liveliness', score: 2.9 }
					}
				},
				A: {
					name: 'Agreeableness',
					score: 4.2,
					level: 'high',
					facets: {
						forgiveness: { name: 'Forgiveness', score: 4.3 },
						gentleness: { name: 'Gentleness', score: 4.5 },
						flexibility: { name: 'Flexibility', score: 4.0 },
						patience: { name: 'Patience', score: 4.0 }
					}
				},
				C: {
					name: 'Conscientiousness',
					score: 3.0,
					level: 'moderate',
					facets: {
						organization: { name: 'Organization', score: 3.2 },
						diligence: { name: 'Diligence', score: 3.0 },
						perfectionism: { name: 'Perfectionism', score: 3.0 },
						prudence: { name: 'Prudence', score: 2.8 }
					}
				},
				O: {
					name: 'Openness to Experience',
					score: 2.5,
					level: 'moderate',
					facets: {
						aesthetic_appreciation: { name: 'Aesthetic Appreciation', score: 2.8 },
						inquisitiveness: { name: 'Inquisitiveness', score: 2.2 },
						creativity: { name: 'Creativity', score: 2.5 },
						unconventionality: { name: 'Unconventionality', score: 2.5 }
					}
				}
			},
			narrative: {
				summary:
					'Priya is a kind-hearted and hard-working student who is held back by severe test anxiety and low self-confidence. She puts in the hours but doubts herself constantly, which undermines her performance. With the right support, her diligence and integrity could blossom into genuine academic confidence.',
				dimension_insights: {
					H: {
						insight: 'Priya is honest and fair. She would never cheat or take shortcuts. She holds herself to high ethical standards and is trustworthy in all academic settings.'
					},
					E: {
						insight: 'Priya\'s high emotionality is her biggest challenge. She worries intensely about exams, takes criticism personally, and can spiral into self-doubt after a bad mark. She needs consistent emotional support and reassurance.'
					},
					X: {
						insight: 'Priya is quiet and reserved. She rarely speaks in class even when she knows the answer, and group presentations cause significant anxiety. One-on-one settings are where she opens up.'
					},
					A: {
						insight: 'Priya is gentle, kind, and a peacekeeper. She always puts others first and avoids confrontation. She is the supportive friend in any group but may struggle to advocate for her own needs.'
					},
					C: {
						insight: 'Priya is moderately conscientious — she tries hard but her anxiety sometimes paralyses her progress. She starts studying early but inefficiently, often re-reading notes without actively processing them.'
					},
					O: {
						insight: 'Priya prefers familiar methods and known territory. She is not drawn to abstract thinking or creative risk-taking. She learns best with clear, step-by-step instruction and concrete examples.'
					}
				},
				strengths: [
					'Genuine effort and willingness to work hard',
					'Exceptional kindness and empathy in group settings',
					'Strong integrity and trustworthiness',
					'Patient and persistent despite setbacks',
					'Responsive to encouragement and positive feedback'
				],
				growth_areas: [
					'Building academic self-confidence and self-belief',
					'Managing test anxiety with specific coping strategies',
					'Developing active study techniques (not just re-reading)',
					'Speaking up in class and advocating for her own needs'
				],
				study_recommendations: [
					'Use active recall and practice testing to build both knowledge and exam confidence',
					'Start with easy wins — begin study sessions with familiar material to build momentum',
					'Practice deep breathing and visualisation before exams',
					'Work with a tutor who provides frequent, specific praise',
					'Keep a "success journal" to counter negative self-talk with evidence of progress'
				]
			},
			archetypes: [
				{
					name: 'Gentle Guide',
					description: 'A patient, empathetic tutor who creates a safe space for learning without pressure.',
					icon: '🌱',
					match_score: 0.92,
					teaching_style: 'Patient and encouraging',
					key_insight: 'Priya needs a tutor who builds confidence first, content second.',
					explanation: 'Priya\'s high anxiety and low self-confidence require someone who prioritises emotional safety and celebrates small wins.'
				},
				{
					name: 'Structured Coach',
					description: 'A methodical tutor who provides clear lesson plans, progress tracking, and systematic skill-building.',
					icon: '📋',
					match_score: 0.78,
					teaching_style: 'Organised and goal-oriented',
					key_insight: 'Clear structure reduces uncertainty, which reduces anxiety.',
					explanation: 'When Priya knows exactly what to expect and what "good" looks like, she can focus on learning rather than worrying.'
				},
				{
					name: 'Accountability Partner',
					description: 'A supportive tutor who sets clear expectations, tracks progress, and holds students to high standards.',
					icon: '🤝',
					match_score: 0.65,
					teaching_style: 'Supportive and consistent',
					key_insight: 'Gentle accountability prevents Priya from falling into avoidance spirals.',
					explanation: 'Priya sometimes avoids studying material she finds hard because she fears failing at it. A kind but firm partner keeps her moving forward.'
				}
			],
			studyProfile: {
				studyApproaches: {
					deep: { score: 2.0, level: 'low', items: 4 },
					strategic: { score: 2.7, level: 'moderate', items: 3 },
					surface: { score: 3.8, level: 'high', items: 3 }
				},
				motivation: {
					intrinsic: { score: 2.3, level: 'low', items: 3 },
					identified: { score: 4.0, level: 'high', items: 2 },
					external: { score: 3.5, level: 'high', items: 2 },
					amotivation: { score: 2.7, level: 'moderate', items: 3 },
					// SDI: 2*2.3 + 4.0 - 3.5 - 2*2.7 = 4.6+4.0-3.5-5.4 = -0.3
					sdi: -0.3
				},
				selfRegulation: {
					selfEfficacy: { score: 1.5, level: 'low', items: 2 },
					planning: { score: 3.0, level: 'moderate', items: 2 },
					effortRegulation: { score: 3.0, level: 'moderate', items: 2 },
					testAnxiety: { score: 1.0, level: 'low', items: 2 },
					helpSeeking: { score: 2.0, level: 'low', items: 2 }
				},
				dominantApproach: 'surface',
				motivationProfile: 'controlled',
				regulationStrength: 'moderate'
			}
		}
	}
];
