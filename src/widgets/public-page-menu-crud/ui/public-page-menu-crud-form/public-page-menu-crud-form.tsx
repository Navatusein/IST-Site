import {Form, Input, InputNumber, TreeSelect} from "antd";
import {IUser} from "@/entities/user";
import {IPublicMenuItem} from "@/entities/public-menu-item";
import {useMemo} from "react";
import {DataNode} from "antd/lib/tree";

interface IProps {
  menuItems: IPublicMenuItem[];
  selectedMenuItemId?: string;
}

export default function PublicPageMenuCrudForm(props: IProps) {
  const mapToTreeData = (menuItems: IPublicMenuItem[]): DataNode[] => {
    const mapMenuItems: DataNode[] = [];
    menuItems
      .sort((a, b) => (a.index - b.index))
      .forEach(menuItem => {
        if (menuItem._id != props.selectedMenuItemId) {
          mapMenuItems.push({
            key: `${menuItem._id}`,
            value: `${menuItem._id}`,
            title: menuItem.label,
            children: menuItem.children ? mapToTreeData(menuItem.children) : undefined
          } as DataNode)
        }
      });

    return mapMenuItems as DataNode[];
  }

  const treeData = useMemo(() => (
    [{key: "root", value: "root", title: "Корінь", children: mapToTreeData(props.menuItems)}]
  ), [props.menuItems, props.selectedMenuItemId]);

  return (
    <>
      <Form.Item hidden name="_id">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item hidden name="key">
        <Input type="hidden"/>
      </Form.Item>
      <Form.Item<IUser>
        label="Назва"
        name="label"
        extra="Назва пункту меню"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Введіть назву пункту меню!"}]}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IUser>
        label="Шлях"
        name="path"
        extra="Шлях до сторінки"
        style={{marginBottom: 0}}
      >
        <Input/>
      </Form.Item>
      <Form.Item<IUser>
        label="Порядок"
        name="index"
        extra="Порядок елементу"
        style={{marginBottom: 0}}
      >
        <InputNumber min={0} style={{width: "100%"}}/>
      </Form.Item>
      <Form.Item<IUser>
        label="Батько"
        name="parent"
        extra="Пункт меню до якого належить елемент"
        style={{marginBottom: 0}}
        rules={[{required: true, message: "Виберіть позицію елементу!"}]}
      >
        <TreeSelect
          treeData={treeData}
          treeLine
        />
      </Form.Item>
    </>
  )
}
