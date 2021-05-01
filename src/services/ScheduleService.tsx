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
  eventCount: number;
  firstEventDate: string;
  lastEventDate: string;
  publicUUID: string;
  events: Array<Event>;
}

export class ScheduleService {
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
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('addSubscriber: ', error);
      return Promise.reject(error);
    }
  }

  static async getSubscribers(id: any) {
    try {
      const response = await ApiAdapter.get(`/api/schedules/${id}/subscribers`);
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('getSubscribers: ', error);
      return Promise.reject(error);
    }
  }

  static async downloadSchedule(id: any): Promise<any> {
    try {
      const response = await ApiAdapter.get(`/api/schedules/${id}/file`);
      let blob = await response.blob();
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
      let json = await response.json();
      return Promise.resolve(json);
    } catch (error) {
      console.log('getAll: ', error);
      return Promise.reject(error);
    }
  }

  static async getListSchedules(): Promise<{ response: any; data: { schedules: [] } }> {
    try {
      const response = await ApiAdapter.get('/api/schedules/');
      let data = await response.json();
      console.log(data);
      return Promise.resolve({ response, data });
    } catch (error) {
      console.log('getListSchedules: ', error);
      return Promise.reject(error);
    }
  }

  static async sendNewSchedules(files: FormData, failure: boolean = false): Promise<any> {
    try {
      let response;
      if (failure) {
        response = await ApiAdapter.postErrors('/api/schedules/', files); //TODO: Remove on production - only for testing purposes
      } else {
        response = await ApiAdapter.post('/api/schedules/', files);
      }

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

  static async updateSchedule(files: FormData, id = 1, failure: boolean = false): Promise<any> {
    try {
      let response;
      if (failure) {
        response = await ApiAdapter.postErrors(`/api/schedules/${id}/file`, files); //TODO: Remove on production - only for testing purposes
      } else {
        response = await ApiAdapter.post(`/api/schedules/${id}/file`, files);
      }

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
      // const data = await response.json();
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

  private static arrayOrElseEmptyArray(json: any): Array<any> {
    if (!Array.isArray(json)) {
      json = [];
    }
    return json;
  }
}
