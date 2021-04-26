import { Modal, Form, Input } from 'antd';
import React, { useState } from 'react';
import { Lecturer } from '../services/LecturerEmailsService';

export interface LecturerFormValues {
  name: string;
  email: string;
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
        <Form.Item name="name" label="Imię i nazwisko" rules={[{ required: true }]}>
          <Input placeholder="Jan kowalski" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="kowalski@example.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
