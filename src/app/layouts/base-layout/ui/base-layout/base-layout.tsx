"use server"

import {AntdRegistry} from "@ant-design/nextjs-registry";
import {ReactNode} from "react";
import {App, Layout} from "antd";
import {ThemeProvider as NextThemeProvider} from "next-themes";
import ThemeProvider from "@/app/provider/theme-provider/theme-provider";
import SessionProvider from "@/app/provider/session-provider/session-provider";
import {NuqsAdapter} from "nuqs/adapters/next/app";

interface IProps {
  children: ReactNode;
  defaultTheme: "light" | "dark";
}

export default async function BaseLayout(props: IProps) {
  return (
    <AntdRegistry>
      <SessionProvider>
       <NextThemeProvider>
         <ThemeProvider defaultTheme={props.defaultTheme}>
           <App>
             <NuqsAdapter>
               <Layout style={{minHeight: "100dvh"}}>
                 {props.children}
               </Layout>
             </NuqsAdapter>
           </App>
         </ThemeProvider>
       </NextThemeProvider>
      </SessionProvider>
    </AntdRegistry>
  );
}
