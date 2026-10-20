"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {isValueAvailable, paginate} from "@/shared/services/pagination-service/pagination-service";
import {requirePermission} from "@/auth";

import toPlainObject from "@/shared/utilities/to-plain-object";
import DepartmentAspirant from "../types/schema";
import {IDepartmentAspirant} from "../types/type";

const DEPARTMENT_ASPIRANT_SEARCH_FIELDS = ["lastName", "firstName", "middleName", "thesisTheme"];

export const getDepartmentAspirantAction = createServerAction<IDepartmentAspirant[]>(async () => {
  return toPlainObject<IDepartmentAspirant[]>(await DepartmentAspirant.find<IDepartmentAspirant>({}).sort({date: "desc"}));
});

export const addDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant) => {
  await requirePermission("edit-department-aspirants");
  await DepartmentAspirant.create(data);
}, {revalidatePublicPages: true});

export const updateDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant) => {
  await requirePermission("edit-department-aspirants");
  const {_id, ...updateData} = data;
  await DepartmentAspirant.findByIdAndUpdate(_id, {$set: updateData});
}, {revalidatePublicPages: true});

export const removeDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant[]) => {
  await requirePermission("edit-department-aspirants");
  await DepartmentAspirant.deleteMany({_id: {$in: data.map((value) => value._id)}});
}, {revalidatePublicPages: true});

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
  await requirePermission("edit-department-aspirants");

  return importRecords(DepartmentAspirant, "department-aspirants", file, {
    apply: apply == true,
    matchFields: [],
    getName: (item) => `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim()
  });
}, {revalidatePublicPages: true});
