import React, { useContext, useState } from 'react';
import { Button, Form, Input, Row, Alert, Col } from 'antd';

import CenteredHeader from '../components/CenteredHeader';
import { AuthService, AuthResponse } from '../services/AuthService';
import { useHistory } from 'react-router-dom';
import { TokenContext } from '../contexts/token';

export default function LoginForm() {
  const history = useHistory();
  const { setToken } = useContext(TokenContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setError(null);
    setLoading(true);

    const authResponse = await AuthService.login(values.username, values.password);

    setLoading(false);

    switch (authResponse) {
      case AuthResponse.Success:
        setToken(AuthService.getToken());
        history.push('/');
        break;
      case AuthResponse.WrongPassword:
        setError('Niepoprawne dane logowania. Spróbuj ponownie.');
        break;
      case AuthResponse.UnknownError:
        setError('Wystąpił nieznany błąd.');
        break;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setError('Popraw błędy w formularzu.');
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  return (
    <>
      <CenteredHeader title="Zaloguj się" />

      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Adres e-mail"
          name="username"
          rules={[{ required: true, message: 'Proszę podać adres e-mail!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hasło"
          name="password"
          rules={[{ required: true, message: 'Proszę podać hasło!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Row justify="center">
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Zaloguj się
            </Button>
          </Form.Item>
        </Row>
        {error && (
          <Row justify="center">
            <Col span={12}>
              <Alert
                type="error"
                showIcon
                message="Błąd"
                description={error}
                style={{ marginBottom: 30 }}
              />
            </Col>
          </Row>
        )}
      </Form>
    </>
  );
}
