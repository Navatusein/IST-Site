import {ReactNode} from "react";
import {PublicPageLayout} from "@/app/layouts/public-page-layout";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <PublicPageLayout>
      {props.children}
    </PublicPageLayout>
  );
}
