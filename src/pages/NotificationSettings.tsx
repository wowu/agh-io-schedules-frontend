import CenteredHeader from '../components/CenteredHeader';
import { List, Button, Switch, Menu, Dropdown, Row, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/user';
import { ScheduleService } from '../services/ScheduleService';
import ReactJson from 'react-json-view';

const mdata = [
  {
    title: 'Harmonogram 1',
    enabled: true,
    time: '',
  },
  {
    title: 'Harmonogram 2',
    enabled: true,
    time: '',
  },
  {
    title: 'Harmonogram 3',
    enabled: true,
    time: '',
  },
  {
    title: 'Harmonogram 4',
    enabled: false,
    time: '',
  },
];

export default function NotificationSettings() {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const times = ['10m', '30m', '1h', '3h', '1d', '3d', '10d'];

  useEffect(() => {
    (async () => {
      const result = await ScheduleService.getListSchedules();
      const newData = result.map((el: string) => {
        return { name: el, enabled: false, time: '' };
      });
      setData(newData);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {/*<ReactJson src={data} collapsed={true} />*/}
      <CenteredHeader title="Skonfiguruj powiadomienia" />

      {loading ? (
        <Row justify={'center'}>
          <Spin size="large" />
        </Row>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item: { name: string; enabled: boolean; time: string }) => (
            <List.Item
              actions={[
                <>
                  Wysyłaj powiadomienia{' '}
                  <Switch
                    checked={item.enabled}
                    onChange={(checked) => {
                      item.enabled = checked;
                      setData([...data]);
                    }}
                  />
                </>,
              ]}
            >
              <List.Item.Meta title={item.name} />
              Przypomnij przed
              <Dropdown
                overlay={
                  <Menu>
                    {times.map((time, index) => (
                      <Menu.Item
                        key={index}
                        onClick={(info) => {
                          item.time = times[info.key as number] as string;
                          setData([...data]);
                        }}
                      >
                        {time}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
                placement="bottomLeft"
              >
                <Button style={{ marginLeft: 10 }}>{item.time ? item.time : 'Wybierz czas'}</Button>
              </Dropdown>
            </List.Item>
          )}
        />
      )}
    </>
  );
}
