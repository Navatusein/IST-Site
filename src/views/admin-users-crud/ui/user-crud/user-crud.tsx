import {IUser} from "@/entities/user";
import {App, TableColumnsType, Tag} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import UserCrudForm from "../user-crud-form/user-crud-form";
import {addUserAction,
  removeUsersAction,
  updateUserAction,
  updateUserPasswordAction, exportUsersAction, importUsersAction} from "@/entities/user/actions/actions";
import PasswordModal from "../password-modal/password-modal";
import {FormOutlined} from "@ant-design/icons";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {stringSorter} from "@/shared/utilities/sorters";

import {IPageResult} from "@/shared/types/page-query";

interface IProps {
  result: IPageResult<IUser>;
}

const COLUMNS: TableColumnsType<IUser> = [
  {
    title: "Логін",
    dataIndex: "login",
    key: "login",
    width: 150,
    sorter: (a, b) => stringSorter(a.login, b.login),
    showSorterTooltip: {
      title: "Сортування за логіном"
    }
  },
  {
    title: "Імя",
    dataIndex: "name",
    key: "name",
    width: 150,
    sorter: (a, b) => stringSorter(a.name, b.name),
    showSorterTooltip: {
      title: "Сортування за іменем"
    }
  },
  {
    title: "Дозволи",
    dataIndex: "permissions",
    key: "permissions",
    width: 350,
    render: (permissions: string[]) => (
      permissions.sort().map((permission) => (
        <Tag color="blue" key={permission} style={{margin: 2}}>{permission}</Tag>
      ))
    )
  },
  {
    title: "Має пароль",
    dataIndex: "passwordHash",
    key: "passwordHash",
    width: 115,
    render: (passwordHash?: string) => (
      passwordHash != null ?
        <Tag color="green">Так</Tag> :
        <Tag color="red">Ні</Tag>
    )
  },
  ...timestampColumns<IUser>()
];

export default function UserCrud(props: IProps) {
  const {notification} = App.useApp();

  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IUser[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  const create = async (data: IUser) => {
    await unwrapServerAction(addUserAction({...data}));
  }

  const update = async (data: IUser) => {
    await unwrapServerAction(updateUserAction(data));
  }

  const remove = async (data: IUser[]) => {
    await unwrapServerAction(removeUsersAction(data));
  }

  const setPassword = async (password: string) => {
    unwrapServerAction(updateUserPasswordAction(String(selectedRows[0]._id), password))
      .then(() => {
        notification.success({title: "Успішно оновлено пароль"});
        setSelectedRows([]);
        setIsPasswordModalOpen(() => false);
        router.refresh();
      })
      .catch((error) => {
        notification.error({title: "Помилка оновленя паролю", description: error.message});
      });
  }

  const openPasswordModal = () => {
    setIsPasswordModalOpen(() => true);
  }

  return (
    <>
      <CrudComponent<IUser>
        columns={COLUMNS}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "users",
          exportRecords: (params) => unwrapServerAction(exportUsersAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importUsersAction(file, apply)),
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        getRecordName={(user) => user.name}
        additionalToolbarButtons={[
          {
            label: "Змінити пароль",
            tooltip: "Змінити пароль користувача",
            icon: <FormOutlined/>,
            onClick: () => openPasswordModal(),
            disabled: selectedRows.length != 1
          }
        ]}
        additionalDropdownMenuItems={[
          {
            key: "edit-password",
            label: "Змінити пароль",
            icon: <FormOutlined/>,
            onClick: () => openPasswordModal()
          },
        ]}
      >
        <UserCrudForm/>
      </CrudComponent>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        setIsOpen={setIsPasswordModalOpen}
        username={selectedRows[0]?.name}
        setPassword={setPassword}
      />
    </>
  )
}
