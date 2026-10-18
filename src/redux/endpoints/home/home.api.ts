import type { DriverPlanResponse } from "@/types/driverplan";
import type {
  GetSocialMediaResponse,
  GetContactInfoResponse,
} from "@/types/home";
import { baseApi } from "../../api";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHomeBanners: build.query({
      query: () => ({
        url: "/homePage/banner/index",
        method: "GET",
      }),
      providesTags: ["homeBanner"],
    }),

    getCoreFeatures: build.query({
      query: () => ({
        url: "/core/feature/index",
        method: "GET",
      }),
      providesTags: ["coreFeature"],
    }),

    getConnectCompete: build.query({
      query: () => ({
        url: "/homePage/connectCompete",
        method: "GET",
      }),
      providesTags: ["connectCompete"],
    }),
    getDriverPlan: build.query<DriverPlanResponse, void>({
      query: () => ({
        url: "/allPlans/plans",
        method: "GET",
      }),
      providesTags: ["driverPlan"],
    }),
    getTeamPlans: build.query({
      query: () => ({
        url: "/team/planApi/index",
        method: "GET",
      }),
      providesTags: ["teamPlan"],
    }),
    getSocialMedia: build.query<GetSocialMediaResponse, void>({
      query: () => ({
        url: "/social/index",
        method: "GET",
      }),
      providesTags: ["socialMedia"],
    }),
    getContactInfo: build.query<GetContactInfoResponse, void>({
      query: () => ({
        url: "/contact/info",
        method: "GET",
      }),
      providesTags: ["contactInfo"],
    }),
    submitContactForm: build.mutation({
      query: (formData) => ({
        url: "/contact/form",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetHomeBannersQuery,
  useGetCoreFeaturesQuery,
  useGetConnectCompeteQuery,
  useGetDriverPlanQuery,
  useGetTeamPlansQuery,
  useGetSocialMediaQuery,
  useGetContactInfoQuery,
  useSubmitContactFormMutation,
} = homeApi;
