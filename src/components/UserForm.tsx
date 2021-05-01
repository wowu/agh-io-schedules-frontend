import { Modal, Form, Input, Checkbox } from 'antd';
import { User } from '../services/UserService';

export interface UserFormValues {
  email: string;
  activeSubscription: boolean;
}

interface UserFormProps {
  title: string;
  user?: User;
  visible: boolean;
  fieldsToEdit: string[];
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
}

export default function UserForm(props: UserFormProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      title={props.title}
      okText="Zapisz"
      cancelText="Anuluj"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            props.onSubmit(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form id="addEmail" layout="vertical" form={form} initialValues={props.user}>
        {props.fieldsToEdit.includes('email') && <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="kowalski@example.com" />
        </Form.Item>}
        {props.fieldsToEdit.includes('activeSubscription') && <Form.Item valuePropName="checked" name="activeSubscription">
          <Checkbox>Włączone powiadomienia</Checkbox>
        </Form.Item>}
      </Form>
    </Modal>
  );
}
