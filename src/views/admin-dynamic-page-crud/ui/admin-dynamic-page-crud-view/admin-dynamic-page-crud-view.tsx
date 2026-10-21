"use client"

import {Card} from "antd";
import type {IDynamicPage} from "@/entities/dynamic-page";
import {IPageResult} from "@/shared/types/page-query";
import type {ISiteLinksGraph} from "@/features/site-links";
import DynamicPageCrud from "../dynamic-page-crud/dynamic-page-crud";

interface IProps {
  result: IPageResult<IDynamicPage>;
  siteLinks: ISiteLinksGraph;
}

export default function AdminDynamicPageCrudView(props: IProps) {
  return (
    <Card variant="borderless">
      <DynamicPageCrud result={props.result} siteLinks={props.siteLinks}/>
    </Card>
  )
}
