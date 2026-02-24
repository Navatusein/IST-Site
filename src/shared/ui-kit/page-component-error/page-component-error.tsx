"use client"

import {ReactNode} from "react";
import {Alert} from "antd";

interface IProps {
  message: string;
  children?: ReactNode;
}


export default function PageComponentError(props: IProps) {
  return (
    <>
      {
        props.message ?
        <Alert type="error" title={props.message}/> :
        props.children
      }
    </>
  );
}