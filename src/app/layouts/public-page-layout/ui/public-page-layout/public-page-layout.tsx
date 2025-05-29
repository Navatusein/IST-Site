"use client"

import {Layout} from "antd";
import {ReactNode} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import dynamic from "next/dynamic";

interface IProps {
  children: ReactNode;
  menuItems: IPublicMenuItem[]
}

const PublicHeader = dynamic(() => import("@/widgets/public-header/ui/public-header/public-header"), {
  ssr: false
});

const PublicFooter = dynamic(() => import("@/widgets/public-footer/ui/public-footer/public-footer"), {
  ssr: false
});

export default function PublicPageLayout(props: IProps) {
  return (
    <Layout style={{}}>
      <PublicHeader menuItems={props.menuItems}/>
      <Layout.Content style={{overflow: "hidden", minHeight: "calc(100svh - 60px)"}}>
        {props.children}
      </Layout.Content>
      <PublicFooter/>
    </Layout>
  )
}
