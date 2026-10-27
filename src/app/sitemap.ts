import {MetadataRoute} from "next";
import {getSitemapEntriesAction} from "@/features/sitemap";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {isIndexingAllowed} from "@/shared/configs/indexing";
import {getPublicOrigin} from "@/shared/utilities/public-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingAllowed())
    return [];

  const origin = getPublicOrigin();
  const entries = await unwrapServerAction(getSitemapEntriesAction());

  return entries.map((entry) => ({
    url: origin + entry.path,
    lastModified: entry.updatedAt
  }));
}
