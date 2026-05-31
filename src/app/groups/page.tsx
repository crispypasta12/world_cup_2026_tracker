import { getStandings } from "@/lib/api/client";
import GroupTable from "@/components/groups/GroupTable";
import { getQualifiedThirdPlace } from "@/lib/utils/standings";

export const revalidate = 120;

export const metadata = {
  title: "Group Standings | WC 2026",
};

export default async function GroupsPage() {
  let standings;
  try {
    standings = await getStandings();
  } catch {
    return (
      <div className="text-center text-slate-500 py-16">
        Failed to load standings. Check your API key.
      </div>
    );
  }

  const groups = standings.standings.filter((s) => s.type === "TOTAL");
  const qualifiedThirds = getQualifiedThirdPlace(groups);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Group Standings</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Top 2 from each group + best 8 third-place teams advance to the Round of 32.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
          Qualified
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block" />
          Best 3rd place
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((g) => (
          <GroupTable key={g.group ?? g.stage} group={g} qualifiedThirds={qualifiedThirds} />
        ))}
      </div>
    </div>
  );
}
