"use client"

import {Col, Row, theme} from "antd";
import {IPageComponentGroup} from "../../types/type";
import {getGroupColumnSpans} from "../../utilities/get-group-column-spans";
import PageComponentRenderer from "../page-component-renderer/page-component-renderer";
import {ComponentCol} from "@/shared/ui-kit";
import type {PageComponentsData} from "../../model";

interface IProps {
  group: IPageComponentGroup;
  componentsData?: PageComponentsData;
}

export default function PageGroupRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  const columns = getGroupColumnSpans(props.group);

  if (props.group.components.length == 0)
    return null;

  return (
    <ComponentCol width={props.group.width}>
      <Row gutter={[padding, padding]} align={props.group.verticalAlign == "center" ? "middle" : "top"}>
        {props.group.components.map((component, index) => (
          <Col key={component.id} {...columns[index]}>
            <PageComponentRenderer
              component={component}
              data={props.componentsData?.[component.id]}
              inline
            />
          </Col>
        ))}
      </Row>
    </ComponentCol>
  )
}
