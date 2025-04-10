"use client"

import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {IDynamicPage} from "@/entities/dynamic-page";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageView(props: IProps) {
  return (
    <>
      {props.page.components.map((component, index) => (
        <PageComponentRenderer propsClass={component} key={`component-${index}`}/>
      ))}
    </>
  )
}