"use client"

import Sider from "antd/es/layout/Sider";
import {useClickOutside} from "@/shared/hooks/use-click-outside";
import React, {ReactNode, useContext, useEffect, useMemo, useRef} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {Divider, Flex, Menu} from "antd";
import {
  FileTextOutlined,
  FolderOpenOutlined,
  ProfileOutlined,
  ReadOutlined,
  SettingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "@/shared/ui-kit";
import UserCard from "../user-card/user-card";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import type {UserPermissionType} from "@/entities/user/types/type";

interface IMenuItem {
  href: string;
  permission: UserPermissionType;
  icon: ReactNode;
  label: string;
}

const MENU_ITEMS: IMenuItem[] = [
  {href: "/admin/news", permission: "edit-news", icon: <ReadOutlined/>, label: "Новини"},
  {href: "/admin/dynamic-pages", permission: "edit-dynamic-pages", icon: <FileTextOutlined/>, label: "Динамічні сторінки"},
  {href: "/admin/public-menu", permission: "edit-public-menu", icon: <ProfileOutlined/>, label: "Навігаційне меню"},
  {href: "/admin/department-staff", permission: "edit-department-staff", icon: <TeamOutlined/>, label: "Співробітники кафедри"},
  {href: "/admin/department-aspirants", permission: "edit-department-aspirants", icon: <SolutionOutlined/>, label: "Аспіранти кафедри"},
  {href: "/admin/file-manager", permission: "edit-files", icon: <FolderOpenOutlined/>, label: "Файловий менеджер"},
  {href: "/admin/users", permission: "edit-users", icon: <UserOutlined/>, label: "Користувачі"},
  {href: "/admin/site-settings", permission: "edit-site-settings", icon: <SettingOutlined/>, label: "Налаштування сайту"},
];

export default function AdminSideMenu() {
  const {isMenuClosed, setIsMenuClosed, isMobileWidth, setIsMobileWidth} = useContext(AdminSideMenuContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const {userPermissions} = useUserPermissions();

  const pathname = usePathname();

  const menuItems = useMemo(() => MENU_ITEMS
    .filter((item) => userPermissions.includes(item.permission))
    .map((item) => ({key: item.href, icon: item.icon, label: <Link prefetch={false} href={item.href}>{item.label}</Link>})),
  [userPermissions]);

  // Selection follows the URL, so it is cleared on the admin home page and kept on nested pages
  const selectedKeys = MENU_ITEMS
    .filter((item) => pathname == item.href || pathname.startsWith(item.href + "/"))
    .map((item) => item.href);

  useClickOutside(menuRef, () => {
    if (!isMobileWidth)
      return;

    setIsMenuClosed(true);
  });

  const checkWindowSize = () => {
    setIsMobileWidth(window.innerWidth < 599);
  };

  useEffect(() => {
    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  return (
    <Sider
      ref={menuRef}
      theme="light"
      collapsible
      collapsed={isMenuClosed}
      collapsedWidth={isMobileWidth ? "0px" : "64px"}
      width={300}
      trigger={null}
      style={{position: isMobileWidth ? "absolute" : undefined, zIndex: 100, top: 0, bottom: 0, left: 0}}
    >
      <Flex vertical justify="space-between" style={{height: "100%"}}>
        <Flex vertical style={{flexGrow: 1}}>
          <Icon showText={!isMenuClosed} href="/admin"/>
          <Divider style={{margin: 0}}/>
          <Menu mode="inline" items={menuItems} selectedKeys={selectedKeys} style={{borderRight: 0}}/>
        </Flex>
        <Flex vertical>
          <Divider style={{margin: 0}}/>
          <UserCard isMenuClosed={isMenuClosed}/>
        </Flex>
      </Flex>
    </Sider>
  )
}