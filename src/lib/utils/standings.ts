import type { StandingEntry, StandingTable } from "../api/types";

// WC 2026: top 2 from each group + best 8 of 12 third-place teams advance
export function getBestThirdPlace(
  groups: StandingTable[]
): StandingEntry[] {
  const thirds: StandingEntry[] = groups
    .map((g) => g.table[2])
    .filter(Boolean);

  return thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

export function getQualifiedThirdPlace(groups: StandingTable[]): Set<number> {
  const best8 = getBestThirdPlace(groups).slice(0, 8);
  return new Set(best8.map((e) => e.team.id));
}

export function getQualificationStatus(
  entry: StandingEntry,
  position: number,
  qualifiedThirds: Set<number>
): "qualified" | "possible" | "eliminated" | "none" {
  if (position <= 2) return "qualified";
  if (position === 3 && qualifiedThirds.has(entry.team.id)) return "possible";
  return "none";
}

export function formatGroupLabel(group?: string): string {
  if (!group) return "";
  // "GROUP_A" → "Group A"
  return group
    .replace("GROUP_", "Group ")
    .replace(/_/g, " ");
}
