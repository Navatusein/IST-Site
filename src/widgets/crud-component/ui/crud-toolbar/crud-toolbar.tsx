import {Button, Flex, Input, Space, theme, Tooltip} from "antd";
import {
  ClearOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import styles from "./crud-toolbar.module.scss";

interface IProps<T> {
  selectedRows: T[]
  onAdd: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRefresh: () => void;
  showSearch: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function CrudToolbar<T>(props: IProps<T>) {
  const {token: {paddingXS, padding}} = theme.useToken();

  return (
    <Flex gap={padding} justify="space-between" wrap>
      <Flex gap={paddingXS} wrap>
        <Tooltip title="Оновити данні">
          <Button
            icon={<ReloadOutlined/>}
            onClick={() => props.onRefresh()}
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
      </Flex>
      {props.showSearch &&
        <Space.Compact>
          <Input
            placeholder="Пошук"
            prefix={<SearchOutlined/>}
            style={{width: 200}}
            onChange={(e) => props.setSearchQuery(e.target.value)}
            value={props.searchQuery}
          />
          <Tooltip title="Очистити рядок пошуку">
            <Button
              icon={<ClearOutlined/>}
              onClick={() => props.setSearchQuery("")}
            />
          </Tooltip>
        </Space.Compact>
      }
    </Flex>
  )
}
