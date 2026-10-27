"use client"

import AdminMenuSideContextProvider from "@/app/provider/admin-menu-side-context-provider/admin-menu-side-context-provider";
import {Flex, Layout, theme} from "antd";
import {AdminHeader} from "@/widgets/admin-header";
import {ReactNode} from "react";
import dynamic from "next/dynamic";

interface IProps {
  children: ReactNode;
}

const AdminSideMenu = dynamic(() => import("@/widgets/admin-side-menu/ui/admin-side-menu/admin-side-menu"), {
  ssr: false
});

export default function AdminLayout(props: IProps) {
  const {token: {padding}} = theme.useToken();

  return (
    <AdminMenuSideContextProvider>
      <Flex style={{height: "100dvh", width: "100dvw"}}>
        <AdminSideMenu/>
        <Flex vertical style={{width: "100%", minWidth: 0, overflowX: "hidden"}}>
          <AdminHeader/>
          <Layout style={{flex: "1 1 0", minHeight: 0, overflow: "hidden"}}>
            <Layout.Content style={{padding: `${padding}px`, flex: "1 1 0", minHeight: 0, overflow: "hidden auto", display: "flex", flexDirection: "column"}}>
              {props.children}
            </Layout.Content>
          </Layout>
        </Flex>
      </Flex>
    </AdminMenuSideContextProvider>
  );
}