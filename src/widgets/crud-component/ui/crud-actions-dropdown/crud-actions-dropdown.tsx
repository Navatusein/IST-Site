import {MouseEvent} from "react";
import {Button, Dropdown, Flex, MenuProps, Tooltip} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined} from "@ant-design/icons";
import {ICrudRowAction} from "../../types/type";

interface IProps<T> {
  value: T;
  rowActions?: ICrudRowAction<T>[];
  onSelect: (record: T) => void;
  onEdit: (record: T) => void;
  onCopy: (record: T) => void;
  onRemove: (rows: T[]) => void;
}

const ACTION_BUTTON_WIDTH = 32;

export function getCrudActionsColumnWidth(hasPrimary: boolean): number {
  const buttons = hasPrimary ? 3 : 2;
  return buttons * ACTION_BUTTON_WIDTH + (buttons - 1) * 4 + 16;
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

export default function CrudActionsDropdown<T>(props: IProps<T>) {
  const primary = props.rowActions?.find((action) => action.primary);

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: "Редагувати",
      icon: <EditOutlined/>,
      onClick: () => props.onEdit(props.value)
    },
    ...(props.rowActions ?? []).map((action) => ({
      key: action.key,
      label: action.label,
      icon: action.icon,
      danger: action.danger,
      onClick: () => action.onClick(props.value)
    })),
    {
      key: "copy",
      label: "Копіювати",
      icon: <CopyOutlined/>,
      onClick: () => props.onCopy(props.value)
    },
    {type: "divider"},
    {
      key: "remove",
      label: "Видалити",
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: () => props.onRemove([props.value])
    }
  ];

  return (
    <Flex gap={4} justify="flex-end" onClick={stopPropagation} onDoubleClick={stopPropagation}>
      {primary && (
        <Tooltip title={primary.label}>
          <Button
            type="text"
            icon={primary.icon}
            onClick={() => {
              props.onSelect(props.value);
              primary.onClick(props.value);
            }}
            aria-label={primary.label}
          />
        </Tooltip>
      )}
      <Tooltip title="Редагувати">
        <Button
          type="text"
          icon={<EditOutlined/>}
          onClick={() => {
            props.onSelect(props.value);
            props.onEdit(props.value);
          }}
          aria-label="Редагувати"
        />
      </Tooltip>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{items: menuItems, onClick: () => props.onSelect(props.value)}}
      >
        <Button type="text" icon={<EllipsisOutlined/>} aria-label="Дії"/>
      </Dropdown>
    </Flex>
  )
}
