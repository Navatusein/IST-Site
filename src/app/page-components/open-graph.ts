import {Metadata} from "next";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SITE_SETTINGS_DEFAULTS} from "@/entities/site-settings/types/type";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const DEFAULT_OPEN_GRAPH_IMAGE = "/icon.webp";

// A page's openGraph replaces the root layout's one, so the shared fields are repeated here
export async function openGraph(fields: OpenGraph): Promise<OpenGraph> {
  const {siteTitle} = await unwrapServerAction(getSiteSettingsAction()).catch(() => SITE_SETTINGS_DEFAULTS);

  return {
    siteName: siteTitle,
    locale: "uk_UA",
    type: "website",
    images: [DEFAULT_OPEN_GRAPH_IMAGE],
    ...fields
  } as OpenGraph;
}
