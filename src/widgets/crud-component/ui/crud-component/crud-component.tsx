"use client"

import {ReactNode, useEffect, useState, useTransition} from "react";
import {usePathname, useRouter} from "next/navigation";
import {App, Flex, TableColumnsType} from "antd";
import CrudToolbar from "../crud-toolbar/crud-toolbar";
import CrudTable from "../crud-table/crud-table";
import CrudDrawer from "../crud-drawer/crud-drawer";
import CrudActionsDropdown from "../crud-actions-dropdown/crud-actions-dropdown";
import EllipsisCell from "../ellipsis-cell/ellipsis-cell";
import {CrudDrawerMode, IAdditionalMenuItem, IAdditionalToolbarButton, ICrudImportExport} from "../../types/type";
import {useCrudImportExport} from "../../model/use-crud-import-export";
import {useServerTableQuery} from "../../model/use-server-table-query";
import {PAGE_SIZE_OPTIONS} from "@/shared/types/page-query";

interface IProps<T extends object> {
  columns: TableColumnsType<T>;
  data: T[] | undefined;
  selectedRows: T[];
  setSelectedRows: (rows: T[]) => void;
  children: ReactNode;
  keyField?: keyof T & string;
  create: (data: T) => Promise<void>;
  update: (data: T) => Promise<void>;
  remove: (data: T[]) => Promise<void>;
  refresh?: () => void;
  isLoading?: boolean;
  pagination?: {total: number; page: number; pageSize: number};
  serverSearch?: boolean;
  search?: (data: T[], query: string) => T[];
  getRecordName?: (record: T) => string;
  additionalToolbarButtons?: IAdditionalToolbarButton[];
  importExport?: ICrudImportExport;
  additionalDropdownMenuItems?: IAdditionalMenuItem<T>[];
}

interface IDrawerState<T> {
  mode: CrudDrawerMode;
  record?: T;
}

const DRAWER_TITLES: Record<CrudDrawerMode, string> = {
  create: "Створити",
  copy: "Копіювати",
  edit: "Редагувати"
};

const SERVICE_FIELDS = ["__v", "createdAt", "updatedAt"];

function withEllipsis<T>(columns: TableColumnsType<T>): TableColumnsType<T> {
  return columns.map((column) => {
    if ("children" in column)
      return {...column, children: withEllipsis(column.children)};

    if (column.render && !column.ellipsis)
      return column;

    return {
      ...column,
      ellipsis: {showTitle: false},
      render: (value: unknown, record: T, index: number) => {
        const content = column.render ? column.render(value, record, index) : value;

        if (typeof content != "string" && typeof content != "number")
          return content as never;

        return <EllipsisCell>{content}</EllipsisCell>;
      }
    };
  });
}

