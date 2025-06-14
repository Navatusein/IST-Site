"use client"

import {Button, Drawer, Flex, Menu, theme, Typography} from "antd";
import React, {useState} from "react";
import {ItemType, MenuItemType} from "antd/lib/menu/interface";
import {UnorderedListOutlined} from "@ant-design/icons";
import {ThemeSwitcher} from "@/features/theme-switcher";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import Link from "next/link";

interface IProps {
  navMenuItems:  ItemType<MenuItemType>[];
}

export default function VerticalNavMenu(props: IProps) {
  const {token: {colorBgContainer, controlHeight, paddingLG, padding}} = theme.useToken();
  const {isAuthorized} = useUserPermissions();

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openDrawer = () => {
    setIsOpen(() => true);
  }

  const closeDrawer = () => {
    setIsOpen(() => false);
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
        title={(
          <Flex justify="space-between" align="center">
            <Typography.Title level={5} style={{margin: 0}}>
              Меню навігації
            </Typography.Title>
            <ThemeSwitcher/>
          </Flex>
        )}
        open={isOpen}
        onClose={closeDrawer}
        styles={{body: {padding: 0}}}
        style={{background: colorBgContainer}}
      >
        <Menu
          mode="inline"
          items={props.navMenuItems}
          onSelect={() => setIsOpen(() => false)}
        />
        <Flex vertical style={{padding: `${padding}px ${paddingLG}px`}}>
          {isAuthorized ?
            <Link style={{height: controlHeight, display: "flex"}} href={"/admin"}>
              <Button block>
                Адмін панель
              </Button>
            </Link> :
            <Link style={{height: 32, display: "flex"}} href={"/sign-in"}>
              <Button block>
                Увійти
              </Button>
            </Link>
          }
        </Flex>
      </Drawer>
    </>
  )
}
