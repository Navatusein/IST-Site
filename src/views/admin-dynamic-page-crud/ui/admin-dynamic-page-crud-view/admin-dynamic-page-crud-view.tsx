"use client"

import {Card, Typography} from "antd";
import {IDynamicPage} from "@/entities/dynamic-page";
import {DynamicPageCrud} from "@/widgets/dynamic-page-crud";

interface IProps {
  pages: IDynamicPage[]
}

export default function AdminDynamicPageCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування сторінками</Typography.Title>
      <DynamicPageCrud pages={props.pages}/>
    </Card>
  )
}
