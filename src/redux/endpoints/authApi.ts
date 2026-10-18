import { baseApi } from "../api";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    forgotPassword: build.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgotPassword",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    verifyOTPPassword: build.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: `/auth/verifyOtp`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    resendOTP: build.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: `/resend-otp`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    resetPassword: build.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: `/auth/resetPassword`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    userLogout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["auth", "user"],
    }),
  }),
});

export const {
  useUserLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useUserLogoutMutation,
} = authApi;
