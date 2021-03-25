import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu, Row } from 'antd';
import styled from 'styled-components';

import Home from './components/Home';
import Schedules from './components/Schedules';
import ImportForm from './components/ImportForm';

const { Header, Content, Footer } = Layout;

const Container = styled(Content)`
  padding: 0 50px;
  margin-top: 20px;
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
          </Menu>
        </Header>

        <Container>
          <AppContent>
              <Switch>
                <Route exact path="/">
                  <Home/>
                </Route>
                <Route path="/schedules">
                  <Schedules/>
                </Route>
                <Route path="/import">
                  <ImportForm/>
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
