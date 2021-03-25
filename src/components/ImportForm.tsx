import { Button, Checkbox, Col, Form, Input, PageHeader, Row, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import Title from 'antd/es/typography/Title';

export default function ImportForm() {
  return (
    <>
      <Row justify={'center'}>
        <PageHeader
          className="site-page-header"
          title="Wyślij harmonogram"
        />
      </Row>
      <Form
        name="basic"
        initialValues={{ remember: true }}
      >
        <Row justify={'center'}>
          <Col span={12}>
            <Dragger>
              <p className="ant-upload-drag-icon">
                <InboxOutlined/>
              </p>
              <p className="ant-upload-text">Kliknij lub przeciągnij plik z harmonogramem</p>
              <p className="ant-upload-hint">
                Dopuszczalne formaty: <br/> xls, xlsx
              </p>
            </Dragger>
          </Col>
        </Row>
        <br/>
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
};
