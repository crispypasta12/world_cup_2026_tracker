export interface Area {
  id: number;
  name: string;
  code: string;
  flag?: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem?: string;
  area: Area;
  currentSeason?: Season;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday?: number;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  area: Area;
}

export interface Score {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT";
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday?: number;
  stage: string;
  group?: string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  venue?: string;
}

export interface StandingEntry {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

export interface StandingTable {
  stage: string;
  type: string;
  group?: string;
  table: StandingEntry[];
}

export interface SquadMember {
  id: number;
  name: string;
  position: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface TeamDetail extends Team {
  founded?: number;
  venue?: string;
  squad: SquadMember[];
}

// API response shapes
export interface MatchesResponse {
  matches: Match[];
  resultSet?: {
    count: number;
    competitions: string;
    first: string;
    last: string;
    played: number;
  };
}

export interface StandingsResponse {
  competition: Competition;
  season: Season;
  standings: StandingTable[];
}

export interface TeamsResponse {
  competition: Competition;
  season: Season;
  teams: Team[];
}
