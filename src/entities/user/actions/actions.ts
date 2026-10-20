"use server"

import {ICurrentUser, IUser} from "../types/type";
import UserModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {IExportFile, IExportParams, IImportReport} from "@/shared/types/import-export";
import {exportRecords, importRecords} from "@/shared/services/import-export-service/import-export-service";
import {IPageQuery, IPageResult} from "@/shared/types/page-query";
import {isValueAvailable, paginate} from "@/shared/services/pagination-service/pagination-service";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {getCurrentSession, getCurrentUser, invalidateUserSessions, requirePermission} from "@/auth";

export const getCurrentUserAction = createServerAction<ICurrentUser | null>(async () => {
  return toPlainObject(await getCurrentUser());
});

const USER_SEARCH_FIELDS = ["login", "name"];

const hidePasswordHash = (user: IUser): IUser => {
  return {...user, passwordHash: user.passwordHash ? "" : undefined} as IUser;
}

export const getUsersAction = createServerAction<IUser[]>(async () => {
  await requirePermission("edit-users");
  return toPlainObject<IUser[]>(await UserModel.find<IUser>({})).map(hidePasswordHash);
});

export const getUserByIdAction = createServerAction<IUser | null>(async (id: string) => {
  const currentUser = await requirePermission();

  if (currentUser.id !== String(id) && !currentUser.permissions.includes("edit-users"))
    throw new ServerActionError("Недостатньо прав");

  const data = await UserModel.findOne<IUser>({_id: id});

  if (!data)
    return null;

  return hidePasswordHash(toPlainObject<IUser>(data));
});

export const addUserAction = createServerAction<void>(async (data: IUser) => {
  await requirePermission("edit-users");

  const {passwordHash, ...userData} = data as IUser & {passwordHash?: string};
  await UserModel.create(userData);
});

export const updateUserAction = createServerAction<void>(async (data: IUser) => {
  await requirePermission("edit-users");
  const {_id, passwordHash, ...updateData} = data as IUser & {passwordHash?: string};
  await UserModel.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeUsersAction = createServerAction<void>(async (data: IUser[]) => {
  await requirePermission("edit-users");

  const userIds = data.map((value) => String(value._id));

  await UserModel.deleteMany({_id: {$in: userIds}});
  await invalidateUserSessions(userIds);
});

export const updateUserPasswordAction = createServerAction<void>(async (id: string, password: string) => {
  await requirePermission("edit-users");
  const data = await UserModel.findOne<IUser>({_id: id});

  if (!data)
    throw new Error("Invalid user Id");

  await (data as any).setPassword(password);
  await data.save();

  await invalidateUserSessions([String(id)], (await getCurrentSession())?.sessionId);
});

export const getUsersPageAction = createServerAction<IPageResult<IUser>>(async (query: IPageQuery) => {
  await requirePermission("edit-users");

  return paginate<IUser>(UserModel, query, {
    sortFields: {login: "login", name: "name", createdAt: "createdAt", updatedAt: "updatedAt"},
    defaultSort: {login: 1},
    searchFields: USER_SEARCH_FIELDS,
    transform: hidePasswordHash
  });
});

export const exportUsersAction = createServerAction<IExportFile<IUser>>(async (params: IExportParams) => {
  await requirePermission("edit-users");

  return exportRecords<IUser>(UserModel, "users", params, {
    searchFields: USER_SEARCH_FIELDS,
    excludeFields: ["passwordHash"]
  });
});

export const importUsersAction = createServerAction<IImportReport>(async (file: unknown, apply: boolean) => {
  await requirePermission("edit-users");

  return importRecords(UserModel, "users", file, {
    apply: apply == true,
    matchFields: ["login"],
    ignoreFields: ["passwordHash"],
    getWarnings: ({created}) => created != 0 ?
      [`Нові користувачі (${created}) створюються без пароля: задайте його кнопкою «Змінити пароль»`] : [],
    getName: (item) => String(item.login ?? "")
  });
});
