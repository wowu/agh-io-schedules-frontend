import CenteredHeader from '../components/CenteredHeader';
import {useState, useEffect, useCallback} from 'react';
import {Badge, Calendar, Col, List, Row, Spin, Button, Input, notification, Tabs, Space} from 'antd';
import moment from 'moment';
import {useParams} from 'react-router-dom';
import {Schedule as ISchedule, Event, ScheduleService} from '../services/ScheduleService';
import UpdateScheduleModal from '../components/UpdateScheduleModal';
import EventListItem from '../components/EventListItem';
import CopyToClipboardButton from '../components/CopyToClipboardButton';
import {DownloadFileButton} from '../components/DownloadFileButton';
import UpdateScheduleMetadataModal from '../components/UpdateScheduleMetadataModal';
import PublicSubscribeForm, {PublicSubscribeFormValues} from '../components/PublicSubscribeForm';
import ScheduleSubscribersManagement from '../components/ScheduleSubscribersTable';
import {useUser} from '../helpers/user';

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
        <Badge count={getBadgeText(events.length)} style={{backgroundColor: '#52c41a'}}/>
      </Row>
    )
  );
}

function monthCellRender(date: moment.Moment, schedule: ISchedule) {
  const events = findEventsOnSameMonth(schedule, date);
  return (
    events.length > 0 && (
      <Badge count={getBadgeText(events.length)} style={{backgroundColor: '#52c41a'}}/>
    )
  );
}

function findEventsOnSameDay(schedule: ISchedule, date: moment.Moment): Array<Event> {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'day'));
}

function findEventsOnSameMonth(schedule: ISchedule, date: moment.Moment): Array<Event> {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'month'));
}

function getAllEvents(schedule: ISchedule): Array<Event> {
  return schedule.events;
}

export default function Schedule() {
  const user = useUser();

  const {id, publicUUID} = useParams<any>();
  const [schedule, setSchedule] = useState<any>();
  const [events, setEvents] = useState<Array<Event>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateValue, setDateValue] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<Array<Event>>([]);
  const [publicLink, setPublicLink] = useState<string>('');

  let isPublic = false;
  if (publicUUID) {
    isPublic = true;
  }

  const loadSchedule = useCallback(() => {
    let promise;
    if (isPublic) {
      promise = ScheduleService.getPublicSchedule(publicUUID);
    } else if (id) {
      promise = ScheduleService.getSchedule(parseInt(id));
    } else {
      return;
    }

    promise
      .then((data) => {
        setSchedule(data);
        console.log(data);
        setLoading(false);
        setPublicLink(ScheduleService.buildPublicLink(data));
      })
      .catch((reason: any) => {
        console.log(reason);
      });
  }, [id, publicUUID, isPublic]);

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
      setEvents(getAllEvents(schedule))
    }
    else{
      setEvents([])
    }
  }, [schedule]);


  useEffect(() => {
      if(events.length > 0) {
        events.sort((a: Event, b: Event): number => {
          return moment(a.beginTime).unix() - moment(b.beginTime).unix();
        })
        setDateValue(moment(events[0].beginTime))
      }
  }, [events]);

  function getScheduleFilename() {
    return schedule.name.replace(/ /g, '_') + '.xlsx';
  }

  function handlePublicSubscriptionSubmit(values: PublicSubscribeFormValues) {
    console.log(values);
    ScheduleService.addPublicSubscriber(values.email, publicUUID)
      .then((data) => {
        notification.info({
          message: 'Zostałeś zapisany na powiadomienia o wydarzeniach',
          duration: 3,
        });
      })
      .catch((error) => {
        console.log(error);
        notification.warn({
          message: 'Wystąpił błąd przy zapisywaniu',
          duration: 3,
        });
      });
  }

  return (
    <>
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large"/>
        </Row>
      ) : (
        <>
          {!isPublic && user?.isAdmin && (
            <Row justify={'end'} gutter={16}>
              <Col>
                <UpdateScheduleMetadataModal schedule={schedule} updateCallback={loadSchedule}/>
              </Col>
            </Row>
          )}
          <CenteredHeader title={schedule.name} subtitle={schedule.description}/>


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
                    onChange={(date) => {setDateValue(date)}}
                  />
                </Col>
                <Col span={24} xl={11}>
                  <List
                    itemLayout="horizontal"
                    dataSource={currentEvents}
                    renderItem={(item) => <EventListItem item={item}/>}
                  />
                </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Lista wydarzeń" key="2">
                <Row justify="space-around">
                <Col span={24} xl={12}>
                  <List
                    pagination={{
                      onChange: page => {
                        console.log(page);
                      },
                      pageSize: 8,
                    }}
                    itemLayout="horizontal"
                    dataSource={events}
                    renderItem={(item) => <EventListItem item={item}/>}
                  />
                </Col>
                  </Row>
              </Tabs.TabPane>
            </Tabs>
            </Col>


          </Row>
          {!isPublic && user?.isAdmin && (
            <>
              <Row gutter={16}>
                <Col>
                  <UpdateScheduleModal schedule={schedule}/>
                </Col>
                <Col>
                  <DownloadFileButton
                    downloadHandler={() => ScheduleService.downloadSchedule(schedule.id)}
                    filename={getScheduleFilename()}
                  >
                    <Button type="primary">Pobierz harmonogram</Button>
                  </DownloadFileButton>
                </Col>
                <Col>
                  <Input addonBefore={'Publiczny link'} value={publicLink}/>
                </Col>
                <Col>
                  <CopyToClipboardButton content={publicLink}/>
                </Col>
              </Row>
              <Row justify={'center'}>
                <Col span={24}>
                  <ScheduleSubscribersManagement scheduleId={schedule.id}/>
                </Col>
              </Row>
            </>
          )}
          {isPublic && (
            <Row justify="center">
              <Col>
                <PublicSubscribeForm onSubmit={handlePublicSubscriptionSubmit}/>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
}
