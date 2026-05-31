import { getMatches, getStandings } from "@/lib/api/client";
import { fetchH2HBatch } from "@/lib/utils/h2h";
import type { H2HRecord } from "@/lib/utils/h2h";
import MatchList from "@/components/matches/MatchList";
import GroupTable from "@/components/groups/GroupTable";
import { getQualifiedThirdPlace } from "@/lib/utils/standings";
import Link from "next/link";
import BulkCalendarActions from "@/components/ui/BulkCalendarActions";
import Icon from "@/components/ui/Icon";
import { formatMatchDate, formatMatchTime } from "@/lib/utils/date";
import { matchTitle } from "@/lib/utils/match";

export const revalidate = 60;

const STATS = [
  { label: "Teams", value: "48", icon: "users" as const },
  { label: "Matches", value: "104", icon: "calendar" as const },
  { label: "Venues", value: "16", icon: "stadium" as const },
  { label: "Hosts", value: "3", icon: "flag" as const },
];

async function getHomeData() {
  try {
    const [allMatches, standingsData] = await Promise.all([
      getMatches(),
      getStandings(),
    ]);


    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);

    const liveMatches = allMatches.filter(
      (m) => m.status === "IN_PLAY" || m.status === "PAUSED"
    );

    const allUpcoming = allMatches
      .filter((m) => m.status === "SCHEDULED" || m.status === "TIMED")
      .filter((m) => new Date(m.utcDate) >= now)
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    const upcoming = allUpcoming.slice(0, 6);
    const nextMatch = allUpcoming[0] ?? null;

    const todayMatches = allMatches
      .filter((m) => m.utcDate.startsWith(todayKey))
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());

    const openingDayMatches = allMatches
      .filter((m) => m.utcDate.startsWith("2026-06-11"))
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
      .slice(0, 3);

    const recent = allMatches
      .filter((m) => m.status === "FINISHED")
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 6);

    const groups = standingsData.standings.slice(0, 3);
    const qualifiedThirds = getQualifiedThirdPlace(standingsData.standings);
    const h2hMap = await fetchH2HBatch(allMatches).catch(() => ({} as Record<number, H2HRecord>));

    return {
      liveMatches,
      upcoming,
      allUpcoming,
      recent,
      groups,
      qualifiedThirds,
      nextMatch,
      todayMatches,
      openingDayMatches,
      h2hMap,
    };
  } catch {
    return {
      liveMatches: [],
      upcoming: [],
      allUpcoming: [],
      recent: [],
      groups: [],
      qualifiedThirds: new Set<number>(),
      nextMatch: null,
      todayMatches: [],
      openingDayMatches: [],
      h2hMap: {} as Record<number, H2HRecord>,
    };
  }
}

function getCountdownLabel(target: string | null) {
  if (!target) return "Schedule loading";
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return "Tournament window is active";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  return `${days} days ${hours} hours`;
}

export default async function Home() {
  const {
    liveMatches,
    upcoming,
    allUpcoming,
    recent,
    groups,
    qualifiedThirds,
    nextMatch,
    todayMatches,
    openingDayMatches,
    h2hMap,
  } = await getHomeData();

  const hasData =
    liveMatches.length > 0 ||
    upcoming.length > 0 ||
    recent.length > 0 ||
    groups.length > 0;

  return (
    <div className="space-y-12">
      <section className="premium-panel pitch-pattern overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="section-kicker">United States / Canada / Mexico</div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                Your command center for the 2026 World Cup.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Follow every group, kickoff, host city, and knockout path from June 11 to July 19.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                >
                  <Icon name={stat.icon} className="mb-3 h-4 w-4 text-[var(--wc-gold)]" />
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--wc-gold)] px-4 py-2.5 text-sm font-black text-slate-950 transition-colors hover:bg-yellow-300"
              >
                Full Schedule
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link
                href="/groups"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                View Groups
              </Link>
              <Link
                href="/venues"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Host Cities
              </Link>
            </div>

            <BulkCalendarActions matches={allUpcoming} />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="section-kicker">Next Match</div>
                <div className="mt-1 text-sm text-slate-400">
                  Countdown:{" "}
                  <span className="font-bold text-white">
                    {getCountdownLabel(nextMatch?.utcDate ?? null)}
                  </span>
                </div>
              </div>
              <Icon name="trophy" className="h-8 w-8 text-[var(--wc-gold)]" />
            </div>
            {nextMatch ? (
              <div className="space-y-4">
                <MatchList matches={[nextMatch]} groupByDate={false} h2hMap={h2hMap} />
                <div className="grid grid-cols-1 gap-3 text-xs text-slate-400 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="mb-1 text-slate-500">Kickoff</div>
                    <div className="font-bold text-white">
                      {formatMatchDate(nextMatch.utcDate)} / {formatMatchTime(nextMatch.utcDate)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="mb-1 text-slate-500">Fixture</div>
                    <div className="font-bold text-white">{matchTitle(nextMatch)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
                Match data will appear here once the schedule is available.
              </div>
            )}
          </div>
        </div>
      </section>

      {liveMatches.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live Now
          </h2>
          <MatchList matches={liveMatches} groupByDate={false} />
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="section-kicker">
              {todayMatches.length > 0 ? "Today" : "Opening Day"}
            </div>
            <h2 className="mt-1 text-xl font-bold text-white">
              {todayMatches.length > 0 ? "Today's Matches" : "Opening Day Fixtures"}
            </h2>
          </div>
          <Link
            href="/schedule"
            className="text-sm font-semibold text-[var(--wc-gold)] hover:text-yellow-300"
          >
            Schedule
          </Link>
        </div>
        <MatchList
          matches={(todayMatches.length > 0 ? todayMatches : openingDayMatches).slice(0, 3)}
          groupByDate={false}
          h2hMap={h2hMap}
        />
      </section>

      {upcoming.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Upcoming Matches</h2>
            <Link
              href="/schedule"
              className="text-sm font-semibold text-[var(--wc-gold)] hover:text-yellow-300"
            >
              View all
            </Link>
          </div>
          <MatchList matches={upcoming} groupByDate={false} h2hMap={h2hMap} />
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Results</h2>
            <Link
              href="/schedule"
              className="text-sm font-semibold text-[var(--wc-gold)] hover:text-yellow-300"
            >
              View all
            </Link>
          </div>
          <MatchList matches={recent} groupByDate={false} />
        </section>
      )}

      {groups.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="section-kicker">Featured Groups</div>
              <h2 className="mt-1 text-xl font-bold text-white">Qualification Picture</h2>
            </div>
            <Link
              href="/groups"
              className="text-sm font-semibold text-[var(--wc-gold)] hover:text-yellow-300"
            >
              All groups
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <GroupTable key={g.group} group={g} qualifiedThirds={qualifiedThirds} />
            ))}
          </div>
        </section>
      )}

      {!hasData && (
        <section className="premium-panel rounded-[2rem] py-16 text-center">
          <Icon name="trophy" className="mx-auto h-10 w-10 text-[var(--wc-gold)]" />
          <p className="mt-4 text-slate-400">
            Match data will appear here once the tournament begins on June 11, 2026.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Make sure your <code className="text-slate-500">FOOTBALL_DATA_API_KEY</code> is set
            in <code className="text-slate-500">.env.local</code>.
          </p>
        </section>
      )}
    </div>
  );
}
