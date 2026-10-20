import {ReactNode} from "react";
import {PublicPageLayout} from "@/app/layouts/public-page-layout";
import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  const [menuItems, siteSettings] = await Promise.all([
    unwrapServerAction(getPublicMenuItemsTreeAction()),
    unwrapServerAction(getSiteSettingsAction())
  ]);

  return (
    <PublicPageLayout menuItems={menuItems} siteSettings={siteSettings}>
      {props.children}
    </PublicPageLayout>
  );
}
