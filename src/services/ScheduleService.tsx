import { ApiAdapter } from "./ApiAdapter"


export class ScheduleService {
  static async getAll(): Promise<Array<any>>{
    const response = await ApiAdapter.get('/api/schedule/getAll');
    return response.json();
  }

  static async getListSchedules(): Promise<Array<any>>{
    try {
      const response = await ApiAdapter.get("/api/schedule/getFiles");
      let json = await response.json();
      if (!Array.isArray(json)) {
        json = []
      }
      return Promise.resolve(json);
    }
    catch (error)
      {
        console.log('getListSchedules: ', error);
        return Promise.reject(error);
      }
  }

}
