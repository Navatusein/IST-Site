import "@/shared/styles/global.scss";

import {ReactNode} from "react";
import {Metadata} from "next";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SITE_SETTINGS_DEFAULTS} from "@/entities/site-settings/types/type";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {isIndexingAllowed} from "@/shared/configs/indexing";
import {DEFAULT_OPEN_GRAPH_IMAGE} from "@/app/page-components/open-graph";

interface IProps {
  children: ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await unwrapServerAction(getSiteSettingsAction()).catch(() => SITE_SETTINGS_DEFAULTS);

  return {
    metadataBase: process.env.APP_PUBLIC_URL ? new URL(process.env.APP_PUBLIC_URL) : undefined,
    title: {
      default: settings.siteTitle,
      template: `%s — ${settings.siteShortName}`
    },
    ...(settings.siteDescription && {description: settings.siteDescription}),
    openGraph: {
      siteName: settings.siteTitle,
      locale: "uk_UA",
      type: "website",
      title: settings.siteTitle,
      ...(settings.siteDescription && {description: settings.siteDescription}),
      images: [DEFAULT_OPEN_GRAPH_IMAGE]
    },
    ...(!isIndexingAllowed() && {robots: {index: false, follow: false}}),
  };
}

export default function Layout(props: IProps) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <link rel="shortcut icon" href="/icon.webp"/>
        <AntdRegistry>
          {props.children}
        </AntdRegistry>
      </body>
    </html>
  );
}
