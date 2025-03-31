import {Button, Popconfirm, Space, Tooltip} from "antd";

interface IProps<T> {
  selectedRows: T[]
  onAdd: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRefresh: () => void;
}

export default function CrudToolbar<T>(props: IProps<T>) {
  return (
    <Space wrap>
      <Tooltip title="Оновити данні">
        <Button onClick={props.onRefresh}>
          Оновити
        </Button>
      </Tooltip>
      <Tooltip title="Створити новий рядок">
        <Button onClick={props.onAdd}>
          Створити
        </Button>
      </Tooltip>
      <Tooltip title="Створити копію рядку">
        <Button onClick={props.onCopy} disabled={props.selectedRows.length != 1}>
          Копіювати
        </Button>
      </Tooltip>
      <Tooltip title="Редагувати вибраний рядок">
        <Button onClick={props.onEdit} disabled={props.selectedRows.length != 1}>
          Редагувати
        </Button>
      </Tooltip>
      <Popconfirm
        title="Видалити"
        description="Ви впевнені що хочите видалити вибрані рядки ?"
        onConfirm={props.onRemove}
        okText="Так"
        cancelText="Ні"
      >
        <Tooltip title="Видалити вибрані рядки">
          <Button danger disabled={props.selectedRows.length == 0}>
            Видалити
          </Button>
        </Tooltip>
      </Popconfirm>
    </Space>
  )
}
