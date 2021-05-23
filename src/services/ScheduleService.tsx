import { ApiAdapter } from './ApiAdapter';
import { APP_URL } from './AuthService';

export interface Event {
  id: number;
  beginTime: string;
  endTime: string;
  eventName: string;
  groupName: string;
  lecturerName: string;
  lecturerSurname: string;
  type: string;
  hours: number;
  form: string;
  room: string;
}

export interface Schedule {
  id: number;
  name: string;
  description: string;
  notifications: boolean;
  eventCount: number;
  firstEventDate: string;
  lastEventDate: string;
  publicUUID: string;
  events: Event[];
}

export type MergedSchedule = {
  events: Event[];
};

export class ScheduleService {
  static async addPublicSubscriber(email: string, publicUUID: string) {
    try {
      const fields = new FormData();
      fields.append('email', email);
      const response = await ApiAdapter.post(
        `/api/public/schedules/${publicUUID}/subscribe`,
        fields,
        {
          tryAuthorize: false,
        }
      );
      const data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('addPublicSubscriber: ', error);
    }
  }

  static async removeSubscriber(sub_id: number, id: any) {
    try {
      const response = await ApiAdapter.delete(`/api/schedules/${id}/subscribers/${sub_id}`);
      return Promise.resolve({ response });
    } catch (error) {
      console.error('removeSubscriber: ', error);
      return Promise.reject(error);
    }
  }

  static async addSubscriber(email: string, id: any) {
    try {
      const fields = new FormData();
      fields.append('email', email);
      const response = await ApiAdapter.post(`/api/schedules/${id}/subscribers`, fields);
      const data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('addSubscriber: ', error);
      return Promise.reject(error);
    }
  }

  static async getPublicSchedule(publicUUID: string): Promise<any> {
    try {
      const response = await ApiAdapter.get(`/api/public/schedules/${publicUUID}`, {
        tryAuthorize: false,
      });
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      console.log('downloadSchedule: ', error);
    }
  }
  static async getSubscribers(id: any) {
    try {
      const response = await ApiAdapter.get(`/api/schedules/${id}/subscribers`);
      const data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('getSubscribers: ', error);
      return Promise.reject(error);
    }
  }

  static async downloadSchedule(id: any): Promise<any> {
    try {
      const response = await ApiAdapter.get(`/api/schedules/${id}/file`, { tryAuthorize: false });
      const blob = await response.blob();
      return Promise.resolve(blob);
    } catch (error) {
      console.log('downloadSchedule: ', error);
      return Promise.reject(error);
    }
  }

  static buildPublicLink(schedule: Schedule): string {
    return `${APP_URL!}/public/schedule/${schedule.publicUUID}`;
  }

  static async getSchedule(id: number): Promise<any> {
    try {
      const response = await ApiAdapter.get(`/api/schedules/${id}`);
      const json = await response.json();
      return Promise.resolve(json);
    } catch (error) {
      console.log('getAll: ', error);
      return Promise.reject(error);
    }
  }

  static async getMergedSchedule(): Promise<MergedSchedule> {
    try {
      const response = await ApiAdapter.get(`/api/me/schedules`);
      const data = await response.json();

      const schedules: Schedule[] = data.schedules;

      const events = schedules.flatMap((schedule) => schedule.events);

      return Promise.resolve({ events });
    } catch (error) {
      console.log('getAll: ', error);
      return Promise.reject(error);
    }
  }

  static async getListSchedules(): Promise<{ response: any; data: { schedules: [] } }> {
    try {
      const response = await ApiAdapter.get('/api/schedules/');
      const data = await response.json();
      console.log(data);
      return Promise.resolve({ response, data });
    } catch (error) {
      console.log('getListSchedules: ', error);
      return Promise.reject(error);
    }
  }

  static async sendNewSchedules(files: FormData): Promise<any> {
    try {
      const response = await ApiAdapter.post('/api/schedules/', files);

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        return Promise.resolve({ response, data });
      } else {
        return Promise.resolve({ response, data: {} });
      }
    } catch (error) {
      console.log('Send new schedule: error');
      return Promise.reject({ error, data: {} });
    }
  }

  static async updateSchedule(files: FormData, id: number): Promise<any> {
    try {
      const response = await ApiAdapter.post(`/api/schedules/${id}/file`, files);

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        return Promise.resolve({ response, data });
      } else {
        return Promise.resolve({ response, data: {} });
      }
    } catch (error) {
      console.log('Send new schedule: error');
      return Promise.reject({ error, data: {} });
    }
  }

  static async updateScheduleMetadata(fields: FormData, id: number) {
    try {
      const response = await ApiAdapter.put(`/api/schedules/${id}`, fields);
      return Promise.resolve({ response });
    } catch (error) {
      console.log('updateScheduleMetadata: error');
      return Promise.reject({ error });
    }
  }

  static async removeSchedule(id: number): Promise<any> {
    try {
      const response = await ApiAdapter.delete(`/api/schedules/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      console.log('getAll: ', error);
      return Promise.reject(error);
    }
  }

  private static arrayOrElseEmptyArray(json: any): any[] {
    if (!Array.isArray(json)) {
      json = [];
    }
    return json;
  }
}
