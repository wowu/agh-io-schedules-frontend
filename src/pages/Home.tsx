import { useContext } from 'react';

import { UserContext } from '../contexts/user';
import CenteredHeader from '../components/CenteredHeader';

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <>
      <CenteredHeader title={'Strona główna'} />
      <p>{user.token}</p>
    </>
  );
}
