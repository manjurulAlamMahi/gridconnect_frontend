export type DriverRequest = {
  id: number;
  driver_id: number;
  opportunity_detail_id: number;
  accepted: string;
  opportunity: {
    id: number;
    title: string;
    location: string;
    description: string;
    team_support: string;
    budget_display: string;
  } | null;
  driver: {
    id: number;
    name: string;
    nationality: string;
    image: string | null;
    license_type_id: number;
    license_type?: {
      type: string;
    };
    experience: number;
    bio: string;
    date_of_birth?: string;
    racing_stats?: {
      championships: number;
      podiums: {
        total: number;
      };
    };
    disciplines?: {
      id: number;
      name: string;
    }[];
    achievements?: {
      id: number;
      title: string;
    }[];
    user: {
      email: string;
    };
  };
};
