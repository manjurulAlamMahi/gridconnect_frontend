export interface CoreFeature {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface CoreFeatureResponse {
  status: "success" | "error";
  message: string;
  data: CoreFeature[];
}
