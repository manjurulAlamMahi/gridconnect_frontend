import type { GetDynamicPageResponse } from "@/types/dynamic-page";
import { baseApi } from "@/redux/api";

export const dynamicPageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDynamicPage: build.query<GetDynamicPageResponse, string>({
      query: (slug) => ({
        url: `/dynamic/page/${slug}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDynamicPageQuery } = dynamicPageApi;
