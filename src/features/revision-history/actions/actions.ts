"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {getRevision, getRevisionComparison, getRevisionLog, getRevisionSummaries, updateWithRevision} from "@/shared/services/revision-service/revision-service";
import {IRevision, IRevisionComparison, IRevisionLog, IRevisionLogQuery, IRevisionSummary, RevisionCollection} from "@/shared/types/revision";
import {clampInteger} from "@/shared/utilities/public-input";
import {COLLECTIONS, requireAllowedCollections, requireCollection} from "../model/record-collections";

export const getRevisionsAction = createServerAction<IRevisionSummary[]>(async (collection: unknown, recordId: unknown) => {
  const config = await requireCollection(collection);
  return getRevisionSummaries(config.collection, String(recordId));
});

export const getRevisionAction = createServerAction<IRevision | null>(async (collection: unknown, recordId: unknown, revisionId: unknown) => {
  const config = await requireCollection(collection);
  return getRevision(config.collection, String(recordId), revisionId);
});

export const getRevisionComparisonAction = createServerAction<IRevisionComparison | null>(async (collection: unknown, recordId: unknown, revisionId: unknown) => {
  const config = await requireCollection(collection);
  return getRevisionComparison(config.collection, String(recordId), revisionId);
});

export const restoreRevisionAction = createServerAction<void>(async (collection: unknown, recordId: unknown, revisionId: unknown) => {
  const config = await requireCollection(collection);
  const revision = await getRevision(config.collection, String(recordId), revisionId);

  if (!revision)
    throw new ServerActionError("Версію не знайдено");

  if (!(await config.model.exists({_id: String(recordId)})))
    throw new ServerActionError("Запис не знайдено, можливо, його видалено");

  try {
    await updateWithRevision(config.model, config.collection, String(recordId), revision.data, config.user, true);
  }
  catch (error) {
    if ((error as {code?: number}).code == 11000)
      throw new ServerActionError("Шлях цієї версії вже зайнятий іншим записом: змініть його, а потім відновіть версію");

    throw error;
  }
}, {revalidatePublicPages: true});

export const getRevisionLogAction = createServerAction<IRevisionLog>(async (rawQuery: Partial<IRevisionLogQuery>) => {
  const {collections: allowed} = await requireAllowedCollections();

  const isDate = (value: unknown): value is string => typeof value == "string" && !Number.isNaN(Date.parse(value));

  const query: IRevisionLogQuery = {
    collections: Array.isArray(rawQuery?.collections) ? rawQuery.collections.filter((collection) => allowed.includes(collection)) : undefined,
    authorId: typeof rawQuery?.authorId == "string" ? rawQuery.authorId : undefined,
    from: isDate(rawQuery?.from) ? rawQuery.from : undefined,
    to: isDate(rawQuery?.to) ? rawQuery.to : undefined,
    search: typeof rawQuery?.search == "string" ? rawQuery.search.slice(0, 100) : undefined,
    page: clampInteger(rawQuery?.page, 1, 10_000, 1),
    pageSize: clampInteger(rawQuery?.pageSize, 1, 100, 20),
  };

  if (allowed.length == 0)
    return {items: [], total: 0, page: 1, pageSize: query.pageSize, authors: []};

  const log = await getRevisionLog(allowed, query);

  const existing = new Set<string>();

  await Promise.all(allowed.map(async (collection) => {
    const ids = log.items.filter((item) => item.collection == collection).map((item) => item.recordId);

    if (ids.length == 0)
      return;

    const records = await COLLECTIONS[collection].model.find({_id: {$in: ids}}, {_id: 1}).lean<{_id: unknown}[]>();
    records.forEach((record) => existing.add(`${collection}:${String(record._id)}`));
  }));

  return {...log, items: log.items.map((item) => ({...item, isDeleted: !existing.has(`${item.collection}:${item.recordId}`)}))};
});
