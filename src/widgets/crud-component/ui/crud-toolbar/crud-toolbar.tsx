import {ReactNode, useEffect, useRef, useState} from "react";
import {Button, Dropdown, Flex, Input, MenuProps, theme, Tooltip, Typography} from "antd";
import {DownloadOutlined, EllipsisOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UploadOutlined} from "@ant-design/icons";
import {ICrudPageAction} from "../../types/type";

interface IProps {
  onAdd: () => void;
  onRefresh: () => void;
  pageActions?: ICrudPageAction[];
  importExport?: {
    isExporting: boolean;
    onExport: () => void;
    onImport: () => void;
  };
  notice?: ReactNode;
  showSearch: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  foundCount: number;
  totalCount?: number;
}

export const CRUD_BAR_HEIGHT = 40;

const BASE_WIDTH = 640;
const getButtonWidth = (label: string) => 48 + label.length * 8;
const NARROW_WIDTH = 480;

export default function CrudToolbar(props: IProps) {
  const {token: {paddingXS}} = theme.useToken();

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const element = toolbarRef.current;

    if (!element)
      return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const exportLabel = props.searchQuery.trim() ? "Експорт знайдених" : "Експорт";

  const actions: ICrudPageAction[] = [
    ...(props.pageActions ?? []),
    ...(props.importExport ? [
      {key: "export", label: exportLabel, icon: <DownloadOutlined/>, onClick: props.importExport.onExport},
      {key: "import", label: "Імпорт", icon: <UploadOutlined/>, onClick: props.importExport.onImport}
    ] : [])
  ];

  const actionsWidth = actions.reduce((sum, action) => sum + getButtonWidth(action.label), 0);
  const isInline = width != 0 && width >= BASE_WIDTH + actionsWidth;
  const isNarrow = width != 0 && width < NARROW_WIDTH;

  const menuItems: MenuProps["items"] = actions.map((action) => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    disabled: action.key == "export" && props.importExport?.isExporting,
    onClick: action.onClick
  }));

  return (
    <Flex ref={toolbarRef} gap={paddingXS} align="center" wrap style={{minHeight: CRUD_BAR_HEIGHT}}>
      <Tooltip title={isNarrow ? "Створити" : undefined}>
        <Button type="primary" icon={<PlusOutlined/>} onClick={props.onAdd} aria-label="Створити" style={{flexShrink: 0}}>
          {!isNarrow && "Створити"}
        </Button>
      </Tooltip>
      {props.showSearch && (
        <Input
          placeholder="Пошук"
          prefix={<SearchOutlined/>}
          allowClear
          style={{flex: "1 1 160px", maxWidth: 360}}
          value={props.searchQuery}
          onChange={(event) => props.setSearchQuery(event.target.value)}
        />
      )}
      {props.showSearch && props.searchQuery.trim() && (
        <Typography.Text type="secondary" style={{whiteSpace: "nowrap"}}>
          Знайдено: {props.foundCount}{props.totalCount != null && ` з ${props.totalCount}`}
        </Typography.Text>
      )}
      {props.notice}
      <Flex gap={paddingXS} style={{marginLeft: "auto", flexShrink: 0}}>
        {isInline && actions.map((action) => (
          <Button
            key={action.key}
            icon={action.icon}
            danger={action.danger}
            loading={action.key == "export" && props.importExport?.isExporting}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
        <Tooltip title="Оновити дані">
          <Button icon={<ReloadOutlined/>} onClick={props.onRefresh} aria-label="Оновити дані"/>
        </Tooltip>
        {!isInline && menuItems.length != 0 && (
          <Dropdown trigger={["click"]} placement="bottomRight" menu={{items: menuItems}}>
            <Tooltip title="Інші дії">
              <Button
                icon={props.importExport?.isExporting ? undefined : <EllipsisOutlined/>}
                loading={props.importExport?.isExporting}
                aria-label="Інші дії"
              />
            </Tooltip>
          </Dropdown>
        )}
      </Flex>
    </Flex>
  )
}
