"use client"

import {Card, Typography} from "antd";
import type {IPublicMenuItem} from "@/entities/public-menu-item";
import {IPageResult} from "@/shared/types/page-query";
import PublicPageMenuCrud from "../public-page-menu-crud/public-page-menu-crud";

interface IProps {
  result: IPageResult<IPublicMenuItem>;
  menuItems: IPublicMenuItem[];
}

export default function AdminPublicMenuCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Навігаційне меню</Typography.Title>
      <PublicPageMenuCrud result={props.result} menuItems={props.menuItems}/>
    </Card>
  )
}
