import { ApiAdapter } from "./ApiAdapter"


export class ScheduleService {
  static async getSchedule(id: number): Promise<Array<any>> {
    try {
      const response = await ApiAdapter.get(`/api/schedules/${id}`);
      let json = await response.json();
      return Promise.resolve(json);
    }
    catch (error) {
      console.log('getAll: ', error);
      return Promise.reject(error);
    }
  }

  static async getListSchedules(): Promise<Array<any>> {
    try {
      const response = await ApiAdapter.get("/api/schedules/");
      let json = await response.json();
      return Promise.resolve(this.arrayOrElseEmptyArray(json));
    }
    catch (error) {
      console.log('getListSchedules: ', error);
      return Promise.reject(error);
    }
  }

  static async sendNewSchedules(files: FormData, failure: boolean = false): Promise<any> {
    try {
      let response;
      if(failure){
        response = await ApiAdapter.postErrors("/api/schedules/", files);    //TODO: Remove on production - only for testing purposes
      }
      else {
        response = await ApiAdapter.post("/api/schedules/", files);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return Promise.resolve({response, data});
      }
      else{
        return Promise.resolve({response, data: {}});
      }
    }
    catch (error) {
      console.log("Send new schedule: error")
      return Promise.reject({error, data: {}});
    }
  }

  private static arrayOrElseEmptyArray(json: any): Array<any> {
    if (!Array.isArray(json)) {
      json = [];
    }
    return json;
  }
}
