export interface Discipline {
  id: number;
  name: string;
}

export interface DisciplineResponse {
  status: string;
  message: string;
  data: Discipline[];
}
