"use client"

import {Alert, Flex, theme} from "antd";
import {IPageEntity, IBasePageComponent, IPageComponentGroup} from "@/entities/dynamic-page";
import {PageComponentRenderer, PageGroupRenderer} from "@/entities/dynamic-page/ui";
import type {PageComponentsData} from "@/entities/dynamic-page/model";

interface IProps {
  entities: IPageEntity[];
  componentsData?: PageComponentsData;
}

export default function DynamicPageRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {props.entities.map((entity, index) => {
        if (entity.type == "component")
          return (
            <PageComponentRenderer
              component={entity as IBasePageComponent}
              data={props.componentsData?.[entity.id]}
              key={entity.id}
            />
          );

        if (entity.type == "group")
          return (
            <PageGroupRenderer
              group={entity as IPageComponentGroup}
              componentsData={props.componentsData}
              key={entity.id}
            />
          );

        return <Alert type="error" title="Unknown page entity" key={`page-error-${index}`}/>
      })}
    </Flex>
  )
}
