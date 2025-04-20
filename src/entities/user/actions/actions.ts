"use server"

import {IUser} from "../types/type";
import UserModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";

export async function getUsersAction(): Promise<IUser[]> {
  return toPlainObject<IUser[]>(await UserModel.find<IUser>({}));
}

export async function getUserByIdAction(id: string): Promise<IUser|null> {
  const data = await UserModel.findOne<IUser>({_id: id});

  if (!data)
    return null

  return toPlainObject<IUser>(data);
}

export async function addUserAction(data: IUser): Promise<void> {
  await UserModel.create<IUser>(data);
}

export async function updateUserAction(data: IUser): Promise<void> {
  const {_id, ...updateData} = data;

  await UserModel.findByIdAndUpdate(_id, {$set: updateData});
}

export async function removeUsersAction(data: IUser[]): Promise<void> {
  await UserModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
}

export async function updateUserPasswordAction(id: string, password: string): Promise<void> {
  const data = await UserModel.findOne<IUser>({_id: id});

  if (!data)
    throw new Error("Invalid user Id");

  await (data as any).setPassword(password);
  await data.save();
}
