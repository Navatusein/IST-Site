"use client"

import {ReactNode} from "react";
import {Empty, Flex, Typography} from "antd";

export default function SiteLinksSection(props: {title: string, count: number, empty: string, children: ReactNode}) {
  return (
    <Flex vertical gap="small">
      <Typography.Text strong>{props.title} ({props.count})</Typography.Text>
      {props.count == 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.empty} style={{margin: 0}}/> : (
        <Flex vertical gap={4}>
          {props.children}
        </Flex>
      )}
    </Flex>
  )
}
