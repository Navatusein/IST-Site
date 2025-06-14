import {useRouter} from "next/navigation";
import {useState} from "react";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {Space, TableColumnsType, Tag} from "antd";
import {CrudComponent} from "@/widgets/crud-component";
import {FormOutlined} from "@ant-design/icons";
import {dateStringSorter, stringSorter} from "@/shared/utilities/sorters";
import {ITeacher} from "@/entities/teacher";
import {addTeacherAction, removeTeacherAction, updateTeacherAction} from "@/entities/teacher/actions/actions";
import TeacherCrudForm from "../teacher-crud-form/teacher-crud-form";

interface IProps {
  teachers: ITeacher[]
}

const COLUMNS: TableColumnsType<ITeacher> = [
  {
    title: "Фамілія",
    dataIndex: "lastName",
    key: "lastName",
    width: 150,
    sorter: (a, b) => stringSorter(a.lastName, b.lastName),
    showSorterTooltip: {
      title: "Сортування за фамілією"
    }
  },
  {
    title: "Ім'я",
    dataIndex: "firstName",
    key: "firstName",
    width: 150,
    sorter: (a, b) => stringSorter(a.firstName, b.firstName),
    showSorterTooltip: {
      title: "Сортування за ім'ям"
    }
  },
  {
    title: "Ім'я по батькові",
    dataIndex: "firstName",
    key: "firstName",
    width: 150,
    sorter: (a, b) => stringSorter(a.middleName, b.middleName),
    showSorterTooltip: {
      title: "Сортування за ім'ям по батькові"
    }
  },
  {
    title: "Посада",
    dataIndex: "position",
    key: "position",
    width: 200,
    sorter: (a, b) => stringSorter(a.position, b.position),
    showSorterTooltip: {
      title: "Сортування за Посадою"
    }
  },
  {
    title: "Пошта",
    dataIndex: "email",
    key: "email",
    width: 250,
    sorter: (a, b) => stringSorter(a.email, b.email),
    showSorterTooltip: {
      title: "Сортування за поштою"
    }
  },
  {
    title: "Шлях до малюнка",
    dataIndex: "imagePath",
    key: "imagePath",
    width: 200,
    render: (imagePath: string | null) => (
      imagePath ?? <Tag color="red">Шляї не вказан</Tag>
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
    title: "Створено",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 115,
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
    width: 115,
    render: (date: string) => (
      new Date(date).toLocaleString()
    ),
    sorter: (a, b) => dateStringSorter((a as any).updatedAt, (b as any).updatedAt),
    showSorterTooltip: {
      title: "Сортування за датою редагування"
    }
  }
];

export default function TeacherCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<ITeacher[]>([]);

  const create = async (data: ITeacher) => {
    console.log(data)

    await useServerAction(addTeacherAction({...data, _id: null} as ITeacher));
  }

  const update = async (data: ITeacher) => {
    await useServerAction(updateTeacherAction({...data} as ITeacher));
  }

  const remove = async (data: ITeacher[]) => {
    await useServerAction(removeTeacherAction(data));
  }

  const refresh = () => {
    router.refresh();
  }

  const search = (data: ITeacher[], query: string): ITeacher[] => {
    return data.filter((x) =>
      x.firstName.toLowerCase().includes(query) ||
      x.lastName.toLowerCase().includes(query) ||
      x.middleName.toLowerCase().includes(query) ||
      x.position.toLowerCase().includes(query) ||
      x.email.toLowerCase().includes(query) ||
      x.path.toLowerCase().includes(query)
    );
  }

  const redirectToEditPage = (data?: ITeacher[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    router.push(`/admin/edit/teacher/${data?.[0].path ?? selectedRows[0].path}`);
  }

  return (
    <Space direction="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<ITeacher>
        columns={COLUMNS}
        data={props.teachers}
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
        <TeacherCrudForm teachers={props.teachers}/>
      </CrudComponent>
    </Space>
  )
}
