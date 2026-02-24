"use client"

import React, {useMemo} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import {ItemType} from "antd/lib/menu/interface";
import Link from "next/link";
import VerticalNavMenu from "../vertical-nav-menu/vertical-nav-menu";
import HorizontalNavMenu from "../horizontal-nav-menu/horizontal-nav-menu";
import {useMediaQuery} from "react-responsive";

interface IProps {
  menuItems: IPublicMenuItem[]
}

export default function PublicNavMenu(props: IProps) {
  const mapToTreeData = (menuItems: IPublicMenuItem[]): ItemType[] => {
    return menuItems
      .sort((a, b) => (a.index - b.index))
      .map(menuItem => ({
        key: `${menuItem._id}`,
        label: menuItem.path ? <Link href={menuItem.path}>{menuItem.label}</Link> : menuItem.label,
        children: menuItem.children ? mapToTreeData(menuItem.children) : undefined
      } as ItemType));
  }
  const navMenuItems = useMemo(() => {
    return mapToTreeData(props.menuItems);
  }, [props.menuItems]);

  const isMobileWidth = useMediaQuery({maxWidth: 992})

  return (
    <>
      {isMobileWidth ?
        <VerticalNavMenu navMenuItems={navMenuItems}/> :
        <HorizontalNavMenu navMenuItems={navMenuItems}/>
      }
    </>
  )
}
