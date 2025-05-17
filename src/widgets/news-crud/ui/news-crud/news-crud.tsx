import {INews} from "@/entities/news";
import {Space, TableColumnsType, Tag} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CrudComponent} from "@/widgets/crud-component";
import {FormOutlined} from "@ant-design/icons";
import {addNewsAction, removeNewsAction, updateNewsAction} from "@/entities/news/actions/actions";
import NewsCrudForm from "../news-crud-form/news-crud-form";
import dayjs from "dayjs";
import {useServerAction} from "@/shared/hooks/use-server-action";

interface IProps {
  news: INews[];
}

const COLUMNS: TableColumnsType<INews> = [
  {
    title: "Заголовок",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Опис",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Шлях до малюнка",
    dataIndex: "imagePath",
    key: "imagePath",
    render: (imagePath: string | null) => (
      imagePath ?? <Tag color="red">Шляї не вказан</Tag>
    )
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
    render: (date: string) => (
      new Date(date).toLocaleDateString()
    )
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

export default function NewsCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<INews[]>([]);

  const create = async (data: INews) => {
    await useServerAction(addNewsAction({...data, _id: null, date: dayjs(data.date).toISOString()} as INews));
  }

  const update = async (data: INews) => {
    await useServerAction(updateNewsAction({...data, date: dayjs(data.date).toISOString()} as INews));
  }

  const remove = async (data: INews[]) => {
    await useServerAction(removeNewsAction(data));
  }

  const refresh = () => {
    router.refresh();
  }

  const redirectToEditPage = (data?: INews[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    router.push(`/admin/edit/news/${data?.[0].path ?? selectedRows[0].path}`);
  }

  return (
    <Space direction="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<INews>
        columns={COLUMNS}
        data={props.news}
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
        <NewsCrudForm news={props.news}/>
      </CrudComponent>
    </Space>
  )
}
