import {useRouter} from "next/navigation";
import {useState} from "react";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {TableColumnsType, Tag} from "antd";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import {FormOutlined, HistoryOutlined} from "@ant-design/icons";
import {stringSorter} from "@/shared/utilities/sorters";
import {IDepartmentStaff} from "@/entities/department-staff";
import {addDepartmentStaffAction, removeDepartmentStaffAction, updateDepartmentStaffAction, exportDepartmentStaffAction, importDepartmentStaffAction, getDepartmentStaffByIdAction} from "@/entities/department-staff/actions/actions";
import DepartmentStaffCrudForm from "../department-staff-crud-form/department-staff-crud-form";

import {IPageResult} from "@/shared/types/page-query";
import {REVISION_TABLES, RevisionHistoryDrawer} from "@/features/revision-history";

interface IProps {
  result: IPageResult<IDepartmentStaff>;
}

const COLUMNS: TableColumnsType<IDepartmentStaff> = [
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
    title: "Посада",
    dataIndex: "position",
    key: "position",
    width: 200,
    sorter: (a, b) => stringSorter(a.position, b.position),
    showSorterTooltip: {
      title: "Сортування за посадою"
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
  ...timestampColumns<IDepartmentStaff>()
];

export default function DepartmentStaffCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IDepartmentStaff[]>([]);
  const [historyRecord, setHistoryRecord] = useState<IDepartmentStaff | null>(null);

  const create = async (data: IDepartmentStaff) => {
    await unwrapServerAction(addDepartmentStaffAction({...data}));
  }

  const update = async (data: IDepartmentStaff) => {
    await unwrapServerAction(updateDepartmentStaffAction({...data}));
  }

  const remove = async (data: IDepartmentStaff[]) => {
    await unwrapServerAction(removeDepartmentStaffAction(data));
  }

  const redirectToEditPage = (data?: IDepartmentStaff[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    router.push(`/admin/edit-page/department-staff/${data?.[0].path ?? selectedRows[0].path}`);
  }

  return (
    <>
      <CrudComponent<IDepartmentStaff>
        title="Співробітники кафедри"
        description="Викладачі та співробітники для списку на сайті й окремих сторінок профілів. Двічі натисніть на рядок, щоб змінити ім'я, посаду, фото й шлях, «Редагувати контент» — блоки сторінки профілю"
        columns={COLUMNS}
        fillColumns={3}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "department-staff",
          exportRecords: (params) => unwrapServerAction(exportDepartmentStaffAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importDepartmentStaffAction(file, apply)),
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        trash
        getRecord={(id) => unwrapServerAction(getDepartmentStaffByIdAction(id))}
        getRecordName={(staff) => `${staff.lastName} ${staff.firstName} ${staff.middleName}`}
        rowActions={[
          {
            key: "edit-content",
            label: "Редагувати контент",
            icon: <FormOutlined/>,
            onClick: (staff) => redirectToEditPage([staff]),
            primary: true
          },
          {
            key: "history",
            label: "Історія",
            icon: <HistoryOutlined/>,
            onClick: (record) => setHistoryRecord(record)
          }
        ]}
      >
        <DepartmentStaffCrudForm/>
      </CrudComponent>
      <RevisionHistoryDrawer
        collection="department-staff"
        recordId={historyRecord ? String(historyRecord._id) : null}
        recordName={historyRecord ? `${historyRecord.lastName} ${historyRecord.firstName}` : undefined}
        onClose={() => setHistoryRecord(null)}
        fieldLabels={REVISION_TABLES["department-staff"].fieldLabels}
        mode="record"
        onRestored={() => router.refresh()}
      />
    </>
  )
}
