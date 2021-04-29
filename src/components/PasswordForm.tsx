import { Button, Checkbox, Form, Input, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';

type PasswordFormProps = {
  loading: boolean;
  onSave: (password: string) => void;
};

export default function PasswordForm(props: PasswordFormProps) {
  const [form] = useForm();
  const [disabled, setDisabled] = useState(true);

  const onChange = ({ password }: any) => {
    setDisabled(password === '');
  };

  const handleSave = () => {
    props.onSave(form.getFieldValue('password'));
    form.setFieldsValue({ password: '' });
    setDisabled(true);
  };

  return (
    <>
      <Form layout="vertical" form={form} onValuesChange={onChange}>
        <Form.Item label="Nowe Hasło" name="password">
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleSave} loading={props.loading} type="primary" disabled={disabled}>
            Zmień hasło
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
