"use client"

import {Card, Typography} from "antd";
import type {IDynamicPage} from "@/entities/dynamic-page";
import {IPageResult} from "@/shared/types/page-query";
import DynamicPageCrud from "../dynamic-page-crud/dynamic-page-crud";

interface IProps {
  result: IPageResult<IDynamicPage>;
}

export default function AdminDynamicPageCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Динамічні сторінки</Typography.Title>
      <DynamicPageCrud result={props.result}/>
    </Card>
  )
}
