"use client"

import {Card} from "antd";
import type {INews} from "@/entities/news";
import {IPageResult} from "@/shared/types/page-query";
import NewsCrud from "../news-crud/news-crud";

interface IProps {
  result: IPageResult<INews>;
}

export default function AdminNewsCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <NewsCrud result={props.result}/>
    </Card>
  )
}
