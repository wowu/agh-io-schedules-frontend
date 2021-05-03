import { Button, Col, Row, Space, Table, Tag } from 'antd';
import { User } from '../services/UserService';
import UserEdit from './UserEdit';
import { UserFormValues } from './UserForm';

export interface UsersTableProps {
  users: User[];
  loading: boolean;
  fieldsToShow: string[];
  onRemove: (User: User) => void;
  onEdit?: (User: User, values: UserFormValues) => void;
}

export default function UsersTable(props: UsersTableProps) {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Akcje',
      key: 'actions',
      render: (_text: string, record: User) => (
        <>
          <Space size="middle">
            {props.onEdit && (
              <UserEdit onEdit={props.onEdit} user={record} fieldsToEdit={props.fieldsToShow} />
            )}
            <a onClick={() => props.onRemove(record)}>Usuń</a>
          </Space>
        </>
      ),
    },
  ];

  if (props.fieldsToShow.includes('activeSubscription')) {
    columns.splice(1, 0, {
      title: 'Powiadomienia',
      key: 'activeSubscription',
      render: (_text: string, record: User) =>
        record.activeSubscription ? <Tag color="green">TAK</Tag> : <Tag color="red">Nie</Tag>,
    });
  }

  console.log('users', props.users);

  return (
    <Row justify={'center'}>
      <Col span={24} lg={18} xl={14}>
        <Table loading={props.loading} dataSource={props.users} columns={columns} />
      </Col>
    </Row>
  );
}
