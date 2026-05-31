import { getTeams, getStandings } from "@/lib/api/client";
import TeamCard from "@/components/teams/TeamCard";

export const revalidate = 3600;

export const metadata = {
  title: "Teams | WC 2026",
};

export default async function TeamsPage() {
  let teams;
  const groupMap: Record<number, string> = {};

  try {
    const [teamsData, standingsData] = await Promise.all([
      getTeams(),
      getStandings(),
    ]);
    teams = teamsData;

    // Build team id → group label map
    for (const group of standingsData.standings) {
      const label = group.group?.replace("GROUP_", "Group ") ?? "";
      for (const entry of group.table) {
        groupMap[entry.team.id] = label;
      }
    }
  } catch {
    return (
      <div className="text-center text-slate-500 py-16">
        Failed to load teams. Check your API key.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Teams</h1>
        <p className="text-slate-400 mt-1 text-sm">
          All {teams.length} qualified nations.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            groupLabel={groupMap[team.id]}
          />
        ))}
      </div>
    </div>
  );
}
