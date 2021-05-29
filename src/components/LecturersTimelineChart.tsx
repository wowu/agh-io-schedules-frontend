import { useEffect, useState } from 'react';
import { Lecturer } from '../services/LecturerEmailsService';
import { ResponsiveLine, SliceTooltipProps } from '@nivo/line';
import { StatsService } from '../services/StatsService';

export type LecturersChartProps = {
  lecturers: Lecturer[];
};

const renderTooltip = ({ slice }: SliceTooltipProps) => {
  return (
    <div
      style={{
        background: 'white',
        padding: '9px 12px',
        border: '1px solid #ccc',
      }}
    >
      {slice.points.map((point) => (
        <div
          key={point.id}
          style={{
            color: point.serieColor,
            padding: '3px 0',
          }}
        >
          <strong>{point.serieId}</strong>: {point.data.yFormatted}
        </div>
      ))}
    </div>
  );
};

export default function LecturersTimelineChart(props: LecturersChartProps) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const data = props.lecturers.map(StatsService.prepareTimelineData);
    setData(data);
  }, [props.lecturers]);

  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
          type: 'time',
          format: '%d %m %Y',
        }}
        xFormat="time:%d %m %Y"
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          format: (e) => Math.floor(e) === e && e,
          legendOffset: -40,
          legend: 'Liczba zajęć',
          legendPosition: 'middle',
          tickPadding: 10,
        }}
        axisBottom={{
          format: '%b %d, %y',
          legend: 'Czas',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        enableSlices="x"
        sliceTooltip={renderTooltip}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
