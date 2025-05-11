"use client"

import {Button, Drawer, Menu, theme} from "antd";
import {useState} from "react";
import {ItemType, MenuItemType} from "antd/lib/menu/interface";
import {UnorderedListOutlined} from "@ant-design/icons";
import {ThemeSwitcher} from "@/features/theme-switcher";

interface IProps {
  navMenuItems:  ItemType<MenuItemType>[];
}

export default function VerticalNavMenu(props: IProps) {
  const {token: {colorBgContainer}} = theme.useToken();

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openDrawer = () => {
    setIsOpen(() => true);
  }

  const closeDrawer = () => {
    setIsOpen(() => false)
  }

  return (
    <>
      <Button
        onClick={openDrawer}
        icon={<UnorderedListOutlined/>}
        type="text"
        style={{width: "48px", height: "48px"}}
      />
      <Drawer
        title="Меню навігації"
        open={isOpen}
        onClose={closeDrawer}
        styles={{body: {padding: 0}}}
        style={{background: colorBgContainer}}
      >
        <ThemeSwitcher/>
        <Menu
          mode="inline"
          items={props.navMenuItems}
        />
      </Drawer>
    </>
  )
}
