import { describe, it, expect } from 'vitest';
import { parseTopAction, parseQuickWin, parseStopDoing, parseWeeklyRhythm } from '@/lib/report/action-sheet-parser';

describe('parseTopAction', () => {
  it('extracts action and why from a standard description', () => {
    const desc = 'Priority 1: Set up a structured note system. Why: Your low organisation connects to scattered study patterns. This connects your organisation (Conscientiousness) personality trait to your study-method study pattern. Addressing this first will have the biggest impact on your academic performance.';
    const result = parseTopAction(desc);
    expect(result.action).toBe('Set up a structured note system');
    expect(result.why).toContain('Your low organisation connects to scattered study patterns');
  });

  it('handles description without Why: prefix', () => {
    const desc = 'Priority 2: Study with a peer after school. This connects your extraversion personality trait to social learning.';
    const result = parseTopAction(desc);
    expect(result.action).toBe('Study with a peer after school');
    expect(result.why).toBeTruthy();
  });
});

describe('parseQuickWin', () => {
  it('extracts action from quick win description', () => {
    const desc = 'Use teach-back method with a friend. This builds on a confirmed strength: Your openness drives curiosity-based learning.';
    const result = parseQuickWin(desc);
    expect(result.action).toBe('Use teach-back method with a friend');
  });
});

describe('parseStopDoing', () => {
  it('extracts stop and instead from Stop: format', () => {
    const desc = 'Stop: Re-reading without testing yourself. Instead: Close notes and force recall. This change addresses the root cause rather than just the symptom.';
    const result = parseStopDoing(desc);
    expect(result.stop).toBe('Re-reading without testing yourself');
    expect(result.instead).toContain('Close notes and force recall');
  });

  it('extracts watchFor and rootCause from Watch for: format', () => {
    const desc = 'Watch for: Cramming the night before exams. Root cause: Surface approach leads to last-minute panic. Space your study across 4 weeks.';
    const result = parseStopDoing(desc);
    expect(result.stop).toBe('Cramming the night before exams');
    expect(result.instead).toBeTruthy();
  });
});

describe('parseWeeklyRhythm', () => {
  it('splits weekday and weekend from description', () => {
    const desc = 'After school: 30-45 min study with a peer or group. Evening: 45-60 min independent focused review. Saturday: deep-dive one topic — read beyond the notes, ask questions. Sunday: light review + plan the coming week. Consistency matters more than duration. Three 30-minute sessions beat one 3-hour cramming session every time.';
    const result = parseWeeklyRhythm(desc);
    expect(result.weekday).toContain('After school');
    expect(result.weekend).toContain('Saturday');
    expect(result.closing).toContain('Consistency');
  });
});
