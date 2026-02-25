"use server"

import {IUser} from "../types/type";
import UserModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const getUsersAction = createServerAction<IUser[]>(async () => {
  return toPlainObject<IUser[]>(await UserModel.find<IUser>({}));
});

export const getUserByIdAction = createServerAction<IUser | null>(async (id: string) => {
  const data = await UserModel.findOne<IUser>({_id: id});

  if (!data)
    return null;

  return toPlainObject<IUser>(data);
});

export const addUserAction = createServerAction<void>(async (data: IUser) => {
  await UserModel.create(data);
});

export const updateUserAction = createServerAction<void>(async (data: IUser) => {
  const {_id, ...updateData} = data;
  await UserModel.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeUsersAction = createServerAction<void>(async (data: IUser[]) => {
  await UserModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
});

export const updateUserPasswordAction = createServerAction<void>(async (id: string, password: string) => {
  const data = await UserModel.findOne<IUser>({_id: id});

  if (!data)
    throw new Error("Invalid user Id");

  await (data as any).setPassword(password);
  await data.save();
});
