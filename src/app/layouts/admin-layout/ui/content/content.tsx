"use client"

import {ReactNode} from "react";
import {Layout, theme} from "antd";

interface IProps {
  children: ReactNode;
}

export default function Content(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <Layout style={{overflow: "hidden auto"}}>
      <Layout.Content style={{padding: `${padding}px`, minHeight: "fit-content"}}>
        {props.children}
      </Layout.Content>
    </Layout>
  )
}