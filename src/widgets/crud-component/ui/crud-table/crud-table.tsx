import {Table, TableColumnsType} from "antd";
import {Dispatch, Key, SetStateAction, useMemo} from "react";

interface IProps<T> {
  columns: TableColumnsType<T>;
  data: T[] | undefined;
  isLoading: boolean;
  keyField?: string;
  selectedRows: T[];
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
}

export default function CrudTable<T>(props: IProps<T>) {
  const selectedRowKeys = useMemo(() => {
    return props.selectedRows.map((value) => ((value as never)[props.keyField ?? "_id"] ?? ""));
  }, [props.selectedRows]);

  return (
    <Table
      columns={props.columns}
      dataSource={props.data}
      loading={props.isLoading}
      size="small"
      scroll={{x: 1}}
      rowKey={props.keyField ?? "_id"}
      rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: Key[], selectedRows: T[]) => props.setSelectedRows(() => selectedRows),
        renderCell: (checked, record, index, originNode) => (
          <div>
            <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}} onClick={event => event.stopPropagation()}/>
            {originNode}
          </div>
        )
      }}
    />
  )
}
