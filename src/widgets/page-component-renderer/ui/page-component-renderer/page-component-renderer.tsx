"use client"

import {IBasePageComponent} from "@/entities/dynamic-page";
import {componentTypes} from "@/page-components";
import {Col, theme} from "antd";

interface IProps {
  editMode?: boolean;
  propsClass: IBasePageComponent;
  onChange?: (value: IBasePageComponent) => void;
}

const config = {
  "medium": {
    sm: {span: 24, offset: 0},
    md: {span: 20, offset: 2},
    lg: {span: 18, offset: 4},
    xl: {span: 14, offset: 5},
    xxl: {span: 12, offset: 6},
  },
  "large": {
    span: 24
  }
}

export default function PageComponentRenderer(props: IProps) {
  const {token: {padding}} = theme.useToken();

  const component = componentTypes[props.propsClass.type];

  if (component == null)
    return <>Not found</>

  if (props.editMode == true)
    return component.renderEditor(props.propsClass, props.onChange!)

  return (
    <Col {...config[props.propsClass.width]}>
      <div style={{margin: props.propsClass.width != "large" ? `0 ${padding}px` : "unset"}}>
        {component.renderComponent(props.propsClass)}
      </div>
    </Col>
  )
}