"use client"

import Link from "next/link";
import {Card, Flex, theme, Typography} from "antd";
import type {IAdminMenuItem} from "@/shared/configs/admin-menu-config";

interface IProps {
  item: IAdminMenuItem;
}

export default function AdminHomeCard(props: IProps) {
  const {token: {colorPrimary, fontSizeHeading3}} = theme.useToken();

  return (
    <Link prefetch={false} href={props.item.href}>
      <Card hoverable size="small" style={{height: "100%"}}>
        <Flex gap="middle" align="center">
          <span style={{fontSize: fontSizeHeading3, color: colorPrimary}}>{props.item.icon}</span>
          <Flex vertical style={{minWidth: 0}}>
            <Typography.Text strong ellipsis={{tooltip: props.item.label}}>{props.item.label}</Typography.Text>
            <Typography.Text type="secondary" ellipsis={{tooltip: props.item.description}}>{props.item.description}</Typography.Text>
          </Flex>
        </Flex>
      </Card>
    </Link>
  )
}
