import {isValidObjectId, Model} from "mongoose";
import {DEFAULT_PAGE_SIZE, IPageQuery, IPageResult, PAGE_SIZE_OPTIONS} from "@/shared/types/page-query";
import toPlainObject from "@/shared/utilities/to-plain-object";

type SortDirection = 1 | -1;

export interface IPaginateOptions<T> {
  sortFields: Record<string, string>;
  defaultSort: Record<string, SortDirection>;
  searchFields: string[];
  filter?: Record<string, unknown>;
  transform?: (item: T) => T;
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildSearchFilter(search: string | undefined, fields: string[]): Record<string, unknown> {
  const words = (search ?? "").split(/\s+/).filter(Boolean).slice(0, 10);

  if (words.length == 0 || fields.length == 0)
    return {};

  return {
    $and: words.map((word) => ({
      $or: fields.map((field) => ({[field]: {$regex: escapeRegex(word), $options: "i"}}))
    }))
  };
}

export function buildSort(query: IPageQuery, sortFields: Record<string, string>, defaultSort: Record<string, SortDirection>) {
  const field = query.sortField ? sortFields[query.sortField] : undefined;
  const sort: Record<string, SortDirection> = field && query.sortOrder ?
    {[field]: query.sortOrder == "ascend" ? 1 : -1} :
    {...defaultSort};

  sort._id ??= 1;

  return sort;
}

export function normalizePageQuery(query: IPageQuery): IPageQuery {
  return {
    ...query,
    page: Math.max(1, Math.floor(Number(query.page) || 1)),
    pageSize: PAGE_SIZE_OPTIONS.includes(Number(query.pageSize)) ? Number(query.pageSize) : DEFAULT_PAGE_SIZE
  };
}

export async function paginate<T>(model: Model<any>, rawQuery: IPageQuery, options: IPaginateOptions<T>): Promise<IPageResult<T>> {
  const query = normalizePageQuery(rawQuery);
  const filter = {...options.filter, ...buildSearchFilter(query.search, options.searchFields)};

  const total = await model.countDocuments(filter);
  const lastPage = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, lastPage);

  const items = await model
    .find(filter)
    .collation({locale: "uk"})
    .sort(buildSort(query, options.sortFields, options.defaultSort))
    .skip((page - 1) * query.pageSize)
    .limit(query.pageSize)
    .lean<T[]>();

  const plainItems = toPlainObject<T[]>(items);

  return {
    items: options.transform ? plainItems.map(options.transform) : plainItems,
    total,
    page,
    pageSize: query.pageSize
  };
}

export async function isValueAvailable(model: Model<any>, field: string, value: string, excludeId?: string): Promise<boolean> {
  if (typeof value != "string" || !value)
    return true;

  const filter: Record<string, unknown> = {[field]: value};

  if (excludeId && isValidObjectId(excludeId))
    filter._id = {$ne: excludeId};

  return !(await model.exists(filter));
}
