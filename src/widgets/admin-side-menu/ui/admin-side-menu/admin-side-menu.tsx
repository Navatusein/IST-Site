"use client"

import Sider from "antd/es/layout/Sider";
import {useClickOutside} from "@/shared/hooks/use-click-outside";
import React, {useContext, useEffect, useMemo, useRef} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {Divider, Flex, Menu, MenuProps} from "antd";
import {
  FileTextOutlined,
  FolderOpenOutlined,
  ProfileOutlined,
  ReadOutlined, SolutionOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import Link from "next/link";
import {Icon} from "@/shared/ui-kit";
import UserCard from "../user-card/user-card";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";

export default function AdminSideMenu() {
  const {isMenuClosed, setIsMenuClosed, isMobileWidth, setIsMobileWidth} = useContext(AdminSideMenuContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const {userPermissions} = useUserPermissions();

  const menuItems = useMemo(() => {
    const items: MenuProps["items"]  = []

    if (userPermissions.includes("edit-news"))
      items.push({key: "news-control", icon: <ReadOutlined/>, label: <Link href={"/admin/news"}>Керування новинами</Link>});

    if (userPermissions.includes("edit-dynamic-pages"))
      items.push({key: "edit-pages", icon: <FileTextOutlined/>, label: <Link href={"/admin/dynamic-pages"}>Керування сторінками</Link>});

    if (userPermissions.includes("edit-public-menu"))
      items.push({key: "edit-menu", icon: <ProfileOutlined/>, label: <Link href={"/admin/public-menu"}>Керування меню</Link>});

    if (userPermissions.includes("edit-department-staff"))
      items.push({key: "edit-department-staff", icon: <TeamOutlined/>, label: <Link href={"/admin/department-staff"}>Керування співробітниками</Link>});

    if (userPermissions.includes("edit-department-aspirants"))
      items.push({key: "edit-department-aspirants", icon: <SolutionOutlined/>, label: <Link href={"/admin/department-aspirants"}>Керування аспірантами</Link>});

    if (userPermissions.includes("edit-files"))
      items.push({key: "files-manager", icon: <FolderOpenOutlined/>, label: <Link href={"/admin/file-manager"}>Файловий менеджер</Link>});

    if (userPermissions.includes("edit-users"))
      items.push({key: "user-control", icon: <UserOutlined/>, label: <Link href={"/admin/users"}>Керування користувачами</Link>});

    return items;
  }, [userPermissions])

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
          <Icon showText={!isMenuClosed}/>
          <Divider style={{margin: 0}}/>
          <Menu mode="inline" items={menuItems} style={{borderRight: 0}}/>
        </Flex>
        <Flex vertical>
          <Divider style={{margin: 0}}/>
          <UserCard isMenuClosed={isMenuClosed}/>
        </Flex>
      </Flex>
    </Sider>
  )
}