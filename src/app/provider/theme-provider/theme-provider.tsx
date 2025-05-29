"use client"

import {ReactNode, useEffect, useMemo} from "react";
import {ConfigProvider, theme as antTheme} from "antd";
import {ThemeConfig} from "antd/lib";
import {useTheme} from "next-themes";
import {themeGlobalTokens, themeLightTokens, themeDarkTokens} from "@/shared/configs/theme-tokens";
import "dayjs/locale/uk";
import dayjs from "dayjs";

const {defaultAlgorithm, darkAlgorithm} = antTheme;

interface IProps {
  children: ReactNode;
  defaultTheme: "light" | "dark";
}

export default function ThemeProvider(props: IProps) {
  const {theme, systemTheme} = useTheme();

  useEffect(() => {
    dayjs.locale('uk');
  }, []);

  const themeConfig = useMemo((): ThemeConfig => {
    let currentTheme = theme ?? props.defaultTheme ?? "system";

    if (currentTheme == "system")
      currentTheme = systemTheme ?? "light"

    return {
      algorithm: currentTheme == "light" ? defaultAlgorithm : darkAlgorithm,
      cssVar: {prefix: "ant", key: "ist-theme"},
      hashed: false,
      token: {...themeGlobalTokens, ...(currentTheme == "light" ? themeLightTokens : themeDarkTokens)}
    }
  }, [systemTheme, theme]);

  return (
    <ConfigProvider theme={themeConfig} wave={{disabled: true}}>
      {props.children}
    </ConfigProvider>
  );
};