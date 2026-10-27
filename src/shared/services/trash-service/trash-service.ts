import {isValidObjectId, Model, model, models, Schema} from "mongoose";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {escapeRegex} from "@/shared/services/pagination-service/pagination-service";
import {deleteRevisions, getRecordName, recordRevision} from "@/shared/services/revision-service/revision-service";
import {IRevisionAuthor, RevisionCollection} from "@/shared/types/revision";
import {ITrashItem, ITrashPage, ITrashQuery} from "@/shared/types/trash";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {removeRedirectFrom} from "@/shared/services/redirect-service/redirect-service";
import {getRecordPublicPath} from "@/shared/utilities/public-paths";

export const TRASH_DAYS = 30;

export type TrashRecordModels = Partial<Record<RevisionCollection, Model<any>>>;

interface ITrashDocument {
  _id: unknown;
  collectionName: RevisionCollection;
  recordId: string;
  recordName: string;
  data: Record<string, unknown>;
  deletedById?: string;
  deletedByName?: string;
  deletedAt: Date;
  expiresAt: Date;
}

const trashSchema = new Schema({
  collectionName: {type: Schema.Types.String, required: true},
  recordId: {type: Schema.Types.String, required: true},
  recordName: {type: Schema.Types.String, required: true},
  data: {type: Schema.Types.Mixed, required: true},
  deletedById: {type: Schema.Types.String},
  deletedByName: {type: Schema.Types.String},
  deletedAt: {type: Schema.Types.Date, required: true},
  expiresAt: {type: Schema.Types.Date, required: true},
}, {minimize: false});

trashSchema.index({expiresAt: 1});
trashSchema.index({collectionName: 1, deletedAt: -1});

const TrashModel = models?.Trash || model("Trash", trashSchema, "trash");

function toTrashItem(document: ITrashDocument): ITrashItem {
  return {
    id: String(document._id),
    collection: document.collectionName,
    recordId: document.recordId,
    recordName: document.recordName,
    deletedAt: new Date(document.deletedAt).toISOString(),
    deletedByName: document.deletedByName,
    expiresAt: new Date(document.expiresAt).toISOString()
  };
}

export async function purgeExpiredTrash(recordModels: TrashRecordModels) {
  const collections = Object.keys(recordModels);

  const expired = await TrashModel.find({expiresAt: {$lte: new Date()}, collectionName: {$in: collections}}, {_id: 1}).lean<{_id: unknown}[]>();

  if (expired.length)
    await deleteFromTrash(expired.map((item) => item._id), recordModels);
}

export async function moveToTrash(recordModel: Model<any>, collection: RevisionCollection, ids: unknown[], author: IRevisionAuthor) {
  await purgeExpiredTrash({[collection]: recordModel});

  const validIds = ids.filter((id) => isValidObjectId(id));

  if (validIds.length == 0)
    return;

  const records = await recordModel.find({_id: {$in: validIds}}).lean();

  if (records.length == 0)
    return;

  const deletedAt = new Date();
  const expiresAt = new Date(deletedAt.getTime() + TRASH_DAYS * 24 * 60 * 60 * 1000);

  await TrashModel.insertMany(records.map((record) => {
    const data = toPlainObject(record) as Record<string, unknown>;

    return {
      collectionName: collection,
      recordId: String(data._id),
      recordName: getRecordName(data),
      data,
      deletedById: author.id,
      deletedByName: author.name,
      deletedAt,
      expiresAt
    };
  }));

  await recordModel.deleteMany({_id: {$in: records.map((record) => record._id)}});
}

export async function getTrashPage(collections: RevisionCollection[], query: ITrashQuery): Promise<ITrashPage> {
  const shown = query.collections?.length ? collections.filter((collection) => query.collections!.includes(collection)) : collections;
  const filter: Record<string, unknown> = {collectionName: {$in: shown}, expiresAt: {$gt: new Date()}};

  const words = query.search?.trim().split(/\s+/).filter(Boolean).slice(0, 5) ?? [];

  if (words.length)
    filter.$and = words.map((word) => ({recordName: {$regex: escapeRegex(word), $options: "i"}}));

  const [documents, total] = await Promise.all([
    TrashModel.find(filter, {data: 0}).sort({deletedAt: -1, _id: -1}).skip((query.page - 1) * query.pageSize).limit(query.pageSize).lean<ITrashDocument[]>(),
    TrashModel.countDocuments(filter)
  ]);

  return {items: documents.map(toTrashItem), total, page: query.page, pageSize: query.pageSize};
}

export async function getTrashItems(collections: RevisionCollection[], ids: unknown[]): Promise<ITrashDocument[]> {
  const validIds = ids.filter((id) => isValidObjectId(id));

  if (validIds.length == 0)
    return [];

  return TrashModel.find({_id: {$in: validIds}, collectionName: {$in: collections}, expiresAt: {$gt: new Date()}}).lean<ITrashDocument[]>();
}

export async function restoreFromTrash(recordModel: Model<any>, item: ITrashDocument, author: IRevisionAuthor) {
  if (isValidObjectId(item.recordId) && await recordModel.exists({_id: item.recordId}))
    throw new ServerActionError("запис із таким id уже існує (його відновлено або імпортовано раніше)");

  const restored = await recordModel.create(item.data);
  await TrashModel.deleteOne({_id: item._id});
  await recordRevision(item.collectionName, item.recordId, restored.toObject(), author);

  const publicPath = typeof restored.path == "string" ? getRecordPublicPath(item.collectionName, restored.path) : null;

  if (publicPath)
    await removeRedirectFrom(publicPath);
}

async function getRecordsWithoutHistoryOwner(items: ITrashDocument[], recordModels: TrashRecordModels) {
  const records: {collection: RevisionCollection, recordId: string}[] = [];

  for (const collection of new Set(items.map((item) => item.collectionName))) {
    const recordModel = recordModels[collection];

    if (!recordModel)
      continue;

    const recordIds = [...new Set(items.filter((item) => item.collectionName == collection).map((item) => item.recordId))];

    const [existing, trashed] = await Promise.all([
      recordModel.find({_id: {$in: recordIds.filter((id) => isValidObjectId(id))}}, {_id: 1}).lean<{_id: unknown}[]>(),
      TrashModel.distinct("recordId", {collectionName: collection, recordId: {$in: recordIds}})
    ]);

    const kept = new Set([...existing.map((record) => String(record._id)), ...trashed.map(String)]);

    records.push(...recordIds.filter((recordId) => !kept.has(recordId)).map((recordId) => ({collection, recordId})));
  }

  return records;
}

export async function deleteFromTrash(ids: unknown[], recordModels: TrashRecordModels) {
  const items = await TrashModel.find({_id: {$in: ids}}, {collectionName: 1, recordId: 1}).lean<ITrashDocument[]>();

  if (items.length == 0)
    return;

  await TrashModel.deleteMany({_id: {$in: items.map((item) => item._id)}});
  await deleteRevisions(await getRecordsWithoutHistoryOwner(items, recordModels));
}

export async function removeRecordsFromTrash(collection: RevisionCollection, recordIds: string[]) {
  if (recordIds.length != 0)
    await TrashModel.deleteMany({collectionName: collection, recordId: {$in: recordIds}});
}
