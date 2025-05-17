import {IDynamicPage} from "@/entities/dynamic-page";
import {Space, TableColumnsType} from "antd";
import {CrudComponent} from "@/widgets/crud-component";
import {useState} from "react";
import {
  addDynamicPageAction,
  removeDynamicPagesAction,
  updateDynamicPageAction
} from "@/entities/dynamic-page/actions/actions";
import {redirect, RedirectType, useRouter} from "next/navigation";
import DynamicPageCrudForm from "../dynamic-page-crud-form/dynamic-page-crud-form";
import {FormOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  pages: IDynamicPage[]
}

const COLUMNS: TableColumnsType<IDynamicPage> = [
  {
    title: "Назва",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Заголовок",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
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

export default function DynamicPageCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IDynamicPage[]>([]);

  const create = async (data: IDynamicPage) => {
    await useServerAction(addDynamicPageAction({...data, _id: null} as IDynamicPage));
  }

  const update = async (data: IDynamicPage) => {
    await useServerAction(updateDynamicPageAction(data));
  }

  const remove = async (data: IDynamicPage[]) => {
    await useServerAction(removeDynamicPagesAction(data));
  }

  const refresh = () => {
    router.refresh();
  }

  const redirectToEditPage = (data?: IDynamicPage[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    redirect(`/admin/edit/page/${data?.[0].path ?? selectedRows[0].path}`, RedirectType.push);
  }

  return (
    <Space direction="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<IDynamicPage>
        columns={COLUMNS}
        data={props.pages}
        isLoading={false}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        refresh={refresh}
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
        <DynamicPageCrudForm pages={props.pages}/>
      </CrudComponent>
    </Space>
  )
}