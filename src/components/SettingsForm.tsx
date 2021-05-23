import { Button, Checkbox, Row } from 'antd';
import React, { useState } from 'react';

type SettingsFormProps = {
  currentActiveSubscription: boolean;
  onSave: (activeSubscription: boolean) => void;
  loading: boolean;
};

export default function SettingsForm(props: SettingsFormProps) {
  const [activeSubscription, setActiveSubscription] = useState(props.currentActiveSubscription);

  const handleSave = () => {
    props.onSave(activeSubscription);
  };

  return (
    <>
      <Row>
        <Checkbox
          checked={activeSubscription}
          onChange={(e) => setActiveSubscription(e.target.checked)}
        >
          Powiadomienia mailowe
        </Checkbox>
      </Row>
      <br />
      <Row justify={'center'}>
        <Button onClick={handleSave} loading={props.loading} type="primary">
          Zapisz
        </Button>
      </Row>
    </>
  );
}
