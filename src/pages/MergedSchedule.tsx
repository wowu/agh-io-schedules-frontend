import CenteredHeader from '../components/CenteredHeader';
import { useState, useEffect, useCallback } from 'react';
import { Badge, Calendar, Col, List, Row, Spin, Tabs } from 'antd';
import moment from 'moment';
import { Schedule as ISchedule, Event, ScheduleService } from '../services/ScheduleService';
import EventListItem from '../components/EventListItem';
import { useUser } from '../helpers/user';
import { useParams } from 'react-router-dom';
import LecturersBarChart from '../components/LecturersTimelineChart';

function getBadgeText(count: number): string {
  switch (count) {
    case 0:
      return '';
    case 1:
      return '1';
    default:
      return `${count}`;
  }
}

function dateCellRender(date: moment.Moment, schedule: ISchedule) {
  const events = findEventsOnSameDay(schedule, date);
  return (
    events.length > 0 && (
      <Row justify={'center'} align={'middle'}>
        <Badge count={getBadgeText(events.length)} style={{ backgroundColor: '#52c41a' }} />
      </Row>
    )
  );
}

function monthCellRender(date: moment.Moment, schedule: ISchedule) {
  const events = findEventsOnSameMonth(schedule, date);
  return (
    events.length > 0 && (
      <Badge count={getBadgeText(events.length)} style={{ backgroundColor: '#52c41a' }} />
    )
  );
}

function findEventsOnSameDay(schedule: ISchedule, date: moment.Moment): Event[] {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'day'));
}

function findEventsOnSameMonth(schedule: ISchedule, date: moment.Moment): Event[] {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'month'));
}

function getAllEvents(schedule: ISchedule): Event[] {
  return schedule.events;
}

export default function MergedSchedule() {
  const user = useUser();
  const { lecturerId } = useParams<any>();

  const [schedule, setSchedule] = useState<any>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateValue, setDateValue] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);

  const loadSchedule = useCallback(() => {
    ScheduleService.getMergedSchedule(lecturerId)
      .then((data) => {
        setSchedule(data);
        console.log(data);
        setLoading(false);
      })
      .catch((reason: any) => {
        console.log(reason);
      });
  }, [lecturerId]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    if (schedule) {
      setCurrentEvents(findEventsOnSameDay(schedule, dateValue));
    }
  }, [dateValue, schedule]);

  useEffect(() => {
    if (schedule) {
      setEvents(getAllEvents(schedule));
    } else {
      setEvents([]);
    }
  }, [schedule]);

  useEffect(() => {
    if (events.length > 0) {
      events.sort((a: Event, b: Event): number => {
        return moment(a.beginTime).unix() - moment(b.beginTime).unix();
      });
      setDateValue(moment(events[0].beginTime));
    }
  }, [events]);

  return (
    <>
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <>
          <CenteredHeader
            title="Mój harmonogram"
            subtitle="Wydarzenia ze wszystkich harmonogramów"
          />

          <Row gutter={[16, 16]} justify="space-between">
            <Col span={24} xl={24}>
              <Tabs>
                <Tabs.TabPane tab="Widok kalendarza" key="1">
                  <Row justify="space-between">
                    <Col span={24} xl={12}>
                      <Calendar
                        dateCellRender={(date: moment.Moment) => dateCellRender(date, schedule)}
                        monthCellRender={(date: moment.Moment) => monthCellRender(date, schedule)}
                        value={dateValue}
                        onChange={(date) => {
                          setDateValue(date);
                        }}
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
                </Tabs.TabPane>
                <Tabs.TabPane tab="Lista wydarzeń" key="2">
                  <Row justify="space-around">
                    <Col span={24} xl={12}>
                      <List
                        pagination={{
                          onChange: (page) => {
                            console.log(page);
                          },
                          pageSize: 8,
                        }}
                        itemLayout="horizontal"
                        dataSource={events}
                        renderItem={(item) => <EventListItem item={item} />}
                      />
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>

          {events.length > 0 ? (
            <>
              <CenteredHeader title="Statystyki" />
              <Row style={{ height: 200 }} gutter={[16, 16]}>
                <LecturersBarChart events={events} />
              </Row>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
