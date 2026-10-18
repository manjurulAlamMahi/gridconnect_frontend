import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { removeUserInfo } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  // Only clear auth state on 401 errors (not 403 which means authorized but forbidden)
  // Also skip clearing for profile endpoints since new users won't have profiles yet
  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : args?.url || "";
    const isProfileEndpoint =
      url.includes("getProfile") ||
      url.includes("profile/completion") ||
      url.includes("team/getProfile");

    // Don't clear auth for profile queries that fail - new users won't have profiles
    if (!isProfileEndpoint) {
      api.dispatch(removeUserInfo());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "auth",
    "user",
    "homeBanner",
    "coreFeature",
    "connectCompete",
    "driverPlan",
    "teamPlan",
    "join",
    "driver",
    "team",
    "socialMedia",
    "contactInfo",
    "subscription",
  ],
});
