import {IDynamicPage} from "@/entities/dynamic-page";
import {Form, Input, Space, TableColumnsType} from "antd";
import {CrudComponent} from "@/widgets/crud-component";
import {useState} from "react";
import {addDynamicPageAction, deleteDynamicPageAction, updateDynamicPageAction} from "@/entities/dynamic-page/actions/actions";
import {useRouter} from "next/navigation";

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
];

export default function DynamicPageCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IDynamicPage[]>([]);

  const create = async (data: IDynamicPage) => {
    await addDynamicPageAction({...data, _id: null} as IDynamicPage);
  }

  const update = async (data: IDynamicPage) => {
    await updateDynamicPageAction(data);
  }

  const remove = async (data: IDynamicPage[]) => {
    await deleteDynamicPageAction(data);
  }

  const refresh = () => {
    router.refresh();
  }

  const validPath = (value: string) => {
    return new Promise((resolve, reject) => {
      if (props.pages.find(x => x.path == value) != null)
        reject("unique path");

      resolve("");
    });
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
      >
        <Form.Item hidden name="_id">
          <Input type="hidden"/>
        </Form.Item>
        <Form.Item<IDynamicPage>
          label="Назва"
          name="name"
          extra="Внутрішня назва сторінки"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Введіть назву сторінки!"}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<IDynamicPage>
          label="Заголовок"
          name="title"
          extra="Заголовок сторінки"
          style={{marginBottom: 0}}
          rules={[{required: true, message: "Введіть заголовок сторінки!"}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item<IDynamicPage>
          label="Шлях"
          name="path"
          style={{marginBottom: 0}}
          rules={[
            {
              required: true,
              message: "Введіть шлях сторінки!"
            },
            {
              pattern: /^([a-z0-9-]+\/)*[a-z0-9-]+$/,
              message: "Шлях повинен містити лише a-z, 0-9, '-', та '/' між частинами (не на початку або в кінці)"
            },
            {
              validator: (_, value) => validPath(value),
              message: "Шлях має бути унікальним"
            }
          ]}
          extra="Шлях сторінки"
        >
          <Input/>
        </Form.Item>
      </CrudComponent>
    </Space>
  )
}
