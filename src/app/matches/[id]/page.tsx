import { getMatch } from "@/lib/api/client";
import Flag from "@/components/ui/Flag";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatMatchDateTime } from "@/lib/utils/date";
import { notFound } from "next/navigation";
import Link from "next/link";
import MatchCalendarActions from "@/components/ui/MatchCalendarActions";
import { teamCode, teamId, teamName } from "@/lib/utils/match";
import Icon from "@/components/ui/Icon";
import HeadToHead from "@/components/matches/HeadToHead";
import type { H2HMatch } from "@/app/api/h2h/route";

export const revalidate = 30;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;
  const matchId = Number(id);

  if (isNaN(matchId)) notFound();

  let match;
  try {
    match = await getMatch(matchId);
  } catch {
    notFound();
  }

  // Fetch H2H from our internal route (backed by martj42/international_results dataset)
  let h2hMatches: H2HMatch[] = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const h2hRes = await fetch(
      `${baseUrl}/api/h2h?home=${encodeURIComponent(match.homeTeam.name)}&away=${encodeURIComponent(match.awayTeam.name)}&limit=10`,
      { next: { revalidate: 86400 } }
    );
    if (h2hRes.ok) {
      const data = await h2hRes.json();
      h2hMatches = data.matches ?? [];
    }
  } catch {
    // H2H is optional — silently skip on error
  }

  const { homeTeam, awayTeam, score, status, utcDate } = match;
  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";
  const showScore = isLive || isFinished;
  const homeId = teamId(homeTeam);
  const awayId = teamId(awayTeam);
  const homeLabel = teamName(homeTeam);
  const awayLabel = teamName(awayTeam);

  const teamBlock = (
    team: typeof homeTeam,
    id: number | null,
    label: string
  ) => {
    const content = (
      <>
        <Flag countryCode={teamCode(team)} name={label} size="lg" />
        <span className="text-center text-base font-black text-white">
          {label}
        </span>
      </>
    );

    if (!id) {
      return (
        <div className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-slate-500">
          {content}
          <span className="text-xs font-semibold uppercase tracking-wider">TBD</span>
        </div>
      );
    }

    return (
      <Link
        href={`/teams/${id}`}
        className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-opacity hover:opacity-85"
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back link */}
      <Link href="/schedule" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
        <Icon name="chevron-right" className="h-3.5 w-3.5 rotate-180" />
        Back to schedule
      </Link>

      {/* Match header */}
      <div className="premium-panel rounded-[2rem] p-6 sm:p-8">
        <div className="text-center mb-6">
          <StatusBadge status={status} />
          <div className="text-slate-400 text-sm mt-2">
            {formatMatchDateTime(utcDate)}
          </div>
          {match.group && (
            <div className="text-slate-500 text-xs mt-1">
              {match.group.replace("GROUP_", "Group ")} · Matchday {match.matchday}
            </div>
          )}
          {match.venue && (
            <div className="text-slate-500 text-xs mt-1">{match.venue}</div>
          )}
        </div>

        <div className="flex items-stretch justify-between gap-4 sm:gap-6">
          {teamBlock(homeTeam, homeId, homeLabel)}

          {/* Score */}
          <div className="flex min-w-[86px] flex-col items-center justify-center text-center sm:min-w-[110px]">
            {showScore ? (
              <div className={`text-5xl font-bold tabular-nums ${isLive ? "text-green-400" : "text-white"}`}>
                {score.fullTime.home ?? 0} – {score.fullTime.away ?? 0}
              </div>
            ) : (
              <div className="text-slate-500 text-2xl font-light">vs</div>
            )}
            {isFinished && score.duration !== "REGULAR" && (
              <div className="text-xs text-slate-500 mt-1">
                {score.duration === "EXTRA_TIME" ? "AET" : "PSO"}
              </div>
            )}
          </div>

          {teamBlock(awayTeam, awayId, awayLabel)}
        </div>

        {/* Half-time score */}
        {isFinished && score.halfTime.home !== null && (
          <div className="text-center text-slate-500 text-xs mt-6">
            Half-time: {score.halfTime.home} – {score.halfTime.away}
          </div>
        )}
      </div>

      {/* Calendar actions */}
      {!isFinished && <MatchCalendarActions match={match} />}

      {/* Head to Head */}
      {h2hMatches.length > 0 && (
        <HeadToHead
          matches={h2hMatches}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
    </div>
  );
}
