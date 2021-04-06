import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu, } from 'antd';
import styled from 'styled-components';

import Home from './pages/Home';
import ScheduleList from './pages/ScheduleList';
import ImportForm from './pages/ImportForm';
import LoginForm from './pages/LoginForm';
import Schedule from './pages/Schedule';
import NotificationSettings from './pages/NotificationSettings'

const { Header, Content, Footer } = Layout;

const Container = styled(Content)`
  padding: 0 30px;
  width: 100%;
  margin: 20px auto 0 auto;
  max-width: 1400px;
`;

const AppContent = styled.div`
  min-height: 500px;
  padding: 24px;
  background: #fff;
`;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/">Strona główna</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/import">Wyślij</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/schedules">Harmonogramy</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/schedule">Przykładowy harmonogram </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/login">Zaloguj się</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/notification-settings">Skonfiguruj Powiadomienia</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Container>
          <AppContent>
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>
              <Route path="/schedules">
                <ScheduleList/>
              </Route>
              <Route path="/import">
                <ImportForm/>
              </Route>
              <Route path="/login">
                <LoginForm/>
              </Route>
              <Route path="/schedule">
                <Schedule/>
              </Route>
              <Route path="/notification-settings">
                <NotificationSettings/>
              </Route>
            </Switch>
          </AppContent>
        </Container>

        <Footer style={{ textAlign: 'center' }}>
          Schedules &copy; {new Date().getFullYear()} Game of Threads, AGH
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
