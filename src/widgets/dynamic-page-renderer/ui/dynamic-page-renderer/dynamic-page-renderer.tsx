"use client"

import {Alert, Flex, theme} from "antd";
import {IBasePageComponent, IDynamicPage} from "@/entities/dynamic-page";
import {PageComponentRenderer} from "@/widgets/page-component-renderer";

interface IProps {
  page: IDynamicPage
}

export default function DynamicPageRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.page.entities.map((entity, index) => {
        if (entity.type == "component")
          return <PageComponentRenderer component={entity as IBasePageComponent} key={entity.id}/>;

        return <Alert type="error" title="Unknown page entity" key={`page-error-${index}`}/>
      })}
    </Flex>
  )
}
