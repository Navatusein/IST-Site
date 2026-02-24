"use server"

import {INews} from "../types/type";
import NewsModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";

export const getNewsAction = createServerAction<INews[]>(async () => {
  return toPlainObject<INews[]>(await NewsModel.find<INews>({}).sort({date: "desc"}));
});

export const getNewsPaginationAction = createServerAction<INews[]>(async (offset: number, limit: number) => {
  return toPlainObject<INews[]>(await NewsModel
    .find<INews>({})
    .sort({date: "desc", createdAt: "desc"})
    .skip(offset)
    .limit(limit)
  );
});

export const getNewsCountAction = createServerAction<number>(async () => {
  return toPlainObject<number>(await NewsModel.find<INews>({}).countDocuments());
});

export const getNewsByPathAction = createServerAction<INews | null>(async (path: string) => {
  const data = await NewsModel.findOne<INews>({path});

  if (!data)
    return null;

  return toPlainObject<INews>(data);
});

export const addNewsAction = createServerAction<void>(async (data: INews) => {
  await NewsModel.create<INews>(data);
});

export const updateNewsAction = createServerAction<void>(async (data: INews) => {
  const {_id, ...updateData} = data;
  await NewsModel.findByIdAndUpdate(_id, {$set: updateData});
});

export const removeNewsAction = createServerAction<void>(async (data: INews[]) => {
  await NewsModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
});