"use client"

import {Alert, Empty} from "antd";
import {IBasePageComponent} from "../../types/type";
import {usePageComponentRegistry} from "../../model";
import {ComponentCol, ErrorBoundary} from "@/shared/ui-kit";

interface IProps {
  editMode?: boolean;
  inline?: boolean;
  component: IBasePageComponent;
  data?: unknown;
  onChange?: (value: IBasePageComponent) => void;
}

export default function PageComponentRenderer(props: IProps) {
  const descriptor = usePageComponentRegistry().getDescriptor(props.component.componentType);

  if (descriptor == null)
    return <Alert type="error" title="Unknown page component"/>

  if (props.editMode == true) {
    if (descriptor.Editor == null)
      return <Empty description="Цей блок не має налаштувань"/>

    return (
      <ErrorBoundary resetKey={props.component}>
        <descriptor.Editor component={props.component} onChange={props.onChange!}/>
      </ErrorBoundary>
    )
  }

  const view = (
    <ErrorBoundary resetKey={props.component}>
      <descriptor.View component={props.component} data={props.data}/>
    </ErrorBoundary>
  );

  if (props.inline)
    return view;

  return (
    <ComponentCol width={props.component.width}>
      {view}
    </ComponentCol>
  )
}
