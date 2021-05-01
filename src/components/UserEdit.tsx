import { useState } from "react";
import { User } from "../services/UserService";
import UserForm, { UserFormValues } from "./UserForm";

export interface UserEditProps {
  user: User;
  onEdit: (user: User, values: UserFormValues) => void;
}

export default function UserEdit(props: UserEditProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const onEdit = (values: UserFormValues) => {
    setVisible(false);
    props.onEdit(props.user, values);
  };

  return (
    <>
      <a onClick={() => setVisible(true)}>Edytuj</a>

      <UserForm
        visible={visible}
        onSubmit={onEdit}
        user={props.user}
        title="Edytuj użytkownika"
        onCancel={() => setVisible(false)}
      />
    </>
  );
}