import { ApiAdapter } from "./ApiAdapter"


export class ScheduleService {
  static async getAll(): Promise<any>{
    const response = await ApiAdapter.get('/api/schedule/getAll')
    return response.json()
  }
}