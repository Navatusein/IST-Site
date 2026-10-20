import {Button, Flex, Input, theme, Tooltip, Typography} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {IAdditionalToolbarButton} from "../../types/type";

interface IProps {
  selectedCount: number;
  onAdd: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onRefresh: () => void;
  additionalButtons?: IAdditionalToolbarButton[];
  importExport?: {
    selectedCount: number;
    isExporting: boolean;
    onExport: () => void;
    onImport: () => void;
  };
  showSearch: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  foundCount: number;
  totalCount?: number;
}

export default function CrudToolbar(props: IProps) {
  const {token: {paddingXS, padding}} = theme.useToken();

  return (
    <Flex gap={padding} justify="space-between" align="center" wrap>
      <Flex gap={paddingXS} wrap>
        <Tooltip title="Оновити дані">
          <Button icon={<ReloadOutlined/>} onClick={props.onRefresh}>
            Оновити
          </Button>
        </Tooltip>
        <Tooltip title="Створити новий запис">
          <Button icon={<PlusOutlined/>} onClick={props.onAdd}>
            Створити
          </Button>
        </Tooltip>
        <Tooltip title="Створити копію вибраного запису">
          <Button icon={<CopyOutlined/>} onClick={props.onCopy} disabled={props.selectedCount != 1}>
            Копіювати
          </Button>
        </Tooltip>
        <Tooltip title="Редагувати вибраний запис (або двічі клацніть по рядку)">
          <Button icon={<EditOutlined/>} onClick={props.onEdit} disabled={props.selectedCount != 1}>
            Редагувати
          </Button>
        </Tooltip>
        {props.additionalButtons?.map((button) => (
          <Tooltip title={button.tooltip} key={button.key ?? button.label}>
            <Button icon={button.icon} onClick={button.onClick} disabled={button.disabled} danger={button.danger}>
              {button.label}
            </Button>
          </Tooltip>
        ))}
        <Tooltip title="Видалити вибрані записи">
          <Button icon={<DeleteOutlined/>} onClick={props.onRemove} danger disabled={props.selectedCount == 0}>
            Видалити
          </Button>
        </Tooltip>
        {props.importExport && (
          <>
            <Tooltip title={props.importExport.selectedCount != 0 ?
              "Завантажити вибрані записи у файл JSON" :
              "Завантажити всі записи (з урахуванням пошуку) у файл JSON"}>
              <Button icon={<DownloadOutlined/>} onClick={props.importExport.onExport} loading={props.importExport.isExporting}>
                {props.importExport.selectedCount != 0 ? `Експорт (${props.importExport.selectedCount})` : "Експорт"}
              </Button>
            </Tooltip>
            <Tooltip title="Завантажити записи з файлу JSON: спочатку буде показано, що зміниться">
              <Button icon={<UploadOutlined/>} onClick={props.importExport.onImport}>
                Імпорт
              </Button>
            </Tooltip>
          </>
        )}
      </Flex>
      {props.showSearch && (
        <Flex gap={paddingXS} align="center" wrap>
          {props.searchQuery.trim() && (
            <Typography.Text type="secondary">
              Знайдено: {props.foundCount}{props.totalCount != null && ` з ${props.totalCount}`}
            </Typography.Text>
          )}
          <Input
            placeholder="Пошук"
            prefix={<SearchOutlined/>}
            allowClear
            style={{width: 220}}
            value={props.searchQuery}
            onChange={(event) => props.setSearchQuery(event.target.value)}
          />
        </Flex>
      )}
    </Flex>
  )
}
