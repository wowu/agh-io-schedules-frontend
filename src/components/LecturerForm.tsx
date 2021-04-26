import { Modal, Form, Input, Switch, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Lecturer } from '../services/LecturerEmailsService';

export interface LecturerFormValues {
  name: string;
  surname: string;
  email: string;
  activeSubscription: boolean;
}

interface LecturerFormProps {
  title: string;
  lecturer?: Lecturer;
  visible: boolean;
  onSubmit: (values: LecturerFormValues) => void;
  onCancel: () => void;
}

export default function LecturerForm(props: LecturerFormProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      title={props.title}
      okText="Zapisz"
      cancelText="Anuluj"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            props.onSubmit(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form id="addEmail" layout="vertical" form={form} initialValues={props.lecturer}>
        <Form.Item name="name" label="Imię" rules={[{ required: true }]}>
          <Input placeholder="Jan" />
        </Form.Item>
        <Form.Item name="surname" label="Nazwisko" rules={[{ required: true }]}>
          <Input placeholder="Kowalski" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="kowalski@example.com" />
        </Form.Item>
        <Form.Item valuePropName="checked" name="activeSubscription">
          <Checkbox>Włączone powiadomienia</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
