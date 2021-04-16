import { ScheduleOutlined } from '@ant-design/icons';
import { Button, List, Row, Spin } from 'antd';
import CenteredHeader from '../components/CenteredHeader';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user';


export default function ScheduleList() {

  const { user } = useContext(UserContext);

  let [data, setData] = useState<[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() =>{
    var requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
    };

    fetch("https://agh-schedules-backend.herokuapp.com/api/schedule/getFiles", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (!Array.isArray(result)){
          result = []
        }
        setData(result);
        setLoading(false)
      })
      .catch(error => console.log('error', error));
  }, [])

  return (
    <>
      <CenteredHeader title={'Harmonogramy'} />
      {loading ?
        <Row justify={'center'}><Spin size="large" /></Row> :
        <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={[<Button>Usuń</Button>]}>
            <List.Item.Meta
              avatar={<ScheduleOutlined/>}
              title={<Link to={'/schedule'}>{item}</Link>}
              description="opis harmonogramu"
            />
          </List.Item>
        )}
      />
      }
    </>
  );
}
