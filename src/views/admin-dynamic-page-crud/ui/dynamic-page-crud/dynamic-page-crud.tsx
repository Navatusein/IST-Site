import {IDynamicPage} from "@/entities/dynamic-page";
import {Space, TableColumnsType} from "antd";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import {useState} from "react";
import {addDynamicPageAction,
  removeDynamicPagesAction,
  updateDynamicPageAction, exportDynamicPagesAction, importDynamicPagesAction} from "@/entities/dynamic-page/actions/actions";
import {useRouter} from "next/navigation";
import DynamicPageCrudForm from "../dynamic-page-crud-form/dynamic-page-crud-form";
import {FormOutlined} from "@ant-design/icons";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {stringSorter} from "@/shared/utilities/sorters";

import {IPageResult} from "@/shared/types/page-query";

interface IProps {
  result: IPageResult<IDynamicPage>;
}

const COLUMNS: TableColumnsType<IDynamicPage> = [
  {
    title: "Назва",
    dataIndex: "name",
    key: "name",
    width: 200,
    sorter: (a, b) => stringSorter(a.name, b.name),
    showSorterTooltip: {
      title: "Сортування за назвою"
    }
  },
  {
    title: "Заголовок",
    dataIndex: "title",
    key: "title",
    width: 200,
    sorter: (a, b) => stringSorter(a.title, b.title),
    showSorterTooltip: {
      title: "Сортування за заголовком"
    }
  },
  {
    title: "Опис",
    dataIndex: "description",
    key: "description",
    width: 300,
    ellipsis: true,
    render: (value?: string) => value || "—"
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
    width: 250,
    sorter: (a, b) => stringSorter(a.path, b.path),
    showSorterTooltip: {
      title: "Сортування за шляхом"
    }
  },
  ...timestampColumns<IDynamicPage>()
];

export default function DynamicPageCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IDynamicPage[]>([]);

  const create = async (data: IDynamicPage) => {
    await unwrapServerAction(addDynamicPageAction({...data}));
  }

  const update = async (data: IDynamicPage) => {
    await unwrapServerAction(updateDynamicPageAction(data));
  }

  const remove = async (data: IDynamicPage[]) => {
    await unwrapServerAction(removeDynamicPagesAction(data));
  }

  const redirectToEditPage = (data?: IDynamicPage[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    router.push(`/admin/edit-page/dynamic-page/${data?.[0].path ?? selectedRows[0].path}`);
  }

  return (
    <Space orientation="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<IDynamicPage>
        columns={COLUMNS}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "dynamic-pages",
          exportRecords: (params) => unwrapServerAction(exportDynamicPagesAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importDynamicPagesAction(file, apply)),
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        getRecordName={(page) => page.name}
        additionalToolbarButtons={[
          {
            label: "Редагувати контент",
            tooltip: "Редагувати контент вибраної сторінки",
            icon: <FormOutlined/>,
            onClick: () => redirectToEditPage(),
            disabled: selectedRows.length != 1
          }
        ]}
        additionalDropdownMenuItems={[
          {
            key: "edit-content",
            label: "Редагувати контент",
            icon: <FormOutlined/>,
            onClick: (data) => redirectToEditPage(data)
          },
        ]}
      >
        <DynamicPageCrudForm/>
      </CrudComponent>
    </Space>
  )
}