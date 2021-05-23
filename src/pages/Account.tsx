import { Col, Divider, notification, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CenteredHeader from '../components/CenteredHeader';
import PasswordForm from '../components/PasswordForm';
import SettingsForm from '../components/SettingsForm';
import { useUser } from '../helpers/user';
import { User, UserService } from '../services/UserService';
import Title from 'antd/es/typography/Title';
import { Notification, NotificationService } from '../services/NotificationService';
import NotificationPicker from '../components/NotificationsPicker';

export default function Account() {
  const user = useUser();
  const [account, setAccount] = useState<User>();

  // const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchAccount = async () => {
    const { data: account } = await UserService.getUser(user!.id);
    setAccount(account);
  };

  const fetchNotifications = async () => {
    const notifications = await NotificationService.getGlobalNotifications();
    setNotifications(notifications);
  };

  useEffect(() => {
    fetchAccount();
    fetchNotifications();
  }, []);

  // const updateSubscription = async (activeSubscription: boolean) => {
  //   if (!account) return;

  //   setSettingsLoading(true);
  //   await UserService.updateUser(account.id, account.email, activeSubscription);
  //   notification['success']({ message: 'Zapisano ustawienia' });
  //   setSettingsLoading(false);
  // };

  const changePassword = async (password: string) => {
    if (!account) return;

    setChangePasswordLoading(true);
    await UserService.changePassword(account.id, password);
    notification['success']({ message: 'Zmieniono hasło.' });
    setChangePasswordLoading(false);
  };

  const handleNotificationCreate = (notification: Notification) => {
    if (user?.isAdmin) {
      NotificationService.setGlobalNotifications([...notifications, notification]);
    } else {
      alert('not implemented');
    }

    fetchNotifications();
  };

  const handleNotificationDelete = (notification: Notification) => {
    if (user?.isAdmin) {
      const notificationsWithoutDeleted = notifications.filter((n) => n !== notification);
      NotificationService.setGlobalNotifications(notificationsWithoutDeleted);
    } else {
      alert('not implemented');
    }

    fetchNotifications();
  };

  return (
    <>
      <Row justify="center">
        <Col span={10}>
          <CenteredHeader title="Ustawienia konta" />

          <br />

          {user?.isAdmin ? (
            <>
              <Row justify={'center'}>
                <Title level={5}>Globalne ustawienia powiadomień</Title>
              </Row>

              <p style={{ textAlign: 'center' }}>
                Wybierz jak wcześnie użytkownicy będą otrzymywać informacje o swoich wydarzeniach.
                Możesz dodać dowolną liczbę powiadomień.
              </p>
            </>
          ) : (
            <>
              <Row justify={'center'}>
                <Title level={5}>Ustawienia powiadomień</Title>
              </Row>

              <p style={{ textAlign: 'center' }}>
                Wybierz jak wcześnie będziesz otrzymywać informacje o Twoich wydarzeniach. Możesz
                dodać dowolną liczbę powiadomień.
              </p>
            </>
          )}

          <br />

          {/* {account ? (
            <SettingsForm
              currentActiveSubscription={account.activeSubscription}
              notifications={notifications}
              onSave={updateSubscription}
              loading={settingsLoading}
            />
          ) : (
            <Spin size="large" />
          )} */}

          <NotificationPicker
            notifications={notifications}
            onCreate={handleNotificationCreate}
            onDelete={handleNotificationDelete}
          />

          <Divider />

          <Row justify={'center'}>
            <Title level={5}>Zmień hasło</Title>
          </Row>

          <PasswordForm loading={changePasswordLoading} onSave={changePassword} />
        </Col>
      </Row>
    </>
  );
}
