import { NextRequest } from "next/server";

// Maps football-data.org team names → names used in the international results CSV
// https://github.com/martj42/international_results
const NAME_MAP: Record<string, string> = {
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
  "Cape Verde Islands": "Cape Verde",
  "Congo DR": "DR Congo",
  "United States": "United States",
  "South Korea": "South Korea",
  "Ivory Coast": "Ivory Coast",
  "Curaçao": "Curaçao",
  "Saudi Arabia": "Saudi Arabia",
  "New Zealand": "New Zealand",
};

function toCsvName(fdoName: string): string {
  return NAME_MAP[fdoName] ?? fdoName;
}

export interface H2HMatch {
  date: string;        // YYYY-MM-DD
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  tournament: string;
}

async function fetchH2H(teamA: string, teamB: string, limit: number): Promise<H2HMatch[]> {
  const csvA = toCsvName(teamA);
  const csvB = toCsvName(teamB);

  const res = await fetch(
    "https://raw.githubusercontent.com/martj42/international_results/master/results.csv",
    { next: { revalidate: 86400 } } // cache for 24h
  );

  if (!res.ok) throw new Error("Failed to fetch H2H data");

  const text = await res.text();
  const lines = text.split("\n");

  const matches: H2HMatch[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV format: date,home_team,away_team,home_score,away_score,tournament,city,country,neutral
    // Use a simple split — values don't contain commas
    const cols = line.split(",");
    if (cols.length < 6) continue;

    const [date, home, away, homeScoreRaw, awayScoreRaw, tournament] = cols;

    const isMatch =
      (home === csvA && away === csvB) ||
      (home === csvB && away === csvA);

    if (!isMatch) continue;

    const homeScore = parseFloat(homeScoreRaw);
    const awayScore = parseFloat(awayScoreRaw);

    // Skip future/unplayed matches (score is NA)
    if (isNaN(homeScore) || isNaN(awayScore)) continue;

    matches.push({
      date,
      home,
      away,
      homeScore,
      awayScore,
      tournament,
    });
  }

  // Sort most recent first, return last `limit` matches
  matches.sort((a, b) => b.date.localeCompare(a.date));
  return matches.slice(0, limit);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const home = searchParams.get("home");
  const away = searchParams.get("away");
  const limit = Math.min(Number(searchParams.get("limit") ?? "10"), 20);

  if (!home || !away) {
    return Response.json({ error: "home and away query params required" }, { status: 400 });
  }

  try {
    const matches = await fetchH2H(home, away, limit);
    return Response.json({ matches });
  } catch {
    return Response.json({ matches: [] });
  }
}
