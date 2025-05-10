"use client"

import AdminMenuSideContextProvider from "@/app/provider/admin-menu-side-context-provider/admin-menu-side-context-provider";
import {Flex} from "antd";
import {AdminSideMenu} from "@/widgets/admin-side-menu";
import {AdminHeader} from "@/widgets/admin-header";
import {ReactNode} from "react";
import Content from "../content/content";

interface IProps {
  children: ReactNode;
}

export default function AdminLayout(props: IProps) {
  return (
    <AdminMenuSideContextProvider>
      <Flex style={{maxHeight: "100dvh", width: "100dvw"}}>
        <AdminSideMenu/>
        <Flex vertical style={{width: "100%", overflowX: "hidden"}}>
          <AdminHeader/>
          <Content>
            {props.children}
          </Content>
        </Flex>
      </Flex>
    </AdminMenuSideContextProvider>
  );
}