import {IPublicMenuItem} from "@/entities/public-menu-item";
import {TableColumnsType} from "antd";
import {useState} from "react";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import PublicPageMenuCrudForm from "../public-page-menu-crud-form/public-page-menu-crud-form";
import {addPublicMenuItemAction, removePublicMenuItemsAction, updatePublicMenuItemAction, exportPublicMenuAction, importPublicMenuAction} from "@/entities/public-menu-item/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

import {IPageResult} from "@/shared/types/page-query";

interface IProps {
  result: IPageResult<IPublicMenuItem>;
  menuItems: IPublicMenuItem[];
}

const COLUMNS: TableColumnsType<IPublicMenuItem> = [
  {
    title: "Назва",
    dataIndex: "label",
    key: "label",
    width: 250,
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
    key: "path",
    width: 250,
  },
  ...timestampColumns<IPublicMenuItem>()
];

export default function PublicPageMenuCrud(props: IProps) {
  const [selectedRows, setSelectedRows] = useState<IPublicMenuItem[]>([]);

  const create = async (data: IPublicMenuItem) => {
    await unwrapServerAction(addPublicMenuItemAction({...data}));
  }

  const update = async (data: IPublicMenuItem) => {
    await unwrapServerAction(updatePublicMenuItemAction(data));
  }

  const remove = async (data: IPublicMenuItem[]) => {
    await unwrapServerAction(removePublicMenuItemsAction(data));
  }

  return (
    <>
      <CrudComponent<IPublicMenuItem>
        columns={COLUMNS}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "public-menu",
          exportRecords: (params) => unwrapServerAction(exportPublicMenuAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importPublicMenuAction(file, apply)),
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        getRecordName={(menuItem) => menuItem.label}
      >
        <PublicPageMenuCrudForm
          menuItems={props.menuItems}
          selectedMenuItemId={selectedRows[0] ? String(selectedRows[0]._id) : undefined}
        />
      </CrudComponent>
    </>
  )
}
