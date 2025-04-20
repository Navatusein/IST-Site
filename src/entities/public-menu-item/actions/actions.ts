"use server"

import {IPublicMenuItem} from "../types/type";
import PublicMenuItemModel from "../types/schema";
import toPlainObject from "@/shared/utilities/to-plain-object";


export async function getPublicMenuItemsAction(): Promise<IPublicMenuItem[]> {
  return toPlainObject<IPublicMenuItem[]>(await PublicMenuItemModel.find<IPublicMenuItem>({}));
}

export async function getPublicMenuItemsTreeAction(): Promise<IPublicMenuItem[]> {
  const items = await getPublicMenuItemsAction();

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
}

export async function addPublicMenuItemAction(data: IPublicMenuItem): Promise<void> {
  await PublicMenuItemModel.create<IPublicMenuItem>(data);
}

export async function updatePublicMenuItemAction(data: IPublicMenuItem): Promise<void> {
  const {_id, ...updateData} = data;

  await PublicMenuItemModel.findByIdAndUpdate(_id, {$set: updateData});
}

export async function removePublicMenuItemsAction(data: IPublicMenuItem[]): Promise<void> {
  await PublicMenuItemModel.deleteMany({_id: {$in: data.map((value) => value._id)}});
}

