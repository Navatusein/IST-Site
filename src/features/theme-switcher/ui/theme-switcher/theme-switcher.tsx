"use client"

import {useContext} from "react";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import {Button, Dropdown, MenuProps} from "antd";
import {SiteThemeContext} from "@/shared/context/site-theme-context/site-theme-context";
import {SiteTheme} from "@/shared/configs/site-theme";

const THEME_ITEMS: MenuProps["items"] = [
  {key: "dark", label: "Темна тема", icon: <MoonOutlined/>},
  {key: "light", label: "Світла тема", icon: <SunOutlined/>}
];

export default function ThemeSwitcher() {
  const {theme, setTheme} = useContext(SiteThemeContext);

  return (
    <Dropdown menu={{
      items: THEME_ITEMS,
      selectedKeys: [theme],
      onClick: (event) => setTheme(event.key as SiteTheme)
    }}>
      <Button icon={theme == "dark" ? <MoonOutlined/> : <SunOutlined/>} aria-label="Тема оформлення"/>
    </Dropdown>
  )
}
