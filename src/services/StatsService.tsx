import { Lecturer } from './LecturerEmailsService';
import moment from 'moment';

export type LecturerTimelineDataPoint = {
  x: string;
  y: number;
};

export type LecturerTimelineData = {
  id: string;
  data: LecturerTimelineDataPoint[];
};
export const DATE_FORMAT = 'DD MM YYYY';

export class StatsService {
  static prepareTimelineData(lecturer: Lecturer): LecturerTimelineData {
    const dateFormat = 'DD MM YYYY';
    const data: LecturerTimelineDataPoint[] = [];
    const eventsMap = new Map<string, number>();
    lecturer.schedules.forEach((schedule) => {
      schedule.events.forEach((event) => {
        const date = moment(event.beginTime).format(dateFormat);
        if (eventsMap.has(date)) {
          eventsMap.set(date, eventsMap.get(date)! + 1);
        } else {
          eventsMap.set(date, 1);
        }
      });
    });
    eventsMap.forEach((count, date) => {
      data.push({
        x: date,
        y: count,
      });
    });
    return {
      data,
      id: `${lecturer.name} ${lecturer.surname}`,
    };
  }
}
