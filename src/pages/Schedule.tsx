import CenteredHeader from '../components/CenteredHeader';
import React, { useState } from 'react';
import { Alert, Badge, Button, Calendar, Col, List, Modal, Row } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { ScheduleService } from '../services/ScheduleService';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import ImportCollisions from '../components/ImportCollisions';
import ImportError from '../components/ImportError';
import ImportNetworkFailure from '../components/ImportNetworkFailure';

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
        { type: 'success', content: 'This is usual event.' }
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' }
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event。。....' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' }
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
      <Badge count={`${listData.length} events`} style={{ backgroundColor: '#52c41a' }}/>
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

const scheduleDataRequiredToUpload = {
  id: 1
};

const data = [
  {
    title: 'Event 1'
  },
  {
    title: 'Event 2'
  },
  {
    title: 'Event 3'
  },
  {
    title: 'Event 4'
  }
];


export default function Schedule() {
  const [schedules, setSchedules] = useState<any>();


  const [uploading, setUploading] = useState<boolean>(false);
  const [updateFile, setUpdateFile] = useState<any>([]);
  let [updateSuccessData, setUpdateSuccessData] = useState<any>();
  let [updateCollisionsData, setUpdateCollisionsData] = useState<any>();
  let [updateStatus, setUpdateStatus] = useState<UpdateFileStatus>(UpdateFileStatus.default);
  let [updateResponse, setUpdateResponse] = useState<{ status: number; statusText: string }>({
    status: -1,
    statusText: ''
  });
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  let [updateError, setUpdateError] = useState<{ message: string }>({ message: '' });

  const loadSchedules = async () => {
    const json = await ScheduleService.getSchedule(1);
    setSchedules(json);
  };

  const showMessage = () => {
    switch (updateStatus) {
      case UpdateFileStatus.default:
        return <></>;
      case UpdateFileStatus.success:
        return <Alert
          message="Nie znaleziono kolizji w nowej wersji."
          description="Zaktualizowano harmonogram."
          type="success"
          showIcon
        />;
      case UpdateFileStatus.collisions:
        return ImportCollisions(updateCollisionsData);
      case UpdateFileStatus.error:
        return ImportError(updateResponse);
      case UpdateFileStatus.networkFailure:
        return ImportNetworkFailure(updateError);
    }
  };

  const onNetworkFailure = (error: { message: string }) => {
    console.log(error);
    setUpdateError(error);
    setUpdateStatus(UpdateFileStatus.networkFailure);
  };

  const onOtherError = (response: any) => {
    setUpdateResponse(response);
    setUpdateStatus(UpdateFileStatus.error);
  };

  const onUploadCollisions = (collisionsData: any) => {
    setUpdateCollisionsData({"schedulesWithConflicts": [collisionsData]});
    setUpdateStatus(UpdateFileStatus.collisions);
  };

  const onUploadSuccess = (newSchedulesData: any) => {
    setUpdateSuccessData(newSchedulesData);
    setUpdateStatus(UpdateFileStatus.success);
    setUpdateFile([]);
  };


  const uploadNewSchedule = async () => {
    const formData = new FormData();
    formData.append('files[]', updateFile[0]);
    setUploading(true);
    try {
      const { response, data } = await ScheduleService.updateSchedule(formData, scheduleDataRequiredToUpload.id, false); //TODO: failure param only for development
      if (response.ok) {
        onUploadSuccess(data);
      } else if (response.status == 400) {
        onUploadCollisions(data);
      } else {
        onOtherError(response);
      }
    } catch (error) {
      onNetworkFailure(error.error);
    } finally {
      setUploading(false);
    }
  };

  const showModal = () => {
    setUpdateVisible(true);
  };


  const handleUploadedSuccess = () => {
    setUpdateFile([]);
    setUpdateStatus(UpdateFileStatus.default);
    setUpdateVisible(false);
    // TODO Refresh current schedule
  };

  let draggerProps = {
    onRemove: (file: any) => {
      setUpdateFile([]);
    },
    beforeUpload: (file: File) => {
      setUpdateFile([file]);
      return false;
    },
    multiple: false,
    maxCount: 1,
    fileList: updateFile,
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
  };

  const updateButtons = (): any => {
    switch (updateStatus) {
      case UpdateFileStatus.success: {
        return [<Button key="back" onClick={handleUploadedSuccess}>
          Zamknij
        </Button>]
      }
      default: {
        return [
          <Button key="back" onClick={() => {
            setUpdateVisible(false);
            setUpdateFile([]);
          }}>
            Zamknij
          </Button>,
          <Button key="submit" type="primary" loading={uploading} onClick={uploadNewSchedule}
                  disabled={updateFile.length === 0}>
            Wyślij harmonogram
          </Button>
        ];
      }
    }
  };

  return (
    <>
      {schedules && <ReactJson src={schedules} collapsed={false}/>}
      <Button onClick={loadSchedules}>Załaduj harmonogramy</Button>
      <CenteredHeader title="Harmonogram 1"/>

      <Row gutter={[16, 16]} justify="space-between">
        <Col span={24} xl={12}>
          <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender}/>
        </Col>
        <Col span={24} xl={11}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item actions={[<Button>Szczegóły</Button>]}>
                <List.Item.Meta title={<Link to="#">{item.title}</Link>} description="Jakiś opis"/>
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row>
        <Button type="primary" onClick={showModal}>
          Wyślij nową wersję harmonogramu
        </Button>
        <Modal
          visible={updateVisible}
          title="Zaktualizuj plik harmonogramu"
          footer={updateButtons()}
        >
          <>
            {updateStatus != UpdateFileStatus.success && <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined/>
              </p>
              <p className="ant-upload-text">Kliknij lub przeciągnij plik z harmonogramem</p>
              <p className="ant-upload-hint">
                Dopuszczalne formaty: <br/> xls, xlsx
              </p>
            </Dragger>}
            <br/>
            {showMessage()}
          </>
        </Modal>
      </Row>
    </>
  );
}
