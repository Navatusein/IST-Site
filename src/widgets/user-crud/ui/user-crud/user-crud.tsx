import {IUser} from "@/entities/user";
import {App, TableColumnsType, Tag} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CrudComponent} from "@/widgets/crud-component";
import UserCrudForm from "../user-crud-form/user-crud-form";
import {
  addUserAction,
  removeUsersAction,
  updateUserAction,
  updateUserPasswordAction
} from "@/entities/user/actions/actions";
import PasswordModal from "@/widgets/user-crud/ui/password-modal/password-modal";
import {FormOutlined} from "@ant-design/icons";

interface IProps {
  users: IUser[];
}

const COLUMNS: TableColumnsType<IUser> = [
  {
    title: "Логін",
    dataIndex: "login",
    key: "login"
  },
  {
    title: "Імя",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Дозволи",
    dataIndex: "permissions",
    key: "permissions",
    render: (permissions: string[]) => (
      permissions.sort().map((permission) => (
        <Tag color="blue" key={permission}>{permission}</Tag>
      ))
    )
  },
  {
    title: "Має пароль",
    dataIndex: "passwordHash",
    key: "passwordHash",
    render: (passwordHash?: string) => (
      passwordHash != null ?
        <Tag color="green">Так</Tag> :
        <Tag color="red">Ні</Tag>
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

export default function UserCrud(props: IProps) {
  const {notification} = App.useApp();

  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IUser[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  const create = async (data: IUser) => {
    await addUserAction({...data, _id: null} as IUser);
  }

  const update = async (data: IUser) => {
    await updateUserAction(data);
  }

  const remove = async (data: IUser[]) => {
    await removeUsersAction(data);
  }

  const refresh = () => {
    router.refresh();
  }

  const setPassword = async (password: string) => {
    updateUserPasswordAction(selectedRows[0]._id as string, password)
      .then(() => {
        notification.success({message: "Успішно оновлено пароль"});
        setSelectedRows(() => []);
        setIsPasswordModalOpen(() => false);

        setTimeout(() => {
          router.refresh();
        }, 500);
      })
      .catch((error) => {
        notification.error({message: "Помилка оновленя паролю", description: error.message});
      });
  }

  const openPasswordModal = () => {
    setIsPasswordModalOpen(() => true);
  }

  return (
    <>
      <CrudComponent<IUser>
        columns={COLUMNS}
        data={props.users}
        isLoading={false}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        refresh={refresh}
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
