import {Button, Popconfirm, Space, Tooltip} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined
} from "@ant-design/icons";

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
        <Button
          icon={<ReloadOutlined/>}
          onClick={() => props.onRefresh}
        >
          Оновити
        </Button>
      </Tooltip>
      <Tooltip title="Створити новий рядок">
        <Button
          icon={<PlusOutlined/>}
          onClick={() => props.onAdd()}
        >
          Створити
        </Button>
      </Tooltip>
      <Tooltip title="Створити копію рядку">
        <Button
          icon={<CopyOutlined/>}
          onClick={() => props.onCopy()}
          disabled={props.selectedRows.length != 1}
        >
          Копіювати
        </Button>
      </Tooltip>
      <Tooltip title="Редагувати вибраний рядок">
        <Button
          icon={<EditOutlined/>}
          onClick={() => props.onEdit()}
          disabled={props.selectedRows.length != 1}
        >
          Редагувати
        </Button>
      </Tooltip>
      <Tooltip title="Видалити вибрані рядки">
        <Button
          icon={<DeleteOutlined/>}
          onClick={() => props.onRemove()}
          danger
          disabled={props.selectedRows.length == 0}
        >
          Видалити
        </Button>
      </Tooltip>
    </Space>
  )
}
