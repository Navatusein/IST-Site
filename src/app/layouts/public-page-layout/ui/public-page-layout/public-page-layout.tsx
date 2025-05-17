"use client"

import {Layout} from "antd";
import {ReactNode} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import dynamic from "next/dynamic";
import {PublicFooter} from "@/widgets/public-footer";

interface IProps {
  children: ReactNode;
  menuItems: IPublicMenuItem[]
}

const PublicHeader = dynamic(() => import("@/widgets/public-header/ui/public-header/public-header"), {
  ssr: false
});

export default function PublicPageLayout(props: IProps) {
  return (
    <Layout>
      <PublicHeader menuItems={props.menuItems}/>
      <Layout.Content style={{overflow: "hidden"}}>
        {props.children}
      </Layout.Content>
      <PublicFooter/>
    </Layout>
  )
}
