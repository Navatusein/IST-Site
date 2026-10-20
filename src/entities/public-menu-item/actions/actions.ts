"use server"

import {IPublicMenuItem} from "../types/type";
import PublicMenuItemModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {Types} from "mongoose";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {buildSearchFilter, buildSort, normalizePageQuery} from "@/shared/services/pagination-service/pagination-service";
import {requirePermission} from "@/auth";

const MENU_SEARCH_FIELDS = ["label", "path"];

export const getPublicMenuItemsAction = createServerAction<IPublicMenuItem[]>(async () => {
  return toPlainObject<IPublicMenuItem[]>(await PublicMenuItemModel.find<IPublicMenuItem>({}));
});

export const getPublicMenuItemsTreeAction = createServerAction<IPublicMenuItem[]>(cachePublicData("getPublicMenuItemsTreeAction", async () => {
  const items = toPlainObject<IPublicMenuItem[]>(await PublicMenuItemModel.find<IPublicMenuItem>({}));

  const lookup = new Map(items.map(item => [item._id, item]));

  const roots: IPublicMenuItem[] = [];

  for (const item of items) {
    const node = lookup.get(item._id)!;

    if (item.parent && lookup.has(item.parent)) {
      const object = lookup.get(item.parent)!;

      if (!object.children)
        object.children = [];

      object.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return toPlainObject<IPublicMenuItem[]>(roots);
}));

const ROOT_PARENT = "root";

const normalizeParent = (data: IPublicMenuItem) => {
  const {children, ...item} = data as IPublicMenuItem & {children?: unknown};
  const parent = String(item.parent ?? "");

  return {...item, parent: parent && parent != ROOT_PARENT ? parent : null};
}

export const addPublicMenuItemAction = createServerAction<void>(async (data: IPublicMenuItem) => {
  await requirePermission("edit-public-menu");
  await PublicMenuItemModel.create(normalizeParent(data));
}, {revalidatePublicPages: true});

export const updatePublicMenuItemAction = createServerAction<void>(async (data: IPublicMenuItem) => {
  await requirePermission("edit-public-menu");
  const {_id, ...updateData} = normalizeParent(data);
  await PublicMenuItemModel.findByIdAndUpdate(_id, {$set: updateData});
}, {revalidatePublicPages: true});

export const removePublicMenuItemsAction = createServerAction<void>(async (data: IPublicMenuItem[]) => {
  await requirePermission("edit-public-menu");
  await PublicMenuItemModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
}, {revalidatePublicPages: true});

const MENU_COLLECTION = "public-menu-items";

export const getPublicMenuTreePageAction = createServerAction<IPageResult<IPublicMenuItem>>(async (rawQuery: IPageQuery) => {
  await requirePermission("edit-public-menu");

  const query = normalizePageQuery(rawQuery);
  let rootsFilter: Record<string, unknown> = {};

  if (query.search) {
    const matches = await PublicMenuItemModel.aggregate([
      {$match: buildSearchFilter(query.search, MENU_SEARCH_FIELDS)},
      {$graphLookup: {from: MENU_COLLECTION, startWith: "$parent", connectFromField: "parent", connectToField: "_id", as: "ancestors"}},
      {$project: {_id: 1, parent: 1, "ancestors._id": 1, "ancestors.parent": 1}}
    ]);

    const rootIds = new Set<string>();

    for (const match of matches) {
      const chain = [match, ...match.ancestors];
      const chainIds = new Set(chain.map((item) => String(item._id)));
      const root = chain.find((item) => !item.parent || !chainIds.has(String(item.parent)));

      if (root)
        rootIds.add(String(root._id));
    }

    rootsFilter = {_id: {$in: [...rootIds].map((id) => new Types.ObjectId(id))}};
  }

  const rootsPipeline = [
    {$match: rootsFilter},
    {$lookup: {
      from: MENU_COLLECTION,
      let: {parentId: "$parent"},
      pipeline: [
        {$match: {$expr: {$eq: [{$toString: "$_id"}, {$toString: "$$parentId"}]}}},
        {$project: {_id: 1}}
      ],
      as: "parentItem"
    }},
    {$match: {parentItem: {$size: 0}}},
  ];

  const [{total} = {total: 0}] = await PublicMenuItemModel.aggregate([...rootsPipeline, {$count: "total"}]);
  const page = Math.min(query.page, Math.max(1, Math.ceil(total / query.pageSize)));

  const sort = buildSort(query, {label: "label", path: "path", index: "index", createdAt: "createdAt", updatedAt: "updatedAt"}, {index: 1});

  const roots = await PublicMenuItemModel
    .aggregate([
      ...rootsPipeline,
      {$sort: sort},
      {$skip: (page - 1) * query.pageSize},
      {$limit: query.pageSize},
      {$graphLookup: {from: MENU_COLLECTION, startWith: "$_id", connectFromField: "_id", connectToField: "parent", as: "descendants"}},
      {$project: {parentItem: 0}}
    ])
    .collation({locale: "uk"});

  const items = toPlainObject<(IPublicMenuItem & {descendants: IPublicMenuItem[]})[]>(roots).map(({descendants, ...root}) => {
    const nodes = new Map<string, IPublicMenuItem>([[String(root._id), root as IPublicMenuItem], ...descendants.map((item) => [String(item._id), item] as const)]);

    for (const item of descendants) {
      const parent = nodes.get(String(item.parent));

      if (parent)
        (parent.children ??= []).push(item);
    }

    for (const node of nodes.values())
      node.children?.sort((a, b) => a.index - b.index);

    return {...root, parent: ROOT_PARENT} as unknown as IPublicMenuItem;
  });

  return {items, total, page, pageSize: query.pageSize};
});

export const exportPublicMenuAction = createServerAction<IExportFile<IPublicMenuItem>>(async (params: IExportParams) => {
  await requirePermission("edit-public-menu");

  return exportRecords<IPublicMenuItem>(PublicMenuItemModel, "public-menu", params, {
    searchFields: MENU_SEARCH_FIELDS,
  });
});

export const importPublicMenuAction = createServerAction<IImportReport>(async (file: unknown, apply: boolean) => {
  await requirePermission("edit-public-menu");

  return importRecords(PublicMenuItemModel, "public-menu", file, {
    apply: apply == true,
    matchFields: [],
    ignoreFields: ["children"],
    getName: (item) => String(item.label ?? "")
  });
}, {revalidatePublicPages: true});
