"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {clampInteger} from "@/shared/utilities/public-input";
import {
  deleteFromTrash,
  getTrashItems,
  getTrashPage,
  purgeExpiredTrash,
  restoreFromTrash,
  TrashRecordModels
} from "@/shared/services/trash-service/trash-service";
import {RevisionCollection} from "@/shared/types/revision";
import {ITrashPage, ITrashQuery} from "@/shared/types/trash";
import {COLLECTIONS, requireAllowedCollections} from "../model/record-collections";
import {requirePermission} from "@/auth";

const getRecordModels = (collections: RevisionCollection[]): TrashRecordModels => (
  Object.fromEntries(collections.map((collection) => [collection, COLLECTIONS[collection].model]))
);

export const getTrashAction = createServerAction<ITrashPage>(async (rawQuery: Partial<ITrashQuery>) => {
  const {collections} = await requireAllowedCollections();

  const query: ITrashQuery = {
    collections: Array.isArray(rawQuery?.collections) ? rawQuery.collections.filter((collection) => collections.includes(collection)) : undefined,
    search: typeof rawQuery?.search == "string" ? rawQuery.search.slice(0, 100) : undefined,
    page: clampInteger(rawQuery?.page, 1, 10_000, 1),
    pageSize: clampInteger(rawQuery?.pageSize, 1, 100, 20),
  };

  if (collections.length == 0)
    return {items: [], total: 0, page: 1, pageSize: query.pageSize};

  await purgeExpiredTrash(getRecordModels(collections));

  return getTrashPage(collections, query);
});

export const restoreFromTrashAction = createServerAction<{restored: number, errors: string[]}>(async (ids: unknown) => {
  const {user, collections} = await requireAllowedCollections();
  const items = await getTrashItems(collections, Array.isArray(ids) ? ids : []);

  const errors: string[] = [];
  let restored = 0;

  for (const item of items) {
    try {
      await restoreFromTrash(COLLECTIONS[item.collectionName as RevisionCollection].model, item, user);
      restored++;
    }
    catch (error) {
      const code = (error as {code?: number}).code;

      errors.push(code == 11000 ?
        `«${item.recordName}»: його шлях або id вже зайняті іншим записом, змініть шлях того запису й повторіть` :
        `«${item.recordName}»: ${(error as Error).message}`);
    }
  }

  if (restored == 0 && errors.length != 0 && items.length == 1)
    throw new ServerActionError(errors[0]);

  return {restored, errors};
}, {revalidatePublicPages: true});

export const deleteFromTrashAction = createServerAction<void>(async (ids: unknown) => {
  await requirePermission("manage-trash");
  const {collections} = await requireAllowedCollections();
  const items = await getTrashItems(collections, Array.isArray(ids) ? ids : []);

  await deleteFromTrash(items.map((item) => item._id), getRecordModels(collections));
});

export const emptyTrashAction = createServerAction<void>(async () => {
  await requirePermission("manage-trash");
  const {collections} = await requireAllowedCollections();
  const page = await getTrashPage(collections, {page: 1, pageSize: 100_000});

  await deleteFromTrash(page.items.map((item) => item.id), getRecordModels(collections));
});
