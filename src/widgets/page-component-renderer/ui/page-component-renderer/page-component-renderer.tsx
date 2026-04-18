"use client"

import {IBasePageComponent} from "@/entities/dynamic-page";
import {componentTypes} from "@/page-components";
import {ComponentCol} from "@/shared/ui-kit";
import {Alert} from "antd";

interface IProps {
  editMode?: boolean;
  component: IBasePageComponent;
  onChange?: (value: IBasePageComponent) => void;
}

export default function PageComponentRenderer(props: IProps) {
  const component = componentTypes[props.component.componentType];

  if (component == null)
    return <Alert type="error" title="Unknown page component"/>

  if (props.editMode == true)
    return component.renderEditor(props.component, props.onChange!)

  return (
    <ComponentCol width={props.component.width}>
      {component.renderComponent(props.component)}
    </ComponentCol>
  )
}