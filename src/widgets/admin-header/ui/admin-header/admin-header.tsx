"use client"

import {Button, Flex, Layout, Space, theme} from "antd";
import {useContext} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {actionSignOut} from "../../actions/actions";
import {ThemeSwitcher} from "@/features/theme-switcher";
import Link from "next/link";
import {useServerAction} from "@/shared/hooks/use-server-action";

export default function AdminHeader() {
  const {token: {colorBgContainer}} = theme.useToken();
  const {isMenuClosed, setIsMenuClosed} = useContext(AdminSideMenuContext);


  return (
    <Layout.Header style={{padding: `0 8px`, background: colorBgContainer}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Button
          type="text"
          icon={isMenuClosed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
          onClick={() => setIsMenuClosed(!isMenuClosed)}
          style={{width: "48px", height: "48px"}}
        />
        <Space>
          <Link style={{height: 32, display: "flex"}} href={"/home"}>
            <Button>
              Публічні сторінки
            </Button>
          </Link>
          <ThemeSwitcher/>
          <Button onClick={() => useServerAction(actionSignOut())}>
            Вихід
          </Button>
        </Space>
      </Flex>
    </Layout.Header>
  );
}