"use server"

import {DynamicPageModel, IDynamicPage} from "@/entities/dynamic-page";

export async function getDynamicPagesAction(): Promise<IDynamicPage[]> {
  return DynamicPageModel.find<IDynamicPage>({});
}

export async function getDynamicPageByPathAction(path: string): Promise<IDynamicPage|null> {
  return DynamicPageModel.findOne<IDynamicPage>({path: path});
}

export async function addDynamicPageAction(page: IDynamicPage): Promise<void>  {
  await DynamicPageModel.create<IDynamicPage>(page);
}

export async function updateDynamicPageAction(page: IDynamicPage): Promise<void>  {
  const {_id, ...updateData} = page;

  await DynamicPageModel.findByIdAndUpdate(_id, {$set: updateData});
}

export async function deleteDynamicPageAction(pages: IDynamicPage[]): Promise<void>  {
  await DynamicPageModel.deleteMany({_id: {$in: pages.map((page) => page._id)}});
}