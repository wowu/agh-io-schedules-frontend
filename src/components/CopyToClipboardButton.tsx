import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Row, Col } from 'antd';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function CopyToClipboardButton(props: any) {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <CopyToClipboard text={props.content} onCopy={() => setCopied(true)}>
      <Button disabled={copied}>
        {copied ? (
          <>
            <CheckOutlined />
            Skopiowane!
          </>
        ) : (
          <>
            <Row gutter={8}>
              <Col>
                <CopyOutlined />
              </Col>
              <Col>Skopiuj do schowka</Col>
            </Row>
          </>
        )}
      </Button>
    </CopyToClipboard>
  );
}
