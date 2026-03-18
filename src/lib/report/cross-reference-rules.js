export const ROOT_CAUSE_RULES = [
  {
    id: 'rc-01',
    type: 'root_cause',
    personalityCondition: { facet: 'anxiety', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'focus.procrastination.score', op: '>=', threshold: 3.0 },
    insight: 'Your anxiety drives avoidance — you put off work to avoid the stress of doing it wrong.',
    action: 'Break tasks into 5-minute chunks to bypass the anxiety trigger. Your diligence will carry you once you start.',
    visibleBehaviour: 'Late assignments, last-minute cramming',
    misdiagnosis: 'Looks like laziness, actually anxiety-driven avoidance',
    audience: 'all'
  },
  {
    id: 'rc-02',
    type: 'root_cause',
    personalityCondition: { facet: 'dependence', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.selfEfficacy.score', op: '<', threshold: 2.5 },
    insight: 'You rely on others for reassurance before starting work, and low self-belief makes it hard to begin alone.',
    action: 'Start with the easiest part of any task to build momentum. Keep a "wins list" to remind yourself you can do this.',
    visibleBehaviour: "Won't start without help, asks for reassurance constantly",
    misdiagnosis: 'Looks like attention-seeking, actually deep self-doubt',
    audience: 'all'
  },
  {
    id: 'rc-03',
    type: 'root_cause',
    personalityCondition: { facet: 'social_boldness', dim: 'X', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.helpSeeking.score', op: '<', threshold: 2.5 },
    insight: 'You find it hard to speak up or ask for help, which means you suffer in silence when stuck.',
    action: 'Prepare one question before each class. Use written channels (email, chat) to ask teachers when speaking feels too hard.',
    visibleBehaviour: 'Stays quiet when confused, falls behind silently',
    misdiagnosis: 'Looks like disengagement, actually social anxiety about asking',
    audience: 'all'
  },
  {
    id: 'rc-04',
    type: 'root_cause',
    personalityCondition: { facet: 'perfectionism', dim: 'C', op: '>=', threshold: 4.0 },
    academicCondition: { source: 'learnerProfile', path: 'focus.procrastination.score', op: '>=', threshold: 3.0 },
    insight: "Your high standards make starting feel overwhelming — if you can't do it perfectly, you'd rather not start at all.",
    action: 'Set a "rough draft" rule: first attempt is allowed to be bad. Perfectionism is NOT inverse but becomes harmful when combined with avoidance.',
    visibleBehaviour: "Spends 3 hours on a 1-hour task, or doesn't start at all",
    misdiagnosis: 'Looks like poor time management, actually perfectionism paralysis',
    audience: 'all'
  },
  {
    id: 'rc-05',
    type: 'root_cause',
    personalityCondition: { dim: 'C', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.surface.score', op: '>=', threshold: 3.5 },
    insight: 'Low discipline combined with surface-level study creates a cycle where you do the minimum to get by.',
    action: 'Try the "2-minute summary" after each class — write what you learned in your own words. Small habits build discipline.',
    visibleBehaviour: 'Minimal effort, memorising without understanding',
    misdiagnosis: 'Looks like not caring, actually lacking the structure to go deeper',
    audience: 'all'
  },
  {
    id: 'rc-06',
    type: 'root_cause',
    personalityCondition: { facet: 'anxiety', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'energy.netEnergy.score', op: '<', threshold: 2.5 },
    insight: 'Your constant worrying is exhausting — anxiety consumes mental energy that should fuel your studying.',
    action: 'Build a daily "worry dump" — 5 minutes to write down all worries, then close the notebook and study. Ring-fence your anxiety.',
    visibleBehaviour: "Tired, unfocused, can't sustain study sessions",
    misdiagnosis: 'Looks like low motivation, actually emotional exhaustion',
    audience: 'all'
  },
  {
    id: 'rc-07',
    type: 'root_cause',
    personalityCondition: { facet: 'patience', dim: 'A', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.amotivation.score', op: '>=', threshold: 3.0 },
    insight: "When progress is slow, your impatience turns into \"what's the point?\" — frustration kills motivation.",
    action: 'Set micro-goals you can achieve in 15 minutes. Visible progress is the antidote to frustration.',
    visibleBehaviour: 'Gives up quickly, says "I can\'t do this"',
    misdiagnosis: 'Looks like laziness, actually frustration from slow progress',
    audience: 'all'
  },
  {
    id: 'rc-08',
    type: 'root_cause',
    personalityCondition: { facet: 'diligence', dim: 'C', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.external.score', op: '>=', threshold: 3.5 },
    insight: "You're chasing grades and rewards rather than building genuine understanding, and without internal drive, effort drops when rewards disappear.",
    action: 'Find one topic you genuinely care about and study it beyond the syllabus. Building intrinsic motivation in one area spreads to others.',
    visibleBehaviour: "Only works when there's a test or reward, coasts otherwise",
    misdiagnosis: 'Looks like strategic prioritisation, actually missing internal drive',
    audience: 'all'
  },
  {
    id: 'rc-09',
    type: 'root_cause',
    personalityCondition: { facet: 'organisation', dim: 'C', op: '<', threshold: 2.5 },
    academicCondition: { source: 'learnerProfile', path: 'focus.procrastination.score', op: '>=', threshold: 3.0 },
    insight: "Without systems to track what's due and when, tasks pile up until they become emergencies.",
    action: "Start with one simple system: a \"top 3 tasks\" list each morning. You don't need a complex planner, just visibility.",
    visibleBehaviour: 'Missed deadlines, surprised by due dates',
    misdiagnosis: 'Looks like not caring about deadlines, actually no tracking system',
    audience: 'all'
  },
  {
    id: 'rc-10',
    type: 'root_cause',
    personalityCondition: { facet: 'diligence', dim: 'C', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.amotivation.score', op: '>=', threshold: 3.0 },
    insight: "Low effort combined with \"I don't see the point\" creates a downward spiral — less effort means less success, which confirms the belief that trying is pointless.",
    action: 'Connect one subject to a real-world goal you care about. "Why does this matter to MY future?" is the question to answer.',
    visibleBehaviour: "Doesn't try, submits incomplete work",
    misdiagnosis: 'Looks like defiance, actually lost connection to purpose',
    audience: 'all'
  },
  {
    id: 'rc-11',
    type: 'root_cause',
    personalityCondition: { facet: 'anxiety', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.selfEfficacy.score', op: '<', threshold: 2.5 },
    insight: 'You worry AND doubt yourself — anxiety says "something will go wrong" while low self-belief says "and you can\'t handle it."',
    action: 'Practise box breathing (4-4-4-4) before study. Keep evidence of past successes visible. Your worry is lying to you.',
    visibleBehaviour: 'Avoids challenges, panics before exams',
    misdiagnosis: 'Looks like being overdramatic, actually a genuine anxiety-confidence spiral',
    audience: 'all'
  },
  {
    id: 'rc-12',
    type: 'root_cause',
    personalityCondition: { facet: 'sociability', dim: 'X', op: '<', threshold: 2.5 },
    academicCondition: { source: 'learnerProfile', path: 'energy.netEnergy.score', op: '<', threshold: 2.5 },
    insight: 'You prefer solitude, but combined with low energy you risk complete withdrawal — isolation deepens fatigue.',
    action: 'Schedule one short, structured social study session per week. Even 30 minutes with one person breaks the isolation cycle.',
    visibleBehaviour: 'Withdraws, studies alone, seems flat or tired',
    misdiagnosis: 'Looks like introversion (which is fine), actually isolation + exhaustion',
    audience: 'all'
  },
  {
    id: 'rc-13',
    type: 'root_cause',
    personalityCondition: { facet: 'dependence', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'grit.perseverance.score', op: '<', threshold: 2.5 },
    insight: "You need emotional support to sustain effort, and when it's not there, you give up.",
    action: 'Identify your "study anchors" — 2-3 people you can turn to. Also build self-encouragement: write yourself a note for hard days.',
    visibleBehaviour: 'Starts strong then fades, gives up when alone',
    misdiagnosis: 'Looks like inconsistency, actually unmet emotional needs',
    audience: 'all'
  }
];

export const CONFIRMATION_RULES = [
  {
    id: 'cf-01',
    type: 'confirmation',
    personalityCondition: { facet: 'diligence', dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'grit.perseverance.score', op: '>=', threshold: 3.5 },
    insight: 'Both your personality and study data confirm: you follow through. When you commit, you deliver.',
    action: 'Set stretch goals — your follow-through can take you further than you think.',
    audience: 'all'
  },
  {
    id: 'cf-02',
    type: 'confirmation',
    personalityCondition: { facet: 'sentimentality', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.deep.score', op: '>=', threshold: 3.5 },
    insight: 'You connect emotionally with what you learn, and your study approach confirms you dig deep into meaning.',
    action: 'Use emotional connections as memory anchors — stories and feelings stick better than facts alone.',
    audience: 'all'
  },
  {
    id: 'cf-03',
    type: 'confirmation',
    personalityCondition: { dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.strategic.score', op: '>=', threshold: 3.5 },
    insight: 'Your conscientiousness drives strategic, organised study — personality and habits are aligned.',
    action: "You're naturally strategic. Experiment with more advanced planning tools (Notion, Anki) to level up further.",
    audience: 'all'
  },
  {
    id: 'cf-04',
    type: 'confirmation',
    personalityCondition: { dim: 'O', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.intrinsic.score', op: '>=', threshold: 3.5 },
    insight: 'Your natural curiosity is fuelling genuine motivation — you learn because you want to, not because you have to.',
    action: 'Feed your curiosity with extension material, podcasts, and documentaries beyond the syllabus.',
    audience: 'all'
  },
  {
    id: 'cf-05',
    type: 'confirmation',
    personalityCondition: { dim: 'H', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.identified.score', op: '>=', threshold: 3.5 },
    insight: 'Your strong values drive purposeful learning — you work hard because education matters to you, not just for grades.',
    action: 'Connect your values to specific goals. What kind of person do you want to become? Let that guide your effort.',
    audience: 'all'
  },
  {
    id: 'cf-06',
    type: 'confirmation',
    personalityCondition: { facet: 'patience', dim: 'A', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'grit.consistency.score', op: '>=', threshold: 3.5 },
    insight: 'You stick with goals over time. Your patience and consistency are a rare and powerful combination.',
    action: 'Take on long-term projects or competitions — your persistence is a genuine competitive advantage.',
    audience: 'all'
  },
  {
    id: 'cf-07',
    type: 'confirmation',
    personalityCondition: { facet: 'social_boldness', dim: 'X', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.selfEfficacy.score', op: '>=', threshold: 3.5 },
    insight: 'You believe in yourself and it shows — your social confidence extends into academic confidence.',
    action: 'Seek leadership opportunities: peer tutoring, study groups, class representative.',
    audience: 'all'
  },
  {
    id: 'cf-08',
    type: 'confirmation',
    personalityCondition: { facet: 'organisation', dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.planning.score', op: '>=', threshold: 3.5 },
    insight: 'You plan and you organise — your personality and study habits are perfectly aligned for academic success.',
    action: 'Offer to help classmates build their organisational systems. Teaching structure reinforces your own.',
    audience: 'all'
  },
  {
    id: 'cf-09',
    type: 'confirmation',
    personalityCondition: { facet: 'creativity', dim: 'O', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.deep.score', op: '>=', threshold: 3.5 },
    insight: "Your creative mind naturally goes deep — you don't just learn, you reimagine and connect ideas in original ways.",
    action: 'Seek subjects and projects that reward original thinking: design, research, creative writing.',
    audience: 'all'
  },
  {
    id: 'cf-10',
    type: 'confirmation',
    personalityCondition: { facet: 'anxiety', dim: 'E', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.selfEfficacy.score', op: '>=', threshold: 3.5 },
    insight: "You're calm under pressure AND confident — this combination lets you perform at your best when it matters most.",
    action: 'Trust your preparation. Your calm confidence is a genuine advantage in high-stakes situations like exams.',
    audience: 'all'
  }
];

export const CONTRADICTION_RULES = [
  {
    id: 'cx-01',
    type: 'contradiction',
    personalityCondition: { dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.surface.score', op: '>=', threshold: 3.0 },
    insight: "You have the discipline to study hard, but your approach is surface-level — effort without depth. You're working hard on the wrong things.",
    action: 'Switch from re-reading to active recall. Your discipline is a superpower once pointed in the right direction.',
    audience: 'all'
  },
  {
    id: 'cx-02',
    type: 'contradiction',
    personalityCondition: { dim: 'O', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.intrinsic.score', op: '<', threshold: 2.5 },
    insight: "You're naturally curious, but something has killed your intrinsic motivation. School isn't engaging your mind the way it should.",
    action: 'Find one subject that lights you up and pursue it beyond the syllabus. Reignite the spark in one area first.',
    audience: 'all'
  },
  {
    id: 'cx-03',
    type: 'contradiction',
    personalityCondition: { facet: 'diligence', dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'focus.procrastination.score', op: '>=', threshold: 3.0 },
    insight: "You work hard once you start, but starting is the problem. Your diligence is real — the delay is not laziness, it's a starting barrier.",
    action: 'Use the "2-minute rule" — commit to just 2 minutes of work. Your diligence will take over once you begin.',
    audience: 'all'
  },
  {
    id: 'cx-04',
    type: 'contradiction',
    personalityCondition: { facet: 'anxiety', dim: 'E', op: '<', threshold: 2.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.selfEfficacy.score', op: '<', threshold: 2.5 },
    insight: "You're calm but doubt yourself. You don't panic, but you don't believe in your abilities either.",
    action: 'Your calm is an asset — now build evidence of your competence. Track grades and wins to see the proof.',
    audience: 'all'
  },
  {
    id: 'cx-05',
    type: 'contradiction',
    personalityCondition: { facet: 'sociability', dim: 'X', op: '<', threshold: 2.5 },
    academicCondition: { source: 'learnerProfile', path: 'teacherPreference.warmth', op: '>=', threshold: 4.0 },
    insight: "You prefer solitude, but you crave warm, supportive teachers. You don't need lots of people, just the right ones.",
    action: 'Seek one-on-one mentoring rather than group activities. Quality connections over quantity.',
    audience: 'all'
  }
];

export const UNTAPPED_MAPPING = [
  {
    personalityCondition: { facet: 'diligence', dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'grit.perseverance.score', op: '<', threshold: 3.0 },
    untappedInsight: "Your strong work ethic isn't yet reflected in long-term follow-through — you work hard in bursts but may not sustain it across big projects.",
    untappedAction: 'Pick one long-term goal and track your progress weekly. Your diligence can become grit with deliberate practice.'
  },
  {
    personalityCondition: { facet: 'sentimentality', dim: 'E', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.deep.score', op: '<', threshold: 3.0 },
    untappedInsight: "You feel deeply but your study approach doesn't use that emotional depth — you're memorising when you could be connecting.",
    untappedAction: 'Before studying, ask "Why does this matter to people?" Connect the material to human stories.'
  },
  {
    personalityCondition: { dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.strategic.score', op: '<', threshold: 3.0 },
    untappedInsight: "You're disciplined but not strategic — you put in the effort without optimising how you study.",
    untappedAction: 'Learn about spaced repetition and active recall. Your discipline + better methods = dramatic improvement.'
  },
  {
    personalityCondition: { dim: 'O', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.intrinsic.score', op: '<', threshold: 3.0 },
    untappedInsight: "Your natural curiosity isn't translating into academic motivation yet — the spark is there but not activated.",
    untappedAction: "Explore one topic per week that genuinely fascinates you, even if it's not on the syllabus."
  },
  {
    personalityCondition: { dim: 'H', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'motivation.identified.score', op: '<', threshold: 3.0 },
    untappedInsight: "Your strong values haven't connected to your academic goals yet — you know what's right but haven't linked it to why school matters.",
    untappedAction: 'Write a personal mission statement connecting your values to your education. Why does learning matter to YOU?'
  },
  {
    personalityCondition: { facet: 'patience', dim: 'A', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'learnerProfile', path: 'grit.consistency.score', op: '<', threshold: 3.0 },
    untappedInsight: "You're patient but your interests shift frequently — you wait things out but don't always stick with the same goal.",
    untappedAction: 'Choose one academic goal for the term and resist switching. Your patience can become persistence.'
  },
  {
    personalityCondition: { facet: 'social_boldness', dim: 'X', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.selfEfficacy.score', op: '<', threshold: 3.0 },
    untappedInsight: "You speak up socially but doubt yourself academically — your confidence in groups doesn't extend to your studies yet.",
    untappedAction: "Transfer your social confidence to academics: present what you've learned to friends. Teaching builds mastery."
  },
  {
    personalityCondition: { facet: 'organisation', dim: 'C', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'selfRegulation.planning.score', op: '<', threshold: 3.0 },
    untappedInsight: "You keep things organised but don't actively plan your study — you're neat but not strategic.",
    untappedAction: 'Create a weekly study planner that assigns specific topics to specific time blocks. Structure your effort.'
  },
  {
    personalityCondition: { facet: 'creativity', dim: 'O', op: '>=', threshold: 3.5 },
    academicCondition: { source: 'studyProfile', path: 'studyApproaches.deep.score', op: '<', threshold: 3.0 },
    untappedInsight: "You have a creative mind but your learning stays on the surface — you could go much deeper if you engaged your imagination.",
    untappedAction: "Try mind-mapping or concept art for your notes. Your creative brain encodes information differently when it's visual."
  }
];

export const ALL_RULES = [...ROOT_CAUSE_RULES, ...CONFIRMATION_RULES, ...CONTRADICTION_RULES];
