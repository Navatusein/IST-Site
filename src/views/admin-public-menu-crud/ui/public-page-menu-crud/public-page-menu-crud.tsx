import {IPublicMenuItem} from "@/entities/public-menu-item";
import {TableColumnsType} from "antd";
import {useState} from "react";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import PublicPageMenuCrudForm from "../public-page-menu-crud-form/public-page-menu-crud-form";
import {addPublicMenuItemAction, removePublicMenuItemsAction, updatePublicMenuItemAction, exportPublicMenuAction, importPublicMenuAction, getPublicMenuItemByIdAction} from "@/entities/public-menu-item/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

import {IPageResult} from "@/shared/types/page-query";
import {useRouter} from "next/navigation";
import {REVISION_TABLES, RevisionHistoryDrawer} from "@/features/revision-history";
import {HistoryOutlined} from "@ant-design/icons";

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
  const router = useRouter();
  const [historyRecord, setHistoryRecord] = useState<IPublicMenuItem | null>(null);

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
        title="Навігаційне меню"
        description="Пункти меню в шапці сайту та їхні вкладені пункти. Пункт веде на сторінку за своїм шляхом, порядок пунктів задає їхній індекс"
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
        trash
        rowActions={[
          {
            key: "history",
            label: "Історія",
            icon: <HistoryOutlined/>,
            onClick: (record) => setHistoryRecord(record)
          }
        ]}
        getRecord={(id) => unwrapServerAction(getPublicMenuItemByIdAction(id))}
        getRecordName={(menuItem) => menuItem.label}
      >
        <PublicPageMenuCrudForm menuItems={props.menuItems}/>
      </CrudComponent>
      <RevisionHistoryDrawer
        collection="public-menu"
        recordId={historyRecord ? String(historyRecord._id) : null}
        recordName={historyRecord ? historyRecord.label : undefined}
        onClose={() => setHistoryRecord(null)}
        fieldLabels={REVISION_TABLES["public-menu"].fieldLabels}
        mode="record"
        onRestored={() => router.refresh()}
      />
    </>
  )
}
