import { ApiAdapter } from './ApiAdapter';
import { Lecturer } from './LecturerEmailsService';

export class LecturerService {
  static async getLecturer(id: number): Promise<Lecturer> {
    try {
      const response = await ApiAdapter.get(`/api/lecturers/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('getLecturer: ', error);
      throw error;
    }
  }
}
