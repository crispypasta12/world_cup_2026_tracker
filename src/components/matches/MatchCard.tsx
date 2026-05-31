"use client";

import type { Match } from "@/lib/api/types";
import type { H2HRecord } from "@/lib/utils/h2h";
import { formatMatchDate, formatMatchTime } from "@/lib/utils/date";
import Flag from "@/components/ui/Flag";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRouter } from "next/navigation";
import { useTimezone } from "@/lib/context/TimezoneContext";
import CalendarMenu from "@/components/ui/CalendarMenu";
import Icon from "@/components/ui/Icon";
import { matchContextLabel, teamCode, teamName } from "@/lib/utils/match";

interface MatchCardProps {
  match: Match;
  h2hRecord?: H2HRecord;
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

export default function MatchCard({ match, h2hRecord }: MatchCardProps) {
  const { timezone } = useTimezone();
  const router = useRouter();
  const isScheduled = match.status === "SCHEDULED" || match.status === "TIMED";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isFinished = match.status === "FINISHED";
  const homeLabel = teamName(match.homeTeam);
  const awayLabel = teamName(match.awayTeam);
  const hasTbd = homeLabel === "TBD" || awayLabel === "TBD";
  const stateClass = isLive
    ? "border-green-400/35 bg-green-950/20 shadow-green-950/20"
    : isFinished
      ? "border-white/10 bg-slate-900/55"
      : hasTbd
        ? "border-dashed border-white/15 bg-slate-900/45"
        : "border-white/10 bg-slate-900/55";

  function openMatch() {
    router.push(`/matches/${match.id}`);
  }

  return (
    <div
      onClick={openMatch}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMatch();
        }
      }}
      role="button"
      tabIndex={0}
      className={`group cursor-pointer rounded-2xl border p-4 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-[var(--wc-gold)]/60 ${stateClass}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-300">
            {matchContextLabel(match)}
          </span>
          {match.venue && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-400">
              <Icon name="map-pin" className="h-3 w-3" />
              {match.venue}
            </span>
          )}
        </div>
        <StatusBadge status={match.status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center justify-end gap-3">
          <span className="truncate text-right text-base font-black leading-tight text-white">
            {homeLabel}
          </span>
          <Flag
            countryCode={teamCode(match.homeTeam)}
            name={homeLabel}
            size="lg"
          />
        </div>

        <div className="flex min-w-[94px] flex-col items-center gap-1 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2">
          <Score match={match} timezone={timezone} />
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <Flag
            countryCode={teamCode(match.awayTeam)}
            name={awayLabel}
            size="lg"
          />
          <span className="truncate text-base font-black leading-tight text-white">
            {awayLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 flex min-h-[28px] items-center justify-between gap-3 border-t border-white/10 pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <Icon name={isFinished ? "trophy" : "clock"} className="h-3.5 w-3.5" />
          {hasTbd
            ? "Participants to be determined"
            : isFinished
              ? "Result confirmed"
              : "Kickoff shown in selected timezone"}
        </span>
        {isScheduled && <CalendarMenu match={match} />}
      </div>

      {/* H2H teaser */}
      {h2hRecord && h2hRecord.total > 0 && (() => {
        const homeWinPct = (h2hRecord.homeWins / h2hRecord.total) * 100;
        const drawPct = (h2hRecord.draws / h2hRecord.total) * 100;
        const awayWinPct = (h2hRecord.awayWins / h2hRecord.total) * 100;
        return (
          <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-center gap-2">
            <span className="text-[11px] font-semibold tabular-nums text-blue-400 w-5 text-right">{h2hRecord.homeWins}</span>
            <div className="flex h-1 w-20 rounded-full overflow-hidden bg-slate-700/50">
              {homeWinPct > 0 && <div className="bg-blue-500" style={{ width: `${homeWinPct}%` }} />}
              {drawPct > 0 && <div className="bg-slate-500" style={{ width: `${drawPct}%` }} />}
              {awayWinPct > 0 && <div className="bg-rose-500" style={{ width: `${awayWinPct}%` }} />}
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-rose-400 w-5">{h2hRecord.awayWins}</span>
            <span className="text-[10px] text-slate-600 ml-1">{h2hRecord.total} games</span>
          </div>
        );
      })()}
    </div>
  );
}
