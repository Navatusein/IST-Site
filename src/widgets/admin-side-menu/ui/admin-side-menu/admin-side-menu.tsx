"use client"

import Sider from "antd/es/layout/Sider";
import {useClickOutside} from "@/shared/hooks/use-click-outside";
import React, {ReactNode, useContext, useEffect, useMemo, useRef} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {Divider, Flex, Menu, MenuProps} from "antd";
import {
  ApartmentOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
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
  permission: UserPermissionType | UserPermissionType[];
  icon: ReactNode;
  label: string;
}

const HISTORY_PERMISSIONS: UserPermissionType[] = [
  "edit-dynamic-pages", "edit-news", "edit-department-staff", "edit-department-aspirants", "edit-public-menu"
];

interface IMenuSection {
  title: string;
  items: IMenuItem[];
}

const MENU_SECTIONS: IMenuSection[] = [
  {
    title: "Контент",
    items: [
      {href: "/admin/dynamic-pages", permission: "edit-dynamic-pages", icon: <FileTextOutlined/>, label: "Динамічні сторінки"},
      {href: "/admin/news", permission: "edit-news", icon: <ReadOutlined/>, label: "Новини"},
      {href: "/admin/public-menu", permission: "edit-public-menu", icon: <ProfileOutlined/>, label: "Навігаційне меню"},
      {href: "/admin/file-manager", permission: "edit-files", icon: <FolderOpenOutlined/>, label: "Файловий менеджер"},
    ]
  },
  {
    title: "Кафедра",
    items: [
      {href: "/admin/department-staff", permission: "edit-department-staff", icon: <TeamOutlined/>, label: "Співробітники кафедри"},
      {href: "/admin/department-aspirants", permission: "edit-department-aspirants", icon: <SolutionOutlined/>, label: "Аспіранти кафедри"},
    ]
  },
  {
    title: "Огляд",
    items: [
      {href: "/admin/site-map", permission: "edit-dynamic-pages", icon: <ApartmentOutlined/>, label: "Карта сайту"},
      {href: "/admin/changes", permission: HISTORY_PERMISSIONS, icon: <HistoryOutlined/>, label: "Журнал змін"},
      {href: "/admin/trash", permission: HISTORY_PERMISSIONS, icon: <DeleteOutlined/>, label: "Кошик"},
    ]
  },
  {
    title: "Адміністрування",
    items: [
      {href: "/admin/users", permission: "edit-users", icon: <UserOutlined/>, label: "Користувачі"},
      {href: "/admin/site-settings", permission: "edit-site-settings", icon: <SettingOutlined/>, label: "Налаштування сайту"},
    ]
  },
];

const MENU_ITEMS = MENU_SECTIONS.flatMap((section) => section.items);

export default function AdminSideMenu() {
  const {isMenuClosed, setIsMenuClosed, isMobileWidth, setIsMobileWidth} = useContext(AdminSideMenuContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const {userPermissions} = useUserPermissions();

  const pathname = usePathname();

  const menuItems = useMemo<MenuProps["items"]>(() => MENU_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => [item.permission].flat().some((permission) => userPermissions.includes(permission)))
    }))
    .filter((section) => section.items.length != 0)
    .flatMap((section, index): NonNullable<MenuProps["items"]> => {
      const children = section.items.map((item) => ({
        key: item.href,
        icon: item.icon,
        label: <Link prefetch={false} href={item.href}>{item.label}</Link>
      }));

      if (isMenuClosed)
        return [...(index != 0 ? [{type: "divider" as const, key: `divider-${section.title}`}] : []), ...children];

      return [{type: "group" as const, key: section.title, label: section.title, children}];
    }),
  [userPermissions, isMenuClosed]);

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