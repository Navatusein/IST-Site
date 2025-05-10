"use client"

import {PageComponentRenderer} from "@/widgets/page-component-renderer";
import {IDynamicPage} from "@/entities/dynamic-page";
import {Flex, theme} from "antd";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageView(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.page.components.map((component, index) => (
        <PageComponentRenderer propsClass={component} key={`component-${index}`}/>
      ))}
    </Flex>
  )
}