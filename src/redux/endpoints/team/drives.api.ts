import { baseApi } from "../../api";

interface OpportunityDiscipline {
  id: number;
  name: string;
}

interface TeamOpportunityEditResponse {
  status: string;
  message: string;
  data: {
    id: number;
    title: string;
    license_type_id: string | number;
    currency: string;
    min_budget: string;
    max_budget: string;
    description: string;
    team_support: string;
    experience: string;
    location: string;
    deadline: string;
    available_seat: string;
    contract_duration: string;
    status: "active" | "inactive";
    disciplines: OpportunityDiscipline[];
  };
}

interface UpdateTeamOpportunityPayload {
  id: string;
  data: FormData;
}

interface UpdateTeamOpportunityResponse {
  status: string;
  message: string;
  data: {
    id: number;
    status: "active" | "inactive";
  };
}

export const drivesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    deleteTeamOpportunity: build.mutation<
      { status: string; message: string },
      string
    >({
      query: (id) => ({
        url: `/team-opportunity/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["team"],
    }),
    getTeamOpportunity: build.query<TeamOpportunityEditResponse, string>({
      query: (id) => `/team-opportunity/edit/${id}`,
      providesTags: ["team"],
    }),
    updateTeamOpportunity: build.mutation<
      UpdateTeamOpportunityResponse,
      UpdateTeamOpportunityPayload
    >({
      query: ({ id, data }) => ({
        url: `/team-opportunity/update/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),
    getDriversRequests: build.query<any, void>({
      query: () => "/team/pending/requests",
      providesTags: ["team"],
    }),
    handleJoinRequest: build.mutation<
      { status: string; message: string },
      { id: string | number; action: "approved" | "rejected" }
    >({
      query: ({ id, action }) => ({
        url: `/team/handle-join-request/${id}`,
        method: "POST",
        body: { action },
      }),
      invalidatesTags: ["team"],
    }),
  }),
});

export const {
  useDeleteTeamOpportunityMutation,
  useGetTeamOpportunityQuery,
  useUpdateTeamOpportunityMutation,
  useGetDriversRequestsQuery,
  useHandleJoinRequestMutation,
} = drivesApi;
