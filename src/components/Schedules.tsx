import { ScheduleOutlined } from '@ant-design/icons';
import { Avatar, Button, List, PageHeader, Row } from 'antd';

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


export default function Schedules() {


  return (
    <>
      <Row justify={"center"}>
        <PageHeader
          className="site-page-header"
          title="Moje harmonogramy"
        />
      </Row>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item actions={[<Button>Edytuj</Button>]}>
            <List.Item.Meta
              avatar={<ScheduleOutlined/>}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Jakiś opis"
            />
          </List.Item>
        )}
      />
    </>
  );
}
