import { ApiAdapter } from './ApiAdapter';

export type Lecturer = {
  id: number;
  name: string
  surname: string
  email: string
  activeSubscription: boolean
}

type LecturersResponse = {
  response: any;
  data: {
    lecturers: Lecturer[]
  }
}

export class LecturerEmailsService {
  static async getLecturers(): Promise<LecturersResponse> {
    try {
      const response = await ApiAdapter.get('/api/lecturers/');
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.log('getEmails: ', error);
      return Promise.reject(error);
    }
  }
}
