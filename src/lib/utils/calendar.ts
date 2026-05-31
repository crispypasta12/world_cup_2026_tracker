import type { Match } from "@/lib/api/types";

const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: "Group Stage",
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-Final",
  SEMI_FINALS: "Semi-Final",
  THIRD_PLACE: "Third Place",
  FINAL: "Final",
};

function toICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function matchSummary(match: Match): string {
  const home = match.homeTeam.shortName || match.homeTeam.tla;
  const away = match.awayTeam.shortName || match.awayTeam.tla;
  return `${home} vs ${away}`;
}

function matchDescription(match: Match): string {
  let desc = "FIFA World Cup 2026";
  if (match.group) {
    desc += ` · ${match.group.replace("GROUP_", "Group ")}`;
    if (match.matchday) desc += ` · Matchday ${match.matchday}`;
  } else {
    const stage = STAGE_LABELS[match.stage];
    if (stage) desc += ` · ${stage}`;
  }
  return desc;
}

function matchToVEvent(match: Match): string {
  const start = new Date(match.utcDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const lines = [
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(matchSummary(match))}`,
    `DESCRIPTION:${escapeICS(matchDescription(match))}`,
    ...(match.venue ? [`LOCATION:${escapeICS(match.venue)}`] : []),
    `UID:wc2026-match-${match.id}@wc2026tracker`,
    "END:VEVENT",
  ];

  return lines.join("\r\n");
}

export function generateICS(matches: Match[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WC 2026 Tracker//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...matches.map(matchToVEvent),
    "END:VCALENDAR",
  ].join("\r\n");
}

export function getGoogleCalendarUrl(match: Match): string {
  const start = new Date(match.utcDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${matchSummary(match)} — FIFA World Cup 2026`,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    details: matchDescription(match),
  });

  if (match.venue) params.set("location", match.venue);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICS(matches: Match[], filename = "wc2026.ics"): void {
  const content = generateICS(matches);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
