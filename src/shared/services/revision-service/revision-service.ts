import {isValidObjectId, Model, model, models, Schema} from "mongoose";
import toPlainObject from "@/shared/utilities/to-plain-object";
import {
  IRevision,
  IRevisionAuthor,
  IRevisionBlocksChange,
  IRevisionComparison,
  IRevisionLog,
  IRevisionLogItem,
  IRevisionLogQuery,
  IRevisionSummary,
  RevisionCollection
} from "@/shared/types/revision";
import {escapeRegex} from "@/shared/services/pagination-service/pagination-service";

export const MAX_REVISIONS = 30;

interface IRevisionDocument {
  _id: unknown;
  collectionName: RevisionCollection;
  recordId: string;
  data: Record<string, unknown>;
  authorId?: string;
  authorName?: string;
  isBaseline?: boolean;
  isCreation?: boolean;
  createdAt: Date;
}

const revisionSchema = new Schema({
  collectionName: {type: Schema.Types.String, required: true},
  recordId: {type: Schema.Types.String, required: true},
  data: {type: Schema.Types.Mixed, required: true},
  authorId: {type: Schema.Types.String},
  authorName: {type: Schema.Types.String},
  isBaseline: {type: Schema.Types.Boolean},
  isCreation: {type: Schema.Types.Boolean},
}, {timestamps: {createdAt: true, updatedAt: false}, minimize: false});

revisionSchema.index({collectionName: 1, recordId: 1, createdAt: -1});
revisionSchema.index({createdAt: -1});

const RevisionModel = models?.Revision || model("Revision", revisionSchema, "revisions");

const SERVICE_FIELDS = ["_id", "__v", "createdAt", "updatedAt"];
const NEWEST_FIRST = {createdAt: -1, _id: -1} as const;

function toRevisionData(record: unknown): Record<string, unknown> {
  const plain = toPlainObject(record) as Record<string, unknown>;
  return Object.fromEntries(Object.entries(plain).filter(([key]) => !SERVICE_FIELDS.includes(key)));
}

type RevisionKind = "baseline" | "creation";

export async function recordRevision(collection: RevisionCollection, recordId: string, record: unknown, author?: IRevisionAuthor, kind?: RevisionKind) {
  const data = toRevisionData(record);
  const latest = await RevisionModel.findOne({collectionName: collection, recordId}).sort(NEWEST_FIRST).lean<IRevisionDocument>();

  if (latest && JSON.stringify(latest.data) == JSON.stringify(data))
    return;

  await RevisionModel.create({
    collectionName: collection,
    recordId,
    data,
    authorId: author?.id,
    authorName: author?.name,
    isBaseline: kind == "baseline",
    isCreation: kind == "creation"
  });

  const outdated = await RevisionModel.find({collectionName: collection, recordId}, {_id: 1})
    .sort(NEWEST_FIRST)
    .skip(MAX_REVISIONS)
    .lean<{_id: unknown}[]>();

  if (outdated.length != 0)
    await RevisionModel.deleteMany({_id: {$in: outdated.map((revision) => revision._id)}});
}

export async function createWithRevision(recordModel: Model<any>, collection: RevisionCollection, data: object, author: IRevisionAuthor) {
  const created = await recordModel.create(data);
  await recordRevision(collection, String(created._id), created.toObject(), author, "creation");
}

export async function updateWithRevision(recordModel: Model<any>, collection: RevisionCollection, id: unknown, update: object, author: IRevisionAuthor, replace = false) {
  const recordId = String(id);
  const before = await recordModel.findById(id).lean<Record<string, unknown>>();

  if (before && !(await RevisionModel.exists({collectionName: collection, recordId})))
    await recordRevision(collection, recordId, before, undefined, "baseline");

  const missingFields = replace && before ?
    Object.keys(before).filter((key) => !SERVICE_FIELDS.includes(key) && !(key in update)) : [];

  await recordModel.findByIdAndUpdate(id, {
    $set: update,
    ...(missingFields.length && {$unset: Object.fromEntries(missingFields.map((key) => [key, 1]))})
  }, {runValidators: true});

  const after = await recordModel.findById(id).lean();

  if (after)
    await recordRevision(collection, recordId, after, author);
}

function getBlocks(entities: unknown): Map<string, string> {
  const blocks = new Map<string, string>();

  const add = (items: unknown) => {
    if (!Array.isArray(items))
      return;

    for (const item of items) {
      if (item?.type == "group") {
        const {components, ...group} = item;
        blocks.set(String(item.id), JSON.stringify(group));
        add(components);
      }
      else if (item?.id) {
        blocks.set(String(item.id), JSON.stringify(item));
      }
    }
  }

  add(entities);

  return blocks;
}

function getBlocksChange(previous: unknown, current: unknown): IRevisionBlocksChange | undefined {
  const before = getBlocks(previous);
  const after = getBlocks(current);

  const added = [...after.keys()].filter((id) => !before.has(id)).length;
  const removed = [...before.keys()].filter((id) => !after.has(id)).length;
  const changed = [...after.keys()].filter((id) => before.has(id) && before.get(id) != after.get(id)).length;

  const order = (blocks: Map<string, string>, other: Map<string, string>) => [...blocks.keys()].filter((id) => other.has(id)).join();
  const moved = order(before, after) != order(after, before);

  return added || removed || changed || moved ? {added, removed, changed, moved} : undefined;
}

