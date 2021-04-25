import CenteredHeader from '../components/CenteredHeader';
import { useState, useEffect } from 'react';
import { Badge, Calendar, Col, List, Row, Spin, Button } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Schedule as ISchedule, Event, ScheduleService } from '../services/ScheduleService';
import UpdateScheduleModal from '../components/UpdateScheduleModal';
import EventListItem from '../components/EventListItem';
import CopyToClipboardButton from '../components/CopyToClipboardButton';
import { DownloadFileButton } from '../components/DownloadFileButton';

const EXAMPLE_SCHEDULE: ISchedule = {
  id: 1,
  name: 'Stacjonarne - Inf - 20/21',
  description: 'Plan dla studiów stacjonarnych - wersja 13',
  eventCount: 4,
  firstEventDate: '2021-04-19T12:00:00.000Z',
  lastEventDate: '2021-05-21T12:00:00.000Z',
  publicUUID: '5b9c0167-35fb-45d5-8d83-b93c7577208d',
  events: [
    {
      id: 1,
      beginTime: '2021-04-19T12:00:00.000Z',
      endTime: '2021-04-19T15:00:00.000Z',
      eventName: 'Wykład z kododawania',
      groupName: 'wszyscy',
      lecturerName: 'Jan',
      lecturerSurname: 'Nowak',
      type: 'lecture',
      hours: 4,
      form: 'local',
      room: '3.21',
    },
    {
      id: 2,
      beginTime: '2021-04-19T16:00:00.000Z',
      endTime: '2021-04-19T19:00:00.000Z',
      eventName: 'Wykład z kododawania 2',
      groupName: 'wszyscy',
      lecturerName: 'Jan',
      lecturerSurname: 'Nowak',
      type: 'lecture',
      hours: 4,
      form: 'local',
      room: '3.21',
    },
    {
      id: 3,
      beginTime: '2021-04-29T16:00:00.000Z',
      endTime: '2021-04-29T19:00:00.000Z',
      eventName: 'Zajęcia z programistyki 2',
      groupName: 'grupa 1',
      lecturerName: 'Jan',
      lecturerSurname: 'Kowalski',
      type: 'lab',
      hours: 4,
      form: 'local',
      room: '4.21',
    },
    {
      id: 4,
      beginTime: '2021-05-21T10:30:00.000Z',
      endTime: '2021-05-21T12:00:00.000Z',
      eventName: 'Wykład z kododawania 2',
      groupName: 'grupa 2',
      lecturerName: 'Tadeusz',
      lecturerSurname: 'Kowalski',
      type: 'lab',
      hours: 2,
      form: 'local',
      room: '3.21',
    },
  ],
};

function getBadgeText(count: number): string {
  switch (count) {
    case 0:
      return '';
    case 1:
      return '1 event';
    default:
      return `${count} events`;
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

function findEventsOnSameDay(schedule: ISchedule, date: moment.Moment): Array<Event> {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'day'));
}

export default function Schedule() {
  const params = useParams<any>();

  const [schedule, setSchedule] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dateValue, setDateValue] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<Array<Event>>([]);
  const [publicLink, setPublicLink] = useState<string>('');

  useEffect(() => {
    ScheduleService.getSchedule(parseInt(params.id))
      .then((data) => {
        console.log("data",data);
        //FIXME: Problem with development API: it returns array of schedules in place of one
        setSchedule(data.schedules[0]);
        setLoading(false);
        setPublicLink(ScheduleService.buildPublicLink(data));
      })
      .catch((reason: any) => {
        console.log(reason);
        // FIXME: remove the lines below, they are used only for testing, when API not working
        setSchedule(EXAMPLE_SCHEDULE);
        setPublicLink(ScheduleService.buildPublicLink(EXAMPLE_SCHEDULE));
        setLoading(false);
      });
  }, []);
  console.log(schedule);


  useEffect(() => {
    if (schedule) {
      setCurrentEvents(findEventsOnSameDay(schedule, dateValue))};
  }, [dateValue, schedule]);

  return (
    <>
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <>
          <Row justify={'end'}>
            <CopyToClipboardButton content={publicLink} />
          </Row>
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
                renderItem={(item) => <EventListItem item={item} />}
              />
            </Col>
          </Row>
          <Row>
            <UpdateScheduleModal />
            <DownloadFileButton downloadHandler={() => ScheduleService.downloadSchedule(schedule.id)} filename={'schedule.xls'} >

              <Button type="primary">
                Pobierz harmonogram
            </Button>
            </DownloadFileButton>
          </Row>
        </>
      )}
    </>
  );
}
