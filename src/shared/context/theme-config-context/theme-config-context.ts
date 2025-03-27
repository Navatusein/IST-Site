import {createContext} from "react";
import {AliasToken} from "antd/es/theme/interface";

export interface IThemeConfigContextProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  token?: Partial<AliasToken>;
  setToken: (tokens?: Partial<AliasToken>) => void;
}

export const ThemeConfigContext = createContext<IThemeConfigContextProps>({
  darkMode: false,
  setDarkMode: () => {},
  setToken: () => {}
});