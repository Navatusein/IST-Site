"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {cachePublicData} from "@/shared/utilities/cache-public-data";
import {isPublicPath} from "@/shared/utilities/public-input";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {isValueAvailable, paginate} from "@/shared/services/pagination-service/pagination-service";
import {requirePermission} from "@/auth";

import toPlainObject from "@/shared/utilities/to-plain-object";
import DepartmentStaff from "../types/schema";
import {IDepartmentStaff} from "../types/type";

const DEPARTMENT_STAFF_SEARCH_FIELDS = ["lastName", "firstName", "middleName", "position", "email", "path"];

export const getDepartmentStaffAction = createServerAction<IDepartmentStaff[]>(cachePublicData("getDepartmentStaffAction", async () => {
  return toPlainObject<IDepartmentStaff[]>(await DepartmentStaff.find<IDepartmentStaff>({}).sort({date: "desc"}));
}));

const loadDepartmentStaffByPath = cachePublicData("getDepartmentStaffByPathAction", async (path: string) => {
  const data = await DepartmentStaff.findOne<IDepartmentStaff>({path});

  if (!data)
    return null;

  return toPlainObject<IDepartmentStaff>(data);
});

export const getDepartmentStaffByPathAction = createServerAction<IDepartmentStaff | null>(async (path: unknown) => (
  isPublicPath(path) ? loadDepartmentStaffByPath(path) : null
));

export const addDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff) => {
  await requirePermission("edit-department-staff");
  await DepartmentStaff.create(data);
}, {revalidatePublicPages: true});

export const updateDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff) => {
  await requirePermission("edit-department-staff");
  const {_id, ...updateData} = data;
  await DepartmentStaff.findByIdAndUpdate(_id, {$set: updateData});
}, {revalidatePublicPages: true});

export const removeDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff[]) => {
  await requirePermission("edit-department-staff");
  await DepartmentStaff.deleteMany({_id: {$in: data.map((value) => value._id)}});
}, {revalidatePublicPages: true});

export const getDepartmentStaffPageAction = createServerAction<IPageResult<IDepartmentStaff>>(async (query: IPageQuery) => {
  await requirePermission("edit-department-staff");

  return paginate<IDepartmentStaff>(DepartmentStaff, query, {
    sortFields: {
      lastName: "lastName", firstName: "firstName", middleName: "middleName", position: "position",
      email: "email", path: "path", createdAt: "createdAt", updatedAt: "updatedAt"
    },
    defaultSort: {lastName: 1, firstName: 1},
    searchFields: DEPARTMENT_STAFF_SEARCH_FIELDS
  });
});

export const isDepartmentStaffPathAvailableAction = createServerAction<boolean>(async (path: string, excludeId?: string) => {
  await requirePermission("edit-department-staff");
  return isValueAvailable(DepartmentStaff, "path", path, excludeId);
});

export const exportDepartmentStaffAction = createServerAction<IExportFile<IDepartmentStaff>>(async (params: IExportParams) => {
  await requirePermission("edit-department-staff");

  return exportRecords<IDepartmentStaff>(DepartmentStaff, "department-staff", params, {
    searchFields: DEPARTMENT_STAFF_SEARCH_FIELDS,
  });
});

export const importDepartmentStaffAction = createServerAction<IImportReport>(async (file: unknown, apply: boolean) => {
  await requirePermission("edit-department-staff");

  return importRecords(DepartmentStaff, "department-staff", file, {
    apply: apply == true,
    matchFields: ["path"],
    getName: (item) => `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim()
  });
}, {revalidatePublicPages: true});
