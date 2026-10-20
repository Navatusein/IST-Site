"use server"

import {FileManagerService} from "@/entities/file/services/file-manager-service";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {PageLinkFiles} from "../types/type";

const loadPageLinkFiles = cachePublicData("getPageLinkFilesAction", async (fileSlugs: string[]) => {
  const slugs = Array.isArray(fileSlugs) ? fileSlugs.filter((slug) => typeof slug == "string").slice(0, 200) : [];
  const entries = await FileManagerService.getEntries(slugs);

  return Object.fromEntries(entries.filter((entry) => entry.kind == "file").map((entry) => [entry.slug, entry]));
});

export const getPageLinkFilesAction = createServerAction<PageLinkFiles>(async (fileSlugs: unknown) => {
  const slugs = Array.isArray(fileSlugs) ?
    [...new Set(fileSlugs.filter((slug): slug is string => typeof slug == "string" && /^[A-Za-z0-9_-]{1,64}$/.test(slug)))].sort().slice(0, 200) :
    [];

  return slugs.length != 0 ? loadPageLinkFiles(slugs) : {};
});
