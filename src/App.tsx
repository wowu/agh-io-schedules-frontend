import React, { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import styled from 'styled-components';
import plPL from 'antd/lib/locale/pl_PL';
import ScheduleList from './pages/ScheduleList';
import ImportForm from './pages/ImportForm';
import LoginForm from './pages/LoginForm';
import Schedule from './pages/Schedule';
import LecturerEmails from './pages/LecturerEmails';
import { TokenContext } from './contexts/token';
import PrivateRoute from './components/PrivateRoute';
import { AuthService } from './services/AuthService';
import AppMenu from './components/AppMenu';
import history from './history';
import Users from './pages/Users';
import Account from './pages/Account';
import MergedSchedule from './pages/MergedSchedule';

const { Header, Content, Footer } = Layout;

const Container = styled(Content)`
  padding: 0 30px;
  width: 100%;
  margin: 20px auto 0 auto;
  max-width: 1400px;
`;

const AppContent = styled.div`
  min-height: 800px;
  padding: 24px;
  background: #fff;
`;

function App() {
  const [token, setToken] = useState(AuthService.getToken());

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <ConfigProvider locale={plPL}>
        <Router history={history}>
          <Layout>
            <Header>
              <AppMenu />
            </Header>

            <Container>
              <AppContent>
                <Switch>
                  <PrivateRoute exact path="/">
                    <ScheduleList />
                  </PrivateRoute>
                  <PrivateRoute path="/merged">
                    <MergedSchedule />
                  </PrivateRoute>
                  <PrivateRoute path="/import">
                    <ImportForm />
                  </PrivateRoute>
                  <PrivateRoute path="/schedule/:id">
                    <Schedule />
                  </PrivateRoute>
                  <PrivateRoute path="/emails">
                    <LecturerEmails />
                  </PrivateRoute>
                  <PrivateRoute path="/users">
                    <Users />
                  </PrivateRoute>
                  <PrivateRoute path="/account">
                    <Account />
                  </PrivateRoute>
                  <Route path="/public/schedule/:publicUUID">
                    <Schedule />
                  </Route>
                  <Route path="/login">
                    <LoginForm />
                  </Route>
                </Switch>
              </AppContent>
            </Container>

            <Footer style={{ textAlign: 'center' }}>
              Schedules &copy; {new Date().getFullYear()} Game of Threads, AGH
            </Footer>
          </Layout>
        </Router>
      </ConfigProvider>
    </TokenContext.Provider>
  );
}

export default App;
