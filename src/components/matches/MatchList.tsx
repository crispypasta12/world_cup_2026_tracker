import type { Match } from "@/lib/api/types";
import MatchCard from "./MatchCard";
import { formatMatchDate } from "@/lib/utils/date";

interface MatchListProps {
  matches: Match[];
  groupByDate?: boolean;
}

export default function MatchList({ matches, groupByDate = true }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center text-slate-500 py-12">No matches found.</div>
    );
  }

  if (!groupByDate) {
    return (
      <div className="space-y-3">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    );
  }

  // Group by calendar date
  const byDate = new Map<string, Match[]>();
  for (const m of matches) {
    const key = m.utcDate.slice(0, 10);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(m);
  }

  return (
    <div className="space-y-8">
      {[...byDate.entries()].map(([date, dayMatches]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {formatMatchDate(date + "T12:00:00Z")}
          </h3>
          <div className="space-y-3">
            {dayMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
