"use client"

import {IDynamicPage} from "@/entities/dynamic-page";
import {DynamicPageRenderer} from "@/widgets/dynamic-page-renderer";
import type {PageComponentsData} from "@/entities/dynamic-page/model";

interface IProps {
  page: IDynamicPage;
  componentsData?: PageComponentsData;
}

export default function DynamicPageView(props: IProps) {
  return (
    <DynamicPageRenderer entities={props.page.entities} componentsData={props.componentsData}/>
  )
}