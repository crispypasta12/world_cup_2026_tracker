import { getScorers } from "@/lib/api/client";
import Flag from "@/components/ui/Flag";
import Link from "next/link";

export const revalidate = 300;

export const metadata = {
  title: "Top Scorers | WC 2026",
};

export default async function ScorersPage() {
  let scorers;
  try {
    scorers = await getScorers(20);
  } catch {
    return (
      <div className="text-center text-slate-500 py-16">
        Scorer data will be available once the tournament begins on June 11, 2026.
      </div>
    );
  }

  if (!scorers || scorers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Top Scorers</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Goal scoring leaders for the 2026 FIFA World Cup.
          </p>
        </div>
        <div className="text-center text-slate-500 py-16">
          No scorer data yet. Check back once the tournament begins.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Top Scorers</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Goal scoring leaders for the 2026 FIFA World Cup.
        </p>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_auto] gap-2 px-4 py-3 bg-slate-900/50 border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>#</span>
          <span>Player</span>
          <div className="flex gap-6 text-right">
            <span className="w-6">G</span>
            <span className="w-6">A</span>
            <span className="w-6">P</span>
          </div>
        </div>

        {scorers.map((scorer, i) => (
          <div
            key={scorer.player.id}
            className="grid grid-cols-[2rem_1fr_auto] gap-2 items-center px-4 py-3.5 border-t border-slate-700/30 hover:bg-white/5 transition-colors"
          >
            {/* Rank */}
            <span
              className={`text-sm font-bold tabular-nums ${
                i === 0
                  ? "text-yellow-400"
                  : i === 1
                  ? "text-slate-300"
                  : i === 2
                  ? "text-amber-600"
                  : "text-slate-600"
              }`}
            >
              {i + 1}
            </span>

            {/* Player + team */}
            <div className="flex items-center gap-3 min-w-0">
              <Flag
                countryCode={scorer.team.area?.code ?? scorer.team.tla}
                name={scorer.team.name}
                size="sm"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {scorer.player.name}
                </div>
                <Link
                  href={`/teams/${scorer.team.id}`}
                  className="text-xs text-slate-500 hover:text-blue-400 transition-colors truncate block"
                >
                  {scorer.team.shortName || scorer.team.name}
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-right">
              <span className="w-6 text-sm font-bold text-white tabular-nums">
                {scorer.goals}
              </span>
              <span className="w-6 text-sm text-slate-400 tabular-nums">
                {scorer.assists ?? "—"}
              </span>
              <span className="w-6 text-sm text-slate-500 tabular-nums">
                {scorer.penalties ?? "—"}
              </span>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="px-4 py-3 border-t border-slate-700/30 flex gap-6 text-xs text-slate-600">
          <span>G = Goals</span>
          <span>A = Assists</span>
          <span>P = Penalties</span>
        </div>
      </div>
    </div>
  );
}
