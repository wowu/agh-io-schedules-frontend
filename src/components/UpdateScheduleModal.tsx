import { Modal, Button, Alert } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Schedule, ScheduleService } from '../services/ScheduleService';
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
interface UpdateScheduleModalProps {
  schedule: Schedule;
}

export default function UpdateScheduleModal(props: UpdateScheduleModalProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [updateFile, setUpdateFile] = useState<any>([]);
  let [updateSuccessData, setUpdateSuccessData] = useState<any>();
  let [updateCollisionsData, setUpdateCollisionsData] = useState<any>({
    schedulesWithConflicts: [],
  });
  let [updateStatus, setUpdateStatus] = useState<UpdateFileStatus>(UpdateFileStatus.default);
  let [updateResponse, setUpdateResponse] = useState<{ status: number; statusText: string }>({
    status: -1,
    statusText: '',
  });
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  let [updateError, setUpdateError] = useState<{ message: string }>({ message: '' });

  const handleUploadedSuccess = () => {
    setUpdateFile([]);
    setUpdateStatus(UpdateFileStatus.default);
    setUpdateVisible(false);
    // TODO Refresh current schedule
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
    setUpdateCollisionsData({ schedulesWithConflicts: [collisionsData] });
    setUpdateStatus(UpdateFileStatus.collisions);
  };

  const onUploadSuccess = (newSchedulesData: any) => {
    setUpdateSuccessData(newSchedulesData);
    setUpdateStatus(UpdateFileStatus.success);
    setUpdateFile([]);
  };

  const uploadNewSchedule = async () => {
    const formData = new FormData();
    formData.append('file', updateFile[0]);
    setUploading(true);
    try {
      const { response, data } = await ScheduleService.updateSchedule(formData, props.schedule.id);
      if (response.ok) {
        onUploadSuccess(data);
      } else if (response.status === 400) {
        onUploadCollisions(data);
      } else {
        onOtherError(response);
      }
    } catch (error) {
      console.log(error);
      onNetworkFailure(error.error);
    } finally {
      setUploading(false);
    }
  };

  const hideModal = () => {
    setUpdateVisible(false);
    setUpdateCollisionsData({ schedulesWithConflicts: [] });
  };

  const showModal = () => {
    setUpdateVisible(true);
    setUpdateCollisionsData({ schedulesWithConflicts: [] });
  };

  const showMessage = () => {
    switch (updateStatus) {
      case UpdateFileStatus.default:
        return <></>;
      case UpdateFileStatus.success:
        return (
          <Alert
            message="Nie znaleziono kolizji w nowej wersji."
            description="Zaktualizowano harmonogram."
            type="success"
            showIcon
          />
        );
      case UpdateFileStatus.collisions:
        return ImportCollisions(updateCollisionsData);
      case UpdateFileStatus.error:
        return ImportError(updateResponse);
      case UpdateFileStatus.networkFailure:
        return ImportNetworkFailure(updateError);
    }
  };

  const updateButtons = (): any => {
    switch (updateStatus) {
      case UpdateFileStatus.success: {
        return [
          <Button key="back" onClick={handleUploadedSuccess}>
            Zamknij
          </Button>,
        ];
      }
      default: {
        return [
          <Button
            key="back"
            onClick={() => {
              setUpdateVisible(false);
              setUpdateFile([]);
            }}
          >
            Zamknij
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={uploadNewSchedule}
            disabled={updateFile.length === 0}
          >
            Wyślij harmonogram
          </Button>,
        ];
      }
    }
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
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Wyślij nową wersję
      </Button>
      <Modal
        onCancel={hideModal}
        visible={updateVisible}
        title="Zaktualizuj plik harmonogramu"
        footer={updateButtons()}
      >
        <>
          {updateStatus !== UpdateFileStatus.success && (
            <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Kliknij lub przeciągnij plik z harmonogramem</p>
              <p className="ant-upload-hint">
                Dopuszczalne formaty: <br /> xls, xlsx
              </p>
            </Dragger>
          )}
          <br />
          {showMessage()}
        </>
      </Modal>
    </>
  );
}
