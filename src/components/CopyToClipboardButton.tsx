import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function CopyToClipboardButton(props: any) {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <CopyToClipboard text={props.content} onCopy={() => setCopied(true)}>
      <Button disabled={copied}>
        {copied ? (
          <>
            <CheckOutlined />
            Copied!
          </>
        ) : (
          <>
            <CopyOutlined />
            Copy link to clipboard
          </>
        )}
      </Button>
    </CopyToClipboard>
  );
}
