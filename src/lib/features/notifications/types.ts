// Notification types
export type NotificationType = "INFO" | "WARNING" | "ALERT";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  refId?: number | null;
  refType?: string | null;
  isRead: boolean;
  userId?: number | null;
  createdAt: string;
}