export default function CrudComponent<T extends object>(props: IProps<T>) {
  const {notification, modal} = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshing, startRefresh] = useTransition();

  const keyField = (props.keyField ?? "_id") as keyof T & string;

  const [drawer, setDrawer] = useState<IDrawerState<T> | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isServerMode = props.pagination != null;
  const serverQuery = useServerTableQuery<T>();

  const data = props.data ?? [];
  const query = searchQuery.trim().toLowerCase();
  const filteredData = !isServerMode && props.search && query ? props.search(data, query) : data;

  const serverQueryKey = JSON.stringify(serverQuery.query);

  useEffect(() => {
    if (isServerMode)
      props.setSelectedRows([]);
  }, [serverQueryKey]);

  const withServerSortOrder = (columns: TableColumnsType<T>): TableColumnsType<T> => columns.map((column) => (
    "sorter" in column && column.sorter ?
      {...column, sorter: true, sortOrder: column.key == serverQuery.query.sort ? serverQuery.query.order : null} :
      column
  ));

  const refresh = () => {
    props.setSelectedRows([]);
    startRefresh(() => props.refresh ? props.refresh() : router.refresh());
  }

  const openCreate = () => {
    props.setSelectedRows([]);
    setDrawer({mode: "create"});
  }

  const openCopy = (record: T | undefined = props.selectedRows[0]) => {
    if (record)
      setDrawer({mode: "copy", record});
  }

  const openEdit = (record: T | undefined = props.selectedRows[0]) => {
    if (record)
      setDrawer({mode: "edit", record});
  }

  const withoutServiceFields = (record: T) => Object.fromEntries(
    Object.entries(record).filter(([key]) => key != keyField && !SERVICE_FIELDS.includes(key))
  ) as Partial<T>;

  const getInitialValues = (): Partial<T> => {
    if (drawer?.mode == "edit" && drawer.record)
      return drawer.record;

    if (drawer?.mode == "copy" && drawer.record)
      return withoutServiceFields(drawer.record);

    return {};
  }

  const submit = async (values: T): Promise<boolean> => {
    if (!drawer)
      return false;

    const isEdit = drawer.mode == "edit";

    try {
      if (isEdit) {
        await props.update({...values, [keyField]: drawer.record![keyField]});
      }
      else {
        const source = drawer.mode == "copy" && drawer.record ? withoutServiceFields(drawer.record) : {};
        const {[keyField]: _, ...record} = {...source, ...values};
        await props.create(record as T);
      }
    }
    catch (error) {
      notification.error({
        title: isEdit ? "Помилка збереження" : "Помилка створення",
        description: (error as Error).message
      });
      return false;
    }

    notification.success({title: isEdit ? "Успішно збережено" : "Успішно створено"});
    setDrawer(null);
    refresh();
    return true;
  }

  const remove = (rows: T[] = props.selectedRows) => {
    if (rows.length == 0)
      return;

    const name = rows.length == 1 ? props.getRecordName?.(rows[0]) : undefined;

    modal.confirm({
      title: "Видалити",
      content: rows.length == 1 ?
        (name ? `Видалити «${name}»?` : "Видалити вибраний запис?") :
        `Видалити вибрані записи (${rows.length})?`,
      okText: "Видалити",
      okButtonProps: {danger: true},
      cancelText: "Відмінити",
      onOk: async () => {
        try {
          await props.remove(rows);
        }
        catch (error) {
          notification.error({title: "Помилка видалення", description: (error as Error).message});
          return;
        }

        notification.success({title: "Успішно видалено"});
        refresh();
      }
    });
  }

  const importExport = useCrudImportExport({
    config: props.importExport,
    selectedIds: props.selectedRows.map((row) => String(row[keyField])),
    search: isServerMode ? serverQuery.query.q ?? undefined : searchQuery.trim() || undefined,
    onImported: refresh
  });

  const columns: TableColumnsType<T> = [
    ...withEllipsis(isServerMode ? withServerSortOrder(props.columns) : props.columns),
    {
      title: "Дії",
      key: "actions",
      fixed: "right",
      width: 48,
      render: (_, record) => (
        <CrudActionsDropdown<T>
          value={record}
          additionalMenuItems={props.additionalDropdownMenuItems}
          onSelect={(value) => props.setSelectedRows([value])}
          onEdit={openEdit}
          onCopy={openCopy}
          onRemove={remove}
        />
      )
    }
  ];

  return (
    <Flex vertical gap="middle" style={{width: "100%"}}>
      <CrudToolbar
        selectedCount={props.selectedRows.length}
        onAdd={openCreate}
        onCopy={() => openCopy()}
        onEdit={() => openEdit()}
        onRemove={() => remove()}
        onRefresh={refresh}
        additionalButtons={props.additionalToolbarButtons}
        importExport={importExport.isEnabled ? {
          selectedCount: props.selectedRows.length,
          isExporting: importExport.isExporting,
          onExport: importExport.exportRecords,
          onImport: importExport.openFilePicker
        } : undefined}
        showSearch={isServerMode ? props.serverSearch == true : props.search != null}
        searchQuery={isServerMode ? serverQuery.searchInput : searchQuery}
        setSearchQuery={isServerMode ? serverQuery.setSearchInput : setSearchQuery}
        foundCount={isServerMode ? props.pagination!.total : filteredData.length}
        totalCount={isServerMode ? undefined : data.length}
      />
      <CrudTable<T>
        columns={columns}
        storageKey={pathname}
        data={filteredData}
        isLoading={(props.isLoading ?? false) || isRefreshing || serverQuery.isPending}
        pagination={isServerMode ? {
          current: props.pagination!.page,
          pageSize: props.pagination!.pageSize,
          total: props.pagination!.total,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всього: ${total}`
        } : {
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total) => `Всього: ${total}`
        }}
        onChange={isServerMode ? serverQuery.onTableChange : undefined}
        keyField={keyField}
        selectedRows={props.selectedRows}
        setSelectedRows={props.setSelectedRows}
        onRowDoubleClick={(record) => {
          props.setSelectedRows([record]);
          openEdit(record);
        }}
      />
      <CrudDrawer<T>
        isOpen={drawer != null}
        title={drawer ? DRAWER_TITLES[drawer.mode] : ""}
        initialValues={getInitialValues()}
        onSubmit={submit}
        onClose={() => setDrawer(null)}
      >
        {props.children}
      </CrudDrawer>
      {importExport.elements}
    </Flex>
  )
}
