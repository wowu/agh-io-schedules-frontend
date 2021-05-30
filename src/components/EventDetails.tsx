import { ClockCircleOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import moment from 'moment';
import { Event } from '../services/ScheduleService';

export interface EventProps {
  event: Event;
}

export default function EventDetails(props: EventProps) {
  function formatTime() {
    const begin = moment(props.event.beginTime);
    const end = moment(props.event.endTime);
    return begin.format('dddd, D MMMM \u00B7 HH:MM') + ' - ' + end.format('HH:MM');
  }

  return (
    <>
      <Row>
        <Col>
          <h2>{props.event.eventName}</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>{props.event.lecturerName + ' ' + props.event.lecturerSurname}</h4>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <TeamOutlined />
        </Col>
        <Col span={22}>{props.event.groupName}</Col>
      </Row>
      <Row>
        <Col span={2}>
          <ClockCircleOutlined />
        </Col>
        <Col span={22}>{formatTime()}</Col>
      </Row>
      <Row>
        <Col span={2}>
          <EnvironmentOutlined />
        </Col>
        <Col span={22}>{props.event.form === 'HOME' ? 'Zdalnie' : props.event.room}</Col>
      </Row>
    </>
  );
}
