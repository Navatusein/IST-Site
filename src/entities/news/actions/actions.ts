"use server"

import {INews} from "../types/type";
import NewsModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {isPublicPath} from "@/shared/utilities/public-input";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {isValueAvailable, paginate} from "@/shared/services/pagination-service/pagination-service";
import {requirePermission} from "@/auth";

const NEWS_SEARCH_FIELDS = ["title", "description", "path"];

export const getNewsAction = createServerAction<INews[]>(async () => {
  return toPlainObject<INews[]>(await NewsModel.find<INews>({}).sort({date: "desc"}));
});

export const getNewsPaginationAction = createServerAction<INews[]>(async (offset: number, limit: number) => {
  return toPlainObject<INews[]>(await NewsModel
    .find<INews>({})
    .sort({date: "desc", createdAt: "desc"})
    .skip(offset)
    .limit(limit)
  );
});

export const getNewsCountAction = createServerAction<number>(async () => {
  return toPlainObject<number>(await NewsModel.find<INews>({}).countDocuments());
});

const loadNewsByPath = cachePublicData("getNewsByPathAction", async (path: string) => {
  const data = await NewsModel.findOne<INews>({path});

  if (!data)
    return null;

  return toPlainObject<INews>(data);
});

export const getNewsByPathAction = createServerAction<INews | null>(async (path: unknown) => (
  isPublicPath(path) ? loadNewsByPath(path) : null
));

export const addNewsAction = createServerAction<void>(async (data: INews) => {
  await requirePermission("edit-news");
  await NewsModel.create(data);
}, {revalidatePublicPages: true});

export const updateNewsAction = createServerAction<void>(async (data: INews) => {
  await requirePermission("edit-news");
  const {_id, ...updateData} = data;
  await NewsModel.findByIdAndUpdate(_id, {$set: updateData});
}, {revalidatePublicPages: true});

export const removeNewsAction = createServerAction<void>(async (data: INews[]) => {
  await requirePermission("edit-news");
  await NewsModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
}, {revalidatePublicPages: true});

export const getNewsPageAction = createServerAction<IPageResult<INews>>(async (query: IPageQuery) => {
  await requirePermission("edit-news");

  return paginate<INews>(NewsModel, query, {
    sortFields: {title: "title", description: "description", path: "path", date: "date", createdAt: "createdAt", updatedAt: "updatedAt"},
    defaultSort: {date: -1, createdAt: -1},
    searchFields: NEWS_SEARCH_FIELDS
  });
});

export const isNewsPathAvailableAction = createServerAction<boolean>(async (path: string, excludeId?: string) => {
  await requirePermission("edit-news");
  return isValueAvailable(NewsModel, "path", path, excludeId);
});

export const exportNewsAction = createServerAction<IExportFile<INews>>(async (params: IExportParams) => {
  await requirePermission("edit-news");

  return exportRecords<INews>(NewsModel, "news", params, {
    searchFields: NEWS_SEARCH_FIELDS,
  });
});

export const importNewsAction = createServerAction<IImportReport>(async (file: unknown, apply: boolean) => {
  await requirePermission("edit-news");

  return importRecords(NewsModel, "news", file, {
    apply: apply == true,
    matchFields: ["path"],
    getName: (item) => String(item.title ?? "")
  });
}, {revalidatePublicPages: true});
