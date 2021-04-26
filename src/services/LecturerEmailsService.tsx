import { objectToFormData } from '../helpers/form';
import { ApiAdapter } from './ApiAdapter';

export type Lecturer = {
  id: number;
  name: string;
  surname: string;
  email: string;
  activeSubscription: boolean;
};

type Response<T> = {
  response: any;
  data: {
    lecturers: T;
  };
};

export class LecturerEmailsService {
  static async getLecturers(): Promise<Response<Lecturer[]>> {
    try {
      const response = await ApiAdapter.get('/api/lecturers/');
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.log('getEmails: ', error);
      return Promise.reject(error);
    }
  }

  static async createLecturer(name: string, email: string): Promise<Response<Lecturer>> {
    try {
      const response = await ApiAdapter.post(
        '/api/lecturers/',
        objectToFormData({
          name,
          email,
        })
      );
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.log('createLecturer: ', error);
      return Promise.reject(error);
    }
  }

  static async updateLecturer(
    id: number,
    name: string,
    email: string
  ): Promise<Response<Lecturer>> {
    try {
      const response = await ApiAdapter.put(
        `/api/lecturers/${id}`,
        objectToFormData({
          name,
          email,
        })
      );
      let data = await response.json();
      return Promise.resolve({ response, data });
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
