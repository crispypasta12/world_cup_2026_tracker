import type { H2HMatch } from "@/app/api/h2h/route";
import type { Team } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";

interface Props {
  matches: H2HMatch[];
  homeTeam: Team;
  awayTeam: Team;
}

function formatH2HDate(date: string): string {
  const [year, month] = date.split("-");
  const monthName = new Date(Number(year), Number(month) - 1).toLocaleString("en-US", { month: "short" });
  return `${monthName} ${year}`;
}

function shortenTournament(name: string): string {
  return name
    .replace("FIFA World Cup qualification", "WCQ")
    .replace("FIFA World Cup", "WC")
    .replace("UEFA Nations League", "UNL")
    .replace("African Cup of Nations qualification", "AFCONQ")
    .replace("African Cup of Nations", "AFCON")
    .replace("Copa América", "Copa Am.")
    .replace("AFC Asian Cup qualification", "AFC Q")
    .replace("AFC Asian Cup", "AFC")
    .replace("CONCACAF Gold Cup", "Gold Cup")
    .replace("CONCACAF Nations League", "CNL")
    .replace("Friendly", "Friendly");
}

export default function HeadToHead({ matches, homeTeam, awayTeam }: Props) {
  if (matches.length === 0) return null;

  const csvHome = homeTeam.name === "Bosnia-Herzegovina" ? "Bosnia and Herzegovina"
    : homeTeam.name === "Cape Verde Islands" ? "Cape Verde"
    : homeTeam.name;
  const csvAway = awayTeam.name === "Bosnia-Herzegovina" ? "Bosnia and Herzegovina"
    : awayTeam.name === "Cape Verde Islands" ? "Cape Verde"
    : awayTeam.name;

  // Compute aggregate stats from the perspective of homeTeam / awayTeam
  let homeWins = 0, draws = 0, awayWins = 0;
  for (const m of matches) {
    const homeIsCurrentHome = m.home === csvHome || m.home === homeTeam.shortName;
    const h = homeIsCurrentHome ? m.homeScore : m.awayScore;
    const a = homeIsCurrentHome ? m.awayScore : m.homeScore;
    if (h > a) homeWins++;
    else if (h === a) draws++;
    else awayWins++;
  }

  const total = homeWins + draws + awayWins;
  const homeWinPct = (homeWins / total) * 100;
  const drawPct = (draws / total) * 100;
  const awayWinPct = (awayWins / total) * 100;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Previous Encounters</h3>
        <span className="text-xs text-slate-500">Last {matches.length} match{matches.length !== 1 ? "es" : ""}</span>
      </div>

      {/* Summary */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          {/* Home team */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Flag
              countryCode={homeTeam.area?.code ?? homeTeam.tla}
              name={homeTeam.name}
              size="sm"
            />
            <span className="text-white font-medium truncate">
              {homeTeam.shortName || homeTeam.name}
            </span>
          </div>

          {/* W / D / W */}
          <div className="flex items-center gap-4 mx-4 shrink-0 text-center">
            <div>
              <div className="text-xl font-bold text-blue-400 tabular-nums leading-none">{homeWins}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">W</div>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-400 tabular-nums leading-none">{draws}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">D</div>
            </div>
            <div>
              <div className="text-xl font-bold text-rose-400 tabular-nums leading-none">{awayWins}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">W</div>
            </div>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
            <span className="text-white font-medium truncate text-right">
              {awayTeam.shortName || awayTeam.name}
            </span>
            <Flag
              countryCode={awayTeam.area?.code ?? awayTeam.tla}
              name={awayTeam.name}
              size="sm"
            />
          </div>
        </div>

        {/* Result bar */}
        <div className="flex h-1.5 rounded-full overflow-hidden gap-px bg-slate-700/50">
          {homeWinPct > 0 && (
            <div className="bg-blue-500 rounded-l-full" style={{ width: `${homeWinPct}%` }} />
          )}
          {drawPct > 0 && (
            <div className="bg-slate-600" style={{ width: `${drawPct}%` }} />
          )}
          {awayWinPct > 0 && (
            <div className="bg-rose-500 rounded-r-full" style={{ width: `${awayWinPct}%` }} />
          )}
        </div>
      </div>

      {/* Match list */}
      <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
        {matches.map((m) => {
          const homeIsCurrentHome = m.home === csvHome || m.home === homeTeam.shortName;
          const displayHome = homeIsCurrentHome ? homeTeam : awayTeam;
          const displayAway = homeIsCurrentHome ? awayTeam : homeTeam;
          const h = m.homeScore;
          const a = m.awayScore;

          const resultForHome =
            (homeIsCurrentHome && h > a) || (!homeIsCurrentHome && a > h)
              ? "W"
              : h === a
              ? "D"
              : "L";

          const resultColor =
            resultForHome === "W"
              ? "text-green-400"
              : resultForHome === "D"
              ? "text-slate-400"
              : "text-rose-400";

          return (
            <div key={`${m.date}-${m.home}-${m.away}`} className="flex items-center gap-3 px-4 py-3">
              {/* Date */}
              <span className="text-xs text-slate-500 w-20 shrink-0">{formatH2HDate(m.date)}</span>

              {/* Home team */}
              <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                <span className="text-xs text-slate-300 truncate text-right">
                  {displayHome.shortName || displayHome.tla}
                </span>
                <Flag countryCode={displayHome.area?.code ?? displayHome.tla} name={displayHome.name} size="sm" />
              </div>

              {/* Score + result badge */}
              <div className="flex flex-col items-center shrink-0 min-w-[60px]">
                <span className="text-sm font-bold tabular-nums text-white">
                  {h} – {a}
                </span>
                <span className={`text-[10px] font-semibold ${resultColor}`}>{resultForHome}</span>
              </div>

              {/* Away team */}
              <div className="flex items-center gap-1.5 flex-1 justify-start min-w-0">
                <Flag countryCode={displayAway.area?.code ?? displayAway.tla} name={displayAway.name} size="sm" />
                <span className="text-xs text-slate-300 truncate">
                  {displayAway.shortName || displayAway.tla}
                </span>
              </div>

              {/* Tournament */}
              <span className="text-[10px] text-slate-600 hidden sm:block w-20 text-right shrink-0 truncate">
                {shortenTournament(m.tournament)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
