import {IPublicMenuItem} from "@/entities/public-menu-item";
import {TableColumnsType} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CrudComponent} from "@/widgets/crud-component";
import PublicPageMenuCrudForm from "../public-page-menu-crud-form/public-page-menu-crud-form";
import {addPublicMenuItemAction, removePublicMenuItemsAction, updatePublicMenuItemAction} from "@/entities/public-menu-item/actions/actions";

interface IProps {
  menuItems: IPublicMenuItem[]
}

const COLUMNS: TableColumnsType<IPublicMenuItem> = [
  {
    title: "Назва",
    dataIndex: "label",
    key: "label"
  },
  {
    title: "Позиція",
    dataIndex: "index",
    key: "index",
    hidden: true,
    sorter: (a, b) => (a.index - b.index),
    sortOrder: "ascend"
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path"
  },
  {
    title: "Створено",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      new Date(date).toLocaleString()
    )
  },
  {
    title: "Оновлено",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date: string) => (
      new Date(date).toLocaleString()
    )
  }
];

export default function PublicPageMenuCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IPublicMenuItem[]>([]);

  const create = async (data: IPublicMenuItem) => {
    await addPublicMenuItemAction({...data, _id: null} as IPublicMenuItem);
  }

  const update = async (data: IPublicMenuItem) => {
    await updatePublicMenuItemAction(data);
  }

  const remove = async (data: IPublicMenuItem[]) => {
    await removePublicMenuItemsAction(data);
  }

  const refresh = () => {
    router.refresh();
  }

  return (
    <>
      <CrudComponent<IPublicMenuItem>
        columns={COLUMNS}
        data={props.menuItems}
        isLoading={false}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        refresh={refresh}
      >
        <PublicPageMenuCrudForm
          menuItems={props.menuItems}
          selectedMenuItemId={selectedRows[0]?._id as string ?? undefined}
        />
      </CrudComponent>
    </>
  )
}
