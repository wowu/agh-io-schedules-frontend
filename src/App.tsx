import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Button, Alignment } from '@blueprintjs/core';

import Home from './components/Home';
import Page1 from './components/Page1';
import Page2 from './components/Page2';

function App() {
  return (
    <Router>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Schedules</Navbar.Heading>
          <Navbar.Divider />
          <Link to="/">
            <Button className="bp3-minimal" icon="home" text="Home" />
          </Link>
          <Link to="/page1">
            <Button className="bp3-minimal" icon="document" text="Page 1" />
          </Link>
          <Link to="/page2">
            <Button className="bp3-minimal" icon="document" text="Page 2" />
          </Link>
        </Navbar.Group>
      </Navbar>

      <Switch>
        <Route path="/page1">
          <Page1 />
        </Route>
        <Route path="/page2">
          <Page2 />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
