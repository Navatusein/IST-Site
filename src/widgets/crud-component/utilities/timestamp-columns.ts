import {TableColumnsType} from "antd";
import {dateStringSorter} from "@/shared/utilities/sorters";

type TimestampField = "createdAt" | "updatedAt";

const TIMESTAMP_COLUMN_WIDTH = 185;

const timestampColumn = <T extends object>(field: TimestampField, title: string, sorterTitle: string): TableColumnsType<T>[number] => ({
  title,
  dataIndex: field,
  key: field,
  width: TIMESTAMP_COLUMN_WIDTH,
  ellipsis: true,
  render: (date?: string) => date ? new Date(date).toLocaleString() : "",
  sorter: (a, b) => dateStringSorter((a as Record<TimestampField, string>)[field], (b as Record<TimestampField, string>)[field]),
  showSorterTooltip: {title: sorterTitle}
});

export function timestampColumns<T extends object>(): TableColumnsType<T> {
  return [
    timestampColumn<T>("createdAt", "Створено", "Сортування за датою створення"),
    timestampColumn<T>("updatedAt", "Оновлено", "Сортування за датою редагування"),
  ];
}
