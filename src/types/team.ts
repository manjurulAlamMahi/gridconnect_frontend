export interface Discipline {
  id: number;
  name: string;
  pivot?: {
    team_id: number;
    discipline_id: number;
  };
}

export interface TeamAchievement {
  id: number;
  team_id: number;
  title: string;
  year: number;
  position: string;
  attachment: string | null;
}

export interface TeamProfile {
  id: number;
  user_id: number;
  team_logo: string | null;
  team_name: string;
  contact_name: string;
  location: string;
  website: string;
  short_bio: string;
  active_season: string | null;
  competetion_license: string | null;
  license_verified: number;
  disciplines: Discipline[];
  achievements: TeamAchievement[];
}

export interface SetupTeamPageOneResponse {
  status: string;
  message: string;
  data: TeamProfile;
}

export interface TeamMatch {
  team_id: number;
  team_name: string;
  team_logo: string;
  matched_disciplines: number;
  total_disciplines: number;
  match_percentage: number;
}

export interface GetTeamMatchingResponse {
  status: string;
  message: string;
  data: TeamMatch[];
}

export interface OpportunityDiscipline {
  id: number;
  name: string;
  pivot: {
    opportunity_id: number;
    discipline_id: number;
  };
}

export interface TeamOpportunity {
  id: number;
  team_id: number;
  title: string;
  vehicle_image: string | null;
  license_type_id: number;
  currency: string;
  min_budget: string;
  max_budget: string;
  description: string;
  team_support: string | null;
  experience: string | null;
  location: string | null;
  deadline: string | null;
  available_seat: string | null;
  contract_duration: string | null;
  status: string;
  budget_display: string;
  disciplines: OpportunityDiscipline[];
}

export interface GetTeamOpportunitiesResponse {
  status: string;
  message: string;
  data: TeamOpportunity[];
}

export interface TeamRacingStats {
  active_season: number;
  disciplines_count: number;
  podiums: {
    total: number;
    first: number;
    second: number;
    third: number;
  };
  championships: number;
}

export interface GetTeamRacingStatsResponse {
  status: string;
  message: string;
  data: {
    stats: TeamRacingStats;
  };
}

export interface GetTeamProfileResponse {
  status: string;
  message: string;
  data: {
    team: TeamProfile;
  };
}

export interface TeamDashboardOverview {
  opportunities: {
    total: number;
    active: number;
    inactive: number;
  };
  conversations: {
    recent_count: number;
    period_days: number;
    from_date: string;
    to_date: string;
  };
  subscription:
    | null
    | {
        plan_name?: string;
        name?: string;
        renews_at?: string;
        renewal_date?: string;
        expires_at?: string;
      };
}

export interface GetTeamDashboardOverviewResponse {
  status: string;
  message: string;
  data: TeamDashboardOverview;
}

export interface TeamVerificationStatus {
  status: string;
  license_verified: string;
}

export interface GetTeamVerificationStatusResponse {
  status: string;
  message: string;
  data: TeamVerificationStatus;
}

export interface ResetTeamPasswordResponse {
  status: string;
  message: string;
  data: null;
}

export interface GetMatchingDriversResponse {
  status: string;
  message: string;
  data: MatchingDriver[];
}

export interface MatchingDriverDiscipline {
  id: number;
  name: string;
}

export interface MatchingDriverAchievement {
  title: string;
  year: string;
  position: string;
}

export interface MatchingDriver {
  driver_id: number;
  name: string;
  nationality: string;
  experience: string | null;
  bio: string | null;
  image: string;
  cv: string | null;
  license_type: string;
  disciplines: MatchingDriverDiscipline[];
  achievements: MatchingDriverAchievement[];
  matched_disciplines: number;
  total_disciplines: number;
  match_percentage: number;
  // Legacy fields for backward compatibility
  driver_name?: string;
  driver_image?: string;
}

export interface StoreTeamOpportunityResponse {
  status: string;
  message: string;
  data: {
    team_id: number;
    title: string;
    license_type_id: string;
    max_budget: string | number;
    min_budget: string | number;
    description: string;
    team_support: string;
    experience: string;
    location: string;
    deadline: string;
    available_seat: string;
    contract_duration: string;
    currency: string;
    status: "active" | "inactive";
    id: number;
    budget_display: string;
  };
}
