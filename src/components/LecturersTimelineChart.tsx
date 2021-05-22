import React, { useEffect, useState } from 'react'
import { Lecturer } from '../services/LecturerEmailsService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LecturerService } from '../services/LecturerService';


export type LecturersChartProps = {
  lecturers: Lecturer[];
}

export default function LecturersTimelineChart(props: LecturersChartProps) {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    const data = LecturerService.prepareTimelineData(props.lecturers);
    setData(data);
  }, [props.lecturers])
  console.log(data);
  console.log(props);
  return (
    <>
      {/* <ResponsiveContainer width="100%" height="100%">
        
      </ResponsiveContainer> */}
      <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
    </>
  )
}
