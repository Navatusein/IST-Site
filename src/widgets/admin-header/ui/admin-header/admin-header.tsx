"use client"

import {Button, Flex, Grid, Layout, Space, theme, Tooltip} from "antd";
import {useContext} from "react";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";
import {GlobalOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {actionSignOut} from "../../actions/actions";
import {ThemeSwitcher} from "@/features/theme-switcher";
import Link from "next/link";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {useRouter} from "next/navigation";

export default function AdminHeader() {
  const {token: {colorBgContainer}} = theme.useToken();
  const {isMenuClosed, setIsMenuClosed} = useContext(AdminSideMenuContext);
  const router = useRouter();

  const isNarrow = Grid.useBreakpoint().md != true;

  const signOut = () => {
    unwrapServerAction(actionSignOut())
      .then(() => {
        router.push("/home");
        router.refresh();
      });
  }

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
          <Tooltip title="Публічні сторінки">
            <Link style={{height: 32, display: "flex"}} href={"/home"}>
              <Button icon={isNarrow ? <GlobalOutlined/> : undefined} aria-label="Публічні сторінки">
                {!isNarrow && "Публічні сторінки"}
              </Button>
            </Link>
          </Tooltip>
          <ThemeSwitcher/>
          <Tooltip title="Вихід">
            <Button icon={isNarrow ? <LogoutOutlined/> : undefined} onClick={signOut} aria-label="Вихід">
              {!isNarrow && "Вихід"}
            </Button>
          </Tooltip>
        </Space>
      </Flex>
    </Layout.Header>
  );
}