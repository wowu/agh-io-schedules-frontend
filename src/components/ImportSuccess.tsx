import { Alert, Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ImportSuccess(props: { uploaded: [] }) {
  const getMessage = (schedule: any) => {
    return (
      <span>
        {schedule.name} : {schedule.eventCount} wydarzenia od{' '}
        {new Date(schedule.firstEventDate).toLocaleDateString()} do{' '}
        {new Date(schedule.lastEventDate).toLocaleDateString()}
      </span>
    );
  };

  const schedules = props.uploaded.map((schedule: any) => {
    return (
      <>
        <Alert
          message={getMessage(schedule)}
          action={
            <Link to={`/schedule/${schedule.id}`}>
              <Button size="small" type={'ghost'}>
                Zobacz
              </Button>
            </Link>
          }
          type={'success'}
        />
        <br />
      </>
    );
  });
  return (
    <>
      <Row>
        <Col span={24}>
          <Alert
            message="Import zakończony pomyślnie"
            description="Nie znaleziono kolizji. Utworzono następujące harmonogramy:"
            type="success"
            showIcon
          />
          <br />
        </Col>
      </Row>
      {schedules}
    </>
  );
}
