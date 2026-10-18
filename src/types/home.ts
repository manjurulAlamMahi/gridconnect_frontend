export interface ConnectCompete {
  id: number;
  title: string;
  short_description: string;
}

export interface ConnectCompeteResponse {
  status: "success" | "error";
  message: string;
  data: ConnectCompete[];
}

export interface SocialMedia {
  id: number;
  name: string;
  url: string;
  image: string | null;
  status: string;
}

export interface GetSocialMediaResponse {
  status: boolean;
  message: string;
  code: number;
  data: SocialMedia[];
}

export interface ContactInfo {
  id: number;
  email: string | null;
  address: string | null;
  phone: string | null;
}

export interface GetContactInfoResponse {
  status: string;
  message: string;
  data: ContactInfo[];
}
