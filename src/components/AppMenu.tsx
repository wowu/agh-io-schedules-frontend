import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menu } from 'antd';

import { UserContext } from '../contexts/user';
import { AuthService } from '../services/AuthService';

function AppMenu() {
  const history = useHistory();

  const { user, setUser } = useContext(UserContext);

  function handleLogout() {
    AuthService.logout();
    setUser(null);
    history.push('/login');
  }

  return (
    <Menu theme="dark" mode="horizontal" selectable={false}>
      {user && (
        <>
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
            <Link to="/notification-settings">Skonfiguruj powiadomienia</Link>
          </Menu.Item>
          <Menu.Item key="6" style={{ float: 'right' }}>
            <a onClick={handleLogout}>Wyloguj się</a>
          </Menu.Item>
        </>
      )}

      {!user && (
        <Menu.Item key="7" style={{ float: 'right' }}>
          <Link to="/login">Zaloguj się</Link>
        </Menu.Item>
      )}
    </Menu>
  );
}

export default AppMenu;
