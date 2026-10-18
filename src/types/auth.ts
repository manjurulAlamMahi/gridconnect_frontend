export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: "success";
  message: string;
  data: {
    otp: number;
  };
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  status: "success";
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

export interface ResetPasswordResponse {
  status: "success";
  message: string;
}
