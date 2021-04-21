import { ScheduleOutlined } from '@ant-design/icons';
import { Button, List, Row, Spin } from 'antd';
import CenteredHeader from '../components/CenteredHeader';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user';
import { ApiAdapter } from '../services/ApiAdapter';
import { ScheduleService } from '../services/ScheduleService';

export default function ScheduleList() {
  const { user } = useContext(UserContext);

  let [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const schedules = await ScheduleService.getListSchedules();
      setData(schedules);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <CenteredHeader title={'Harmonogramy'} />
      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={[<Button>Usuń</Button>]}>
              <List.Item.Meta
                avatar={<ScheduleOutlined />}
                title={<Link to={'/schedule'}>{item}</Link>}
                description=""
              />
            </List.Item>
          )}
        />
      )}
    </>
  );
}
