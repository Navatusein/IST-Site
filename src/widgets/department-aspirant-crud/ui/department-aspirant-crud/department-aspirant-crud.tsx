import {useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {Space, TableColumnsType, Tag} from "antd";
import {CrudComponent} from "@/widgets/crud-component";
import {dateStringSorter, stringSorter} from "@/shared/utilities/sorters";
import {IDepartmentAspirant} from "@/entities/department-aspirant";
import DepartmentAspirantCrudForm from "../department-aspirant-crud-form/department-aspirant-crud-form";
import {addDepartmentAspirantAction, removeDepartmentAspirantAction, updateDepartmentAspirantAction} from "@/entities/department-aspirant/actions/actions";
import {IDepartmentStaff} from "@/entities/department-staff";
import dayjs from "dayjs";

interface IProps {
  departmentAspirants: IDepartmentAspirant[];
  departmentStaff: IDepartmentStaff[];
}



export default function DepartmentAspirantCrud(props: IProps) {
  const router = useRouter()

  const departmentStaff = useMemo(() => {
    return props.departmentStaff.reduce<Record<string, string>>(
      (array, value) => {
        array[String(value._id)] = `${value.lastName} ${value.firstName} ${value.middleName}`;
        return array;
      }, {});
  }, [props.departmentStaff]);

  const COLUMNS: TableColumnsType<IDepartmentAspirant> = [
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
      dataIndex: "middleName",
      key: "middleName",
      width: 150,
      sorter: (a, b) => stringSorter(a.middleName, b.middleName),
      showSorterTooltip: {
        title: "Сортування за ім'ям по батькові"
      }
    },
    {
      title: "Тема",
      dataIndex: "thesisTheme",
      key: "thesisTheme",
      width: 400,
      sorter: (a, b) => stringSorter(a.thesisTheme, b.thesisTheme),
      showSorterTooltip: {
        title: "Сортування за темою"
      }
    },
    {
      title: "Дата захисту",
      dataIndex: "thesisDate",
      key: "thesisDate",
      width: 150,
      render: (date: string) => (
        date ? new Date(date).toLocaleDateString() : <Tag color="blue">Ще вчиться</Tag>
      ),
      sorter: (a, b) => dateStringSorter(a.thesisDate?.toString() ?? "", b.thesisDate?.toString() ?? ""),
      showSorterTooltip: {
        title: "Сортування за ім'ям по батькові"
      }
    },
    {
      title: "Керівник",
      dataIndex: "thesisHeadId",
      key: "thesisHeadId",
      width: 200,
      render: (id: string) => (
        departmentStaff[id]
      ),
      sorter: (a, b) => stringSorter(a.thesisHeadId.toHexString(), b.thesisHeadId.toHexString()),
      showSorterTooltip: {
        title: "Сортування за керівником"
      }
    },
    {
      title: "Шлях до малюнка",
      dataIndex: "imagePath",
      key: "imagePath",
      width: 200,
      render: (imagePath: string | null) => (
        imagePath ?? <Tag color="red">Шлях не вказан</Tag>
      )
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

  const [selectedRows, setSelectedRows] = useState<IDepartmentAspirant[]>([]);

  const create = async (data: IDepartmentAspirant) => {
    console.log(data.thesisDate)
    await useServerAction(addDepartmentAspirantAction({...data, thesisDate: data.thesisDate ? dayjs(data.thesisDate).toISOString() : undefined, _id: null}));
  }

  const update = async (data: IDepartmentAspirant) => {
    await useServerAction(updateDepartmentAspirantAction({...data, thesisDate: data.thesisDate ? dayjs(data.thesisDate).toISOString() : undefined}));
  }

  const remove = async (data: IDepartmentAspirant[]) => {
    await useServerAction(removeDepartmentAspirantAction(data));
  }

  const refresh = () => {
    router.refresh();
  }

  const search = (data: IDepartmentAspirant[], query: string): IDepartmentAspirant[] => {
    return data.filter((x) =>
      x.firstName.toLowerCase().includes(query) ||
      x.lastName.toLowerCase().includes(query) ||
      x.middleName.toLowerCase().includes(query) ||
      x.thesisTheme.toLowerCase().includes(query)
    );
  }

  return (
    <Space orientation="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<IDepartmentAspirant>
        columns={COLUMNS}
        data={props.departmentAspirants}
        isLoading={false}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        refresh={refresh}
        search={search}
      >
        <DepartmentAspirantCrudForm departmentStaff={props.departmentStaff}/>
      </CrudComponent>
    </Space>
  )
}
