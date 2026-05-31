import type { StandingEntry, StandingTable } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Link from "next/link";

interface GroupTableProps {
  group: StandingTable;
  qualifiedThirds?: Set<number>;
}

function rowStyle(
  pos: number,
  teamId: number,
  qualifiedThirds?: Set<number>
): string {
  if (pos <= 2) return "border-l-2 border-l-green-500";
  if (pos === 3 && qualifiedThirds?.has(teamId)) return "border-l-2 border-l-yellow-500";
  return "border-l-2 border-l-transparent";
}

export default function GroupTable({ group, qualifiedThirds }: GroupTableProps) {
  const label = group.group?.replace("GROUP_", "Group ") ?? group.stage;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-slate-750 border-b border-slate-700">
        <h3 className="font-semibold text-white text-sm">{label}</h3>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-2 text-left w-6">#</th>
            <th className="px-4 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">D</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="px-2 py-2 text-center">GD</th>
            <th className="px-2 py-2 text-center font-bold text-slate-400">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.table.map((entry: StandingEntry) => (
            <tr
              key={entry.team.id}
              className={`border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors ${rowStyle(entry.position, entry.team.id, qualifiedThirds)}`}
            >
              <td className="px-4 py-2.5 text-slate-500 text-xs">{entry.position}</td>
              <td className="px-4 py-2.5">
                <Link
                  href={`/teams/${entry.team.id}`}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Flag
                    countryCode={entry.team.area?.code ?? entry.team.tla}
                    name={entry.team.name}
                    size="sm"
                  />
                  <span className="text-white font-medium">{entry.team.shortName || entry.team.name}</span>
                </Link>
              </td>
              <td className="px-2 py-2.5 text-center text-slate-300">{entry.playedGames}</td>
              <td className="px-2 py-2.5 text-center text-slate-300">{entry.won}</td>
              <td className="px-2 py-2.5 text-center text-slate-300">{entry.draw}</td>
              <td className="px-2 py-2.5 text-center text-slate-300">{entry.lost}</td>
              <td className="px-2 py-2.5 text-center text-slate-300">
                {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
              </td>
              <td className="px-2 py-2.5 text-center font-bold text-white">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
