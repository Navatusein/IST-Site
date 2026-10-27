"use server"

import {DynamicPageModel} from "@/entities/dynamic-page";
import {NewsModel} from "@/entities/news";
import {DepartmentStaff} from "@/entities/department-staff";
import {FileEntryModel} from "@/entities/file";
import {getFileNamedAssetUrl} from "@/shared/utilities/file-urls";
import {findFileSlugs} from "../utilities/find-file-slugs";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {ISitemapEntry} from "../types/type";
import {getRecordPublicPath} from "@/shared/utilities/public-paths";
import type {RevisionCollection} from "@/shared/types/revision";

interface IPathDocument {
  path: string;
  entities?: unknown;
  updatedAt?: Date;
}

interface IFileDocument {
  slug: string;
  name: string;
  updatedAt?: Date;
}

const toEntries = (documents: IPathDocument[], collection: RevisionCollection): ISitemapEntry[] => documents.map((document) => ({
  path: getRecordPublicPath(collection, document.path)!,
  updatedAt: document.updatedAt?.toISOString()
}));

export const getSitemapEntriesAction = createServerAction<ISitemapEntry[]>(cachePublicData("getSitemapEntriesAction", async () => {
  const [pages, news, staff] = await Promise.all([
    DynamicPageModel.find({}, {path: 1, entities: 1, updatedAt: 1}).lean<IPathDocument[]>(),
    NewsModel.find({}, {path: 1, entities: 1, updatedAt: 1}).lean<IPathDocument[]>(),
    DepartmentStaff.find({}, {path: 1, entities: 1, updatedAt: 1}).lean<IPathDocument[]>()
  ]);

  // Only documents the pages link to, not everything in the storage
  const slugs = findFileSlugs([pages, news, staff].flat().map((document) => document.entities));
  const files = slugs.size ?
    await FileEntryModel.find({slug: {$in: [...slugs]}, kind: "file"}, {slug: 1, name: 1, updatedAt: 1}).lean<IFileDocument[]>() :
    [];

  return [
    ...toEntries(pages, "dynamic-pages"),
    ...toEntries(news, "news"),
    ...toEntries(staff, "department-staff"),
    ...files.map((file) => ({path: getFileNamedAssetUrl(file.slug, file.name), updatedAt: file.updatedAt?.toISOString()}))
  ];
}));

