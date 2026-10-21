"use server"

import {IDynamicPage} from "../types/type";
import DynamicPageModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {createWithRevision, updateWithRevision} from "@/shared/services/revision-service/revision-service";
import {moveToTrash} from "@/shared/services/trash-service/trash-service";
import {findRecordById} from "@/shared/utilities/find-record-by-id";
import {cachePublicRecord} from "@/shared/utilities/cache-public-data";
import {isPublicPath} from "@/shared/utilities/public-input";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {isValueAvailable, paginate} from "@/shared/services/pagination-service/pagination-service";
import {requirePermission} from "@/auth";

const DYNAMIC_PAGE_SEARCH_FIELDS = ["name", "title", "description", "path"];

export const getDynamicPagesAction = createServerAction<IDynamicPage[]>(async () => {
  await requirePermission("edit-dynamic-pages");
  return toPlainObject<IDynamicPage[]>(await DynamicPageModel.find<IDynamicPage>({}));
});

const loadDynamicPageByPath = cachePublicRecord("getDynamicPageByPathAction", async (path: string) => {
  const data = await DynamicPageModel.findOne<IDynamicPage>({path});

  if (!data)
    return null;

  return toPlainObject<IDynamicPage>(data);
});

export const getDynamicPageByPathAction = createServerAction<IDynamicPage | null>(async (path: unknown) => (
  isPublicPath(path) ? loadDynamicPageByPath(path) : null
));

export const addDynamicPageAction = createServerAction<void>(async (data: IDynamicPage) => {
  const user = await requirePermission("edit-dynamic-pages");
  await createWithRevision(DynamicPageModel, "dynamic-pages", data, user);
}, {revalidatePublicPages: true});

export const updateDynamicPageAction = createServerAction<void>(async (data: IDynamicPage) => {
  const user = await requirePermission("edit-dynamic-pages");
  const {_id, ...updateData} = data;
  await updateWithRevision(DynamicPageModel, "dynamic-pages", _id, updateData, user);
}, {revalidatePublicPages: true});

export const removeDynamicPagesAction = createServerAction<void>(async (data: IDynamicPage[]) => {
  const user = await requirePermission("edit-dynamic-pages");
  await moveToTrash(DynamicPageModel, "dynamic-pages", data.map((value) => value._id), user);
}, {revalidatePublicPages: true});

export const getDynamicPageByIdAction = createServerAction<IDynamicPage | null>(async (id: string) => {
  await requirePermission("edit-dynamic-pages");
  return findRecordById<IDynamicPage>(DynamicPageModel, id);
});

export const getDynamicPagesPageAction = createServerAction<IPageResult<IDynamicPage>>(async (query: IPageQuery) => {
  await requirePermission("edit-dynamic-pages");

  return paginate<IDynamicPage>(DynamicPageModel, query, {
    sortFields: {name: "name", title: "title", path: "path", createdAt: "createdAt", updatedAt: "updatedAt"},
    defaultSort: {name: 1},
    searchFields: DYNAMIC_PAGE_SEARCH_FIELDS
  });
});

export const isDynamicPagePathAvailableAction = createServerAction<boolean>(async (path: string, excludeId?: string) => {
  await requirePermission("edit-dynamic-pages");
  return isValueAvailable(DynamicPageModel, "path", path, excludeId);
});

export const exportDynamicPagesAction = createServerAction<IExportFile<IDynamicPage>>(async (params: IExportParams) => {
  await requirePermission("edit-dynamic-pages");

  return exportRecords<IDynamicPage>(DynamicPageModel, "dynamic-pages", params, {
    searchFields: DYNAMIC_PAGE_SEARCH_FIELDS,
  });
});

export const importDynamicPagesAction = createServerAction<IImportReport>(async (file: unknown, apply: boolean) => {
  const user = await requirePermission("edit-dynamic-pages");

  return importRecords(DynamicPageModel, "dynamic-pages", file, {
    apply: apply == true,
    revision: {collection: "dynamic-pages", author: user},
    matchFields: ["path"],
    getName: (item) => String(item.name ?? "")
  });
}, {revalidatePublicPages: true});
