import { baseApi } from "../api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userRegister: build.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    teamRegister: build.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    userImageUpdate: build.mutation({
      query: (data) => ({
        url: "/update/user/image",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useUserRegisterMutation,
  useTeamRegisterMutation,
  useUserImageUpdateMutation,
} = userApi;
