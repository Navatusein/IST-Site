"use client"

import {Card, Typography} from "antd";
import {NewsCrud} from "@/widgets/news-crud";
import {INews} from "@/entities/news";

interface IProps {
  news: INews[];
}

export default function AdminNewsControlView(props: IProps) {
  return (
    <Card variant="borderless">
      <Typography.Title level={2}>Керування новинами</Typography.Title>
      <NewsCrud news={props.news}/>
    </Card>
  )
}
