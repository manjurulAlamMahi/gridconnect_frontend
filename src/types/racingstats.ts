export interface Podiums {
  total: number;
  first: number;
  second: number;
  third: number;
}

export interface RacingStats {
  experience: number;
  disciplines_count: number;
  podiums: Podiums;
  championships: number;
}

export interface GetRacingStatsResponse {
  status: string;
  message: string;
  data: {
    stats: RacingStats;
  };
}
