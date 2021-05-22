import { CloseCircleOutlined } from '@ant-design/icons';
import { Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LecturersTimelineChart from '../components/LecturersTimelineChart';
import { Lecturer } from '../services/LecturerEmailsService';
import { LecturerService } from '../services/LecturerService';

export default function CombinedSchedule() {
  const { lecturerId } = useParams<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  useEffect(() => {
    LecturerService.getLecturer(lecturerId)
      .then((lecturer) => {
        console.log('sadf', lecturer);
        setLoading(false);
        setLecturer(lecturer);
      })
      .catch((_error) => {
        setLoading(false);
        setError(true);
      });
  }, [lecturerId]);
  console.log('Lecturer', lecturer);

  const showStatus = () => {
    if (error)
      return (
        <>
          <Row justify={'center'}>
            <CloseCircleOutlined size={100} />
          </Row>
          <Row justify={'center'}>
            <h3>Stał się błąd :( Spróbuj ponownie później</h3>
          </Row>
        </>
      );
    else if (loading)
      return (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      );
  };

  return (
    <>
      {loading || error ? (
        showStatus()
      ) : (
        <>
          <LecturersTimelineChart lecturers={[lecturer!]}></LecturersTimelineChart>
        </>
      )}
    </>
  );
}
