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
      <Flex style={{maxHeight: "100dvh", width: "100dvw"}}>
        <AdminSideMenu/>
        <Flex vertical style={{width: "100%", overflowX: "hidden"}}>
          <AdminHeader/>
          <Layout style={{overflow: "hidden auto"}}>
            <Layout.Content style={{padding: `${padding}px`, minHeight: "fit-content"}}>
              {props.children}
            </Layout.Content>
          </Layout>
        </Flex>
      </Flex>
    </AdminMenuSideContextProvider>
  );
}