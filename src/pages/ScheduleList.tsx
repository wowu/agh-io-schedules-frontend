import { ScheduleOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Spin } from 'antd';
import CenteredHeader from '../components/CenteredHeader';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user';
import { ScheduleService } from '../services/ScheduleService';

export default function ScheduleList() {
  const { user } = useContext(UserContext);

  let [schedules, setSchedules] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getScheduleList = async () => {
    const { response, data } = await ScheduleService.getListSchedules();

    setSchedules(
      data.schedules.sort(
        (a: any, b: any) =>
          new Date(b.firstEventDate).getTime() - new Date(a.firstEventDate).getTime()
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    getScheduleList().then((r) => r);
  }, []);

  const removeSchedule = async (scheduleId: number) => {
    const response = await ScheduleService.removeSchedule(scheduleId);
    if (response.ok) {
      await getScheduleList();
    }
    setSchedules((oldSchedules: any) =>
      oldSchedules.filter((schedule: any) => schedule.id != scheduleId)
    ); //TODO Delete this line in production version. Only for mock API.
  };

  function confirmRemove(id: any) {
    removeSchedule(id);
  }

  return (
    <>
      <CenteredHeader title={'Harmonogramy'} />
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <Row justify={'center'}>
          <Col span={24} lg={18} xl={14}>
            <List
              itemLayout="horizontal"
              dataSource={schedules}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title={
                        <span>
                          Czy na pewno chcesz usunąć ten harmonogram? <br></br>Ta operacja jest
                          nieodwracalna!
                        </span>
                      }
                      onConfirm={() => confirmRemove(item.id)}
                      okText="Usuń"
                      cancelText="Anuluj"
                    >
                      <Button danger onClick={() => {}}>
                        Usuń
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ScheduleOutlined />}
                    title={<Link to={`/schedule/${item.id}`}>{item.name}</Link>}
                    description={item.description}
                  />

                  <div>
                    Liczba wydarzeń: {item.eventCount} <br />
                    {new Date(item.firstEventDate).toLocaleDateString()} -{' '}
                    {new Date(item.lastEventDate).toLocaleDateString()}
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      )}
    </>
  );
}
