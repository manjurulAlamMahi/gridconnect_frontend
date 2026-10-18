export interface LicenceType {
  id: number;
  type: string;
}

export interface LicenceTypeResponse {
  status: string;
  message: string;
  data: LicenceType[];
}
