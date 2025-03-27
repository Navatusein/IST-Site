import {ReactNode} from "react";
import {useLocalStorage} from "@/shared/hooks/use-local-storage";
import {AdminSideMenuContext} from "@/shared/context/admin-side-menu-context/admin-side-menu-context";

interface IProps {
  children: ReactNode;
}

export default function AdminMenuSideContextProvider(props: IProps) {
  const [isMobileWidth, setIsMobileWidth] = useLocalStorage<boolean>("isMobileWidth", false);
  const [isMenuClosed, setIsMenuClosed] = useLocalStorage<boolean>("isMenuClosed", false);

  return(
    <AdminSideMenuContext.Provider value={{
      isMobileWidth: isMobileWidth,
      setIsMobileWidth: setIsMobileWidth,

      isMenuClosed: isMenuClosed,
      setIsMenuClosed: setIsMenuClosed,
    }}>
      {props.children}
    </AdminSideMenuContext.Provider>
  );
}