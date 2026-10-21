"use client"

import dynamic from "next/dynamic";
import {Card} from "antd";
import type {ISiteLinksGraph} from "@/features/site-links";
import {AdminPageHeader, Loader} from "@/shared/ui-kit";

interface IProps {
  graph: ISiteLinksGraph;
}

const SiteLinksGraph = dynamic(() => import("@/features/site-links/ui/site-links-graph/site-links-graph"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function AdminSiteMapView(props: IProps) {
  return (
    <Card variant="borderless">
      <AdminPageHeader
        title="Карта сайту"
        description="Сторінки сайту та посилання між ними. Розмір кола — скільки сторінок на неї посилаються, стрілка — напрям посилання. Натисніть на сторінку, щоб побачити її зв'язки"
      />
      <SiteLinksGraph graph={props.graph}/>
    </Card>
  )
}
