import {MouseEvent} from "react";
import {Button, Dropdown, MenuProps} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined} from "@ant-design/icons";
import {IAdditionalMenuItem} from "../../types/type";

interface IProps<T> {
  value: T;
  additionalMenuItems?: IAdditionalMenuItem<T>[];
  onSelect: (record: T) => void;
  onEdit: (record: T) => void;
  onCopy: (record: T) => void;
  onRemove: (rows: T[]) => void;
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

export default function CrudActionsDropdown<T>(props: IProps<T>) {
  const menuItems: MenuProps["items"] = [
    ...(props.additionalMenuItems ?? []).map((menuItem) => ({
      key: menuItem.key,
      label: menuItem.label,
      icon: menuItem.icon,
      danger: menuItem.danger,
      onClick: () => menuItem.onClick([props.value])
    })),
    {
      key: "edit",
      label: "Редагувати",
      icon: <EditOutlined/>,
      onClick: () => props.onEdit(props.value)
    },
    {
      key: "copy",
      label: "Копіювати",
      icon: <CopyOutlined/>,
      onClick: () => props.onCopy(props.value)
    },
    {
      key: "remove",
      label: "Видалити",
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: () => props.onRemove([props.value])
    }
  ];

  return (
    <span onClick={stopPropagation} onDoubleClick={stopPropagation}>
      <Dropdown
        trigger={["click"]}
        menu={{items: menuItems, onClick: () => props.onSelect(props.value)}}
      >
        <Button icon={<EllipsisOutlined/>} aria-label="Дії"/>
      </Dropdown>
    </span>
  )
}
