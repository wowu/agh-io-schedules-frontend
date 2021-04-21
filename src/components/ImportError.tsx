import { Alert, Col, Row } from 'antd';
import React from 'react';

export default function ImportError(error: { status: number, statusText: string }){
  const getDescription = () => {
    return `Powód: ${error.status} - ${error.statusText}`;
  }
  return (
    <>
      <Row>
        <Col span={24}>
          <Alert
            message="Wystąpił błąd"
            description={getDescription()}
            type="error"
            showIcon
          />
          <br /></Col>
      </Row>
    </>
  );
}
