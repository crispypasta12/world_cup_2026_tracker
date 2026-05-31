import { getMatches, getStandings } from "@/lib/api/client";
import MatchList from "@/components/matches/MatchList";
import GroupTable from "@/components/groups/GroupTable";
import { getQualifiedThirdPlace } from "@/lib/utils/standings";
import Link from "next/link";
import BulkCalendarActions from "@/components/ui/BulkCalendarActions";

export const revalidate = 60;

async function getHomeData() {
  try {
    const [allMatches, standingsData] = await Promise.all([
      getMatches(),
      getStandings(),
    ]);

    const now = new Date();

    const liveMatches = allMatches.filter(
      (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
    );

    const allUpcoming = allMatches
      .filter((m) => m.status === "SCHEDULED" || m.status === "TIMED")
      .filter((m) => new Date(m.utcDate) >= now)
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    const upcoming = allUpcoming.slice(0, 6);

    const recent = allMatches
      .filter((m) => m.status === "FINISHED")
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 6);

    const groups = standingsData.standings.slice(0, 3);
    const qualifiedThirds = getQualifiedThirdPlace(standingsData.standings);

    return { liveMatches, upcoming, allUpcoming, recent, groups, qualifiedThirds };
  } catch {
    return {
      liveMatches: [],
      upcoming: [],
      allUpcoming: [],
      recent: [],
      groups: [],
      qualifiedThirds: new Set<number>(),
    };
  }
}

export default async function Home() {
  const { liveMatches, upcoming, allUpcoming, recent, groups, qualifiedThirds } =
    await getHomeData();

  const hasData =
    liveMatches.length > 0 ||
    upcoming.length > 0 ||
    recent.length > 0 ||
    groups.length > 0;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-10 space-y-4">
        <div className="text-5xl">⚽</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          FIFA World Cup 2026
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          United States · Canada · Mexico &mdash; June 11 – July 19, 2026
        </p>
        <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
          <Link
            href="/groups"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors"
          >
            View Groups
          </Link>
          <Link
            href="/schedule"
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Full Schedule
          </Link>
          <Link
            href="/bracket"
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Bracket
          </Link>
        </div>
        <BulkCalendarActions matches={allUpcoming} />
      </section>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live Now
          </h2>
          <MatchList matches={liveMatches} groupByDate={false} />
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Upcoming Matches</h2>
            <Link href="/schedule" className="text-sm text-blue-400 hover:text-blue-300">
              View all →
            </Link>
          </div>
          <MatchList matches={upcoming} groupByDate={false} />
        </section>
      )}

      {/* Recent results */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Results</h2>
            <Link href="/schedule" className="text-sm text-blue-400 hover:text-blue-300">
              View all →
            </Link>
          </div>
          <MatchList matches={recent} groupByDate={false} />
        </section>
      )}

      {/* Group standings preview */}
      {groups.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Group Standings</h2>
            <Link href="/groups" className="text-sm text-blue-400 hover:text-blue-300">
              All groups →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <GroupTable key={g.group} group={g} qualifiedThirds={qualifiedThirds} />
            ))}
          </div>
        </section>
      )}

      {!hasData && (
        <section className="text-center py-16 space-y-3">
          <div className="text-4xl">🏆</div>
          <p className="text-slate-400">
            Match data will appear here once the tournament begins on June 11, 2026.
          </p>
          <p className="text-slate-600 text-sm">
            Make sure your{" "}
            <code className="text-slate-500">FOOTBALL_DATA_API_KEY</code> is set
            in <code className="text-slate-500">.env.local</code>.
          </p>
        </section>
      )}
    </div>
  );
}
