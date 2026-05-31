export function formatMatchDate(utcDate: string, timezone = "UTC"): string {
  return new Date(utcDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  });
}

export function formatMatchTime(utcDate: string, timezone = "UTC"): string {
  const date = new Date(utcDate);
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
  if (timezone === "UTC") return timeStr + " UTC";
  try {
    const abbr = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
    return `${timeStr} ${abbr}`;
  } catch {
    return timeStr;
  }
}

export function formatMatchDateTime(utcDate: string, timezone = "UTC"): string {
  const date = new Date(utcDate);
  const base = date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
  if (timezone === "UTC") return base + " UTC";
  try {
    const abbr = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
    return `${base} ${abbr}`;
  } catch {
    return base;
  }
}

export function getLocalDateKey(utcDate: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(utcDate));
  } catch {
    return utcDate.slice(0, 10);
  }
}

export function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
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
