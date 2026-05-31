export function formatMatchDate(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatMatchTime(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }) + " UTC";
}

export function formatMatchDateTime(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }) + " UTC";
}

export function groupMatchesByDate(
  matches: { utcDate: string }[]
): Record<string, number> {
  const groups: Record<string, number> = {};
  for (const m of matches) {
    const key = m.utcDate.slice(0, 10);
    groups[key] = (groups[key] ?? 0) + 1;
  }
  return groups;
}

export function isToday(utcDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return utcDate.slice(0, 10) === today;
}
