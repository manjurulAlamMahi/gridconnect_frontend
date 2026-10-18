export interface Conversation {
  conversation_id: number;
  with: {
    id: number;
    name: string;
    image: string | null;
  };
  last_message: {
    text: string;
    sent_by_me: boolean;
    is_read: boolean;
    sent_at: string;
    time_ago: string;
    attachment?: ConversationAttachment | null;
  } | null;
  unread_count: number;
}

export interface ConversationAttachment {
  type: string;
  url: string;
  name: string;
  size: number;
  formatted_size: string;
}

export type MessageAttachment = string | ConversationAttachment | null;

export interface Message {
  id: number;
  conversation_id: number;
  message: string;
  sender_type: string;
  sent_by_me: boolean;
  is_read: boolean;
  sent_at: string;
  created_at: string;
  time_ago: string;
  attachment: MessageAttachment;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ConversationsResponse {
  status: string;
  message: string;
  data: {
    conversations: Conversation[];
  };
}

export interface MessagesResponse {
  status: string;
  message: string;
  data: {
    messages: Message[];
    pagination: Pagination;
  };
}

export interface StartConversationResponse {
  status: string;
  message: string;
  data: {
    conversation_id: number;
  };
}

export interface RecentMessageFrom {
  id: number;
  name: string;
  image: string | null;
}

export interface RecentMessage {
  conversation_id: number;
  from: RecentMessageFrom;
  message: string;
  sent_by_me: boolean;
  is_read: boolean;
  sent_at: string;
  time_ago: string;
}

export interface GetRecentMessagesResponse {
  status: string;
  message: string;
  data: {
    recent_messages: RecentMessage[];
  };
}
