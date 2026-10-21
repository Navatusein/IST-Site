"use client"

import {CSSProperties, ReactNode} from "react";
import {Flex, theme, Typography} from "antd";

interface IProps {
  title: string;
  description?: ReactNode;
  extra?: ReactNode;
  style?: CSSProperties;
}

export default function AdminPageHeader(props: IProps) {
  const {token: {margin, marginXS}} = theme.useToken();

  return (
    <Flex justify="space-between" align="start" gap="middle" wrap style={{marginBottom: margin, ...props.style}}>
      <Flex vertical gap={marginXS} style={{flex: "1 1 320px", minWidth: 0}}>
        <Typography.Title level={2} style={{margin: 0}}>{props.title}</Typography.Title>
        {props.description && (
          <Typography.Paragraph type="secondary" style={{margin: 0, maxWidth: 760}}>
            {props.description}
          </Typography.Paragraph>
        )}
      </Flex>
      {props.extra && <Flex gap="small" align="center" wrap>{props.extra}</Flex>}
    </Flex>
  )
}
