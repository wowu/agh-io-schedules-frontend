import { Button, List, Row, Modal } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../services/ScheduleService';
import EventDetails from './EventDetails';
import moment from 'moment';
import 'moment/locale/pl';

export interface EventListItemProps {
  item: Event;
}

function getLecturerFullName(event: Event) {
  return event.lecturerName + ' ' + event.lecturerSurname;
}

function getTime(event: Event) {
  const begin = moment(event.beginTime);
  const end = moment(event.endTime);
  begin.locale('pl');
  end.locale('pl');
  if (end.diff(begin, 'days') < 1) {
    return `${begin.format('dddd, D MMMM \u00B7 HH:MM')} - ${end.format('HH:MM')}`;
  } else {
    return `${begin.format('dddd, D MMMM \u00B7 HH:MM')} - ${end.format(
      'dddd, D MMMM \u00B7 HH:MM'
    )}`;
  }
}

export default function EventListItem(props: EventListItemProps) {
  const [detailsShown, setDetailsShown] = useState(false);

  const showModal = () => {
    setDetailsShown(true);
  };

  const handleOk = () => {
    setDetailsShown(false);
  };

  const handleCancel = () => {
    setDetailsShown(false);
  };

  return (
    <>
      <List.Item actions={[<Button onClick={showModal}>Szczegóły</Button>]}>
        <List.Item.Meta
          title={
            <Row justify={'space-between'}>
              <div>{props.item.eventName}</div> <div>{getTime(props.item)}</div>
            </Row>
          }
          description={<Row>{getLecturerFullName(props.item)} </Row>}
        />
      </List.Item>
      <Modal
        visible={detailsShown}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={'Schowaj'}
        footer={
          <Button key="back" onClick={handleCancel}>
            Schowaj
          </Button>
        }
      >
        <EventDetails event={props.item} />
      </Modal>
    </>
  );
}
