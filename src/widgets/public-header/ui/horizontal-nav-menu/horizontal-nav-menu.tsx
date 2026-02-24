"use client"

import {Button, Flex, Menu, theme} from "antd";
import {ItemType} from "antd/lib/menu/interface";
import {ThemeSwitcher} from "@/features/theme-switcher";
import React from "react";
import Link from "next/link";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";

interface IProps {
  navMenuItems:  ItemType[];
}

export default function HorizontalNavMenu(props: IProps) {
  const {token: {controlHeight}} = theme.useToken();
  const {isAuthorized} = useUserPermissions();

  return (
    <>
      <Menu
        style={{borderBottom: "none", minWidth: 0, flex: "auto", justifyContent: "center"}}
        mode="horizontal"
        items={props.navMenuItems}
      />
      <Flex gap="small" justify="center" align="center">
        {isAuthorized ?
          <Link style={{height: controlHeight, display: "flex"}} href={"/admin"}>
            <Button>
              Адмін панель
            </Button>
          </Link> :
          <Link style={{height: 32, display: "flex"}} href={"/sign-in"}>
            <Button>
              Увійти
            </Button>
          </Link>
        }
        <ThemeSwitcher/>
      </Flex>
    </>
  )
}
