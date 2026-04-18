"use client"

import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {INews} from "@/entities/news";

interface IProps {
  news: INews;
}

export default function NewsRenderer(props: IProps) {
  return (
    <>
      {props.news.components.map((component, index) => (
        <PageComponentRenderer component={component} key={`component-${index}`}/>
      ))}
    </>
  )
}
