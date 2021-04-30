import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CenteredHeader from '../components/CenteredHeader';
import PasswordForm from '../components/PasswordForm';
import SettingsForm from '../components/SettingsForm';
import { useUser } from '../helpers/user';
import { AuthService } from '../services/AuthService';
import { User, UserService } from '../services/UserService';
import Title from 'antd/es/typography/Title';

export default function Account() {
  const user = useUser();
  const [account, setAccount] = useState<User>();

  const [form] = Form.useForm();
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data: account } = await UserService.getUser(user!.id);
      setAccount(account);
    })();
  }, []);

  const updateSubscription = async (activeSubscription: boolean) => {
    if (!account) return;

    setSettingsLoading(true);
    await UserService.updateUser(account.id, account.email, activeSubscription);
    notification['success']({ message: 'Zapisano ustawienia' });
    setSettingsLoading(false);
  };

  const changePassword = async (password: string) => {
    if (!account) return;

    setChangePasswordLoading(true);
    await UserService.changePassword(account.id, password);
    notification['success']({ message: 'Zmieniono hasło.' });
    setChangePasswordLoading(false);
  };

  return (
    <>
      <Row justify="center">
        <Col span={10}>
          <CenteredHeader title="Ustawienia konta" />

          {account ? (
            <SettingsForm
              currentActiveSubscription={account.activeSubscription}
              onSave={updateSubscription}
              loading={settingsLoading}
            />
          ) : (
            <Spin size="large" />
          )}
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
