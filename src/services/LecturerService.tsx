import { Lecturer } from './LecturerEmailsService';

export class LecturerService {
  static async getLecturer(id: number): Promise<Lecturer> {
    try {
      // TODO Use ApiAdapter after BE changes the endpoint
      await new Promise((r) => setTimeout(r, 150));
      console.log(lecturer);
      return lecturer;
    } catch (error) {
      console.log('getLecturer: ', error);
      throw error;
    }
  }
}
