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
    const data: { date: number; val: number; }[] = []
    lecturers.forEach((lecturer) => {
      const eventsMap = new Map<string, number>();
      lecturer.schedules.forEach((schedule) => {
        schedule.events.forEach(event => {
          const date = moment(event.beginTime).format(timeFormat)
          console.log(date);
          if (eventsMap.has(date)) {
            eventsMap.set(date, eventsMap.get(date)! + 1)
          } else {
            eventsMap.set(date, 1)
          }
        });
      });
      console.log(eventsMap);
      eventsMap.forEach(((count, date) => {
        data.push({
          date: moment(date, timeFormat).valueOf(),
          val: count
        })
      }));
    });
    return data;
  }

}
