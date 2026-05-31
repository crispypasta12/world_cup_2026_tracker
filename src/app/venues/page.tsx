import { getMatches } from "@/lib/api/client";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatMatchDate } from "@/lib/utils/date";
import { matchTitle, STAGE_LABELS } from "@/lib/utils/match";

export const revalidate = 3600;

export const metadata = {
  title: "Venues | WC 2026",
};

interface VenueInfo {
  city: string;
  country: "USA" | "Canada" | "Mexico";
  countryFlag: string;
  capacity: number;
  timezone: string;
}

const VENUE_DATA: Record<string, VenueInfo> = {
  "SoFi Stadium": { city: "Los Angeles", country: "USA", countryFlag: "us", capacity: 70240, timezone: "PT" },
  "Rose Bowl Stadium": { city: "Pasadena (LA)", country: "USA", countryFlag: "us", capacity: 92542, timezone: "PT" },
  "Levi's Stadium": { city: "San Francisco Bay Area", country: "USA", countryFlag: "us", capacity: 68500, timezone: "PT" },
  "AT&T Stadium": { city: "Dallas", country: "USA", countryFlag: "us", capacity: 80000, timezone: "CT" },
  "NRG Stadium": { city: "Houston", country: "USA", countryFlag: "us", capacity: 72220, timezone: "CT" },
  "Hard Rock Stadium": { city: "Miami", country: "USA", countryFlag: "us", capacity: 64767, timezone: "ET" },
  "MetLife Stadium": { city: "New York / New Jersey", country: "USA", countryFlag: "us", capacity: 82500, timezone: "ET" },
  "Lincoln Financial Field": { city: "Philadelphia", country: "USA", countryFlag: "us", capacity: 69328, timezone: "ET" },
  "Gillette Stadium": { city: "Boston", country: "USA", countryFlag: "us", capacity: 65878, timezone: "ET" },
  "Lumen Field": { city: "Seattle", country: "USA", countryFlag: "us", capacity: 68740, timezone: "PT" },
  "Arrowhead Stadium": { city: "Kansas City", country: "USA", countryFlag: "us", capacity: 76416, timezone: "CT" },
  "BC Place": { city: "Vancouver", country: "Canada", countryFlag: "ca", capacity: 54500, timezone: "PT" },
  "BMO Field": { city: "Toronto", country: "Canada", countryFlag: "ca", capacity: 45736, timezone: "ET" },
  "Estadio Azteca": { city: "Mexico City", country: "Mexico", countryFlag: "mx", capacity: 87523, timezone: "CST" },
  "Estadio Akron": { city: "Guadalajara", country: "Mexico", countryFlag: "mx", capacity: 49850, timezone: "CST" },
  "Estadio BBVA": { city: "Monterrey", country: "Mexico", countryFlag: "mx", capacity: 53500, timezone: "CST" },
};

function findVenueData(apiName: string): [string, VenueInfo] | null {
  if (!apiName) return null;
  const lower = apiName.toLowerCase();
  for (const [key, info] of Object.entries(VENUE_DATA)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return [key, info];
    }
  }
  return null;
}

const COUNTRY_COLORS: Record<string, string> = {
  USA: "from-blue-900/40 to-red-900/20 border-blue-500/20",
  Canada: "from-red-900/40 to-red-900/20 border-red-500/20",
  Mexico: "from-green-900/40 to-green-900/20 border-green-500/20",
};

export default async function VenuesPage() {
  // Build match counts by venue from API
  const matchCounts: Record<string, number> = {};
  const featuredMatches: Record<string, { title: string; date: string; stage: string } | undefined> = {};
  try {
    const matches = await getMatches();
    for (const m of matches) {
      if (m.venue) {
        const match = findVenueData(m.venue);
        const key = match ? match[0] : m.venue;
        matchCounts[key] = (matchCounts[key] ?? 0) + 1;
        const current = featuredMatches[key];
        const rank = ["FINAL", "THIRD_PLACE", "SEMI_FINALS", "QUARTER_FINALS", "LAST_16", "LAST_32", "GROUP_STAGE"];
        const currentRank = current ? rank.indexOf(current.stage) : Number.POSITIVE_INFINITY;
        const nextRank = rank.indexOf(m.stage);
        if (!current || (nextRank !== -1 && nextRank < currentRank)) {
          featuredMatches[key] = {
            title: matchTitle(m),
            date: formatMatchDate(m.utcDate),
            stage: m.stage,
          };
        }
      }
    }
  } catch {
    // No match counts — still show static venue info
  }

  const grouped = {
    USA: Object.entries(VENUE_DATA).filter(([, v]) => v.country === "USA"),
    Canada: Object.entries(VENUE_DATA).filter(([, v]) => v.country === "Canada"),
    Mexico: Object.entries(VENUE_DATA).filter(([, v]) => v.country === "Mexico"),
  };

  return (
    <div className="space-y-10">
      <div className="premium-panel overflow-hidden rounded-[2rem]">
        <div className="venue-visual" />
        <div className="p-6 sm:p-8">
          <div className="section-kicker">Host Cities</div>
          <h1 className="mt-2 text-4xl font-black text-white">Venues</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            16 stadiums across 3 host nations, from opening night in Mexico City to the final in New York / New Jersey.
          </p>
        </div>
      </div>

      {(["USA", "Canada", "Mexico"] as const).map((country) => (
        <section key={country}>
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/24x18/${grouped[country][0][1].countryFlag}.png`}
              alt={`${country} flag`}
              width={24}
              height={18}
              className="rounded-sm"
            />
            <h2 className="text-xl font-bold text-white">{country}</h2>
            <span className="text-slate-500 text-sm">
              {grouped[country].length} venue{grouped[country].length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[country].map(([name, info]) => {
              const count = matchCounts[name];
              const featured = featuredMatches[name];
              return (
                <div
                  key={name}
                  className={`overflow-hidden rounded-2xl border bg-slate-800/60 backdrop-blur-sm transition-transform hover:-translate-y-1 ${COUNTRY_COLORS[country]}`}
                >
                  <div className="venue-visual min-h-[96px]">
                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-xs font-black text-white backdrop-blur">
                      {info.timezone}
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="font-black text-white text-lg leading-tight">{name}</h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-400">
                        <Icon name="map-pin" className="h-3.5 w-3.5" />
                        {info.city}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <Icon name="users" className="mb-2 h-4 w-4 text-slate-500" />
                        <div className="text-sm font-black text-white">
                          {info.capacity.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          capacity
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <Icon name="calendar" className="mb-2 h-4 w-4 text-slate-500" />
                        <div className="text-sm font-black text-white">
                          {count ?? 0}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          matches
                        </div>
                      </div>
                    </div>

                    {featured && (
                      <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--wc-gold)]">
                          Biggest listed match
                        </div>
                        <div className="mt-1 truncate text-sm font-bold text-white">
                          {featured.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {STAGE_LABELS[featured.stage] ?? featured.stage} / {featured.date}
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/schedule?venue=${encodeURIComponent(name)}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
                    >
                      View matches at this venue
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
