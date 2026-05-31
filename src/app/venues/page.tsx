import { getMatches } from "@/lib/api/client";

export const revalidate = 3600;

export const metadata = {
  title: "Venues | WC 2026",
};

interface VenueInfo {
  city: string;
  country: "USA" | "Canada" | "Mexico";
  countryFlag: string;
  capacity: number;
}

const VENUE_DATA: Record<string, VenueInfo> = {
  "SoFi Stadium": { city: "Los Angeles", country: "USA", countryFlag: "us", capacity: 70240 },
  "Rose Bowl Stadium": { city: "Pasadena (LA)", country: "USA", countryFlag: "us", capacity: 92542 },
  "Levi's Stadium": { city: "San Francisco Bay Area", country: "USA", countryFlag: "us", capacity: 68500 },
  "AT&T Stadium": { city: "Dallas", country: "USA", countryFlag: "us", capacity: 80000 },
  "NRG Stadium": { city: "Houston", country: "USA", countryFlag: "us", capacity: 72220 },
  "Hard Rock Stadium": { city: "Miami", country: "USA", countryFlag: "us", capacity: 64767 },
  "MetLife Stadium": { city: "New York / New Jersey", country: "USA", countryFlag: "us", capacity: 82500 },
  "Lincoln Financial Field": { city: "Philadelphia", country: "USA", countryFlag: "us", capacity: 69328 },
  "Gillette Stadium": { city: "Boston", country: "USA", countryFlag: "us", capacity: 65878 },
  "Lumen Field": { city: "Seattle", country: "USA", countryFlag: "us", capacity: 68740 },
  "Arrowhead Stadium": { city: "Kansas City", country: "USA", countryFlag: "us", capacity: 76416 },
  "BC Place": { city: "Vancouver", country: "Canada", countryFlag: "ca", capacity: 54500 },
  "BMO Field": { city: "Toronto", country: "Canada", countryFlag: "ca", capacity: 45736 },
  "Estadio Azteca": { city: "Mexico City", country: "Mexico", countryFlag: "mx", capacity: 87523 },
  "Estadio Akron": { city: "Guadalajara", country: "Mexico", countryFlag: "mx", capacity: 49850 },
  "Estadio BBVA": { city: "Monterrey", country: "Mexico", countryFlag: "mx", capacity: 53500 },
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
  try {
    const matches = await getMatches();
    for (const m of matches) {
      if (m.venue) {
        const match = findVenueData(m.venue);
        const key = match ? match[0] : m.venue;
        matchCounts[key] = (matchCounts[key] ?? 0) + 1;
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
      <div>
        <h1 className="text-3xl font-bold text-white">Venues</h1>
        <p className="text-slate-400 mt-1 text-sm">
          16 stadiums across 3 host nations — United States, Canada, and Mexico.
        </p>
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
              return (
                <div
                  key={name}
                  className={`bg-gradient-to-br ${COUNTRY_COLORS[country]} bg-slate-800/60 backdrop-blur-sm border rounded-xl p-5 space-y-3 hover:scale-[1.01] transition-transform`}
                >
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{name}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{info.city}</p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-xs text-slate-400">
                          {info.capacity.toLocaleString()} capacity
                        </span>
                      </div>
                    </div>

                    {count !== undefined && count > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white tabular-nums">
                          {count}
                        </div>
                        <div className="text-xs text-slate-500">
                          match{count !== 1 ? "es" : ""}
                        </div>
                      </div>
                    )}
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
