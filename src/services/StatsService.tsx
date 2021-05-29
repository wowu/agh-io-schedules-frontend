import { Lecturer } from './LecturerEmailsService';
import moment from 'moment';
import { Event } from './ScheduleService';

export type LecturerBarDataPoint = {
  date: string;
  count: number;
};

export type LecturerPieDataPoint = {
  id: string;
  value: number;
};

export const DATE_FORMAT = 'DD MM YYYY';

export class StatsService {
  static prepareTimelineData(events: Event[]): LecturerBarDataPoint[] {
    const dateFormat = 'MMMM D, YYYY';
    const data: LecturerBarDataPoint[] = [];
    const eventsMap = new Map<string, number>();
    events.forEach((event) => {
      const date = moment(event.beginTime).format(dateFormat);
      if (eventsMap.has(date)) {
        eventsMap.set(date, eventsMap.get(date)! + 1);
      } else {
        eventsMap.set(date, 1);
      }
    });
    eventsMap.forEach((count, date) => {
      data.push({
        date,
        count,
      });
    });
    return data;
  }

  static preparePieData(lecturers: any[]): LecturerPieDataPoint[] {
    return lecturers.map((lecturer) => {
      return {
        id: `${lecturer.name} ${lecturer.surname}`,
        value: lecturer.eventsCount,
      };
    });
  }
}
