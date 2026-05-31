import type { Match, Team } from "@/lib/api/types";

export const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: "Group Stage",
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-Final",
  SEMI_FINALS: "Semi-Final",
  THIRD_PLACE: "Third Place",
  FINAL: "Final",
};

export function teamName(team?: Team | null): string {
  return team?.shortName || team?.name || team?.tla || "TBD";
}

export function teamCode(team?: Team | null): string | undefined {
  return team?.area?.code ?? team?.tla ?? undefined;
}

export function teamId(team?: Team | null): number | null {
  return typeof team?.id === "number" ? team.id : null;
}

export function isKnownTeam(team?: Team | null): boolean {
  return teamId(team) !== null && Boolean(teamName(team) !== "TBD");
}

export function matchStageLabel(match: Match): string {
  if (match.group) return match.group.replace("GROUP_", "Group ");
  return STAGE_LABELS[match.stage] ?? match.stage.replace(/_/g, " ");
}

export function matchContextLabel(match: Match): string {
  const parts = [matchStageLabel(match)];
  if (match.matchday) parts.push(`Matchday ${match.matchday}`);
  return parts.join(" / ");
}

export function matchTitle(match: Match): string {
  return `${teamName(match.homeTeam)} vs ${teamName(match.awayTeam)}`;
}
