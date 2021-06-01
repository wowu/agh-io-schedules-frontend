import { objectToFormData } from '../helpers/form';
import { ApiAdapter } from './ApiAdapter';

import { Schedule } from './ScheduleService';
export type Lecturer = {
  id: number;
  name: string;
  surname: string;
  email: string;
  eventCount: number;
  schedules: Schedule[];
};

type Response<T> = {
  response: any;
  data: {
    lecturers: T;
  };
  error?: string;
};

export class LecturerEmailsService {
  static async getLecturer(id: any): Promise<Lecturer | null> {
    if (id) {
      try {
        const response = await ApiAdapter.get(`/api/lecturers/${id}`);
        const data = await response.json();
        return Promise.resolve(data);
      } catch (error) {
        console.log('getEmails: ', error);
        return Promise.reject(error);
      }
    }
    return null;
  }
  static async getLecturers(): Promise<Response<Lecturer[]>> {
    try {
      const response = await ApiAdapter.get('/api/lecturers/');
      const data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.log('getEmails: ', error);
      return Promise.reject(error);
    }
  }

  static async createLecturer(
    name: string,
    surname: string,
    email: string
  ): Promise<Response<Lecturer>> {
    try {
      const response = await ApiAdapter.post(
        '/api/lecturers/',
        objectToFormData({
          name,
          surname,
          email,
        })
      );
      const data = await response.json();

      let error;
      if (data.error) error = data.error;

      return Promise.resolve({ response, data, error });
    } catch (error) {
      console.log('createLecturer: ', error);
      return Promise.reject(error);
    }
  }

  static async updateLecturer(
    id: number,
    name: string,
    surname: string,
    email: string
  ): Promise<Response<Lecturer>> {
    try {
      const response = await ApiAdapter.put(
        `/api/lecturers/${id}`,
        objectToFormData({
          name,
          surname,
          email,
        })
      );
      const data = await response.json();

      let error;
      if (data.error) error = data.error;

      return Promise.resolve({ response, data, error });
    } catch (error) {
      console.log('createLecturer: ', error);
      return Promise.reject(error);
    }
  }

  static async removeLecturer(id: number): Promise<any> {
    try {
      const response = await ApiAdapter.delete(`/api/lecturers/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      console.log('removeLecturer: ', error);
      return Promise.reject(error);
    }
  }
}
