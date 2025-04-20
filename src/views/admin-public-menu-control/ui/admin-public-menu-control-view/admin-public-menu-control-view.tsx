"use client"

import {IPublicMenuItem} from "@/entities/public-menu-item";
import {Card, Typography} from "antd";
import {PublicPageMenuCrud} from "@/widgets/public-page-menu-crud";

interface IProps {
  menuItems: IPublicMenuItem[]
}

export default function AdminPublicMenuControlView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування меню</Typography.Title>
      <PublicPageMenuCrud menuItems={props.menuItems}/>
    </Card>
  )
}
