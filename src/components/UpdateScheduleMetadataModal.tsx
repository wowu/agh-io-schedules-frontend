import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { Schedule, ScheduleService } from '../services/ScheduleService';

interface UpdateScheduleMetadataModalProps {
  schedule: Schedule;
  updateCallback: Function;
}

export default function UpdateScheduleMetadataModal(props: UpdateScheduleMetadataModalProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>(props.schedule.name);
  const [description, setDescription] = useState<string>(props.schedule.description);

  function showModal() {
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  async function save() {
    hideModal();
    const fields = new FormData();
    fields.append('name', name);
    fields.append('description', description);
    ScheduleService.updateScheduleMetadata(fields, props.schedule.id)
      .then((_data) => props.updateCallback())
      .catch((error) => console.log(error));
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        <Row gutter={8}>
          <Col>
            <EditOutlined />
          </Col>
          <Col>Edytuj metadane</Col>
        </Row>
      </Button>
      <Modal
        visible={visible}
        title="Zaktualizuj metadane"
        onCancel={hideModal}
        footer={<Button onClick={save}>Zapisz</Button>}
      >
        <>
          <Col>
            <Input
              addonBefore={'Nazwa'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: 16 }}
            ></Input>
            <Input
              addonBefore={'Opis'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Input>
          </Col>
        </>
      </Modal>
    </>
  );
}
