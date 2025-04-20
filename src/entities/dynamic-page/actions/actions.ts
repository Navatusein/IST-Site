"use server"

import {IDynamicPage} from "../types/type";
import DynamicPageModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";


export async function getDynamicPagesAction(): Promise<IDynamicPage[]> {
  return toPlainObject<IDynamicPage[]>(await DynamicPageModel.find<IDynamicPage>({}));
}

export async function getDynamicPageByPathAction(path: string): Promise<IDynamicPage|null> {
  const data = await DynamicPageModel.findOne<IDynamicPage>({path: path});

  if (!data)
    return null

  return toPlainObject<IDynamicPage>(data);
}

export async function addDynamicPageAction(data: IDynamicPage): Promise<void> {
  await DynamicPageModel.create<IDynamicPage>(data);
}

export async function updateDynamicPageAction(data: IDynamicPage): Promise<void> {
  const {_id, ...updateData} = data;

  await DynamicPageModel.findByIdAndUpdate(_id, {$set: updateData});
}

export async function removeDynamicPagesAction(data: IDynamicPage[]): Promise<void> {
  await DynamicPageModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
}