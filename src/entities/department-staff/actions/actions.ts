"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";

import toPlainObject from "@/shared/utilities/to-plain-object";
import DepartmentStaff from "../types/schema";
import {IDepartmentStaff} from "../types/type";

export const getDepartmentStaffAction = createServerAction<IDepartmentStaff[]>(async () => {
  return toPlainObject<IDepartmentStaff[]>(await DepartmentStaff.find<IDepartmentStaff>({}).sort({date: "desc"}));
});

export const getDepartmentStaffByPathAction = createServerAction<IDepartmentStaff | null>(async (path: string) => {
  const data = await DepartmentStaff.findOne<IDepartmentStaff>({path});

  if (!data)
    return null;

  return toPlainObject<IDepartmentStaff>(data);
});

export const addDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff) => {
  await DepartmentStaff.create(data);
});

export const updateDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff) => {
  const {_id, ...updateData} = data;
  await DepartmentStaff.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeDepartmentStaffAction = createServerAction<void>(async (data: IDepartmentStaff[]) => {
  await DepartmentStaff.deleteMany({_id: {$in: data.map((value) => value._id)}});
});