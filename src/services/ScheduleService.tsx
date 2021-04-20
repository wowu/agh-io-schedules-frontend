import { ApiAdapter } from "./ApiAdapter"


export class ScheduleService {
  static async getAll(): Promise<Array<any>> {
    try {      
      const response = await ApiAdapter.get('/api/schedule/getAll');
      let json = await response.json();
      return Promise.resolve(this.arrayOrElseEmptyArray(json));
    }
    catch (error) {
      console.log('getAll: ', error);
      return Promise.reject(error);
    }
  }

  static async getListSchedules(): Promise<Array<any>> {
    try {
      const response = await ApiAdapter.get("/api/schedule/getFiles");
      let json = await response.json();
      return Promise.resolve(this.arrayOrElseEmptyArray(json));
    }
    catch (error) {
      console.log('getListSchedules: ', error);
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
