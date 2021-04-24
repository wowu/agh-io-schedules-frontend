import CenteredHeader from '../components/CenteredHeader';
import React, { useState } from 'react';
import { Badge, Button, Calendar, Col, List, Modal, Row } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { ScheduleService } from '../services/ScheduleService';
import UpdateScheduleModal from '../components/UpdateScheduleModal';

enum UpdateFileStatus {
  default,
  success,
  collisions,
  error,
  networkFailure,
}

function getListData(value: moment.Moment) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
  }
  return listData || [];
}

function dateCellRender(value: moment.Moment) {
  const listData = getListData(value);
  return (
    listData.length > 0 && (
      <Badge count={`${listData.length} events`} style={{ backgroundColor: '#52c41a' }} />
      // <Badge status="success" text={`${listData.length} wydarzenia`}/>
    )
    // <ul className="events">
    //   {listData.map(item => (
    //     <li key={item.content}>
    //       <Badge status={item.type as PresetStatusColorType} text={item.content}/>
    //     </li>
    //   ))}
    // </ul>
  );
}

function getMonthData(value: moment.Moment) {
  return 'month description';
}

function monthCellRender(value: moment.Moment) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
    </div>
  ) : null;
}

const data = [
  {
    title: 'Event 1',
  },
  {
    title: 'Event 2',
  },
  {
    title: 'Event 3',
  },
  {
    title: 'Event 4',
  },
];

export default function Schedule() {
  const [schedules, setSchedules] = useState<any>();

  const loadSchedules = async () => {
    const json = await ScheduleService.getSchedule(1);
    setSchedules(json);
  };

  return (
    <>
      {schedules && <ReactJson src={schedules} collapsed={false} />}
      <Button onClick={loadSchedules}>Załaduj harmonogramy</Button>
      <CenteredHeader title="Harmonogram 1" />

      <Row gutter={[16, 16]} justify="space-between">
        <Col span={24} xl={12}>
          <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
        </Col>
        <Col span={24} xl={11}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item actions={[<Button>Szczegóły</Button>]}>
                <List.Item.Meta title={<Link to="#">{item.title}</Link>} description="Jakiś opis" />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row>
        <UpdateScheduleModal />
      </Row>
    </>
  );
}
