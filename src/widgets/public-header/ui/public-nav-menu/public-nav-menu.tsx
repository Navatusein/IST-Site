"use client"

import React, {useMemo} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import {ItemType} from "antd/lib/menu/interface";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {getSelectedMenuKeys} from "../../model/get-selected-menu-keys";
import {toPublicHref} from "@/shared/utilities/public-paths";
import VerticalNavMenu from "../vertical-nav-menu/vertical-nav-menu";
import HorizontalNavMenu from "../horizontal-nav-menu/horizontal-nav-menu";
import styles from "./public-nav-menu.module.scss";

interface IProps {
  menuItems: IPublicMenuItem[]
}

export default function PublicNavMenu(props: IProps) {
  const mapToTreeData = (menuItems: IPublicMenuItem[]): ItemType[] => {
    return menuItems
      .sort((a, b) => (a.index - b.index))
      .map(menuItem => ({
        key: `${menuItem._id}`,
        label: menuItem.path ? <Link href={toPublicHref(menuItem.path)}>{menuItem.label}</Link> : menuItem.label,
        children: menuItem.children ? mapToTreeData(menuItem.children) : undefined
      } as ItemType));
  }
  const navMenuItems = useMemo(() => {
    return mapToTreeData(props.menuItems);
  }, [props.menuItems]);

  const pathname = usePathname();
  const selectedKeys = useMemo(() => getSelectedMenuKeys(props.menuItems, pathname), [props.menuItems, pathname]);

  return (
    <>
      <div className={styles.horizontal}>
        <HorizontalNavMenu navMenuItems={navMenuItems} selectedKeys={selectedKeys}/>
      </div>
      <div className={styles.vertical}>
        <VerticalNavMenu navMenuItems={navMenuItems} selectedKeys={selectedKeys}/>
      </div>
    </>
  )
}
