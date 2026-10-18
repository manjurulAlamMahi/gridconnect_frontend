import { baseApi } from "../api";
import type { LicenceTypeResponse } from "@/types/licencetype";

export const licenceTypeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLicenceTypes: build.query<LicenceTypeResponse, void>({
      query: () => ({
        url: "/license/index",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLicenceTypesQuery } = licenceTypeApi;