function getChangedFields(previous: Record<string, unknown>, current: Record<string, unknown>): string[] {
  const keys = new Set([...Object.keys(previous), ...Object.keys(current)]);
  return [...keys].filter((key) => key != "entities" && JSON.stringify(previous[key]) != JSON.stringify(current[key]));
}

export async function getRevisionSummaries(collection: RevisionCollection, recordId: string): Promise<IRevisionSummary[]> {
  const revisions = await RevisionModel.find({collectionName: collection, recordId}).sort(NEWEST_FIRST).lean<IRevisionDocument[]>();

  return revisions.map((revision, index) => {
    const previous = revisions[index + 1];

    return {
      id: String(revision._id),
      createdAt: new Date(revision.createdAt).toISOString(),
      authorName: revision.authorName,
      isBaseline: revision.isBaseline == true,
      isCurrent: index == 0,
      changedFields: previous ? getChangedFields(previous.data, revision.data) : [],
      blocks: previous ? getBlocksChange(previous.data.entities, revision.data.entities) : undefined
    };
  });
}

function toRevision(revision: IRevisionDocument): IRevision {
  return {
    id: String(revision._id),
    createdAt: new Date(revision.createdAt).toISOString(),
    authorName: revision.authorName,
    data: toPlainObject(revision.data)
  };
}

export async function getRevision(collection: RevisionCollection, recordId: string, revisionId: unknown): Promise<IRevision | null> {
  if (!isValidObjectId(revisionId))
    return null;

  const revision = await RevisionModel.findOne({_id: revisionId, collectionName: collection, recordId}).lean<IRevisionDocument>();

  return revision ? toRevision(revision) : null;
}

export async function getRevisionComparison(collection: RevisionCollection, recordId: string, revisionId: unknown): Promise<IRevisionComparison | null> {
  if (!isValidObjectId(revisionId))
    return null;

  const revision = await RevisionModel.findOne({_id: revisionId, collectionName: collection, recordId}).lean<IRevisionDocument>();

  if (!revision)
    return null;

  const previous = await RevisionModel.findOne({
    collectionName: collection,
    recordId,
    $or: [
      {createdAt: {$lt: revision.createdAt}},
      {createdAt: revision.createdAt, _id: {$lt: revision._id}}
    ]
  }).sort(NEWEST_FIRST).lean<IRevisionDocument>();

  return {revision: toRevision(revision), previous: previous ? toRevision(previous) : null};
}

const NAME_FIELDS = ["data.name", "data.title", "data.label", "data.lastName", "data.firstName"];

export function getRecordName(data: Record<string, unknown>): string {
  if (typeof data.lastName == "string")
    return `${data.lastName} ${data.firstName ?? ""}`.trim();

  return String(data.name ?? data.title ?? data.label ?? "Без назви");
}

export async function getRevisionLog(collections: RevisionCollection[], query: IRevisionLogQuery): Promise<Omit<IRevisionLog, "items"> & {items: Omit<IRevisionLogItem, "isDeleted">[]}> {
  const shown = query.collections?.length ? collections.filter((collection) => query.collections!.includes(collection)) : collections;

  const filter: Record<string, unknown> = {collectionName: {$in: shown}, isBaseline: {$ne: true}};

  if (query.authorId)
    filter.authorId = query.authorId;

  if (query.from || query.to)
    filter.createdAt = {...(query.from && {$gte: new Date(query.from)}), ...(query.to && {$lte: new Date(query.to)})};

  const words = query.search?.trim().split(/\s+/).filter(Boolean).slice(0, 5) ?? [];

  if (words.length)
    filter.$and = words.map((word) => ({$or: NAME_FIELDS.map((field) => ({[field]: {$regex: escapeRegex(word), $options: "i"}}))}));

  const [revisions, total, authors] = await Promise.all([
    RevisionModel.find(filter).sort(NEWEST_FIRST).skip((query.page - 1) * query.pageSize).limit(query.pageSize).lean<IRevisionDocument[]>(),
    RevisionModel.countDocuments(filter),
    RevisionModel.aggregate<{_id: string, name: string}>([
      {$match: {collectionName: {$in: collections}, authorId: {$exists: true}}},
      {$sort: {createdAt: -1}},
      {$group: {_id: "$authorId", name: {$first: "$authorName"}}},
      {$sort: {name: 1}}
    ])
  ]);

  const items = await Promise.all(revisions.map(async (revision) => {
    const previous = await RevisionModel.findOne({
      collectionName: revision.collectionName,
      recordId: revision.recordId,
      $or: [
        {createdAt: {$lt: revision.createdAt}},
        {createdAt: revision.createdAt, _id: {$lt: revision._id}}
      ]
    }).sort(NEWEST_FIRST).lean<IRevisionDocument>();

    return {
      id: String(revision._id),
      collection: revision.collectionName,
      recordId: revision.recordId,
      recordName: getRecordName(revision.data),
      createdAt: new Date(revision.createdAt).toISOString(),
      authorName: revision.authorName,
      isCreated: revision.isCreation == true,
      changedFields: previous ? getChangedFields(previous.data, revision.data) : [],
      blocks: previous ? getBlocksChange(previous.data.entities, revision.data.entities) : undefined
    };
  }));

  return {
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
    authors: authors.map((author) => ({id: author._id, name: author.name}))
  };
}

export async function deleteRevisions(records: {collection: RevisionCollection, recordId: string}[]) {
  if (records.length == 0)
    return;

  await RevisionModel.deleteMany({$or: records.map((record) => ({collectionName: record.collection, recordId: record.recordId}))});
}
