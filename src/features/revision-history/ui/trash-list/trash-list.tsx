"use client"

import {useEffect, useRef, useState} from "react";
import {App, Button, Flex, Input, Popconfirm, Select, Table, TableColumnsType, Tag, theme, Tooltip, Typography} from "antd";
import {ClearOutlined, CloseOutlined, DeleteOutlined, ReloadOutlined, RollbackOutlined, SearchOutlined} from "@ant-design/icons";
import {parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates} from "nuqs";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import {RevisionCollection} from "@/shared/types/revision";
import {ITrashItem, ITrashPage} from "@/shared/types/trash";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import formatDate from "@/shared/utilities/format-date";
import {deleteFromTrashAction, emptyTrashAction, getTrashAction, restoreFromTrashAction} from "../../actions/trash-actions";
import {REVISION_TABLES} from "../../model/revision-tables";
import {ActionBar} from "@/shared/ui-kit";
import {ACTION_BAR_HEIGHT} from "@/shared/ui-kit/action-bar/action-bar";
import fillHeight from "@/shared/styles/fill-height.module.scss";

const PAGE_SIZE = 20;
const DAY = 24 * 60 * 60 * 1000;

const TRASH_QUERY = {
  tables: parseAsArrayOf(parseAsString),
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
};

function getDaysLeft(expiresAt: string): number {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / DAY));
}

