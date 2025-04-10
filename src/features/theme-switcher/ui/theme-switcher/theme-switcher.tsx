"use client"

import {useEffect, useState} from "react";
import {setCookie} from "cookies-next";
import {useTheme} from "next-themes";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import {Button} from "antd";

interface IProps {

}

export default function ThemeSwitcher(props: IProps) {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme()

  useEffect(() => {
    setMounted(true)
  }, []);

  if (!mounted) {
    return null
  }

  const switchTheme = () => {
    const nextTheme = theme == "dark" ? "light" : "dark";

    setTheme(nextTheme);
    setCookie("theme", nextTheme);
  }

  return (
    <Button
      onClick={() => switchTheme()}
      icon={theme == "dark" ? <MoonOutlined/> : <SunOutlined/>}
    />
  )
}



