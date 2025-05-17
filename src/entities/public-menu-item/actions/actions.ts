"use server"

import {IPublicMenuItem} from "../types/type";
import PublicMenuItemModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {createServerAction} from "@/shared/utilities/create-server-action";


export const getPublicMenuItemsAction = createServerAction<IPublicMenuItem[]>(async () => {
  return toPlainObject<IPublicMenuItem[]>(await PublicMenuItemModel.find<IPublicMenuItem>({}));
});

export const getPublicMenuItemsTreeAction = createServerAction<IPublicMenuItem[]>(async () => {
  const items = toPlainObject<IPublicMenuItem[]>(await PublicMenuItemModel.find<IPublicMenuItem>({}));

  const lookup = new Map(items.map(item => [item._id, item]));

  const roots: IPublicMenuItem[] = [];

  for (const item of items) {
    const node = lookup.get(item._id)!;

    if (item.parent && lookup.has(item.parent)) {
      const object = lookup.get(item.parent)!;

      if (!object.children)
        object.children = [];

      object.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return toPlainObject<IPublicMenuItem[]>(roots);
});

export const addPublicMenuItemAction = createServerAction<void>(async (data: IPublicMenuItem) => {
  await PublicMenuItemModel.create<IPublicMenuItem>(data);
});

export const updatePublicMenuItemAction = createServerAction<void>(async (data: IPublicMenuItem) => {
  const {_id, ...updateData} = data;

  await PublicMenuItemModel.findByIdAndUpdate(_id, {$set: updateData});
});

export const removePublicMenuItemsAction = createServerAction<void>(async (data: IPublicMenuItem[]) => {
  await PublicMenuItemModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
});

