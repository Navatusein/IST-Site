import {useMemo, useState} from "react";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {Space, TableColumnsType, Tag} from "antd";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import {dateStringSorter, stringSorter} from "@/shared/utilities/sorters";
import {IDepartmentAspirant} from "@/entities/department-aspirant";
import DepartmentAspirantCrudForm from "../department-aspirant-crud-form/department-aspirant-crud-form";
import {addDepartmentAspirantAction, removeDepartmentAspirantAction, updateDepartmentAspirantAction, exportDepartmentAspirantsAction, importDepartmentAspirantsAction, getDepartmentAspirantByIdAction} from "@/entities/department-aspirant/actions/actions";
import {IDepartmentStaff} from "@/entities/department-staff";
import dayjs from "dayjs";
import formatDate from "@/shared/utilities/format-date";

import {IPageResult} from "@/shared/types/page-query";
import {useRouter} from "next/navigation";
import {REVISION_TABLES, RevisionHistoryDrawer} from "@/features/revision-history";
import {HistoryOutlined} from "@ant-design/icons";

interface IProps {
  result: IPageResult<IDepartmentAspirant>;
  departmentStaff: IDepartmentStaff[];
}

export default function DepartmentAspirantCrud(props: IProps) {
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
      width: 190,
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
        date ? <Tag color="green">{formatDate(date, "DD.MM.YYYY")}</Tag> : <Tag color="blue">Ще вчиться</Tag>
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
      width: 300,
      ellipsis: true,
      render: (id: string) => (
        departmentStaff[id]
      ),
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
    ...timestampColumns<IDepartmentAspirant>()
  ];

  const [selectedRows, setSelectedRows] = useState<IDepartmentAspirant[]>([]);
  const router = useRouter();
  const [historyRecord, setHistoryRecord] = useState<IDepartmentAspirant | null>(null);

  const create = async (data: IDepartmentAspirant) => {
    await unwrapServerAction(addDepartmentAspirantAction({...data, thesisDate: data.thesisDate ? dayjs(data.thesisDate).toISOString() : null} as unknown as IDepartmentAspirant));
  }

  const update = async (data: IDepartmentAspirant) => {
    await unwrapServerAction(updateDepartmentAspirantAction({...data, thesisDate: data.thesisDate ? dayjs(data.thesisDate).toISOString() : null} as unknown as IDepartmentAspirant));
  }

  const remove = async (data: IDepartmentAspirant[]) => {
    await unwrapServerAction(removeDepartmentAspirantAction(data));
  }

  return (
    <Space orientation="vertical" size="middle" style={{width: "100%"}}>
      <CrudComponent<IDepartmentAspirant>
        title="Аспіранти кафедри"
        description="Аспіранти, теми їхніх дисертацій і наукові керівники для списку аспірантів на сайті"
        columns={COLUMNS}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "department-aspirants",
          exportRecords: (params) => unwrapServerAction(exportDepartmentAspirantsAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importDepartmentAspirantsAction(file, apply)),
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
        getRecord={(id) => unwrapServerAction(getDepartmentAspirantByIdAction(id))}
        getRecordName={(aspirant) => `${aspirant.lastName} ${aspirant.firstName} ${aspirant.middleName}`}
      >
        <DepartmentAspirantCrudForm departmentStaff={props.departmentStaff}/>
      </CrudComponent>
      <RevisionHistoryDrawer
        collection="department-aspirants"
        recordId={historyRecord ? String(historyRecord._id) : null}
        recordName={historyRecord ? `${historyRecord.lastName} ${historyRecord.firstName}` : undefined}
        onClose={() => setHistoryRecord(null)}
        fieldLabels={REVISION_TABLES["department-aspirants"].fieldLabels}
        mode="record"
        onRestored={() => router.refresh()}
      />
    </Space>
  )
}
