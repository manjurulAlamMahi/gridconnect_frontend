export interface DriverDocument {
  id: number;
  driver_id: number;
  govt_id: string;
  racing_license: string;
  govt_id_verified: number;
  racing_license_verified: number;
}

export interface SetupDriverPageThreeResponse {
  status: string;
  message: string;
  data: {
    documents: DriverDocument;
  };
}

export interface Discipline {
  id: number;
  name: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  attachment?: string;
}

export interface DriverUser {
  id: number;
  name: string;
  email: string;
  date_of_birth: string;
  nationality: string | null;
  cv: string | null;
  license_type: string;
  image: string | null;
  bio: string | null;
  experience: string | null;
  disciplines: string[] | Discipline[];
  achievements: Achievement[];
  documents: DriverDocument | null;
}

export interface DriverProfileResponse {
  status: string;
  message: string;
  data: {
    user: DriverUser;
  };
}

export interface DriverProfileCompletionResponse {
  status: string;
  message: string;
  data: {
    profile_completion_percentage: number;
  };
}

export interface OpportunityDisciplinePivot {
  opportunity_id: number;
  discipline_id: number;
}

export interface OpportunityDiscipline {
  id: number;
  name: string;
  pivot: OpportunityDisciplinePivot;
}

export interface MatchedOpportunity {
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
  application_status?: string;
  budget_display: string;
  disciplines: OpportunityDiscipline[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface MatchedOpportunitiesResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: MatchedOpportunity[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface DriverDisciplinePivot {
  driver_id: number;
  discipline_id: number;
}

export interface DriverDiscipline {
  id: number;
  name: string;
  pivot: DriverDisciplinePivot;
}

export interface DriverAchievement {
  id: number;
  driver_id: number;
  title: string;
  year: number;
  position: string;
  attachment: string | null;
}

export interface DriverLicenseType {
  id: number;
  type: string;
}

export interface DriverUserInfo {
  id: number;
  name: string | null;
  email: string;
  avatar: string | null;
  role: string;
  is_premium: number;
  device_id: string | null;
  fcm_token: string | null;
  phone: string | null;
  date_of_birth: string | null;
  position: string | null;
  about: string | null;
  address: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  google_id: string | null;
  facebook_id: string | null;
  zip_code: string | null;
  otp: string | null;
  otp_expired_at: string | null;
  otp_verified_at: string | null;
}

export interface SearchedDriver {
  id: number;
  user_id: number;
  image: string;
  name: string;
  date_of_birth: string;
  team_id: number | null;
  nationality: string;
  bio: string | null;
  cv: string;
  license_type_id: number;
  experience: string | null;
  user: DriverUserInfo;
  license_type: DriverLicenseType;
  disciplines: DriverDiscipline[];
  achievements: DriverAchievement[];
}

export interface DriverComprehensiveStatusResponse {
  status: string;
  message: string;
  data: {
    verification_status: {
      status: string;
      govt_id_verified: string;
      racing_license_verified: string;
    };
    subscription: {
      id: number;
      plan_id: number;
      plan_name: string;
      status: string;
      current_tokens: number;
      purchased_tokens: number;
      total_tokens: number;
      current_period_end: string;
    } | null;
    profile_views: {
      total_views: number;
      unique_team_views: number;
    };
  };
}

export interface DriverRacingActivityResponse {
  status: string;
  message: string;
  data: {
    profile_rating: {
      total_ratings: number;
      average_rating: number;
    };
    response_rate: number;
    total_matched_teams: number;
  };
}

export interface SearchDriversResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: SearchedDriver[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
