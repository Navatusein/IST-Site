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
import {dateStringSorter, stringSorter} from "@/shared/utilities/sorters";

interface IProps {
  pages: IDynamicPage[]
}

const COLUMNS: TableColumnsType<IDynamicPage> = [
  {
    title: "Назва",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => stringSorter(a.name, b.name),
    showSorterTooltip: {
      title: "Сортування за назвою"
    }
  },
  {
    title: "Заголовок",
    dataIndex: "title",
    key: "title",
    sorter: (a, b) => stringSorter(a.title, b.title),
    showSorterTooltip: {
      title: "Сортування за заголовком"
    }
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
    sorter: (a, b) => stringSorter(a.path, b.path),
    showSorterTooltip: {
      title: "Сортування за шляхом"
    }
  },
  {
    title: "Створено",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      new Date(date).toLocaleString()
    ),
    sorter: (a, b) => dateStringSorter((a as any).createdAt, (b as any).createdAt),
    showSorterTooltip: {
      title: "Сортування за датою створення"
    }
  },
  {
    title: "Оновлено",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date: string) => (
      new Date(date).toLocaleString()
    ),
    sorter: (a, b) => dateStringSorter((a as any).updatedAt, (b as any).updatedAt),
    showSorterTooltip: {
      title: "Сортування за датою редагування"
    }
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

  const search = (data: IDynamicPage[], query: string): IDynamicPage[] => {
    return data.filter((x) => x.name.toLowerCase().includes(query) || x.title.toLowerCase().includes(query));
  }

  const redirectToEditPage = (data?: IDynamicPage[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    redirect(`/admin/edit-page/dynamic-page/${data?.[0].path ?? selectedRows[0].path}`, RedirectType.push);
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
        search={search}
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