export interface LicenseType {
  id: number;
  type: string;
}

export interface DriverDiscipline {
  id: number;
  name: string;
  pivot: {
    driver_id: number;
    discipline_id: number;
  };
}

export interface DriverAchievement {
  id: number;
  driver_id: number;
  title: string;
  year: number;
  position: string;
  attachment: string | null;
}

export interface ActiveDriver {
  id: number;
  user_id: number;
  image: string | null;
  name: string;
  date_of_birth: string;
  team_id: number | null;
  nationality: string | null;
  bio: string | null;
  cv: string | null;
  license_type_id: number;
  experience: number | null;
  license_type: LicenseType;
  disciplines: DriverDiscipline[];
  achievements: DriverAchievement[];
}

export interface GetActiveDriversResponse {
  status: string;
  message: string;
  data: ActiveDriver[];
}
