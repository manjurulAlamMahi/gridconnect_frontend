import type {
  DriverProfileCompletionResponse,
  DriverComprehensiveStatusResponse,
  DriverRacingActivityResponse,
} from "@/types/driver";
import { baseApi } from "../../api";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      setupDriverPageOne: build.mutation({
        query: (data) => ({
          url: "/driver/setupDriverPageOne",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["driver"],
      }),

      setupDriverPageTwo: build.mutation({
        query: (data) => ({
          url: "/driver/setupDriverPageTwo",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["driver"],
      }),

      setupDriverPageThree: build.mutation({
        query: (data) => ({
          url: "/driver/setupDriverPageThree",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["driver"],
      }),

      getProfile: build.query({
        query: () => ({
          url: "/driver/getProfile",
        }),
        providesTags: ["driver"],
      }),

      getProfileCompletion: build.query<DriverProfileCompletionResponse, void>({
        query: () => ({
          url: "/driver/profile/completion",
        }),
        providesTags: ["driver"],
      }),

      getDriverComprehensiveStatus: build.query<
        DriverComprehensiveStatusResponse,
        void
      >({
        query: () => ({
          url: "/driver/profile/comprehensive/status",
        }),
        providesTags: ["driver"],
      }),

      getDriverRacingActivity: build.query<DriverRacingActivityResponse, void>({
        query: () => ({
          url: "/driver/profile/racing/activity",
        }),
        providesTags: ["driver"],
      }),

      updateDriverInfo: build.mutation({
        query: (data) => ({
          url: "/driver/updateDriverInfo",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["driver"],
      }),

      resetDriverPassword: build.mutation({
        query: (data) => ({
          url: "/driver/resetpass",
          method: "POST",
          body: data,
        }),
      }),

      deleteDriverAccount: build.mutation({
        query: () => ({
          url: "/auth/deleteAccount",
          method: "DELETE",
        }),
        invalidatesTags: ["driver"],
      }),
    };
  },
});

export const {
  useSetupDriverPageOneMutation,
  useSetupDriverPageTwoMutation,
  useSetupDriverPageThreeMutation,
  useGetProfileQuery,
  useGetProfileCompletionQuery,
  useGetDriverComprehensiveStatusQuery,
  useGetDriverRacingActivityQuery,
  useUpdateDriverInfoMutation,
  useResetDriverPasswordMutation,
  useDeleteDriverAccountMutation,
} = driverApi;
