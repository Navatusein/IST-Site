import {Document} from "mongoose";

export type UserPermissionType =
  "edit-news" |
  "edit-dynamic-pages" |
  "edit-public-menu" |
  "edit-users" |
  "edit-files" |
  "edit-department-staff" |
  "edit-department-aspirants";

export interface IUser extends Document {
  login: string,
  passwordHash: string,
  name: string,
  permissions: UserPermissionType[];
}

export interface IUserMethods {
  setPassword(password: string): Promise<void>;
}