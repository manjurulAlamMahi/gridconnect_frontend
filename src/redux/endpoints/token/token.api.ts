import { baseApi } from "@/redux/api";
import type {
  IAvailableTokensResponse,
  ITokenPackagesResponse,
  ITokenPurchaseHistoryResponse,
} from "@/types/token";

export const tokenApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTokenPackages: build.query<ITokenPackagesResponse, { role: string }>({
      query: () => ({
        url: "/tokenPurchase/packages",
        method: "GET",
      }),
    }),
    buyToken: build.mutation<
      { success: boolean; data: { checkout_url: string; session_id: string } },
      { package_id: string | number }
    >({
      query: (body) => ({
        url: "/tokenPurchase/payment/checkout",
        method: "POST",
        body,
      }),
    }),
    confirmTokenPayment: build.query<
      { success: boolean; message: string },
      { session_id: string }
    >({
      query: ({ session_id }) => ({
        url: `/tokenPurchase/payment/checkout/success?session_id=${session_id}`,
        method: "GET",
      }),
    }),
    cancelTokenPayment: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/tokenPurchase/payment/checkout/cancel",
        method: "GET",
      }),
    }),
    getTokenPurchaseHistory: build.query<ITokenPurchaseHistoryResponse, void>({
      query: () => ({
        url: "/tokenPurchase/purchase/history",
        method: "GET",
      }),
    }),
    getAvailableTokens: build.query<IAvailableTokensResponse, { role: string }>({
      query: () => ({
        url: "/tokenPurchase/available/tokens",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTokenPackagesQuery,
  useBuyTokenMutation,
  useConfirmTokenPaymentQuery,
  useCancelTokenPaymentMutation,
  useGetTokenPurchaseHistoryQuery,
  useGetAvailableTokensQuery,
} = tokenApi;
