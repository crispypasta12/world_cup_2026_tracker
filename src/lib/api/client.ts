import type {
  Match,
  MatchesResponse,
  StandingsResponse,
  Team,
  TeamDetail,
  TeamsResponse,
} from "./types";

const BASE_URL = "https://api.football-data.org/v4";
const COMPETITION = "WC";

function getHeaders() {
  return {
    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "",
  };
}

async function apiFetch<T>(
  path: string,
  revalidate = 60
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`football-data.org error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getMatches(params?: {
  status?: string;
  stage?: string;
  matchday?: number;
}): Promise<Match[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.stage) query.set("stage", params.stage);
  if (params?.matchday) query.set("matchday", String(params.matchday));

  const qs = query.toString() ? `?${query.toString()}` : "";
  const data = await apiFetch<MatchesResponse>(
    `/competitions/${COMPETITION}/matches${qs}`,
    60
  );
  return data.matches;
}

export async function getStandings(): Promise<StandingsResponse> {
  return apiFetch<StandingsResponse>(
    `/competitions/${COMPETITION}/standings`,
    120
  );
}

export async function getTeams(): Promise<Team[]> {
  const data = await apiFetch<TeamsResponse>(
    `/competitions/${COMPETITION}/teams`,
    3600
  );
  return data.teams;
}

export async function getTeam(id: number): Promise<TeamDetail> {
  return apiFetch<TeamDetail>(`/teams/${id}`, 3600);
}

export async function getTeamMatches(id: number): Promise<Match[]> {
  const data = await apiFetch<MatchesResponse>(
    `/teams/${id}/matches?competitions=${COMPETITION}`,
    120
  );
  return data.matches;
}

export async function getMatch(id: number): Promise<Match> {
  return apiFetch<Match>(`/matches/${id}`, 30);
}
