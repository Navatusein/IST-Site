import {INews} from "@/entities/news";
import {Space, TableColumnsType, Tag} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import {FormOutlined} from "@ant-design/icons";
import {addNewsAction, removeNewsAction, updateNewsAction, exportNewsAction, importNewsAction} from "@/entities/news/actions/actions";
import NewsCrudForm from "../news-crud-form/news-crud-form";
import dayjs from "dayjs";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {dateStringSorter, stringSorter} from "@/shared/utilities/sorters";

import {IPageResult} from "@/shared/types/page-query";

interface IProps {
  result: IPageResult<INews>;
}

const COLUMNS: TableColumnsType<INews> = [
  {
    title: "Заголовок",
    dataIndex: "title",
    key: "title",
    width: 250,
    sorter: (a, b) => stringSorter(a.title, b.title),
    showSorterTooltip: {
      title: "Сортування за заголовком"
    }
  },
  {
    title: "Опис",
    dataIndex: "description",
    key: "description",
    width: 250,
    sorter: (a, b) => stringSorter(a.description, b.description),
    showSorterTooltip: {
      title: "Сортування за описом"
    }
  },
  {
    title: "Малюнок",
    dataIndex: "imageSlug",
    key: "imageSlug",
    width: 120,
    render: (imageSlug?: string | null) => (
      imageSlug ? <Tag color="green">Так</Tag> : <Tag color="red">Не вказано</Tag>
    )
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
    width: 200,
    sorter: (a, b) => stringSorter(a.path, b.path),
    showSorterTooltip: {
      title: "Сортування за шляхом"
    }
  },
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
    width: 115,
    render: (date: string) => (
      new Date(date).toLocaleDateString()
    ),
    sorter: (a, b) => dateStringSorter(a.date, b.date),
    showSorterTooltip: {
      title: "Сортування за датою"
    }
  },
  ...timestampColumns<INews>()
];

export default function NewsCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<INews[]>([]);

  const create = async (data: INews) => {
    await unwrapServerAction(addNewsAction({...data, date: dayjs(data.date).toISOString()}));
  }

  const update = async (data: INews) => {
    await unwrapServerAction(updateNewsAction({...data, date: dayjs(data.date).toISOString()} as INews));
  }

  const remove = async (data: INews[]) => {
    await unwrapServerAction(removeNewsAction(data));
  }

  const redirectToEditPage = (data?: INews[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    router.push(`/admin/edit-page/news/${data?.[0].path ?? selectedRows[0].path}`);
  }

  return (
    <Space orientation="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<INews>
        columns={COLUMNS}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "news",
          exportRecords: (params) => unwrapServerAction(exportNewsAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importNewsAction(file, apply)),
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        getRecordName={(news) => news.title}
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
        <NewsCrudForm/>
      </CrudComponent>
    </Space>
  )
}
