import { Button, Col, Form, Row } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import CenteredHeader from '../components/CenteredHeader';
import React from 'react';

export default function ImportForm() {
  return (
    <>
      <CenteredHeader title={'Wyślij harmonogram'} />
      <Form name="basic" initialValues={{ remember: true }}>
        <Row justify={'center'}>
          <Col span={12}>
            <Dragger>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kliknij lub przeciągnij plik z harmonogramem
              </p>
              <p className="ant-upload-hint">
                Dopuszczalne formaty: <br /> xls, xlsx
              </p>
            </Dragger>
          </Col>
        </Row>
        <br />
        <Row justify={'center'}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Wyślij
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
}
