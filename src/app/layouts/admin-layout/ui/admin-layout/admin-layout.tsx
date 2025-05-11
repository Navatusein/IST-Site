"use client"

import AdminMenuSideContextProvider from "@/app/provider/admin-menu-side-context-provider/admin-menu-side-context-provider";
import {Flex} from "antd";
import {AdminHeader} from "@/widgets/admin-header";
import {ReactNode} from "react";
import Content from "../content/content";
import dynamic from "next/dynamic";

interface IProps {
  children: ReactNode;
}

const AdminSideMenu = dynamic(() => import("@/widgets/admin-side-menu/ui/admin-side-menu/admin-side-menu"), {
  ssr: false
});

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