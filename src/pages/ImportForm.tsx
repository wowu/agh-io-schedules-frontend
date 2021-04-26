import { Button, Col, Form, Row } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import CenteredHeader from '../components/CenteredHeader';
import React, { useState } from 'react';
import { ScheduleService } from '../services/ScheduleService';
import ImportSuccess from '../components/ImportSuccess';
import ImportCollisions from '../components/ImportCollisions';
import ImportError from '../components/ImportError';
import ImportNetworkFailure from '../components/ImportNetworkFailure';

enum ImportStatus {
  default,
  success,
  collisions,
  error,
  networkFailure,
}

export default function ImportForm() {
  let [files, setFiles] = useState<any>([]);
  let [uploading, setUploading] = useState<boolean>(false);
  let [importStatus, setImportStatus] = useState<ImportStatus>(ImportStatus.default);

  let [successData, setSuccessData] = useState<{ uploaded: [] }>({ uploaded: [] });
  let [collisionsData, setCollisionsData] = useState<{ schedulesWithConflicts: [] }>({
    schedulesWithConflicts: [],
  });
  let [response, setResponse] = useState<{ status: number; statusText: string }>({
    status: -1,
    statusText: '',
  });
  let [error, setError] = useState<{ message: string }>({ message: '' });

  const showMessage = () => {
    switch (importStatus) {
      case ImportStatus.default:
        return <></>;
      case ImportStatus.success:
        return ImportSuccess(successData);
      case ImportStatus.collisions:
        return ImportCollisions(collisionsData);
      case ImportStatus.error:
        return ImportError(response);
      case ImportStatus.networkFailure:
        return ImportNetworkFailure(error);
    }
  };

  const onNetworkFailure = (error: { message: string }) => {
    console.log(error);
    setError(error);
    setImportStatus(ImportStatus.networkFailure);
  };

  const onOtherError = (response: any) => {
    setResponse(response);
    setImportStatus(ImportStatus.error);
  };

  const onUploadCollisions = (collisionsData: { schedulesWithConflicts: [] }) => {
    setCollisionsData(collisionsData);
    setImportStatus(ImportStatus.collisions);
  };

  const onUploadSuccess = (newSchedulesData: { uploaded: [] }) => {
    setSuccessData(newSchedulesData);
    setImportStatus(ImportStatus.success);
    setFiles([]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append('files[]', file);
    });
    setUploading(true);
    try {
      const { response, data } = await ScheduleService.sendNewSchedules(formData, false); //TODO: failure param only for development
      if (response.ok) {
        onUploadSuccess(data);
      } else if (response.status === 400) {
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

  let draggerProps = {
    onRemove: (file: any) => {
      setFiles((prevFiles: any) => {
        const index = prevFiles.indexOf(file);
        return prevFiles.filter((el: any) => el !== file);
      });
    },
    beforeUpload: (file: File) => {
      setFiles((prevFiles: Array<File>) => [...prevFiles, file]);
      return false;
    },
    multiple: true,
    fileList: files,
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  };

  return (
    <>
      <CenteredHeader title={'Wyślij harmonogram'} />
      <Form name="basic" initialValues={{ remember: true }}>
        <Col span={12} offset={6}>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kliknij lub przeciągnij plik z harmonogramem</p>
            <p className="ant-upload-hint">
              Dopuszczalne formaty: <br /> xls, xlsx
            </p>
          </Dragger>
          <br />
        </Col>
      </Form>
      <Row justify={'center'}>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={files.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Wysyłanie' : 'Wyślij harmonogramy'}
          </Button>
        </Form.Item>
      </Row>
      <Row justify={'center'}>
        <Col sm={12} span={24}>
          {showMessage()}
        </Col>
      </Row>
    </>
  );
}
