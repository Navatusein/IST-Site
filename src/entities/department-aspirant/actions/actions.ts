"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {createWithRevision, updateWithRevision} from "@/shared/services/revision-service/revision-service";
import {moveToTrash} from "@/shared/services/trash-service/trash-service";
import {findRecordById} from "@/shared/utilities/find-record-by-id";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {isValueAvailable, paginate} from "@/shared/services/pagination-service/pagination-service";
import {getNextOrder, saveOrder} from "@/shared/services/record-order-service/record-order-service";
import {IRecordOrderGroup} from "@/shared/types/record-order";
import {requirePermission} from "@/auth";

import toPlainObject from "@/shared/utilities/to-plain-object";
import DepartmentAspirant from "../types/schema";
import {IDepartmentAspirant} from "../types/type";

const DEPARTMENT_ASPIRANT_SEARCH_FIELDS = ["lastName", "firstName", "middleName", "thesisTheme"];

export const getDepartmentAspirantAction = createServerAction<IDepartmentAspirant[]>(async () => {
  return toPlainObject<IDepartmentAspirant[]>(await DepartmentAspirant.find<IDepartmentAspirant>({}).sort({order: 1, lastName: 1, firstName: 1}).collation({locale: "uk"}));
});

export const addDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant) => {
  const user = await requirePermission("edit-department-aspirants");
  await createWithRevision(DepartmentAspirant, "department-aspirants", {...data, order: await getNextOrder(DepartmentAspirant)}, user);
}, {revalidatePublicPages: true});

export const updateDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant) => {
  const user = await requirePermission("edit-department-aspirants");
  const {_id, ...updateData} = data;
  await updateWithRevision(DepartmentAspirant, "department-aspirants", _id, updateData, user);
}, {revalidatePublicPages: true});

export const removeDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant[]) => {
  const user = await requirePermission("edit-department-aspirants");
  await moveToTrash(DepartmentAspirant, "department-aspirants", data.map((value) => value._id), user);
}, {revalidatePublicPages: true});

export const getDepartmentAspirantOrderAction = createServerAction<IRecordOrderGroup[]>(async () => {
  await requirePermission("edit-department-aspirants");

  const aspirants = await DepartmentAspirant.find({}, {lastName: 1, firstName: 1, middleName: 1, thesisTheme: 1, thesisDate: 1})
    .sort({order: 1, lastName: 1, firstName: 1})
    .collation({locale: "uk"})
    .lean<IDepartmentAspirant[]>();

  const toItem = (value: IDepartmentAspirant) => ({
    id: String(value._id),
    title: `${value.lastName} ${value.firstName} ${value.middleName}`,
    description: value.thesisTheme
  });

  return [
    {key: "aspirants", title: "Аспіранти", items: aspirants.filter((x) => x.thesisDate == null).map(toItem)},
    {key: "graduates", title: "Випускники", items: aspirants.filter((x) => x.thesisDate != null).map(toItem)}
  ];
});

export const saveDepartmentAspirantOrderAction = createServerAction<void>(async (ids: unknown) => {
  await requirePermission("edit-department-aspirants");
  await saveOrder(DepartmentAspirant, ids);
}, {revalidatePublicPages: true});

export const getDepartmentAspirantByIdAction = createServerAction<IDepartmentAspirant | null>(async (id: string) => {
  await requirePermission("edit-department-aspirants");
  return findRecordById<IDepartmentAspirant>(DepartmentAspirant, id);
});

export const getDepartmentAspirantsPageAction = createServerAction<IPageResult<IDepartmentAspirant>>(async (query: IPageQuery) => {
  await requirePermission("edit-department-aspirants");

  return paginate<IDepartmentAspirant>(DepartmentAspirant, query, {
    sortFields: {
      lastName: "lastName", firstName: "firstName", middleName: "middleName", thesisTheme: "thesisTheme",
      thesisDate: "thesisDate", createdAt: "createdAt", updatedAt: "updatedAt"
    },
    defaultSort: {lastName: 1, firstName: 1},
    searchFields: DEPARTMENT_ASPIRANT_SEARCH_FIELDS
  });
});

export const exportDepartmentAspirantsAction = createServerAction<IExportFile<IDepartmentAspirant>>(async (params: IExportParams) => {
  await requirePermission("edit-department-aspirants");

  return exportRecords<IDepartmentAspirant>(DepartmentAspirant, "department-aspirants", params, {
    searchFields: DEPARTMENT_ASPIRANT_SEARCH_FIELDS,
  });
});

export const importDepartmentAspirantsAction = createServerAction<IImportReport>(async (file: unknown, apply: boolean) => {
  const user = await requirePermission("edit-department-aspirants");

  return importRecords(DepartmentAspirant, "department-aspirants", file, {
    apply: apply == true,
    revision: {collection: "department-aspirants", author: user},
    matchFields: [],
    getName: (item) => `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim()
  });
}, {revalidatePublicPages: true});