export default function TrashList() {
  const {token} = theme.useToken();
  const {notification} = App.useApp();
  const {userPermissions} = useUserPermissions();

  const [query, setQuery] = useQueryStates(TRASH_QUERY, {history: "replace"});
  const [search, setSearch] = useState<string>(query.q ?? "");
  const [trash, setTrash] = useState<ITrashPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const requestId = useRef<number>(0);

  const canDelete = userPermissions.includes("manage-trash");

  const tables = (Object.keys(REVISION_TABLES) as RevisionCollection[])
    .filter((collection) => userPermissions.includes(REVISION_TABLES[collection].permission));

  const load = () => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setSelectedIds([]);

    unwrapServerAction(getTrashAction({
      collections: query.tables?.length ? query.tables as RevisionCollection[] : undefined,
      search: query.q ?? undefined,
      page: query.page,
      pageSize: PAGE_SIZE
    }))
      .then((result) => {
        if (currentRequestId == requestId.current)
          setTrash(result);
      })
      .catch((error) => {
        if (currentRequestId == requestId.current)
          notification.error({title: "Не вдалося завантажити кошик", description: error.message});
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

  const restore = async (ids: string[]) => {
    try {
      const result = await unwrapServerAction(restoreFromTrashAction(ids));

      if (result.restored)
        notification.success({title: result.restored == 1 ? "Запис відновлено" : `Відновлено записів: ${result.restored}`});

      if (result.errors.length)
        notification.warning({title: "Деякі записи не відновлено", description: result.errors.join("\n")});
    }
    catch (error) {
      notification.error({title: "Не вдалося відновити", description: (error as Error).message});
    }

    load();
  }

  const remove = async (ids: string[]) => {
    try {
      await unwrapServerAction(deleteFromTrashAction(ids));
      notification.success({title: ids.length == 1 ? "Запис видалено назавжди" : `Видалено назавжди: ${ids.length}`});
    }
    catch (error) {
      notification.error({title: "Не вдалося видалити", description: (error as Error).message});
    }

    load();
  }

  const emptyTrash = async () => {
    try {
      await unwrapServerAction(emptyTrashAction());
      notification.success({title: "Кошик очищено"});
    }
    catch (error) {
      notification.error({title: "Не вдалося очистити кошик", description: (error as Error).message});
    }

    load();
  }

  const columns: TableColumnsType<ITrashItem> = [
    {
      title: "Запис",
      key: "record",
      ellipsis: true,
      render: (_, item) => <Typography.Text strong ellipsis>{item.recordName}</Typography.Text>
    },
    {
      title: "Таблиця",
      key: "collection",
      width: 170,
      render: (_, item) => <Tag style={{marginInlineEnd: 0}}>{REVISION_TABLES[item.collection].name}</Tag>
    },
    {
      title: "Видалено",
      key: "deletedAt",
      width: 170,
      render: (_, item) => formatDate(item.deletedAt, "D MMM YYYY, HH:mm")
    },
    {
      title: "Хто видалив",
      key: "deletedBy",
      width: 160,
      ellipsis: true,
      render: (_, item) => item.deletedByName ?? "—"
    },
    {
      title: "Залишилось",
      key: "expiresAt",
      width: 120,
      render: (_, item) => {
        const days = getDaysLeft(item.expiresAt);

        return (
          <Tooltip title={`Буде видалено назавжди ${formatDate(item.expiresAt, "D MMMM YYYY")}`}>
            <Typography.Text type={days <= 3 ? "danger" : undefined}>{days} дн.</Typography.Text>
          </Tooltip>
        );
      }
    },
    {
      title: "Дії",
      key: "actions",
      width: 84,
      render: (_, item) => (
        <Flex gap={4}>
          <Tooltip title="Відновити">
            <Button type="text" icon={<RollbackOutlined/>} onClick={() => restore([item.id])} aria-label="Відновити"/>
          </Tooltip>
          {canDelete && (
            <Popconfirm
              title="Видалити назавжди?"
              description="Відновити запис уже не вийде"
              okText="Видалити"
              okButtonProps={{danger: true}}
              cancelText="Ні"
              onConfirm={() => remove([item.id])}
            >
              <Tooltip title="Видалити назавжди">
                <Button type="text" danger icon={<DeleteOutlined/>} aria-label="Видалити назавжди"/>
              </Tooltip>
            </Popconfirm>
          )}
        </Flex>
      )
    }
  ];

  return (
    <Flex vertical gap="middle" className={fillHeight.fill}>
      {selectedIds.length != 0 ? (
        <ActionBar>
          <Typography.Text strong style={{marginRight: token.paddingXS}}>Вибрано: {selectedIds.length}</Typography.Text>
          <Button icon={<RollbackOutlined/>} onClick={() => restore(selectedIds)}>Відновити</Button>
          {canDelete && (
            <Popconfirm
              title={`Видалити назавжди (${selectedIds.length})?`}
              description="Відновити ці записи вже не вийде"
              okText="Видалити"
              okButtonProps={{danger: true}}
              cancelText="Ні"
              onConfirm={() => remove(selectedIds)}
            >
              <Button danger icon={<DeleteOutlined/>}>Видалити назавжди</Button>
            </Popconfirm>
          )}
          <Tooltip title="Зняти виділення">
            <Button type="text" icon={<CloseOutlined/>} onClick={() => setSelectedIds([])} style={{marginLeft: "auto"}} aria-label="Зняти виділення"/>
          </Tooltip>
        </ActionBar>
      ) : (
        <Flex gap="small" wrap align="center" style={{minHeight: ACTION_BAR_HEIGHT}}>
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
          <Flex gap="small" style={{marginLeft: "auto"}}>
            {canDelete && (
              <Popconfirm
                title="Очистити кошик?"
                description="Усі записи в кошику буде видалено назавжди"
                okText="Очистити"
                okButtonProps={{danger: true}}
                cancelText="Ні"
                onConfirm={emptyTrash}
                disabled={!trash?.total}
              >
                <Button danger icon={<ClearOutlined/>} disabled={!trash?.total}>Очистити кошик</Button>
              </Popconfirm>
            )}
            <Tooltip title="Оновити">
              <Button icon={<ReloadOutlined/>} onClick={load} aria-label="Оновити"/>
            </Tooltip>
          </Flex>
        </Flex>
      )}
      <Table<ITrashItem>
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={trash?.items ?? []}
        loading={isLoading}
        className={fillHeight.table}
        scroll={{x: 800, y: "100%"}}
        tableLayout="fixed"
        rowSelection={{selectedRowKeys: selectedIds, onChange: (keys) => setSelectedIds(keys.map(String))}}
        locale={{emptyText: "Кошик порожній"}}
        pagination={{
          current: query.page,
          pageSize: PAGE_SIZE,
          total: trash?.total ?? 0,
          showSizeChanger: false,
          showTotal: (total) => `Всього: ${total}`,
          onChange: (page) => void setQuery({page})
        }}
      />
    </Flex>
  )
}
