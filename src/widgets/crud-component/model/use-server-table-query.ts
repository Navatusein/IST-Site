"use client"

import {useEffect, useState, useTransition} from "react";
import {TablePaginationConfig} from "antd";
import {SorterResult} from "antd/es/table/interface";
import {parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates} from "nuqs";
import {DEFAULT_PAGE_SIZE} from "@/shared/types/page-query";

const SEARCH_DEBOUNCE_MS = 400;

export function useServerTableQuery<T>() {
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    sort: parseAsString,
    order: parseAsStringLiteral(["ascend", "descend"] as const),
    q: parseAsString,
  }, {shallow: false, startTransition});

  const [searchInput, setSearchInput] = useState<string>(query.q ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const search = searchInput.trim();

      if (search != (query.q ?? ""))
        setQuery({q: search || null, page: null}, {history: "replace"});
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const onTableChange = (pagination: TablePaginationConfig, sorter: SorterResult<T> | SorterResult<T>[]) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    const order = activeSorter?.order ?? null;
    const sort = order ? String(activeSorter.columnKey ?? activeSorter.field) : null;
    const pageSize = pagination.pageSize ?? DEFAULT_PAGE_SIZE;

    const isReordered = sort != (query.sort ?? null) || order != (query.order ?? null) || pageSize != (query.pageSize ?? DEFAULT_PAGE_SIZE);
    const page = isReordered ? 1 : pagination.current ?? 1;

    setQuery({
      page: page == 1 ? null : page,
      pageSize: pageSize == DEFAULT_PAGE_SIZE ? null : pageSize,
      sort,
      order
    });
  }

  return {query, isPending, searchInput, setSearchInput, onTableChange};
}
