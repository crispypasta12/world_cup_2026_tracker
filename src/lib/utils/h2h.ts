import type { Match } from "@/lib/api/types";

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
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  tournament: string;
}

export interface H2HRecord {
  homeWins: number;
  draws: number;
  awayWins: number;
  total: number;
}

// Keyed by sorted pair: `${teamA}|||${teamB}`
type H2HIndex = Map<string, H2HMatch[]>;

let indexCache: H2HIndex | null = null;
let indexCachedAt = 0;
const INDEX_TTL_MS = 24 * 60 * 60 * 1000;

async function getH2HIndex(): Promise<H2HIndex> {
  const now = Date.now();
  if (indexCache && now - indexCachedAt < INDEX_TTL_MS) return indexCache;

  const res = await fetch(
    "https://raw.githubusercontent.com/martj42/international_results/master/results.csv",
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("Failed to fetch H2H CSV");

  const text = await res.text();
  const index: H2HIndex = new Map();
  const lines = text.split("\n");

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(",");
    if (cols.length < 6) continue;
    const [date, home, away, hs, as_, tournament] = cols;
    const homeScore = parseFloat(hs);
    const awayScore = parseFloat(as_);
    if (isNaN(homeScore) || isNaN(awayScore)) continue;

    const key = [home, away].sort().join("|||");
    if (!index.has(key)) index.set(key, []);
    index.get(key)!.push({ date, home, away, homeScore, awayScore, tournament });
  }

  indexCache = index;
  indexCachedAt = now;
  return index;
}

function computeRecord(
  all: H2HMatch[],
  csvHome: string,
  homeShortName: string | undefined,
  limit: number
): H2HRecord | null {
  const recent = all.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  if (recent.length === 0) return null;

  let homeWins = 0, draws = 0, awayWins = 0;
  for (const m of recent) {
    const homeIsCurrentHome = m.home === csvHome || m.home === homeShortName;
    const h = homeIsCurrentHome ? m.homeScore : m.awayScore;
    const a = homeIsCurrentHome ? m.awayScore : m.homeScore;
    if (h > a) homeWins++;
    else if (h === a) draws++;
    else awayWins++;
  }
  return { homeWins, draws, awayWins, total: recent.length };
}

export async function fetchH2H(
  teamA: string,
  teamB: string,
  limit: number
): Promise<H2HMatch[]> {
  const csvA = toCsvName(teamA);
  const csvB = toCsvName(teamB);
  const index = await getH2HIndex();
  const key = [csvA, csvB].sort().join("|||");
  return (index.get(key) ?? []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

function isEligible(match: Match): boolean {
  const { status, homeTeam, awayTeam } = match;
  if (status !== "SCHEDULED" && status !== "TIMED") return false;
  if (!homeTeam?.id || !awayTeam?.id) return false;
  const home = homeTeam.name;
  const away = awayTeam.name;
  if (!home || !away) return false;
  if (home.startsWith("Winner") || home.startsWith("Loser")) return false;
  if (away.startsWith("Winner") || away.startsWith("Loser")) return false;
  return true;
}

export async function fetchH2HBatch(
  matches: Match[]
): Promise<Record<number, H2HRecord>> {
  const eligible = matches.filter(isEligible);
  if (eligible.length === 0) return {};

  const index = await getH2HIndex();
  const result: Record<number, H2HRecord> = {};

  for (const match of eligible) {
    const csvHome = toCsvName(match.homeTeam.name);
    const csvAway = toCsvName(match.awayTeam.name);
    const key = [csvHome, csvAway].sort().join("|||");
    const record = computeRecord(index.get(key) ?? [], csvHome, match.homeTeam.shortName, 20);
    if (record) result[match.id] = record;
  }

  return result;
}
