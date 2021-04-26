import React, { useContext } from 'react';
import { UserContext } from '../contexts/user';

export default function NotificationSettings() {
  const { user } = useContext(UserContext);

  return (
    <>
      Tutaj powiadomienia dla usera będą
      <br />
      <code>{JSON.stringify(user)}</code>
    </>
  );
}
