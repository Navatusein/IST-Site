"use client"

import {Flex, theme} from "antd";
import {IDynamicPage} from "@/entities/dynamic-page";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {INews} from "@/entities/news";

interface IProps {
  news: INews;
}

export default function NewsRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.news.components.map((component, index) => (
        <PageComponentRenderer propsClass={component} key={`component-${index}`}/>
      ))}
    </Flex>
  )
}
