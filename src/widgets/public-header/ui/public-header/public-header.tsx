"use client"

import {Flex, Layout, theme} from "antd";
import {Icon} from "@/shared/ui-kit";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import PublicNavMenu from "../public-nav-menu/public-nav-menu";


interface IProps {
  menuItems: IPublicMenuItem[]
}

export default function PublicHeader(props: IProps) {
  const {token: {colorBgContainer}} = theme.useToken();

  return (
  <Layout.Header style={{padding: `0 8px 0 0`, background: colorBgContainer}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Icon showText={true} style={{width: 300}}/>
        <PublicNavMenu menuItems={props.menuItems}/>
      </Flex>
    </Layout.Header>
  );
}
