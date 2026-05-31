"use client";

import type { Match } from "@/lib/api/types";
import { formatMatchDate, formatMatchTime } from "@/lib/utils/date";
import Flag from "@/components/ui/Flag";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import { useTimezone } from "@/lib/context/TimezoneContext";

interface MatchCardProps {
  match: Match;
}

function Score({ match, timezone }: { match: Match; timezone: string }) {
  const { status, score } = match;
  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";

  if (isLive || isFinished) {
    return (
      <div
        className={`text-2xl font-bold tabular-nums ${isLive ? "text-green-400" : "text-white"}`}
      >
        {score.fullTime.home ?? 0} – {score.fullTime.away ?? 0}
      </div>
    );
  }

  return (
    <div className="text-sm text-slate-400 text-center" suppressHydrationWarning>
      <div>{formatMatchDate(match.utcDate, timezone)}</div>
      <div className="text-xs text-slate-500">{formatMatchTime(match.utcDate, timezone)}</div>
    </div>
  );
}

export default function MatchCard({ match }: MatchCardProps) {
  const { timezone } = useTimezone();

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/70 rounded-xl p-4 transition-all cursor-pointer group">
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
            <Score match={match} timezone={timezone} />
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
