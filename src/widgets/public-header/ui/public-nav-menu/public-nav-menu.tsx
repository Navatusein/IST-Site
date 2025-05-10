import React, {useEffect, useMemo, useState} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import {ItemType, MenuItemType} from "antd/lib/menu/interface";
import Link from "next/link";
import VerticalNavMenu from "../vertical-nav-menu/vertical-nav-menu";
import HorizontalNavMenu from "../horizontal-nav-menu/horizontal-nav-menu";

interface IProps {
  menuItems: IPublicMenuItem[]
}

export default function PublicNavMenu(props: IProps) {
  const [isMobileWidth, setIsMobileWidth] = useState<boolean>(false);

  const mapToTreeData = (menuItems: IPublicMenuItem[]): ItemType<MenuItemType>[] => {
    return menuItems
      .sort((a, b) => (a.index - b.index))
      .map(menuItem => ({
        key: `${menuItem._id}`,
        label: menuItem.path ? <Link href={menuItem.path}>{menuItem.label}</Link> : menuItem.label,
        children: menuItem.children ? mapToTreeData(menuItem.children) : undefined
      } as ItemType<MenuItemType>));
  }

  const checkWindowSize = () => {
    setIsMobileWidth(() => window.innerWidth < 599);
  };

  const navMenuItems = useMemo(() => mapToTreeData(props.menuItems), [props.menuItems]);

  useEffect(() => {
    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  return (
    <>
      {isMobileWidth ?
        <VerticalNavMenu navMenuItems={navMenuItems}/> :
        <HorizontalNavMenu navMenuItems={navMenuItems}/>
      }
    </>
  )
}
