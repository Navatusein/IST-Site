import {Document} from "mongoose";
import type {UserPermissionType} from "@/shared/configs/permissions-config";

export type {UserPermissionType};

export interface IUser extends Document {
  login: string,
  passwordHash: string,
  name: string,
  permissions: UserPermissionType[];
}

export interface IUserMethods {
  setPassword(password: string): Promise<void>;
}

export interface ICurrentUser {
  id: string;
  login: string;
  name: string;
  permissions: UserPermissionType[];
}
