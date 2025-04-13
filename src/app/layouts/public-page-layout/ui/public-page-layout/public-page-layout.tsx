"use client"

import {Layout} from "antd";
import {ReactNode} from "react";
import {PublicHeader} from "@/widgets/public-header";

interface IProps {
  children: ReactNode;
}

export default function PublicPageLayout(props: IProps) {
  return (
    <Layout>
      <PublicHeader/>
      <Layout.Content style={{padding: "8px", overflow: "hidden"}}>
        {props.children}
      </Layout.Content>
    </Layout>
  )
}
