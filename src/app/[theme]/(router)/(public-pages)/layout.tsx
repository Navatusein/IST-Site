import {ReactNode} from "react";
import {PublicPageLayout} from "@/app/layouts/public-page-layout";
import {getPublicMenuItemsTreeAction} from "@/entities/public-menu-item/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {organizationStructuredData} from "@/app/page-components/structured-data";
import {JsonLd} from "@/shared/ui-kit";
import {getAnalyticsMeasurementId} from "@/shared/configs/analytics";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  const [menuItems, siteSettings] = await Promise.all([
    unwrapServerAction(getPublicMenuItemsTreeAction()),
    unwrapServerAction(getSiteSettingsAction())
  ]);

  return (
    <>
      <link rel="alternate" type="application/rss+xml" title={`Новини — ${siteSettings.siteShortName}`} href="/rss.xml"/>
      <JsonLd data={organizationStructuredData(siteSettings)}/>
      <PublicPageLayout menuItems={menuItems} siteSettings={siteSettings} analyticsMeasurementId={getAnalyticsMeasurementId()}>
        {props.children}
      </PublicPageLayout>
    </>
  );
}
