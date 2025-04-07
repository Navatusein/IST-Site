import {Button, Dropdown, MenuProps} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined} from "@ant-design/icons";
import {Dispatch, SetStateAction, useMemo} from "react";
import {IAdditionalMenuItem} from "@/widgets/crud-component/types/type";

interface IProps<T> {
  value: T;
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
  additionalMenuItems?: IAdditionalMenuItem<T>[];
  onEdit: () => void;
  onCopy: () => void;
  onRemove: (rows?: T[]) => void;
}

export default function CrudActionsDropdown<T>(props: IProps<T>) {


  const menuItems = useMemo<MenuProps["items"]>(() => ([
    ...(props.additionalMenuItems?.map((menuItem, index) => ({
      ...menuItem,
      onClick: () => menuItem.onClick([props.value])
    } as never)) ?? []),
    {
      key: "edit",
      label: "Редагувати",
      icon: <EditOutlined/>,
      onClick: () => props.onEdit()
    },
    {
      key: "copy",
      label: "Копіювати",
      icon: <CopyOutlined/>,
      onClick: () => props.onCopy()
    },
    {
      key: "remove",
      label: "Видалити",
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: () => props.onRemove([props.value])
    }
  ]), [props.additionalMenuItems]);

  const onMenuItemClick = () => {
    props.setSelectedRows(() => [props.value]);
  }

  return (
    <Dropdown menu={{items: menuItems, onClick: onMenuItemClick}}>
      <Button icon={<EllipsisOutlined/>}/>
    </Dropdown>
  )
}
