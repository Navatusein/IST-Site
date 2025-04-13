"use server"

import {INews} from "../types/type";
import NewsModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";


export async function getNewsAction(): Promise<INews[]> {
  return toPlainObject<INews[]>(await NewsModel.find<INews>({}));
}

export async function getNewsByPathAction(path: string): Promise<INews|null> {
  const data = await NewsModel.findOne<INews>({path: path});

  if (!data)
    return null

  return toPlainObject<INews>(data);
}

export async function addNewsAction(data: INews): Promise<void> {
  await NewsModel.create<INews>(data);
}

export async function updateNewsAction(data: INews): Promise<void> {
  const {_id, ...updateData} = data;

  await NewsModel.findByIdAndUpdate(_id, {$set: updateData});
}

export async function deleteNewsAction(data: INews[]): Promise<void> {
  await NewsModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
}