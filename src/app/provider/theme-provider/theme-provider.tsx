"use client"

import {ReactNode, useMemo, useState} from "react";
import {ConfigProvider, theme} from "antd";
import {ThemeConfig} from "antd/lib";
import { ThemeConfigContext } from "@/shared/context/theme-config-context/theme-config-context";
import {AliasToken} from "antd/es/theme/interface";
import {useLocalStorage} from "@/shared/hooks/use-local-storage";

const {defaultAlgorithm, darkAlgorithm} = theme;

interface IProps {
  children: ReactNode;
}

export default function ThemeProvider(props: IProps) {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);
  const [token, setToken] = useState<Partial<AliasToken> | undefined>(undefined);

  const themeConfig = useMemo((): ThemeConfig => {
    return {
      algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
      token: token,
      cssVar: false,
      hashed: false
    }
  }, [darkMode, token]);

  return (
    <ThemeConfigContext.Provider value={{darkMode: darkMode, setDarkMode: setDarkMode, token: token, setToken: setToken}}>
      <ConfigProvider theme={themeConfig}>
        {props.children}
      </ConfigProvider>
    </ThemeConfigContext.Provider>
  );
};