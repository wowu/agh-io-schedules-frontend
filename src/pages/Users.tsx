import { Button, Col, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import CenteredHeader from '../components/CenteredHeader';
import UserForm, { UserFormValues } from '../components/UserForm';
import { User, UserService } from '../services/UserService';

interface UserEditProps {
  user: User;
  onEdit: (user: User, values: UserFormValues) => void;
}

function UserEdit(props: UserEditProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const onEdit = (values: UserFormValues) => {
    setVisible(false);
    props.onEdit(props.user, values);
  };

  return (
    <>
      <a onClick={() => setVisible(true)}>Edytuj</a>

      <UserForm
        visible={visible}
        onSubmit={onEdit}
        user={props.user}
        title="Edytuj użytkownika"
        onCancel={() => setVisible(false)}
      />
    </>
  );
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onRemove: (User: User) => void;
  onEdit: (User: User, values: UserFormValues) => void;
}

function UsersTable(props: UsersTableProps) {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Powiadomienia',
      dataIndex: 'activeSubscription',
      render: (_text: string, record: User) =>
        record.activeSubscription ? <Tag color="green">TAK</Tag> : <Tag color="red">NIE</Tag>,
    },
    {
      title: 'Akcje',
      key: 'actions',
      render: (_text: string, record: User) => (
        <>
          <Space size="middle">
            <UserEdit onEdit={props.onEdit} user={record} />
            <a onClick={() => props.onRemove(record)}>Usuń</a>
          </Space>
        </>
      ),
    },
  ];

  return (
    <Row justify={'center'}>
      <Col span={24} lg={18} xl={14}>
        <Table loading={props.loading} dataSource={props.users} columns={columns} />
      </Col>
    </Row>
  );
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await UserService.getUsers();
    const { users } = data;
    setUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onCreateFormSubmit = async (values: UserFormValues) => {
    setCreateModalVisible(false);

    await UserService.createUser(values.email, values.activeSubscription);

    fetchUsers();
  };

  const onRemove = async (User: User) => {
    await UserService.removeUser(User.id);
    fetchUsers();
  };

  const onEdit = async (User: User, values: UserFormValues) => {
    await UserService.updateUser(User.id, values.email, values.activeSubscription);
    fetchUsers();
  };

  return (
    <>
      <CenteredHeader title={'Użytkownicy'} />

      <UsersTable loading={loading} users={users} onRemove={onRemove} onEdit={onEdit} />

      <br />

      <Row justify={'center'}>
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Dodaj użytkownika
        </Button>

        <UserForm
          visible={createModalVisible}
          onSubmit={onCreateFormSubmit}
          title="Dodaj użytkownika"
          onCancel={() => setCreateModalVisible(false)}
        />
      </Row>
    </>
  );
}
