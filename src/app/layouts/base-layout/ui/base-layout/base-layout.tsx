"use client"

import "@ant-design/v5-patch-for-react-19";

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {ReactNode} from "react";
import {App, Layout} from "antd";
import ThemeProvider from "@/app/provider/theme-provider/theme-provider";
import SessionProvider from "@/app/provider/session-provider/session-provider";
import {NuqsAdapter} from "nuqs/adapters/next/app";

interface IProps {
  children: ReactNode;
}

export default function BaseLayout(props: IProps) {
  return (
    <AntdRegistry>
      <SessionProvider>
        <ThemeProvider>
          <App>
            <NuqsAdapter>
              <Layout style={{minHeight: "100vh"}}>
                {props.children}
              </Layout>
            </NuqsAdapter>
          </App>
        </ThemeProvider>
      </SessionProvider>
    </AntdRegistry>
  );
}
