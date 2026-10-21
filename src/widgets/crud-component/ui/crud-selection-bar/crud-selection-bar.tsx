import {Button, Flex, theme, Tooltip, Typography} from "antd";
import {CloseOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined} from "@ant-design/icons";
import {ICrudRowAction} from "../../types/type";
import {CRUD_BAR_HEIGHT} from "../crud-toolbar/crud-toolbar";

interface IProps<T> {
  selectedRows: T[];
  rowActions?: ICrudRowAction<T>[];
  onEdit: (record: T) => void;
  onCopy: (record: T) => void;
  onRemove: (rows: T[]) => void;
  onClear: () => void;
  exportSelected?: {
    isExporting: boolean;
    onExport: () => void;
  };
}

export default function CrudSelectionBar<T>(props: IProps<T>) {
  const {token} = theme.useToken();

  const single = props.selectedRows.length == 1 ? props.selectedRows[0] : undefined;

  return (
    <Flex
      gap={token.paddingXS}
      align="center"
      wrap
      style={{
        minHeight: CRUD_BAR_HEIGHT,
        padding: `${token.paddingXXS}px ${token.paddingXXS}px ${token.paddingXXS}px ${token.paddingSM}px`,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorPrimaryBorder}`,
        background: token.colorPrimaryBg
      }}
    >
      <Typography.Text strong style={{marginRight: token.paddingXS}}>
        Вибрано: {props.selectedRows.length}
      </Typography.Text>
      {single && (
        <>
          <Button icon={<EditOutlined/>} onClick={() => props.onEdit(single)}>Редагувати</Button>
          {props.rowActions?.map((action) => (
            <Button key={action.key} icon={action.icon} danger={action.danger} onClick={() => action.onClick(single)}>
              {action.label}
            </Button>
          ))}
          <Button icon={<CopyOutlined/>} onClick={() => props.onCopy(single)}>Копіювати</Button>
        </>
      )}
      {props.exportSelected && (
        <Tooltip title="Завантажити вибрані записи у файл JSON">
          <Button icon={<DownloadOutlined/>} loading={props.exportSelected.isExporting} onClick={props.exportSelected.onExport}>
            Експорт
          </Button>
        </Tooltip>
      )}
      <Button danger icon={<DeleteOutlined/>} onClick={() => props.onRemove(props.selectedRows)}>Видалити</Button>
      <Tooltip title="Зняти виділення">
        <Button type="text" icon={<CloseOutlined/>} onClick={props.onClear} style={{marginLeft: "auto"}} aria-label="Зняти виділення"/>
      </Tooltip>
    </Flex>
  )
}
