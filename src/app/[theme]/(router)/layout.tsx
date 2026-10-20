import {ReactNode} from "react";
import PageComponentRegistryProvider from "@/app/provider/page-component-registry-provider/page-component-registry-provider";

interface IProps {
  children: ReactNode;
  modals: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <PageComponentRegistryProvider>
      {props.children}
      {props.modals}
    </PageComponentRegistryProvider>
  );
}
