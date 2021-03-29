import { Button, Form, Input, Row } from 'antd';
import CenteredHeader from '../components/CenteredHeader';


export default function LoginForm() {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  };


  return (
    <>
      <CenteredHeader title='Zaloguj się'/>
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
          <Input/>
        </Form.Item>

        <Form.Item
          label="Hasło"
          name="password"
          rules={[{ required: true, message: 'Proszę podać hasło!' }]}
        >
          <Input.Password/>
        </Form.Item>

        <Row justify="center">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Zaloguj się
            </Button>
          </Form.Item>
        </Row>

      </Form>
    </>
  );
}
