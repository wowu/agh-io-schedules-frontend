import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { StatsService } from '../services/StatsService';
import { LecturersBarChartProps } from './LecturersTimelineChart';

export type LecturersPieChartProps = {
  lecturers: {
    id: number;
    name: string;
    surname: string;
    email: string;
    eventCount: number;
  }[];
};

export default function LecturersPieChart(props: LecturersPieChartProps) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const data = StatsService.preparePieData(props.lecturers);
    setData(data);
  }, [props.lecturers]);

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.4}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      arcLinkLabelsSkipAngle={5}
      arcLabelsSkipAngle={10}
      legends={[
        {
          anchor: 'left',
          direction: 'column',
          justify: false,
          translateX: 150,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 120,
          itemHeight: 20,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          symbolShape: 'circle',
        },
      ]}
    />
  );
}
