import { Button, Col, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import CenteredHeader from '../components/CenteredHeader';
import UserForm, { UserFormValues } from '../components/UserForm';
import UsersTable from '../components/UserTable';
import { User, UserService } from '../services/UserService';

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

      <UsersTable
        loading={loading}
        users={users}
        onRemove={onRemove}
        onEdit={onEdit}
        fieldsToShow={['email', 'activeSubscription']}
      />

      <br />

      <Row justify={'center'}>
        <Button danger type="primary" onClick={() => setCreateModalVisible(true)}>
          Dodaj użytkownika
        </Button>

        <UserForm
          visible={createModalVisible}
          onSubmit={onCreateFormSubmit}
          title="Dodaj użytkownika"
          onCancel={() => setCreateModalVisible(false)}
          fieldsToEdit={['email', 'activeSubscription']}
        />
      </Row>
    </>
  );
}
