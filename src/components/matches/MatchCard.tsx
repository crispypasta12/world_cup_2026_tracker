import type { Match } from "@/lib/api/types";
import { formatMatchDate, formatMatchTime } from "@/lib/utils/date";
import Flag from "@/components/ui/Flag";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

interface MatchCardProps {
  match: Match;
}

function Score({ match }: { match: Match }) {
  const { status, score } = match;
  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";

  if (isLive || isFinished) {
    return (
      <div className={`text-2xl font-bold tabular-nums ${isLive ? "text-green-400" : "text-white"}`}>
        {score.fullTime.home ?? 0} – {score.fullTime.away ?? 0}
      </div>
    );
  }

  return (
    <div className="text-sm text-slate-400 text-center">
      <div>{formatMatchDate(match.utcDate)}</div>
      <div className="text-xs text-slate-500">{formatMatchTime(match.utcDate)}</div>
    </div>
  );
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-colors cursor-pointer">
        <div className="flex items-center justify-between gap-3">
          {/* Home team */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm font-medium text-white text-right leading-tight">
              {match.homeTeam.shortName || match.homeTeam.tla}
            </span>
            <Flag
              countryCode={match.homeTeam.area?.code ?? match.homeTeam.tla}
              name={match.homeTeam.name}
              size="md"
            />
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center gap-1 min-w-[90px]">
            <Score match={match} />
            <StatusBadge status={match.status} />
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2 flex-1">
            <Flag
              countryCode={match.awayTeam.area?.code ?? match.awayTeam.tla}
              name={match.awayTeam.name}
              size="md"
            />
            <span className="text-sm font-medium text-white leading-tight">
              {match.awayTeam.shortName || match.awayTeam.tla}
            </span>
          </div>
        </div>

        {match.group && (
          <div className="mt-2 text-center text-xs text-slate-500">
            {match.group.replace("GROUP_", "Group ")} · Matchday {match.matchday}
          </div>
        )}
      </div>
    </Link>
  );
}
