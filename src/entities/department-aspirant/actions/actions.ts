"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";

import toPlainObject from "@/shared/utilities/to-plain-object";
import DepartmentAspirant from "../types/schema";
import {IDepartmentAspirant} from "../types/type";

export const getDepartmentAspirantAction = createServerAction<IDepartmentAspirant[]>(async () => {
  return toPlainObject<IDepartmentAspirant[]>(await DepartmentAspirant.find<IDepartmentAspirant>({}).sort({date: "desc"}));
});

export const addDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant) => {
  await DepartmentAspirant.create(data);
});

export const updateDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant) => {
  const {_id, ...updateData} = data;
  await DepartmentAspirant.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeDepartmentAspirantAction = createServerAction<void>(async (data: IDepartmentAspirant[]) => {
  await DepartmentAspirant.deleteMany({_id: {$in: data.map((value) => value._id)}});
});