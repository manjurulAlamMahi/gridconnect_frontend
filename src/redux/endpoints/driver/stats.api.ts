import type { GetRacingStatsResponse } from "@/types/racingstats";
import type { GetTeamMatchingResponse } from "@/types/team";
import { baseApi } from "../../api";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      getRacingStats: build.query<GetRacingStatsResponse, void>({
        query: () => ({
          url: "/driver/profile/racingStat",
        }),
        providesTags: ["driver"],
      }),

      getTeamMatching: build.query<GetTeamMatchingResponse, void>({
        query: () => ({
          url: "/driver/profile/team/matching",
        }),
        providesTags: ["driver"],
      }),
    };
  },
});

export const { useGetRacingStatsQuery, useGetTeamMatchingQuery } = statsApi;
