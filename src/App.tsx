import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Navbar, Button, Alignment } from '@blueprintjs/core';

import Home from './components/Home';
import Schedules from './components/Schedules';

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
          <Link to="/schedules">
            <Button className="bp3-minimal" icon="document" text="Schedules" />
          </Link>
        </Navbar.Group>
      </Navbar>

      <Switch>
        <Route path="/schedules">
          <Schedules />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
