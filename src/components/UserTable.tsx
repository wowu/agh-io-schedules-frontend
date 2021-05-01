import { Col, Row, Space, Table, Tag } from "antd";
import { User } from "../services/UserService";
import UserEdit from "./UserEdit";
import { UserFormValues } from "./UserForm";

export interface UsersTableProps {
  users: User[];
  loading: boolean;
  onRemove: (User: User) => void;
  onEdit: (User: User, values: UserFormValues) => void;
}

export default function UsersTable(props: UsersTableProps) {
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