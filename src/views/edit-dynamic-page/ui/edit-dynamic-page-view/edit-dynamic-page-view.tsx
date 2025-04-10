"use client"

import {IDynamicPage} from "@/entities/dynamic-page";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";

interface IProps {
  page: IDynamicPage
}

export default function EditDynamicPageView(props: IProps) {
  return (
    <DynamicPageEditor page={props.page}/>
  )
}
