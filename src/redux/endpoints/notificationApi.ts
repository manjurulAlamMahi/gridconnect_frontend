import type { RecentActivityResponse } from "@/types/notification";
import { baseApi } from "../api";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivity: builder.query<RecentActivityResponse, void>({
      query: () => ({
        url: "/recent/activity",
        method: "GET",
      }),
      providesTags: ["user", "team", "driver"],
    }),
  }),
});

export const { useGetRecentActivityQuery } = notificationApi;
