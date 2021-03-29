import { PageHeader, Row } from 'antd';
import React from 'react';

interface CenteredHeaderProps{
  title: string
}

export default function CenteredHeader(props : CenteredHeaderProps){
  return(
    <Row justify={"center"}>
      <PageHeader
        className="site-page-header"
        title={props.title}
      />
    </Row>
  )
}
