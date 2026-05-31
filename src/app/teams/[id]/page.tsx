import { getTeam, getTeamMatches } from "@/lib/api/client";
import Flag from "@/components/ui/Flag";
import MatchList from "@/components/matches/MatchList";
import { notFound } from "next/navigation";

export const revalidate = 120;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeamPage({ params }: Props) {
  const { id } = await params;
  const teamId = Number(id);

  if (isNaN(teamId)) notFound();

  let team, matches;
  try {
    [team, matches] = await Promise.all([
      getTeam(teamId),
      getTeamMatches(teamId),
    ]);
  } catch {
    notFound();
  }

  const countryCode = team.area?.code?.toLowerCase() ?? "xx";

  const grouped = {
    upcoming: matches.filter(
      (m) => m.status === "SCHEDULED" || m.status === "TIMED"
    ),
    live: matches.filter(
      (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
    ),
    finished: matches
      .filter((m) => m.status === "FINISHED")
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()),
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-5">
        <Flag countryCode={countryCode} name={team.name} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-white">{team.name}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{team.area?.name}</p>
        </div>
      </div>

      {/* Live */}
      {grouped.live.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live
          </h2>
          <MatchList matches={grouped.live} groupByDate={false} />
        </section>
      )}

      {/* Upcoming */}
      {grouped.upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Upcoming</h2>
          <MatchList matches={grouped.upcoming} groupByDate={false} />
        </section>
      )}

      {/* Results */}
      {grouped.finished.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Results</h2>
          <MatchList matches={grouped.finished} groupByDate={false} />
        </section>
      )}

      {/* Squad */}
      {team.squad && team.squad.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Squad</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-700">
                  <th className="px-4 py-2 text-left">Player</th>
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Nationality</th>
                </tr>
              </thead>
              <tbody>
                {team.squad.map((player) => (
                  <tr
                    key={player.id}
                    className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-white font-medium">{player.name}</td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {player.position ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {player.nationality ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
