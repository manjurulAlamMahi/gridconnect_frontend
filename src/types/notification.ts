export interface Notification {
  id: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface RecentActivityResponse {
  success: boolean;
  role: string;
  unread_count: number;
  notifications: Notification[];
}
