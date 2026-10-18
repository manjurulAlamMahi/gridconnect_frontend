import type { DisciplineResponse } from "@/types/discipline";
import { baseApi } from "../api";

export const disciplineApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDisciplines: build.query<DisciplineResponse, void>({
      query: () => ({
        url: "/discipline/index",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDisciplinesQuery } = disciplineApi;
