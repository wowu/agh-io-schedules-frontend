import { Alert, Col, List, Row } from 'antd';
import React from 'react';

function conflictedEvents(conflictedEvents: []) {
  function getConflictedEventsTitle(event: any) {
    if (!event.beginTime || !event.lecturerName || !event.lecturerSurname) {
      return event.EventName;
    }
    return `${event.eventName} - ${new Date(event.beginTime).toLocaleString()} - ${
      event.lecturerName
    } ${event.lecturerSurname}`;
  }

  const getDescription = (reason: any) => {
    return `Przyczyna problemu: ${reason}`;
  };

  return (
    <List
      dataSource={conflictedEvents}
      renderItem={(conflict: any) => (
        <List.Item>
          <List.Item.Meta
            title={getConflictedEventsTitle(conflict.event)}
            description={getDescription(conflict.reason)}
          />
        </List.Item>
      )}
    />
  );
}

function eventProblemDescription(conflictedSchedules: []) {
  const getTitle = (schedule: any) => {
    return (
      <span>
        Kolizja z harmonogramem: <strong>{schedule.conflictedScheduleName}</strong>
      </span>
    );
  };

  return (
    <List
      header="Zidentyfikowano następujące problemy:"
      dataSource={conflictedSchedules}
      renderItem={(schedule: any) => (
        <List.Item>
          <List.Item.Meta
            title={getTitle(schedule)}
            description={conflictedEvents(schedule.conflictedEvents)}
          />
        </List.Item>
      )}
    />
  );
}

function collisionsInSchedule(eventsWithConflicts: [], scheduleName: string) {
  function getTitle(event: any) {
    if (!event.beginTime || !event.lecturerName || !event.lecturerSurname) {
      return event.EventName;
    }
    return `${event.eventName} - ${new Date(event.beginTime).toLocaleString()} - ${
      event.lecturerName
    } ${event.lecturerSurname}`;
  }

  return (
    <List
      header={<strong>{scheduleName}</strong>}
      dataSource={eventsWithConflicts}
      bordered
      renderItem={(event: any) => (
        <List.Item>
          <List.Item.Meta
            title={getTitle(event.event)}
            description={eventProblemDescription(event.conflicts)}
          />
        </List.Item>
      )}
    />
  );
}

export default function ImportCollisions(props: { schedulesWithConflicts: [] }) {
  console.log(props);
  const schedulesWithConflicts = props.schedulesWithConflicts.map((schedule: any) => {
    return (
      <>
        <Alert
          message={collisionsInSchedule(schedule.eventsWithConflicts, schedule.scheduleName)}
          type="error"
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
            message="Wykryto kolizje w harmonogramach"
            description="Napraw istniejące kolizje i spróbuj ponownie!"
            type="error"
            showIcon
          />
          <br />
        </Col>
      </Row>
      {schedulesWithConflicts}
    </>
  );
}
