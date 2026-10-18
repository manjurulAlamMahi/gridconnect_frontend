import { baseApi } from "../api";
import type {
  ConversationsResponse,
  MessagesResponse,
  StartConversationResponse,
  GetRecentMessagesResponse,
} from "@/types/chat";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationsResponse, void>({
      query: () => ({
        url: "/chat/conversations",
        method: "GET",
      }),
      providesTags: ["team", "driver"],
    }),
    getMessages: builder.query<
      MessagesResponse,
      { conversationId: string | number; page?: number }
    >({
      query: ({ conversationId, page = 1 }) => ({
        url: `/chat/messages/${conversationId}?page=${page}`,
        method: "GET",
      }),
      providesTags: (_, __, { conversationId }) => [
        { type: "team" as const, id: `CHAT_${conversationId}` },
        { type: "driver" as const, id: `CHAT_${conversationId}` },
      ],
    }),
    startConversation: builder.mutation<
      StartConversationResponse,
      { with_id: number; with_type: "team" | "driver" }
    >({
      query: (body) => ({
        url: "/chat/conversations/start",
        method: "POST",
        body,
      }),
      invalidatesTags: ["team", "driver"],
    }),
    sendMessage: builder.mutation<MessagesResponse, FormData>({
      query: (body) => ({
        url: "/chat/messages/send",
        method: "POST",
        body,
      }),
      // We'll handle real-time updates via Echo, but invalidating can be a fallback
      // invalidatesTags: (result, error, { conversation_id }) => [
      //   { type: "team", id: `CHAT_${conversation_id}` },
      //   { type: "driver", id: `CHAT_${conversation_id}` },
      // ],
    }),
    getRecentMessages: builder.query<GetRecentMessagesResponse, void>({
      query: () => ({
        url: "/chat/recent/messages",
      }),
      providesTags: ["team", "driver"],
    }),
    markMessagesRead: builder.mutation<void, { conversationId: string | number }>({
      query: ({ conversationId }) => ({
        url: `/chat/messages/${conversationId}/read`,
        method: "POST",
      }),
      invalidatesTags: ["team", "driver"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useStartConversationMutation,
  useSendMessageMutation,
  useGetRecentMessagesQuery,
  useMarkMessagesReadMutation,
} = chatApi;
