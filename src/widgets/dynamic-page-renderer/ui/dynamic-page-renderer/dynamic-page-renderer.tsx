"use client"

import {Alert, Flex, theme} from "antd";
import {IPageEntity, IBasePageComponent, IPageComponentGroup} from "@/entities/dynamic-page";
import {PageComponentRenderer, PageGroupRenderer} from "@/entities/dynamic-page/ui";
import {getPageMainHeadings, usePageComponentRegistry} from "@/entities/dynamic-page/model";
import type {PageComponentsData} from "@/entities/dynamic-page/model";
import {HiddenHeading} from "@/shared/ui-kit";

interface IProps {
  entities: IPageEntity[];
  componentsData?: PageComponentsData;
  // Rendered as a hidden h1 when no block renders one
  mainHeading?: string;
}

export default function DynamicPageRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();
  const registry = usePageComponentRegistry();

  const showHiddenHeading = props.mainHeading != null && getPageMainHeadings(props.entities, registry).length == 0;

  return (
    <Flex vertical gap="middle" style={{marginBottom: padding}}>
      {showHiddenHeading && <HiddenHeading>{props.mainHeading!}</HiddenHeading>}
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
