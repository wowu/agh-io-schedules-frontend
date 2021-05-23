import { Button, InputNumber, List, Select, Space, Table } from 'antd';
import { useState } from 'react';
import { Notification } from '../services/NotificationService';

type AddProps = {
  onCreate: (notification: Notification) => void;
};

const Add = (props: AddProps) => {
  const [value, setValue] = useState<Notification['value']>(1);
  const [unit, setUnit] = useState<Notification['unit']>('day');

  return (
    <div style={{ textAlign: 'center' }}>
      <Space>
        <InputNumber min={1} max={10} value={value} onChange={setValue} />
        <Select value={unit} onChange={setUnit}>
          <Select.Option value="minute">minuty</Select.Option>
          <Select.Option value="hour">godziny</Select.Option>
          <Select.Option value="day">dni</Select.Option>
        </Select>
        <Button type="primary" onClick={() => props.onCreate({ value, unit })}>
          Dodaj
        </Button>
      </Space>
    </div>
  );
};

type NotificationsPickerProps = {
  notifications: Notification[];
  onCreate: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
};

export default function NotificationPicker(props: NotificationsPickerProps) {
  const unitTranslation = {
    minute: 'minuty',
    hour: 'godziny',
    day: 'dni',
  };

  const columns = [
    {
      title: 'Wartość',
      dataIndex: 'value',
    },
    {
      title: 'Czas',
      dateIndex: 'unit',
      render: (notification: Notification) => unitTranslation[notification.unit],
    },
    {
      key: 'actions',
      render: (notification: Notification) => (
        <Button type="link" onClick={() => props.onDelete(notification)}>
          Usuń
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        pagination={false}
        footer={() => <Add onCreate={props.onCreate} />}
        columns={columns}
        dataSource={props.notifications}
      />
    </div>
  );
}
