export interface ParsedTopAction {
  action: string;
  why: string;
}

export interface ParsedQuickWin {
  action: string;
}

export interface ParsedStopDoing {
  stop: string;
  instead: string;
}

export interface ParsedWeeklyRhythm {
  weekday: string;
  weekend: string;
  closing: string;
}

export function parseTopAction(description: string): ParsedTopAction {
  const withoutPrefix = description.replace(/^Priority \d+:\s*/, '');
  const whyIndex = withoutPrefix.indexOf('. Why: ');
  if (whyIndex !== -1) {
    const action = withoutPrefix.slice(0, whyIndex);
    const rest = withoutPrefix.slice(whyIndex + 7);
    const connectsIndex = rest.indexOf('. This connects');
    const why = connectsIndex !== -1 ? rest.slice(0, connectsIndex) : rest.split('. ')[0];
    return { action, why };
  }
  const firstDot = withoutPrefix.indexOf('. ');
  if (firstDot !== -1) {
    return { action: withoutPrefix.slice(0, firstDot), why: withoutPrefix.slice(firstDot + 2) };
  }
  return { action: withoutPrefix, why: '' };
}

export function parseQuickWin(description: string): ParsedQuickWin {
  const marker = '. This builds on';
  const idx = description.indexOf(marker);
  const action = idx !== -1 ? description.slice(0, idx) : description.split('. ')[0];
  return { action };
}

export function parseStopDoing(description: string): ParsedStopDoing {
  const stopMatch = description.match(/^Stop:\s*(.+?)\.\s*Instead:\s*(.+?)(?:\.\s*This change|$)/);
  if (stopMatch) {
    return { stop: stopMatch[1], instead: stopMatch[2] };
  }
  const watchMatch = description.match(/^Watch for:\s*(.+?)\.\s*Root cause:\s*(.+?)\.?\s*(.*)/);
  if (watchMatch) {
    const instead = watchMatch[3] || watchMatch[2];
    return { stop: watchMatch[1], instead };
  }
  const firstDot = description.indexOf('. ');
  if (firstDot !== -1) {
    return { stop: description.slice(0, firstDot), instead: description.slice(firstDot + 2) };
  }
  return { stop: description, instead: '' };
}

export function parseWeeklyRhythm(description: string): ParsedWeeklyRhythm {
  const satIndex = description.indexOf('Saturday:');
  const sunIndex = description.indexOf('Sunday:');
  const weekendStart = satIndex !== -1 ? satIndex : sunIndex;
  const closingIndex = description.indexOf('Consistency');
  if (weekendStart !== -1 && closingIndex !== -1) {
    return {
      weekday: description.slice(0, weekendStart).trim(),
      weekend: description.slice(weekendStart, closingIndex).trim(),
      closing: description.slice(closingIndex).trim(),
    };
  }
  if (weekendStart !== -1) {
    return { weekday: description.slice(0, weekendStart).trim(), weekend: description.slice(weekendStart).trim(), closing: '' };
  }
  return { weekday: description, weekend: '', closing: '' };
}
