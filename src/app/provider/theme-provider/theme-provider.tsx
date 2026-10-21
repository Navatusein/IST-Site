"use client"

import {ReactNode, useMemo, useSyncExternalStore} from "react";
import {ConfigProvider, theme as antTheme} from "antd";
import ukUA from "antd/locale/uk_UA";
import type {Locale} from "antd/es/locale";
import {ThemeConfig} from "antd/lib";
import {setCookie} from "cookies-next";
import {themeGlobalTokens, themeLightTokens, themeDarkTokens} from "@/shared/configs/theme-tokens";
import {getThemeCssVarKey, SiteTheme, THEME_COOKIE_NAME} from "@/shared/configs/site-theme";
import {SiteThemeContext} from "@/shared/context/site-theme-context/site-theme-context";
import "dayjs/locale/uk";
import dayjs from "dayjs";

dayjs.locale("uk");

const locale: Locale = {
  ...ukUA,
  Pagination: {...ukUA.Pagination, items_per_page: "на сторінці"}
};

const {defaultAlgorithm, darkAlgorithm} = antTheme;

let selectedTheme: SiteTheme | null = null;
const listeners = new Set<() => void>();

const themeStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => selectedTheme,
  getServer: () => null,
  set: (theme: SiteTheme) => {
    selectedTheme = theme;
    listeners.forEach((listener) => listener());
  }
};

interface IProps {
  children: ReactNode;
  theme: SiteTheme;
}

export default function ThemeProvider(props: IProps) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, themeStore.getServer) ?? props.theme;

  const setTheme = (value: SiteTheme) => {
    themeStore.set(value);
    setCookie(THEME_COOKIE_NAME, value, {path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax"});
  }

  const themeConfig = useMemo((): ThemeConfig => ({
    algorithm: theme == "dark" ? darkAlgorithm : defaultAlgorithm,
    cssVar: {prefix: "ant", key: getThemeCssVarKey(theme)},
    hashed: false,
    token: {...themeGlobalTokens, ...(theme == "dark" ? themeDarkTokens : themeLightTokens)}
  }), [theme]);

  return (
    <SiteThemeContext value={{theme, setTheme}}>
      <ConfigProvider theme={themeConfig} locale={locale} wave={{disabled: true}} tag={{variant: "outlined"}}>
        {props.children}
      </ConfigProvider>
    </SiteThemeContext>
  );
};
