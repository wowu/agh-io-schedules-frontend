import { ScheduleOutlined } from '@ant-design/icons';
import { Button, List, } from 'antd';
import CenteredHeader from '../components/CenteredHeader';
import React from 'react';
import { Link } from 'react-router-dom';

const data = [
  {
    title: 'Harmonogram 1'
  },
  {
    title: 'Harmonogram 2'
  },
  {
    title: 'Harmonogram 3'
  },
  {
    title: 'Harmonogram 4'
  }
];


export default function ScheduleList() {


  return (
    <>

      <CenteredHeader title={'Harmonogramy'}/>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item actions={[<Button>Edytuj</Button>]}>
            <List.Item.Meta
              avatar={<ScheduleOutlined/>}
              title={<Link to={"/schedule"}>{item.title}</Link>}
              description="Jakiś opis"
            />
          </List.Item>
        )}
      />
    </>
  );
}
