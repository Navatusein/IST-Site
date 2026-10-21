import {Model} from "mongoose";
import {DynamicPageModel} from "@/entities/dynamic-page";
import {NewsModel} from "@/entities/news";
import {DepartmentStaff} from "@/entities/department-staff";
import {DepartmentStaff as DepartmentAspirantModel} from "@/entities/department-aspirant";
import {PublicMenuItemModal} from "@/entities/public-menu-item";
import {UserPermissionType} from "@/entities/user/types/type";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {RevisionCollection} from "@/shared/types/revision";
import {requirePermission} from "@/auth";

export const COLLECTIONS: Record<RevisionCollection, {model: Model<any>, permission: UserPermissionType}> = {
  "dynamic-pages": {model: DynamicPageModel, permission: "edit-dynamic-pages"},
  "news": {model: NewsModel, permission: "edit-news"},
  "department-staff": {model: DepartmentStaff, permission: "edit-department-staff"},
  "department-aspirants": {model: DepartmentAspirantModel, permission: "edit-department-aspirants"},
  "public-menu": {model: PublicMenuItemModal, permission: "edit-public-menu"},
};

export async function requireCollection(collection: unknown) {
  const config = typeof collection == "string" ? COLLECTIONS[collection as RevisionCollection] : undefined;

  if (!config)
    throw new ServerActionError("Невідома таблиця");

  const user = await requirePermission(config.permission);

  return {...config, user, collection: collection as RevisionCollection};
}

export async function requireAllowedCollections() {
  const user = await requirePermission();
  const collections = (Object.keys(COLLECTIONS) as RevisionCollection[])
    .filter((collection) => user.permissions.includes(COLLECTIONS[collection].permission));

  return {user, collections};
}
