"use client"

import {ReactNode, useEffect, useRef, useState, useTransition} from "react";
import {usePathname, useRouter} from "next/navigation";
import {App, Flex, TableColumnsType} from "antd";
import {parseAsBoolean, parseAsString, useQueryStates} from "nuqs";
import CrudToolbar from "../crud-toolbar/crud-toolbar";
import CrudTable from "../crud-table/crud-table";
import CrudDrawer from "../crud-drawer/crud-drawer";
import CrudActionsDropdown, {getCrudActionsColumnWidth} from "../crud-actions-dropdown/crud-actions-dropdown";
import CrudSelectionBar from "../crud-selection-bar/crud-selection-bar";
import EllipsisCell from "../ellipsis-cell/ellipsis-cell";
import {CrudDrawerMode, ICrudImportExport, ICrudPageAction, ICrudRowAction} from "../../types/type";
import {useCrudImportExport} from "../../hooks/use-crud-import-export";
import {useServerTableQuery} from "../../hooks/use-server-table-query";
import {PAGE_SIZE_OPTIONS} from "@/shared/types/page-query";
import {AdminPageHeader} from "@/shared/ui-kit";
import fillHeight from "@/shared/styles/fill-height.module.scss";

interface IProps<T extends object> {
  title: string;
  description?: ReactNode;
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
  importExport?: ICrudImportExport;
  rowActions?: ICrudRowAction<T>[];
  pageActions?: ICrudPageAction[];
  trash?: boolean;
  fillColumns?: number | string[];
  notice?: ReactNode;
  getRecord?: (id: string) => Promise<T | null>;
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

function getFillColumnKeys<T>(columns: TableColumnsType<T>, fillColumns: number | string[] = 1): string[] {
  if (Array.isArray(fillColumns))
    return fillColumns;

  return columns
    .filter((column) => column.key != null)
    .slice(0, fillColumns)
    .map((column) => String(column.key));
}

const SERVICE_FIELDS = ["__v", "createdAt", "updatedAt"];

const FORM_QUERY = {
  create: parseAsBoolean,
  edit: parseAsString,
  copy: parseAsString,
};

function findRecord<T extends object>(rows: T[], keyField: keyof T & string, id: string): T | undefined {
  for (const row of rows) {
    if (String(row[keyField]) == id)
      return row;

    const children = (row as {children?: unknown}).children;
    const found = Array.isArray(children) ? findRecord(children as T[], keyField, id) : undefined;

    if (found)
      return found;
  }
}

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
  const [formSession, setFormSession] = useState<number>(0);
  const formSessionRef = useRef<number>(0);

  const openDrawer = (state: IDrawerState<T>) => {
    setDrawer(state);
    formSessionRef.current += 1;
    setFormSession(formSessionRef.current);
  }
  const [formQuery, setFormQuery] = useQueryStates(FORM_QUERY, {history: "replace"});
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
    openDrawer({mode: "create"});
    void setFormQuery({create: true, edit: null, copy: null});
  }

  const openCopy = (record: T | undefined = props.selectedRows[0]) => {
    if (!record)
      return;

    openDrawer({mode: "copy", record});
    void setFormQuery({create: null, edit: null, copy: String(record[keyField])});
  }

  const openEdit = (record: T | undefined = props.selectedRows[0]) => {
    if (!record)
      return;

    openDrawer({mode: "edit", record});
    void setFormQuery({create: null, edit: String(record[keyField]), copy: null});
  }

  const closeDrawer = () => {
    setDrawer(null);
    void setFormQuery({create: null, edit: null, copy: null});
  }

  useEffect(() => {
    if (formQuery.create) {
      if (drawer?.mode != "create")
        openDrawer({mode: "create"});

      return;
    }

    const mode: CrudDrawerMode | null = formQuery.edit ? "edit" : formQuery.copy ? "copy" : null;
    const id = formQuery.edit ?? formQuery.copy;

    if (!mode || !id || (drawer?.mode == mode && String(drawer.record?.[keyField]) == id))
      return;

    const record = findRecord(data, keyField, id);

    if (record) {
      props.setSelectedRows([record]);
      openDrawer({mode, record});
      return;
    }

    let isCancelled = false;

    (props.getRecord?.(id) ?? Promise.resolve(null))
      .catch(() => null)
      .then((loaded) => {
        if (isCancelled)
          return;

        if (loaded) {
          openDrawer({mode, record: loaded});
          return;
        }

        notification.warning({title: "Запис не знайдено", description: "Можливо, його вже видалено"});
        void setFormQuery({create: null, edit: null, copy: null});
      });

    return () => {
      isCancelled = true;
    };
  }, [formQuery.create, formQuery.edit, formQuery.copy]);

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
    const session = formSessionRef.current;

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

    if (session != formSessionRef.current) {
      startRefresh(() => props.refresh ? props.refresh() : router.refresh());
      return true;
    }

    closeDrawer();
    refresh();
    return true;
  }

  const remove = (rows: T[] = props.selectedRows) => {
    if (rows.length == 0)
      return;

    const name = rows.length == 1 ? props.getRecordName?.(rows[0]) : undefined;

    modal.confirm({
      title: "Видалити",
      content: (rows.length == 1 ?
        (name ? `Видалити «${name}»?` : "Видалити вибраний запис?") :
        `Видалити вибрані записи (${rows.length})?`) +
        (props.trash ? " Їх можна буде відновити з кошика протягом 30 днів" : ""),
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
      width: getCrudActionsColumnWidth(props.rowActions?.some((action) => action.primary) == true),
      render: (_, record) => (
        <CrudActionsDropdown<T>
          value={record}
          rowActions={props.rowActions}
          onSelect={(value) => props.setSelectedRows([value])}
          onEdit={openEdit}
          onCopy={openCopy}
          onRemove={remove}
        />
      )
    }
  ];

  return (
    <Flex vertical gap="middle" className={fillHeight.fill} style={{width: "100%"}}>
      <AdminPageHeader
        title={props.title}
        description={props.description}
        style={{marginBottom: 0}}
      />
      {props.selectedRows.length != 0 ? (
        <CrudSelectionBar<T>
          selectedRows={props.selectedRows}
          rowActions={props.rowActions}
          onEdit={openEdit}
          onCopy={openCopy}
          onRemove={remove}
          onClear={() => props.setSelectedRows([])}
          exportSelected={importExport.isEnabled ? {
            isExporting: importExport.isExporting,
            onExport: importExport.exportRecords
          } : undefined}
        />
      ) : (
        <CrudToolbar
          onAdd={openCreate}
          onRefresh={refresh}
          notice={props.notice}
          pageActions={props.pageActions}
          importExport={importExport.isEnabled ? {
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
      )}
      <CrudTable<T>
        columns={columns}
        storageKey={pathname}
        fillColumnKeys={getFillColumnKeys(props.columns, props.fillColumns)}
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
        key={formSession}
        isOpen={drawer != null}
        title={drawer ? DRAWER_TITLES[drawer.mode] : ""}
        initialValues={getInitialValues()}
        onSubmit={submit}
        onClose={closeDrawer}
      >
        {props.children}
      </CrudDrawer>
      {importExport.elements}
    </Flex>
  )
}
