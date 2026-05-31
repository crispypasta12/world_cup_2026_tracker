import type { Match } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Link from "next/link";

interface BracketSlotProps {
  match?: Match;
  placeholder?: string;
  size?: "sm" | "md";
}

function TeamRow({
  team,
  score,
  isWinner,
}: {
  team?: { name: string; shortName: string; tla: string; area?: { code?: string } } | null;
  score: number | null;
  isWinner?: boolean;
}) {
  if (!team) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-slate-600 text-xs italic">
        TBD
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 ${
        isWinner ? "text-white" : "text-slate-400"
      }`}
    >
      <Flag
        countryCode={team.area?.code ?? team.tla}
        name={team.name}
        size="sm"
      />
      <span className="text-xs font-medium flex-1 truncate">
        {team.shortName || team.tla}
      </span>
      {score !== null && (
        <span className={`text-sm font-bold tabular-nums ${isWinner ? "text-white" : "text-slate-500"}`}>
          {score}
        </span>
      )}
    </div>
  );
}

export default function BracketSlot({ match, placeholder }: BracketSlotProps) {
  if (!match) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-48 overflow-hidden opacity-50">
        <div className="px-3 py-2 text-slate-600 text-xs italic border-b border-slate-700">
          {placeholder ?? "TBD"}
        </div>
        <div className="px-3 py-2 text-slate-600 text-xs italic">TBD</div>
      </div>
    );
  }

  const homeWin = match.score.winner === "HOME_TEAM";
  const awayWin = match.score.winner === "AWAY_TEAM";
  const finished = match.status === "FINISHED";

  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg w-48 overflow-hidden transition-colors cursor-pointer">
        <TeamRow
          team={match.homeTeam as any}
          score={finished ? match.score.fullTime.home : null}
          isWinner={homeWin}
        />
        <div className="border-t border-slate-700" />
        <TeamRow
          team={match.awayTeam as any}
          score={finished ? match.score.fullTime.away : null}
          isWinner={awayWin}
        />
      </div>
    </Link>
  );
}
