export type DriverPlanDuration = "monthly" | "yearly";

export interface IDriverPlan {
  id: number;
  type: "driver" | "team" | string;
  name: string;
  duration: DriverPlanDuration;
  description: string;
  features: string;
  included_tokens: number;
  price: string;
  short_description?: string;
}

export interface DriverPlanResponse {
  status: "success" | "error";
  message: string;
  data: IDriverPlan[];
}
