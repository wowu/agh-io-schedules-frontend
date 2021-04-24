import CenteredHeader from '../components/CenteredHeader';
import { useState, useEffect } from 'react';
import { Badge, Calendar, Col, List, Row, Spin } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Schedule as ISchedule, Event, ScheduleService } from '../services/ScheduleService';
import UpdateScheduleModal from '../components/UpdateScheduleModal';
import EventListItem from '../components/EventListItem';

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

function getBadgeText(count: number): string {
  switch (count) {
    case 0: return '';
    case 1: return '1 event';
    default: return `${count} events`
  }
}

function dateCellRender(date: moment.Moment, schedule: ISchedule) {

  const events = findEventsOnSameDay(schedule, date);
  return (
    events.length > 0 && (
      <Badge count={getBadgeText(events.length)} style={{ backgroundColor: '#52c41a' }} />
    )
  );
}

function getMonthData(date: moment.Moment) {
  return '';
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

function findEventsOnSameDay(schedule: ISchedule, date: moment.Moment): Array<Event> {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'day'));
}

export default function Schedule() {
  const params = useParams<any>();
  console.log('params', params);


  const [schedule, setSchedule] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dateValue, setDateValue] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<Array<Event>>([]);

  useEffect(() => {
    ScheduleService.getSchedule(parseInt(params.id))
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch((reason: any) => console.log(reason));

  }, []);

  useEffect(() => {
    if (schedule != undefined)
      setCurrentEvents(findEventsOnSameDay(schedule, dateValue))
  }, [dateValue, schedule])

  return (
    <>
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <>
          <CenteredHeader title={schedule.name} subtitle={schedule.description} />
          <Row gutter={[16, 16]} justify="space-between">
            <Col span={24} xl={12}>
              <Calendar
                dateCellRender={(date: moment.Moment) => dateCellRender(date, schedule)}
                monthCellRender={monthCellRender}
                value={dateValue}
                onChange={(date) => setDateValue(date)}
              />
            </Col>
            <Col span={24} xl={11}>
              <List
                itemLayout="horizontal"
                dataSource={currentEvents}
                renderItem={(item) => (
                  <EventListItem item={item} />
                )}
              />
            </Col>
          </Row>
          <Row>
            <UpdateScheduleModal />
          </Row>
        </>
      )}
    </>
  );
}
