import { baseApi } from "@/redux/api";
import type {
  ICancelSubscriptionResponse,
  IPlansResponse,
  IPaymentHistoryResponse,
  ICurrentSubscriptionResponse
} from "@/types/subscription";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPlans: build.query<IPlansResponse, void>({
      query: () => ({
        url: "/subscription/plans",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    createCheckoutSession: build.mutation<
      { checkout_url: string; session_id: string },
      { plan_id: number | string }
    >({
      query: (body) => ({
        url: "/subscription/stripe/checkout/session",
        method: "POST",
        body,
      }),
    }),
    upgradeSubscription: build.mutation<
      { success: boolean; message: string },
      { plan_id: number | string }
    >({
      query: (body) => ({
        url: "/subscription/upgrade",
        method: "POST",
        body,
      }),
      invalidatesTags: ["subscription"],
    }),
    confirmPaymentSuccess: build.query<
      { success: boolean; message: string },
      { session_id: string }
    >({
      query: ({ session_id }) => ({
        url: `/subscription/stripe/success?session_id=${session_id}`,
        method: "GET",
      }),
    }),
    getCurrentSubscription: build.query<ICurrentSubscriptionResponse, void>({
      query: () => ({
        url: "/subscription/current",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    getPaymentHistory: build.query<IPaymentHistoryResponse, void>({
      query: () => ({
        url: "/subscription/stripe/invoice",
        method: "GET",
      }),
    }),
    cancelSubscription: build.mutation<ICancelSubscriptionResponse, void>({
      query: () => ({
        url: "/subscription/cancel",
        method: "POST",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const { useGetPlansQuery, useCreateCheckoutSessionMutation, useConfirmPaymentSuccessQuery, useGetCurrentSubscriptionQuery, useUpgradeSubscriptionMutation, useGetPaymentHistoryQuery, useCancelSubscriptionMutation } = subscriptionApi;
