import {ReactNode} from "react";
import {PageLayout} from "@/app/layouts/page-layout";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <PageLayout>
      {props.children}
    </PageLayout>
  );
}
