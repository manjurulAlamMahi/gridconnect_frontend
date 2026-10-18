import type { MatchedOpportunitiesResponse } from "@/types/driver";
import { baseApi } from "../../api";

export const searchTeamApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      getMatchedOpportunities: build.query<
        MatchedOpportunitiesResponse,
        { page?: number; per_page?: number }
      >({
        query: (params) => ({
          url: "/driver/profile/opportunity/details",
          params: {
            page: params?.page,
            per_page: params?.per_page,
          },
        }),
        providesTags: ["driver"],
      }),

      searchOpportunities: build.query<
        MatchedOpportunitiesResponse,
        {
          title?: string;
          budget_range?: string;
          experience?: string;
          page?: number;
          per_page?: number;
        }
      >({
        query: (params) => ({
          url: "/driver/profile/opportunity/search",
          params: {
            title: params?.title,
            budget_range: params?.budget_range,
            experience: params?.experience,
            page: params?.page,
            per_page: params?.per_page,
          },
        }),
        providesTags: ["driver"],
      }),

      filterOpportunities: build.query<
        MatchedOpportunitiesResponse,
        {
          location?: string;
          discipline?: string;
          license_type_id?: number;
          min_budget?: string;
          max_budget?: string;
          page?: number;
          per_page?: number;
        }
      >({
        query: (params) => ({
          url: "/driver/profile/opportunity/filters",
          params: {
            location: params?.location,
            discipline: params?.discipline,
            license_type_id: params?.license_type_id,
            min_budget: params?.min_budget,
            max_budget: params?.max_budget,
            page: params?.page,
            per_page: params?.per_page,
          },
        }),
        providesTags: ["driver"],
      }),

      joinTeam: build.mutation<any, { opportunity_detail_id: string | number }>(
        {
          query: (body) => ({
            url: "/driver/join-team",
            method: "POST",
            body,
          }),
          invalidatesTags: ["driver"],
        },
      ),
    };
  },
});

export const {
  useGetMatchedOpportunitiesQuery,
  useSearchOpportunitiesQuery,
  useFilterOpportunitiesQuery,
  useJoinTeamMutation,
} = searchTeamApi;
