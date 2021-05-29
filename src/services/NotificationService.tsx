import { ApiAdapter } from './ApiAdapter';

export interface Notification {
  value: number;
  unit: 'minute' | 'hour' | 'day';
}

export type UserNotifications = {
  notifications?: Notification[];
  default: boolean;
};

export class NotificationService {
  static async setGlobalNotifications(notifications: Notification[]) {
    try {
      const body = JSON.stringify({ notifications });
      const response = await ApiAdapter.put('/api/notifications', body);
      const data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('setGlobalNotifications: ', error);
    }
  }

  static async getGlobalNotifications(): Promise<Notification[]> {
    const response = await ApiAdapter.get('/api/notifications');
    const { notifications } = await response.json();
    return Promise.resolve(notifications);
  }

  static async setUserNotifications(userNotifications: UserNotifications) {
    try {
      const body = JSON.stringify(userNotifications);
      const response = await ApiAdapter.put('/api/me/notifications', body);
      const data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('setUserNotifications: ', error);
    }
  }

  static async getUserNotifications(): Promise<UserNotifications> {
    const response = await ApiAdapter.get('/api/me/notifications');
    const data = await response.json();
    return Promise.resolve(data);
  }
}
