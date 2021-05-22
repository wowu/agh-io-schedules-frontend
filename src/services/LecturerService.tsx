import { Lecturer } from './LecturerEmailsService';
import { lecturer } from './Mocks';
import moment from 'moment';

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

  static prepareTimelineData(lecturers: Lecturer[]) {
    const timeFormat = 'DD MM YYYY'
    const data: any[] = []
    lecturers.forEach((lecturer) => {
      const eventsMap = new Map();
      lecturer.schedules.forEach((schedule) => {
        schedule.events.forEach(event => {
          const date = moment(event.beginTime).format(timeFormat)
          if (!eventsMap.has(date)) {
            eventsMap.set(date, 1);
          } else {
            eventsMap.set(date, eventsMap.get(date) + 1)
          }
        });
      });
      eventsMap.forEach(([date, count]) => {
        data.push({
          date: moment(date, timeFormat).milliseconds(),
          val: count
        })
      });
    });
    return data;
  }
}
