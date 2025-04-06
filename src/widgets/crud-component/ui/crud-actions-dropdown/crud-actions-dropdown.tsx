import {Button, Dropdown, MenuProps} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined} from "@ant-design/icons";
import {Dispatch, SetStateAction} from "react";

interface IProps<T> {
  value: T;
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
  onEdit: () => void;
  onCopy: () => void;
  onRemove: (rows?: T[]) => void;
}

const DROPDOWN_ITEMS: MenuProps["items"] = [
  {
    key: "edit",
    label: "Редагувати",
    icon: <EditOutlined/>
  },
  {
    key: "copy",
    label: "Копіювати",
    icon: <CopyOutlined/>
  },
  {
    key: "remove",
    label: "Видалити",
    icon: <DeleteOutlined/>,
    danger: true,
  },
];

export default function CrudActionsDropdown<T>(props: IProps<T>) {

  const selectOption = (key: string) => {
    props.setSelectedRows(() => [props.value]);

    switch (key) {
      case "edit":
        props.onEdit();
        break;
      case "copy":
        props.onCopy();
        break;
      case "remove":
        props.onRemove([props.value]);
        break;
    }
  }

  return (
    <Dropdown menu={{items: DROPDOWN_ITEMS, onClick: (e) => selectOption(e.key)}}>
      <Button icon={<EllipsisOutlined/>}/>
    </Dropdown>
  )
}
