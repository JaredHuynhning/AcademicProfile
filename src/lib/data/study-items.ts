import type { QuizItem } from "../types";

export const studyItems: QuizItem[] = [
  // ─── Domain 1: Study Approaches (IDs 61-70) ────────────────────────

  // Deep approach (4 items)
  { id: 61, text: "When I study, I try to understand the meaning behind what I'm learning, not just memorise facts.", domain: 'studyApproaches', subscale: 'deep', reverse: false },
  { id: 62, text: 'I like to connect new ideas to things I already know from other subjects or experiences.', domain: 'studyApproaches', subscale: 'deep', reverse: false },
  { id: 63, text: 'I like to find proof or examples before I believe something is true.', domain: 'studyApproaches', subscale: 'deep', reverse: false },
  { id: 64, text: "I find myself thinking about schoolwork even when I'm not studying, because the ideas interest me.", domain: 'studyApproaches', subscale: 'deep', reverse: false },

  // Strategic approach (3 items)
  { id: 65, text: 'I organise my study time carefully to make sure I cover everything I need to.', domain: 'studyApproaches', subscale: 'strategic', reverse: false },
  { id: 66, text: 'I check whether the way I study is actually working and change it if not.', domain: 'studyApproaches', subscale: 'strategic', reverse: false },
  { id: 67, text: 'I pay attention to what teachers emphasise so I can focus on the most important topics.', domain: 'studyApproaches', subscale: 'strategic', reverse: false },

  // Surface approach (3 items)
  { id: 68, text: 'I often memorise things without really understanding what they mean.', domain: 'studyApproaches', subscale: 'surface', reverse: false },
  { id: 69, text: "I only study what's required for the test. Nothing more.", domain: 'studyApproaches', subscale: 'surface', reverse: false },
  { id: 70, text: 'I find it hard to see the point of a lot of what we have to learn at school.', domain: 'studyApproaches', subscale: 'surface', reverse: false },

  // ─── Domain 2: Motivation Type (IDs 71-80) ─────────────────────────

  // Intrinsic motivation (3 items)
  { id: 71, text: 'I enjoy learning new things at school because they genuinely interest me.', domain: 'motivation', subscale: 'intrinsic', reverse: false },
  { id: 72, text: 'I get a real sense of satisfaction when I finally understand something difficult.', domain: 'motivation', subscale: 'intrinsic', reverse: false },
  { id: 73, text: "I study because I'm curious and want to discover new things.", domain: 'motivation', subscale: 'intrinsic', reverse: false },

  // Identified regulation (2 items)
  { id: 74, text: 'I work hard at school because I know education will help me reach my future goals.', domain: 'motivation', subscale: 'identified', reverse: false },
  { id: 75, text: "Even when a subject is boring, I still try because I know it's important for my future.", domain: 'motivation', subscale: 'identified', reverse: false },

  // External regulation (2 items)
  { id: 76, text: 'I mainly study to get good grades and avoid getting in trouble.', domain: 'motivation', subscale: 'external', reverse: false },
  { id: 77, text: "I work harder when there's a reward involved, like praise or prizes.", domain: 'motivation', subscale: 'external', reverse: false },

  // Amotivation (3 items)
  { id: 78, text: "Honestly, I'm not sure why I go to school. I don't see what I get out of it.", domain: 'motivation', subscale: 'amotivation', reverse: false },
  { id: 79, text: "I feel like no matter how much I study, it won't make a difference.", domain: 'motivation', subscale: 'amotivation', reverse: false },
  { id: 80, text: "I can't be bothered putting effort into schoolwork most of the time.", domain: 'motivation', subscale: 'amotivation', reverse: false },

  // ─── Domain 3: Self-Regulation (IDs 81-90) ─────────────────────────

  // Self-efficacy (2 items)
  { id: 81, text: 'I believe I can do well in my subjects if I put in enough effort.', domain: 'selfRegulation', subscale: 'selfEfficacy', reverse: false },
  { id: 82, text: "Even when work is challenging, I'm confident I can figure it out.", domain: 'selfRegulation', subscale: 'selfEfficacy', reverse: false },

  // Planning (2 items)
  { id: 83, text: 'Before starting an assignment, I think about what I need to do and make a plan.', domain: 'selfRegulation', subscale: 'planning', reverse: false },
  { id: 84, text: 'I set specific goals for what I want to achieve in each study session.', domain: 'selfRegulation', subscale: 'planning', reverse: false },

  // Effort regulation (2 items)
  { id: 85, text: 'I keep working even when the material is boring or difficult.', domain: 'selfRegulation', subscale: 'effortRegulation', reverse: false },
  { id: 86, text: 'When I feel like giving up on schoolwork, I push myself to keep going.', domain: 'selfRegulation', subscale: 'effortRegulation', reverse: false },

  // Test anxiety (2 items) — reverse-scored so high = LESS anxious
  { id: 87, text: "I get so nervous before tests that I can't think clearly.", domain: 'selfRegulation', subscale: 'testAnxiety', reverse: true },
  { id: 88, text: "I worry a lot about doing badly on exams, even when I've studied.", domain: 'selfRegulation', subscale: 'testAnxiety', reverse: true },

  // Help-seeking (2 items)
  { id: 89, text: "When I don't understand something, I ask a teacher or classmate for help.", domain: 'selfRegulation', subscale: 'helpSeeking', reverse: false },
  { id: 90, text: "I don't mind admitting when I'm stuck and asking for help.", domain: 'selfRegulation', subscale: 'helpSeeking', reverse: false },
];

export const studyItemMap: Record<number, QuizItem> = Object.fromEntries(
  studyItems.map((i) => [i.id, i])
);
