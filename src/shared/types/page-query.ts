export type SortOrder = "ascend" | "descend";

export interface IPageQuery {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: SortOrder;
  search?: string;
}

export interface IPageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;
