import {ReactNode} from "react";
import {App, Layout} from "antd";
import ThemeProvider from "@/app/provider/theme-provider/theme-provider";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {SiteTheme} from "@/shared/configs/site-theme";

interface IProps {
  children: ReactNode;
  theme: SiteTheme;
}

export default function BaseLayout(props: IProps) {
  return (
    <ThemeProvider theme={props.theme}>
      <App>
        <NuqsAdapter>
          <Layout style={{minHeight: "100dvh"}}>
            {props.children}
          </Layout>
        </NuqsAdapter>
      </App>
    </ThemeProvider>
  );
}
