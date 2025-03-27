import {createContext} from "react";

export interface IAdminSideMenuContext{
  isMobileWidth: boolean;
  setIsMobileWidth: (value: boolean) => void;

  isMenuClosed: boolean;
  setIsMenuClosed: (value: boolean) => void;
}

export const AdminSideMenuContext = createContext<IAdminSideMenuContext>({
  isMobileWidth: false,
  setIsMobileWidth: (_) => {},

  isMenuClosed: false,
  setIsMenuClosed: (_) => {}
});