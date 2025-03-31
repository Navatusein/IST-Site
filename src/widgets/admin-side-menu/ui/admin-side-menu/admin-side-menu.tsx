"use client"

import Sider from "antd/es/layout/Sider";
import {useClickOutside} from "@/shared/hooks/use-click-outside";
import React, {useContext, useRef} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {Divider, Flex, Menu, MenuProps} from "antd";
import {
  ControlOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  ReadOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import Link from "next/link";
import {Icon} from "@/shared/ui-kit";
import UserCard from "../user-card/user-card";

const MENU_ITEMS: MenuProps["items"] = [
  {key: "news-control", icon: <ReadOutlined/>, label: <Link href={"/admin"}>Керування новинами</Link>},
  {key: "page-control", icon: <FileTextOutlined/>, label: <Link href={"/admin/page-control"}>Керування сторінками</Link>},
  {key: "files-manager", icon: <FolderOpenOutlined/>, label: <Link href={"/admin/file-manager"}>Файловий менеджер</Link>},
  {key: "user-control", icon: <UserOutlined/>, label: <Link href={"/admin"}>Керування користувачами</Link>},
]

export default function AdminSideMenu() {
  const {isMenuClosed, setIsMenuClosed, isMobileWidth, setIsMobileWidth} = useContext(AdminSideMenuContext);

  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    if (!isMobileWidth)
      return;

    setIsMenuClosed(true);
  });

  return (
    <Sider
      ref={menuRef}
      breakpoint="md"
      theme="light"
      onBreakpoint={(broken) => {setIsMobileWidth(broken)}}
      collapsible
      collapsed={isMenuClosed}
      collapsedWidth={isMobileWidth ? "0px" : "64px"}
      width={270}
      trigger={null}
      style={{position: isMobileWidth ? "absolute" : undefined, zIndex: 100, top: 0, bottom: 0, left: 0}}
    >
      <Flex vertical justify="space-between" style={{height: "100%"}}>
        <Flex vertical style={{flexGrow: 1}}>
          <Icon showText={!isMenuClosed}/>
          <Divider style={{margin: 0}}/>
          <Menu mode="inline" items={MENU_ITEMS} style={{borderRight: 0}}/>
        </Flex>
        <Flex vertical>
          <Divider style={{margin: 0}}/>
          <UserCard isMenuClosed={isMenuClosed}/>
        </Flex>
      </Flex>
    </Sider>
  )
}