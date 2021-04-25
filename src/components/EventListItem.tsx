import { Button, List, Row, Modal } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../services/ScheduleService';
import EventDetails from './EventDetails';

export interface EventListItemProps {
  item: Event;
}

function getLecturerFullName(event: Event) {
  return event.lecturerName + ' ' + event.lecturerSurname;
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
          title={<Link to="#">{props.item.eventName}</Link>}
          description={<Row>{getLecturerFullName(props.item)}</Row>}
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
