import type { GridConnectResponse } from "@/types/gridconnect";
import { baseApi } from "../../api";

export const JoinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGruidConnectData: build.query<GridConnectResponse, any>({
      query: () => ({
        url: "/grid/connectApi/index",
        method: "GET",
      }),
      providesTags: ["join"],
    }),
  }),
});

export const { useGetGruidConnectDataQuery } = JoinApi;
