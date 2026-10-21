"use client"

import {ReactNode} from "react";
import {Card, Flex, Typography} from "antd";

export default function SettingsSection(props: {title: string, description?: string, children: ReactNode}) {
  return (
    <Card
      variant="borderless"
      title={(
        <Flex vertical style={{padding: "8px 0"}}>
          <span>{props.title}</span>
          {props.description && (
            <Typography.Text type="secondary" style={{fontWeight: "normal", fontSize: 13}}>
              {props.description}
            </Typography.Text>
          )}
        </Flex>
      )}
    >
      <Flex vertical gap="small">
        {props.children}
      </Flex>
    </Card>
  )
}
