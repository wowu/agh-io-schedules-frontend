import { useState } from 'react';
import { User } from '../services/UserService';
import UserForm, { UserFormValues } from './UserForm';
import { Button } from 'antd';

export interface UserEditProps {
  user: User;
  fieldsToEdit: string[];
  onEdit: (user: User, values: UserFormValues) => void;
}

export default function UserEdit(props: UserEditProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const onEdit = (values: UserFormValues): Promise<boolean> => {
    setVisible(false);
    props.onEdit(props.user, values);
    return Promise.resolve(true);
  };

  return (
    <>
      <Button onClick={() => setVisible(true)}>Edytuj</Button>

      <UserForm
        visible={visible}
        onSubmit={onEdit}
        user={props.user}
        title="Edytuj użytkownika"
        fieldsToEdit={props.fieldsToEdit}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
