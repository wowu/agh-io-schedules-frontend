import { UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useState } from 'react';

export interface PublicSubscribeFormValues {
  email: string;
}

export interface PublicSubscribeFormProps {
  onSubmit: (values: PublicSubscribeFormValues) => void;
}

export default function PublicSubscribeForm(props: PublicSubscribeFormProps) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);

  function showModal() {
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  return (
    <>
      <Row>
        <Col>
          <Button type="primary" onClick={showModal}>
            <Row gutter={8}>
              <Col>
                <UserAddOutlined />
              </Col>
              <Col>Zapisz się na powiadomienia</Col>
            </Row>
          </Button>
          <Modal
            visible={visible}
            title="Zapisz się na powiadomienia"
            okText="Zapisz"
            cancelText="Anuluj"
            onCancel={hideModal}
            onOk={() => {
              form
                .validateFields()
                .then((values) => {
                  form.resetFields();
                  props.onSubmit(values);
                  hideModal();
                })
                .catch((info) => {
                  console.log('Validate Failed:', info);
                });
            }}
          >
            <>
              <Form form={form}>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input />
                </Form.Item>
              </Form>
            </>
          </Modal>
        </Col>
      </Row>
    </>
  );
}
