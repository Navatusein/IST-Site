"use client"

import {useEffect, useMemo, useState} from "react";
import {setCookie} from "cookies-next";
import {useTheme} from "next-themes";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import {Button, Dropdown, MenuProps} from "antd";


export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme, systemTheme} = useTheme()

  const colorThemesItems = useMemo(() => ([
    {
      key: "dark",
      label: "Темна тема",
      icon: <MoonOutlined/>
    },
    {
      key: "light",
      label: "Світла тема",
      icon: <SunOutlined/>
    }
  ] as MenuProps["items"]), [systemTheme]);

  useEffect(() => {
    setMounted(true)
  }, []);

  if (!mounted) {
    return null
  }

  const onThemeSelect = (value: string) => {
    setTheme(value);
    setCookie("theme", value);
  }

  return (
    <Dropdown menu={{
      items: colorThemesItems,
      selectedKeys: [theme ?? "system"],
      onClick: (e) => onThemeSelect(e.key)
    }}>
      <Button
        icon={theme == "dark" ? <MoonOutlined/> : <SunOutlined/>}
      />
    </Dropdown>
  )
}



