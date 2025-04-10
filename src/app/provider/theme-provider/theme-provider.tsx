"use client"

import {ReactNode, useMemo} from "react";
import {ConfigProvider, theme as antTheme} from "antd";
import {ThemeConfig} from "antd/lib";
import {useTheme} from "next-themes";

const {defaultAlgorithm, darkAlgorithm} = antTheme;

interface IProps {
  children: ReactNode;
  defaultTheme: "light" | "dark";
}

export default function ThemeProvider(props: IProps) {
  const {theme} = useTheme();
  const themeConfig = useMemo((): ThemeConfig => {

    return {
      algorithm: (theme ?? props.defaultTheme) == "light" ? defaultAlgorithm : darkAlgorithm,
      cssVar: true,
      hashed: true
    }
  }, [props.defaultTheme, theme]);

  return (
    <ConfigProvider theme={themeConfig} wave={{disabled: true}}>
      {props.children}
    </ConfigProvider>
  );
};