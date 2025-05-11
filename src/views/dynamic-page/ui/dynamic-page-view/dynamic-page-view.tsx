"use client"

import {IDynamicPage} from "@/entities/dynamic-page";
import dynamic from "next/dynamic";
import {Loader} from "@/shared/ui-kit";

interface IProps {
  page: IDynamicPage
}

const DynamicPageRenderer = dynamic(() => import("@/views/dynamic-page/ui/dynamic-page-dynamic-view/dynamic-page-renderer"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function DynamicPageView(props: IProps) {
  return (
    <DynamicPageRenderer page={props.page}/>
  )
}