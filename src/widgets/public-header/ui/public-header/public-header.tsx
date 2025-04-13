"use client"

import {Flex, Layout, Menu, Space, theme} from "antd";
import {ThemeSwitcher} from "@/features/theme-switcher";
import {Icon} from "@/shared/ui-kit";

interface IProps {

}

const ITEMS = [
  {
    key: "home",
    label: "Головна"
  },
  {
    key: "about",
    label: "Про нас"
  },
  {
    key: "2",
    label: "Вступникам"
  },
  {
    key: "3",
    label: "Студентам"
  },
  {
    key: "4",
    label: "Освітні програми"
  },
  {
    key: "5",
    label: "Проєкти"
  },
  {
    key: "6",
    label: "Більше"
  }
]

export default function PublicHeader(props: IProps) {
  const {token: {colorBgContainer}} = theme.useToken();

  return (
    <Layout.Header style={{padding: `0 8px 0 0`, background: colorBgContainer}}>
      <Flex justify="space-between" align="center" style={{height: "100%"}}>
        <Icon showText={true} style={{width: 270}}/>
        <Space>
          <Menu
            style={{borderBottom: "none", width: "100%"}}
            mode="horizontal"
            items={ITEMS}
          />
          {/*<ThemeSwitcher/>*/}
        </Space>
      </Flex>
    </Layout.Header>
  );
}
