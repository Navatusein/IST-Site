import {Metadata} from "next";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SITE_SETTINGS_DEFAULTS} from "@/entities/site-settings/types/type";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export async function pageTitle(title: string): Promise<Metadata["title"]> {
  const {siteShortName} = await unwrapServerAction(getSiteSettingsAction()).catch(() => SITE_SETTINGS_DEFAULTS);

  return siteShortName && title.includes(siteShortName) ? {absolute: title} : title;
}
