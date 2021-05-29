import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { StatsService } from '../services/StatsService';
import { LecturersChartProps } from './LecturersTimelineChart'

export type LecturersPieChartProps = {
  lecturers: {
    id: number,
    name: string,
    surname: string,
    email: string,
    eventsCount: string
  }[]
}

export default function LecturersPieChart(props: LecturersChartProps) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const data = StatsService.preparePieData(props.lecturers);
    setData(data);
  }, [props.lecturers]);

  return (
    <div style={{ height: 300 }}>
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
                anchor: 'bottom',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 64,
                itemsSpacing: 2,
                itemWidth: 120,
                itemHeight: 20,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                symbolShape: 'circle',
            }
        ]}
      />
    </div>
  );
}
