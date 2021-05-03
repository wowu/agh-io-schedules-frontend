import { Alert, Col, Row } from 'antd';
import React from 'react';

export default function ImportError(error: { message: string }) {
  console.error(error);
  return (
    <>
      <Row>
        <Col span={24}>
          <Alert message="Wystąpił błąd" description={error.message} type="error" showIcon />
          <br />
        </Col>
      </Row>
    </>
  );
}
