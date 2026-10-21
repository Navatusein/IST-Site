import {Key, MouseEvent} from "react";
import {Table, TableColumnsType, TablePaginationConfig} from "antd";
import {SorterResult} from "antd/es/table/interface";
import {useLocalStorage} from "@/shared/hooks/use-local-storage";
import ResizableHeaderCell, {IResizableHeaderCellProps} from "../resizable-header-cell/resizable-header-cell";

interface IProps<T extends object> {
  columns: TableColumnsType<T>;
  data: T[];
  isLoading: boolean;
  keyField: keyof T & string;
  selectedRows: T[];
  setSelectedRows: (rows: T[]) => void;
  onRowDoubleClick: (record: T) => void;
  pagination?: TablePaginationConfig;
  onChange?: (pagination: TablePaginationConfig, sorter: SorterResult<T> | SorterResult<T>[]) => void;
  storageKey: string;
  fillColumnKey?: string;
}

const SELECTION_COLUMN_WIDTH = 32;

type ColumnWidths = Record<string, number>;

const NO_WIDTHS: ColumnWidths = {};

const TABLE_COMPONENTS = {header: {cell: ResizableHeaderCell}};

export default function CrudTable<T extends object>(props: IProps<T>) {
  const getKey = (record: T) => record[props.keyField] as Key;

  const [widths, setWidths] = useLocalStorage<ColumnWidths>(`crud-column-widths:${props.storageKey}`, NO_WIDTHS);

  const columns = props.columns.map((column) => {
    const key = column.key == null ? null : String(column.key);

    if (key == null || typeof column.width != "number" || "children" in column)
      return column;

    const defaultWidth = column.width;
    const width = widths[key] ?? defaultWidth;

    return {
      ...column,
      width,
      onHeaderCell: (data: T) => ({
        ...column.onHeaderCell?.(data),
        onResize: (value: number) => setWidths({...widths, [key]: value}),
        onResetWidth: () => {
          const {[key]: _, ...rest} = widths;
          setWidths(rest);
        }
      }) as IResizableHeaderCellProps
    };
  }) as TableColumnsType<T>;

  const selectedRowKeys = props.selectedRows.map(getKey);

  const scrollX = columns.reduce((sum, column) => sum + (typeof column.width == "number" ? column.width : 150), SELECTION_COLUMN_WIDTH);

  const tableColumns = columns.map((column) => (
    props.fillColumnKey != null && column.key == props.fillColumnKey ?
      {...column, width: undefined, onHeaderCell: undefined} :
      column
  )) as TableColumnsType<T>;

  const onRowClick = (event: MouseEvent, record: T) => {
    const isSelectionCell = (event.target as HTMLElement).closest(".ant-table-selection-column") != null;

    if (!event.ctrlKey && !event.metaKey && !isSelectionCell)
      return props.setSelectedRows([record]);

    const key = getKey(record);
    const isSelected = props.selectedRows.some((row) => getKey(row) == key);

    props.setSelectedRows(isSelected ? props.selectedRows.filter((row) => getKey(row) != key) : [...props.selectedRows, record]);
  }

  return (
    <Table<T>
      columns={tableColumns}
      components={TABLE_COMPONENTS}
      dataSource={props.data}
      loading={props.isLoading}
      size="small"
      scroll={{x: scrollX}}
      tableLayout="fixed"
      rowKey={props.keyField}
      pagination={props.pagination}
      onChange={props.onChange ? (pagination, _, sorter) => props.onChange!(pagination, sorter) : undefined}
      rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (_, selectedRows) => props.setSelectedRows(selectedRows),
        renderCell: (checked, record, index, originNode) => (
          <div onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
            {originNode}
          </div>
        )
      }}
      onRow={(record) => ({
        onClick: (event) => onRowClick(event, record),
        onDoubleClick: (event) => {
          if ((event.target as HTMLElement).closest(".ant-table-selection-column") == null)
            props.onRowDoubleClick(record);
        },
        style: {cursor: "pointer", userSelect: "none"}
      })}
    />
  )
}
