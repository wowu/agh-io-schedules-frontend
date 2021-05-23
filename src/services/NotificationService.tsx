import { ApiAdapter } from './ApiAdapter';

export interface Notification {
  value: number;
  unit: 'minute' | 'hour' | 'day';
}

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
    // const response = await ApiAdapter.get('/api/notifications');
    // const { notifications } = await response.json();
    // return Promise.resolve(notifications);

    return Promise.resolve([
      {
        value: 1,
        unit: 'day',
      },
    ]);
  }
}
