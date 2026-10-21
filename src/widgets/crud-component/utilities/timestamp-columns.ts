import {TableColumnsType} from "antd";
import {dateStringSorter} from "@/shared/utilities/sorters";
import formatDate from "@/shared/utilities/format-date";

type TimestampField = "createdAt" | "updatedAt";

const TIMESTAMP_COLUMN_WIDTH = 185;

const timestampColumn = <T extends object>(field: TimestampField, title: string, sorterTitle: string): TableColumnsType<T>[number] => ({
  title,
  dataIndex: field,
  key: field,
  width: TIMESTAMP_COLUMN_WIDTH,
  ellipsis: true,
  render: (date?: string) => date ? formatDate(date, "DD.MM.YYYY, HH:mm:ss") : "",
  sorter: (a, b) => dateStringSorter((a as Record<TimestampField, string>)[field], (b as Record<TimestampField, string>)[field]),
  showSorterTooltip: {title: sorterTitle}
});

export function timestampColumns<T extends object>(): TableColumnsType<T> {
  return [
    timestampColumn<T>("createdAt", "Створено", "Сортування за датою створення"),
    timestampColumn<T>("updatedAt", "Оновлено", "Сортування за датою редагування"),
  ];
}
