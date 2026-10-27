"use client"

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {App, Button, DatePicker, Flex, Input, Select, Table, TableColumnsType, Tag, Tooltip, Typography} from "antd";
import {EditOutlined, HistoryOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates} from "nuqs";
import dayjs from "dayjs";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import {IRevisionLog, IRevisionLogItem, RevisionCollection} from "@/shared/types/revision";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import formatDate from "@/shared/utilities/format-date";
import {getRevisionLogAction} from "../../actions/actions";
import {REVISION_TABLES} from "../../model/revision-tables";
import {describeChanges} from "../../utilities/describe-changes";
import RevisionHistoryDrawer from "../revision-history-drawer/revision-history-drawer";
import LogItemCompare from "../log-item-compare/log-item-compare";
import fillHeight from "@/shared/styles/fill-height.module.scss";

const PAGE_SIZE = 20;

const LOG_QUERY = {
  tables: parseAsArrayOf(parseAsString),
  author: parseAsString,
  from: parseAsString,
  to: parseAsString,
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
};

export default function RevisionLog() {
  const router = useRouter();
  const {notification} = App.useApp();
  const {userPermissions} = useUserPermissions();

  const [query, setQuery] = useQueryStates(LOG_QUERY, {history: "replace"});
  const [search, setSearch] = useState<string>(query.q ?? "");
  const [log, setLog] = useState<IRevisionLog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [historyItem, setHistoryItem] = useState<IRevisionLogItem | null>(null);
  const requestId = useRef<number>(0);

  const tables = (Object.keys(REVISION_TABLES) as RevisionCollection[])
    .filter((collection) => userPermissions.includes(REVISION_TABLES[collection].permission));

  const load = () => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);

    unwrapServerAction(getRevisionLogAction({
      collections: query.tables?.length ? query.tables as RevisionCollection[] : undefined,
      authorId: query.author ?? undefined,
      from: query.from ?? undefined,
      to: query.to ?? undefined,
      search: query.q ?? undefined,
      page: query.page,
      pageSize: PAGE_SIZE
    }))
      .then((result) => {
        if (currentRequestId == requestId.current)
          setLog(result);
      })
      .catch((error) => {
        if (currentRequestId == requestId.current)
          notification.error({title: "Не вдалося завантажити журнал", description: error.message});
      })
      .finally(() => {
        if (currentRequestId == requestId.current)
          setIsLoading(false);
      });
  }

  useEffect(load, [JSON.stringify(query)]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((query.q ?? "") != search.trim())
        void setQuery({q: search.trim() || null, page: 1});
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const columns: TableColumnsType<IRevisionLogItem> = [
    {
      title: "Час",
      key: "createdAt",
      width: 170,
      render: (_, item) => formatDate(item.createdAt, "D MMM YYYY, HH:mm")
    },
    {
      title: "Хто",
      key: "author",
      width: 160,
      ellipsis: true,
      render: (_, item) => item.authorName ?? <Typography.Text type="secondary">—</Typography.Text>
    },
    {
      title: "Таблиця",
      key: "collection",
      width: 170,
      render: (_, item) => <Tag style={{marginInlineEnd: 0}}>{REVISION_TABLES[item.collection].name}</Tag>
    },
    {
      title: "Запис",
      key: "record",
      ellipsis: true,
      render: (_, item) => (
        <Flex gap="small" align="center" style={{minWidth: 0}}>
          <Typography.Text strong ellipsis>{item.recordName}</Typography.Text>
          {item.isDeleted && <Tag color="error" style={{marginInlineEnd: 0}}>Видалено</Tag>}
        </Flex>
      )
    },
    {
      title: "Що змінилось",
      key: "changes",
      render: (_, item) => (
        <Flex gap={4} wrap>
          {item.isCreated ?
            <Tag color="success" style={{marginInlineEnd: 0}}>Створено</Tag> :
            describeChanges(item.changedFields, item.blocks, REVISION_TABLES[item.collection].fieldLabels)
              .map((change) => <Tag key={change} style={{marginInlineEnd: 0}}>{change}</Tag>)}
        </Flex>
      )
    },
    {
      title: "Дії",
      key: "actions",
      width: 84,
      render: (_, item) => (
        <Flex gap={4} onClick={(event) => event.stopPropagation()}>
          <Tooltip title={item.isDeleted ? "Запис видалено" : "Відкрити запис"}>
            <Button
              type="text"
              icon={<EditOutlined/>}
              disabled={item.isDeleted}
              onClick={() => router.push(`${REVISION_TABLES[item.collection].url}?edit=${item.recordId}`)}
              aria-label="Відкрити запис"
            />
          </Tooltip>
          <Tooltip title="Уся історія запису">
            <Button type="text" icon={<HistoryOutlined/>} onClick={() => setHistoryItem(item)} aria-label="Історія запису"/>
          </Tooltip>
        </Flex>
      )
    }
  ];

  return (
    <Flex vertical gap="middle" className={fillHeight.fill}>
      <Flex gap="small" wrap align="center">
        <Input
          placeholder="Назва запису"
          prefix={<SearchOutlined/>}
          allowClear
          style={{flex: "1 1 200px", maxWidth: 300}}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="Усі таблиці"
          style={{flex: "1 1 220px", maxWidth: 360}}
          value={query.tables ?? []}
          options={tables.map((collection) => ({value: collection, label: REVISION_TABLES[collection].name}))}
          onChange={(value) => void setQuery({tables: value.length ? value : null, page: 1})}
        />
        <Select
          allowClear
          placeholder="Усі автори"
          style={{flex: "0 1 200px", minWidth: 160}}
          value={query.author}
          options={log?.authors.map((author) => ({value: author.id, label: author.name}))}
          onChange={(value) => void setQuery({author: value ?? null, page: 1})}
        />
        <DatePicker.RangePicker
          value={[query.from ? dayjs(query.from) : null, query.to ? dayjs(query.to) : null]}
          onChange={(dates) => void setQuery({
            from: dates?.[0]?.startOf("day").toISOString() ?? null,
            to: dates?.[1]?.endOf("day").toISOString() ?? null,
            page: 1
          })}
          allowEmpty={[true, true]}
          placeholder={["Від", "До"]}
        />
        <Tooltip title="Оновити">
          <Button icon={<ReloadOutlined/>} onClick={load} style={{marginLeft: "auto"}} aria-label="Оновити"/>
        </Tooltip>
      </Flex>
      <Table<IRevisionLogItem>
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={log?.items ?? []}
        loading={isLoading}
        className={fillHeight.table}
        scroll={{x: 900, y: "100%"}}
        tableLayout="fixed"
        expandable={{
          expandRowByClick: true,
          expandedRowRender: (item) => <LogItemCompare item={item}/>
        }}
        locale={{emptyText: "Змін не знайдено"}}
        pagination={{
          current: query.page,
          pageSize: PAGE_SIZE,
          total: log?.total ?? 0,
          showSizeChanger: false,
          showTotal: (total) => `Всього: ${total}`,
          onChange: (page) => void setQuery({page})
        }}
        onRow={() => ({style: {cursor: "pointer"}})}
      />
      {historyItem && (
        <RevisionHistoryDrawer
          collection={historyItem.collection}
          recordId={historyItem.recordId}
          recordName={historyItem.recordName}
          onClose={() => setHistoryItem(null)}
          fieldLabels={REVISION_TABLES[historyItem.collection].fieldLabels}
          mode="record"
          onRestored={load}
        />
      )}
    </Flex>
  )
}
