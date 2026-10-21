"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {createWithRevision, updateWithRevision} from "@/shared/services/revision-service/revision-service";
import {moveToTrash} from "@/shared/services/trash-service/trash-service";
import {findRecordById} from "@/shared/utilities/find-record-by-id";
import {cachePublicData, cachePublicRecord} from "@/shared/utilities/cache-public-data";
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
  return toPlainObject<IDepartmentStaff[]>(await DepartmentStaff.find<IDepartmentStaff>({}).sort({lastName: 1, firstName: 1}).collation({locale: "uk"}));
}));

const loadDepartmentStaffByPath = cachePublicRecord("getDepartmentStaffByPathAction", async (path: string) => {
  const data = await DepartmentStaff.findOne<IDepartmentStaff>({path});

  if (!data)
    return null;

  return toPlainObject<IDepartmentStaff>(data);
});

export const getDepartmentStaffByPathAction = createServerAction<IDepartmentStaff | null>(async (path: unknown) => (
  isPublicPath(path) ? loadDepartmentStaffByPath(path) : null
));

export const addDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff) => {
  const user = await requirePermission("edit-department-staff");
  await createWithRevision(DepartmentStaff, "department-staff", data, user);
}, {revalidatePublicPages: true});

export const updateDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff) => {
  const user = await requirePermission("edit-department-staff");
  const {_id, ...updateData} = data;
  await updateWithRevision(DepartmentStaff, "department-staff", _id, updateData, user);
}, {revalidatePublicPages: true});

export const removeDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff[]) => {
  const user = await requirePermission("edit-department-staff");
  await moveToTrash(DepartmentStaff, "department-staff", data.map((value) => value._id), user);
}, {revalidatePublicPages: true});

export const getDepartmentStaffByIdAction = createServerAction<IDepartmentStaff | null>(async (id: string) => {
  await requirePermission("edit-department-staff");
  return findRecordById<IDepartmentStaff>(DepartmentStaff, id);
});

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
  const user = await requirePermission("edit-department-staff");

  return importRecords(DepartmentStaff, "department-staff", file, {
    apply: apply == true,
    revision: {collection: "department-staff", author: user},
    matchFields: ["path"],
    getName: (item) => `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim()
  });
}, {revalidatePublicPages: true});
