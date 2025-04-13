"use client"

import {INews} from "@/entities/news";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";

interface IProps {
  news: INews;
}

export default function NewsView(props: IProps) {
  return (
    <>
      {props.news.components.map((component, index) => (
        <PageComponentRenderer propsClass={component} key={`component-${index}`}/>
      ))}
    </>
  )
}
