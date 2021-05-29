import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { StatsService, LecturerBarDataPoint } from '../services/StatsService';
import { Event } from '../services/ScheduleService';

export type LecturersBarChartProps = {
  events: Event[];
};

function getGridLines(data: LecturerBarDataPoint[]): number[] {
  if (data) {
    let max = 0;
    data.forEach((element) => {
      if (max < element.count) {
        max = element.count;
      }
    });
    return Array.from(Array(max + 1).keys());
  }
  return [];
}

export default function LecturersBarChart(props: LecturersBarChartProps) {
  const [data, setData] = useState<any>();
  useEffect(() => {
    const data = StatsService.prepareTimelineData(props.events);
    setData(data);
  }, [props.events]);

  return (
    <ResponsiveBar
      data={data}
      keys={['count']}
      indexBy="date"
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        format: (e) => Math.floor(e) === e && e,
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Liczba zajęć',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      gridYValues={getGridLines(data)}
      animate={true}
    />
  );
}
