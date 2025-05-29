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
  defaultTheme: string;
  systemTheme: string;
}

export default function ThemeProvider(props: IProps) {
  const {theme, setTheme, systemTheme} = useTheme();

  useEffect(() => {
    dayjs.locale('uk');
  }, []);

  const themeConfig = useMemo((): ThemeConfig => {
    const currentTheme = theme ?? props.defaultTheme;

    if (theme == "system")
      setTheme(props.defaultTheme);

    return {
      algorithm: currentTheme == "dark" ? darkAlgorithm : defaultAlgorithm,
      cssVar: {prefix: "ant", key: "ist-theme"},
      hashed: false,
      token: {...themeGlobalTokens, ...(currentTheme == "dark" ?  themeDarkTokens : themeLightTokens)}
    }
  }, [systemTheme, theme]);

  return (
    <ConfigProvider theme={themeConfig} wave={{disabled: true}}>
      {props.children}
    </ConfigProvider>
  );
};