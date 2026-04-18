"use client"

import {IDynamicPage} from "@/entities/dynamic-page";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  page: IDynamicPage
}

const DynamicPageRenderer = dynamic(() => import("@/widgets/dynamic-page-renderer").then(x => x.DynamicPageRenderer), {
  ssr: false,
  loading: () => <Loader/>
});

export default function DynamicPageView(props: IProps) {
  return (
    <DynamicPageRenderer entities={props.page.entities}/>
  )
}