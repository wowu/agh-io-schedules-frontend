import CenteredHeader from '../components/CenteredHeader';
import { useUser } from '../helpers/user';

export default function Home() {
  const user = useUser();

  return (
    <>
      <CenteredHeader title="Strona Główna" />
      <code>{JSON.stringify(user)}</code>
    </>
  );
}
