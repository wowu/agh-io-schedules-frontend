import CenteredHeader from '../components/CenteredHeader';
import { useState, useEffect } from 'react';
import { Badge, Calendar, Col, List, Row, Spin, Button, Input, notification } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Schedule as ISchedule, Event, ScheduleService } from '../services/ScheduleService';
import UpdateScheduleModal from '../components/UpdateScheduleModal';
import EventListItem from '../components/EventListItem';
import CopyToClipboardButton from '../components/CopyToClipboardButton';
import { DownloadFileButton } from '../components/DownloadFileButton';
import UpdateScheduleMetadataModal from '../components/UpdateScheduleMetadataModal';
import PublicSubscribeForm, { PublicSubscribeFormValues } from '../components/PublicSubscribeForm';

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

function findEventsOnSameDay(schedule: ISchedule, date: moment.Moment): Array<Event> {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'day'));
}
function findEventsOnSameMonth(schedule: ISchedule, date: moment.Moment): Array<Event> {
  return schedule.events.filter((e: Event) => moment(e.beginTime).isSame(date, 'month'));
}

export default function Schedule() {
  const { id, publicUUID } = useParams<any>();
  const [schedule, setSchedule] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dateValue, setDateValue] = useState<moment.Moment>(moment());
  const [currentEvents, setCurrentEvents] = useState<Array<Event>>([]);
  const [publicLink, setPublicLink] = useState<string>('');
  const [errorSubscribing, setErrorSubscribing] = useState<boolean>(false);

  let isPublic = false;
  if (publicUUID) {
    isPublic = true;
  }

  function loadSchedule() {
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
        setLoading(false);
        setPublicLink(ScheduleService.buildPublicLink(data));
      })
      .catch((reason: any) => {
        console.log(reason);
      });
  }

  useEffect(() => {
    loadSchedule();
  }, [id]);

  useEffect(() => {
    if (schedule) {
      setCurrentEvents(findEventsOnSameDay(schedule, dateValue));
      console.log(dateValue);
    }
  }, [dateValue, schedule]);

  function handlePublicSubcriptionSubmit(values: PublicSubscribeFormValues) {
    console.log(values);
    ScheduleService.addPublicSubscriber(values.email, publicUUID)
      .then((data) => {
        notification.info({
          message: 'Jesteś zapisany na ten harmonogram',
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
          <Spin size="large" />
        </Row>
      ) : (
        <>
          {!isPublic && (
            <Row justify={'end'} gutter={16}>
              <Col>
                <UpdateScheduleMetadataModal schedule={schedule} updateCallback={loadSchedule} />
              </Col>
            </Row>
          )}
          <CenteredHeader title={schedule.name} subtitle={schedule.description} />

          <Row gutter={[16, 16]} justify="space-between">
            <Col span={24} xl={12}>
              <Calendar
                dateCellRender={(date: moment.Moment) => dateCellRender(date, schedule)}
                monthCellRender={(date: moment.Moment) => monthCellRender(date, schedule)}
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
          {!isPublic && (
            <Row gutter={16}>
              <Col>
                <UpdateScheduleModal />
              </Col>
              <Col>
                <DownloadFileButton
                  downloadHandler={() => ScheduleService.downloadSchedule(schedule.id)}
                  filename={'schedule.xls'}
                >
                  <Button type="primary">Pobierz harmonogram</Button>
                </DownloadFileButton>
              </Col>
              <Col>
                <Input addonBefore={'Publiczny link do harmonogramu'} value={publicLink} />
              </Col>
              <Col>
                <CopyToClipboardButton content={publicLink} />
              </Col>
            </Row>
          )}
          {isPublic && <Row justify="center">
            <Col>
              <PublicSubscribeForm onSubmit={handlePublicSubcriptionSubmit} />
            </Col>
          </Row>}
        </>
      )}
    </>
  );
}
