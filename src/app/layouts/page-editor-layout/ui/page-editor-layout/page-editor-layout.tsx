"use client"

import {Layout} from "antd";
import {ReactNode} from "react";

interface IProps {
  children: ReactNode;
}

export default function PageEditorLayout(props: IProps) {
  return (
    <Layout>
      <Layout.Content>
        {props.children}
      </Layout.Content>
    </Layout>
  )
}
