import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Schedules from './components/Schedules';

function App() {
  return (
    <Router>
      <Link to="/">Home</Link>
      <Link to="/schedules">Schedules</Link>

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
