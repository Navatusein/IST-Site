"use client"

import {ReactNode} from "react";
import {Alert} from "antd";
import {IBasePageComponent} from "@/entities/dynamic-page";

interface IProps {
  component: IBasePageComponent|null
  message?: string;
  children?: ReactNode;
}


export default function PageComponentError(props: IProps) {

  if (!props.component) {
    return <Alert type="error" title="Не вдалось завантажити компонент"/>;
  }

  if (props.message) {
    return <Alert type="error" title={props.message}/>
  }

  return (
    <>
      {props.children}
    </>
  );
}