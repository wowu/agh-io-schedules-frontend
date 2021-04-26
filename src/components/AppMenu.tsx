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
          <Menu.Item key="home">
            <Link to="/">Strona główna</Link>
          </Menu.Item>
          <Menu.Item key="import">
            <Link to="/import">Wyślij</Link>
          </Menu.Item>
          <Menu.Item key="schedules">
            <Link to="/schedules">Harmonogramy</Link>
          </Menu.Item>
          <Menu.Item key="schedule">
            <Link to="/schedule/1">Harmonogram</Link>
          </Menu.Item>
          <Menu.Item key="emails">
            <Link to="/emails">Emaile prowadzących</Link>
          </Menu.Item>
          <Menu.Item key="users">
            <Link to="/users">Użytkownicy</Link>
          </Menu.Item>
          <Menu.Item key="notification-settings">
            <Link to="/notification-settings">Powiadomienia</Link>
          </Menu.Item>
          <Menu.Item key="logout" style={{ float: 'right' }}>
            <a onClick={handleLogout}>Wyloguj się</a>
          </Menu.Item>
        </>
      )}

      {!user && (
        <Menu.Item key="login" style={{ float: 'right' }}>
          <Link to="/login">Zaloguj się</Link>
        </Menu.Item>
      )}
    </Menu>
  );
}

export default AppMenu;
