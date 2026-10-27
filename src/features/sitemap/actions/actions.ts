"use server"

import {DynamicPageModel} from "@/entities/dynamic-page";
import {NewsModel} from "@/entities/news";
import {DepartmentStaff} from "@/entities/department-staff";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {ISitemapEntry} from "../types/type";
import {getRecordPublicPath} from "@/shared/utilities/public-paths";
import type {RevisionCollection} from "@/shared/types/revision";

interface IPathDocument {
  path: string;
  updatedAt?: Date;
}

const toEntries = (documents: IPathDocument[], collection: RevisionCollection): ISitemapEntry[] => documents.map((document) => ({
  path: getRecordPublicPath(collection, document.path)!,
  updatedAt: document.updatedAt?.toISOString()
}));

export const getSitemapEntriesAction = createServerAction<ISitemapEntry[]>(cachePublicData("getSitemapEntriesAction", async () => {
  const [pages, news, staff] = await Promise.all([
    DynamicPageModel.find({}, {path: 1, updatedAt: 1}).lean<IPathDocument[]>(),
    NewsModel.find({}, {path: 1, updatedAt: 1}).lean<IPathDocument[]>(),
    DepartmentStaff.find({}, {path: 1, updatedAt: 1}).lean<IPathDocument[]>()
  ]);

  return [...toEntries(pages, "dynamic-pages"), ...toEntries(news, "news"), ...toEntries(staff, "department-staff")];
}));
