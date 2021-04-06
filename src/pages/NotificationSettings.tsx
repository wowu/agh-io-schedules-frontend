import CenteredHeader from '../components/CenteredHeader';
import { List, Button, Switch, Menu, Dropdown } from 'antd';
import { useState } from 'react';


const mdata = [
  {
    title: 'Harmonogram 1',
    enabled: true,
    time: ""
  },
  {
    title: 'Harmonogram 2',
    enabled: true,
    time: ""
  },
  {
    title: 'Harmonogram 3',
    enabled: true,
    time: ""
  },
  {
    title: 'Harmonogram 4',
    enabled: false,
    time: ""
  }
];
export default function NotificationSettings() {

  const [data, setData] = useState(mdata)
  const times = ["10m", "30m", "1h", "3h", "1d", "3d", "10d"]

  return (
    <>
      {/* <ReactJson src={data} collapsed={true} /> */}
      <CenteredHeader title='Skonfiguruj powiadomienia' />
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={[<>Wysyłaj powiadomienia <Switch checked={item.enabled} onChange={checked => {
            item.enabled = checked;
            setData([...data])
          }} /></>]}>
            <List.Item.Meta
              title={item.title}
            />
            Przypomnij przed
            <Dropdown overlay={
              <Menu>
                {
                  times.map((time, index) =>
                    <Menu.Item
                      key={index}
                      onClick={
                        (info) => {
                          item.time = times[info.key as number] as string
                          setData([...data])
                        }}>{time}
                    </Menu.Item>)}
              </Menu>
            } placement="bottomLeft">
              <Button style={{ marginLeft: 10 }}>{item.time ? item.time : "Wybierz czas"}</Button>
            </Dropdown>
          </List.Item>
        )}
      />
    </>
  );
}
