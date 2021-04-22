import { Col, List, Row, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import CenteredHeader from '../components/CenteredHeader';
import { Lecturer, LecturerEmailsService } from '../services/LecturerEmailsService';

export default function LecturerEmails() {
  // const { user } = useContext(UserContext);

  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await LecturerEmailsService.getLecturers();
      const { lecturers } = data;
      setLecturers(lecturers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Imię',
      dataIndex: 'name',
    },
    {
      title: 'Nazwisko',
      dataIndex: 'surname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Akcje',
      key: 'actions',
      render: () => <div>Usuń</div>,
    },
  ];

  return (
    <>
      <CenteredHeader title={'Emaile prowadzących'} />
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <Row justify={'center'}>
          <Col span={24} lg={18} xl={14}>
            <Table dataSource={lecturers} columns={columns} />
          </Col>
        </Row>
      )}
    </>
  );
}
