"use client"

import Sider from "antd/es/layout/Sider";
import {useClickOutside} from "@/shared/hooks/use-click-outside";
import React, {useContext, useEffect, useMemo, useRef} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {Divider, Flex, Menu, MenuProps} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "@/shared/ui-kit";
import UserCard from "../user-card/user-card";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import {ADMIN_MENU_SECTIONS, getAllowedAdminMenuSections} from "@/shared/configs/admin-menu-config";

const ADMIN_HOME_HREF = "/admin";

const MENU_ITEMS = ADMIN_MENU_SECTIONS.flatMap((section) => section.items);

export default function AdminSideMenu() {
  const {isMenuClosed, setIsMenuClosed, isMobileWidth, setIsMobileWidth} = useContext(AdminSideMenuContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const {userPermissions} = useUserPermissions();

  const pathname = usePathname();

  const menuItems = useMemo<MenuProps["items"]>(() => [
    {key: ADMIN_HOME_HREF, icon: <HomeOutlined/>, label: <Link prefetch={false} href={ADMIN_HOME_HREF}>Головна</Link>},
    ...getAllowedAdminMenuSections(userPermissions)
      .flatMap((section): NonNullable<MenuProps["items"]> => {
        const children = section.items.map((item) => ({
          key: item.href,
          icon: item.icon,
          label: <Link prefetch={false} href={item.href}>{item.label}</Link>
        }));

        if (isMenuClosed)
          return [{type: "divider" as const, key: `divider-${section.title}`}, ...children];

        return [{type: "group" as const, key: section.title, label: section.title, children}];
      })
  ], [userPermissions, isMenuClosed]);

  const selectedKeys = pathname == ADMIN_HOME_HREF ? [ADMIN_HOME_HREF] : MENU_ITEMS
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