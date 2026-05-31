import { getMatch } from "@/lib/api/client";
import Flag from "@/components/ui/Flag";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatMatchDateTime } from "@/lib/utils/date";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  const { homeTeam, awayTeam, score, status, utcDate } = match;
  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";
  const showScore = isLive || isFinished;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back link */}
      <Link href="/schedule" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
        ← Back to schedule
      </Link>

      {/* Match header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
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

        <div className="flex items-center justify-between gap-6">
          {/* Home team */}
          <Link
            href={`/teams/${homeTeam.id}`}
            className="flex flex-col items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
            <Flag countryCode={homeTeam.area?.code ?? homeTeam.tla} name={homeTeam.name} size="lg" />
            <span className="text-white font-semibold text-center">
              {homeTeam.shortName || homeTeam.name}
            </span>
          </Link>

          {/* Score */}
          <div className="text-center min-w-[100px]">
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

          {/* Away team */}
          <Link
            href={`/teams/${awayTeam.id}`}
            className="flex flex-col items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
            <Flag countryCode={awayTeam.area?.code ?? awayTeam.tla} name={awayTeam.name} size="lg" />
            <span className="text-white font-semibold text-center">
              {awayTeam.shortName || awayTeam.name}
            </span>
          </Link>
        </div>

        {/* Half-time score */}
        {isFinished && score.halfTime.home !== null && (
          <div className="text-center text-slate-500 text-xs mt-6">
            Half-time: {score.halfTime.home} – {score.halfTime.away}
          </div>
        )}
      </div>
    </div>
  );
}
