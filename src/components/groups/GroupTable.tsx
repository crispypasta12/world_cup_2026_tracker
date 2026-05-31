import type { Match, StandingEntry, StandingTable } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatMatchDate, formatMatchTime } from "@/lib/utils/date";
import { teamCode, teamName } from "@/lib/utils/match";

interface GroupTableProps {
  group: StandingTable;
  qualifiedThirds?: Set<number>;
  groupMatches?: Match[];
}

function rowStyle(pos: number, teamId: number, qualifiedThirds?: Set<number>): string {
  if (pos <= 2) return "border-l-4 border-l-[var(--wc-green)] bg-green-500/[0.035]";
  if (pos === 3 && qualifiedThirds?.has(teamId)) return "border-l-4 border-l-[var(--wc-gold)] bg-yellow-500/[0.035]";
  return "border-l-4 border-l-transparent";
}

function FormDots({ form }: { form?: string }) {
  if (!form) return <span className="text-xs text-slate-600">-</span>;
  return (
    <span className="flex items-center justify-center gap-1">
      {form.slice(-5).split("").map((result, index) => {
        const cls =
          result === "W"
            ? "bg-[var(--wc-green)]"
            : result === "D"
              ? "bg-slate-500"
              : "bg-[var(--wc-red)]";
        return (
          <span
            key={`${result}-${index}`}
            className={`grid h-4 w-4 place-items-center rounded-full text-[9px] font-black text-white ${cls}`}
          >
            {result}
          </span>
        );
      })}
    </span>
  );
}

export default function GroupTable({ group, qualifiedThirds, groupMatches = [] }: GroupTableProps) {
  const label = group.group?.replace("GROUP_", "Group ") ?? group.stage;
  const played = group.table.reduce((sum, entry) => sum + entry.playedGames, 0);

  return (
    <div className="premium-panel overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 bg-white/[0.035] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="section-kicker">Group</div>
            <h3 className="mt-1 text-lg font-black text-white">{label}</h3>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2 text-right">
            <div className="text-lg font-black text-white">{played}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              played
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-2 text-left w-6">#</th>
            <th className="px-4 py-2 text-left">Team</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="hidden px-2 py-2 text-center sm:table-cell">D</th>
            <th className="hidden px-2 py-2 text-center sm:table-cell">L</th>
            <th className="px-2 py-2 text-center">GD</th>
            <th className="hidden px-2 py-2 text-center md:table-cell">Form</th>
            <th className="px-2 py-2 text-center font-bold text-slate-400">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.table.map((entry: StandingEntry) => (
            <tr
              key={entry.team.id}
              className={`border-t border-white/10 transition-colors hover:bg-white/5 ${rowStyle(entry.position, entry.team.id, qualifiedThirds)}`}
            >
              <td className="px-4 py-2.5 text-slate-500 text-xs">{entry.position}</td>
              <td className="px-4 py-2.5">
                <Link
                  href={`/teams/${entry.team.id}`}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Flag
                    countryCode={teamCode(entry.team)}
                    name={teamName(entry.team)}
                    size="sm"
                  />
                  <span className="text-white font-bold">
                    {teamName(entry.team)}
                  </span>
                </Link>
              </td>
              <td className="px-2 py-2.5 text-center text-slate-300">{entry.playedGames}</td>
              <td className="px-2 py-2.5 text-center text-slate-300">{entry.won}</td>
              <td className="hidden px-2 py-2.5 text-center text-slate-300 sm:table-cell">{entry.draw}</td>
              <td className="hidden px-2 py-2.5 text-center text-slate-300 sm:table-cell">{entry.lost}</td>
              <td className="px-2 py-2.5 text-center text-slate-300">
                {entry.goalDifference > 0
                  ? `+${entry.goalDifference}`
                  : entry.goalDifference}
              </td>
              <td className="hidden px-2 py-2.5 text-center md:table-cell">
                <FormDots form={entry.form} />
              </td>
              <td className="px-2 py-2.5 text-center font-bold text-white">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {groupMatches.length > 0 && (
        <details className="border-t border-white/10 bg-slate-950/25">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-slate-300 transition-colors hover:bg-white/[0.035]">
            <span className="inline-flex items-center gap-2">
              <Icon name="calendar" className="h-4 w-4 text-[var(--wc-gold)]" />
              Fixtures
            </span>
            <span className="text-xs text-slate-500">{groupMatches.length} matches</span>
          </summary>
          <div className="divide-y divide-white/10">
            {groupMatches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-xs transition-colors hover:bg-white/[0.035]"
              >
                <span className="min-w-0 truncate font-semibold text-white">
                  {teamName(match.homeTeam)} vs {teamName(match.awayTeam)}
                </span>
                <span className="text-right text-slate-500">
                  {formatMatchDate(match.utcDate)} / {formatMatchTime(match.utcDate)}
                </span>
              </Link>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
