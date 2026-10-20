"use client"

import {Layout} from "antd";
import {ReactNode} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import {ISiteSettingsData} from "@/entities/site-settings";
import {PublicHeader} from "@/widgets/public-header";
import {PublicFooter} from "@/widgets/public-footer";
import SessionProvider from "@/app/provider/session-provider/session-provider";

interface IProps {
  children: ReactNode;
  menuItems: IPublicMenuItem[]
  siteSettings: ISiteSettingsData;
}

export default function PublicPageLayout(props: IProps) {
  return (
    <SessionProvider>
      <Layout>
        <PublicHeader menuItems={props.menuItems}/>
        <Layout.Content style={{contain: "paint", minHeight: "calc(100svh - 60px)"}}>
          {props.children}
        </Layout.Content>
        <PublicFooter settings={props.siteSettings}/>
      </Layout>
    </SessionProvider>
  )
}
