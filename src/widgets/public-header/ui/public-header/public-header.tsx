"use client"

import {Flex, Layout, Menu, theme} from "antd";
import {Icon} from "@/shared/ui-kit";
import {MenuItemType, ItemType} from "antd/lib/menu/interface";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import React, {useMemo} from "react";
import Link from "next/link";

interface IProps {
  menuItems: IPublicMenuItem[]
}

export default function PublicHeader(props: IProps) {
  const {token: {colorBgContainer}} = theme.useToken();

  const mapToTreeData = (menuItems: IPublicMenuItem[]): ItemType<MenuItemType>[] => {
    return menuItems
      .sort((a, b) => (a.index - b.index))
      .map(menuItem => ({
        key: `${menuItem._id}`,
        label: menuItem.path ? <Link href={menuItem.path}>{menuItem.label}</Link> : menuItem.label,
        children: menuItem.children ? mapToTreeData(menuItem.children) : undefined
      } as ItemType<MenuItemType>));
  }

  const navMenuItems = useMemo(() => mapToTreeData(props.menuItems), [props.menuItems]);

  return (
    <Layout.Header style={{padding: `0 8px 0 0`, background: colorBgContainer}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Icon showText={true} style={{width: 270}}/>
        <Menu
          style={{borderBottom: "none", minWidth: 0, flex: "auto"}}
          mode="horizontal"
          items={navMenuItems}
        />
      </Flex>
    </Layout.Header>
  );
}
