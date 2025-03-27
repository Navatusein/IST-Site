"use client"

import {Button, Flex, Layout, Space, theme} from "antd";
import {useContext} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined} from "@ant-design/icons";
import {ThemeConfigContext} from "@/shared/context/theme-config-context/theme-config-context";
import {actionSignOut} from "@/widgets/admin-header";

export default function AdminHeader() {
  const {darkMode, setDarkMode} = useContext(ThemeConfigContext);
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
          <Button
            onClick={() => setDarkMode(!darkMode)}
            icon={darkMode ? <MoonOutlined/> : <SunOutlined/>}
          />
          <Button onClick={() => actionSignOut()}>
            Вихід
          </Button>
        </Space>
      </Flex>
    </Layout.Header>
  );
}