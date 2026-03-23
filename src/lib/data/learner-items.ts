import type { QuizItem } from "../types";

export const learnerItems: QuizItem[] = [
  // ─── Domain 4: Grit & Resilience (IDs 91-96) — Grit-S ──────────

  // Perseverance of effort (3 items)
  { id: 91, text: 'I finish whatever I begin, even when it gets really hard.', domain: 'grit', subscale: 'perseverance', reverse: false },
  { id: 92, text: "When things go wrong, I don't get too down about it. I bounce back quickly.", domain: 'grit', subscale: 'perseverance', reverse: false },
  { id: 93, text: 'I am a hard worker. I keep going when others would stop.', domain: 'grit', subscale: 'perseverance', reverse: false },

  // Consistency of interest (3 items, all reverse)
  { id: 94, text: 'I often set a goal but later choose to pursue a different one instead.', domain: 'grit', subscale: 'consistency', reverse: true },
  { id: 95, text: 'I find it hard to stay focused on projects that take more than a few weeks.', domain: 'grit', subscale: 'consistency', reverse: true },
  { id: 96, text: 'I sometimes get really into an idea or project but then quickly lose interest.', domain: 'grit', subscale: 'consistency', reverse: true },

  // ─── Domain 5: Focus & Procrastination (IDs 97-102) — ASRS + APS-S ─

  // Focus/concentration (3 items)
  { id: 97, text: 'I get easily distracted by my phone, social media, or other things when studying.', domain: 'focus', subscale: 'concentration', reverse: true },
  { id: 98, text: "I can concentrate on schoolwork for long stretches without my mind wandering.", domain: 'focus', subscale: 'concentration', reverse: false },
  { id: 99, text: 'Noise or activity around me makes it hard to focus on my work.', domain: 'focus', subscale: 'concentration', reverse: true },

  // Procrastination (3 items, all reverse)
  { id: 100, text: "I put off starting assignments even when I know they're important.", domain: 'focus', subscale: 'procrastination', reverse: true },
  { id: 101, text: 'I wait until the last minute to start studying for tests.', domain: 'focus', subscale: 'procrastination', reverse: true },
  { id: 102, text: 'I often plan to study but end up doing something else instead.', domain: 'focus', subscale: 'procrastination', reverse: true },

  // ─── Domain 6: Energy & Stamina (IDs 103-106) — SVS ────────────

  // Vitality (2 items)
  { id: 103, text: 'I generally feel full of energy during the school day.', domain: 'energy', subscale: 'vitality', reverse: false },
  { id: 104, text: "I feel alive and alert when I'm learning something new.", domain: 'energy', subscale: 'vitality', reverse: false },

  // Depletion (2 items, reverse)
  { id: 105, text: 'I often feel too tired or drained to study properly.', domain: 'energy', subscale: 'depletion', reverse: true },
  { id: 106, text: 'By the end of the school day, I have no energy left for homework.', domain: 'energy', subscale: 'depletion', reverse: true },

  // ─── Domain 7: Subject Passion & Confidence (IDs 107-112) — TIMSS ──

  // Maths
  { id: 107, text: 'I enjoy maths and find it satisfying to solve problems.', domain: 'subjectFit', subscale: 'mathsPassion', reverse: false },
  { id: 108, text: 'I believe I can do well in maths if I put in the effort.', domain: 'subjectFit', subscale: 'mathsConfidence', reverse: false },

  // English
  { id: 109, text: 'I enjoy reading, writing, and working with language.', domain: 'subjectFit', subscale: 'englishPassion', reverse: false },
  { id: 110, text: 'I believe I can do well in English if I put in the effort.', domain: 'subjectFit', subscale: 'englishConfidence', reverse: false },

  // Science
  { id: 111, text: 'I find science and technology fascinating.', domain: 'subjectFit', subscale: 'sciencePassion', reverse: false },
  { id: 112, text: 'I believe I can do well in science subjects if I put in the effort.', domain: 'subjectFit', subscale: 'scienceConfidence', reverse: false },

  // ─── Domain 8: Teacher & Response Preference (IDs 113-116) — Custom ─

  { id: 113, text: 'I prefer teachers who are strict and have clear, high expectations.', domain: 'teacherPreference', subscale: 'structure', reverse: false },
  { id: 114, text: 'I learn better when my teacher is warm, friendly, and encouraging.', domain: 'teacherPreference', subscale: 'warmth', reverse: false },
  { id: 115, text: "I work harder when someone believes in me and tells me I'm doing well.", domain: 'teacherPreference', subscale: 'carrot', reverse: false },
  { id: 116, text: 'I work harder when there are clear consequences for not performing.', domain: 'teacherPreference', subscale: 'stick', reverse: false },

  // ─── Domain 9: Exam Barriers (IDs 117-120) — MMCS attribution ──────

  { id: 117, text: "When I do badly on a test, it's usually because I didn't prepare well enough.", domain: 'examBarriers', subscale: 'preparation', reverse: false },
  { id: 118, text: "When I do badly on a test, it's usually because the test was unfair or too hard.", domain: 'examBarriers', subscale: 'external', reverse: false },
  { id: 119, text: 'Exam nerves are the main thing holding back my results.', domain: 'examBarriers', subscale: 'anxiety', reverse: false },
  { id: 120, text: "I often run out of time in exams because I don't manage my time well.", domain: 'examBarriers', subscale: 'timeManagement', reverse: false },
];

export const learnerItemMap: Record<number, QuizItem> = Object.fromEntries(
  learnerItems.map((i) => [i.id, i])
);
