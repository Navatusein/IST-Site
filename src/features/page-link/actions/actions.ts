"use server"

import type {IFileEntry} from "@/entities/file";
import {FileManagerService} from "@/entities/file/services/file-manager-service";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {PageLinkFiles} from "../types/type";

const FILE_SLUG_PATTERN = /^[a-z0-9]{10}$/;
const MAX_FILE_SLUGS = 100;

class FileNotFoundError extends Error {
  name = "FileNotFoundError";
}

const loadPageLinkFile = cachePublicData("getPageLinkFilesAction", async (slug: string): Promise<IFileEntry> => {
  const [entry] = await FileManagerService.getEntries([slug]);

  if (!entry || entry.kind != "file")
    throw new FileNotFoundError(slug);

  return entry;
});

export const getPageLinkFilesAction = createServerAction<PageLinkFiles>(async (fileSlugs: unknown) => {
  const slugs = Array.isArray(fileSlugs) ?
    [...new Set(fileSlugs.filter((slug): slug is string => typeof slug == "string" && FILE_SLUG_PATTERN.test(slug)))].sort().slice(0, MAX_FILE_SLUGS) :
    [];

  const entries = await Promise.all(slugs.map((slug) => loadPageLinkFile(slug).catch((error) => {
    if (error instanceof Error && error.name == "FileNotFoundError")
      return null;

    throw error;
  })));

  return Object.fromEntries(entries.filter((entry) => entry != null).map((entry) => [entry.slug, entry]));
});
