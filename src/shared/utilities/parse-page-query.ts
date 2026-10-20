import {DEFAULT_PAGE_SIZE, IPageQuery, PAGE_SIZE_OPTIONS} from "@/shared/types/page-query";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default function parsePageQuery(searchParams: SearchParams): IPageQuery {
  const page = Number.parseInt(first(searchParams.page) ?? "", 10);
  const pageSize = Number.parseInt(first(searchParams.pageSize) ?? "", 10);
  const sortOrder = first(searchParams.order);

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
    sortField: first(searchParams.sort) || undefined,
    sortOrder: sortOrder == "ascend" || sortOrder == "descend" ? sortOrder : undefined,
    search: first(searchParams.q)?.trim() || undefined,
  };
}
