"use client"

import {Layout} from "antd";
import {ReactNode} from "react";
import {PublicHeader} from "@/widgets/public-header";
import {IPublicMenuItem} from "@/entities/public-menu-item";

interface IProps {
  children: ReactNode;
  menuItems: IPublicMenuItem[]
}

export default function PublicPageLayout(props: IProps) {
  return (
    <Layout>
      <PublicHeader menuItems={props.menuItems}/>
      <Layout.Content style={{overflow: "hidden"}}>
        {props.children}
      </Layout.Content>
    </Layout>
  )
}
