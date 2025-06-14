"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";

import toPlainObject from "@/shared/utilities/to-plain-object";
import TeacherModel from "../types/schema";
import {ITeacher} from "../types/type";

export const getTeachersAction = createServerAction<ITeacher[]>(async () => {
  return toPlainObject<ITeacher[]>(await TeacherModel.find<ITeacher>({}).sort({ date: 'desc' }));
});

export const getTeacherByPathAction = createServerAction<ITeacher | null>(async (path: string) => {
  const data = await TeacherModel.findOne<ITeacher>({ path });

  if (!data)
    return null;

  return toPlainObject<ITeacher>(data);
});

export const addTeacherAction = createServerAction<void>(async (data: ITeacher) => {
  await TeacherModel.create<ITeacher>(data);
});

export const updateTeacherAction = createServerAction<void>(async (data: ITeacher) => {
  const {_id, ...updateData} = data;
  await TeacherModel.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeTeacherAction = createServerAction<void>(async (data: ITeacher[]) => {
  await TeacherModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
});