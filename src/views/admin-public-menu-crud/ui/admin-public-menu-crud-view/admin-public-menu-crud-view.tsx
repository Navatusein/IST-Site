"use client"

import {Card} from "antd";
import fillHeight from "@/shared/styles/fill-height.module.scss";
import type {IPublicMenuItem} from "@/entities/public-menu-item";
import {IPageResult} from "@/shared/types/page-query";
import PublicPageMenuCrud from "../public-page-menu-crud/public-page-menu-crud";

interface IProps {
  result: IPageResult<IPublicMenuItem>;
  menuItems: IPublicMenuItem[];
}

export default function AdminPublicMenuCrudView(props: IProps) {
  return (
    <Card variant="borderless" className={fillHeight.page}>
      <PublicPageMenuCrud result={props.result} menuItems={props.menuItems}/>
    </Card>
  )
}
