"use client";

import { useState, useEffect } from "react";
import type { Match } from "@/lib/api/types";
import { formatMatchDate, formatMatchTime } from "@/lib/utils/date";
import Flag from "@/components/ui/Flag";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRouter } from "next/navigation";
import { useTimezone } from "@/lib/context/TimezoneContext";
import CalendarMenu from "@/components/ui/CalendarMenu";

// Maps football-data.org team names → names used in the international results CSV
const NAME_MAP: Record<string, string> = {
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
  "Cape Verde Islands": "Cape Verde",
  "Congo DR": "DR Congo",
};

function toCsvName(name: string): string {
  return NAME_MAP[name] ?? name;
}

interface H2HRecord {
  homeWins: number;
  draws: number;
  awayWins: number;
  total: number;
}

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

const STAGE_LABELS: Record<string, string> = {
  LAST_32: "Round of 32",
  LAST_16: "Round of 16",
  QUARTER_FINALS: "Quarter-Final",
  SEMI_FINALS: "Semi-Final",
  THIRD_PLACE: "Third Place",
  FINAL: "Final",
};

export default function MatchCard({ match }: MatchCardProps) {
  const { timezone } = useTimezone();
  const router = useRouter();
  const isScheduled = match.status === "SCHEDULED" || match.status === "TIMED";
  const [h2h, setH2h] = useState<H2HRecord | null>(null);

  const footerLabel = match.group
    ? `${match.group.replace("GROUP_", "Group ")} · Matchday ${match.matchday}`
    : (STAGE_LABELS[match.stage] ?? null);

  // Only fetch H2H for upcoming matches with two known teams
  const homeId = match.homeTeam.id;
  const awayId = match.awayTeam.id;
  const homeName = match.homeTeam.name;
  const awayName = match.awayTeam.name;

  useEffect(() => {
    if (!isScheduled || !homeId || !awayId) return;
    // Skip placeholder "TBD" team names
    if (!homeName || !awayName || homeName.startsWith("Winner") || awayName.startsWith("Winner")
      || homeName.startsWith("Loser") || awayName.startsWith("Loser")) return;

    let cancelled = false;
    fetch(
      `/api/h2h?home=${encodeURIComponent(homeName)}&away=${encodeURIComponent(awayName)}&limit=20`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.matches?.length) return;
        const csvHome = toCsvName(homeName);
        let homeWins = 0, draws = 0, awayWins = 0;
        for (const m of data.matches) {
          const homeIsCurrentHome = m.home === csvHome || m.home === match.homeTeam.shortName;
          const h = homeIsCurrentHome ? m.homeScore : m.awayScore;
          const a = homeIsCurrentHome ? m.awayScore : m.homeScore;
          if (h > a) homeWins++;
          else if (h === a) draws++;
          else awayWins++;
        }
        setH2h({ homeWins, draws, awayWins, total: data.matches.length });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeId, awayId]);

  return (
    <div
      onClick={() => router.push(`/matches/${match.id}`)}
      className="bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/70 rounded-xl p-4 transition-all cursor-pointer group"
    >
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

      <div className="mt-2 flex items-center justify-between min-h-[20px]">
        <span className="text-xs text-slate-500">{footerLabel}</span>
        {isScheduled && <CalendarMenu match={match} />}
      </div>

      {/* H2H teaser */}
      {h2h && h2h.total > 0 && (() => {
        const homeWinPct = (h2h.homeWins / h2h.total) * 100;
        const drawPct = (h2h.draws / h2h.total) * 100;
        const awayWinPct = (h2h.awayWins / h2h.total) * 100;
        return (
          <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-center gap-2">
            <span className="text-[11px] font-semibold tabular-nums text-blue-400 w-5 text-right">{h2h.homeWins}</span>
            <div className="flex h-1 w-20 rounded-full overflow-hidden bg-slate-700/50">
              {homeWinPct > 0 && <div className="bg-blue-500" style={{ width: `${homeWinPct}%` }} />}
              {drawPct > 0 && <div className="bg-slate-500" style={{ width: `${drawPct}%` }} />}
              {awayWinPct > 0 && <div className="bg-rose-500" style={{ width: `${awayWinPct}%` }} />}
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-rose-400 w-5">{h2h.awayWins}</span>
            <span className="text-[10px] text-slate-600 ml-1">{h2h.total} games</span>
          </div>
        );
      })()}
    </div>
  );
}
