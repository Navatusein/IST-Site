import {Document} from "mongoose";

export type UserPermissionType = "edit-news" | "edit-pages" | "edit-users" | "edit-files";

export interface IUser extends Document {
  login: string,
  passwordHash: string,
  name: string,
  permissions: UserPermissionType[];
}

export interface IUserMethods {
  setPassword(password: string): Promise<void>;
}