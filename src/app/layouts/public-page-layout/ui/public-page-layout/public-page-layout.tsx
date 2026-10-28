"use client"

import {Layout} from "antd";
import {ReactNode} from "react";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import {ISiteSettingsData} from "@/entities/site-settings";
import {PublicHeader} from "@/widgets/public-header";
import {PublicFooter} from "@/widgets/public-footer";
import SessionProvider from "@/app/provider/session-provider/session-provider";
import {NavigationProgress} from "@/shared/ui-kit";
import {AnalyticsConsentBanner, GoogleAnalytics} from "@/features/analytics-consent";

interface IProps {
  children: ReactNode;
  menuItems: IPublicMenuItem[]
  siteSettings: ISiteSettingsData;
  analyticsMeasurementId: string | null;
}

export default function PublicPageLayout(props: IProps) {
  return (
    <SessionProvider>
      {props.analyticsMeasurementId && (
        <>
          <GoogleAnalytics measurementId={props.analyticsMeasurementId}/>
          <AnalyticsConsentBanner/>
        </>
      )}
      <NavigationProgress/>
      <Layout>
        <PublicHeader menuItems={props.menuItems}/>
        <Layout.Content style={{contain: "paint", minHeight: "calc(100svh - 60px)"}}>
          {props.children}
        </Layout.Content>
        <PublicFooter settings={props.siteSettings} hasCookieSettings={props.analyticsMeasurementId != null}/>
      </Layout>
    </SessionProvider>
  )
}
