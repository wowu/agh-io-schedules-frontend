import { Checkbox, Col, Divider, notification, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import CenteredHeader from '../components/CenteredHeader';
import NotificationPicker from '../components/NotificationsPicker';
import PasswordForm from '../components/PasswordForm';
import { useUser } from '../helpers/user';
import { Notification, NotificationService } from '../services/NotificationService';
import { User, UserService } from '../services/UserService';

export default function Account() {
  const user = useUser();
  const [account, setAccount] = useState<User>();

  const [changePasswordLoading, setChangePasswordLoading] = useState<boolean>(false);
  const [useDefaultNotifications, setUseDefaultNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchAccount = async () => {
    const { data: account } = await UserService.getUser(user!.id);
    setAccount(account);
  };

  const fetchNotifications = async () => {
    if (user?.isAdmin) {
      const notifications = await NotificationService.getGlobalNotifications();
      setNotifications(notifications);
    } else {
      const userNotifications = await NotificationService.getUserNotifications();
      setNotifications(userNotifications?.notifications || []);
      setUseDefaultNotifications(userNotifications.default);
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchNotifications();
  }, []);

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
    const notificationsWithoutDeleted = notifications.filter((n) => n !== notification);

    if (user?.isAdmin) {
      NotificationService.setGlobalNotifications(notificationsWithoutDeleted);
    } else {
      NotificationService.setUserNotifications({
        default: useDefaultNotifications,
        notifications: notificationsWithoutDeleted,
      });
    }

    fetchNotifications();
  };

  const handleDefaultChange = (value: boolean) => {
    NotificationService.setUserNotifications({
      default: useDefaultNotifications,
      notifications: notifications,
    });

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

              <br />

              <Row justify={'center'}>
                <Checkbox
                  onChange={(e) => handleDefaultChange(e.target.checked)}
                  checked={useDefaultNotifications}
                >
                  Użyj domyślnych powiadomień systemu
                </Checkbox>
              </Row>
            </>
          )}

          <br />

          <NotificationPicker
            disabled={useDefaultNotifications}
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
