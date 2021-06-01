import { Button, Col, notification, Popconfirm, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CenteredHeader from '../components/CenteredHeader';
import LecturerForm, { LecturerFormValues } from '../components/LecturerForm';
import LecturersPieChart from '../components/LecturersPieChart';
import { Lecturer, LecturerEmailsService } from '../services/LecturerEmailsService';

interface LecturerEditProps {
  lecturer: Lecturer;
  onEdit: (lecturer: Lecturer, values: LecturerFormValues) => void;
}

function LecturerEdit(props: LecturerEditProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const onEdit = (values: LecturerFormValues) => {
    setVisible(false);
    props.onEdit(props.lecturer, values);
  };

  return (
    <>
      <Button type={'default'} onClick={() => setVisible(true)}>
        Edytuj
      </Button>

      <LecturerForm
        visible={visible}
        onSubmit={onEdit}
        lecturer={props.lecturer}
        title="Edytuj prowadzącego"
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

interface LecturersTableProps {
  lecturers: Lecturer[];
  loading: boolean;
  onRemove: (lecturer: Lecturer) => void;
  onEdit: (lecturer: Lecturer, values: LecturerFormValues) => void;
}

function LecturersTable(props: LecturersTableProps) {
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
      title: 'Liczba wydarzeń',
      dataIndex: 'eventsCount',
    },
    {
      title: 'Akcje',
      key: 'actions',
      render: (_text: string, record: Lecturer) => (
        <>
          <Space size="middle">
            <Button type={'link'}>
              <Link to={`/merged/${record.id}`}>Wydarzenia</Link>
            </Button>
            <LecturerEdit onEdit={props.onEdit} lecturer={record} />

            <Button danger onClick={() => props.onRemove(record)}>
              Usuń
            </Button>
          </Space>
        </>
      ),
    },
  ];

  return (
    <Row justify={'center'}>
      <Col span={24} lg={18} xl={14}>
        <Table loading={props.loading} dataSource={props.lecturers} columns={columns} />
      </Col>
    </Row>
  );
}

export default function LecturerEmails() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const fetchLecturers = async () => {
    setLoading(true);
    const { data } = await LecturerEmailsService.getLecturers();
    const { lecturers } = data;
    setLecturers(lecturers.sort((a, b) => a.id - b.id));
    setLoading(false);
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const onCreateFormSubmit = async (values: LecturerFormValues) => {
    setCreateModalVisible(false);

    const { response, error } = await LecturerEmailsService.createLecturer(
      values.name,
      values.surname,
      values.email
    );

    if (!response.ok) {
      notification['error']({ message: 'Błąd', description: error });
    }

    fetchLecturers();
  };

  const onRemove = async (lecturer: Lecturer) => {
    await LecturerEmailsService.removeLecturer(lecturer.id);
    fetchLecturers();
  };

  const onEdit = async (lecturer: Lecturer, values: LecturerFormValues) => {
    const { response, error } = await LecturerEmailsService.updateLecturer(
      lecturer.id,
      values.name,
      values.surname,
      values.email
    );

    if (!response.ok) {
      notification['error']({ message: 'Błąd', description: error });
    }

    fetchLecturers();
  };

  return (
    <>
      <CenteredHeader title={'Prowadzący'} />

      <LecturersTable loading={loading} lecturers={lecturers} onRemove={onRemove} onEdit={onEdit} />

      <br />

      <Row justify={'center'}>
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Dodaj email
        </Button>

        <LecturerForm
          visible={createModalVisible}
          onSubmit={onCreateFormSubmit}
          title="Dodaj prowadzącego"
          onCancel={() => setCreateModalVisible(false)}
        />
      </Row>
      <Row style={{ height: 400 }}>
        <LecturersPieChart lecturers={lecturers} />
      </Row>
    </>
  );
}
