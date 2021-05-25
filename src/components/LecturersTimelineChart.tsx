import React, { useEffect, useState } from 'react';
import { Lecturer } from '../services/LecturerEmailsService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  TooltipProps,
} from 'recharts';
import { LecturerService } from '../services/LecturerService';
import moment from 'moment';

export type LecturersChartProps = {
  lecturers: Lecturer[];
};

export default function LecturersTimelineChart(props: LecturersChartProps) {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const data = LecturerService.prepareTimelineData(props.lecturers);
    setData(data);
  }, [props.lecturers]);
  console.log(data);
  console.log(props);
  return (
    <>
      <ResponsiveContainer width={700} height={250}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 50, bottom: 30 }}>
          <Line type="monotone" dataKey="val" stroke="#001529" name="Liczba zajęć" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            tickFormatter={(unixTime) => moment(unixTime).format('MMMM DD, YYYY')}
            domain={['auto', 'auto']}
          ></XAxis>
          <YAxis dataKey="val" type="number" domain={[0, 5]}></YAxis>
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
