import type {
  GetTeamDashboardOverviewResponse,
  GetTeamOpportunitiesResponse,
  GetTeamVerificationStatusResponse,
} from "@/types/team";
import type { GetActiveDriversResponse } from "@/types/active-driver";
import type { GetTeamRacingStatsResponse } from "@/types/team";
import type {
  GetTeamProfileResponse,
  ResetTeamPasswordResponse,
  GetMatchingDriversResponse,
  StoreTeamOpportunityResponse,
} from "@/types/team";
import type { SearchDriversResponse } from "@/types/driver";
import { baseApi } from "../../api";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    setupTeamPageOne: build.mutation({
      query: (data) => ({
        url: "/team/setupTeamPageOne",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),
    setupTeamPageTwo: build.mutation({
      query: (data) => ({
        url: "/team/setupTeamPageTwo",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),
    setupTeamPageThree: build.mutation({
      query: (data) => ({
        url: "/team/setupTeamPageThree",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),

    updateTeamInfo: build.mutation({
      query: (data) => ({
        url: "/team/updateTeamInfo",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),

    resetTeamPassword: build.mutation<
      ResetTeamPasswordResponse,
      { password: string; password_confirmation: string }
    >({
      query: (data) => ({
        url: "/team/resetpass",
        method: "POST",
        body: data,
      }),
    }),

    getTeamProfile: build.query<GetTeamProfileResponse, void>({
      query: () => ({
        url: "/team/getProfile",
      }),
      providesTags: ["team"],
    }),

    getTeamOpportunities: build.query<GetTeamOpportunitiesResponse, void>({
      query: () => ({
        url: "/team-opportunity",
      }),
      providesTags: ["team"],
    }),

    getActiveDrivers: build.query<GetActiveDriversResponse, void>({
      query: () => ({
        url: "/active-drivers",
      }),
      providesTags: ["team"],
    }),

    getTeamRacingStats: build.query<GetTeamRacingStatsResponse, void>({
      query: () => ({
        url: "/team/profile/racing/stat",
      }),
      providesTags: ["team"],
    }),

    getTeamDashboardOverview: build.query<
      GetTeamDashboardOverviewResponse,
      void
    >({
      query: () => ({
        url: "/team/profile/dashboard/overview",
      }),
      providesTags: ["team"],
    }),

    getTeamVerificationStatus: build.query<
      GetTeamVerificationStatusResponse,
      void
    >({
      query: () => ({
        url: "/team/profile/verifiedStatus",
      }),
      providesTags: ["team"],
    }),

    searchDrivers: build.query<
      SearchDriversResponse,
      {
        search?: string;
        discipline_id?: number;
        license_type_id?: number;
        nationality?: string;
        page?: number;
      }
    >({
      query: (params) => {
        const queryParams: Record<string, string | number | undefined> = {};

        if (params?.search) queryParams.search = params.search;
        if (params?.discipline_id)
          queryParams.discipline_id = params.discipline_id;
        if (params?.license_type_id)
          queryParams.license_type_id = params.license_type_id;
        if (params?.nationality) queryParams.nationality = params.nationality;
        if (params?.page) queryParams.page = params.page;

        return {
          url: "/team/profile/search/drivers",
          params: queryParams,
        };
      },
      providesTags: ["team"],
    }),

    getMatchingDrivers: build.query<GetMatchingDriversResponse, void>({
      query: () => ({
        url: "/team/profile/drivers/matching",
      }),
      providesTags: ["team"],
    }),
    storeTeamOpportunity: build.mutation<StoreTeamOpportunityResponse, FormData>({
      query: (data) => ({
        url: "/team-opportunity/store",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),
  }),
});

export const {
  useSetupTeamPageOneMutation,
  useSetupTeamPageTwoMutation,
  useSetupTeamPageThreeMutation,
  useUpdateTeamInfoMutation,
  useResetTeamPasswordMutation,
  useGetTeamProfileQuery,
  useGetTeamOpportunitiesQuery,
  useGetActiveDriversQuery,
  useGetTeamRacingStatsQuery,
  useGetTeamDashboardOverviewQuery,
  useGetTeamVerificationStatusQuery,
  useSearchDriversQuery,
  useGetMatchingDriversQuery,
  useStoreTeamOpportunityMutation,
} = teamApi;
