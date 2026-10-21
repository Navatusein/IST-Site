"use client"

import {Card} from "antd";
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
      <PublicPageMenuCrud result={props.result} menuItems={props.menuItems}/>
    </Card>
  )
}
