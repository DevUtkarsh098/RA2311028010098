import { apiClient } from './client';
import { type Notification } from '../priority_inbox';

export interface FetchNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export interface FetchNotificationsResponse {
  notifications: Notification[];
}

export const fetchNotifications = async (params: FetchNotificationsParams): Promise<FetchNotificationsResponse> => {
  const response = await apiClient.get('/evaluation-service/notifications', { params });
  return response.data;
};
