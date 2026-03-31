import type { DimensionsMap } from './helpers';

export interface InteractionInsight {
  label: string;
  insight: string;
  action: string;
  audience: 'teacher' | 'parent' | 'student';
  impact: number;
  dims: [string, string];
}

interface InteractionRule {
  dims: [string, string];
  label: string;
  condition: (dims: DimensionsMap) => boolean;
  insight: (name: string) => string;
  action: (name: string) => string;
  audience: 'teacher' | 'parent' | 'student';
  impact: number;
}

const RULES: InteractionRule[] = [
  {
    dims: ['C', 'X'],
    label: 'The Silent Perfectionist',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.X?.score ?? 3) < 2.5,
    insight: (n) => `${n} works extremely hard but will never ask for help, volunteer answers, or admit they're struggling. High conscientiousness paired with low extraversion creates a student who suffers in silence — teachers see a diligent worker and assume everything is fine. It isn't.`,
    action: (n) => `Create a private channel — email, journal, or 1:1 check-ins — for ${n} to flag struggles without public exposure.`,
    audience: 'teacher',
    impact: 9,
  },
  {
    dims: ['C', 'E'],
    label: 'The Anxious Achiever',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.E?.score ?? 3) >= 3.5,
    insight: (n) => `${n} prepares more thoroughly than almost anyone in the class, yet still experiences intense anxiety before assessments. This isn't under-preparation — it's a personality-driven feedback loop where high standards (conscientiousness) fuel fear of falling short (emotionality).`,
    action: (n) => `Help ${n} separate preparation quality from emotional readiness. Pre-exam routine: "I have done the work. My feelings are not facts about my preparation."`,
    audience: 'parent',
    impact: 9,
  },
  {
    dims: ['O', 'C'],
    label: 'The Brilliant Drifter',
    condition: (d) => (d.O?.score ?? 3) >= 3.5 && (d.C?.score ?? 3) < 2.5,
    insight: (n) => `${n} is full of ideas — genuinely creative and intellectually curious — but can't finish anything. High openness generates constant new interests while low conscientiousness means no follow-through. The result: a trail of abandoned projects and half-written essays.`,
    action: (n) => `Give ${n} a "one project at a time" rule. Before starting anything new, the current project must reach a defined checkpoint. Use a visible tracker.`,
    audience: 'parent',
    impact: 8,
  },
  {
    dims: ['X', 'E'],
    label: 'The Internal Storm',
    condition: (d) => (d.X?.score ?? 3) < 2.5 && (d.E?.score ?? 3) >= 3.5,
    insight: (n) => `${n} experiences strong emotions but has no outlet for them. Low extraversion means they won't talk about what's bothering them, while high emotionality means there's a lot to talk about. Teachers see a quiet student; inside, there's a storm.`,
    action: (n) => `Offer ${n} written emotional outlets: journals, reflection prompts, or anonymous check-in forms. Don't force verbal disclosure.`,
    audience: 'teacher',
    impact: 8,
  },
  {
    dims: ['C', 'E'],
    label: 'The Unbothered Underperformer',
    condition: (d) => (d.C?.score ?? 3) < 2.5 && (d.E?.score ?? 3) < 2.5,
    insight: (n) => `${n} doesn't try hard AND doesn't feel bad about it. Low conscientiousness means inconsistent effort, and low emotionality means there's no internal distress driving change. This is the hardest profile to motivate because the usual levers (guilt, anxiety, desire to please) don't apply.`,
    action: (n) => `Find ${n}'s genuine interests — the thing they'd do without being asked — and connect academic tasks to those interests. External motivation won't work; intrinsic is the only path.`,
    audience: 'parent',
    impact: 8,
  },
  {
    dims: ['E', 'C'],
    label: 'The Emotional Procrastinator',
    condition: (d) => (d.E?.score ?? 3) >= 3.5 && (d.C?.score ?? 3) < 2.5,
    insight: (n) => `${n} feels overwhelmed by tasks and responds by avoiding them entirely. High emotionality amplifies the stress of deadlines while low conscientiousness removes the internal structure to push through. The result: paralysis disguised as laziness.`,
    action: (n) => `Break tasks into tiny steps (5-minute chunks) and validate ${n}'s feelings before discussing the work: "I know this feels like a lot. Let's just do the first paragraph."`,
    audience: 'parent',
    impact: 8,
  },
  {
    dims: ['X', 'A'],
    label: 'The Dominant Debater',
    condition: (d) => (d.X?.score ?? 3) >= 3.5 && (d.A?.score ?? 3) < 2.5,
    insight: (n) => `${n} is socially confident and intellectually combative — a powerful combination in debates but a destructive one in group projects. They'll challenge ideas forcefully and may not notice when they've crossed from productive to personal.`,
    action: (n) => `Teach ${n} the "steel man" technique: before arguing against an idea, they must first state it in its strongest form. This channels critical thinking without alienating peers.`,
    audience: 'teacher',
    impact: 7,
  },
  {
    dims: ['O', 'X'],
    label: 'The Idea Generator',
    condition: (d) => (d.O?.score ?? 3) >= 3.5 && (d.X?.score ?? 3) >= 3.5,
    insight: (n) => `${n} is both creative and socially energised — the student who lights up brainstorming sessions and pulls others into ambitious projects. This is a genuine superpower for collaborative and creative work.`,
    action: (n) => `Give ${n} leadership roles in creative projects. They thrive when they can ideate AND rally a team around the vision.`,
    audience: 'student',
    impact: 7,
  },
  {
    dims: ['O', 'E'],
    label: 'The Sensitive Creator',
    condition: (d) => (d.O?.score ?? 3) >= 3.5 && (d.E?.score ?? 3) >= 3.5,
    insight: (n) => `${n} channels emotional depth into creative expression — producing work that is original, personal, and sometimes raw. This combination drives exceptional creative writing, art, and humanities work, but also means criticism of their work feels like criticism of them.`,
    action: (n) => `Separate craft feedback from personal feedback: "Your technique here is strong. This paragraph could be tighter — here's how." Never: "This doesn't work."`,
    audience: 'student',
    impact: 7,
  },
  {
    dims: ['H', 'X'],
    label: 'The Social Manipulator',
    condition: (d) => (d.H?.score ?? 3) < 2.5 && (d.X?.score ?? 3) >= 3.5,
    insight: (n) => `${n} is charming and socially skilled but may use those skills strategically rather than authentically. Low honesty-humility paired with high extraversion creates someone who can navigate social situations masterfully — and may sometimes manipulate them.`,
    action: (n) => `Channel ${n}'s social intelligence into leadership roles with accountability structures. They'll thrive with responsibility IF there are clear ethical boundaries.`,
    audience: 'parent',
    impact: 7,
  },
  {
    dims: ['C', 'O'],
    label: 'The Curious Organiser',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.O?.score ?? 3) >= 3.5,
    insight: (n) => `${n} is that rare combination: genuinely curious AND methodically organised. They don't just explore ideas — they catalogue them, build on them, and turn them into finished products. This is the profile of future researchers and innovators.`,
    action: (n) => `Give ${n} independent research projects with structure. They'll go deep AND deliver on time.`,
    audience: 'student',
    impact: 7,
  },
  {
    dims: ['H', 'C'],
    label: 'The Principled Worker',
    condition: (d) => (d.H?.score ?? 3) >= 3.5 && (d.C?.score ?? 3) >= 3.5,
    insight: (n) => `${n} combines honesty with diligence — the student teachers trust implicitly with responsibilities. They won't cut corners, won't copy others' work, and will do what they said they'd do.`,
    action: (n) => `Leverage ${n}'s reliability by giving them meaningful responsibilities (peer tutoring, project coordination). They thrive when trusted.`,
    audience: 'teacher',
    impact: 6,
  },
  {
    dims: ['A', 'X'],
    label: 'The Quiet Supporter',
    condition: (d) => (d.A?.score ?? 3) >= 3.5 && (d.X?.score ?? 3) < 2.5,
    insight: (n) => `${n} is deeply cooperative but socially reserved — the student who does more than their share in group work but never gets credit because they don't speak up. Teachers may overlook their contributions entirely.`,
    action: (n) => `Explicitly acknowledge ${n}'s contributions in group settings. Ask for their input directly: "What do you think about this approach?"`,
    audience: 'teacher',
    impact: 6,
  },
  {
    dims: ['X', 'A'],
    label: 'The Lone Wolf',
    condition: (d) => (d.X?.score ?? 3) < 2.5 && (d.A?.score ?? 3) < 2.5,
    insight: (n) => `${n} prefers working alone and doesn't naturally defer to group norms. This isn't anti-social — it's a genuine preference for independence combined with intellectual directness. Forced group work is genuinely painful, not laziness.`,
    action: (n) => `Where possible, offer solo alternatives to group assignments. When groups are required, give ${n} a defined individual role within the team.`,
    audience: 'teacher',
    impact: 6,
  },
  {
    dims: ['C', 'O'],
    label: 'The Reliable Executor',
    condition: (d) => (d.C?.score ?? 3) >= 3.5 && (d.O?.score ?? 3) < 2.5,
    insight: (n) => `${n} gets things done efficiently and reliably — but rarely exceeds the brief. High conscientiousness ensures completion; low openness means they stick to what's asked. They'll deliver exactly what the rubric requires, no more.`,
    action: (n) => `Occasionally set open-ended assignments that reward going beyond the minimum. ${n} has the discipline to execute ambitious work — they just need permission to try.`,
    audience: 'teacher',
    impact: 5,
  },
];

export function detectDimensionInteractions(
  dims: DimensionsMap,
  studentName: string,
): InteractionInsight[] {
  const fired: InteractionInsight[] = [];

  for (const rule of RULES) {
    if (rule.condition(dims)) {
      fired.push({
        label: rule.label,
        insight: rule.insight(studentName),
        action: rule.action(studentName),
        audience: rule.audience,
        impact: rule.impact,
        dims: rule.dims,
      });
    }
  }

  if (fired.length === 0) {
    fired.push({
      label: 'Balanced Profile',
      insight: `${studentName}'s personality profile is notably well-balanced — no single dimension dominates or creates friction with another. This is rare and valuable: ${studentName} can adapt to most academic situations without personality-driven obstacles getting in the way.`,
      action: `Focus on developing ${studentName}'s existing interests rather than compensating for weaknesses. A balanced profile responds well to challenge and variety.`,
      audience: 'parent',
      impact: 5,
      dims: ['balanced', 'balanced'],
    });
  }

  return fired.sort((a, b) => b.impact - a.impact);
}
