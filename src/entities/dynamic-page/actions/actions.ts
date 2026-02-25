"use server"

import {IDynamicPage} from "../types/type";
import DynamicPageModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const getDynamicPagesAction = createServerAction<IDynamicPage[]>(async () => {
  return toPlainObject<IDynamicPage[]>(await DynamicPageModel.find<IDynamicPage>({}));
});

export const getDynamicPageByPathAction = createServerAction<IDynamicPage | null>(async (path: string) => {
  const data = await DynamicPageModel.findOne<IDynamicPage>({path});

  if (!data)
    return null;

  return toPlainObject<IDynamicPage>(data);
});

export const addDynamicPageAction = createServerAction<void>(async (data: IDynamicPage) => {
  await DynamicPageModel.create(data);
});

export const updateDynamicPageAction = createServerAction<void>(async (data: IDynamicPage) => {
  const {_id, ...updateData} = data;
  await DynamicPageModel.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeDynamicPagesAction = createServerAction<void>(async (data: IDynamicPage[]) => {
  await DynamicPageModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
});