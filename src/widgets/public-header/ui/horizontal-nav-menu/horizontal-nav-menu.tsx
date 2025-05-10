import {Button, Flex, Menu} from "antd";
import {ItemType, MenuItemType} from "antd/lib/menu/interface";
import {ThemeSwitcher} from "@/features/theme-switcher";
import {redirect} from "next/navigation";

interface IProps {
  navMenuItems:  ItemType<MenuItemType>[];
}

export default function HorizontalNavMenu(props: IProps) {
  return (
    <>
      <Menu
        style={{borderBottom: "none", minWidth: 0, flex: "auto"}}
        mode="horizontal"
        items={props.navMenuItems}
      />
      <Flex gap="small" justify="center" align="center">
        <Button onClick={() => redirect("admin")}>
          Адмін панель
        </Button>
        <ThemeSwitcher/>
      </Flex>
    </>
  )
}
