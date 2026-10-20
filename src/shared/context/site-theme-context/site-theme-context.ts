"use client"

import {createContext} from "react";
import {SiteTheme} from "@/shared/configs/site-theme";

export interface ISiteThemeContext {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

export const SiteThemeContext = createContext<ISiteThemeContext>({
  theme: "light",
  setTheme: () => {}
});
