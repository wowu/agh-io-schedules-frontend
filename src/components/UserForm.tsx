import { Modal, Form, Input, Checkbox } from 'antd';
import Password from 'antd/lib/input/Password';
import React, { useEffect } from 'react';
import { User } from '../services/UserService';

export interface UserFormValues {
  email: string;
  password: string;
  activeSubscription: boolean;
}

interface UserFormProps {
  title: string;
  user?: User;
  visible: boolean;
  fieldsToEdit: string[];
  onSubmit: (values: UserFormValues) => Promise<boolean>;
  onCancel: () => void;
}

export default function UserForm(props: UserFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      activeSubscription: false,
      ...props.user,
    });
  }, [props.user]);

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
          .then(async (values) => {
            const success = await props.onSubmit(values);
            if (success) form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form id="addEmail" layout="vertical" form={form}>
        {props.fieldsToEdit.includes('email') && (
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="kowalski@example.com" autoComplete="off" />
          </Form.Item>
        )}
        {props.fieldsToEdit.includes('password') && (
          <Form.Item name="password" label="Hasło" rules={[{ required: true }]}>
            <Password />
          </Form.Item>
        )}
        {props.fieldsToEdit.includes('activeSubscription') && (
          <Form.Item valuePropName="checked" name="activeSubscription" initialValue={false}>
            <Checkbox>Włączone powiadomienia</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
