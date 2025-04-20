import {ReactNode} from "react";
import {PublicPageLayout} from "@/app/layouts/public-page-layout";
import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  const menuItems = await getPublicMenuItemsTreeAction();

  return (
    <PublicPageLayout menuItems={menuItems}>
      {props.children}
    </PublicPageLayout>
  );
}
