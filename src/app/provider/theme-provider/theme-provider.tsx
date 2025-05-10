"use client"

import {ReactNode, useEffect, useMemo} from "react";
import {ConfigProvider, theme as antTheme} from "antd";
import {ThemeConfig} from "antd/lib";
import {useTheme} from "next-themes";
import {themeTokens} from "@/shared/configs/theme-tokens";
import "dayjs/locale/uk";
import dayjs from "dayjs";

const {defaultAlgorithm, darkAlgorithm} = antTheme;

interface IProps {
  children: ReactNode;
  defaultTheme: "light" | "dark";
}

export default function ThemeProvider(props: IProps) {
  const {theme} = useTheme();

  useEffect(() => {
    dayjs.locale('uk');
  }, []);

  const themeConfig = useMemo((): ThemeConfig => {
    return {
      algorithm: (theme ?? props.defaultTheme) == "light" ? defaultAlgorithm : darkAlgorithm,
      cssVar: true,
      hashed: true,
      token: themeTokens
    }
  }, [props.defaultTheme, theme]);

  return (
    <ConfigProvider theme={themeConfig} wave={{disabled: true}}>
      {props.children}
    </ConfigProvider>
  );
};