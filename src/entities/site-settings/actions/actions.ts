"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {requirePermission} from "@/auth";
import SiteSettings from "../types/schema";
import {
  ISiteSettingsData,
  MAP_EMBED_URL_PREFIX,
  SITE_SETTINGS_DEFAULTS,
  SITE_SETTINGS_KEY,
  SOCIAL_NETWORK_NAMES,
  SocialNetwork
} from "../types/type";

const text = (value: unknown) => typeof value == "string" ? value.trim() : "";

function getMapEmbedUrl(value: unknown): string {
  const raw = text(value);
  return raw.match(/src="([^"]+)"/)?.[1] ?? raw;
}

export const getSiteSettingsAction = createServerAction<ISiteSettingsData>(cachePublicData("getSiteSettingsAction", async () => {
  const stored = await SiteSettings.findOne({key: SITE_SETTINGS_KEY}).lean<Partial<ISiteSettingsData>>();

  const settings = {...SITE_SETTINGS_DEFAULTS};

  for (const key of Object.keys(SITE_SETTINGS_DEFAULTS) as (keyof ISiteSettingsData)[]) {
    if (stored?.[key] !== undefined)
      Object.assign(settings, {[key]: stored[key]});
  }

  return {...settings, socialLinks: settings.socialLinks.map(({network, url}) => ({network, url}))};
}));

export const updateSiteSettingsAction = createServerAction<void>(async (data: ISiteSettingsData) => {
  await requirePermission("edit-site-settings");

  const settings: ISiteSettingsData = {
    siteTitle: text(data?.siteTitle) || SITE_SETTINGS_DEFAULTS.siteTitle,
    siteShortName: text(data?.siteShortName) || SITE_SETTINGS_DEFAULTS.siteShortName,
    siteDescription: text(data?.siteDescription).slice(0, 300),
    organizationName: text(data?.organizationName),
    workingHours: text(data?.workingHours),
    address: text(data?.address),
    addressLink: text(data?.addressLink),
    email: text(data?.email),
    phone: text(data?.phone),
    socialLinks: (Array.isArray(data?.socialLinks) ? data.socialLinks : [])
      .map((link) => ({network: link?.network, url: text(link?.url)}))
      .filter((link) => link.url && typeof link.network == "string" && Object.hasOwn(SOCIAL_NETWORK_NAMES, link.network)) as {network: SocialNetwork, url: string}[],
    mapEmbedUrl: getMapEmbedUrl(data?.mapEmbedUrl),
    copyright: text(data?.copyright),
  };

  if (settings.mapEmbedUrl && !settings.mapEmbedUrl.startsWith(MAP_EMBED_URL_PREFIX))
    throw new ServerActionError("Карта має бути посиланням Google Maps для вбудовування");

  await SiteSettings.updateOne({key: SITE_SETTINGS_KEY}, {$set: settings}, {upsert: true});
}, {revalidatePublicPages: true});
